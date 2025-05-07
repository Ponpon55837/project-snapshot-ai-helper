/**
 * snapshot.js
 * 用途：掃描任意 JS/TS/Vue/React 專案，輸出專案結構、函式清單與依賴清單至 snapshot.md
 * 使用方式：在專案根目錄執行 `node snapshot.js`
 * 僅依賴 Node.js 內建模組：fs, path
 */

///////////////////////////////////////
// 1. 可編輯設定區
///////////////////////////////////////

/**
 * 要排除掃描的檔案或資料夾（相對於專案根目錄）
 * 使用者可自行新增或移除
 */
const EXCLUDES = ['node_modules', '.git', 'dist', 'build', 'coverage', '.next', '.nuxt'];

/** 支援的檔案副檔名，可按需擴充 */
const FILE_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.vue'];

/** 目錄樹最大深度，0 或 null 表示不限 */
const MAX_DEPTH = 3;

/** 解析規則：針對不同框架和語法模式 */
const PARSERS = {
  // CommonJS & ES Module 匯出物件模式
  controller: {
    test: /(?:module\.exports\s*=\s*|\bexport\s+default\s*)\{/,
    regex: /(\w+)\s*:\s*(?:async\s*)?function\s*(?:\w*)\s*\(([^)]*)\)/g,
    comment: /\/\*\*\s*([\s\S]*?)\s*\*\/|\/\/\s*(.*)/
  },
  // ES Module 函式匯出模式
  export: {
    test: /export\s+(?:async\s+)?(?:function|const)/,
    regex: /export\s+(?:async\s+)?function\s+(\w+)\s*\(([^)]*)\)|export\s+const\s+(\w+)\s*=\s*(?:async\s*)?\(?([^)]*)\)?\s*=>/g,
    comment: /\/\*\*\s*([\s\S]*?)\s*\*\/|\/\/\s*(.*)/
  },
  // React 函數組件
  reactFunctional: {
    test: /(?:function|const)\s+([A-Z]\w*)\s*(?:=|\()/,
    regex: /(?:function|const)\s+([A-Z]\w*)\s*(?:=\s*(?:React\.)?(?:memo|forwardRef)?\(?(?:function)?\s*\(?([^)]*)\)?|=|\(([^)]*)\))/g,
    comment: /\/\*\*\s*([\s\S]*?)\s*\*\/|\/\/\s*(.*)/
  },
  // React 類組件
  reactClass: {
    test: /class\s+[A-Z]\w*\s+extends\s+(?:React\.)?Component/,
    regex: /class\s+([A-Z]\w*)\s+extends\s+(?:React\.)?Component/g,
    comment: /\/\*\*\s*([\s\S]*?)\s*\*\/|\/\/\s*(.*)/
  },
  // React Hooks
  reactHooks: {
    test: /(?:^|\s)use[A-Z]\w*\s*=/,
    regex: /(?:const|let)\s+(\w+)\s*=\s*use([A-Z]\w*)\(([^)]*)\)/g,
    comment: /\/\*\*\s*([\s\S]*?)\s*\*\/|\/\/\s*(.*)/
  },
  // Vue 3 Composition API
  vueComposition: {
    test: /(?:setup\s*\(|defineComponent\s*\()/,
    regex: /(?:const|let)\s+(\w+)\s*=\s*(?:ref|reactive|computed|watch|inject)\(([^)]*)\)/g,
    comment: /\/\*\*\s*([\s\S]*?)\s*\*\/|\/\/\s*(.*)/
  },
  // Vue Options API 方法
  vueOptions: {
    test: /(?:methods|computed|watch)\s*:\s*\{/,
    regex: /(\w+)\s*(?::\s*(?:async\s*)?function\s*\(([^)]*)\)|:\s*\(([^)]*)\)\s*=>)/g,
    comment: /\/\*\*\s*([\s\S]*?)\s*\*\/|\/\/\s*(.*)/
  },
  // TypeScript 介面與類型定義
  typeDefinition: {
    test: /(?:interface|type|enum)\s+\w+/,
    regex: /(?:export\s+)?(?:interface|type|enum)\s+(\w+)(?:\s+extends\s+(\w+))?/g,
    comment: /\/\*\*\s*([\s\S]*?)\s*\*\/|\/\/\s*(.*)/
  }
};

