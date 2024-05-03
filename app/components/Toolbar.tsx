/**
 * Based on the ToolBarPlugin component from the Lexical Editor project (Meta Platforms, Inc. and affiliates).
 * This source code has been modified from its original version.
 *
 * The original code is licensed under the MIT license found in the LICENSE file in the root directory of the original source tree.
 * Modifications by Zalgorithm (Simon Cossar).
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * Copyright (c) Zalgorithm.
 */

import { useCallback, useState } from "react";
import {
  $isListNode,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
} from "@lexical/list";
import {
  $getSelection,
  $createParagraphNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  LexicalEditor,
  NodeKey,
} from "lexical";
import { $findMatchingParent, $getNearestNodeOfType } from "@lexical/utils";
import { $setBlocksType } from "@lexical/selection";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  HeadingTagType,
  $createHeadingNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import DropDown, { DropDownItem } from "~/ui/DropDown";

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [blockType, setBlockType] =
    useState<keyof typeof BlockTypeToBlockName>("paragraph");

  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null
  );
  const [fontSize, setFontSize] = useState<string>("15px");
  const [fontColor, setFontColor] = useState<string>("#000");
  const [bgColor, setBgColor] = useState<string>("#fff");
  const [fontFamily, setFontFamily] = useState<string>("Arial");
  const [elementFormat, setElementFormat] = useState<ElementFormatType>("left");
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<string>("");

  const BlockTypeToBlockName = {
    bullet: "Bulleted List",
    check: "Check List",
    code: "Code Block",
    h1: "Heading 1",
    h2: "Heading 2",
    h3: "Heading 3",
    h4: "Heading 4",
    h5: "Heading 5",
    h6: "Heading 6",
    number: "Numbered List",
    paragraph: "Normal",
    quote: "Quote",
  };

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format
      /*
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsSuperscript(selection.hasFormat('superscript'));
      setIsCode(selection.hasFormat('code'));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      const tableNode = $findMatchingParent(node, $isTableNode);
      if ($isTableNode(tableNode)) {
        setRootType('table');
      } else {
        setRootType('root');
      }
       */

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in blockTypeToBlockName) {
            setBlockType(type as keyof typeof blockTypeToBlockName);
          }
          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            setCodeLanguage(
              language ? CODE_LANGUAGE_MAP[language] || language : ""
            );
            return;
          }
        }
      }
      // Handle buttons
      setFontSize(
        $getSelectionStyleValueForProperty(selection, "font-size", "15px")
      );
      setFontColor(
        $getSelectionStyleValueForProperty(selection, "color", "#000")
      );
      setBgColor(
        $getSelectionStyleValueForProperty(
          selection,
          "background-color",
          "#fff"
        )
      );
      setFontFamily(
        $getSelectionStyleValueForProperty(selection, "font-family", "Arial")
      );
      let matchingParent;
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline()
        );
      }

      // If matchingParent is a valid node, pass it's format type
      setElementFormat(
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
          ? node.getFormatType()
          : parent?.getFormatType() || "left"
      );
    }
  }, [activeEditor]);

  function dropdownActiveClass(active: boolean) {
    if (active) {
      return "active dropdown-item-active underline";
    } else {
      return "";
    }
  }

  function BlockFormatDropDown({
    editor,
    blockType,
    disabled = false,
  }: {
    editor: LexicalEditor;
    blockType: keyof typeof BlockTypeToBlockName;
    disabled: boolean;
  }): React.JSX.Element {
    const formatParagraph = () => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createParagraphNode());
        }
      });
    };
    const formatHeading = (headingSize: HeadingTagType) => {
      if (blockType !== headingSize) {
        editor.update(() => {
          const selection = $getSelection();
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        });
      }
    };

    const formatBulletList = () => {
      if (blockType !== "bullet") {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      } else {
        formatParagraph();
      }
    };

    return (
      <DropDown
        disabled={disabled}
        buttonClassName="toolbar-item block-controls px-2"
        buttonLabel={BlockTypeToBlockName[blockType]}
        buttonAriaLabel="Formatting options for text stype"
      >
        <DropDownItem
          className={`item ${dropdownActiveClass(blockType === "paragraph")}`}
          onClick={formatParagraph}
        >
          <i className="icon paragraph" />
          <span className="text">Normal</span>
        </DropDownItem>
        <DropDownItem
          className={`item ${dropdownActiveClass(blockType === "h1")}`}
          onClick={() => formatHeading("h1")}
        >
          <i className="icon h1" />
          <span className="text">Heading 1</span>
        </DropDownItem>
        <DropDownItem
          className={`item ${dropdownActiveClass(blockType === "h2")}`}
          onClick={() => formatHeading("h2")}
        >
          <i className="icon h2" />
          <span className="text">Heading 2</span>
        </DropDownItem>
        <DropDownItem
          className={`item ${dropdownActiveClass(blockType === "h3")}`}
          onClick={() => formatHeading("h3")}
        >
          <i className="icon h3" />
          <span className="text">Heading 3</span>
        </DropDownItem>
        <DropDownItem
          className={`item ${dropdownActiveClass(blockType === "bullet")}`}
          onClick={formatBulletList}
        >
          <i className="icon bullet-list" />
          <span className="text">Bullet List</span>
        </DropDownItem>
      </DropDown>
    );
  }

  return (
    <div className="relative z-10 h-8 overflow-visible border toolbar border-b-slate-300">
      <BlockFormatDropDown
        disabled={!isEditable}
        blockType={blockType}
        editor={editor}
      />
    </div>
  );
}
