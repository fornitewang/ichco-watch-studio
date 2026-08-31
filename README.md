# ICHco 客製錶工作台

季氏進口貿易（ICHco．Parnis 台灣代理．SeikoMod 客製）的互動式配置器。
一頁式捲動故事，用 Three.js 即時渲染，可以自由換錶面、錶框、錶帶、指針、機芯。

**線上版**：https://fornitewang.github.io/ichco-watch-studio/

## 這份檔案怎麼來的

`index.html` 是把原本發佈在 Claude Artifact 的頁面搬成獨立網頁。

原檔是**片段**，沒有 `<!doctype>`／`<html>`／`<body>`——Artifact 的發佈流程會自動補一層外框。
搬到 GitHub Pages 必須自己把那層補回來，否則版面會走樣（body 會有預設邊界、
字級與底色都不一樣）。補的內容就是 `index.html` 開頭那段：charset、viewport、
`color-scheme: light`、`body{margin:0}`、`img{max-width:100%}`、`[hidden]`。

## 不給搜尋引擎收錄

`index.html` 裡有一行：

```html
<meta name="robots" content="noindex, nofollow">
```

這頁目前是給家人看的，所以先擋掉 Google 收錄。**要讓客人搜得到就把那一行刪掉**，
重新 push 即可。（網址本身仍是公開的，任何拿到連結的人都打得開。）

## 怎麼改

改完 `index.html` 直接推上來，GitHub Pages 約一分鐘後生效：

```bash
git add -A && git commit -m "..." && git push
```

## 注意

- 全部內嵌在單一 HTML（含 5 張 base64 貼圖），2.8 MB，第一次開會稍慢
- 外部只依賴 Google Fonts 與 cdnjs 的 three.js r134
- `CylinderGeometry` 預設 `openEnded=false` 會自動加上下蓋，改 3D 零件時要注意，
  這個坑讓錶面和透底背蓋各被遮死過一次
