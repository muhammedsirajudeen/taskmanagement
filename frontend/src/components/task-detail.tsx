"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { Task } from "@/types"
import { X, Trash, Edit } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateTask, deleteTask } from "@/lib/api"

interface TaskDetailProps {
  task: Task
  userRole: string
  onUpdate: (task: Task) => void
  onDelete: (taskId: string) => void
  onClose: () => void
}

export function TaskDetail({ task, userRole, onUpdate, onDelete, onClose }: TaskDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState<Task>(task)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedTask({ ...editedTask, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setEditedTask({ ...editedTask, [name]: value })
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      const updatedTask = await updateTask(editedTask)
      onUpdate(updatedTask)
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await deleteTask(task.id)
      onDelete(task.id)
      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error("Failed to delete task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const isManager = userRole === "Manager"

  return (
    <>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l bg-background p-6 shadow-lg animate-in slide-in-from-right lg:relative lg:animate-none">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Task Details</h2>
          <div className="flex items-center gap-2">
            {isManager && !isEditing && (
              <>
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {isEditing ? (
            <>
              <div>
                <label className="text-sm font-medium mb-1 block">Title</label>
                <Input name="title" value={editedTask.title} onChange={handleInputChange} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Description</label>
                <Textarea name="description" value={editedTask.description} onChange={handleInputChange} rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Priority</label>
                  <Select value={editedTask.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Assignee</label>
                  <Select value={editedTask.assignee} onValueChange={(value) => handleSelectChange("assignee", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="John Doe">John Doe</SelectItem>
                      <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                      <SelectItem value="Alex Johnson">Alex Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                <div
                  className="inline-block px-2 py-1 rounded-full text-xs font-medium mb-4"
                  style={{
                    backgroundColor:
                      task.priority === "High"
                        ? "rgba(239, 68, 68, 0.1)"
                        : task.priority === "Medium"
                          ? "rgba(245, 158, 11, 0.1)"
                          : "rgba(34, 197, 94, 0.1)",
                    color:
                      task.priority === "High"
                        ? "rgb(185, 28, 28)"
                        : task.priority === "Medium"
                          ? "rgb(180, 83, 9)"
                          : "rgb(21, 128, 61)",
                  }}
                >
                  {task.priority} Priority
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap mb-6">
                  {task.description || "No description provided."}
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium">Assigned to</p>
                    <p className="text-muted-foreground">{task.assignee}</p>
                  </div>
                  <div>
                    <p className="font-medium">Due Date</p>
                    <p className="text-muted-foreground">{format(new Date(task.dueDate), "MMM d, yyyy 'at' h:mm a")}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this task? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading}>
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

