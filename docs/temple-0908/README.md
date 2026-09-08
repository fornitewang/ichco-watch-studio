# 古希臘神殿首頁、警戒旅伴與手機操作

2026-09-08；變更基準 eb68a2c。

## 完成範圍

- 白底 index.html 改由現有 codex 拆解頁取代。主網址與 codex/ 都可使用同一套神殿視覺；catalog.html 實品型錄及 studio.html 原工作台保留。
- 獨立神殿景片、大理石雕像、薄霧、近景紙雕框，沿原 ScrollTrigger 以不同幅度移動。手錶五層 SVG、羅馬數字、材質與原展開時序保留。
- 新圖以內建 imagegen 產生，轉 WebP 僅壓縮檔案、保留像素尺寸與雕像透明通道。神殿約 164KB、雕像約 188KB；左右雕像共用一份素材。
- 旅人被抓顯示「阿——！」，文字限制於視口內。狗耳朵重新接至頭骨，提起／拖動／拋擲人物時追隨其位置抬頭，豎尾、撐腿、兇狠眼神，分次張嘴並顯示「汪汪！」，放回後緩和。
- 暫停、收起、商品 dialog、分頁隱藏、減少動態仍控制兩個角色；僅文字反應，未加音訊。
- 3D 入口移除 #configHead 與強制 storyDone，不再略過序章；原 72 張 HERO_FRAMES、CH 故事鏡頭、油畫與 AR scripts 保留。使用者已開始操作時，晚到的 load 不拉回頂端。
- 工作台規格按鈕保留 DOM、先顯示選取回饋，再合併排程模型更新；相同情境沿用仍有效的 PMREM，依場景及 HDR 來源檢查，不使用已銷毀環境。
- 手機穩定章節高度，網址列伸縮不重排；畫布尺寸未變不重設 renderer；勾號預留寬度；預覽下移 16px，預留乾淨空隙。
- 型錄選項保留所點按鈕的畫面位置；同一張已載入照片不再先隱藏後重載。

## 保護內容與驗證

- assets/catalog-data.json 与基準逐字相同（僅正規化換行比較）；商品原文、價格、規格、有效搭配不變。
- studio.html 的原 HERO_FRAMES、CH、buildWatch 至 applyScene 之前的模型建構區間、最後兩支油畫／AR scripts 相同。
- index.html 的 watch 元件與基準 codex/index.html 相同；新增背景不修改手錶圖層。
- Chrome 與 Windows WebKit：桌面 1440×1000、手機 390×844、橫向 844×390；背景素材、連動、對焦、標註、溢出與錯誤檢查。
- 76 項主要檢查、18 項補驗通過。手機入口 scrollY=0、storyOn=true、storyDone=false、heroImgs=72；預覽頁首間距 16.5px；選規格後捲動差 0px。
- 補驗型錄所選按鈕的畫面位置、共用照片不閃爍、拖曳不誤開行李箱、雙擊僅開一次、喊叫不裁切、商品 dialog 暫停角色。
- 已親看桌面神殿、手機完整拆解、WebKit 手機首頁、原工作台序章及選項區、狗站姿／警戒／追蹤／坐姿放大圖；耳朵、嘴、尾巴接合正常。
- 以上手機為瀏覽器模擬與 Chrome CDP 原生觸控事件，不宣稱實體 iPhone 測試。未修改模型幾何，不宣稱重跑完整官方實品 QC。

本機腳本與完整截圖：C:\Users\kkgod\ichco-catalog-work\temple-0908\。
baseline.cjs、qa.cjs、focused.cjs；結果在 qa/baseline.json、report.json、focused-report.json。
本次未動 assets/bg_candidates/ 既有素材。

## 圖片檔案與生成提示

使用內建 imagegen，未使用 API CLI。生成來源保存在 C:\Users\kkgod\.codex\generated_images\01a077e1-0d2c-7cf2-8e55-33e7d0dcff37\。
網站資產：assets/temple-sanctuary.webp、assets/temple-oracle.webp；不是 ICH 實品照片，屬概念場景美術。

### temple-sanctuary.webp

Create one premium landscape website background image, aspect ratio 3:2, as a layered ancient Greek sanctuary seen straight on. It will sit BEHIND a luxury brass watch in the center, so preserve a VERY DARK calm spacious negative-space center occupying 50% width, with no watch, no lettering, no logo, no clock. Deep charcoal black marble, oxidized brass undertones, cool silvery faint moonlight and ethereal mist. On far left and far right receding weathered Doric columns, fragmented pediments, ancient worn stone stairs low in frame, a mysterious distant narrow doorway deep in the middle that remains subtle and dark. Style: sophisticated theatrical cut-paper diorama with 5 distinctly overlapping silhouette planes, paper-cut edges and tactile paper thickness, but the marble surfaces have believable stone veins, chips, pores and photographic sculptural lighting. Quiet haunted sacred atmosphere, subtle uncanny archaeological silence, dreamlike and solemn, no gore, no jump scare, no people or statues in this background (they will be separate foreground assets). Strong cinematic depth and luxurious restrained art direction, smoky charcoal, aged ivory highlights only around the extreme edges. No bright feature behind central typography or product. Make the architecture genuinely ancient Greek (Doric stone columns, Greek entablatures), not Gothic or Roman cathedral arches. Finished high-resolution artwork, no border, no UI.

### temple-oracle.webp

One isolated full-height ancient Greek marble statue of a solemn draped female oracle on a short broken stone plinth, viewed three-quarter with face and torso turned slightly to the RIGHT (she will stand on the LEFT side of a website looking inward). Portrait composition, entire sculpture including top of head and plinth visible with generous transparent margin. REAL TRANSPARENT ALPHA background, no scenery, no floor, no shadow outside silhouette, no text. Classical carved ivory-gray marble with subtly eroded nose and empty unpainted stone eyes, calm uncanny expression, wavy carved hair, flowing deeply carved peplos fabric, holding a small closed unmarked tablet near waist. Covered body. No living human skin. Artistic style combines highly believable sculptural stone texture and elegant dramatic museum rim lighting from upper right with a handcrafted paper-cut collage silhouette: subtly beveled layered cut-paper edge, like a premium theatrical diorama. Marble has realistic fine veins, chips and age but tasteful, not crumbling. Cool pale gray midtones with faint antique gold reflected highlights, deep charcoal carved creases. Greek temple atmosphere, mysterious and ethereal, subtly haunting but no violence or gore. This is a foreground cutout for a dark luxury watch website, no watch or accessories, no extra disconnected pieces. High detail, sharply preserved alpha edges.
