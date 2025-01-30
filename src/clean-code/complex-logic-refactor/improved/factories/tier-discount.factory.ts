import { PREMIUM_CONFIG, REGULAR_CONFIG } from "../discount-config-data";
import { Tier } from "../enums/tier.enum";
import { ITierDiscount } from "../interfaces/tier-discount.interface";
import { PremiumTierDiscount } from "../strategies/premium-tier-discount.strategy";
import { RegularTierDiscount } from "../strategies/regular-tier-discount.strategy";

export function getTierDiscount(tier: Tier): ITierDiscount {
  switch (tier) {
    case Tier.Premium:
      return new PremiumTierDiscount(PREMIUM_CONFIG);
    case Tier.Regular:
    default:
      return new RegularTierDiscount(REGULAR_CONFIG);
  }
}
