export interface TaskTree {
  taskId: string; // Task ID using UUID
  label: string;  // Checklist item name
  checked: boolean; // Indicates whether the item is completed
  isLayerOpen: boolean; // Specifies if the item is expanded
  position: number; // Order of the item
  children: TaskTree[];// List of subtasks
}