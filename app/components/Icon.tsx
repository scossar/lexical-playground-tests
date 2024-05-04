interface IconProps {
  id:
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
    | "pencil";
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
