# 塔羅选錶：翻面、橫掃、碎裂、揭曉

首頁與 `/codex/` 共用 `assets/path-choice.js` / `.css`，由 `path-guidance.js` 提供五種購買方向與推薦商品。維持香水播放至塔羅區結束的設計；不更動手錶拆解、商品型錄資料或 3D 工作台。

## 選牌演出

- 0.00–0.50 秒：選中的牌翻面，四張其餘牌收進左右兩側；手機也可同時看見全部目標。
- 0.62–1.02 秒：第一次橫掃。左側選牌先掃向右、其餘先掃向左。
- 1.04–1.68 秒：反向橫掃；接觸時其餘牌分別碎成有明暗面的方塊。
- 1.68–2.18 秒：選中的牌回到中央，恢復原尺寸。
- 2.58 秒：碎片消散後顯示兩個適合該方向的 ICH 系列：實品照片、參考起價、推薦理由、官網商品連結與本站規格連結。

保留「重新選牌」及演出中的「直接看推薦」。連點不會建立第二段演出；中途重選會清除舊動畫。鍵盤可操作，減少動態偏好或 GSAP 載入失敗時直接揭曉。手機只有高度變化不打斷演出；視窗寬度改變、頁面進入背景時直接完成，避免留下失去定位的畫面。

效果採一次性的 GSAP timeline，最多 240 顆方塊、手機 112 顆；canvas 上限 1280×640，結束及重選均移除。無新增常駐 requestAnimationFrame。牌面微光只在塔羅區可見且未選牌時播放。

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
