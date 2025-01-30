import { Item, logExpensiveItems } from "../code-refactor";

describe("3.1 Refatoração de Código", () => {
  beforeEach(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    (console.log as jest.Mock).mockRestore();
  });

  test("should log expensive items when price is greater than minExpensivePrice", () => {
    const items: Item[] = [
      { name: "Item1", price: 50 },
      { name: "Item2", price: 150 },
      { name: "Item3", price: 200 },
    ];
    const minExpensivePrice = 100;

    logExpensiveItems(items, minExpensivePrice);

    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenCalledWith("Item2 is expensive");
    expect(console.log).toHaveBeenCalledWith("Item3 is expensive");
  });

  test("should not log anything if no items are more expensive than minExpensivePrice", () => {
    const items: Item[] = [
      { name: "Cheap1", price: 10 },
      { name: "Cheap2", price: 20 },
    ];
    const minExpensivePrice = 30;

    logExpensiveItems(items, minExpensivePrice);

    expect(console.log).not.toHaveBeenCalled();
  });

  test("should work with an empty items array", () => {
    const items: Item[] = [];
    const minExpensivePrice = 100;

    logExpensiveItems(items, minExpensivePrice);

    expect(console.log).not.toHaveBeenCalled();
  });
});
