👉 [English Version](./README_EN.md)  
👉 [部落格文章](https://jackle.pro/articles/ai-rewrite-functions-snapshot-solution)

# Project Snapshot AI Helper

如果能對專案產生一個「快照」，快照的資訊足以讓 AI 快速進入狀況，但又不會耗很多 token，在很多開發狀況下很好用，也能大幅減少 AI 出乎意料的行為。

---

## 🚀 功能介紹

這支工具會：

- 掃描整個專案（自動排除 `node_modules` / `.git` 等雜訊）
- 提取所有 `.ts`, `.js`, `.vue` 檔案中的函式名稱與註解
- 整理專案使用的套件依賴
- 輸出一份 `snapshot.md`，列出檔案結構、函式清單與依賴清單
- 搭配 prompt 模板使用，讓 AI 輕鬆串接既有邏輯

---

## 🤔 為什麼需要 Snapshot？

### AI 為什麼老是重寫你已經寫過的功能？

AI 並不會「自己去看你的整個專案」，它只看你丟給它的內容。如果你沒提供，它自然不知道你有哪些函式、工具已經寫好，只能盡責地「自作主張」再寫一次。

### 常見解法的問題

1. **整包都餵給 AI**

   - 容易超過 context window（尤其是大型專案）。
   - 不夠精準，AI 仍可能忽略重要資訊。

2. **手動整理文件**
   - 容易忘記同步更新。
   - 拉給 AI 的檔案可能遺漏重要部分。
   - AI 無法知道你漏了什麼，仍可能亂寫。

### Snapshot 的解決方案

Snapshot 是一份能「一次整理、一次餵 AI」的專案摘要文件，包含：

- 專案目錄結構
- 每個檔案的函式清單與註解
- 套件依賴清單

這份文件就像是給 AI 的地圖，讓它知道你寫過哪些東西、用了哪些工具、怎麼接起來。

---

## 📦 安裝與使用

1. 將 `snapshot.js` 放在專案根目錄。

   **注意**：如果你的 `package.json` 中設定了 `"type": "module"`，則無法直接執行 `node snapshot.js`，因為 `"type": "module"` 使用的是 ESModule 而非 CommonJS。解決方法是將檔案重新命名為 `snapshot.cjs`，然後執行：

   ```bash
   node snapshot.cjs
   ```

2. 執行腳本：

```bash
node snapshot.js
```

3. 得到的 `snapshot.md` 貼給 AI。

---

## 🧠 使用情境舉例

- **開發新功能**：讓 AI 看懂你有哪些工具可以用。
- **避免重複開發**：AI 不會再寫一樣的函式。
- **跨 session 提供 context**：AI 不會突然「失憶」。
- **快速 onboarding**：給新同事或助理 AI 看。

---

## 🔧 客製化建議

你可以擴充 `snapshot.js` 來支援：

- Vue `<script setup>` 的函式分析
- 提取 JSDoc 註解與型別說明
- 加上路徑群組、分類、依賴整理
- 產生 YAML / JSON 等格式給特定 LLM 系統使用

---

## 📄 範例輸出格式（snapshot.md）

````md
# snapshot.md

## 專案目錄結構

```text
src/
├── utils/
│   └── math.ts
└── api/
    └── user.ts
```

## 函式清單

### src/utils/math.ts

- add(a, b) - 加法函式
- multiply(a, b) - 乘法函式

### src/api/user.ts

- getUserInfo(userId) - 獲取使用者資訊
- updateUser(userId, data) - 更新使用者資料

## 依賴清單

### 專案名稱

#### devDependencies

```json
{
  "typescript": "^4.0.0"
}
```

#### dependencies

```json
{
  "axios": "^0.21.1"
}
```
````

---

## 🙌 貢獻與回報

如果你覺得這專案有幫助：

- 給個 ⭐️ star！
- 歡迎 PR：支援更多語言 / 註解格式 / 互動介面
- 在 Issues 分享你的使用心得或遇到的 AI 搞笑案例 🤖

---

## License

MIT
