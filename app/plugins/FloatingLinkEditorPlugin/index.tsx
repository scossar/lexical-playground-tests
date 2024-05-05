import * as React from "react";
import { Dispatch } from "react";

export default function FloatingLinkEditorPlugin({
  anchorElement = document.body,
  isLinkEditMode,
  setIsLinkEditMode,
}: {
  anchorElement?: HTMLElement;
  isLinkEditMode: boolean;
  setIsLinkEditMode: Dispatch<boolean>;
}): React.JSX.Element | null {}
