// src/components/Editor.tsx
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bold,
  Italic,
  Link,
  Image,
  ListOrdered,
  List,
  Variable,
} from "lucide-react";

interface EditorProps {
  value: string;
  onChange: (content: string) => void;
  variables?: string[];
}

export const Editor = ({ value, onChange, variables = [] }: EditorProps) => {
  const [view, setView] = useState<"design" | "html">("design");
  const editorRef = useRef<HTMLDivElement>(null);
  const [selectedText, setSelectedText] = useState("");

  // Track cursor position for variable insertion
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);

  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleVariableInsert = (variable: string) => {
    const varText = `{{${variable}}}`;

    if (view === "html") {
      // Insert at cursor position in HTML view
      const textarea = document.querySelector(
        '[role="textbox"]'
      ) as HTMLTextAreaElement;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const textBefore = value.substring(0, start);
        const textAfter = value.substring(end);
        onChange(textBefore + varText + textAfter);

        // Reset cursor position after variable insertion
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd =
            start + varText.length;
          textarea.focus();
        }, 0);
      }
    } else {
      // Insert at cursor position in design view
      handleCommand("insertText", varText);
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL:", "https://");
    if (url) {
      handleCommand("createLink", url);
    }
  };

  return (
    <div className="border rounded-md">
      <div className="border-b p-2 bg-gray-50 flex items-center space-x-2">
        <TooltipProvider>
          <div className="flex items-center space-x-1 border-r pr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCommand("bold")}
                >
                  <Bold className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bold</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCommand("italic")}
                >
                  <Italic className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Italic</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center space-x-1 border-r pr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" onClick={insertLink}>
                  <Link className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insert Link</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const url = prompt("Enter image URL:", "");
                    if (url) handleCommand("insertImage", url);
                  }}
                >
                  <Image className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Insert Image</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center space-x-1 border-r pr-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCommand("insertOrderedList")}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Numbered List</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCommand("insertUnorderedList")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Bullet List</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center space-x-1">
            <Select onValueChange={handleVariableInsert}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Insert Variable" />
              </SelectTrigger>
              <SelectContent>
                {variables.map((variable) => (
                  <SelectItem key={variable} value={variable}>
                    {variable}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TooltipProvider>

        <div className="ml-auto">
          <Tabs
            value={view}
            onValueChange={(v) => setView(v as "design" | "html")}
          >
            <TabsList>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="html">HTML</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {view === "design" ? (
        <div
          ref={editorRef}
          contentEditable
          className="min-h-[400px] p-4 focus:outline-none prose max-w-none"
          dangerouslySetInnerHTML={{ __html: value }}
          onInput={updateContent}
          onSelect={() => {
            const selection = window.getSelection();
            if (selection) {
              setSelectedText(selection.toString());
            }
          }}
          onBlur={() => {
            const selection = window.getSelection();
            if (selection) {
              setCursorPosition(selection.anchorOffset);
            }
          }}
        />
      ) : (
        <textarea
          className="w-full min-h-[400px] p-4 font-mono text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          role="textbox"
        />
      )}

      {/* Template Suggestions */}
      <div className="border-t p-2 bg-gray-50">
        <Select onValueChange={(template) => onChange(value + template)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Insert Template Block" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="greeting">Greeting Block</SelectItem>
            <SelectItem value="productAnnouncement">
              Product Announcement
            </SelectItem>
            <SelectItem value="footer">Footer with Unsubscribe</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

// Optional: Add these common template blocks
const emailTemplates = {
  greeting: `
    <div>
      Dear {{customerName}},
      <br><br>
      We hope this email finds you well.
    </div>
  `,
  productAnnouncement: `
    <div style="text-align: center;">
      <h2>New Product Announcement</h2>
      <img src="{{productImage}}" alt="{{productName}}" style="max-width: 300px;">
      <h3>{{productName}}</h3>
      <p>{{productDescription}}</p>
      <a href="{{productLink}}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Learn More
      </a>
    </div>
  `,
  footer: `
    <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee;">
      <p>Best regards,<br>Your Company Name</p>
      <p style="font-size: 12px; color: #666;">
        You received this email because you're a valued customer.
        <br>
        <a href="{{unsubscribeLink}}">Unsubscribe</a>
      </p>
    </div>
  `,
};
