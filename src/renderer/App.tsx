import React, { useState, useEffect, useMemo } from "react";
import Split from "react-split";
import Welcome from "./components/Welcome";
import FileExplorer from "./components/FileExplorer";
import Editor from "./components/Editor";
import TabBar from "./components/TabBar";

interface OpenFile {
  path: string;
  content: string | null;
  isModified: boolean;
}

interface ElectronAPI {
  onDirectoryScanned: (
    callback: (event: any, data: { path: string; files: any[] }) => void
  ) => void;
  openDirectory: () => Promise<void>;
  readFile: (filePath: string) => Promise<string | null>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

const App: React.FC = () => {
  const [projectDir, setProjectDir] = useState<string | null>(null);
  const [fileTree, setFileTree] = useState<any[]>([]);
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);
  const [splitSizes, setSplitSizes] = useState<number[]>([20, 80]);

  useEffect(() => {
    window.electronAPI.onDirectoryScanned((event, { path, files }) => {
      console.log("Directory scanned:", path, files);
      setProjectDir(path);
      setFileTree(files);
    });
  }, []);

  const handleOpenDirectory = async () => {
    console.log("Opening directory...");
    await window.electronAPI.openDirectory();
  };

  const handleSelectFile = async (filePath: string) => {
    console.log("Selecting file:", filePath);
    if (!openFiles.some((file) => file.path === filePath)) {
      try {
        console.log("Reading file content...");
        const content = await window.electronAPI.readFile(filePath);
        console.log(
          "File content read:",
          content ? "Success" : "Empty or null"
        );
        setOpenFiles((prev) => [
          ...prev,
          { path: filePath, content, isModified: false },
        ]);
      } catch (error) {
        console.error("Error reading file:", error);
        setOpenFiles((prev) => [
          ...prev,
          { path: filePath, content: "Error reading file", isModified: false },
        ]);
      }
    }
    setActiveFile(filePath);
  };

  const handleCloseFile = (filePath: string) => {
    setOpenFiles((prev) => prev.filter((file) => file.path !== filePath));
    if (activeFile === filePath) {
      setActiveFile(openFiles[0]?.path || null);
    }
  };

  const handleContentChange = (filePath: string, newContent: string) => {
    setOpenFiles((prev) =>
      prev.map((file) =>
        file.path === filePath
          ? { ...file, content: newContent, isModified: true }
          : file
      )
    );
  };

  const handleReorderTabs = (newOrder: string[]) => {
    setOpenFiles((prev) => {
      const newOpenFiles = [...prev];
      newOpenFiles.sort(
        (a, b) => newOrder.indexOf(a.path) - newOrder.indexOf(b.path)
      );
      return newOpenFiles;
    });
  };

  const memoizedSplit = useMemo(
    () => (
      <Split
        sizes={splitSizes}
        minSize={100}
        expandToMin={false}
        gutterSize={4}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
        className="flex-1 flex"
        onDragEnd={(sizes) => setSplitSizes(sizes)}
      >
        <div className="overflow-auto bg-gray-800 min-h-0">
          <FileExplorer
            files={fileTree}
            onSelectFile={handleSelectFile}
            selectedFile={activeFile}
            openFiles={openFiles.map((file) => file.path)}
          />
        </div>
        <div className="flex flex-col overflow-hidden min-h-0">
          <TabBar
            openFiles={openFiles}
            activeFile={activeFile}
            onSelectFile={setActiveFile}
            onCloseFile={handleCloseFile}
            onReorderTabs={handleReorderTabs}
          />
          <div className="flex-1 overflow-hidden">
            {activeFile && (
              <Editor
                key={activeFile}
                file={activeFile}
                content={
                  openFiles.find((f) => f.path === activeFile)?.content || ""
                }
                onContentChange={(newContent) =>
                  handleContentChange(activeFile, newContent)
                }
              />
            )}
          </div>
        </div>
      </Split>
    ),
    [splitSizes, fileTree, openFiles, activeFile]
  );

  if (!projectDir) {
    return <Welcome onOpenDirectory={handleOpenDirectory} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      <div className="bg-gray-800 p-2 text-sm">{projectDir}</div>
      <div className="flex-1 flex overflow-hidden">{memoizedSplit}</div>
    </div>
  );
};

export default App;
