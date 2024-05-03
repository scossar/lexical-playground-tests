import { LexicalComposer } from "@lexical/react/LexicalComposer";
import ZalgorithmEditorTheme from "~/themes/ZalgorithmEditorTheme";
import { EditorNodes } from "~/editorNodes/EditorNodes";
import Editor from "./Editor";

export default function Composer() {
  const initialConfig = {
    namespace: "Zalgorithm",
    onError: (error: Error) => {
      throw error;
    },
    theme: ZalgorithmEditorTheme,
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
