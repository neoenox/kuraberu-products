import {
  isAmazonProductDetailUrl,
  isVerifiedRakutenPurchaseDestination,
} from "../config/runtime-env.mjs";

const CTA_ENABLED_STATUSES = new Set(["verified", "direct"]);

export function hasVerifiedPurchaseDestination({
  amazonStatus,
  amazonUrl,
  rakutenStatus,
  rakutenUrl,
}) {
  const amazonReady =
    CTA_ENABLED_STATUSES.has(amazonStatus) &&
    isAmazonProductDetailUrl(amazonUrl);
  const rakutenReady =
    CTA_ENABLED_STATUSES.has(rakutenStatus) &&
    isVerifiedRakutenPurchaseDestination(rakutenUrl);

  return amazonReady || rakutenReady;
}
