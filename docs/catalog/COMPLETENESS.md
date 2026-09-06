# ICH 官網手錶商品盤點

查核日期：2026-09-07（Asia/Taipei）

盤點口徑是商品頁（product ID），不是把每個顏色、SKU 或錶帶組合算成一款。售完但仍公開展示的腕錶保留，庫存狀態依各變體資料。

## 完整性證據

- `/collections/all` 共 292 件商品，6 頁分別為 50、50、50、50、50、42，ID 無重複。
- `/sitemap_products.xml` 共 292 個商品 URL，與上述商品集合完全一致；雙向差集皆為空。
- `/collections/ich-watches` 共 176 件商品，4 頁分別為 50、50、50、26。
- 排除該分類內 14 件純配件或客製化服務，納入 162 個腕錶商品。
- 額外納入全商品中未歸入手錶分類的 ONOLA 酒桶鏤空錶（三眼機械錶，ID 13089799），合計 163 個腕錶商品，16 品牌。
- MEGIR、FOSSIL、FOSSIL 男/女錶、PARNIS、DIDUN、SPECHT & SOHNE、OLIVIA BURTON、PAGANI、HUGO BOSS、Tommy Hilfiger、AILANG、兩個配件分類另行交叉。OLIVIA BURTON 目前 0 件。
- 客製時計分類只有 12 件；新 Samurai 已列在全商品和手錶分類，但未列入客製時計分類，盤點已納入。

## 品牌商品頁數

- ICHco：15
- BENTLEY：1
- HUGO BOSS：8
- FOSSIL：46
- PAGANI Design：29
- PARNIS：30
- DIDUN：10
- Diasteria：1
- SPECHT & SOHNE：9
- MEGIR：4
- ONOLA：1
- Dimini：1
- Tommy Hilfiger：3
- Bonest Gatti：2
- EOEO：1
- AILANG：2

## 排除的純配件／服務（手錶分類內）

- 11469632 — ICH.co - RM/Onola/Pintime系列專用彈簧錶耳錶帶
- 12728737 — ICH SELECT - AP/DIDUN專用素面/迷彩膠帶
- 15169576 — 日本 AFM 手錶清潔保護劑
- 14072778 — ICHco MW系列上鍊盒/搖錶器日製機芯
- 14072955 — ICHco-日本機芯二代陀螺儀上鍊盒Orbit winder-搖錶器
- 12248045 — 美國Fossil-適用錶帶
- 11464689 — Samco-雙層矽膠錶帶
- 13055090 — ICHCO-胡桃木手錶收納盒
- 12686807 — ICHco-真皮攜帶型高階錶盒
- 12246904 — ICHco 高階抗敏醫療鋼錶帶
- 13202649 — 英國 S&K 專業自動機械錶上鍊盒-搖錶器
- 11464027 — ICH.co 手雷/海底探險家系列專用硅膠/矽膠錶帶
- 12511966 — ICHco 客製化服務
- 11469503 — ICHco - 牛皮女款錶帶

## 使用資料

- `inventory.json`：163 筆精簡索引，title/url/slug/brand/collection/variantCount；brand 為從商品標題正規化的品牌名，未重述不可靠的標題國別。
- `all-watches-full.json`：對應 163 筆官方 collection 原始商品物件，含 options/variants/images/media，但不含完整介紹。
- `all-page-1..6.html/.json`、`watches-page-1..4.html/.json`：各分頁公開 HTML 與其原始 collection JSON。
- `brand-0..13.html/.json`：品牌與相關分類原始證據，對照 `collections-report.json`。
- `sitemap_products.xml`、`sitemap-check.json`：網站地圖交叉結果。
- `products/{ID}.html/.json`、`noncustom-products-full.json`：非 13 客製款的商品详情頁與完整 product JSON（150 / 150 完成；所有商品有介紹，型號 ID 與價格對照分類頁無差異）。

## 解讀注意

