import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { validateSourceToggle } from "../scripts/check-rendered-html.mjs";
import {
  additionalCommercialArticleSeeds,
  articleMetadata,
  publicArticleMetadata,
  publishedArticleMetadata,
  defineArticleMetadata,
  panasonicBabyMonitorArticle,
  panasonicEhNa9mGuideArticle,
  additionalCommercialArticles,
} from "../src/content/articles";
import { _setBuildReferenceDate } from "../src/content/articles/types";

// 比較記事（productCount 2）の代表として、現行の公開記事を使う。
const amazonEchoDotMaxFixture = additionalCommercialArticles.find(
  (article) => article.id === "amazon-echo-dot-max-vs-echo-dot-5th",
)!;
import { site } from "../src/config/site";

function extractJsonLd(html: string): Record<string, unknown>[] {
  return [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ].map((match) => JSON.parse(match[1] ?? "{}") as Record<string, unknown>);
}

// 実ビルド（astro build）後の dist を検証する describe 群の共通ガード。
// dist が無い環境では理由をログに出して明示的にスキップする。
const hasDist = existsSync("dist");
if (!hasDist) {
  console.warn(
    "skip: dist/ が存在しないため article metadata の実ビルド整合テストをスキップしました（astro build 後に再実行してください）",
  );
}

// dist/articles 配下の記事ディレクトリ（page / category 除く）を遅延取得する。
// コレクション時に評価すると dist 無し環境で import 自体が失敗するため。
function articleSlugs(): string[] {
  return readdirSync("dist/articles", { withFileTypes: true })
    .filter(
      (entry) => entry.isDirectory() && !"page category".includes(entry.name),
    )
    .map((entry) => entry.name)
    .sort();
}

