"use client";

// npx shadcn-ui@latest add checkbox
// npm  i react-use-measure
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { Trash } from "lucide-react";
import {
  AnimatePresence,
  LayoutGroup,
  Reorder,
  motion,
  useDragControls,
} from "motion/react";
import useMeasure from "react-use-measure";

import { cn } from "@/lib/utils";
import { Card } from "./card";

function SortableListItem({
  item,
  order,
  onCompleteItem,
  onRemoveItem,
  renderExtra,
  handleDrag,
  isExpanded,
  className,
}) {
  let [ref, bounds] = useMeasure();
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggable, setIsDraggable] = useState(true);
  const dragControls = useDragControls();

  const handleDragStart = (event) => {
    setIsDragging(true);
    dragControls.start(event, { snapToCursor: true });
    handleDrag();
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <motion.div className={cn("", className)} key={item.id}>
      <div className="flex w-full items-center gap-2">
        <Reorder.Item
          value={item}
          className={cn(
            "relative z-auto grow",
            "h-full rounded-xl ",
            "cursor-grab",
            item.checked && !isDragging ? "w-7/10" : "w-full"
          )}
          key={item.id}
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            height: bounds.height > 0 ? bounds.height : undefined,
            transition: {
              type: "spring",
              bounce: 0,
              duration: 0.4,
            },
          }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.05,
              type: "spring",
              bounce: 0.1,
            },
          }}
          layout
          layoutId={`item-${item.id}`}
          dragListener={!item.checked}
          dragControls={dragControls}
          onDragEnd={handleDragEnd}
          style={
            isExpanded
              ? {
                  zIndex: 9999,
                  marginTop: 10,
                  marginBottom: 10,
                  position: "relative",
                  overflow: "hidden",
                }
              : {
                  position: "relative",
                  overflow: "hidden",
                }
          }
          whileDrag={{ zIndex: 9999 }}
        >
          <div ref={ref} className={cn(isExpanded ? "" : "", "z-20 ")}>
            <motion.div
              layout="position"
              className="flex items-center justify-center "
            >
              <AnimatePresence>
                {!isExpanded ? (
                  <motion.div
                    initial={{
                      opacity: 0,
                      // filter: "blur(4px)"
                    }}
                    animate={{
                      opacity: 1,
                      // filter: "blur(0px)"
                    }}
                    exit={{
                      opacity: 0,
                      // filter:"blur(4px)"
                    }}
                    transition={{ duration: 0.001 }}
                    className="flex  items-center space-x-2 "
                  >
                    {/* List Remove Actions */}
                    {/* List Order */}
                    {/* <p className="font-mono text-xs pl-1">{order + 1}</p> */}

                    {/* List Title */}
                    <motion.div
                      key={`${item.checked}`}
                      className=" px-1 min-w-[150px] "
                      initial={{
                        opacity: 0,
                        // filter: "blur(4px)",
                      }}
                      animate={{
                        opacity: 1,
                        // filter: "blur(0px)"
                      }}
                      transition={{
                        bounce: 0.2,
                        delay: item.checked ? 0.2 : 0,
                        type: "spring",
                      }}
                    >
                      <Card
                        className={cn(
                          "tracking-tighter text-base md:text-lg bg-accent-foreground text-accent py-2 my-2 text-center"
                        )}
                      >
                        {` ${item.text}`}
                      </Card>
                    </motion.div>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              {/* List Item Children */}
              {renderExtra && renderExtra(item)}
            </motion.div>
          </div>
          <div
            onPointerDown={isDraggable ? handleDragStart : undefined}
            style={{ touchAction: "none" }}
          />
        </Reorder.Item>
      </div>
    </motion.div>
  );
}

SortableListItem.displayName = "SortableListItem";

function SortableList({ items, setItems, onCompleteItem, renderItem }) {
  if (items) {
    return (
      <LayoutGroup>
        <Reorder.Group
          axis="y"
          values={items}
          onReorder={setItems}
          className="flex flex-col"
        >
          <AnimatePresence>
            {items?.map((item, index) =>
              renderItem(item, index, onCompleteItem, (id) =>
                setItems((items) => items.filter((item) => item.id !== id))
              )
            )}
          </AnimatePresence>
        </Reorder.Group>
      </LayoutGroup>
    );
  }
  return null;
}

SortableList.displayName = "SortableList";

export { SortableList, SortableListItem };
