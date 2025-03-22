"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import type { PopulatedTask, User } from "@/types"
import { X, Trash, Edit } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useSWR from "swr"
import { fetcher } from "@/lib/utils"

interface TaskDetailProps {
  task: PopulatedTask
  userRole: string
  onUpdate: (task: PopulatedTask) => void
  onDelete: (taskId: string) => void
  onClose: () => void
}

interface UserResponse{
  users:User[]
}

export function TaskDetail({ task, userRole,onUpdate, onDelete, onClose }: TaskDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState<PopulatedTask>(task)
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const {data}=useSWR<UserResponse>('/user/all',fetcher)
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
      onUpdate(editedTask)
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
      onDelete(task._id)
      setIsDeleteDialogOpen(false)
      onClose() // Close the panel after deletion
    } catch (error) {
      console.error("Failed to delete task:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const isManager = userRole === "Manager"

  return (
    <>
      {/* Overlay for mobile - improved to cover entire screen */}
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden" 
        onClick={onClose} 
      />
      
      {/* Main panel - improved responsive behavior */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:max-w-md md:max-w-lg border-l bg-background p-4 sm:p-6 shadow-lg animate-in slide-in-from-right duration-300 overflow-y-auto">
        {/* Header - made more compact on small screens */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-base sm:text-lg font-semibold">Task Details</h2>
          <div className="flex items-center gap-1 sm:gap-2">
            {isManager && !isEditing && (
              <>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={onClose}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          {isEditing ? (
            <>
              <div>
                <label className="text-xs sm:text-sm font-medium mb-1 block">Title</label>
                <Input name="title" value={editedTask.title} onChange={handleInputChange} className="text-sm sm:text-base" />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium mb-1 block">Description</label>
                <Textarea 
                  name="description" 
                  value={editedTask.description} 
                  onChange={handleInputChange} 
                  rows={4} 
                  className="text-sm sm:text-base resize-none sm:resize-y min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm font-medium mb-1 block">Priority</label>
                  <Select value={editedTask.priority} onValueChange={(value) => handleSelectChange("priority", value)}>
                    <SelectTrigger className="text-sm sm:text-base">
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
                  <label className="text-xs sm:text-sm font-medium mb-1 block">Assignee</label>
                  <Select value={editedTask.assignee._id} onValueChange={(value) => handleSelectChange("assignee", value)}>
                    <SelectTrigger className="text-sm sm:text-base">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      {
                        data?.users.map((user)=>{
                          return(
                            <SelectItem key={user._id} value={user._id}>{user.name || user.email}</SelectItem>
                          )
                        })
                      }
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setIsEditing(false)} size="sm" className="text-xs sm:text-sm h-8 sm:h-10">
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading} size="sm" className="text-xs sm:text-sm h-8 sm:h-10">
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 break-words">{task.title}</h3>
                <div
                  className="inline-block px-2 py-1 rounded-full text-xs font-medium mb-3 sm:mb-4"
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
                <div className="mb-4 sm:mb-6">
                  <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-wrap">
                    {task.description || "No description provided."}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                    <p className="font-medium">Assigned to</p>
                    <p className="text-muted-foreground truncate">{task.assignee.email}</p>
                  </div>
                  <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                    <p className="font-medium">Due Date</p>
                    <p className="text-muted-foreground">
                      {format(new Date(task.dueDate), "MMM d, yyyy")}
                      <br className="sm:hidden" />
                      <span className="hidden sm:inline"> at </span>
                      {format(new Date(task.dueDate), "h:mm a")}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
          </DialogHeader>
          <p className="text-sm sm:text-base">Are you sure you want to delete this task? This action cannot be undone.</p>
          <DialogFooter className="flex sm:justify-end gap-2 sm:gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="flex-1 sm:flex-none">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isLoading} className="flex-1 sm:flex-none">
              {isLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}