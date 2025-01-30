import { PipelineOperationType } from "./pipeline-operation-type.type";

export type PipelineType<T extends PipelineOperationType> = {
  type: T;
  name: string;
  fn: T extends "filter" ? (num: number) => boolean : (num: number) => number;
};
