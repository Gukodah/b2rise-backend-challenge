import { DiscountConfig } from "./interfaces/discount-config.interface";

export const PREMIUM_CONFIG: DiscountConfig = {
  threshold: 100,
  discountRateHigh: 0.8, // 20% discount
  discountRateLow: 0.9, // 10% discount
};

export const REGULAR_CONFIG: DiscountConfig = {
  threshold: 100,
  discountRateHigh: 0.9, // 10% discount
  discountRateLow: 1.0, // 0% discount (no discount)
};
