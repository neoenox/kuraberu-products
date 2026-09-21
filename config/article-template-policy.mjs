/** Historical pages that intentionally retain the compatibility renderer. */
export const LEGACY_ARTICLE_PAGE_SLUGS = new Set([
  "amazon-echo-dot-5th-vs-google-nest-mini-2nd",
  "anker-soundcore-liberty-4-nc-vs-sony-wf-c710n",
  "babybjorn",
  "babybjorn-bouncer",
  "babybjorn-cradle",
  "babybjorn-onekai",
  "babybjorn-potty",
  "balmuda-the-toaster-vs-aladdin-graphite-toaster",
  "bruno-boe021-vs-iris-php-1002tc",
  "canon-pixus-ts8830-vs-epson-ep-887a",
  "combi-the-s-plus-vs-premium",
  "gopro-hero13-black-vs-dji-osmo-action-5-pro",
  "hitachi-bd-sx130k-vs-bd-stx130k",
  "kingjim-tepra-sr-r2500p-vs-sr-mk1",
  "merries-newborn",
  "merries-pants",
  "moony-m",
  "pampers-newborn",
  "panasonic-eh-na9m-vs-eh-na7m",
  "panasonic-eh-ne7m-vs-eh-ne5m",
  "panasonic-es-lt4b-vs-es-lv7j",
  "panasonic-f-px60c-vs-f-px70c",
  "panasonic-f-yhvx120-vs-f-yhvx90",
  "panasonic-hh-cf1285a-vs-iris-cl12dl",
  "panasonic-mc-nx810km-vs-mc-nx700k",
  "panasonic-mc-sb55k-vs-mc-sb35k",
  "panasonic-ne-fl1a-vs-ne-fl1c",
  "panasonic-ne-ms4c-vs-ne-bs5c",
  "panasonic-nr-f55hy3-vs-sharp-sj-mf55r",
  "panasonic-nt-t501-vs-nt-d700",
  "pigeon-bottle-160-240",
  "pigeon-bottle-240",
  "pigeon-slim-240",
  "sharp-kc-s50-vs-fu-s50",
  "shupot",
  "tefal-dv4030j0-vs-dv8070j0",
  "tefal-ko5901jp-vs-ko8601j0",
  "thermos-kfm-020-vs-kfi-020",
  "thermos-tiger-bottle",
  "tiger-jpv-l100-vs-jpv-m100",
  "tiger-mta-j050-guide",
  "tiger-pcj-a080-vs-pcm-a080",
  "tiger-pct-a120-vs-pct-a150",
  "yamajitsu-film-holder-242286-vs-242287",
  "yamazaki-condor-wagon-vs-self-wagon",
  "yamazaki-dishwasher-rack-241925-vs-241926",
  "yamazaki-dust-wagon-45l-2division-vs-3division",
  "yamazaki-free-broom-32-vs-45",
  "yamazaki-laundry-wire-basket-m-vs-l",
  "yamazaki-magnet-kitchen-shelf-240005-vs-241830",
  "yamazaki-ofuda-stand-rin-vs-single",
  "yamazaki-rainmat-f216-vs-lonstep",
  "yamazaki-tower-desk-panel-vs-pen-stand",
  "zojirushi-ck-pa08-vs-ck-dc08",
  "zojirushi-ec-kv50-vs-ec-ma60",
  "zojirushi-eq-aa22-vs-eq-sa22",
  "zojirushi-eq-sb22-vs-eq-ah22",
]);

/** Purpose-built non-comparison pages that are not article comparison templates. */
export const CUSTOM_ARTICLE_PAGE_SLUGS = new Set([
  "panasonic-baby-monitor-kx-hc705",
  "panasonic-eh-na9m-guide",
]);

/** 公開記事は品質ゲート通過後に個別追加する。未検証記事は公開しない。 */
export const PUBLISHED_ARTICLE_PAGE_SLUGS = new Set(["jbl-flip-7-vs-charge-6"]);
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
