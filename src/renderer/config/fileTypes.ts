import { IconType } from "react-icons";
import {
  FaRegFile,
  FaRegFolder,
  FaReact,
  FaHtml5,
  FaCss3,
  FaJs,
  FaPython,
  FaJava,
  FaMarkdown,
  FaFileCode,
  FaFileAlt,
  FaFileImage,
  FaFileVideo,
  FaFileAudio,
  FaFilePdf,
  FaFileArchive,
  FaFileExcel,
  FaFilePowerpoint,
  FaFileWord,
  FaDatabase,
  FaDocker,
  FaGitAlt,
  FaPhp,
  FaRust,
  FaSwift,
  FaTerminal,
  FaCode,
} from "react-icons/fa";
import {
  SiTypescript,
  SiJavascript,
  SiRuby,
  SiCsharp,
  SiKotlin,
  SiLua,
  SiCplusplus,
  SiYaml,
  SiToml,
  SiJson,
  SiGraphql,
  SiJulia,
  SiHaskell,
  SiElixir,
  SiScala,
  SiPerl,
  SiGo,
} from "react-icons/si";

interface FileTypeConfig {
  icon: IconType;
  color: string;
}

const fileTypes: Record<string, FileTypeConfig> = {
  default: { icon: FaRegFile, color: "text-gray-500" },
  folder: { icon: FaRegFolder, color: "text-yellow-500" },
  react: { icon: FaReact, color: "text-blue-400" },
  html: { icon: FaHtml5, color: "text-orange-500" },
  css: { icon: FaCss3, color: "text-blue-500" },
  js: { icon: SiJavascript, color: "text-yellow-400" },
  ts: { icon: SiTypescript, color: "text-blue-600" },
  py: { icon: FaPython, color: "text-green-500" },
  java: { icon: FaJava, color: "text-red-500" },
  md: { icon: FaMarkdown, color: "text-blue-300" },
  txt: { icon: FaFileAlt, color: "text-gray-600" },
  image: { icon: FaFileImage, color: "text-purple-500" },
  video: { icon: FaFileVideo, color: "text-pink-500" },
  audio: { icon: FaFileAudio, color: "text-green-400" },
  pdf: { icon: FaFilePdf, color: "text-red-600" },
  zip: { icon: FaFileArchive, color: "text-orange-400" },
  excel: { icon: FaFileExcel, color: "text-green-600" },
  powerpoint: { icon: FaFilePowerpoint, color: "text-red-400" },
  word: { icon: FaFileWord, color: "text-blue-700" },
  database: { icon: FaDatabase, color: "text-gray-400" },
  docker: { icon: FaDocker, color: "text-blue-400" },
  git: { icon: FaGitAlt, color: "text-orange-600" },
  php: { icon: FaPhp, color: "text-purple-400" },
  rust: { icon: FaRust, color: "text-orange-500" },
  go: { icon: SiGo, color: "text-blue-300" },
  swift: { icon: FaSwift, color: "text-orange-500" },
  shell: { icon: FaTerminal, color: "text-green-300" },
  ruby: { icon: SiRuby, color: "text-red-500" },
  csharp: { icon: SiCsharp, color: "text-purple-600" },
  kotlin: { icon: SiKotlin, color: "text-orange-400" },
  lua: { icon: SiLua, color: "text-blue-400" },
  cpp: { icon: SiCplusplus, color: "text-blue-500" },
  yaml: { icon: SiYaml, color: "text-red-300" },
  toml: { icon: SiToml, color: "text-gray-600" },
  json: { icon: SiJson, color: "text-yellow-300" },
  xml: { icon: FaCode, color: "text-orange-300" },
  graphql: { icon: SiGraphql, color: "text-pink-400" },
  julia: { icon: SiJulia, color: "text-purple-300" },
  haskell: { icon: SiHaskell, color: "text-gray-500" },
  elixir: { icon: SiElixir, color: "text-purple-400" },
  scala: { icon: SiScala, color: "text-red-400" },
  perl: { icon: SiPerl, color: "text-blue-300" },
  bash: { icon: FaTerminal, color: "text-gray-600" },
};

export const getFileTypeConfig = (
  fileName: string,
  type: "file" | "directory"
): FileTypeConfig => {
  if (type === "directory") {
    return fileTypes.folder;
  }

  const extension = fileName.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "js":
    case "jsx":
    case "mjs":
      return fileTypes.js;
    case "ts":
    case "tsx":
      return fileTypes.ts;
    case "py":
    case "pyw":
      return fileTypes.py;
    case "java":
      return fileTypes.java;
    case "html":
    case "htm":
      return fileTypes.html;
    case "css":
    case "scss":
    case "sass":
    case "less":
      return fileTypes.css;
    case "md":
    case "markdown":
      return fileTypes.md;
    case "txt":
      return fileTypes.txt;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "bmp":
    case "svg":
      return fileTypes.image;
    case "mp4":
    case "avi":
    case "mov":
    case "wmv":
      return fileTypes.video;
    case "mp3":
    case "wav":
    case "ogg":
      return fileTypes.audio;
    case "pdf":
      return fileTypes.pdf;
    case "zip":
    case "rar":
    case "7z":
    case "tar":
    case "gz":
    case "bz2":
      return fileTypes.zip;
    case "xls":
    case "xlsx":
    case "csv":
      return fileTypes.excel;
    case "ppt":
    case "pptx":
      return fileTypes.powerpoint;
    case "doc":
    case "docx":
      return fileTypes.word;
    case "sql":
    case "db":
    case "sqlite":
      return fileTypes.database;
    case "dockerfile":
    case "dockerignore":
      return fileTypes.docker;
    case "gitignore":
    case "gitattributes":
      return fileTypes.git;
    case "php":
      return fileTypes.php;
    case "rs":
      return fileTypes.rust;
    case "go":
      return fileTypes.go;
    case "swift":
      return fileTypes.swift;
    case "sh":
    case "bash":
    case "zsh":
    case "fish":
      return fileTypes.shell;
    case "rb":
    case "erb":
      return fileTypes.ruby;
    case "cs":
      return fileTypes.csharp;
    case "kt":
    case "kts":
      return fileTypes.kotlin;
    case "lua":
      return fileTypes.lua;
    case "cpp":
    case "cc":
    case "cxx":
    case "hpp":
    case "hh":
    case "hxx":
      return fileTypes.cpp;
    case "c":
    case "h":
      return fileTypes.cpp; // 使用相同的图标
    case "yml":
    case "yaml":
      return fileTypes.yaml;
    case "toml":
      return fileTypes.toml;
    case "json":
      return fileTypes.json;
    case "xml":
      return fileTypes.xml;
    case "graphql":
    case "gql":
      return fileTypes.graphql;
    case "jl":
      return fileTypes.julia;
    case "hs":
    case "lhs":
      return fileTypes.haskell;
    case "ex":
    case "exs":
      return fileTypes.elixir;
    case "scala":
      return fileTypes.scala;
    case "pl":
    case "pm":
      return fileTypes.perl;
    default:
      return fileTypes.default;
  }
};
