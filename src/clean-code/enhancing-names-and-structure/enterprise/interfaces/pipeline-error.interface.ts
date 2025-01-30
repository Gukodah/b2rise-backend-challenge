export interface PipelineError {
  operationName: string;
  error: unknown;
  timestamp: Date;
  input: number[];
}
