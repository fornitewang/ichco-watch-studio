# 塔羅選錶：翻面、閃電、粉化、揭曉

2026-09-11 更新：摧毀方式改為橫向閃電，選中牌保持中央；以下是現行節奏。

首頁與 `/codex/` 共用 `assets/path-choice.js` / `.css`，由 `path-guidance.js` 提供五種購買方向與推薦商品。維持香水播放至塔羅區結束的設計；不更動手錶拆解、商品型錄資料或 3D 工作台。

## 選牌演出

- 0.00–0.50 秒：選中的牌翻面，四張其餘牌收進左右兩側；手機也可同時看見全部目標。
- 0.56 秒開始：由選中牌兩側放出橫向分岔閃電，先擊中近側、再抵達遠側卡牌。
- 各牌擊中後約 0.43 秒：牌身保留完整，冰藍電流沿牌面分岔竄動，亮點沿電路移動。
- 約 1.03–1.63 秒：各牌由上而下快速粉化；每張牌的消散耗時 0.50 秒，細粉沿消散邊緣飄離。
- 1.72–2.15 秒：唯一留下的選中牌恢復原尺寸。
- 2.45 秒：粉末散去後顯示兩個適合該方向的 ICH 系列：實品照片、參考起價、推薦理由、官網商品連結與本站規格連結。

保留「重新選牌」及演出中的「直接看推薦」。連點不會建立第二段演出；中途重選會清除舊動畫。鍵盤可操作，減少動態偏好或 GSAP 載入失敗時直接揭曉。手機只有高度變化不打斷演出；視窗寬度改變、頁面進入背景時直接完成，避免留下失去定位的畫面。

效果採一次性的 GSAP timeline，最多 864 粒細粉、手機 480 粒，實際同時存在更少；canvas 上限 1280×640，結束及重選均移除。閃電用小範圍描邊，不用全頁閃光或模糊濾鏡；僅四張小卡牌做由上而下的裁切。無新增常駐 requestAnimationFrame。牌面微光只在塔羅區可見且未選牌時播放。

## 自動播放調速（2026-09-11）

在 `assets/journey-beats.js` 調整 seconds，原始滾動拆解順序與各節點終點不變。

| 節點 | 調整前 | 現行 |
|---|---:|---:|
| 06 流星穿越 | 約 9.32 秒 | 5.60 秒 |
| 08 機芯浮現 | 約 3.25 秒 | 1.90 秒 |
| 09 完整機芯停留 | 約 3.46 秒 | 0.90 秒 |
| 10 機芯展開 | 約 6.06 秒 | 4.20 秒 |

完整機芯仍會先出現、停留，再展開；其餘動畫節點與手動回看維持原本設定。

## 商品參考起價

2026-09-10 讀取 ICH 公開商品頁，核對系列起價（TWD）；商品選項、加購、庫存及最新成交價以官網為準。沒有把加購零件價格當成整只手錶價格。

| 系列 | 參考起價 | 官網 |
|---|---:|---|
| Datejust | NT$7,280 | https://www.ichco.com.tw/products/ichco-datejust-seikomod |
| Polar-Prospector | NT$8,980 | https://www.ichco.com.tw/products/ichco-polar-prospector-customized-watch- |
| Santos | NT$5,880 | https://www.ichco.com.tw/products/ich-co-santos |
| Carbon Tattoo | NT$7,580 | https://www.ichco.com.tw/products/ichco-customize-carbon-tattoo-seikomod |
| Royal skeleton | NT$7,680 | https://www.ichco.com.tw/products/ichco-seikomod-royal-skeleton |
| Samurai | NT$7,880 | https://www.ichco.com.tw/products/ichco-samurai |

卡牌是選購方向，不是心理測驗、人格判定或占卜預測。沒有為各款錶杜撰不存在的通用配置。
