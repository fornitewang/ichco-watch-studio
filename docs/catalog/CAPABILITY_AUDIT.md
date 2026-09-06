# ICH 逐商品可選搭配能力審查

資料基準：2026-09-07 已下載的官網 snapshot。未重新抓網頁，未修改網站。範圍為 163 個腕錶商品、1,199 筆原始變體。

「固定」只表示官網目前列出一個整錶選项；「未列」不表示 ICH 不能客製。清單外需求應先洽詢可製作項目、搭配相容性與報價。

## 分類結論

| 類別 | 商品數 | 可直接採用的顯示方式 |
|---|---:|---|
| 官網列出單一整錶款 | 8 | 顯示該款與價格，不產生假的零件選擇 |
| 單欄整錶型號／色款／配套選擇 | 137 | 保留完整型號，切換相應實拍與完整價格 |
| 單欄部件／搭配選擇 | 10 | 僅顯示官網該欄：機芯、鏡面或錶帶 |
| 真正有兩欄以上可變選項 | 8 | 依現有 variant 組合限制各欄，使用配套價格 |
| 合計 | 163 | |

原始欄位數有 9 個多欄商品，但 DIDUN 經典八角大三針腕錶的機芯欄只有一個值，實質是單欄色款選擇。147 個單欄商品不可一律叫「只能換顏色」：其中 10 個明確提供單項錶帶／機芯／鏡面選擇。

1,199 筆變體 = 1,194 筆保留的整錶／配套 + 4 筆獨立配件 + 1 筆明確客製洽詢。1,194 筆中有 2 筆需要補明確款式，仍保留為整錶配套。全部 `available:true` 只代表 snapshot 中官網可選，不表示現貨。

## 四筆獨立配件與一筆客製洽詢

| 商品 | Product ID | Variant ID | 原始 price（分） | NT$ | 處理 |
|---|---:|---:|---:|---:|---|
| ICHCO Customize Carbon Tattoo 碳紋系列-客製錶Seikomod — 選配真碳纖圈 | 15197426 | 70332384 | 148000 | 1,480 | 從整錶選項及起價排除，另列配件 |
| ICHco customize Seikomod MarinaMilitare 義大利海軍系列 — Buckle | 14542045 | 69109906 | 45000 | 450 | 從整錶選項及起價排除，另列配件 |
| 美國Pagani Design - PD-1661 — 活動價-單獨鋼錶帶 | 12733186 | 71186538 | 88000 | 880 | 從整錶選項及起價排除，另列配件 |
| 美國Pagani - PD-1651 — 活動價-單獨購買鋼錶帶 | 11463783 | 71186639 | 138000 | 1,380 | 從整錶選項及起價排除，另列配件 |
| Datejust — 客製化選項 | 15827664 | 77575450 | 728000 | 7,280 | 洽詢需求，不能當作確定外觀的整錶 |

這份完整變體審查修正先前「只有 MM／Carbon 兩筆配件」的判讀；另外兩筆是 PD-1661 與 PD-1651 的明示單獨鋼錶帶。

## 9 個原始多欄商品

### 瑞士Parnis Marina Militare 111海軍系列手上鍊機械錶（14146634）

