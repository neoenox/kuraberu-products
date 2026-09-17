type CommercialArticleSeed = {
  id: string;
  title: string;
  headline: string;
  description: string;
  category: string;
  tags: readonly string[];
  audiences: readonly string[];
  uses: readonly string[];
  summary: string;
  leftProduct: string;
  rightProduct: string;
  leftPoint: string;
  rightPoint: string;
  publishedAt: string;
  productInfoCheckedAt?: string;
  modifiedAt?: string;
  /** ChatGPT調査結果と記事データの突合記録。現行記事では必須。 */
  handoffManifestId?: string;
  purchaseLinksCheckedAt?: string;
  purchaseLinkStatus?: "verified" | "direct" | "unverified" | "unavailable";
  /** Amazon商品詳細URL。設定時は商品カードにAmazonボタンを表示する。 */
  leftAmazonUrl?: `https://${string}`;
  rightAmazonUrl?: `https://${string}`;
  /** 楽天商品詳細URL。nullを設定した場合は楽天リンクを自動検索しない。 */
  leftRakutenUrl?: `https://${string}` | null;
  rightRakutenUrl?: `https://${string}` | null;
  officialSources?: readonly {
    label: string;
    url: `https://${string}`;
  }[];
  verifiedRows?: readonly {
    label: string;
    left: string;
    right: string;
    highlight?: "left" | "right" | null;
    highlightNote?: string;
    direction?: "higher-is-better" | "lower-is-better";
  }[];
  /** 左側商品の画像パス（"/products/..."）。省略時は hero セクションの画像をスキップ。 */
  leftImage?: `/${string}`;
  /** 右側商品の画像パス（"/products/..."）。省略時は hero セクションの画像をスキップ。 */
  rightImage?: `/${string}`;
  /** 商品固有のFAQ（省略時は汎用FAQ） */
  faqEntries?: readonly { question: string; answer: string }[];
  /** リード文の上書き（省略時は summary + 汎用文） */
  lead?: string;
  /** 選び方ガイドのステップ（省略時は汎用4ステップ） */
  decisionGuideSteps?: readonly string[];
  /** SNS ソーシャルプルーフ検索クエリ */
  socialProofQuery?: string;
  /** ソーシャルプルーフ確認日 */
  socialProofCheckedAt?: string;
  /** ソーシャルプルーフの投稿があるか */
  socialProofHasPosts?: boolean;
  /** 確認済み公開投稿への直接リンク */
  socialProofDirectPosts?: readonly {
    label: string;
    href: string;
    note?: string;
  }[];
  /** 埋め込み投稿の採用基準ランク（model / series / brand） */
  socialProofBestMatch?: string;
  /** 外部埋め込み（X/Twitter等） */
  embeds?: readonly {
    provider: string;
    url: string;
    title: string;
    match: string;
    purpose?: string;
    tone?: string;
    autoload?: boolean;
    compact?: boolean;
  }[];
  /** 公式情報セクションの説明文（各商品ごとの詳細プロス） */
  officialProse?: readonly { heading: string; items: readonly string[] }[];
  /** 情報源リンク一覧 */
  sourceLinks?: readonly { label: string; url: string; date?: string }[];
  /** 免責事項テキスト */
  disclaimer?: string;
};

export type { CommercialArticleSeed };
