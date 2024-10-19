import React from "react";
import { Button } from "@mui/joy";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

interface TabBarProps {
  openFiles: { path: string; isModified: boolean }[];
  activeFile: string | null;
  onSelectFile: (path: string) => void;
  onCloseFile: (path: string) => void;
  onReorderTabs: (newOrder: string[]) => void;
}

const TabBar: React.FC<TabBarProps> = ({
  openFiles,
  activeFile,
  onSelectFile,
  onCloseFile,
  onReorderTabs,
}) => {
  console.log("TabBar rendering with openFiles:", openFiles);
  console.log("TabBar rendering with activeFile:", activeFile);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newOrder = Array.from(openFiles);
    const [reorderedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, reorderedItem);
    onReorderTabs(newOrder.map((file) => file.path));
  };

  if (openFiles.length === 0) {
    console.log("TabBar not rendering due to empty openFiles");
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="tabs" direction="horizontal">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex bg-gray-100 overflow-x-auto h-10 border-b border-gray-300"
          >
            {openFiles.map((file, index) => (
              <Draggable key={file.path} draggableId={file.path} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`flex items-center px-3 py-1 cursor-pointer border-r border-gray-200 ${
                      file.path === activeFile
                        ? "bg-white text-blue-600"
                        : "hover:bg-gray-200"
                    }`}
                    onClick={() => onSelectFile(file.path)}
                  >
                    <span className="truncate max-w-xs text-sm">
                      {file.path.split("/").pop()}
                      {file.isModified && (
                        <span className="text-red-500 ml-1">•</span>
                      )}
                    </span>
                    <Button
                      variant="plain"
                      color="neutral"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseFile(file.path);
                      }}
                      className="ml-2 p-0 min-w-0"
                    >
                      ×
                    </Button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TabBar;
