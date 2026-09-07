# Santos 手機反黑修正與回歸 — 2026-09-07

## 已重現原因
在手機尺寸先選潛水款的「夜光」，再按 Santos 系列卡。旧 `resetSeriesPreview()` 會保留情境 `S.scene=NGT`；Santos 沒有夜光材質，仍被套上幾乎黑暗的環境，拋光殼與整條鏈帶變黑。使用者所稱照片未附入對話，因此這是已實際重現的路徑，不能宣稱與其照片逐像素相同。

證據：`lume-reproduction.json`，`lume-switch-before.png`，`lume-switch-after.png`，`santos-reference-before-after.jpg`。官網實品基準為 Desktop/screenshots/ichco_ref/SAN/69436813.jpeg（2026-09-06 既存官網照）。

## 修正
- Santos 若繼承夜光情境，改回紙棚。夜光按鈕停用並標明「此款無夜光」。故事鏡頭也不會再次強制套夜光。
- 紙棚為 Santos 增加 0.10 的反光板底光，使方形拋光面不只映到暗牆；保留原 metalness=1、粗糙度、幾何、錶帶、藍鋼針與透明玻璃。
- Float32 HDR 線性濾波先檢查 OES_texture_float_linear；不支援時用 NearestFilter，後面仍經 PMREM 預濾。不支援 Float 貼圖的舊 WebGL 裝置沿用 cubemap。
- 產生並綁定新環境貼圖之後才釋放旧 PMREM render target；多材質 mesh 陣列也逐一更新，noEnv 與 keepEnv 保留。

## 聚焦 QC
| 項目 | 判定 | 證據 |
|---|---|---|
| 從其他系列夜光切 Santos，不呈整支黑色 | PASS | before/after 同一 390×844 觸控 UI 路徑，NGT→STU |
| Santos 不提供未配置的夜光 | PASS | disabled=true；按鈕文字「夜光 · 此款無夜光」 |
| 故事鏡頭不重新將 Santos 變黑 | PASS | setSceneOnly(7) 維持 STU |
| 切回潛水款夜光仍正常可選 | PASS | SUB/NGT、hasLume=true、disabled=false |
| 拋光圈／鏈帶保留銀色鏡面高光 | PASS（此變更範圍） | 官網照與 fixed-after-q34 / lume-switch-after 並排；材質金屬性未更動 |
| 藍鋼針／白羅馬面／8 螺絲、殼與帶形 | 未改；既有模型差異仍存在 | buildSantos / santosDial / buildSantosBand 原碼完全未改，固定角度 angles/ |
| 六系列幾何與 UI 回歸 | PASS | geometry-0…5.json：31 PASS，0 FAIL；Santos 方盤像素檢查由既有腳本略過 |
| 嵌入圖片／CRLF 保留 | PASS | integrity.json；所有 >10 KB 長行雜湊相同 |

這次沒有重新認證整個 Santos 模型與官網實品完全一致；既有羅馬字角度、面盤字體、鏈節比例不在本次照明修正中。

## 瀏覽器與材質回歸
`verification.json` 記錄 Chrome 與 WebKit 兩引擎、深／淺兩模式，390×844，每組 24 次情境變換＋六系列檢查。材料 staleEnv=0，沒有 context lost。Chrome 另以 fake-camera 進入 AR 再離開，確保恢復紙棚；不是實機手部姿態驗證。Nearest fallback 透過能力回報 mock 確認濾波值為合法值，不冒稱真的在缺少硬體擴充的手機測過。

Windows Playwright WebKit screenshot 未包含 WebGL 合成層（全頁截圖空白），但直接匯出 drawing buffer 可見手錶，161 draw calls、50,586 triangles、glError=0；證據 webkit-render-buffer.png 與 webkit-probe.json。不能把這當成真實 iPhone Safari 的完整視覺 PASS。

參考：MDN OES_texture_float_linear — https://developer.mozilla.org/en-US/docs/Web/API/OES_texture_float_linear

## Repository evidence

- [Reproduction data](fixes-0907/santos-lume.json)
- [Official reference / before / after](fixes-0907/santos-before-after.jpg)
