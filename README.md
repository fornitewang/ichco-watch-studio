# ICHco 腕錶與工藝

線上網站：https://fornitewang.github.io/ichco-watch-studio/

## 頁面

- `index.html`：手機優先的 300vh 分層故事。GSAP ScrollTrigger 搭配 CSS 3D，以現有 MM 模型輸出的五張透明 PNG 做拆解；首頁不載入 WebGL。
- `studio.html`：原有完整 Three.js 工作台，保留六系列、概念搭配、手機預覽與 AR 入口。`?series=MM#configHead` 可直接開啟對應系列。
- `catalog.html`：163 個官網腕錶商品頁、16 品牌、1,194 組整錶／配套選項。實拍、配置、價格及清單外需求分開呈現。

舊 `index.html?series=…#configHead` 與 AR 參數網址會轉至 `studio.html` 並保留參數；一般首頁與 `?v=` 不轉址。

## 素材與功能界線

五層圖位於 `assets/exploded/`，均為 1000×1200 RGBA、同相機與對位。這是現有模型的結構示意，**不是原廠 NH38 拆解圖或新增實品攝影**。完整疊合與原模型可見區 RGB MAE 為 0.763/255；簡化機芯維持明確標示。PNG 加靜態備援共約 912 KB。

首頁提供向下拆解、向上重組與一鍵操作；支援減少動態偏好，圖片或動畫套件載入失敗時使用完整靜態圖。GSAP 3.13.0 與 ScrollTrigger 同版放在 `assets/vendor/`，保留原始授權標頭與來源 SHA256。

商品價格與庫存為 2026-09-07 官網查核快照。每款只開放實際存在的配置；未列組合不代表不能客製，應另行確認適用性與報價。

## 維護與驗證

首頁樣式／互動：`assets/home.css`、`assets/home.js`。目錄：`assets/catalog.css`、`assets/catalog.js`、`assets/catalog-data.json`。

`studio.html` 沿用原 Artifact 工作台，含三段內嵌 JavaScript 與超長 base64 圖資。修改時使用有唯一錨點的 patch 腳本，保留 CRLF 及內嵌圖資，不用整檔重新格式化。

本機可用 `python -m http.server 8791`。發布前做語法、相應互動與手機視覺檢查，再提交並推送既有 GitHub Pages。不要把使用者未追蹤的 `assets/bg_candidates/` 一併加入。

- [首頁改造與驗證](docs/HOME_EXPERIENCE_REVIEW.md)
- [官方目錄與資料口徑](docs/CATALOG_REVIEW.md)
- [逐款配置規則](docs/COMPATIBILITY_REVIEW.md)

三頁保留 `noindex, nofollow`。網站仍是公開網址，這項設定只要求搜尋引擎不要收錄。