///////////////////////////////////////
// 2. 引入 Node 內建模組
///////////////////////////////////////
const fs = require('fs');
const path = require('path');

///////////////////////////////////////
// 3. 判斷是否排除路徑
///////////////////////////////////////
function isExcluded(filePath) {
  return EXCLUDES.some((ex) => filePath.includes(ex));
}

///////////////////////////////////////
// 4. 遞迴掃描檔案
///////////////////////////////////////
function scanFiles(dir, fileList = [], depth = 0) {
  if (!fs.existsSync(dir)) return fileList;

  const entries = fs.readdirSync(dir);
  for (const name of entries) {
    const fullPath = path.join(dir, name);
    if (isExcluded(fullPath)) continue;

    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        scanFiles(fullPath, fileList, depth + 1);
      } else if (FILE_EXTENSIONS.includes(path.extname(name).toLowerCase())) {
        fileList.push(fullPath);
      }
    } catch (err) {
      console.warn(`無法訪問 ${fullPath}: ${err.message}`);
    }
  }
  return fileList;
}

///////////////////////////////////////
// 5. 解析檔案中函式／方法／組件
///////////////////////////////////////
function parseFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const fileType = path.extname(filePath).toLowerCase();
    const results = [];

    // 對每個解析器測試該檔案
    Object.entries(PARSERS).forEach(([type, parser]) => {
      if (!parser.test.test(content)) return;

      // 分析多行內容而非單行
      parser.regex.lastIndex = 0;
      let match;
      const fileContent = content;
      while ((match = parser.regex.exec(fileContent)) !== null) {
        // 取出名稱與參數，根據不同解析器調整
        let name,
          params,
          extra = '';

        if (type === 'reactFunctional') {
          name = match[1];
          params = match[2] || match[3] || '';
          extra = 'React組件';
        } else if (type === 'reactClass') {
          name = match[1];
          params = '';
          extra = 'React類組件';
        } else if (type === 'reactHooks') {
          name = match[1];
          const hookName = match[2];
          params = match[3] || '';
          extra = `React Hook: use${hookName}`;
        } else if (type === 'vueComposition') {
          name = match[1];
          params = match[2] || '';
          extra = 'Vue Composition API';
        } else if (type === 'typeDefinition') {
          name = match[1];
          params = match[2] ? `extends ${match[2]}` : '';
          extra = 'TypeScript定義';
        } else {
          name = match[1] || match[3];
          params = match[2] || match[4] || '';
        }

        // 尋找相關的註釋
        let comment = extractComment(content, match.index);

        results.push({
          name,
          params,
          comment,
          type,
          extra
        });
      }
    });

    return results;
  } catch (err) {
    console.warn(`解析 ${filePath} 時發生錯誤：${err.message}`);
    return [];
  }
}

///////////////////////////////////////
// 5.1 從檔案中提取註釋
///////////////////////////////////////
function extractComment(content, position) {
  // 查找位置前的最近註釋 (多行或單行)
  const contentBefore = content.substring(0, position);
  const lines = contentBefore.split(/\r?\n/);

  // 從最後一行開始往上搜尋註釋
  for (let i = lines.length - 1; i >= 0; i--) {
    // 檢查單行註釋
    const singleLineMatch = lines[i].match(/\/\/\s*(.*)/);
    if (singleLineMatch) return singleLineMatch[1].trim();

    // 如果發現非空白行但不是註釋，則停止搜尋
    if (lines[i].trim() && !lines[i].trim().startsWith('*') && !lines[i].trim().startsWith('/*')) {
      break;
    }
  }

  // 搜尋多行註釋
  const multiLineRegex = /\/\*\*\s*([\s\S]*?)\s*\*\//g;
  let lastComment = null;
  let match;

  while ((match = multiLineRegex.exec(contentBefore)) !== null) {
    lastComment = match[1].replace(/^\s*\*\s*/gm, '').trim();
  }

  return lastComment || '';
}

