import { PipelineOperationType } from "../types/pipeline-operation-type.type";

export interface PipelineMetrics {
  totalTime: number;
  operationMetrics: Array<{
    name: string;
    type: PipelineOperationType;
    duration: number;
    inputCount: number;
    outputCount: number;
  }>;
}
