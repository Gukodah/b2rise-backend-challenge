import { doubleNumber, isEven } from "./basic";

export function transformNumbers(
  numbers: number[],
  //Accepts any filter function
  filterPredicate: (num: number) => boolean = () => true,
  //Accepts any map function
  transformOperator: (num: number) => number = (e) => e,
): number[] {
  return numbers.filter(filterPredicate).map(transformOperator);
}
