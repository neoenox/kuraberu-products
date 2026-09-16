// モバイル用ドロワー（details.nav-toggle）の開閉のビューポート同期。
// デスクトップ（≥561px）用ナビは details の外（nav.navlinks--desktop）にあり
// CSS のみで常時表示されるため、このスクリプトはドロワー側の漸進的強調である。
// 狭い幅では閉じてモバイルのドロワー挙動（ネイティブ開閉）を維持する。
//
// marker: nav-toggle-sync
(function () {
  var mq = window.matchMedia("(min-width: 561px)");
  var details = document.querySelector("[data-nav-toggle]");
  if (!details) return;
  var summary = details.querySelector("summary");
  // 開閉状態に応じて summary のラベルを同期する（ネイティブ開閉にも追従）。
  // toggle イベントは非同期に発火するため、初期同期より先に登録する。
  details.addEventListener("toggle", function () {
    if (summary) {
      summary.setAttribute(
        "aria-label",
        details.open ? "メニューを閉じる" : "メニューを開く",
      );
    }
  });
  // 幅の変化に追従する（広い=常時表示のため開く / 狭い=ドロワーのため閉じる）。
  var syncByWidth = function () {
    details.open = mq.matches;
  };
  // addEventListener は MediaQueryList で Safari 14+(2020)以降対応のため
  // 旧 addListener フォールバックは撤去した。
  mq.addEventListener("change", syncByWidth);
  // 初期同期。open 変更は上の toggle リスナー経由でラベルも連動する。
  syncByWidth();
})();
