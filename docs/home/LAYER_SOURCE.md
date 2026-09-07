# 首頁手錶五層 PNG

來源：現有 ICHco Three.js MM 預設外觀模型（MM_PRESET），並非官網商品照片，也不是原廠 NH38 拆解圖。

- 1_glass.png：既有鏡面與透明亮邊。
- 2_hands.png：既有時針、分針、秒針、中心軸。
- 3_dial.png：既有錶盤、時標及開心窗邊框。
- 4_gears.png：既有簡化背部機芯與開心窗擺輪／夾橋；應標示「機芯示意」。
- 5_case.png：既有殼體、錶圈、護橋、內座、底蓋與整條錶帶。
- assembled.png：上列五層由下往上疊成的透明靜態圖，供載入／低動態備援。

所有 PNG 均為 1000 × 1200 RGBA；沒有裁切。錶盤中心約為畫布的 50%／44%，建議 CSS transform-origin: 50% 44%。

輸出方式：使用原 WebGL renderer 維持 HDRI 與色調；黑底與白底各渲染一次計算 alpha，各層重算自己的陰影，避免殼體與錶盤殘留離開零件的陰影。PNG 使用 lossless optimize。原有幾何及材質未修改。

full-original.png 是同角度完整原模型，僅供 QA。contact-sheet.jpg 與 qa.json 供檢查，不需要載入前台。

與原完整模型對照的可見區 RGB MAE 為 0.763 / 255；差異集中於扁平合成遮蔽、抗鋸齒與分層陰影。正式 fallback 與動畫零進度使用完全相同五層像素，不會換圖跳位。
