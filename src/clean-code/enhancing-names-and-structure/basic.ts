export function isEven(num: number): boolean {
  return num % 2 === 0;
}

export function doubleNumber(num: number): number {
  return num * 2;
}

export function getDoubledEvens(numbers: number[]): number[] {
  return numbers.filter(isEven).map(doubleNumber);
}