- 商品 JSON 頂層 price 為 TWD 元；variant.price 為分，使用時除以 100。
- MM、Carbon Tattoo 等商品含純配件變體，整錶起價不得直接套商品頁最低價格。配件最終分類由 variants 審查檔提供。
- 相似產品名稱不可合併；例如兩個 Daytona、兩個 Hugo Boss Hero 頁面都有不同 product ID 和選項，全部保留。
- 這是查核當日公开商品目錄快照；未公開、下架且不在 sitemap 的商品不推測加入。

## 最新整錶配置範圍與配件分離

最新 `assets/catalog-data.json` 為 **163 個商品、1,194 筆整錶／配套變體**。官方原始資料共有 1,199 筆：排除下列 4 筆獨立配件與 1 筆客製洽詢後，保留 1,194 筆；配置數不是不同單錶只數，部分為對錶或整錶加購配套。

| 商品 | Product ID | Variant ID | 官方原始 price（分） | TWD | 分類 |
|---|---:|---:|---:|---:|---|
| ICHCO Customize Carbon Tattoo 碳紋系列-客製錶Seikomod — 選配真碳纖圈 | 15197426 | 70332384 | 148000 | 1,480 | 獨立配件 |
| ICHco customize Seikomod MarinaMilitare 義大利海軍系列 — Buckle | 14542045 | 69109906 | 45000 | 450 | 獨立配件 |
| 美國Pagani Design - PD-1661 — 活動價-單獨鋼錶帶 | 12733186 | 71186538 | 88000 | 880 | 獨立配件 |
| 美國Pagani - PD-1651 — 活動價-單獨購買鋼錶帶 | 11463783 | 71186639 | 138000 | 1,380 | 獨立配件 |
| Datejust — 客製化選項 | 15827664 | 77575450 | 728000 | 7,280 | 客製洽詢 |

本次完整變體審查修正先前漏排的 PD-1661／PD-1651 單獨鋼錶帶。不能用低價或「錶帶／加購」關鍵字直接判為配件：Parnis Submariner 及 DIDUN Nautilus 的加購錶帶變體已包含整錶，仍保留；Dimini 的 NT$1,880 也為完整腕錶。

- 美國Pagani Design - PD-1661（12733186）：12 筆整錶配置，NT$4,680–4,880；單獨鋼錶帶不再進入整錶起價。
- 美國Pagani - PD-1651（11463783）：12 筆整錶配置，NT$6,580；單獨鋼錶帶不再進入整錶起價。

兩筆保留但需確認內容的整錶配套：EOEO `53420747`「備註款式+額外錶帶」NT$3,760；Flieger11 `52853117`「其餘錶帶」NT$4,280。不自行推測或展開其型號／錶帶。

163 個商品依實際變體分成：8 個官網單一款、137 個整錶型號／配套單欄選擇、10 個機芯／鏡面／錶帶單項選擇、8 個真正多欄搭配。原始有 9 個多欄商品，但 DIDUN 八角款的機芯欄只有一值。DIDUN Nautilus 僅有 60 個實際組合，不可生成理論 84 組中的另 24 組。7 個商品的 18 個宣告選項值無對應實際變體，實作以 variants 為準。

## 核對結果及照片使用範圍

- 1,194 筆整錶價格與官方原始 price / 100 一致；選項 tuple 去除首尾空白後全部一致。
- 1,154 筆原始 variant 圖片映射與 40 筆已記錄官方相冊映射均核對一致，所有來源圖片屬於該商品官方相冊。
- 11 個商品的 162 筆配置使用共用參考圖；共用圖片不代表各配置外觀已逐一目視驗證。
- 本次完整核對範圍為資料與來源映射，沒有宣稱 1,194 筆配置皆完成實物或逐部位外觀驗收。
- `available` 僅為官方快照的可選狀態，不當作現貨或交期承諾；清單外客製仍可向 ICH 詢問可行性與報價。

每個商品的最新配置數與整錶價範圍見 [PRODUCT_QC.md](PRODUCT_QC.md)，核對結果與快照雜湊見 [data-audit.json](data-audit.json)。
