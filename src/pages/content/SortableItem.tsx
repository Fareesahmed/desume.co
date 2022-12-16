import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import classNames from "classnames";

export function SortableItem(props: any) {
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      className={classNames("transition-shadow relative cursor-auto", {
        "z-10 shadow-lg ring-inset ring-2 ring-gray-400 bg-white": isDragging,
      })}
      style={style}
      {...attributes}
    >
      <div
        className={classNames(
          "absolute inset-0 left-12 cursor-grab touch-none",
          {
            "cursor-grabbing": isDragging,
          }
        )}
        {...listeners}
      />
      {props.children}
    </div>
  );
}
