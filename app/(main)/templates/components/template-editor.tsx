"use client";

import { useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";

interface TemplateEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TemplateEditor({ value, onChange }: TemplateEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  return (
    <Editor
      height="100%"
      defaultLanguage="latex"
      value={value}
      onChange={(value) => onChange(value || "")}
      onMount={handleEditorDidMount}
      options={{
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineNumbers: "on",
        wordWrap: "on",
        automaticLayout: true,
      }}
      theme="vs-dark"
    />
  );
} 