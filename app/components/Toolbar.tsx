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

import { Dispatch, useCallback, useEffect, useState } from "react";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  ListNode,
} from "@lexical/list";
import {
  $getSelection,
  $createParagraphNode,
  $isElementNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $isTextNode,
  ElementFormatType,
  LexicalEditor,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_NORMAL,
  FORMAT_TEXT_COMMAND,
  KEY_MODIFIER_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import {
  $findMatchingParent,
  $getNearestBlockElementAncestorOrThrow,
  $getNearestNodeOfType,
  mergeRegister,
} from "@lexical/utils";
import { $setBlocksType } from "@lexical/selection";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $isDecoratorBlockNode } from "@lexical/react/LexicalDecoratorBlockNode";
import {
  HeadingTagType,
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
  $isQuoteNode,
} from "@lexical/rich-text";
import { $getSelectedNode } from "~/utils/getSelectedNode";
import { sanitizeUrl } from "~/utils/url";
import DropDown, { DropDownItem } from "~/ui/DropDown";

import Icon from "~/components/Icon";

export type BlockType =
  | "bullet"
  | "check"
  | "code"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "number"
  | "paragraph"
  | "quote";

const blockTypeToBlockName = {
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

export default function Toolbar({
  setIsLinkEditMode,
}: {
  setIsLinkEditMode: Dispatch<boolean>;
}) {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [blockType, setBlockType] = useState<BlockType>("paragraph");
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [elementFormat, setElementFormat] = useState<ElementFormatType>("left");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isLink, setIsLink] = useState(false);

  function dropdownActiveClass(active: boolean) {
    if (active) {
      return "active dropdown-item-active bg-slate-100 rounded-sm";
    } else {
      return "";
    }
  }

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

      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));

      const node = $getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      if (elementDOM !== null) {
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
            setBlockType(type as BlockType);
          }
        }
        // TODO: look into what's going on here
        let matchingParent;
        if ($isLinkNode(parent)) {
          matchingParent = $findMatchingParent(
            node,
            (parentNode) => $isElementNode(parentNode) && !parentNode.isInline()
          );
        }
        setElementFormat(
          $isElementNode(matchingParent)
            ? matchingParent.getFormatType()
            : $isElementNode(node)
            ? node.getFormatType()
            : parent?.getFormatType() || "left"
        );
      }
    }
  }, [activeEditor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      (_payload, newEditor) => {
        $updateToolbar();
        // since this implementation is only dealing with a single editor
        // I'm not sure this call (or the activeEditor variable) is needed.
        setActiveEditor(newEditor);
        return false;
      },
      COMMAND_PRIORITY_CRITICAL
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [$updateToolbar, activeEditor, editor]);

  useEffect(() => {
    return activeEditor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload;
        const { code, ctrlKey, metaKey } = event;

        if (code === "KeyK" && (ctrlKey || metaKey)) {
          event.preventDefault();
          let url: string | null;
          if (!isLink) {
            setIsLinkEditMode(true);
            url = sanitizeUrl("https://");
          } else {
            setIsLinkEditMode(false);
            url = null;
          }
          return activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [activeEditor, isLink, setIsLinkEditMode]);

  const clearFormatting = useCallback(() => {
    activeEditor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchor = selection.anchor;
        const focus = selection.focus;
        const nodes = selection.getNodes();
        const extractedNodes = selection.extract();

        if (anchor.key === focus.key && anchor.offset === focus.offset) {
          return;
        }

        nodes.forEach((node, idx) => {
          if ($isTextNode(node)) {
            let textNode = node;
            if (idx === 0 && anchor.offset !== 0) {
              textNode = textNode.splitText(anchor.offset)[1] || textNode;
            }
            if (idx === nodes.length - 1) {
              textNode = textNode.splitText(focus.offset)[0] || textNode;
            }

            const extractedTextNode = extractedNodes[0];
            if (nodes.length === 1 && $isTextNode(extractedTextNode)) {
              textNode = extractedTextNode;
            }

            if (textNode.__style !== "") {
              textNode.setStyle("");
            }
            if (textNode.__format !== 0) {
              textNode.setFormat(0);
              $getNearestBlockElementAncestorOrThrow(textNode).setFormat("");
            }
            node = textNode;
          } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
            node.replace($createParagraphNode(), true);
          } else if ($isDecoratorBlockNode(node)) {
            node.setFormat("");
          }
        });
      }
    });
  }, [activeEditor]);

  const insertLink = useCallback(() => {
    console.log("in toolbar function");
    if (!isLink) {
      setIsLinkEditMode(true);
      console.log("should be in link edit mode now");
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, sanitizeUrl("https://"));
    } else {
      setIsLinkEditMode(false);
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink, setIsLinkEditMode]);

  function BlockFormatDropDown({
    editor,
    blockType,
    disabled = false,
  }: {
    editor: LexicalEditor;
    blockType: BlockType;
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

    const formatNumberedList = () => {
      if (blockType !== "number") {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      } else {
        formatParagraph();
      }
    };

    const formatQuote = () => {
      if (blockType !== "quote") {
        editor.update(() => {
          const selection = $getSelection();
          $setBlocksType(selection, () => $createQuoteNode());
        });
      }
    };

    return (
      <DropDown
        disabled={disabled}
        buttonClassName="toolbar-item block-controls px-2"
        buttonLabel={blockTypeToBlockName[blockType]}
        buttonAriaLabel="Formatting options for text type"
        blockType={blockType}
      >
        <DropDownItem
          className={`item my-1 flex items-start hover:bg-slate-100 ${dropdownActiveClass(
            blockType === "paragraph"
          )}`}
          onClick={formatParagraph}
        >
          <span className="text grow">
            <Icon className="inline-block w-4 h-4" id="paragraph" /> Paragraph
          </span>
        </DropDownItem>
        <DropDownItem
          className={`item my-1 hover:bg-slate-100 ${dropdownActiveClass(
            blockType === "h1"
          )}`}
          onClick={() => formatHeading("h1")}
        >
          <span className="text">
            <Icon id="heading" className="inline-block w-4 h-4" /> Heading 1
          </span>
        </DropDownItem>
        <DropDownItem
          className={`item my-1 hover:bg-slate-100 ${dropdownActiveClass(
            blockType === "h2"
          )}`}
          onClick={() => formatHeading("h2")}
        >
          <span className="text">
            <Icon id="heading" className="inline-block w-4 h-4" /> Heading 2
          </span>
        </DropDownItem>
        <DropDownItem
          className={`item my-1 hover:bg-slate-100 ${dropdownActiveClass(
            blockType === "h3"
          )}`}
          onClick={() => formatHeading("h3")}
        >
          <span className="text">
            <Icon id="heading" className="inline-block w-4 h-4" /> Heading 3
          </span>
        </DropDownItem>
        <DropDownItem
          className={`item my-1 hover:bg-slate-100 ${dropdownActiveClass(
            blockType === "bullet"
          )}`}
          onClick={formatBulletList}
        >
          <span className="text">
            <Icon id="list-bullet" className="inline-block w-4 h-4" /> Bullet
            List
          </span>
        </DropDownItem>
        <DropDownItem
          className={`item my-1 hover:bg-slate-100 ${dropdownActiveClass(
            blockType === "number"
          )}`}
          onClick={formatNumberedList}
        >
          <span className="text">
            <Icon id="list-bullet" className="inline-block w-4 h-4" /> Numbered
            List
          </span>
        </DropDownItem>
        <DropDownItem
          className={`item my-1 hover:bg-slate-100 ${dropdownActiveClass(
            blockType === "quote"
          )}`}
          onClick={formatQuote}
        >
          <span className="text">
            <Icon id="quote" className="inline-block w-4 h-4" /> Quote
          </span>
        </DropDownItem>
      </DropDown>
    );
  }

  return (
    <div className="sticky flex items-center h-8 border toolbar border-b-slate-300">
      <button
        disabled={!canUndo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        title="Undo"
        className={`mr-1 p-1 rounded-full ${
          !canUndo || !isEditable ? "bg-slate-200" : "bg-white"
        }`}
        type="button"
        aria-label="Undo"
      >
        <Icon id="redo" className="w-3 h-3 scale-x-[-1]" />
      </button>
      <button
        disabled={!canRedo || !isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        title="Redo"
        type="button"
        className={`mr-1 p-1 rounded-full ${
          !canRedo || !isEditable ? "bg-slate-200" : "bg-white"
        }`}
        aria-label="Redo"
      >
        <Icon id="redo" className="w-3 h-3" />
      </button>
      <BlockFormatDropDown
        disabled={!isEditable}
        blockType={blockType}
        editor={editor}
      />
      <button
        disabled={!isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={`mr-1 rounded-sm ${
          isBold ? "bg-blue-400 text-white" : "bg-white text-slate-900"
        }`}
        title="Bold"
        type="button"
        aria-label="Format text as bold"
      >
        <Icon className="w-4 h-4" id="bold" />
      </button>
      <button
        disabled={!isEditable}
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={`mr-1 rounded-sm ${
          isItalic ? "bg-blue-400 text-white" : "bg-white text-slate-900"
        }`}
        title="Italic"
        type="button"
        aria-label="Format text as italic"
      >
        <Icon className="w-4 h-4" id="italic" />
      </button>
      <button
        onClick={clearFormatting}
        className={`mr-1`}
        title="Clear selected text formatting"
      >
        <Icon id="reset" className="inline-block w-4 h-4" y={-3} />
      </button>
      <button
        onClick={insertLink}
        className="mr-1"
        disabled={!isEditable}
        aria-label="insert link"
      >
        <Icon id="link" className="inline-block w-4 h-4" />
      </button>
    </div>
  );
}
