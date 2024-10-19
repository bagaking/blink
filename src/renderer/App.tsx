import React, { useState, useEffect } from "react";
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

const App: React.FC = () => {
  const [projectDir, setProjectDir] = useState<string | null>(null);
  const [fileTree, setFileTree] = useState<any[]>([]);
  const [openFiles, setOpenFiles] = useState<OpenFile[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);

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
        setOpenFiles((prev) => {
          const newOpenFiles = [
            ...prev,
            { path: filePath, content, isModified: false },
          ];
          console.log("Updated openFiles:", newOpenFiles);
          return newOpenFiles;
        });
      } catch (error) {
        console.error("Error reading file:", error);
        setOpenFiles((prev) => [
          ...prev,
          { path: filePath, content: "Error reading file", isModified: false },
        ]);
      }
    }
    setActiveFile(filePath);
    console.log("Active file set to:", filePath);
  };

  const handleCloseFile = (filePath: string) => {
    console.log("Closing file:", filePath);
    setOpenFiles((prev) => {
      const newOpenFiles = prev.filter((file) => file.path !== filePath);
      console.log("Updated openFiles after closing:", newOpenFiles);
      return newOpenFiles;
    });
    if (activeFile === filePath) {
      const newActiveFile = openFiles[0]?.path || null;
      setActiveFile(newActiveFile);
      console.log("New active file set to:", newActiveFile);
    }
  };

  const handleContentChange = (filePath: string, newContent: string) => {
    console.log("Content changed for file:", filePath);
    setOpenFiles((prev) => {
      const newOpenFiles = prev.map((file) =>
        file.path === filePath
          ? { ...file, content: newContent, isModified: true }
          : file
      );
      console.log("Updated openFiles after content change:", newOpenFiles);
      return newOpenFiles;
    });
  };

  const handleReorderTabs = (newOrder: string[]) => {
    console.log("Reordering tabs:", newOrder);
    setOpenFiles((prev) => {
      const newOpenFiles = [...prev];
      newOpenFiles.sort(
        (a, b) => newOrder.indexOf(a.path) - newOrder.indexOf(b.path)
      );
      console.log("Updated openFiles after reordering:", newOpenFiles);
      return newOpenFiles;
    });
  };

  const activeFileContent = openFiles.find(
    (file) => file.path === activeFile
  )?.content;
  console.log(
    "Active file content:",
    activeFileContent ? "Exists" : "Null or undefined"
  );

  console.log("App rendering, openFiles:", openFiles);
  console.log("App rendering, activeFile:", activeFile);

  if (!projectDir) {
    return <Welcome onOpenDirectory={handleOpenDirectory} />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <div className="bg-gray-800 text-white p-2 text-sm">{projectDir}</div>
      <div className="flex-1 flex overflow-hidden">
        <Split
          sizes={[20, 80]}
          minSize={100}
          expandToMin={false}
          gutterSize={4}
          gutterAlign="center"
          snapOffset={30}
          dragInterval={1}
          direction="horizontal"
          cursor="col-resize"
          className="flex-1 flex"
        >
          <div className="overflow-auto bg-white">
            <FileExplorer
              files={fileTree}
              onSelectFile={handleSelectFile}
              selectedFile={activeFile}
              openFiles={openFiles.map((file) => file.path)}
            />
          </div>
          <div className="overflow-hidden flex flex-col">
            <div className="flex-shrink-0">
              <TabBar
                openFiles={openFiles}
                activeFile={activeFile}
                onSelectFile={setActiveFile}
                onCloseFile={handleCloseFile}
                onReorderTabs={handleReorderTabs}
              />
            </div>
            {activeFile && (
              <div className="flex-grow overflow-auto">
                <Editor
                  file={activeFile}
                  content={activeFileContent || ""}
                  onContentChange={(newContent) =>
                    activeFile && handleContentChange(activeFile, newContent)
                  }
                />
              </div>
            )}
          </div>
        </Split>
      </div>
    </div>
  );
};

export default App;
