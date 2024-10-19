import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  globalShortcut,
} from "electron";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "../preload/preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      // 移除 enableRemoteModule，它在新版本的 Electron 中已被弃用
    },
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  } else {
    // 在开发模式下，等待一段时间再加载 URL
    setTimeout(() => {
      mainWindow?.loadURL("http://localhost:5173");
    }, 1000); // 给 Vite 服务器一些额外的启动时间
  }

  // 添加菜单项
  const template = [
    {
      label: "编辑",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "delete" },
        { type: "separator" },
        { role: "selectAll" },
      ],
    },
    {
      label: "文件",
      submenu: [
        {
          label: "打开目录",
          click: () => {
            openDirectory();
          },
        },
      ],
    },
    {
      label: "开发",
      submenu: [
        {
          label: "打开开发者工具",
          accelerator: "CmdOrCtrl+Option+I",
          click: () => {
            mainWindow?.webContents.openDevTools();
          },
        },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(
    template as Electron.MenuItemConstructorOptions[]
  );
  Menu.setApplicationMenu(menu);

  // 注册全局快捷键
  globalShortcut.register("CmdOrCtrl+Option+I", () => {
    mainWindow?.webContents.openDevTools();
  });

  // 添加打开 DevTools 的功能
  mainWindow.webContents.openDevTools();

  // 移除这行，因为它可能会阻止某些默认行为
  // mainWindow.webContents.on("will-navigate", (event) => {
  //   event.preventDefault();
  // });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// 处理打开目录的请求
async function openDirectory() {
  if (!mainWindow) return;

  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const dirPath = result.filePaths[0];
    const fileTree = await scanDirectory(dirPath);
    mainWindow.webContents.send("directory-scanned", {
      path: dirPath,
      files: fileTree,
    });
  }
}

// 扫描目录
async function scanDirectory(dirPath: string) {
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    const fileTree = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(dirPath, file.name);
        if (file.isDirectory()) {
          const children = await scanDirectory(filePath);
          return {
            name: file.name,
            type: "directory",
            children,
            path: filePath,
          };
        } else {
          return { name: file.name, type: "file", path: filePath };
        }
      })
    );
    return fileTree;
  } catch (error) {
    console.error("Error scanning directory:", error);
    return [];
  }
}

// 监听来自渲染进程的 IPC 消息
ipcMain.handle("open-directory", openDirectory);

// 添加读取文件内容的函数
async function readFile(filePath: string) {
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    console.error("Error reading file:", error);
    return null;
  }
}

// 添加新的 IPC 处理程序
ipcMain.handle("read-file", async (event, filePath) => {
  return await readFile(filePath);
});

// 添加这个函数来处理重试逻辑
function loadURL(window: BrowserWindow, url: string) {
  let attempts = 0;
  const maxAttempts = 10;
  const retryInterval = 1000; // 1秒

  const loadWithRetry = () => {
    window.loadURL(url).catch((err) => {
      if (attempts < maxAttempts) {
        attempts++;
        console.log(
          `Attempt ${attempts} failed. Retrying in ${retryInterval}ms...`
        );
        setTimeout(loadWithRetry, retryInterval);
      } else {
        console.error("Failed to load URL after maximum attempts:", err);
      }
    });
  };

  loadWithRetry();
}

app.on("will-quit", () => {
  // 注销所有快捷键
  globalShortcut.unregisterAll();
});
