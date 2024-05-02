import type { Klass, LexicalNode } from "lexical";

import { HeadingNode } from "@lexical/rich-text";

export const EditorNodes: Array<Klass<LexicalNode>> = [HeadingNode];
