export function calculateDiscount(price: number, isPremium: boolean): number {
  if (isPremium) {
    return price > 100 ? price * 0.8 : price * 0.9;
  }

  return price > 100 ? price * 0.9 : price;
}
