"use client";

import { Button } from "@/components/ui/button";
import { SortableList, SortableListItem } from "@/components/ui/sortable-list";

export default function ResumeOrder({ items, setItems }) {
  const handleAddItem = () => {
    const newItem = {
      text: `Item ${items.length + 1}`,
      checked: false,
      id: items.length + 1,
      description: `Description ${items.length + 1}`,
    };
    setItems([...items, newItem]);
  };

  const handleResetItems = () => {
    setItems([]);
  };

  const renderItem = (item, onCompleteItem, onRemoveItem) => (
    <SortableListItem
      key={item.id}
      item={item}
      onCompleteItem={onCompleteItem}
      onRemoveItem={onRemoveItem}
      handleDrag={() => {}}
      order={item.id}
    />
  );

  // console.log(items);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold mb-4">Set Resume Order</h1>
          <p className="font-semibold">
            Drag and drop the items to set the order of your resume sections.
          </p>
        </div>
        <Button onClick={() => handleResetItems()}>Reset</Button>
      </div>
      <SortableList
        items={items}
        setItems={setItems}
        onAddItem={handleAddItem}
        onResetItems={handleResetItems}
        // onCompleteItem={handleCompleteItem}
        renderItem={renderItem}
        className="bg-gray-100 p-4 rounded-lg shadow-md"
      />
    </div>
  );
}
