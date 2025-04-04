"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Editor from "@monaco-editor/react"

interface CodingEnvironmentProps {
  code: string
  onCodeChange: (code: string) => void
  onEvaluate: () => void
}

export default function CodingEnvironment({ code, onCodeChange, onEvaluate }: CodingEnvironmentProps) {
  const [editorCode, setEditorCode] = useState<string>(code || "// Write your solution here")
  const [language, setLanguage] = useState<string>("javascript")

  useEffect(() => {
    if (code !== editorCode) {
      setEditorCode(code)
    }
  }, [code])

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || ""
    setEditorCode(newCode)
    onCodeChange(newCode)
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <label htmlFor="language" className="text-sm font-medium">
            Language:
          </label>
          <select
            id="language"
            value={language}
            onChange={handleLanguageChange}
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
          >
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="csharp">C#</option>
          </select>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden" style={{ height: "500px" }}>
        <Editor
          height="100%"
          language={language}
          value={editorCode}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
            lineNumbers: "on",
            folding: true,
            automaticLayout: true,
          }}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setEditorCode("// Write your solution here")}>
          Clear
        </Button>
        <Button onClick={onEvaluate} disabled={!editorCode.trim()}>
          Evaluate Solution
        </Button>
      </div>
    </div>
  )
}

