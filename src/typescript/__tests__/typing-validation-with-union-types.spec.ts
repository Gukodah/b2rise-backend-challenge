import { typingValidationWithUnionTypes } from "./../typing-validation-with-union-types";
import { OperationType } from "./../typing-validation-with-union-types";

const {
  calculate,
  inputValuesTooLargeErrorMessage,
  inputValuesTooSmallErrorMessage,
  resultValueTooLargeErrorMessage,
  resultValueTooSmallErrorMessage,
  cannotDivideByZeroErrorMessage,
  operationNotSupportedErrorMessage,
} = typingValidationWithUnionTypes;

// Shared values
const MAX_VALUE = Number.MAX_VALUE;
const MIN_VALUE = Number.MIN_VALUE;

describe("1.2 Validação e Tipagem com Union Types", () => {
  // Test valid operations
  describe("basic arithmetic operations", () => {
    test.each([
      ["add", 2, 3, 5],
      ["subtract", 5, 3, 2],
      ["multiply", 4, 3, 12],
      ["divide", 10, 2, 5],
      ["add", 10, 5, 15],
    ])("%s with normal numbers", (operation, a, b, expected) => {
      expect(calculate(operation as OperationType, a, b)).toBe(expected);
    });
  });

  // Test input validation
  describe("input validation", () => {
    test("throws input overflow for values exceeding MAX_VALUE", () => {
      expect(() => calculate("add", MAX_VALUE * 1.1, 0)).toThrow(
        inputValuesTooLargeErrorMessage(),
      );
      expect(() => calculate("add", 0, MAX_VALUE * 1.1)).toThrow(
        inputValuesTooLargeErrorMessage(),
      );
    });

    test("allows boundary values (MAX_VALUE and MIN_VALUE)", () => {
      expect(() => calculate("add", MAX_VALUE, 0)).not.toThrow(
        inputValuesTooLargeErrorMessage(),
      );
      expect(() => calculate("add", MIN_VALUE, 0)).not.toThrow(
        inputValuesTooSmallErrorMessage(),
      );
    });
  });

  // Test result validation
  describe("result validation", () => {
    test("throws result overflow for excessive results", () => {
      expect(() => calculate("multiply", MAX_VALUE, 2)).toThrow(
        resultValueTooLargeErrorMessage(),
      );
      expect(() => calculate("add", MAX_VALUE, MAX_VALUE)).toThrow(
        resultValueTooLargeErrorMessage(),
      );
    });

    test("allows zero results", () => {
      expect(() => calculate("subtract", 5, 5)).not.toThrow(
        inputValuesTooSmallErrorMessage(),
      );
    });
  });

  // Test special cases
  describe("special cases", () => {
    test("throws division by zero error", () => {
      expect(() => calculate("divide", 5, 0)).toThrow(
        cannotDivideByZeroErrorMessage(),
      );
    });

    test("throws unsupported operation error", () => {
      expect(() => calculate("power" as OperationType, 2, 3)).toThrow(
        operationNotSupportedErrorMessage(),
      );
    });

    test("handles whitespace in operation name", () => {
      //@ts-ignore
      expect(calculate("  add  ", 2, 3)).toBe(5);
    });

    test("handles negative numbers", () => {
      expect(calculate("add", -5, 3)).toBe(-2);
      expect(calculate("multiply", -4, 3)).toBe(-12);
    });
  });

  describe("edge cases", () => {
    test("handles maximum safe integer", () => {
      expect(calculate("add", Number.MAX_SAFE_INTEGER, 1)).toBe(
        Number.MAX_SAFE_INTEGER + 1,
      );
    });

    test("handles minimum safe integer", () => {
      expect(calculate("subtract", Number.MIN_SAFE_INTEGER, 1)).toBe(
        Number.MIN_SAFE_INTEGER - 1,
      );
    });

    test("handles floating-point precision", () => {
      expect(calculate("add", 0.1, 0.2)).toBeCloseTo(0.3);
    });
  });
});
