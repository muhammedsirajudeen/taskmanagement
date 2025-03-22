"use client"

import { useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { PopulatedTask } from "@/types"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { mutate } from "swr"

interface CalendarProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  tasks: PopulatedTask[]
  userRole: string
}

export function Calendar({ selectedDate, onDateSelect, tasks, userRole }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [taskDate, setTaskDate] = useState<Date | null>(null)

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleDateClick = (day: Date) => {
    onDateSelect(day)
  }

  const handleCreateTask = (day: Date) => {
    if (userRole === "Manager") {
      setTaskDate(day)
      setIsCreateTaskOpen(true)
    } else {
      onDateSelect(day)
    }
  }

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">{format(currentMonth, "MMMM yyyy")}</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return (
      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((day) => (
          <div key={day} className="text-center text-sm font-medium py-2">
            {day}
          </div>
        ))}
      </div>
    )
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart)
    const endDate = endOfWeek(monthEnd)

    const rows = []
    let days = []
    let day = startDate
    let formattedDate = ""

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d")
        const cloneDay = day
        const dayTasks = tasks.filter((task) => isSameDay(new Date(task.dueDate), day))

        days.push(
          <div
            key={day.toString()}
            className={`min-h-[100px] p-2 border rounded-md relative ${
              !isSameMonth(day, monthStart)
                ? "text-muted-foreground bg-muted/30"
                : isSameDay(day, selectedDate)
                  ? "bg-primary/10 border-primary"
                  : ""
            }`}
            onClick={() => handleDateClick(cloneDay)}
          >
            <div className="flex justify-between items-start">
              <span
                className={`text-sm ${isSameDay(day, new Date()) ? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center" : ""}`}
              >
                {formattedDate}
              </span>
              {userRole === "Manager" && isSameMonth(day, monthStart) && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-50 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCreateTask(cloneDay)
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="mt-2 space-y-1">
              {dayTasks.slice(0, 3).map((task) => (
                <div
                  key={task._id}
                  className={`text-xs p-1 rounded truncate ${
                    task.priority === "High"
                      ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                      : task.priority === "Medium"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                        : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                  }`}
                >
                  {task.title}
                </div>
              ))}
              {dayTasks.length > 3 && <div className="text-xs text-muted-foreground">+{dayTasks.length - 3} more</div>}
            </div>
          </div>,
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div key={day.toString()} className="grid grid-cols-7 gap-1">
          {days}
        </div>,
      )
      days = []
    }
    return <div className="space-y-1">{rows}</div>
  }

  return (
    <div className="h-full flex flex-col">
      {renderHeader()}
      {renderDays()}
      <div className="flex-1 overflow-y-auto">{renderCells()}</div>
      {taskDate && (
        <CreateTaskDialog mutate={mutate} isOpen={isCreateTaskOpen} onClose={() => setIsCreateTaskOpen(false)} date={taskDate} />
      )}
    </div>
  )
}

