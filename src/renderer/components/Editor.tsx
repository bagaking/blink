import React, { useEffect, useRef } from "react";
import { EditorState } from "@codemirror/state";
import {
  EditorView,
  keymap,
  lineNumbers,
  highlightActiveLine,
} from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import {
  syntaxHighlighting,
  defaultHighlightStyle,
} from "@codemirror/language";
import { oneDark } from "@codemirror/theme-one-dark";

interface EditorProps {
  file: string | null;
  content: string | null;
  onContentChange: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ file, content, onContentChange }) => {
  console.log("Editor rendering with file:", file);
  console.log("Editor content:", content);

  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    console.log("Editor useEffect triggered");
    if (editorRef.current && !viewRef.current) {
      console.log("Creating new EditorView");
      const state = EditorState.create({
        doc: content || "",
        extensions: [
          lineNumbers(),
          highlightActiveLine(),
          history(),
          keymap.of([...defaultKeymap, ...historyKeymap]),
          markdown({
            base: markdownLanguage,
            codeLanguages: languages,
            addKeymap: true,
          }),
          syntaxHighlighting(defaultHighlightStyle),
          oneDark,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onContentChange(update.state.doc.toString());
            }
          }),
        ],
      });

      viewRef.current = new EditorView({
        state,
        parent: editorRef.current,
      });
    }

    return () => {
      console.log("Editor cleanup");
      viewRef.current?.destroy();
      viewRef.current = null;
    };
  }, []);

  useEffect(() => {
    console.log("Content or file changed:", content, file);
    if (content !== null && viewRef.current) {
      const currentContent = viewRef.current.state.doc.toString();
      if (content !== currentContent) {
        console.log("Updating editor content");
        viewRef.current.dispatch({
          changes: { from: 0, to: currentContent.length, insert: content },
        });
      }
    }
  }, [content, file]);

  if (!file) {
    console.log("No file selected, rendering placeholder");
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        请选择一个文件进行编辑
      </div>
    );
  }

  console.log("Rendering editor");
  return (
    <div className="h-full flex flex-col">
      <div ref={editorRef} className="flex-1 overflow-auto" />
    </div>
  );
};

export default Editor;
