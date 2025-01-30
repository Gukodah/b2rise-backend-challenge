export interface Item {
  name: string;
  price: number;
}

export function logExpensiveItems(items: Item[], minExpensivePrice: number) {
  items
    .filter((item) => item.price > minExpensivePrice)
    .forEach((item) => console.log(`${item.name} is expensive`));
}