- 官方欄位 `搭配錶帶款式` → 建議名稱「搭配錶帶款式」：棕色麂皮、深棕色爆裂紋、藍色壓紋、棕色壓紋、黑色壓紋、矽膠直版、三板鋼錶帶。
- 官方欄位 `面盤樣式` → 建議名稱「面盤樣式」：經典MM、福字。
- 官網實際 14 組／欄位笛卡兒組合 14 組。
- 7種錶帶 × 2種面盤，共14組官網變體；僅限該商品所列組合。
- 不能把7種錶帶視為全站通用，也未列機芯、錶殼或指針選擇。
- [官方商品頁](https://www.ichco.com.tw/products/parnis-marina-militare-111)

### PARNIS - 飛行員/葡萄牙系列（12754901）

- 官方欄位 `color ` → 建議名稱「整錶款式」：葡萄牙系列黑面、葡萄牙系列白面。
- 官方欄位 `錶扣款式` → 建議名稱「錶扣款式」：針扣、折疊扣。
- 官網實際 4 組／欄位笛卡兒組合 4 組。
- 黑面／白面 × 針扣／折疊扣，共4組。
- 針扣NT$3,980，折疊扣NT$4,280；直接使用完整variant價格。
- [官方商品頁](https://www.ichco.com.tw/products/parnis-飛行員-葡萄牙系列)

### 瑞士Parnis - MM441S（12754535）

- 官方欄位 `color ` → 建議名稱「錶帶款式」：白線黑色壓紋、藍色壓紋、棕色壓紋、棕色無紋、淺棕瘋馬皮、直版硅膠。
- 官方欄位 `錶扣款式` → 建議名稱「錶扣款式」：標配大板扣、更換蝴蝶扣。
- 官網實際 12 組／欄位笛卡兒組合 12 組。
- 6種錶帶 × 標配大板扣／更換蝴蝶扣，共12組。
- 大板扣NT$5,380，蝴蝶扣NT$5,780；只有該頁的6種錶帶有已列配套。
- [官方商品頁](https://www.ichco.com.tw/products/瑞士parnis-mm441s)

### PARNIS - Submariner（12733565）

- 官方欄位 `color ` → 建議名稱「整錶款式」：黑圈GMT款、可樂圈(紅黑)GMT款、百事可樂(藍紅)GMT款、Batman(藍黑)GMT款。
- 官方欄位 `Material` → 建議名稱「錶帶方案」：原裝鋼帶、加購專用膠帶、五銖鋼帶。
- 官網實際 12 組／欄位笛卡兒組合 12 組。
- 4種GMT外觀 × 3種錶帶方案，共12組。
- 原裝鋼帶NT$4,280、加購專用膠帶NT$4,880、五銖鋼帶NT$4,580。加購方案價格包含整錶，不是單買膠帶。
- [官方商品頁](https://www.ichco.com.tw/products/parnis-submariner)

### DIDUN - 經典八角大三針腕錶 油壓格紋面盤（12728036）

- 官方欄位 `Material` → 建議名稱「機芯」：機械機芯(MIYOTA 821A)。此欄只有一值，顯示為固定資訊。
- 官方欄位 `Color` → 建議名稱「整錶型號」：AUTO-RGBL、AUTO-RGBB、AUTO-RGCC、AUTO-RGWH、AUTO-RGRG、AUTO-SBL、AUTO-SBB、AUTO-SWH、AUTO-BBF、AUTO-BBW、AUTO-GWH、AUTO-GBL、AUTO-SRGW、AUTO-SRGB。
- 官網實際 14 組／欄位笛卡兒組合 14 組。
- 原始有2欄，但Material只有「機械機芯(MIYOTA 821A)」一個值；真正可變欄只有14種Color型號。
- 機芯顯示為固定資訊；不可呈現石英／其他Miyota等未列的機芯切換。
- [官方商品頁](https://www.ichco.com.tw/products/didun-經典八角大三針腕錶-油壓格紋面盤)

### 瑞士Parnis伯尼時 Explorer探險家系列-機械錶（12344142）

- 官方欄位 `型號` → 建議名稱「型號」：EXPOII-SWH、EXPOII-SBC。
- 官方欄位 `錶帶樣式` → 建議名稱「錶帶樣式」：三板帶、五銖帶。
- 官網實際 4 組／欄位笛卡兒組合 4 組。
- 2種型號 × 三板帶／五銖帶，共4組；均NT$4,780。
- 款式選項與錶帶只在本商品內配對，未列任意零件互換。
- [官方商品頁](https://www.ichco.com.tw/products/swiss-parnis-explorerii)

### 美國 DIDUN - Nautilus鸚鵡螺系列（11469380）

- 官方欄位 `color ` → 建議名稱「型號」：ST-BLA、ST-BLU、ST-GR、RG-BLU、RG-BLA、TIF-BLUE、SS-ST-BLA(Quartz)、SS-ST-RGBR(Quartz)、SS-ST-RGBLA(Quartz)、WK-ST-RGBLU(Quartz)、WK-ST-RGBRN(Quartz)、WK-ST-BLA(Quartz)、WK-ST-RGBLA(Quartz)、WK-ST-SBLU(Quartz)。
- 官方欄位 `Material` → 建議名稱「機芯」：日製石英、日本星辰Miyota機械。
- 官方欄位 `錶帶選擇` → 建議名稱「錶帶選擇」：原配色鋼錶帶、加購-白線黑底皮錶帶、加購-白線棕底皮錶帶。
- 官網實際 60 組／欄位笛卡兒組合 84 組。
- 原始14種型號 × 2種機芯 × 3種錶帶看似84組，實際只有60組，24組不存在。
- ST-BLA、ST-BLU、ST-GR、RG-BLU、RG-BLA、TIF-BLUE等6種型號可選日製石英／日本星辰Miyota機械。
- 其餘8種名稱含(Quartz)的SS-/WK-型號僅列日製石英，每型號3種錶帶。
- 石英原鋼帶NT$4,880／加購皮帶NT$5,580；機械原鋼帶NT$5,880／加購皮帶NT$6,580。加購價是整錶配套價格。
- [官方商品頁](https://www.ichco.com.tw/products/didun-nautilus-classic)

### 瑞士Parnis - Yacht 系列（11448751）

- 官方欄位 `color ` → 建議名稱「整錶款式」：YACHT-ARG BLACK、YACHT-ARG BROWN、YACHT-HG BLACK、YACHT-HG BLUE、YACHT-HG SILVER、YACHT-HRG BLACK、YACHT-HRG BROWN、YACHT-S BLACK、YACHT-S BLACKBLUE、YACHT-S BROWN、YACHT-SBR BLUE、YACHT-SS BLUE、YACHT-SS BROWN。
- 官方欄位 `watch strap ` → 建議名稱「錶帶方案」：搭配鋼帶、搭配黑色素面矽膠帶。
- 官網實際 26 組／欄位笛卡兒組合 26 組。
- 13種整錶款式 × 搭配鋼帶／搭配黑色素面矽膠帶，共26組；均NT$6,380。
- 型號中的金屬色和錶面色是整錶款式一部分，不再拆成可任意互換的零件。
- [官方商品頁](https://www.ichco.com.tw/products/swiss-parnis-yacht)

### 瑞士Parnis - 經典潛航者Submariner-水鬼系列（11447486）

- 官方欄位 `color ` → 建議名稱「整錶款式」：質感黑、綠黑、森林綠、海洋藍、紅咖啡、經典黑白。
- 官方欄位 `watch strap ` → 建議名稱「錶帶方案」：原裝三版帶、五珠鍊鋼帶。
- 官網實際 12 組／欄位笛卡兒組合 12 組。
- 6种外觀 × 原裝三版帶／五珠鍊鋼帶，共12組；均NT$4,580。
- 沒有機芯、鏡面、夜光或指針的獨立可选欄。清單外需求可洽詢，不能直接生成報價。
- [官方商品頁](https://www.ichco.com.tw/products/swiss-parnis-classic-submariner)

## 必須阻止的實例

- DIDUN Nautilus：`SS-ST-BLA(Quartz)` + `日本星辰Miyota機械` + 任一錶帶沒有對應 variant，不能選、不能用其他型號的價格代算。名稱含 `(Quartz)` 的 8 款全都如此，合計 24 個不存在的组合。只有六款 ST/RG/TIF 基本型號同時列出兩種機芯。
- DIDUN 經典八角大三針：`Material` 只有 `機械機芯(MIYOTA 821A)`，不能因為有機芯欄就加上石英、NH35 或 8N24。
- ICHco MM：`NH35-40mm-*` 與 `NH38-42mm-*` 是完整型號。官網未列 40mm＋NH38 為直接可選组合，不可拆出泛用尺寸與機芯選單自動生成。
- Santos：8215 機芯對應密底，NH35 對應透底；底蓋不是另外一個自由配對欄。
- Parnis Submariner「加購專用膠帶」是整錶配套：NT$4,880 已包含 GMT 整錶，不能當成單買膠帶，也不能再加一遍基本錶價。DIDUN Nautilus 的加購皮帶同理。

## 同頁不同型號的規格差異

- **ICHco customize Seikomod MarinaMilitare 義大利海軍系列**：同系列不同機芯與尺寸。切換完整型號同步切換尺寸、機芯及實拍；不可另提供40mm+NH38為可直接報價組合。
  - NH38-42mm-：機芯 NH38；尺寸 42mm。
  - NH35-40mm-：機芯 NH35；尺寸 40mm。
  - [官方證據](https://www.ichco.com.tw/products/ichco-customize-seikomod-marinamilitare)；JSON 保存完整 evidence 字串。
- **ICHco - Santos 山度士系列 Seikomod customized watch**：同系列機芯決定底蓋。底蓋隨機芯自動切換；不可做獨立的密底／透底欄產生未列配套。
  - Miyota 8215 機芯：機芯 MIYOTA 8215；底蓋 密底。
  - Seiko NH35 機芯：機芯 SEIKO NH35；底蓋 透底。
  - [官方證據](https://www.ichco.com.tw/products/ich-co-santos)；JSON 保存完整 evidence 字串。
- **美國FOSSIL - Machine系列三眼計時錶-FS4552/FS4682**：同系列不同直徑。型號標成color亦須解讀為整錶型号；不可整頁固定45mm。
  - FS4682(42mm)／FS4656(42mm)：尺寸 42mm。
  - 其餘實際variants：尺寸 45mm。
  - [官方證據](https://www.ichco.com.tw/products/fossil-machine-chronograph)；JSON 保存完整 evidence 字串。
- **美國FOSSIL - ME2262/BQ2219**：多系列混合在單頁，不同尺寸與機芯類型。依段落／型號配規格；BQ標題寫Mechanical但規格寫Quartz，保留官網原文或標需確認，不擅自糾正為機械。
  - ME1138／ME1137／ME1136／ME1135／ME1163／ME1164：尺寸 44 mm；機芯 Mechanical Twist。
  - BQ2218／BQ2219：尺寸 48 mm；機芯 Quartz；錶帶寬 26 mm。
  - [官方證據](https://www.ichco.com.tw/products/美國fossil-me2262-bq2219)；JSON 保存完整 evidence 字串。
- **美國 PAGANI DESIGN - GMT系列**：名為GMT系列但含不同機芯與功能的整錶型號。名稱中的GMT不能套全部型号；型號未映射前顯示分型号官方規格，不平鋪成通用規格。
  - PD-1706：直徑 42mm；機芯 Paerl DG5833A GMT [Automatic mechanical movement] Case。
  - PD-1671：直徑 42mm；機芯 Seiko NH35A / Miyota 8215 automatic movement。
  - PD-1718：官網Dial Diameter 39.5mm；機芯 Japan Seiko VK64；類型 Quartz。
  - [官方證據](https://www.ichco.com.tw/products/美國-pagani-design-gmt系列)；JSON 保存完整 evidence 字串。
- **美國Fossil - ME3078 機械女錶**：女錶同頁包含38／40／36mm不同型號。按型号段落切換規格；Set變體是套組，不以單只規格代表整套。
  - ME3086/ME3069/ME3136/ME3089/ME3109/ME3065/ME3067：直徑 約38mm。
  - ME3078/ME3085/ME3084/ME3075：直徑 Ø 40.00 mm。
  - BQ3265：直徑 36 millimetres。
  - [官方證據](https://www.ichco.com.tw/products/o)；JSON 保存完整 evidence 字串。

## 保留但需要確認細節的變體

- EOEO - 滾珠磁吸設計錶：`53420747`「備註款式+額外錶帶」，原始 price=376000，NT$3,760。備註款式＋額外錶帶未綁定明確型號與錶帶；保留整錶套裝，需確認內容。不得自行展開成所有錶帶。
- 瑞士Parnis - Flieger11：`52853117`「其餘錶帶」，原始 price=428000，NT$4,280。其餘錶帶未指明是哪一款，需確認款式與適用搭配。不得自行展開成所有錶帶。

## 關鍵字完整審查與過期欄位值

- 已掃描全部 1199 個 variant 標題；配件／單買／選配／加購／單獨／only／strap／band／buckle／bracelet／錶帶／錶扣等命中 171 筆，分布在 24 商品。每筆已在 JSON 的 `keywordAudit.records` 保存精確 ID、原價、原文、分類與理由。
- 分類不使用低價門檻：Dimini 的 NT$1,880 仍為完整腕錶，不能因便宜而排除。也不因出現 band／錶帶／加購就排除，必須看是否明示獨立販售。
- `options_with_values` 有 7 個商品、18 個宣告值找不到對應實際 variant。前端應從 variants 取得可選值，或以實際 variants 過濾宣告值：

- 12933997：FS5550, FS5554（無實際 variant）。
- 12933951：ME3110（無實際 variant）。
- 12754811：玫瑰金款（無實際 variant）。
- 12732207：HB1513092, HB1513093（無實際 variant）。
- 12728221：VK-SBBW, VK-SBLW, VK-GBL, VK-GWH, VK-RGBL, VK-RGBB, VK-RGCC, VK-SGBLG, S-VK-SHWH（無實際 variant）。
- 12247919：FS5264（無實際 variant）。
- 12246542：HGSWH, AGWH（無實際 variant）。

## 可直接落實的規則

1. 先把明確配件 ID 和客製洽詢 ID 分開；整錶起價只從剩餘整錶變體計算。
2. 以去除首尾空白後的 `variant.options` 建立允許組合。沒有 variant 的组合不顯示為可直接購買；不建立全欄位笛卡兒乘積。
3. 只剩一個整錶 variant 就是「官網列出一款」。有多個 variant，只有一個欄位有多值則是單欄；兩個以上欄位有多值才是多欄搭配。
4. 只有一值的欄位顯示為規格，不製造選擇感。切換任一欄位後，以其他已選值篩出仍有對應 variant 的選項。
5. 每次確認選擇必須精確對上一個 variant ID，再更新實拍、價格、規格及官方連結；不使用全站通用加價。
6. 型號欄即使官方叫 color，也可能是完整型號、機芯、尺寸或套組。保留完整名稱，不拆字猜零件相容性。
7. 已明確對應型號的規格隨選擇改變；多型號原文沒有明確映射時保留上下文，不能用整页第一个尺寸／機芯作通用規格。
8. 清單外客製提供「向 ICH 確認其他搭配」入口；不寫「無法客製」，也不承諾能任意換零件。
9. 檢查顯示的價格是 matched variant 的 `priceRaw / 100`，保留原始分數值以便核對。
10. `available` 是官網資料的可選狀態；實際庫存／交期仍依 ICH 回覆，不轉換成現貨承諾。

## 檔案

- `capability-audit.json`：分類統計、163款能力表、全部可用variant組合、9款多欄限制、4配件、1洽詢、2待明確款式、171筆關鍵字審查、7款過期選項，以及6組型號規格差異證據。
- 本文所有判斷使用已保存官網snapshot；沒有建立新SKU或推測零件相容性。
