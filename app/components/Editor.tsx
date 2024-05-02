import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import ContentEditable from "~/ui/ContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import Placeholder from "~/ui/Placeholder";

export default function Editor() {
  const text = "Enter some text...";
  const placeholder = <Placeholder>{text}</Placeholder>;
  return (
    <>
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
    </>
  );
}
