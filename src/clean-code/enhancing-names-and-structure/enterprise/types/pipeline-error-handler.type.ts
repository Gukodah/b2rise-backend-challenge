import { PipelineError } from "../interfaces/pipeline-error.interface";

export type PipelineErrorHandlerType = (
  error: PipelineError,
) => void | "continue" | "break";
