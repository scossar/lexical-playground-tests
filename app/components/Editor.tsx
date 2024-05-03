import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import ContentEditable from "~/ui/ContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import ToolbarPlugin from "~/components/Toolbar";
import Placeholder from "~/ui/Placeholder";

export default function Editor() {
  const text = "";
  const placeholder = <Placeholder>{text}</Placeholder>;
  return (
    <>
      <ToolbarPlugin />
      <RichTextPlugin
        contentEditable={
          <div className="editor-scroller">
            <div className="editor">
              <ContentEditable />
            </div>
          </div>
        }
        placeholder={placeholder}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <ListPlugin />
    </>
  );
}
