class ChecklistItemsController < ApplicationController
  before_action :find_issue
  before_action :find_checklist_item, only: [:update, :destroy], except: [:bulk_update, :create]

  # Retrieve checklist items (GET)
  def index
    @checklist_items = ChecklistItem.where(issue_id: @issue.id)
    render json: build_task_tree(@checklist_items)
  end

  # Create a checklist item (POST)
  def create
    # Check if the root element exists
    root_item = ChecklistItem.find_by(task_id: 'root', issue_id: @issue.id)

    # Create root if it does not exist
    unless root_item
      root_item = ChecklistItem.create!(
        task_id: 'root',
        issue_id: params[:issue_id],
        label: 'root',
        checked: false,
        is_layer_open: true
      )
    end

    checklist_item = ChecklistItem.new(checklist_item_params)
    checklist_item.issue_id = @issue.id
    if checklist_item.save
      render json: { message: "Checklist item created successfully", task_id: checklist_item.task_id }, status: :created
    else
      render json: { errors: checklist_item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # Update a checklist item (PUT/PATCH)
  def update
    if @checklist_item.update(checklist_item_params)
      render json: { message: "Checklist item updated successfully" }, status: :ok
    else
      render json: { errors: @checklist_item.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # Update multiple checklist items at once (PUT)
  def bulk_update
    Rails.logger.debug "Starting bulk_update with params: #{params.inspect}"
    
    errors = []
    
    checklist_items_params.each do |item_params|
      Rails.logger.debug "Processing item_params: #{item_params.inspect}"
      begin
        checklist_item = ChecklistItem.find_by!(task_id: item_params[:task_id], issue_id: @issue.id)
        
        unless checklist_item.update(
          label: item_params[:label],
          checked: item_params[:checked],
          is_layer_open: item_params[:is_layer_open],
          position: item_params[:position],
          parent_id: item_params[:parent_id]
        )
          errors << { task_id: checklist_item.task_id, errors: checklist_item.errors.full_messages }
        end
      rescue ActiveRecord::RecordNotFound => e
        errors << { task_id: item_params[:task_id], errors: ["Item not found"] }
      end
    end

    if errors.empty?
      render json: { message: "Checklist items updated successfully" }, status: :ok
    else
      render json: { message: "Some checklist items failed to update", errors: errors }, status: :unprocessable_entity
    end
  end

  # Delete a checklist item (DELETE)
  def destroy
    if @checklist_item.destroy
      render json: { message: "Checklist item deleted successfully" }, status: :ok
    else
      render json: { errors: "Failed to delete checklist item" }, status: :unprocessable_entity
    end
  end

  private

  # Parameter permission method for a single item
  def checklist_item_params
    permitted = params.require(:checklist_item).permit(:taskId, :label, :checked, :isLayerOpen, :position, :parentId)
    {
      task_id: permitted['taskId'],
      label: permitted['label'],
      checked: permitted['checked'],
      is_layer_open: permitted['isLayerOpen'],
      position: permitted['position'],
      parent_id: permitted['parentId'],
      issue_id: params['issue_id']
    }
  end

  # Parameter permission method for multiple items
  def checklist_items_params
    params.require(:checklist_items).require(:data).map do |item|
      permitted = item.permit(:taskId, :label, :checked, :isLayerOpen, :position, :parentId)
      {
        task_id: permitted['taskId'],
        label: permitted['label'],
        checked: permitted['checked'],
        is_layer_open: permitted['isLayerOpen'],
        position: permitted['position'],
        parent_id: permitted['parentId'],
        issue_id: params['issue_id']
      }
    end
  end

  # Find the related issue
  def find_issue
    @issue = Issue.find(params[:issue_id])
  end

  # Find the checklist item
  def find_checklist_item
    @checklist_item = ChecklistItem.find_by!(task_id: params[:id], issue_id: @issue.id)
  end

  # Build hierarchical structure
  def build_task_tree(items, parent_id = nil)
    items.select { |item| item.parent_id == parent_id }.map do |item|
      {
        taskId: item.task_id,
        label: item.label,
        checked: item.checked,
        isLayerOpen: item.is_layer_open,
        position: item.position,
        children: build_task_tree(items, item.task_id)
      }
    end
  end
end
