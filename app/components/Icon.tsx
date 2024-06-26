export type AvailableIconIdTypes =
  | "reset"
  | "redo"
  | "caret-up"
  | "caret-down"
  | "italic"
  | "bold"
  | "paragraph"
  | "heading"
  | "list-bullet"
  | "quote"
  | "code"
  | "link"
  | "pencil"
  | "heart"
  | "heart-filled"
  | "fa-list-ul"
  | "fa-list-ol"
  | "fa-1"
  | "fa-2"
  | "fa-3"
  | "fa-h";

interface IconProps {
  id: AvailableIconIdTypes;
  className?: string;
  x?: number;
  y?: number;
}

export default function Icon({
  id,
  x = 0,
  y = 0,
  className,
}: IconProps): JSX.Element {
  return (
    <svg className={className}>
      <use href={`/sprite.svg#${id}`} x={`${x}`} y={`${y}`} />
    </svg>
  );
}
