import { getTierDiscount } from "./factories/tier-discount.factory";
import { PurchaseData } from "./interfaces/purchase-data.interface";
import { UserInfo } from "./interfaces/user.interface";

export function calculatePurchase(
  userInfo: UserInfo,
  purchaseData: PurchaseData,
): PurchaseData {
  const discountStrategy = getTierDiscount(userInfo.tier);
  return discountStrategy.getDiscount(userInfo, purchaseData);
}
