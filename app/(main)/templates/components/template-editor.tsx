"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TemplateEditorProps {
  html: string;
  css: string;
  onHtmlChange: (value: string) => void;
  onCssChange: (value: string) => void;
}

export function TemplateEditor({ html, css, onHtmlChange, onCssChange }: TemplateEditorProps) {
  const [activeTab, setActiveTab] = useState<"html" | "css">("html");
  
  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "html" | "css")} className="flex-grow flex flex-col">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="css">CSS</TabsTrigger>
        </TabsList>
        
        <TabsContent value="html" className="flex-grow data-[state=active]:flex flex-col">
          <Editor
            height="100%"
            defaultLanguage="html"
            value={html}
            onChange={(value) => onHtmlChange(value || "")}
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
        </TabsContent>
        
        <TabsContent value="css" className="flex-grow data-[state=active]:flex flex-col">
          <Editor
            height="100%"
            defaultLanguage="css"
            value={css}
            onChange={(value) => onCssChange(value || "")}
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
        </TabsContent>
      </Tabs>
    </div>
  );
} 