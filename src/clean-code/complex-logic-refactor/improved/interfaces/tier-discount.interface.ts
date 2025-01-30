import { PurchaseData } from "./purchase-data.interface";
import { UserInfo } from "./user.interface";

export interface ITierDiscount {
  getDiscount(userInfo: UserInfo, purchaseData: PurchaseData): PurchaseData;
}
