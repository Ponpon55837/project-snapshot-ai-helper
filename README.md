👉 [English Version](./README_EN.md)  
👉 [原作者文章](https://jackle.pro/articles/ai-rewrite-functions-snapshot-solution)

# Project Snapshot AI Helper

如果能對專案產生一個「快照」，快照的資訊足以讓 AI 快速進入狀況，但又不會耗很多 token，在很多開發狀況下很好用，也能大幅減少 AI 出乎意料的行為。

---

## 🚀 功能介紹

這支工具會：

- 掃描整個專案（自動排除 `node_modules`、`.git` 等可自訂的雜訊）
- 提取 `.js`、`.jsx`、`.ts`、`.tsx`、`.vue` 檔案中的函式、方法、組件和 Hooks
- 偵測使用的框架並提供優化建議
- 整理所有 package.json 中的套件依賴
- 輸出全面的 `snapshot.md`，包含專案結構、函式清單與依賴清單
- 支援多種解析模式，適用於不同程式碼風格和框架

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

1-1. 將 `snapshot.js` 放在專案根目錄。
1-2. **注意**：如果你的 `package.json` 中設定了 `"type": "module"`，則無法直接執行 `node snapshot.js`，因為 `"type": "module"` 使用的是 ESModule 而非 CommonJS。解決方法是將檔案重新命名為 `snapshot.cjs`，然後執行：

2. 執行腳本：

```bash
node snapshot.js
```

or

```bash
   node snapshot.cjs
```

3. 得到的 `snapshot.md` 貼給 AI。

---

##🧮 支援的解析模式
此工具會自動偵測並解析：

Controller/物件模式：module.exports = {...} 或 export default {...} 中的方法
Export 函式模式：使用 export function 或 export const 箭頭函式定義的函式
React 組件：函數組件和類組件
React Hooks：自定義 Hook 的定義與使用
Vue Composition API：響應式原語（ref、reactive、computed 等）
Vue Options API：方法、計算屬性和監聽器
TypeScript：介面、類型和列舉

對於每個函式/組件，它會提取： 1.名稱和參數 2.相關註解（單行和 JSDoc/多行） 3.框架特定資訊

## 🧠 使用情境舉例

- **開發新功能**：讓 AI 看懂你有哪些工具可以用。
- **避免重複開發**：AI 不會再寫一樣的函式。
- **跨 session 提供 context**：AI 不會突然「失憶」。
- **快速 onboarding**：給新同事或助理 AI 看。
- **程式碼審查**：獲得框架特定的優化建議

---

## 🔧 客製化建議

你可以擴充 `snapshot.js` or `snapshot.cjs` 來支援：

-EXCLUDES：要跳過的目錄和檔案陣列
-FILE_EXTENSIONS：新增支援的檔案類型
-MAX_DEPTH：控制目錄樹的深度
-PARSERS：為不同的程式碼模式新增或修改解析規則

---

## 📄 範例輸出格式（snapshot.md）

````md
# 專案分析快照

## 專案概述

- **分析日期**: 2023/3/1 上午 10:15:30
- **偵測到的框架**: React, TypeScript, Redux
- **檔案總數**: 158
- **函式/組件總數**: 283

### 優化建議

- 考慮使用 useMemo/useCallback 優化效能

## 專案目錄結構

```text
src/
├── components/
│   ├── Button.tsx
│   └── Form.tsx
├── hooks/
│   └── useAuth.ts
└── pages/
    └── Home.tsx
```
````

## 函式與組件清單

### src/components/Button.tsx

- **Button(props)** [React 組件] - 具有可自訂樣式的主要按鈕組件
- **IconButton(icon, onClick)** [React 組件] - 支援圖示的按鈕變體

### src/hooks/useAuth.ts

- **useAuth(redirectUrl)** [React Hook: useAuth] - 處理登入狀態的身份驗證 Hook

## 依賴清單

### project-name

#### dependencies

```json
{
  "react": "^17.0.2",
  "react-dom": "^17.0.2",
  "react-router-dom": "^6.0.0"
}
```

#### devDependencies

```json
{
  "typescript": "^4.5.4",
  "vite": "^2.7.0"
}
```

```
---

## 🙌 貢獻與回報

如果你覺得這專案有幫助：

- 給個 ⭐️ star！
- 歡迎 PR：支援更多語言 / 註解格式 / 互動介面
- 在 Issues 分享你的使用心得或遇到的 AI 搞笑案例 🤖

---

## License

MIT
```
