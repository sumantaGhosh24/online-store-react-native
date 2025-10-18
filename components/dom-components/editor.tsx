"use dom";

import "./styles.css";

import {$convertToMarkdownString, TRANSFORMERS} from "@lexical/markdown";
import {AutoFocusPlugin} from "@lexical/react/LexicalAutoFocusPlugin";
import {LexicalComposer} from "@lexical/react/LexicalComposer";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {ContentEditable} from "@lexical/react/LexicalContentEditable";
import {LexicalErrorBoundary} from "@lexical/react/LexicalErrorBoundary";
import {HistoryPlugin} from "@lexical/react/LexicalHistoryPlugin";
import {RichTextPlugin} from "@lexical/react/LexicalRichTextPlugin";
import {useCallback, useEffect} from "react";

import ExampleTheme from "./ExampleTheme";
import ToolbarPlugin from "./plugins/ToolbarPlugin";

const debounce = (func: Function, delay: number) => {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
};

const MarkdownUpdaterPlugin = ({
  setContent,
}: {
  setContent: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [editor] = useLexicalComposerContext();

  const debouncedUpdate = useCallback(
    debounce((editorState: any) => {
      editorState.read(() => {
        const markdown = $convertToMarkdownString(TRANSFORMERS);
        setContent(markdown);
      });
    }, 500),
    [setContent]
  );

  useEffect(() => {
    return editor.registerUpdateListener(({editorState}) => {
      debouncedUpdate(editorState);
    });
  }, [editor, debouncedUpdate]);

  return null;
};

const editorConfig = {
  namespace: "Online Store Editor",
  nodes: [],
  onError(error: Error) {
    throw error;
  },
  theme: ExampleTheme,
};

export default function Editor({
  setContent,
}: {
  setContent: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <>
      <LexicalComposer initialConfig={editorConfig}>
        <div className="editor-container">
          <ToolbarPlugin />
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="editor-input"
                  aria-placeholder="Enter your content"
                  placeholder={
                    <div className="editor-placeholder">Enter your content</div>
                  }
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            {/* <OnChangePlugin
              onChange={(editorState) => {
                editorState.read(() => {
                  const markdown = $convertToMarkdownString(TRANSFORMERS);
                  setContent(markdown);
                });
              }}
              ignoreHistoryMergeTagChange
              ignoreSelectionChange
            /> */}
            <MarkdownUpdaterPlugin setContent={setContent} />
            <HistoryPlugin />
            <AutoFocusPlugin />
            {/* <TreeViewPlugin /> */}
          </div>
        </div>
      </LexicalComposer>
    </>
  );
}
