interface IconProps {
  id: "undo" | "redo";
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
