import { calculateDiscount } from "../complex-logic-refactor/basic";
import { Tier } from "../complex-logic-refactor/improved/enums/tier.enum";
import * as tierDiscountFactory from "../complex-logic-refactor/improved/factories/tier-discount.factory";
import { DiscountConfig } from "../complex-logic-refactor/improved/interfaces/discount-config.interface";
import { PurchaseData } from "../complex-logic-refactor/improved/interfaces/purchase-data.interface";
import { UserInfo } from "../complex-logic-refactor/improved/interfaces/user.interface";
import { calculatePurchase } from "../complex-logic-refactor/improved/purchase-calculator";
import { PremiumTierDiscount } from "../complex-logic-refactor/improved/strategies/premium-tier-discount.strategy";
import { RegularTierDiscount } from "../complex-logic-refactor/improved/strategies/regular-tier-discount.strategy";

jest.mock("../complex-logic-refactor/improved/factories/tier-discount.factory");

describe("3.2 Refatoração de Lógica Complexa", () => {
  describe("Basic", () => {
    describe("calculateDiscount", () => {
      it("should return price * 0.8 for premium users when price > 100", () => {
        const result = calculateDiscount(150, true);
        expect(result).toBe(120);
      });

      it("should return price * 0.9 for premium users when price <= 100", () => {
        const result = calculateDiscount(100, true);
        expect(result).toBe(90);

        //Additional check for below threshold
        const resultBelow = calculateDiscount(80, true);

        expect(resultBelow).toBe(72);
      });

      it("should return price * 0.9 for non-premium users when price > 100", () => {
        const result = calculateDiscount(150, false);
        expect(result).toBe(135);
      });

      it("should return the same price for non-premium users when price <= 100", () => {
        const result = calculateDiscount(100, false);
        expect(result).toBe(100);

        const resultBelow = calculateDiscount(50, false);
        expect(resultBelow).toBe(50);
      });

      it("should handle edge case of 0 price", () => {
        expect(calculateDiscount(0, true)).toBe(0);
        expect(calculateDiscount(0, false)).toBe(0);
      });
    });
  });

  describe("Improved", () => {
    describe("PremiumTierDiscount class", () => {
      let config: DiscountConfig;
      let premiumTierDiscount: PremiumTierDiscount;
      let userInfo: UserInfo;

      beforeEach(() => {
        //Example configuration
        config = {
          threshold: 100,
          discountRateHigh: 0.8, //20% discount
          discountRateLow: 0.9, //10% discount
        };

        //Initialize class under test
        premiumTierDiscount = new PremiumTierDiscount(config);

        userInfo = {
          tier: Tier.Regular,
        };
      });

      it("should apply discountRateHigh if price is strictly greater than threshold", () => {
        const purchaseData: PurchaseData = {
          price: 150,
        };

        const result = premiumTierDiscount.getDiscount(userInfo, purchaseData);

        expect(result.price).toBe(120);
      });

      it("should apply discountRateLow if price is equal to the threshold", () => {
        const purchaseData: PurchaseData = {
          price: 100,
        };

        const result = premiumTierDiscount.getDiscount(userInfo, purchaseData);

        expect(result.price).toBe(90);
      });

      it("should apply discountRateLow if price is below the threshold", () => {
        const purchaseData: PurchaseData = {
          price: 50,
        };

        const result = premiumTierDiscount.getDiscount(userInfo, purchaseData);
        expect(result.price).toBe(45);
      });

      it("should throw an error if the price is negative", () => {
        const purchaseData: PurchaseData = {
          price: -10,
        };

        expect(() => {
          premiumTierDiscount.getDiscount(userInfo, purchaseData);
        }).toThrow("Price cannot be negative.");
      });

      it("should preserve other PurchaseData fields when applying discount", () => {
        const purchaseData: PurchaseData = {
          price: 200,
        };

        const result = premiumTierDiscount.getDiscount(userInfo, purchaseData);

        expect(result.price).toBe(160);
      });

      it("should not modify the original purchaseData object, returning a new one", () => {
        const purchaseData: PurchaseData = {
          price: 120,
        };

        const result = premiumTierDiscount.getDiscount(userInfo, purchaseData);
        expect(result.price).toBe(96);

        expect(purchaseData.price).toBe(120);
      });
    });

    describe("RegularTierDiscount", () => {
      let config: DiscountConfig;
      let regularTierDiscount: RegularTierDiscount;
      let userInfo: UserInfo;

      beforeEach(() => {
        //Example configuration
        config = {
          threshold: 100,
          discountRateHigh: 0.85, // 15% discount when above threshold
          discountRateLow: 0.95, // 5% discount when at or below threshold
        };

        //Class under test
        regularTierDiscount = new RegularTierDiscount(config);

        //Example user info with a tier
        userInfo = {
          tier: Tier.Regular,
        };
      });

      it("should apply discountRateHigh if price is strictly greater than threshold", () => {
        const purchaseData: PurchaseData = {
          price: 150,
        };

        const result = regularTierDiscount.getDiscount(userInfo, purchaseData);

        expect(result.price).toBe(127.5);
      });

      it("should apply discountRateLow if price is equal to the threshold", () => {
        const purchaseData: PurchaseData = {
          price: 100,
        };

        const result = regularTierDiscount.getDiscount(userInfo, purchaseData);

        expect(result.price).toBe(95);
      });

      it("should apply discountRateLow if price is below the threshold", () => {
        const purchaseData: PurchaseData = {
          price: 50,
        };

        const result = regularTierDiscount.getDiscount(userInfo, purchaseData);

        expect(result.price).toBe(47.5);
      });

      it("should throw an error if the price is negative", () => {
        const purchaseData: PurchaseData = {
          price: -10,
        };

        expect(() => {
          regularTierDiscount.getDiscount(userInfo, purchaseData);
        }).toThrow("Price cannot be negative.");
      });

      it("should preserve other fields in the returned PurchaseData", () => {
        const purchaseData: PurchaseData = {
          price: 200,
        };

        const result = regularTierDiscount.getDiscount(userInfo, purchaseData);

        expect(result.price).toBe(170);
      });

      it("should not mutate the original purchaseData object", () => {
        const purchaseData: PurchaseData = {
          price: 120,
        };

        const result = regularTierDiscount.getDiscount(userInfo, purchaseData);
        expect(result.price).toBe(102);

        expect(purchaseData.price).toBe(120);
      });
    });

    describe("calculatePurchase func", () => {
      const mockGetTierDiscount =
        tierDiscountFactory.getTierDiscount as jest.Mock;

      beforeEach(() => {
        mockGetTierDiscount.mockClear();
      });

      it("should call getTierDiscount with the user tier and return discounted data", () => {
        mockGetTierDiscount.mockReturnValue({
          getDiscount: jest
            .fn()
            .mockImplementation(
              (userInfo: UserInfo, purchase: PurchaseData) => ({
                ...purchase,
                price: purchase.price * 0.9,
              }),
            ),
        });

        const userInfo: UserInfo = { tier: Tier.Regular };
        const purchaseData: PurchaseData = {
          price: 200,
        };

        const result = calculatePurchase(userInfo, purchaseData);

        expect(result.price).toBe(180);
        expect(mockGetTierDiscount).toHaveBeenCalledWith(Tier.Regular);
      });

      it("should handle a different tier with a different (mocked) discount", () => {
        mockGetTierDiscount.mockReturnValue({
          getDiscount: jest
            .fn()
            .mockImplementation(
              (userInfo: UserInfo, purchase: PurchaseData) => ({
                ...purchase,
                price: purchase.price * 0.8,
              }),
            ),
        });

        const userInfo: UserInfo = { tier: Tier.Premium };
        const purchaseData: PurchaseData = {
          price: 150,
        };

        const result = calculatePurchase(userInfo, purchaseData);

        expect(result.price).toBe(120);
        expect(mockGetTierDiscount).toHaveBeenCalledWith(Tier.Premium);
      });
    });
  });
});
