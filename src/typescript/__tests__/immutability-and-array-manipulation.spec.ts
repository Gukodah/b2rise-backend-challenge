import { immutabilityAndArrayManipulation } from "./../immutability-and-array-manipulation";

const { makeAllPositive, numbersArrayIsEmptyWarnMessage } =
  immutabilityAndArrayManipulation;

describe("1.3 Imutabilidade e Manipulação de Arrays", () => {
  test("converts mixed positive/negative numbers to absolute values", () => {
    const input = [1, -2, 3, -4.5, 0];
    const expected = [1, 2, 3, 4.5, 0];
    const result = makeAllPositive(input);
    expect(result).toEqual(expected);
    expect(input).not.toBe(result); // Immutability check
  });

  test("returns empty array and warns when input is empty", () => {
    const consoleSpy = jest.spyOn(console, "warn");
    const result = makeAllPositive([]);
    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(numbersArrayIsEmptyWarnMessage());
    consoleSpy.mockRestore();
  });

  test("converts all negative numbers to positive", () => {
    const input = [-5, -3.14, -Number.MAX_VALUE];
    const expected = [5, 3.14, Number.MAX_VALUE];
    expect(makeAllPositive(input)).toEqual(expected);
  });

  test("leaves already positive numbers unchanged", () => {
    const input = [1, 2, 3, 4.5, Number.MAX_SAFE_INTEGER];
    const expected = [...input];
    const result = makeAllPositive(input);
    expect(result).toEqual(expected);
    expect(input).not.toBe(result); // Immutability check
  });

  test("handles zero values correctly", () => {
    const input = [0, -0, 0.0];
    const expected = [0, 0, 0];
    expect(makeAllPositive(input)).toEqual(expected);
  });

  test("works with single-element arrays", () => {
    expect(makeAllPositive([-42])).toEqual([42]);
    expect(makeAllPositive([0])).toEqual([0]);
    expect(makeAllPositive([3.14])).toEqual([3.14]);
  });

  test("handles large numbers correctly", () => {
    const input = [Number.MIN_SAFE_INTEGER, -Number.MAX_VALUE];
    const expected = [Math.abs(Number.MIN_SAFE_INTEGER), Number.MAX_VALUE];
    expect(makeAllPositive(input)).toEqual(expected);
  });

  test("handles floating point numbers", () => {
    const input = [-3.14, 2.718, -0.5];
    const expected = [3.14, 2.718, 0.5];
    expect(makeAllPositive(input)).toEqual(expected);
  });

  test("does not modify the original array", () => {
    const original = [1, -2, 3];
    const copy = [...original];
    makeAllPositive(original);
    expect(original).toEqual(copy);
  });

  test("handles special number values", () => {
    const input = [NaN, Infinity, -Infinity];
    const expected = [NaN, Infinity, Infinity];
    const result = makeAllPositive(input);
    expect(result).toEqual(expected);
  });
});
