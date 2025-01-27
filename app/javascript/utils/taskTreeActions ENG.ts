import { TaskTree } from "../types";

/**
 * Function to update the key and value of an object within the task tree with the specified ID.
 *
 * @param setTaskTree - Function to update the task tree (used to update React state)
 * @param targetId - ID of the task to be updated
 * @param key - Property name to update (key within the TaskTree)
 * @param value - New value for the specified key
 */
export const updateTaskTree = <K extends keyof TaskTree>(
  setTaskTree: React.Dispatch<React.SetStateAction<TaskTree>>,
  targetId: string,
  key: K,
  value: TaskTree[K]
) => {
  const update = <K extends keyof TaskTree>(
    taskTree: TaskTree,
    targetId: string,
    key: K,
    value: TaskTree[K]
  ): TaskTree => {
    // Update the value if the ID matches
    if (taskTree.taskId === targetId) {
      return {
        ...taskTree,
        [key]: value,
      };
    }

    // If there are child elements, update recursively
    if (taskTree.children.length > 0) {
      return {
        ...taskTree,
        children: taskTree.children.map((child) =>
          update(child, targetId, key, value)
        ),
      };
    }

    // If nothing is updated, return it as is
    return taskTree;
  };

  setTaskTree((prevTaskTree) => update(prevTaskTree, targetId, key, value));
};

/**
 * A function that removes the object specified by targetId from the task tree
 *
 * @param setTaskTree - Update function of task tree (Function for updating state of React)
 * @param targetId - ID of the object you want to delete
 */
export const deleteTaskTreeItem = (
  setTaskTree: React.Dispatch<React.SetStateAction<TaskTree>>,
  targetId: string
) => {
  /**
   * Recursively search the task tree and remove the object with the specified ID.
   *
   * @param taskTree  - The current task tree
   * @param targetId - The ID of the object to be removed
   * @returns - The updated task tree (returns the original tree if the target is not found)
 */
   */
  const remove = (taskTree: TaskTree, targetId: string): TaskTree | null => {
    // Return null if the task tree ID matches (this object will be removed)
    if (taskTree.taskId === targetId) {
      return null;
    }

    // If there are child elements, perform recursive deletion
    if (taskTree.children.length > 0) {
      const updatedChildren = taskTree.children
        .map((child) => remove(child, targetId))
        .filter((child) => child !== null) as TaskTree[]; // Remove null values

      return {
        ...taskTree,
        children: updatedChildren,
      };
    }

    // Return the original tree if nothing was deleted
    return taskTree;
  };

  // Update the task tree using React's setState function
  setTaskTree((prevTaskTree) => {
    const updatedTaskTree = remove(prevTaskTree, targetId);
    return updatedTaskTree ?? prevTaskTree;
  });
};

