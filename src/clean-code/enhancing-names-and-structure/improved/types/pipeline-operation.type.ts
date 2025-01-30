import { FilterFn } from "./filter-fn.types";
import { MapFn } from "./map-fn.type";

export type PipelineOp =
  | { type: "filter"; fn: FilterFn }
  | { type: "map"; fn: MapFn };