describe("article metadata", () => {
  it("includes verified commercial articles in public discovery surfaces", () => {
    // 公開一覧は「商用記事以外」と「draftでなく商品情報の確認日がある商用記事」。
    // 件数を固定すると記事の追加ごとに更新が必要になるため、規則そのものを確かめる (#230)。
    const seedById = new Map(
      additionalCommercialArticleSeeds.map((seed) => [seed.id, seed]),
    );
    const isComplete = (article: (typeof articleMetadata)[number]) => {
      const seed = seedById.get(article.id);
      return !seed || (!seed.draft && Boolean(article.productInfoCheckedAt));
    };
    const publicIds = new Set(
      publicArticleMetadata.map((article) => article.id),
    );
    for (const article of articleMetadata) {
      expect(publicIds.has(article.id), article.id).toBe(isComplete(article));
    }
    expect(publicArticleMetadata.length).toBeGreaterThan(0);
    const newlyPublishedIds = [
      "sony-wh-1000xm6-vs-wh-1000xm5",
      "roborock-qrevo-curv-vs-dreame-x50",
      "makita-cl107-vs-cl286",
      "recolte-automatic-cooker-vs-panasonic-nf-pc400",
      "sharp-kc-s50-vs-panasonic-f-vxw55",
      "panasonic-eh-na9m-vs-refa-beautech",
      "panasonic-ne-bs6e-vs-ne-bs5e",
      "panasonic-es-pv6a-vs-es-pv3a",
      "yamazaki-refrigerator-rack-240057-vs-240059",
      "logicool-mx-master-3s-vs-mx-anywhere-3s",
      "dyson-v12-vs-micro-plus",
      "elecom-de-c85-vs-de-c86",
      "sony-wf-1000xm6-vs-linkbuds-fit",
      "sony-wf-c710n-vs-linkbuds-fit",
      "zojirushi-ee-dg50-vs-ee-rv50",
      "zojirushi-ee-dg35-vs-ee-dg50",
      "ipad-a16-vs-ipad-air-m4",
      "switchbot-hub3-vs-hub2",
      "kindle-paperwhite-vs-colorsoft",
      "karcher-k2-silent-vs-k3-silent-plus",
      "sharp-hotcook-kn-hw24k-vs-kn-hw24h",
      "dji-osmo-action-6-vs-gopro-hero13-black",
      "amazon-fire-tv-stick-4k-max-vs-4k-select",
      "amazon-echo-show-8-vs-echo-show-5",
      "amazon-echo-dot-max-vs-echo-dot-5th",
      "philips-sonicare-7100-hx7420-vs-6500-hx7410",
      "nintendo-switch-2-vs-switch-oled",
      "kobo-clara-colour-vs-libra-colour",
      "instax-mini-13-vs-mini-41",
      "instax-mini-evo-vs-evo-cinema",
      "sony-zv-1-ii-vs-zv-1f",
      "braun-series9pro-vs-series7",
      "delonghi-ecam22112b-vs-ecam25023sb",
      "irobot-roomba-j9plus-vs-j7",
      "zojirushi-nx-ab10-vs-tiger-jrt-a100",
      "zojirushi-eq-ja22-vs-eq-fa22",
      "dainichi-hd-rxt525-vs-panasonic-fe-kxu07",
      "tefal-cy8768jp-vs-panasonic-sr-mp300",
      "dainichi-efh-1219d-vs-panasonic-ds-fwx1200",
      "panasonic-db-bm1l-vs-db-rm3m",
      "tanita-bc-772-vs-omron-hbf-702t",
      "panasonic-ew-dp57-vs-philips-hx9911",
      "casio-px-s1100-vs-yamaha-p-225",
      "omron-hem-7281t-vs-terumo-p2020",
      "iris-fk-c5-vs-panasonic-fd-f06x2",
      "juki-hzl-f400jp-vs-brother-ps202",
      "panasonic-be-fd633-vs-bridgestone-a6xc41",
      "omron-mc-681-vs-terumo-c205",
      "fitbit-charge-6-vs-xiaomi-smart-band-9",
      "zojirushi-cv-gb22-vs-tiger-pim-g220",
      "anker-nano-a1638-vs-power-bank-a1256",
      "anker-nano-power-bank-vs-zolo-a1688",
      "logicool-mx-master-4-vs-mx-master-3s",
      "shokz-openfit-2-plus-vs-openfit-2",
      "logicool-pebble-m350s-vs-m650",
      "anker-a121a-vs-a2688",
      "anker-a1664-vs-a1654",
      "garmin-forerunner-570-vs-coros-pace-4",
      "sony-wf-c710n-vs-soundcore-liberty-5",
      "jbl-tour-pro-3-vs-live-beam-3",
      "tp-link-archer-be550-vs-be450",
      "anker-solix-c300-vs-jackery-240-new",
      "pixel-watch-5-vs-galaxy-watch9",
      "zojirushi-ee-tc60-vs-dainichi-hd-lx1026",
      "iphone-18-pro-vs-pixel-11-pro",
      "sony-zv-e10m2-vs-nikon-z30",
      "anker-soundcore-liberty-5-pro-vs-liberty-5-pro-max",
      "airpods-5-vs-airpods-4-anc",
      "dainichi-hd-lx1226-vs-hd-lx1026",
    ];
    for (const id of newlyPublishedIds) {
      expect(publicArticleMetadata.some((article) => article.id === id)).toBe(
        true,
      );
    }
    expect(
      publishedArticleMetadata.some(
        (article) => article.id === "anker-a121a-vs-a2688",
      ),
    ).toBe(true);
    expect(
      publishedArticleMetadata.some(
        (article) => article.id === "anker-a1664-vs-a1654",
      ),
    ).toBe(true);
    expect(
      publishedArticleMetadata.some(
        (article) => article.id === "garmin-forerunner-570-vs-coros-pace-4",
      ),
    ).toBe(true);
  });

  it("keeps the article page directories synchronized with the canonical master", () => {
    const articlesDir = join(process.cwd(), "src/pages/articles");
    const pagePaths = readdirSync(articlesDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .filter((entry) =>
        readdirSync(join(articlesDir, entry.name)).includes("index.astro"),
      )
      .map((entry) => `/articles/${entry.name}/`)
      .sort();
    const metadataPaths = articleMetadata.map((article) => article.path).sort();

    expect(pagePaths).toEqual(metadataPaths);
  });

  it("uses the canonical master for the article index, memo page, and sitemap", () => {
    const articleIndex = readFileSync("src/pages/articles/index.astro", "utf8");
    const memoPage = readFileSync("src/pages/memo.astro", "utf8");
    const sitemap = readFileSync("src/pages/sitemap.xml.ts", "utf8");

    expect(articleIndex).toContain("publishedArticleMetadata");
    expect(memoPage).toContain("publishedArticleMetadata");
    expect(sitemap).toContain("publishedArticleMetadata.map((article)");
    expect(sitemap).toContain("article.modifiedAt");
  });

  it("keeps one typed canonical source for article listings and pages", () => {
    // 記事一覧・ページ・商用シードの3系統が同じ記事集合を指す。
    const ids = articleMetadata.map((article) => article.id);
    expect(new Set(ids).size).toBe(ids.length);
    const commercialIds = additionalCommercialArticles.map((a) => a.id);
    for (const id of commercialIds) expect(ids, id).toContain(id);
    expect(ids).toContain(panasonicBabyMonitorArticle.id);
    expect(ids).toContain(panasonicEhNa9mGuideArticle.id);
    for (const article of articleMetadata) {
      expect(article.path, article.id).toBe(`/articles/${article.id}/`);
      expect(article.modifiedAt >= article.publishedAt, article.id).toBe(true);
    }
  });

  it("requires every article to declare a positive product count", () => {
    for (const article of articleMetadata) {
      expect(
        Number.isInteger(article.productCount) && article.productCount >= 1,
      ).toBe(true);
    }
    // 比較記事は productCount: 2、単一商品記事（商品ガイド）は productCount: 1。
    // 件数は記事の追加で変わるため固定せず、それ以外の値がないことを確かめる。
    for (const article of articleMetadata) {
      expect([1, 2], article.id).toContain(article.productCount);
    }
    expect(
      articleMetadata.filter((article) => article.productCount === 1),
    ).toEqual([panasonicBabyMonitorArticle, panasonicEhNa9mGuideArticle]);
  });

  it("declares aboutProductNames matching productCount for JSON-LD", () => {
    // 商品ガイドは単一商品名を必須で宣言する
    expect(panasonicBabyMonitorArticle.aboutProductNames).toEqual([
      "パナソニック ベビーモニター KX-HC705",
    ]);
    expect(panasonicEhNa9mGuideArticle.aboutProductNames).toEqual([
      "パナソニック ナノケア EH-NA9M",
    ]);
    // 全記事で宣言がある場合は productCount と一致する
    for (const article of articleMetadata) {
      if (!article.aboutProductNames) continue;
      expect(article.aboutProductNames.length).toBe(article.productCount);
    }
    // 比較記事（商用シード）は leftProduct / rightProduct から導出される
    const commercial = articleMetadata.find(
      (article) => article.id === "roborock-qrevo-curv-vs-dreame-x50",
    );
    expect(commercial?.aboutProductNames).toEqual([
      "Roborock Qrevo Curv",
      "Dreame X50 Ultra",
    ]);
  });

  it("rejects aboutProductNames that do not match productCount", () => {
    expect(() =>
      defineArticleMetadata({
        ...panasonicBabyMonitorArticle,
        aboutProductNames: ["商品A", "商品B"],
      } as never),
    ).toThrow("aboutProductNames must have exactly 1 non-empty entries");
    expect(() =>
      defineArticleMetadata({
        ...panasonicBabyMonitorArticle,
        aboutProductNames: undefined,
      } as never),
    ).toThrow(
      "aboutProductNames must be declared for single-product (guide) articles",
    );
  });

  it("rejects invalid product counts", () => {
    expect(() =>
      defineArticleMetadata({
        ...amazonEchoDotMaxFixture,
        productCount: 0,
      } as never),
    ).toThrow("productCount must be a positive integer");
    expect(() =>
      defineArticleMetadata({
        ...amazonEchoDotMaxFixture,
        productCount: 1.5,
      } as never),
    ).toThrow("productCount must be a positive integer");
  });

  it("rejects invalid and contradictory dates", () => {
    expect(() =>
      defineArticleMetadata({
        ...amazonEchoDotMaxFixture,
        publishedAt: "2026-02-30",
      }),
    ).toThrow();
    expect(() =>
      defineArticleMetadata({
        ...amazonEchoDotMaxFixture,
        publishedAt: "2026-08-01",
        modifiedAt: "2026-07-31",
      }),
    ).toThrow();
  });
});

// 実ビルド後の HTML を検証する。dist が無い環境ではスキップされる。
describe.skipIf(!hasDist)("article metadata (rendered dist)", () => {
  it("renders dates consistently in HTML, meta and Article JSON-LD", () => {
    const html = readFileSync(
      "dist/articles/amazon-echo-dot-max-vs-echo-dot-5th/index.html",
      "utf8",
    );
    const article = extractJsonLd(html).find(
      (item) => item["@type"] === "Article",
    );

    expect(article).toBeDefined();
    expect(article?.headline).toBe(amazonEchoDotMaxFixture.headline);
    expect(article?.datePublished).toBe(amazonEchoDotMaxFixture.publishedAt);
    expect(article?.dateModified).toBe(amazonEchoDotMaxFixture.modifiedAt);
    expect(article?.url).toBe(article?.mainEntityOfPage);
    expect(article?.image).toBe(
      new URL(amazonEchoDotMaxFixture.imagePath!, `${site.url}/`).toString(),
    );
    expect(html).toContain(
      `<meta property="article:published_time" content="${amazonEchoDotMaxFixture.publishedAt}">`,
    );
    expect(html).toContain(
      `<meta property="article:modified_time" content="${amazonEchoDotMaxFixture.modifiedAt}">`,
    );
    expect(html).toContain(`datetime="${amazonEchoDotMaxFixture.publishedAt}"`);
    expect(html).toContain(`datetime="${amazonEchoDotMaxFixture.modifiedAt}"`);
  });

  it("renders the product count meta for article pages", () => {
    const html = readFileSync(
      "dist/articles/amazon-echo-dot-max-vs-echo-dot-5th/index.html",
      "utf8",
    );
    expect(html).toContain(
      `<meta name="article:product-count" content="${amazonEchoDotMaxFixture.productCount}">`,
    );
  });

  it("renders no mid-cta meta (midArticleCta path removed 2026-08-18)", () => {
    // v3 短縮後、途中 CTA（after-decision）は長文記事のみ許容だったが、
    // 宣言する記事がゼロのまま 2026-08-18 に経路ごと削除された。
    // 将来も mid-cta meta が出力されないことを代表記事で確認する。
    const pampersHtml = readFileSync(
      "dist/articles/amazon-echo-dot-max-vs-echo-dot-5th/index.html",
      "utf8",
    );
    expect(pampersHtml).not.toContain('name="article:mid-cta"');
  });

  it("renders the single-product count for the single-product check article", () => {
    const html = readFileSync(
      "dist/articles/panasonic-baby-monitor-kx-hc705/index.html",
      "utf8",
    );
    expect(html).toContain(`<meta name="article:product-count" content="1">`);
    expect(panasonicBabyMonitorArticle.productCount).toBe(1);
  });

  it("marks the single-product article as a guide without a comparison section", () => {
    const html = readFileSync(
      "dist/articles/panasonic-baby-monitor-kx-hc705/index.html",
      "utf8",
    );
    expect(html).toContain(
      `<meta name="article:content-type" content="guide">`,
    );
    // 商品ガイドは比較セクション（ArticleComparisonV2）を持たない
    expect(html).not.toContain("article-comparison-v2");
    // 記事の meta 行にコンテンツタイプが表示される
    expect(html).toContain("商品ガイド");
    // 内部メモ（サンプル）と v3 で廃止した表示が残っていない
    expect(html).not.toContain("サンプル");
    expect(html).not.toContain("verification-summary");
  });

  it("marks a two-product article as a comparison with a comparison section", () => {
    const html = readFileSync(
      "dist/articles/amazon-echo-dot-max-vs-echo-dot-5th/index.html",
      "utf8",
    );
    expect(html).toContain(
      `<meta name="article:content-type" content="comparison">`,
    );
    expect(html).toContain("article-comparison-v2");
  });

  it("keeps ordinary pages as WebPage without article dates", () => {
    const html = readFileSync("dist/about/index.html", "utf8");
    const data = extractJsonLd(html);
    expect(data.some((item) => item["@type"] === "WebPage")).toBe(true);
    expect(html).not.toContain("article:published_time");
    expect(html).not.toContain("article:product-count");
  });
});

describe.skipIf(!hasDist)(
  "article JSON-LD by content type (rendered dist)",
  () => {
    const articleOf = (html: string) =>
      extractJsonLd(html).find((item) => item["@type"] === "Article") as Record<
        string,
        unknown
      >;

    it("marks a product guide with a single Product in about", () => {
      const expectedNames: Record<string, string> = {
        "panasonic-baby-monitor-kx-hc705":
          panasonicBabyMonitorArticle.aboutProductNames![0],
        "panasonic-eh-na9m-guide":
          panasonicEhNa9mGuideArticle.aboutProductNames![0],
      };
      for (const [slug, expectedName] of Object.entries(expectedNames)) {
        const html = readFileSync(`dist/articles/${slug}/index.html`, "utf8");
        const article = articleOf(html);
        expect(article.about).toEqual([
          { "@type": "Product", name: expectedName },
        ]);
      }
    });

    it("marks a comparison article with two Products in about when names are declared", () => {
      const html = readFileSync(
        "dist/articles/roborock-qrevo-curv-vs-dreame-x50/index.html",
        "utf8",
      );
      const article = articleOf(html);
      expect(article.about).toEqual([
        { "@type": "Product", name: "Roborock Qrevo Curv" },
        { "@type": "Product", name: "Dreame X50 Ultra" },
      ]);
    });
  },
);

describe.skipIf(!hasDist)("source-toggle fold (rendered dist)", () => {
  it("every article passes the source-toggle gate (toggle removed in P2-2)", () => {
    for (const slug of articleSlugs()) {
      const html = readFileSync(`dist/articles/${slug}/index.html`, "utf8");
      const relative = `articles/${slug}/index.html`;
      const errors = validateSourceToggle(relative, html);
      expect(errors).toEqual([]);
    }
  });
});

describe.skipIf(!hasDist)("article trust line (rendered dist)", () => {
  it("renders exactly one compressed trust line per article with the checked date", () => {
    for (const slug of articleSlugs()) {
      const html = readFileSync(`dist/articles/${slug}/index.html`, "utf8");
      const article = articleMetadata.find(
        (entry) => entry.path === `/articles/${slug}/`,
      );
      expect(article, `unknown article ${slug}`).toBeDefined();
      // 目次を持たない既存記事は旧テンプレートの静的出力として保持する。
      // 信頼行の契約は現行テンプレートにだけ適用する。
      if (!html.includes('class="article-toc"')) continue;
      const trustLines = [
        ...html.matchAll(/<p class="trust-line">[\s\S]*?<\/p>/g),
      ];
      const checkedAt = article!.productInfoCheckedAt;
      expect(trustLines.length, `${slug}: trust line count`).toBe(
        checkedAt ? 1 : 0,
      );
      if (checkedAt) {
        expect(trustLines[0][0]).toBe(
          `<p class="trust-line">✓ 公式確認済み（${checkedAt}）</p>`,
        );
      }
      // 旧形式（ヒーロー信頼行・広告表示 notice）が残っていない
      expect(html).not.toContain("公式情報確認済み · ");
      expect(html).not.toContain("広告表示：この記事には広告リンクを含みます");
    }
  });
});

describe.skipIf(!hasDist)("public commercial article quality gate", () => {
  it("renders concrete comparison rows without placeholder wording", () => {
    const articleSlugs = [
      "roborock-qrevo-curv-vs-dreame-x50",
      "makita-cl107-vs-cl286",
      "recolte-automatic-cooker-vs-panasonic-nf-pc400",
      "sharp-kc-s50-vs-panasonic-f-vxw55",
      "panasonic-eh-na9m-vs-refa-beautech",
    ];
    for (const slug of articleSlugs) {
      const html = readFileSync(`dist/articles/${slug}/index.html`, "utf8");
      const rows = html.match(/<tr\b[\s\S]*?<\/tr>/gi) ?? [];
      if (!rows.length) continue;
      const tableText = rows.join(" ");
      if (!html.includes('class="comparison"')) continue;
      expect(tableText, `${slug}: placeholder comparison rows`).not.toMatch(
        /公式(?:仕様|情報)?確認項目|公式(?:仕様|情報)で確認する項目|選定の観点|確認項目|仕様・サイズ・対応機能/,
      );
      expect(rows.length, `${slug}: comparison rows`).toBeGreaterThanOrEqual(2);
    }
  });
});

describe.skipIf(!hasDist)("article purchase layout (rendered dist)", () => {
  it("keeps purchase links in the single article-end purchase section on every current article", () => {
    // 旧形式の記事は整理済み。現行テンプレート（目次付き）の記事は、
    // 結論直後の next-step 欄を出さず、購入先を記事末尾の1か所にまとめる。
    let comparisonPages = 0;
    const publishedIds = new Set(
      publishedArticleMetadata.map((article) => article.id),
    );
    for (const slug of articleSlugs()) {
      // 撤去済みの記事（本番では404にする）は対象外。公開記事だけを検査する。
      if (!publishedIds.has(slug)) continue;
      const html = readFileSync(`dist/articles/${slug}/index.html`, "utf8");
      const contentType = html.match(
        /<meta name="article:content-type" content="(guide|comparison)">/i,
      )?.[1];
      if (contentType === "guide") continue;
      comparisonPages += 1;
      expect(html, `${slug}: toc template`).toContain('class="article-toc"');
      expect(
        /<section\b[^>]*\bnext-step\b[^>]*\bdata-next-step(?![-\w])[^>]*>/i.test(
          html,
        ),
        `${slug}: must not render a next-step block`,
      ).toBe(false);
      expect(
        /data-placement="next-step"/.test(html),
        `${slug}: must not render next-step purchase links`,
      ).toBe(false);
      expect(html, `${slug}: purchase section`).toContain('id="purchase"');
      expect(
        /next-step__diagnosis-link/.test(html),
        `${slug}: must not link to a diagnosis`,
      ).toBe(false);
    }
    expect(comparisonPages).toBeGreaterThan(30);
  });
});

describe("article card audiences 向き line", () => {
  it("declares non-empty audiences for every public article", () => {
    for (const article of publicArticleMetadata) {
      expect(
        article.audiences.length,
        `${article.id}: audiences must be non-empty for the card 向き line`,
      ).toBeGreaterThan(0);
    }
  });

  it("does not mix unrelated product categories into known comparison cards", () => {
    const expectations = [
      { id: "panasonic-ne-bs9c-vs-ne-ubs10c", forbidden: /冷蔵庫|冷凍室/ },
      { id: "panasonic-es-wp9b-vs-es-wg0b", forbidden: /レイザー式シェーバー/ },
      { id: "panasonic-eh-na0k-vs-eh-ne9n", forbidden: /Care/ },
      { id: "logicool-lift-vs-m550", forbidden: /ロジカルロール/ },
    ];
    for (const { id, forbidden } of expectations) {
      const article = publicArticleMetadata.find(
        (candidate) => candidate.id === id,
      );
      expect(article, `${id}: article metadata must exist`).toBeDefined();
      expect(
        article?.audiences.join(" "),
        `${id}: audiences contain unrelated wording`,
      ).not.toMatch(forbidden);
    }
  });

  it("does not leak unrelated category wording into article audiences", () => {
    const forbiddenByArticle: ReadonlyArray<readonly [string, RegExp]> = [
      ["panasonic-ne-bs9c-vs-ne-ubs10c", /冷蔵庫|冷凍室/],
      ["panasonic-eh-na0k-vs-eh-ne9n", /Care機能/],
      ["panasonic-es-wp9b-vs-es-wg0b", /レイザー式シェーバー/],
      ["logicool-lift-vs-m550", /ロジカルロール/],
    ];
    for (const [id, forbidden] of forbiddenByArticle) {
      const article = publicArticleMetadata.find(
        (candidate) => candidate.id === id,
      );
      expect(article, `${id}: article metadata must exist`).toBeDefined();
      expect(
        article?.audiences.join(" "),
        `${id}: unrelated wording remains`,
      ).not.toMatch(forbidden);
    }
  });

  it("does not describe Makita CL286FD as a wet/dry vacuum", () => {
    const article = publicArticleMetadata.find(
      (candidate) => candidate.id === "makita-cl107-vs-cl286",
    );
    expect(article).toBeDefined();
    const values = [
      ...(article?.audiences ?? []),
      article?.summary ?? "",
      ...(article?.verifiedRows?.flatMap((row) => [row.left, row.right]) ?? []),
      article?.lead ?? "",
      ...(article?.faqEntries?.map((entry) => entry.answer) ?? []),
    ].join(" ");
    expect(values).not.toMatch(/ウェット|ドライ対応|液体ゴミも吸引/);
  });

  it.skipIf(!hasDist)(
    "renders the 向き line on every ArticleCard on the top and listing pages",
    () => {
      const pages = [
        "dist/index.html",
        "dist/articles/index.html",
        ...(existsSync("dist/articles/page")
          ? readdirSync("dist/articles/page", { withFileTypes: true })
              .filter((entry) => entry.isDirectory())
              .map((entry) => `dist/articles/page/${entry.name}/index.html`)
          : []),
      ];
      let cardCount = 0;
      for (const file of pages) {
        const html = readFileSync(file, "utf8");
        for (const card of html.matchAll(
          /<article\b[^>]*class="[^"]*\barticle-list-card\b[^"]*"[^>]*data-content-type="(?:guide|comparison)"[^>]*>([\s\S]*?)<\/article>/gi,
        )) {
          cardCount += 1;
          expect(
            /<p class="card-audiences">向き: [^<]+<\/p>/.test(card[1]),
            `card on ${file} must render the 向き line`,
          ).toBe(true);
          if (/data-content-type="comparison"/.test(card[0])) {
            expect(
              /<p class="card-subjects">[^<]+<\/p>/.test(card[1]),
              `comparison card on ${file} must render the 型番 line`,
            ).toBe(true);
          }
        }
      }
      expect(cardCount).toBeGreaterThanOrEqual(publishedArticleMetadata.length);
    },
  );
});

describe("future date validation in Asia/Tokyo", () => {
  it("accepts a date that is 'today' in JST but 'tomorrow' in UTC", () => {
    // Simulate JST 01:00 on 2026-08-22 (= UTC 16:00 on 2026-08-21)
    // JST date = 2026-08-22, but if we used UTC toISOString it would be 2026-08-21
    // With JST-based validation, 2026-08-22 should be accepted when reference is 2026-08-22
    _setBuildReferenceDate("2026-08-22");
    expect(() =>
      defineArticleMetadata({
        id: "test-jst-today",
        path: "/articles/test-jst-today/",
        title: "テスト",
        headline: "テスト",
        description: "テスト",
        category: "美容家電",
        publishedAt: "2026-08-22",
        modifiedAt: "2026-08-22",
        productCount: 2,
        leftModel: {
          brand: "A",
          line: "A",
          tagline: "A",
          image: "/products/test-a.jpg",
          imageAlt: "A",
          officialHref: "https://example.com/a",
          guidePoints: ["テスト"],
        },
        rightModel: {
          brand: "B",
          line: "B",
          tagline: "B",
          image: "/products/test-b.jpg",
          imageAlt: "B",
          officialHref: "https://example.com/b",
          guidePoints: ["テスト"],
        },
        summary: "テスト記事",
        tags: ["テスト"],
        audiences: ["テスト"],
        uses: ["テスト"],
        purchaseLinkStatus: "unverified",
        keyDiffRows: [{ label: "テスト", left: "A", right: "B" }],
        faqEntries: [{ question: "Q", answer: "A" }],
        lead: "テスト",
        changeLog: [{ date: "2026-08-22", summary: "テスト公開" }],
      }),
    ).not.toThrow();
    _setBuildReferenceDate(null);
  });

  it("rejects a date that is tomorrow in JST", () => {
    _setBuildReferenceDate("2026-08-21");
    expect(() =>
      defineArticleMetadata({
        id: "test-jst-future",
        path: "/articles/test-jst-future/",
        title: "テスト",
        headline: "テスト",
        description: "テスト",
        category: "美容家電",
        publishedAt: "2026-08-22",
        modifiedAt: "2026-08-22",
        productCount: 2,
        leftModel: {
          brand: "A",
          line: "A",
          tagline: "A",
          image: "/products/test-a.jpg",
          imageAlt: "A",
          officialHref: "https://example.com/a",
          guidePoints: ["テスト"],
        },
        rightModel: {
          brand: "B",
          line: "B",
          tagline: "B",
          image: "/products/test-b.jpg",
          imageAlt: "B",
          officialHref: "https://example.com/b",
          guidePoints: ["テスト"],
        },
        summary: "テスト記事",
        tags: ["テスト"],
        audiences: ["テスト"],
        uses: ["テスト"],
        purchaseLinkStatus: "unverified",
        keyDiffRows: [{ label: "テスト", left: "A", right: "B" }],
        faqEntries: [{ question: "Q", answer: "A" }],
        lead: "テスト",
        changeLog: [{ date: "2026-08-21", summary: "テスト公開" }],
      }),
    ).toThrow(/must not be a future date/);
    _setBuildReferenceDate(null);
  });

  it("rejects a date that is two days ahead in JST", () => {
    _setBuildReferenceDate("2026-08-21");
    expect(() =>
      defineArticleMetadata({
        id: "test-jst-2days",
        path: "/articles/test-jst-2days/",
        title: "テスト",
        headline: "テスト",
        description: "テスト",
        category: "美容家電",
        publishedAt: "2026-08-23",
        modifiedAt: "2026-08-23",
        productCount: 2,
        leftModel: {
          brand: "A",
          line: "A",
          tagline: "A",
          image: "/products/test-a.jpg",
          imageAlt: "A",
          officialHref: "https://example.com/a",
          guidePoints: ["テスト"],
        },
        rightModel: {
          brand: "B",
          line: "B",
          tagline: "B",
          image: "/products/test-b.jpg",
          imageAlt: "B",
          officialHref: "https://example.com/b",
          guidePoints: ["テスト"],
        },
        summary: "テスト記事",
        tags: ["テスト"],
        audiences: ["テスト"],
        uses: ["テスト"],
        purchaseLinkStatus: "unverified",
        keyDiffRows: [{ label: "テスト", left: "A", right: "B" }],
        faqEntries: [{ question: "Q", answer: "A" }],
        lead: "テスト",
        changeLog: [{ date: "2026-08-21", summary: "テスト公開" }],
      }),
    ).toThrow(/must not be a future date/);
    _setBuildReferenceDate(null);
  });

  it("rejects a changelog date that is tomorrow in JST", () => {
    _setBuildReferenceDate("2026-08-21");
    expect(() =>
      defineArticleMetadata({
        id: "test-jst-changelog",
        path: "/articles/test-jst-changelog/",
        title: "テスト",
        headline: "テスト",
        description: "テスト",
        category: "美容家電",
        publishedAt: "2026-08-20",
        modifiedAt: "2026-08-21",
        productCount: 2,
        leftModel: {
          brand: "A",
          line: "A",
          tagline: "A",
          image: "/products/test-a.jpg",
          imageAlt: "A",
          officialHref: "https://example.com/a",
          guidePoints: ["テスト"],
        },
        rightModel: {
          brand: "B",
          line: "B",
          tagline: "B",
          image: "/products/test-b.jpg",
          imageAlt: "B",
          officialHref: "https://example.com/b",
          guidePoints: ["テスト"],
        },
        summary: "テスト記事",
        tags: ["テスト"],
        audiences: ["テスト"],
        uses: ["テスト"],
        purchaseLinkStatus: "unverified",
        keyDiffRows: [{ label: "テスト", left: "A", right: "B" }],
        faqEntries: [{ question: "Q", answer: "A" }],
        lead: "テスト",
        changeLog: [{ date: "2026-08-22", summary: "テスト更新" }],
      }),
    ).toThrow(/changeLog\.date.*must not be a future date/);
    _setBuildReferenceDate(null);
  });
});
