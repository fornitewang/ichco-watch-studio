# 配置流程獨立驗收

檢查環境：本機 http://127.0.0.1:8791，Chrome／Playwright，真實DOM按鈕、瀏覽器Clipboard API；2026-09-07。未修改repo。

結果：最新Chrome驗收累計40/40項通過，無JavaScript錯誤。A09／A10修正後另跑14項照片容錯與恢復測試全部通過。新配置演算法對1,194個官網完整tuple逐一驗證，1,194/1,194皆可達。

## 已通過

- A01：MM白NH35整錶6880→黑NH38整錶7580，型號／主圖／網址同步。
- A02：合法下游機芯／錶帶保持原選擇。
- A03：Nautilus機械＋加購棕帶6580，改WK-ST-SBLU(Quartz)後清空下游、價格待選、copys停用，沒有偷偷替換成4880。明確選石英與棕帶後才是66429309／5580。
- A04／A05：soldout fixture保留選定完整款，可查看；官網未列的機械組合disabled且有可見原因，沒有用售完替代不相容。
- A06：Parnis原鋼帶4280／膠帶加購4880／五銖4580共用主圖，scope=shared且caption明確。
- A07：切相簿後scope=gallery，不更改型號與價格；returnSelectedPhoto回正確對應圖。
- A08：縮圖沒有隱性選款副作用。可選的「明確選照片中的款式」功能未提供，按UX規格屬可延期項目。
- A11／A12：pending choices URL重整仍待選；完整variant URL仍回相同型號與售價。
- A13：混合配件與Datejust客製請求項未當成普通完整錶款。
- A14：MM白40mm不顯示黑42mm的3D入口；已映射黑NH38顯示系列示意入口。
- A15：3D預設隱藏可改零件；勾conceptModeToggle才顯示；複製內容是概念搭配需求、配件相容性／防水／報價待確認且無NT價格；切換系列即退出概念模式並重置。
- A16：320／390手機完成Nautilus清空→重選→5580流程，照片保持可見、无水平溢出。
- A17：全量1,194 tuple可達（與程式相同規則的獨立演算法驗證；不是宣稱本輪逐一真人點擊1,194款）。
- 官網單一款不顯示可換按鈕；DIDUN固定MIYOTA機芯欄位顯示文字，只有可變顏色為按鈕。
- 額外需求copyRequest實際寫入clipboard：基準整錶价附「不含下列額外需求」並要求另確認適用、製作、供貨、最終報價。一般copyProduct不混入額外需求文字。

## 照片容錯修正後複驗

兩項問題均已修復，沒有剩餘失敗項。

- A09：移除白色MM 40mm的imageId後，回退黑色系列圖時明確標示unmatched／「沒有獨立照片、系列參考圖」，所選型號與NT6880仍正確，沒有稱成所選款實拍。
- A10：將黑MM主圖強制回HTTP 404後，scope=unavailable，出現可見失敗說明，舊圖opacity=0，已選型號／NT7580不變。
- 錯誤後切白色MM：scope恢復selected、placeholder隱藏、圖opacity=1、imageId91622857、價6880全部同步。
- 桌機1360、手機390與320均通過失敗與恢復。手機圖片框高度保持，320短螢幕仍至少145px，沒有因錯誤塌陷或推出畫面。
- 人工暫緩新圖片回應：載入期間透明隱藏上一款，顯示載入中文字；釋放回應後只顯示新圖片91622852，價格對應6880。

## 證據

- compatibility-browser.json：逐項布林結果、價格、完整型號、URL、photoScope和焦點。
- clipboard.txt：真正由navigator.clipboard.readText讀回的測試內容（未向外部客服傳送）。
- all-variant-reachability.json：全量可達性。
- compatibility-photo-retest.json：14项照片容錯、恢復和載入中狀態複驗。
- missing-photo-fixture-fixed.png、failed-photo-320-fixed.png、recovered-photo-320.png：已修正畫面；原failed fixture截圖保留作歷史證據。
- mobile-320-pending-and-resolved.png、mobile-390-pending-and-resolved.png：手機畫面。

截圖及實際剪貼簿原始證據保存在本機 `ichco-catalog-work/compatibility/qa-independent`。
