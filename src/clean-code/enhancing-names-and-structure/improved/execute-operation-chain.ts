import { PipelineOp } from "./types/pipeline-operation.type";

//allows operations in any order: map => filter => map for example
export function executeOperationChain(
  numbers: number[],
  operations: PipelineOp[],
): number[] {
  return operations.reduce((arr, operation) => {
    return operation.type === "filter"
      ? arr.filter(operation.fn)
      : arr.map(operation.fn);
  }, numbers);
}
