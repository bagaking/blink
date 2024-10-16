const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  // 在这里定义你想要暴露给渲染进程的 API
});
