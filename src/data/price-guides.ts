import {
  instaxFilmOffers,
  perSheet as filmPerSheet,
} from "./instax-film-prices";
import {
  instaxPatternOffers,
  perSheet as patternPerSheet,
} from "./instax-pattern-film-prices";
import { sdCardOffers, perGb } from "./sd-card-prices";

// 価格ガイド：1枚あたり・1GBあたりの価格ページ。表示する価格帯は、各ページと同じデータから導出する。
const range = (values: number[]) => {
  const low = Math.round(Math.min(...values));
  const high = Math.round(Math.max(...values));
  return `${low}〜${high}`;
};
export const priceGuides = [
  {
    path: "/guides/instax-mini-film-price/",
    title: "チェキのフィルムは1枚いくら？",
    image:
      "https://thumbnail.image.rakuten.co.jp/@0_mall/cheki/cabinet/tokiwacamera42/4547410377224n-1.jpg?_ex=200x200",
    imageAlt: "instax mini フィルム（10枚入り）",
    unit: "1枚あたり",
    figure: range(instaxFilmOffers.map(filmPerSheet)),
    summary: "10枚・30枚・100枚のパック別に、送料込みの最安を比べました。",
  },
  {
    path: "/guides/instax-mini-pattern-film-price/",
    title: "チェキの絵柄つきフィルムは1枚いくら？",
    image:
      "https://thumbnail.image.rakuten.co.jp/@0_mall/mituboshicamera/cabinet/goods_08/imgrc0115267911.jpg?_ex=200x200",
    imageAlt: "instax mini フィルム レインボー（10枚入り）",
    unit: "1枚あたり",
    figure: range(instaxPatternOffers.map(patternPerSheet)),
    summary: "モノクロームと8つの柄を、無地との差つきで比べました。",
  },
  {
    path: "/guides/sd-card-price-per-gb/",
    title: "4K動画向けSDカードは1GBいくら？",
    image:
      "https://thumbnail.image.rakuten.co.jp/@0_mall/pc-goodmedia/cabinet/img09/imgrc0162361812.jpg?_ex=200x200",
    imageAlt: "キオクシア EXCERIA G2 SDXCカード",
    unit: "1GBあたり",
    figure: range(sdCardOffers.map(perGb)),
    summary:
      "64GB〜512GBを容量別に比べました。大容量ほど、1GBあたりは安くなります。",
  },
];
