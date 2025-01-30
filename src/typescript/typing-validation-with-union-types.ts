const inputValuesTooLargeErrorMessage = () =>
  `Input values are too large and may cause overflow`;

const inputValuesTooSmallErrorMessage = () =>
  `Input values are too small and may cause overflow`;

const resultValueTooLargeErrorMessage = () =>
  `Result is too large and caused overflow`;

const resultValueTooSmallErrorMessage = () =>
  `Result is too small and caused overflow`;

const operationNotSupportedErrorMessage = () => "Operation not supported";

const cannotDivideByZeroErrorMessage = () => "Cannot divide by 0";

export type OperationType = "add" | "subtract" | "multiply" | "divide";

function resultAssertion(result: number) {
  if (
    result === Infinity ||
    result === Infinity ||
    Math.abs(result) > Number.MAX_VALUE
  ) {
    throw new Error(resultValueTooLargeErrorMessage());
  }

  if (result !== 0 && Math.abs(result) < Number.MIN_VALUE) {
    throw new Error(resultValueTooSmallErrorMessage());
  }
}

function calculate(operation: OperationType, value1: number, value2: number) {
  if (
    Math.abs(value1) > Number.MAX_VALUE ||
    Math.abs(value2) > Number.MAX_VALUE
  ) {
    throw new Error(inputValuesTooLargeErrorMessage());
  }

  if (
    (value1 !== 0 && Math.abs(value1) < Number.MIN_VALUE) ||
    (value2 !== 0 && Math.abs(value2) < Number.MIN_VALUE)
  ) {
    throw new Error(inputValuesTooSmallErrorMessage());
  }

  let result: number;

  switch (operation.trim()) {
    case "add":
      result = value1 + value2;

      resultAssertion(result);

      return result;
    case "subtract":
      result = value1 - value2;

      resultAssertion(result);

      return result;
    case "multiply":
      result = value1 * value2;

      resultAssertion(result);

      return result;
    case "divide":
      if (value2 === 0) {
        throw new Error(cannotDivideByZeroErrorMessage());
      }

      result = value1 / value2;

      resultAssertion(result);

      return result;
    default:
      throw new Error(operationNotSupportedErrorMessage());
  }
}

export const typingValidationWithUnionTypes = {
  calculate,
  inputValuesTooLargeErrorMessage,
  inputValuesTooSmallErrorMessage,
  resultValueTooLargeErrorMessage,
  resultValueTooSmallErrorMessage,
  operationNotSupportedErrorMessage,
  cannotDivideByZeroErrorMessage,
};
