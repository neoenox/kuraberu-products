/** Historical pages that intentionally retain the compatibility renderer. */
export const LEGACY_ARTICLE_PAGE_SLUGS = new Set([]);

/** Purpose-built non-comparison pages that are not article comparison templates. */
export const CUSTOM_ARTICLE_PAGE_SLUGS = new Set([
  "panasonic-baby-monitor-kx-hc705",
  "panasonic-eh-na9m-guide",
]);

/** 公開記事は品質ゲート通過後に個別追加する。未検証記事は公開しない。 */
export const PUBLISHED_ARTICLE_PAGE_SLUGS = new Set([
  "garmin-forerunner-570-vs-coros-pace-4",
  "tp-link-archer-be550-vs-be450",
  "jbl-flip-7-vs-charge-6",
  "anker-a121a-vs-a2688",
  "anker-a1664-vs-a1654",
  "crucial-x10-pro-vs-kingston-xs2000",
  "zojirushi-ee-dg50-vs-ee-rv50",
  "kobo-clara-colour-vs-libra-colour",
  "instax-mini-13-vs-mini-41",
  "instax-mini-evo-vs-evo-cinema",
  "sony-zv-1-ii-vs-zv-1f",
  "jbl-tour-pro-3-vs-live-beam-3",
  "logicool-pebble-m350s-vs-m650",
  "logicool-pro-x-superlight-2-dex-vs-superlight-2",
  "sony-wf-c710n-vs-linkbuds-fit",
  "sony-wf-c710n-vs-soundcore-liberty-5",
  "sony-wf-1000xm6-vs-linkbuds-fit",
  "logicool-mx-master-4-vs-mx-master-3s",
  "anker-nano-a1638-vs-power-bank-a1256",
  "anker-solix-c300-vs-jackery-240-new",
  "pixel-watch-5-vs-galaxy-watch9",
  "zojirushi-ee-tc60-vs-dainichi-hd-lx1026",
  "iphone-18-pro-vs-pixel-11-pro",
  "sony-zv-e10m2-vs-nikon-z30",
  "anker-soundcore-liberty-5-pro-vs-liberty-5-pro-max",
  "airpods-5-vs-airpods-4-anc",
  "dainichi-hd-lx1226-vs-hd-lx1026",
  "zojirushi-ee-dg35-vs-ee-dg50",
  "ipad-a16-vs-ipad-air-m4",
  "switchbot-hub3-vs-hub2",
  "kindle-paperwhite-vs-colorsoft",
  "kindle-vs-kindle-paperwhite",
  "ipad-mini-a17-pro-vs-ipad-a16",
  "apple-watch-series-12-vs-se-3",
  "karcher-k2-silent-vs-k3-silent-plus",
  "sharp-hotcook-kn-hw24k-vs-kn-hw24h",
  "dji-osmo-action-6-vs-gopro-hero13-black",
  "amazon-fire-tv-stick-4k-max-vs-4k-select",
  "amazon-echo-show-8-vs-echo-show-5",
  "amazon-echo-dot-max-vs-echo-dot-5th",
  "philips-sonicare-7100-hx7420-vs-6500-hx7410",
  "nintendo-switch-2-vs-switch-oled",
]);
export function isPublishedArticlePath(path) {
  const slug = String(path).match(/^\/articles\/([^/]+)\/?$/)?.[1];
  return Boolean(slug && PUBLISHED_ARTICLE_PAGE_SLUGS.has(slug));
}

/**
 * トップページの新着枠へ載せる記事かを判定する。
 * 旧テンプレートの互換ページはURLを維持するが、新着記事としては扱わない。
 */
export function isTopPageArticlePath(path) {
  const slug = String(path).match(/^\/articles\/([^/]+)\/?$/)?.[1];
  if (!slug) return false;
  return (
    !LEGACY_ARTICLE_PAGE_SLUGS.has(slug) && !CUSTOM_ARTICLE_PAGE_SLUGS.has(slug)
  );
}
