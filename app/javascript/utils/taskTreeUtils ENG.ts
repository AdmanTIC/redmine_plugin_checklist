import { TaskTree } from "../types";

// Retrieve the parent of the task with the specified ID
export const findParentTask = (
    root: TaskTree,
    targetId: string,
    parent: TaskTree | null = null
  ): TaskTree | null => {
    if (root.taskId === targetId) {
      return parent;
    } else if (root.children) {
      for (const child of root.children) {
        const result = findParentTask(child, targetId, root);
        if (result) {
          return result;
        }
      }
    }
    return null;
  };
  
  // Retrieve the task with the specified ID
  export const findTaskById = (
    root: TaskTree,
    targetId: string
  ): TaskTree | null => {
    if (root.taskId === targetId) {
      return root;
    } else if (root.children) {
      for (const child of root.children) {
        const result = findTaskById(child, targetId);
        if (result) {
          return result;
        }
      }
    }
    return null;
  };