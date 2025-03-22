"use client"

import { format } from "date-fns"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PopulatedTask,  } from "@/types"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { KeyedMutator } from "swr"
import { TaskData } from "@/app/dashboard/dashboard.page."

interface TaskListProps {
  date: Date
  tasks: PopulatedTask[]
  isLoading: boolean
  onTaskSelect: (task: PopulatedTask) => void
  userRole: string
  mutate:KeyedMutator<TaskData>

}

export function TaskList({ date, tasks,mutate, isLoading, onTaskSelect, userRole }: TaskListProps) {
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)

  const filteredTasks = tasks.filter((task) => new Date(task.dueDate).toDateString() === date.toDateString())

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "Medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
    }
  }

  return (
    <div className="h-full flex flex-col border-b">
      <div className="p-4 border-b sticky top-0 bg-background z-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">{format(date, "MMMM d, yyyy")}</h2>
          {userRole === "Manager" && (
            <Button size="sm" onClick={() => setIsCreateTaskOpen(true)} className="gap-1">
              <Plus className="h-4 w-4" />
              New Task
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"} for this day
        </p>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {isLoading ? (
          <div className="space-y-3">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex flex-col space-y-2">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ))}
          </div>
        ) : filteredTasks.length > 0 ? (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              
              <div
                key={task._id}
                className="p-3 border rounded-lg hover:border-primary cursor-pointer transition-colors"
                onClick={() => onTaskSelect(task)}
              >
                
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">{task.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{task.description}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Assigned to: {task.assignee.email}</span>
                  <span>{format(new Date(task.dueDate), "h:mm a")}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <p className="text-muted-foreground mb-4">No tasks for this day</p>
            {userRole === "Manager" && (
              <Button variant="outline" onClick={() => setIsCreateTaskOpen(true)} className="gap-1">
                <Plus className="h-4 w-4" />
                Create Task
              </Button>
            )}
          </div>
        )}
      </div>

      <CreateTaskDialog mutate={mutate} isOpen={isCreateTaskOpen} onClose={() => setIsCreateTaskOpen(false)} date={date} />
    </div>
  )
}

