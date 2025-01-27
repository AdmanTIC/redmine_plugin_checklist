import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} 
from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import React, { useEffect, useState } from "react";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import TaskContent from "./TaskContent";
import { findParentTask, findTaskById } from "../utils/taskTreeUtils";
import { useTaskTree } from "./TaskTreeProvider";
import { fetchData, updateTaskList } from "../utils/apiHelper";

export const rootId = "root";

const TaskList: React.FC = () => {
  const { taskTree, setTaskTree } = useTaskTree();

  useEffect(() => {
    fetchData(setTaskTree);
  }, [setTaskTree]);

  // Active task ID during dragging
  const [activeId, setActiveId] = useState<string | null>(null);
  // Last valid drop target ID
  const [lastValidId, setLastValidId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = String(active.id);
    setActiveId(activeId);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const parentInData = findParentTask(taskTree, active.id.toString());

      if (parentInData && parentInData.children) {
        const ids = parentInData.children.map((child) => child.taskId);
        if (ids.includes(over.id.toString())) {
          setLastValidId(over.id.toString());
        }
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active } = event;

    const sourceId = String(active.id);

    // Perform processing even if there is no drop target
    const destinationId = lastValidId;

    // Get the parents of the source and destination
    const sourceParent = findParentTask(taskTree, sourceId);

    if (sourceParent && sourceParent.children) {
      if (destinationId !== null) {
        const destinationParent = findParentTask(taskTree, destinationId);

        // Allow movement only if the parent exists and is the same
        if (
          destinationParent &&
          sourceParent.taskId === destinationParent.taskId &&
          sourceId !== destinationId
        ) {
          const newData = { ...taskTree };
          const parentInData = findTaskById(newData, sourceParent.taskId);

          if (parentInData && parentInData.children) {
            const ids = parentInData.children.map((child) => child.taskId);
            const oldIndex = ids.indexOf(sourceId);
            const newIndex = ids.indexOf(destinationId);

            parentInData.children = arrayMove(
              parentInData.children,
              oldIndex,
              newIndex
            );

            // Update position order
            parentInData.children.forEach((item, index) => {
              item.position = index;
            });
            setTaskTree(newData);
            updateTaskList(setTaskTree, taskTree, parentInData.children);
          }
        }

        setActiveId(null);
      }
    }
  };

  const activeTask =
    activeId !== null ? findTaskById(taskTree, activeId) : null;

  return (
    <div>
      <p>
        <strong>Checklist</strong>
      </p>
      <div className="my-2 border-2 rounded-md bg-white">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}// Detect the drop target closest to the center of the element
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToVerticalAxis]}// Restrict drag operations to the vertical direction
        >
          <TaskContent key={taskTree.taskId} taskTree={taskTree} />
          <DragOverlay>
            {activeTask && <TaskContent taskTree={activeTask} isOverlay />}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default TaskList;