///////////////////////////////////////
// 6. 生成 ASCII 目錄樹
///////////////////////////////////////
function buildTree(dir, prefix = '', depth = 1) {
  if (MAX_DEPTH && depth > MAX_DEPTH) return '';

  let tree = '';
  try {
    const entries = fs
      .readdirSync(dir)
      .filter((name) => !isExcluded(path.join(dir, name)))
      .sort();

    entries.forEach((name, idx) => {
      const fullPath = path.join(dir, name);
      let isDir = false;

      try {
        isDir = fs.statSync(fullPath).isDirectory();
      } catch (err) {
        console.warn(`無法訪問 ${fullPath}: ${err.message}`);
        return;
      }

      const connector = idx === entries.length - 1 ? '└── ' : '├── ';
      tree += `${prefix}${connector}${name}\n`;

      if (isDir) {
        const newPrefix = prefix + (idx === entries.length - 1 ? '    ' : '│   ');
        tree += buildTree(fullPath, newPrefix, depth + 1);
      }
    });
  } catch (err) {
    console.warn(`構建目錄樹時出錯 (${dir}): ${err.message}`);
  }

  return tree;
}

///////////////////////////////////////
// 7. 搜尋各子專案的 package.json
///////////////////////////////////////
function findPackages(dir, list = []) {
  if (!fs.existsSync(dir)) return list;

  try {
    const entries = fs.readdirSync(dir);
    for (const name of entries) {
      const fullPath = path.join(dir, name);
      if (isExcluded(fullPath)) continue;

      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          findPackages(fullPath, list);
        } else if (name === 'package.json') {
          list.push(fullPath);
        }
      } catch (err) {
        console.warn(`無法訪問 ${fullPath}: ${err.message}`);
      }
    }
  } catch (err) {
    console.warn(`搜尋 package.json 時出錯 (${dir}): ${err.message}`);
  }

  return list;
}

///////////////////////////////////////
// 8. 檢測專案框架
///////////////////////////////////////
function detectFrameworks(depsMap) {
  const frameworks = new Set();

  Object.values(depsMap).forEach(({ dependencies, devDependencies }) => {
    const allDeps = { ...dependencies, ...devDependencies };

    // 檢查主要框架
    if (allDeps.react) frameworks.add('React');
    if (allDeps.vue) frameworks.add('Vue');
    if (allDeps.angular) frameworks.add('Angular');
    if (allDeps.svelte) frameworks.add('Svelte');

    // 檢查狀態管理
    if (allDeps.redux || allDeps['react-redux']) frameworks.add('Redux');
    if (allDeps.mobx || allDeps['mobx-react']) frameworks.add('MobX');
    if (allDeps.recoil) frameworks.add('Recoil');
    if (allDeps.vuex) frameworks.add('Vuex');
    if (allDeps.pinia) frameworks.add('Pinia');

    // 檢查UI庫
    if (allDeps['@mui/material'] || allDeps['@material-ui/core']) frameworks.add('Material UI');
    if (allDeps['antd'] || allDeps['@ant-design/icons']) frameworks.add('Ant Design');
    if (allDeps.bootstrap || allDeps['react-bootstrap']) frameworks.add('Bootstrap');
    if (allDeps.tailwindcss) frameworks.add('TailwindCSS');

    // 檢查路由
    if (allDeps['react-router-dom']) frameworks.add('React Router');
    if (allDeps['vue-router']) frameworks.add('Vue Router');

    // 檢查構建工具
    if (allDeps.webpack) frameworks.add('Webpack');
    if (allDeps.vite) frameworks.add('Vite');
    if (allDeps.rollup) frameworks.add('Rollup');
    if (allDeps.esbuild) frameworks.add('esbuild');
    if (allDeps['@nextjs/core'] || allDeps.next) frameworks.add('Next.js');
    if (allDeps.nuxt) frameworks.add('Nuxt.js');

    // 檢查TypeScript
    if (allDeps.typescript) frameworks.add('TypeScript');
  });

  return [...frameworks];
}

///////////////////////////////////////
// 9. 分析與提示框架特定知識點
///////////////////////////////////////
function getFrameworkTips(frameworks, functionsFound) {
  const tips = [];

  if (frameworks.includes('React')) {
    const hasHooks = functionsFound.some((f) => f.type === 'reactHooks');
    const hasClass = functionsFound.some((f) => f.type === 'reactClass');

    if (hasHooks && hasClass) {
      tips.push('* 此專案同時使用 React Hooks 和類組件，考慮統一使用 Hooks 風格');
    }

    if (!functionsFound.some((f) => f.name === 'useMemo' || f.name === 'useCallback')) {
      tips.push('* 考慮使用 useMemo/useCallback 優化效能');
    }
  }

  if (frameworks.includes('Vue')) {
    const hasComposition = functionsFound.some((f) => f.type === 'vueComposition');
    const hasOptions = functionsFound.some((f) => f.type === 'vueOptions');

    if (hasComposition && hasOptions) {
      tips.push('* 此專案混用 Vue Composition API 與 Options API，考慮統一API風格');
    }
  }

  if (frameworks.includes('TypeScript')) {
    if (!functionsFound.some((f) => f.type === 'typeDefinition')) {
      tips.push('* TypeScript 專案中未找到自定義類型，考慮增加介面或類型定義提高型別安全');
    }
  }

  return tips;
}

