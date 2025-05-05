👉 [中文版](./README.md)  
👉 [Related Blog Post](https://jackle.pro/articles/ai-rewrite-functions-snapshot-solution)

# Project Snapshot AI Helper

If you can generate a "snapshot" of your project, the snapshot provides enough information for AI to quickly understand the context without consuming too many tokens. This is highly useful in many development scenarios and can significantly reduce unexpected AI behavior.

---

## 🚀 Features

This tool will:

- Scan the entire project (automatically exclude `node_modules` / `.git` and other noise)
- Extract function names and comments from `.ts`, `.js`, `.vue` files
- Organize project dependencies
- Output a `snapshot.md` file listing the file structure, function list, and dependencies
- Work seamlessly with prompt templates to help AI integrate with existing logic

---

## 🤔 Why Snapshot?

### Why does AI keep rewriting functions you've already written?

AI doesn't "automatically look at your entire project." It only sees what you provide. If you don't provide it, it won't know what functions or tools you've already written, and it will dutifully "reinvent the wheel."

### Common Problems with Existing Solutions

1. **Feeding the entire project to AI**

   - Easily exceeds the context window (especially for large projects).
   - Not precise enough, and AI might still miss important details.

2. **Manually organizing documentation**

   - Easy to forget to update.
   - Files shared with AI might miss critical parts.
   - AI won't know what you missed and might still produce incorrect results.

### The Snapshot Solution

Snapshot is a project summary document that can be "organized once and fed to AI once," including:

- Project directory structure
- Function list and comments for each file
- Dependency list

This document acts as a map for AI, letting it know what you've written, what tools you've used, and how everything connects.

---

## 📦 Installation and Usage

1. Place `snapshot.js` in the root directory of your project.
2. Run the script:

```bash
node snapshot.js
```

3. Share the generated `snapshot.md` with AI.

---

## 🧠 Use Cases

- **Developing new features**: Help AI understand what tools are available.
- **Avoid redundant development**: AI won't rewrite the same functions.
- **Provide context across sessions**: AI won't suddenly "forget."
- **Quick onboarding**: Share with new teammates or assistant AI.

---

## 🔧 Customization Suggestions

You can extend `snapshot.js` to support:

- Function analysis for Vue `<script setup>`
- Extracting JSDoc comments and type annotations
- Adding path grouping, categorization, and dependency organization
- Generating YAML/JSON formats for specific LLM systems

---

## 📄 Example Output Format (`snapshot.md`)

````md
# snapshot.md

## Project Directory Structure

```text
src/
├── utils/
│   └── math.ts
└── api/
    └── user.ts
```
````

## Function List

### src/utils/math.ts

- **add(a, b)** - Addition function
- **multiply(a, b)** - Multiplication function

### src/api/user.ts

- **getUserInfo(userId)** - Fetch user information
- **updateUser(userId, data)** - Update user data

## Dependency List

### Project Name

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

---

## 🙌 Contributions and Feedback

If you find this project helpful:

- Give it a ⭐️ star!
- PRs are welcome: support more languages, comment formats, or interactive interfaces.
- Share your experiences or funny AI cases in Issues 🤖

---

## License

MIT

```

```
