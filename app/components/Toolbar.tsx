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
import { INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";
import {
  $getSelection,
  $createParagraphNode,
  $isRangeSelection,
  $isRootOrShadowRoot,
  LexicalEditor,
} from "lexical";
import { $findMatchingParent } from "@lexical/utils";
import { $setBlocksType } from "@lexical/selection";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HeadingTagType, $createHeadingNode } from "@lexical/rich-text";
import DropDown, { DropDownItem } from "~/ui/DropDown";

export default function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [blockType, setBlockType] =
    useState<keyof typeof BlockTypeToBlockName>("paragraph");

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
    blockType: keyof typeof blockTypeToBlockName;
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
        buttonLabel={blockTypeToBlockName[blockType]}
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
