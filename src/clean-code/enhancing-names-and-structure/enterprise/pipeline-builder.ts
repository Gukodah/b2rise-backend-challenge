import { PipelineError } from "./interfaces/pipeline-error.interface";
import { PipelineMetrics } from "./interfaces/pipeline-metrics.interface";
import { PipelineErrorHandlerType } from "./types/pipeline-error-handler.type";
import { PipelineOperationType } from "./types/pipeline-operation-type.type";
import { PipelineType } from "./types/pipeline-operation.type";

export class PipelineBuilder {
  private operations: Array<PipelineType<PipelineOperationType>> = [];
  private errorHandler: PipelineErrorHandlerType[] = [];
  private static operationRegistry: Record<
    string,
    PipelineType<PipelineOperationType>
  > = {};

  static registerOperation<T extends PipelineOperationType>(
    operation: PipelineType<T>,
  ) {
    if (this.operationRegistry[operation.name]) {
      throw new Error(`Operation ${operation.name} already registered`);
    }
    this.operationRegistry[operation.name] = operation;
  }

  constructor(private numbers: number[]) {}

  addOperation(name: string): PipelineBuilder {
    const operation = PipelineBuilder.operationRegistry[name];
    if (!operation) {
      throw new Error(`Operation ${name} not registered in registry`);
    }
    this.operations.push(operation);
    return this;
  }

  addFilter(name: string): PipelineBuilder {
    const op = PipelineBuilder.operationRegistry[name];
    if (op?.type !== "filter") {
      throw new Error(`${name} is not a registered filter operation`);
    }
    this.operations.push(op);
    return this;
  }

  addMap(name: string): PipelineBuilder {
    const op = PipelineBuilder.operationRegistry[name];
    if (op?.type !== "map") {
      throw new Error(`${name} is not a registered map operation`);
    }
    this.operations.push(op);
    return this;
  }

  withErrorHandler(handler: PipelineErrorHandlerType): PipelineBuilder {
    this.errorHandler.push(handler);
    return this;
  }

  private handleError(error: PipelineError): boolean {
    let shouldContinue = true;
    for (const handler of this.errorHandler) {
      const result = handler(error);
      if (result === "break") shouldContinue = false;
      if (result === "continue") shouldContinue = true;
    }
    return shouldContinue;
  }

  async execute(): Promise<{
    result: number[];
    metrics: PipelineMetrics;
    errors: PipelineError[];
  }> {
    const startTime = performance.now();
    let currentArray = [...this.numbers];
    const metrics: PipelineMetrics = {
      totalTime: 0,
      operationMetrics: [],
    };
    const errors: PipelineError[] = [];

    try {
      for (const operation of this.operations) {
        const opStart = performance.now();
        const inputCount = currentArray.length;

        try {
          if (operation.type === "filter") {
            currentArray = currentArray.filter(
              operation.fn as (n: number) => boolean,
            );
          } else {
            currentArray = currentArray.map(
              operation.fn as (n: number) => number,
            );
          }
        } catch (error) {
          const pipelineError: PipelineError = {
            operationName: operation.name,
            error,
            timestamp: new Date(),
            input: [...currentArray],
          };
          errors.push(pipelineError);
          const shouldContinue = this.handleError(pipelineError);
          if (!shouldContinue) break;
        }

        metrics.operationMetrics.push({
          name: operation.name,
          type: operation.type,
          duration: performance.now() - opStart,
          inputCount,
          outputCount: currentArray.length,
        });
      }
    } finally {
      metrics.totalTime = performance.now() - startTime;
    }

    return {
      result: currentArray,
      metrics,
      errors,
    };
  }
}
