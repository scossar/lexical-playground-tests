import { LexicalComposer } from "@lexical/react/LexicalComposer";
import PlaygroundEditorTheme from "~/themes/PlaygroundEditorTheme";
import Editor from "./Editor";

export default function Composer() {
  const initialConfig = {
    namespace: "Playground",
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
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
