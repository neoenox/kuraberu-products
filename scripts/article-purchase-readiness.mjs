import {
  isAmazonProductDetailUrl,
  isVerifiedRakutenPurchaseDestination,
} from "../config/runtime-env.mjs";

const CTA_ENABLED_STATUSES = new Set(["verified", "direct"]);

const AMAZON_PRODUCT_DETAIL_ASIN_PATTERN =
  /^https:\/\/(?:www\.)?amazon\.co\.jp\/dp\/([a-z0-9]{10})(?:[/?#]|$)/i;

function isJstDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

function evidenceIncludesAsin(evidence, asin) {
  return (
    typeof evidence === "string" &&
    evidence.trim() !== "" &&
    evidence.toUpperCase().includes(asin)
  );
}

/**
 * Amazon の unavailable は、検索で見つからないだけでは設定できない。
 * 公式の商品別適格性表示またはリンク生成UIの明示拒否と、同じASINを
 * 商品詳細ページ・照会結果・確認記録の3点で突き合わせる。
 */
export function getAmazonUnavailableEvidenceErrors(manifest, articleId) {
  const amazon = manifest?.amazon;
  if (!amazon) return [];

  const errors = [];
  for (const side of ["left", "right"]) {
    const status = amazon.statusBySide?.[side] ?? amazon.status;
    if (status !== "unavailable") continue;

    const sideEvidence = amazon.browserEvidence?.bySide?.[side];
    const unavailableEvidence = sideEvidence?.unavailableEvidence;
    const productPageUrl = amazon.productPages?.[side] ?? amazon[side];
    const asinMatch =
      typeof productPageUrl === "string"
        ? AMAZON_PRODUCT_DETAIL_ASIN_PATTERN.exec(productPageUrl)
        : null;
    const pageAsin = asinMatch?.[1]?.toUpperCase();

    if (!pageAsin) {
      errors.push(
        `${articleId}: Amazon ${side} unavailable requires a confirmed Amazon product-detail URL containing a 10-character ASIN`,
      );
      continue;
    }

    if (
      !unavailableEvidence ||
      typeof unavailableEvidence !== "object" ||
      !["item-ineligible", "official-link-builder-refused"].includes(
        unavailableEvidence.reason,
      )
    ) {
      errors.push(
        `${articleId}: Amazon ${side} unavailable requires direct item-level evidence; missing search results or an unverified check are not proof`,
      );
      continue;
    }

    if (
      typeof unavailableEvidence.asin !== "string" ||
      unavailableEvidence.asin.toUpperCase() !== pageAsin ||
      !isJstDate(unavailableEvidence.observedAtJst) ||
      !isJstDate(manifest.researchDateJst) ||
      unavailableEvidence.observedAtJst > manifest.researchDateJst
    ) {
      errors.push(
        `${articleId}: Amazon ${side} unavailable ASIN must match the confirmed Amazon product page and include a valid observedAtJst date`,
      );
      continue;
    }

    const productMatch = sideEvidence.productMatch;
    if (
      productMatch?.state !== "verified" ||
      !evidenceIncludesAsin(productMatch.evidence, pageAsin)
    ) {
      errors.push(
        `${articleId}: Amazon ${side} unavailable requires a verified product match that records the same ASIN`,
      );
      continue;
    }

    if (unavailableEvidence.reason === "item-ineligible") {
      const eligibility = sideEvidence.eligibility;
      if (
        unavailableEvidence.source !== "associates-eligibility-ui" ||
        eligibility?.state !== "ineligible" ||
        !evidenceIncludesAsin(eligibility.evidence, pageAsin) ||
        !/(対象外|not eligible|ineligible)/i.test(eligibility.evidence)
      ) {
        errors.push(
          `${articleId}: Amazon ${side} unavailable requires the official Associates UI to explicitly mark the matching ASIN ineligible`,
        );
      }
      continue;
    }

    const taggedUrl = sideEvidence.taggedUrl;
    if (
      unavailableEvidence.source !== "associates-link-builder-ui" ||
      taggedUrl?.state !== "refused" ||
      !evidenceIncludesAsin(taggedUrl.evidence, pageAsin) ||
      !/(拒否|refus(?:ed|al))/i.test(taggedUrl.evidence)
    ) {
      errors.push(
        `${articleId}: Amazon ${side} unavailable requires an explicit refusal for the matching ASIN from the official link builder; transient failures remain unverified or search`,
      );
    }
  }

  return errors;
}

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
