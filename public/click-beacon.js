// プライバシー配慮型クリック計測: 購入CTA（[data-cta-event] / [data-amazon-cta]）のクリックを
// 同一オリジンの /api/events へ送信する。
// Cookie・フィンガープリント・第三者ドメインへの送信は行わない。
// 計測失敗はユーザー体験に影響させない（失敗は黙って無視する）。
// 受信側の検証・保存仕様は docs/click-analytics.md と functions/api/events.ts を参照。
(function () {
  var EVENTS_ENDPOINT = "/api/events";

  function sendEvent(payload) {
    var body = JSON.stringify(payload);
    var blob = new Blob([body], { type: "application/json" });
    if (
      typeof navigator.sendBeacon === "function" &&
      navigator.sendBeacon(EVENTS_ENDPOINT, blob)
    ) {
      return;
    }
    fetch(EVENTS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
      keepalive: true,
    }).catch(function () {});
  }

  // 流入元（チャネル）の把握用。リンクの ?src= と、参照元のホスト名だけを使う。
  // 同じタブの間だけ sessionStorage に保持する（Cookie や端末を識別する値は作らない）。
  function trafficSource() {
    var src = "";
    var ref = "";
    try {
      var param = new URLSearchParams(location.search).get("src") || "";
      if (/^[a-z0-9][a-z0-9_-]{0,23}$/i.test(param)) src = param.toLowerCase();
    } catch {}
    try {
      if (document.referrer) {
        var host = new URL(document.referrer).hostname;
        if (host && host !== location.hostname) ref = host.toLowerCase();
      }
    } catch {}
    try {
      if (src || ref) {
        // 最初の流入を、そのタブの間、保持する
        if (!sessionStorage.getItem("kp-first-touch")) {
          sessionStorage.setItem(
            "kp-first-touch",
            JSON.stringify({ src: src, ref: ref }),
          );
        }
      }
      var stored = JSON.parse(
        sessionStorage.getItem("kp-first-touch") || "null",
      );
      if (stored) {
        src = src || stored.src || "";
        ref = ref || stored.ref || "";
      }
    } catch {}
    return { src: src, ref: ref };
  }

  function withSource(payload) {
    var source = trafficSource();
    if (source.src) payload.src = source.src;
    if (source.ref) payload.ref = source.ref;
    return payload;
  }

  function linkType(cta) {
    var href = cta.getAttribute("href") || "";
    try {
      var host = new URL(href, location.href).hostname;
      if (host === "item.rakuten.co.jp") return "direct-rakuten";
      if (host === "a.r10.to" || host === "hb.afl.rakuten.co.jp") {
        return "affiliate-rakuten";
      }
      if (host === "amazon.co.jp" || host === "www.amazon.co.jp") {
        return "affiliate-amazon";
      }
    } catch {}
    return href ? "external" : "unknown";
  }

  document.addEventListener("click", function (event) {
    var target = event.target;
    if (!(target instanceof Element)) return;
    var cta = target.closest("[data-cta-event], [data-amazon-cta]");
    if (!(cta instanceof HTMLElement)) return;
    var eventName = cta.dataset.ctaEvent || cta.dataset.amazonCta;
    if (!eventName) return;
    var payload = {
      event: eventName,
      productId: cta.dataset.productId || "",
      placement: cta.dataset.placement || "",
      linkType: linkType(cta),
      path: location.pathname,
    };
    // 診断結果カードの順位（rank）は任意属性として送信する（無ければ送らない）
    if (cta.dataset.rank) {
      payload.rank = cta.dataset.rank;
    }
    sendEvent(withSource(payload));
  });

  // ページ表示の計測（購入クリック率の分母）。自動操作（webdriver）は数えない。
  if (!navigator.webdriver) {
    sendEvent(withSource({ event: "page_view", path: location.pathname }));
  }
})();
