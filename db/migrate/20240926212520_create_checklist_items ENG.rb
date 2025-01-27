class CreateChecklistItems < ActiveRecord::Migration[6.1]
  def change
    create_table :checklist_items, id: false do |t|
      t.string :task_id, null: false, primary_key: true      # Task ID using UUID
      t.integer :issue_id, null: false, index: true          # Association with the ticket (issue)
      t.string :label, null: false                           # Checklist item name
      t.boolean :checked, default: false                     # Whether the item is completed
      t.boolean :is_layer_open, null: false                  # Whether the item is expanded
      t.string :parent_id, index: true                       # Reference to parent item (managed by task_id)
      t.integer :position, null: false, default: 0           # Order indicator (position)

      t.timestamps                                           # Created and updated timestamps
    end

    # Add foreign key constraints
    add_foreign_key :checklist_items, :issues, column: :issue_id
    add_foreign_key :checklist_items, :checklist_items, column: :parent_id, primary_key: :task_id
  end
end