///////////////////////////////////////
// 10. 主流程：掃描、解析、組合 Markdown
///////////////////////////////////////
function main() {
  console.log('開始分析專案...');
  const root = process.cwd();

  // 目錄樹
  console.log('生成目錄結構...');
  const tree = buildTree(root);

  // 掃描所有檔案並解析函式
  console.log('解析程式碼...');
  const files = scanFiles(root);
  const funcMap = {}; // filePath -> [ {name, params, comment}, ... ]
  const allFunctions = [];

  files.forEach((fp) => {
    const rel = path.relative(root, fp);
    const funcs = parseFile(fp);
    if (funcs.length) {
      funcMap[rel] = funcs;
      allFunctions.push(...funcs);
    }
  });

  // 收集依賴
  console.log('分析專案依賴...');
  const pkgFiles = findPackages(root);
  const depsMap = {}; // projectName -> { dependencies, devDependencies }
  pkgFiles.forEach((pf) => {
    try {
      const data = JSON.parse(fs.readFileSync(pf, 'utf-8'));
      const proj = data.name || path.basename(path.dirname(pf));
      depsMap[proj] = {
        dependencies: data.dependencies || {},
        devDependencies: data.devDependencies || {}
      };
    } catch (err) {
      console.warn(`解析 ${pf} 時發生錯誤：${err.message}`);
    }
  });

  // 檢測使用的框架
  const frameworks = detectFrameworks(depsMap);
  const frameworkTips = getFrameworkTips(frameworks, allFunctions);

  // 組合 Markdown
  let md = '# 專案分析快照\n\n';

  // 0. 專案概述
  md += '## 專案概述\n\n';
  md += `* **分析日期**: ${new Date().toLocaleString()}\n`;
  md += `* **偵測到的框架**: ${frameworks.join(', ') || '未檢測到主流框架'}\n`;
  md += `* **檔案總數**: ${files.length}\n`;
  md += `* **函式/組件總數**: ${allFunctions.length}\n\n`;

  if (frameworkTips.length > 0) {
    md += '### 優化建議\n\n';
    frameworkTips.forEach((tip) => {
      md += `${tip}\n`;
    });
    md += '\n';
  }

  // 1. 專案目錄結構
  md += '## 專案目錄結構\n\n';
  md += '```text\n' + tree + '```\n\n';

  // 2. 函式與組件清單
  md += '## 函式與組件清單\n\n';
  for (const [file, funcs] of Object.entries(funcMap)) {
    md += `### ${file}\n`;
    funcs.forEach((f) => {
      const extraInfo = f.extra ? ` [${f.extra}]` : '';
      md += `- **${f.name}(${f.params})**${extraInfo}${f.comment ? ' - ' + f.comment : ''}\n`;
    });
    md += '\n';
  }

  // 3. 依賴清單
  md += '## 依賴清單\n\n';
  for (const [proj, info] of Object.entries(depsMap)) {
    md += `### ${proj}\n\n`;
    md += '#### dependencies\n';
    if (Object.keys(info.dependencies).length) {
      md += '```json\n' + JSON.stringify(info.dependencies, null, 2) + '\n```\n';
    } else {
      md += '無\n';
    }
    md += '\n#### devDependencies\n';
    if (Object.keys(info.devDependencies).length) {
      md += '```json\n' + JSON.stringify(info.devDependencies, null, 2) + '\n```\n';
    } else {
      md += '無\n';
    }
    md += '\n';
  }

  // 輸出至 snapshot.md
  fs.writeFileSync(path.join(root, 'snapshot.md'), md, 'utf-8');
  console.log('✅ 已成功生成 snapshot.md');
}

// 執行主流程
main();
