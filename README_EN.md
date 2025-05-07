👉 [Original Author Blog Post](https://jackle.pro/articles/ai-rewrite-functions-snapshot-solution)
👉 [Original Author Github Repo](https://github.com/chenjackle45/project-snapshot-ai-helper)
👉 [中文版](./README.md)

# Project Snapshot AI Helper

This tool creates a comprehensive snapshot of your project structure, functions, and dependencies, providing AI with the context it needs without consuming excessive tokens. By generating a clear map of your codebase, AI can understand your existing code and seamlessly integrate with it.

---

## 🚀 Features

This tool will:

- Scan your entire project (automatically exclude `node_modules`, `.git`, and other configurable noise)
- Extract functions, methods, components, and hooks from `.js`, `.jsx`, `.ts`, `.tsx`, `.vue` files
- Detect frameworks and provide optimization suggestions
- Organize project dependencies from all package.json files
- Output a comprehensive `snapshot.md` file with project structure, function list, and dependencies
- Support multiple parsing patterns for different code styles and frameworks

---

## 🤔 Why Snapshot?

### Why does AI keep rewriting functions you've already written?

AI doesn't "automatically look at your entire project." It only sees what you provide. If you don't provide context about your existing code, it won't know what functions or tools you've already written, and it will dutifully "reinvent the wheel."

### Common Problems with Existing Solutions

1. **Feeding the entire project to AI**

   - Easily exceeds the context window (especially for large projects)
   - Not precise enough, and AI might still miss important details

2. **Manually organizing documentation**
   - Easy to forget to update
   - Files shared with AI might miss critical parts
   - AI won't know what you missed and might still produce incorrect results

### The Snapshot Solution

Snapshot is a project summary document that can be "organized once and fed to AI once," including:

- Project directory structure
- Functions, components, and hooks with their parameters and comments
- Framework usage and optimization suggestions
- Dependency list across all subprojects

This document acts as a map for AI, letting it know what you've written, what tools you've used, and how everything connects.

---

## 📦 Installation and Usage

1. Place `snapshot.js` in the root directory of your project.

   **Note**: If your `package.json` is set with `"type": "module"`, you cannot directly run `node snapshot.js` because `"type": "module"` uses ESModule instead of CommonJS. To resolve this, rename the file to `snapshot.cjs` and run:

```bash
   node snapshot.cjs
```

2. Run the script:

```bash
   node snapshot.js
   or
   node snapshot.cjs
```

3. Share the generated `snapshot.md` with AI.

---

## 🧮 Supported Parsing Patterns

This tool automatically detects and parses:

- **Controller/Object Pattern**: Methods in `module.exports = {...}` or `export default {...}`
- **Export Function Pattern**: Functions using `export function` or `export const` arrow functions
- **React Components**: Both functional and class components
- **React Hooks**: Custom hook definitions and usage
- **Vue Composition API**: Reactivity primitives (ref, reactive, computed, etc.)
- **Vue Options API**: Methods, computed properties, and watchers
- **TypeScript**: Interfaces, types, and enums

For each function/component, it extracts:

- Name and parameters
- Associated comments (both single-line and JSDoc/multi-line)
- Framework-specific information

## 🧠 Use Cases

- **Developing new features**: Help AI understand what tools are available.
- **Avoid redundant development**: AI won't rewrite the same functions.
- **Provide context across sessions**: AI won't suddenly "forget."
- **Quick onboarding**: Share with new teammates or assistant AI.

---

## 🔧 Customization Suggestions

You can easily customize the tool by modifying:

- `EXCLUDES`: Array of directories and files to skip
- `FILE_EXTENSIONS`: Add support for additional file types
- `MAX_DEPTH`: Control the depth of the directory tree
- `PARSERS`: Add or modify parsing rules for different code patterns

---

## 📄 Example Output Format (`snapshot.md`)

````md
# Project Analysis Snapshot

## Project Overview

- **Analysis date**: 3/1/2023, 10:15:30 AM
- **Detected frameworks**: React, TypeScript, Redux
- **Total files**: 158
- **Functions/components**: 283

### Optimization Suggestions

- Consider using useMemo/useCallback for performance optimization

## Project Directory Structure

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

## Function & Component List

### src/components/Button.tsx

- **Button(props)** [React Component] - Primary button component with customizable styles
- **IconButton(icon, onClick)** [React Component] - Button variant with icon support

### src/hooks/useAuth.ts

- **useAuth(redirectUrl)** [React Hook: useAuth] - Authentication hook that handles login states

## Dependency List

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
````

---

## 🙌 Contributions and Feedback

If you find this project helpful:

- Give Original Author a ⭐️ star! I'm just adding a blanket to the shoulders of giants for a more comfortable ride.
- PRs are welcome: support more languages, comment formats, or interactive interfaces.
- Share your experiences or funny AI cases in Issues 🤖

---

## License

MIT
