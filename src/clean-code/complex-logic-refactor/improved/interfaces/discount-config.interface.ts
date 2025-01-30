export interface DiscountConfig {
  /**
   * If `price` exceeds this threshold,
   * apply `discountRateHigh`; otherwise `discountRateLow`.
   */
  threshold: number;
  /**
   * Discount rate (as a decimal) if `price > threshold`.
   * e.g., 0.8 means "apply 20% discount".
   */
  discountRateHigh: number;
  /**
   * Discount rate (as a decimal) if `price <= threshold`.
   * e.g., 0.9 means "apply 10% discount".
   */
  discountRateLow: number;
}
