import React, { useState } from "react";
import { getFileTypeConfig } from "../config/fileTypes";
import { getLanguageByExtension } from "../config/languageMap";

import Prism from "prismjs";
import "prismjs/themes/prism.css";
// 导入所有你需要支持的语言
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-json";
import "prismjs/components/prism-css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
// 根据需要导入更多语言

interface FileProps {
  name: string;
  type: "file" | "directory";
  path: string;
  children?: FileProps[];
  content?: string; // 添加文件内容属性
}

interface FileExplorerProps {
  files: FileProps[];
  onSelectFile: (filePath: string) => void;
  selectedFile: string | null;
  openFiles: string[];
}

const File: React.FC<
  FileProps & {
    onSelectFile: (filePath: string) => void;
    selectedFile: string | null;
    openFiles: string[];
  }
> = ({
  name,
  type,
  path,
  children,
  content,
  onSelectFile,
  selectedFile,
  openFiles,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleClick = () => {
    if (type === "directory") {
      setIsExpanded(!isExpanded);
    } else {
      onSelectFile(path);
    }
  };

  const isSelected = path === selectedFile;
  const isOpen = openFiles.includes(path);

  const { icon: Icon, color } = getFileTypeConfig(name, type);

  const renderPreview = () => {
    if (!content) return null;
    const language = getLanguageByExtension(name);
    const highlightedCode = Prism.highlight(
      content,
      Prism.languages[language] || Prism.languages.plaintext,
      language
    );
    return (
      <pre className="text-xs mt-2 p-2 bg-gray-100 rounded">
        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      </pre>
    );
  };

  return (
    <div>
      <div
        className={`cursor-pointer hover:bg-gray-100 p-1 flex items-center ${
          type === "file" ? "pl-6" : ""
        } ${isSelected ? "bg-blue-100" : ""} ${
          isOpen ? "text-blue-600 font-semibold" : ""
        }`}
        onClick={handleClick}
        onMouseEnter={() => setShowPreview(true)}
        onMouseLeave={() => setShowPreview(false)}
      >
        <Icon className={`w-4 h-4 mr-2 flex-shrink-0 ${color}`} />
        <span className="truncate flex-grow text-sm">{name}</span>
        {isOpen && (
          <span className="ml-1 text-xs text-blue-500 flex-shrink-0">•</span>
        )}
      </div>
      {showPreview && type === "file" && renderPreview()}
      {type === "directory" && isExpanded && children && (
        <div className="pl-4">
          {children.map((child, index) => (
            <File
              key={index}
              {...child}
              onSelectFile={onSelectFile}
              selectedFile={selectedFile}
              openFiles={openFiles}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const FileExplorer: React.FC<FileExplorerProps> = ({
  files,
  onSelectFile,
  selectedFile,
  openFiles,
}) => {
  return (
    <div className="text-sm p-2 h-full overflow-y-auto">
      {files.map((file, index) => (
        <File
          key={index}
          {...file}
          onSelectFile={onSelectFile}
          selectedFile={selectedFile}
          openFiles={openFiles}
        />
      ))}
    </div>
  );
};

export default FileExplorer;
