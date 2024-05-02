import { LexicalComposer } from "@lexical/react/LexicalComposer";
import PlaygroundEditorTheme from "~/themes/PlaygroundEditorTheme";
import { EditorNodes } from "~/editorNodes/EditorNodes";
import Editor from "./Editor";

export default function Composer() {
  const initialConfig = {
    namespace: "Playground",
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
    nodes: [...EditorNodes],
  };
  return (
    <>
      <LexicalComposer initialConfig={initialConfig}>
        <div className="border border-slate-400">
          <Editor />
        </div>
      </LexicalComposer>
    </>
  );
}
