import { useState } from "react";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import ContentEditable from "~/ui/ContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { validateUrl } from "~/utils/url";
import LexicalClickableLinkPlugin from "@lexical/react/LexicalClickableLinkPlugin";
import ZalgAutoLinkPlugin from "./ZalgAutoLinkPlugin";
import ToolbarPlugin from "~/components/Toolbar";
import FloatingLinkEditorPlugin from "~/plugins/FloatingLinkEditorPlugin";
import Placeholder from "~/ui/Placeholder";

export default function Editor() {
  const [isLinkEditMode, setIsLinkEditMode] = useState<boolean>(false);
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);
  const text = "";
  const placeholder = <Placeholder>{text}</Placeholder>;
  return (
    <>
      <ToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
      <RichTextPlugin
        contentEditable={
          <div className="relative editor-scroller">
            <div className="relative editor">
              <ContentEditable className="relative p-2 min-h-48" />
            </div>
          </div>
        }
        placeholder={placeholder}
        ErrorBoundary={LexicalErrorBoundary}
      />
      {floatingAnchorElem && (
        <FloatingLinkEditorPlugin
          anchorElem={floatingAnchorElem}
          isLinkEditMode={isLinkEditMode}
          setIsLinkEditMode={setIsLinkEditMode}
        />
      )}
      <ZalgAutoLinkPlugin />
      <LinkPlugin validateUrl={validateUrl} />
      <LexicalClickableLinkPlugin />
      <ListPlugin />
    </>
  );
}
