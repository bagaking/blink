import React, { useEffect, useRef, useState } from "react";
import { EditorState } from "@codemirror/state";
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
  highlightSpecialChars,
  drawSelection,
  dropCursor,
  rectangularSelection,
  crosshairCursor,
  highlightActiveLineGutter,
} from "@codemirror/view";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab,
} from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import {
  syntaxHighlighting,
  defaultHighlightStyle,
  foldGutter,
  indentOnInput,
  bracketMatching,
  foldKeymap,
} from "@codemirror/language";
import { oneDark } from "@codemirror/theme-one-dark";
import { getLanguageByExtension } from "../config/languageMap";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark as oneDarkTheme } from "react-syntax-highlighter/dist/esm/styles/prism";

interface EditorProps {
  file: string | null;
  content: string | null;
  onContentChange: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ file, content, onContentChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [previewContent, setPreviewContent] = useState<string>("");

  useEffect(() => {
    if (editorRef.current && !viewRef.current) {
      const fileExtension = file ? file.split(".").pop()?.toLowerCase() : "";
      const language = getLanguageByExtension(fileExtension || "");

      const state = EditorState.create({
        doc: content || "",
        extensions: [
          lineNumbers(),
          highlightActiveLineGutter(),
          highlightSpecialChars(),
          history(),
          foldGutter(),
          drawSelection(),
          dropCursor(),
          EditorState.allowMultipleSelections.of(true),
          indentOnInput(),
          bracketMatching(),
          rectangularSelection(),
          crosshairCursor(),
          highlightActiveLine(),
          keymap.of([
            ...defaultKeymap,
            ...historyKeymap,
            ...foldKeymap,
            indentWithTab,
          ]),
          language === "markdown"
            ? markdown({
                base: markdownLanguage,
                codeLanguages: languages,
                addKeymap: true,
              })
            : languages.find((lang) => lang.name === language)?.load() || [],
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
          oneDark,
          EditorView.lineWrapping,
          EditorView.theme({
            "&": {
              height: "100%",
              width: "100%",
            },
            ".cm-scroller": {
              overflow: "auto",
              height: "100%",
            },
            ".cm-content": {
              minHeight: "100%",
            },
          }),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              const newContent = update.state.doc.toString();
              onContentChange(newContent);
              if (language === "markdown") {
                setPreviewContent(newContent);
              }
            }
          }),
        ],
      });

      viewRef.current = new EditorView({
        state,
        parent: editorRef.current,
      });

      // 确保 CodeMirror 编辑器占满其容器
      const resizeObserver = new ResizeObserver(() => {
        viewRef.current?.requestMeasure();
      });
      resizeObserver.observe(editorRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }

    return () => {
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, [file, content]);

  useEffect(() => {
    if (content !== null && viewRef.current) {
      const currentContent = viewRef.current.state.doc.toString();
      if (content !== currentContent) {
        viewRef.current.dispatch({
          changes: { from: 0, to: currentContent.length, insert: content },
        });
      }
    }
    if (file && file.endsWith(".md")) {
      setPreviewContent(content || "");
    }
  }, [content, file]);

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        请选择一个文件进行编辑
      </div>
    );
  }

  const fileExtension = file.split(".").pop()?.toLowerCase();
  const isMarkdown = fileExtension === "md" || fileExtension === "markdown";

  return (
    <div className="h-full flex flex-col bg-gray-900 text-white">
      {isMarkdown ? (
        <div className="flex-1 flex overflow-hidden">
          <div className="w-1/2 h-full overflow-hidden">
            <div ref={editorRef} className="h-full w-full" />
          </div>
          <div className="w-1/2 h-full overflow-auto p-4 prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={oneDarkTheme}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {previewContent}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        <div className="h-full w-full overflow-hidden">
          <div ref={editorRef} className="h-full w-full" />
        </div>
      )}
    </div>
  );
};

export default Editor;
