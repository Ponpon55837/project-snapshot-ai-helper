# Project Snapshot AI Helper

Auto-generate a markdown snapshot of your project structure and functions, so your AI coding assistant won’t keep reinventing the wheel.

> 自動產生專案快照（snapshot.md），幫助 AI 快速了解你寫過什麼，少講話、多做事。

---

## 🚀 功能介紹

這支工具會：

- 掃描整個專案（自動排除 node_modules / .git 等雜訊）
- 提取所有 `.ts`, `.js`, `.vue` 檔案中的函式名稱
- 輸出一份 `snapshot.md`，列出檔案與函式清單
- 搭配 prompt 模板使用，讓 AI 輕鬆串接既有邏輯

---

## 📦 安裝與使用

1. 將 `snapshot.js` 放在專案根目錄
2. 執行腳本：

```bash
node snapshot.js
```

3. 得到的 `snapshot.md` 貼給 AI

---

## 🧠 使用情境舉例

- 開發新功能時讓 AI 看懂你有哪些工具可以用
- 避免 AI 重複開發你已寫過的邏輯
- 跨 session 提供 context，AI 不會突然「失憶」
- 快速 onboarding 給新同事或助理 AI 看

---

## 🔧 客製化建議

你可以擴充 `snapshot.js` 來支援：

- Vue `<script setup>` 的函式分析
- 提取 JSDoc 註解與型別說明
- 加上路徑群組、分類、依賴整理
- 產生 YAML / JSON 等格式給特定 LLM 系統使用

---

## 📄 範例輸出格式（snapshot.md）

```md
# snapshot.md

## src/utils/math.ts

- `add()`
- `multiply()`

## src/api/user.ts

- `getUserInfo()`
- `updateUser()`
```

---

## 🪄 靈感來源

這個工具誕生於跟 AI 的真實開發日常，當專案變大、功能複雜時，AI 常常「忘記」你已經寫過的東西 —— 我們需要一份讓 AI 也能看懂的文件，而不是只寫給人類的 README。

---

## 🙌 貢獻與回報

如果你覺得這專案有幫助：

- 給個 ⭐️ star！
- 歡迎 PR：支援更多語言 / 註解格式 / 互動介面
- 在 Issues 分享你的使用心得或遇到的 AI 搞笑案例 🤖

---

## License

MIT
