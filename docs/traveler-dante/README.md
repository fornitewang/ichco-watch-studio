# 旅伴與《神曲》文案改版

工作範圍：四個頁面的原創敘事、小旅人與行李箱的賽璐璐外觀、棕白色成犬哈士奇與互動。
官方 catalog-data.json、catalog.js 商品描述輸出、系列資料表及商品照片維持原樣，以雜湊比對驗證。

## 文學研究與寫作界線

研讀《地獄篇》第一、三十四歌，《煉獄篇》第一、二十七、三十三歌及《天堂篇》第三十三歌的關鍵段落；參照哥倫比亞大學 Digital Dante 的解說。
採用「迷途中的引路、逐步上行、回望與重新啟程、重見星辰」構成原創中文敘事。
不將本站文案偽稱為但丁原句，不把品牌或商品描述成《神曲》的歷史產物，也不把購買比喻成救贖。
操作、價格、相容性與商品資訊保留清楚直接的語言。

研究來源：
- https://www.gutenberg.org/files/1004/1004-h/1004-h.htm （Longfellow 公共領域譯本）
- https://digitaldante.columbia.edu/dante/divine-comedy/inferno/inferno-1/
- https://digitaldante.columbia.edu/dante/divine-comedy/inferno/inferno-34/
- https://digitaldante.columbia.edu/dante/divine-comedy/purgatorio/purgatorio-1/
- https://digitaldante.columbia.edu/dante/divine-comedy/purgatorio/purgatorio-33/
- https://digitaldante.columbia.edu/dante/divine-comedy/paradiso/paradiso-33/

哈士奇是原創旅行夥伴，不是《神曲》中預言獵犬的角色移植。

## 完成內容與驗證

- 人物、行李箱與成年棕白哈士奇皆為原創 SVG 賽璐璐插畫，使用平塗與明確陰影色塊。
- 人物具平常／驚訝／用力／空中／落地／眨眼六種表情，以及抬手、張腿、落地緩衝、揮手回應。
- 行李箱以握把為旋轉支點，拖動時延遲擺動；手與拉桿保持接合。
- 哈士奇會同行、注意被抓住的人物、追趕、受驚後退、嗅聞。點擊循環搖尾巴／坐下／小跳，人物揮手回應。
- 單點人物不跳頁，雙擊／雙點維持開啟官方行李箱分類；拖曳與取消手勢不觸發導覽。
- 暫停、收起、商品對話框、分頁不可見與減少動態設定，同步作用於兩個角色。
- 四頁共套用 72 組經審閱的原創文案替換。實際對照在 copy-map.json。

驗證結果：
- Chrome 與 Windows WebKit：20 組頁面／尺寸驗證、24 項互動檢查通過。
- Chrome 原生觸控事件：17 項手機操作、靜止偏好、尾巴接合與資料保護補驗通過。
- 全程無 JavaScript 錯誤、水平溢出。手機為瀏覽器模擬，未宣稱真機測試。
- catalog-data.json、catalog.js 及 studio.html 的全部模型／系列資料 script 經正規化換行後雜湊確認未變。
- 首頁精選商品區塊含商品名稱、照片、價格與搭配數量亦確認未變。
- 已看過各表情姿勢對照圖、四頁手機首屏、捲動後文案，以及坐姿尾巴修正後截圖。
- 本機完整證據：ichco-catalog-work/traveler/cel-qa/。
