# Blink 项目初始化过程

本文档详细记录了 Blink 项目的初始化过程，包括环境设置、依赖安装、配置文件创建以及遇到的问题和解决方案。

## 1. 项目初始化

首先，我们创建了项目目录并初始化了 npm 项目：

`bash
mkdir browser
cd browser
pnpm init
`

## 2. 安装依赖

我们安装了以下依赖：

### 开发依赖：

- electron: ^33.0.1
- typescript: ^5.6.3
- react: ^18.3.1
- react-dom: ^18.3.1
- @types/react: ^18.3.11
- @types/react-dom: ^18.3.1
- vite: ^5.4.9
- @vitejs/plugin-react: ^4.3.2
- electron-builder: ^25.1.8
- tailwindcss: ^3.4.14
- postcss: ^8.4.47
- autoprefixer: ^10.4.20
- vite-plugin-electron: ^0.28.8

### 生产依赖：

- @mui/joy: 5.0.0-beta.48
- @emotion/react: ^11.13.3
- @emotion/styled: ^11.13.0

安装命令：

`bash
pnpm add -D electron typescript react react-dom @types/react @types/react-dom vite @vitejs/plugin-react electron-builder tailwindcss postcss autoprefixer vite-plugin-electron
pnpm add @mui/joy @emotion/react @emotion/styled
`

## 3. 配置文件创建

### package.json

更新了 `package.json` 文件，添加了必要的脚本和依赖。主要包括 `dev`、`build`、`lint` 和 `preview` 脚本。

### tsconfig.json 和 tsconfig.node.json

创建了 TypeScript 配置文件，设置了适合 React 和 Electron 开发的编译选项。

### vite.config.ts

配置了 Vite 和 Electron 插件，设置了主进程、预加载脚本和渲染进程的构建选项。

### tailwind.config.js 和 postcss.config.js

配置了 Tailwind CSS 和 PostCSS，用于样式处理。

## 4. 项目结构创建

创建了以下目录结构：

`src/
  main/
    main.ts
  renderer/
    App.tsx
    index.tsx
  preload/
    preload.ts
index.html`

## 5. 主要文件实现

### src/main/main.ts

实现了 Electron 的主进程，包括创建窗口、加载页面和处理应用生命周期事件。

### src/preload/preload.ts

实现了预加载脚本，用于在渲染进程中安全地暴露主进程 API。

### src/renderer/App.tsx 和 index.tsx

实现了 React 应用的主要组件和渲染逻辑。

### index.html

创建了应用的 HTML 入口文件。

### src/renderer/index.css

配置了 Tailwind CSS 的基本样式。

## 6. 遇到的问题和解决方案

1. PostCSS 配置加载失败：

   - 错误信息：`Failed to load PostCSS config: Cannot find module 'tailwindcss'`
   - 解决方案：确保 `tailwindcss` 已正确安装，并在 `postcss.config.js` 中使用 CommonJS 语法。

2. ES 模块兼容性问题：

   - 错误信息：`module is not defined in ES module scope`
   - 解决方案：移除 `package.json` 中的 `"type": "module"`，并确保 `postcss.config.js` 使用 CommonJS 语法。

3. 预加载脚本加载失败：

   - 错误信息：`Unable to load preload script`
   - 解决方案：在 `vite.config.ts` 中为预加载脚本添加特定的构建配置，确保输出为 CommonJS 格式。

4. Electron 应用找不到入口文件：
   - 解决方案：更新 `package.json` 中的 `main` 字段，指向正确的主进程文件路径。

## 7. 最终配置

经过多次调试和修改，我们最终得到了一个可以正常运行的 Electron 应用基础框架。主要的配置文件包括：

- `package.json`：定义了项目的依赖和脚本。
- `vite.config.ts`：配置了 Vite 和 Electron 的构建过程。
- `tsconfig.json` 和 `tsconfig.node.json`：配置了 TypeScript 编译选项。
- `tailwind.config.js` 和 `postcss.config.js`：配置了样式处理。

## 8. 运行项目

使用以下命令运行项目：

`bash
pnpm run dev
`

这个命令会同时启动 Vite 开发服务器和 Electron 应用。

## 9. 后续步骤

- 实现 Markdown 编辑器功能
- 添加文件系统操作
- 实现主进程和渲染进程之间的通信
- 优化用户界面和用户体验

通过这个初始化过程，我们成功搭建了一个基于 Electron、React、TypeScript、Vite 和 Tailwind CSS 的桌面应用框架，为后续的功能开发奠定了基础。
