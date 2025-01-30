import { doubleNumber, isEven } from "../basic";
import { FilterFn } from "./types/filter-fn.types";
import { MapFn } from "./types/map-fn.type";

export function processNumberPipeline(
  numbers: number[],
  //can apply any fn that respect FilterFn type
  filterFns: FilterFn[] = [],
  //can apply any fn that respect MapFn type
  mapFns: MapFn[] = [],
): number[] {
  //filter chain
  const filtered = filterFns.reduce(
    (arr, filter) => arr.filter(filter),
    numbers,
  );
  //map chain
  return mapFns.reduce((arr, mapper) => arr.map(mapper), filtered);
}
