interface LanguageConfig {
  name: string;
  extensions: string[];
}

const languageMap: LanguageConfig[] = [
  { name: "javascript", extensions: ["js", "jsx", "mjs"] },
  { name: "typescript", extensions: ["ts", "tsx"] },
  { name: "yaml", extensions: ["yml", "yaml"] },
  { name: "markdown", extensions: ["md", "markdown"] },
  { name: "json", extensions: ["json"] },
  { name: "html", extensions: ["html", "htm"] },
  { name: "css", extensions: ["css", "scss", "sass", "less"] },
  { name: "python", extensions: ["py", "pyw"] },
  { name: "java", extensions: ["java"] },
  { name: "c", extensions: ["c", "h"] },
  { name: "cpp", extensions: ["cpp", "hpp", "cc", "hh"] },
  // 可以继续添加更多语言
];

export const getLanguageByExtension = (fileName: string): string => {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (!extension) return "plaintext";

  const language = languageMap.find((lang) =>
    lang.extensions.includes(extension)
  );
  return language ? language.name : "plaintext";
};
