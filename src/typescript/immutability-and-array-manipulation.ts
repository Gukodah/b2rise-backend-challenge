const numbersArrayIsEmptyWarnMessage = () => "Numbers array is empty";

const makeAllPositive = (numbers: Array<number>) => {
  if (numbers.length === 0) {
    console.warn(numbersArrayIsEmptyWarnMessage());
    return [];
  }

  return numbers.map((num) => Math.abs(num));
};

export const immutabilityAndArrayManipulation = {
  makeAllPositive,
  numbersArrayIsEmptyWarnMessage,
};
