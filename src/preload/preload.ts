const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openDirectory: () => ipcRenderer.invoke("open-directory"),
  onDirectoryScanned: (callback) =>
    ipcRenderer.on("directory-scanned", callback),
  readFile: (filePath) => ipcRenderer.invoke("read-file", filePath),
});
