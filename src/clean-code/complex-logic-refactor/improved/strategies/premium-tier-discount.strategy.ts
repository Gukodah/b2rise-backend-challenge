import { DiscountConfig } from "../interfaces/discount-config.interface";
import { PurchaseData } from "../interfaces/purchase-data.interface";
import { ITierDiscount } from "../interfaces/tier-discount.interface";
import { UserInfo } from "../interfaces/user.interface";

export class PremiumTierDiscount implements ITierDiscount {
  constructor(private config: DiscountConfig) {}

  public getDiscount(
    userInfo: UserInfo,
    purchaseData: PurchaseData,
  ): PurchaseData {
    // example validation
    if (purchaseData.price < 0) {
      throw new Error("Price cannot be negative.");
    }

    const { threshold, discountRateHigh, discountRateLow } = this.config;

    const finalPrice =
      purchaseData.price > threshold
        ? purchaseData.price * discountRateHigh
        : purchaseData.price * discountRateLow;

    return {
      ...purchaseData,
      price: finalPrice,
    };
  }
}
