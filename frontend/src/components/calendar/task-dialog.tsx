"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import type { CalendarEvent } from "@/lib/types"
import { formatDateTime, getPriorityColor, getStatusColor } from "@/lib/utils"
import { mockApi } from "@/lib/mock-data"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string(),
  assignedTo: z.string(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["pending", "in-progress", "completed"]),
})

interface TaskDialogProps {
  isOpen: boolean
  onClose: () => void
  mode: "view" | "create" | "edit"
  event: CalendarEvent | null
  date: Date | null
  isManager: boolean
  userId: string
}

export function TaskDialog({ isOpen, onClose, mode, event, date, isManager, userId }: TaskDialogProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isManager && isOpen && (mode === "create" || mode === "edit")) {
      // In a real app, this would be an API call to your backend
      // For now, we'll use our mock data
      const fetchEmployees = async () => {
        try {
          const teamMembers = await mockApi.getTeamMembers(userId)
          setEmployees(
            teamMembers.map((user: any) => ({
              id: user.id,
              name: user.name,
            })),
          )
        } catch (error) {
          console.error("Failed to fetch employees:", error)
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load employees. Please try again.",
          })
        }
      }

      fetchEmployees()
    }
  }, [isManager, isOpen, mode, userId, toast])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: event?.title || "",
      description: event?.description || "",
      startDate: event
        ? format(new Date(event.start), "yyyy-MM-dd'T'HH:mm")
        : date
          ? format(date, "yyyy-MM-dd'T'HH:mm")
          : "",
      endDate: event
        ? format(new Date(event.end), "yyyy-MM-dd'T'HH:mm")
        : date
          ? format(new Date(date.getTime() + 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm")
          : "",
      assignedTo: event?.assignedTo || "",
      priority: (event?.priority as any) || "medium",
      status: (event?.status as any) || "pending",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      // In a real app, this would be an API call to your backend
      if (event) {
        // Update existing task
        await mockApi.updateTask(event.id, {
          ...values,
          createdBy: userId,
        })

        toast({
          title: "Task updated",
          description: "The task has been updated successfully.",
        })
      } else {
        // Create new task
        await mockApi.createTask({
          ...values,
          createdBy: userId,
        })

        toast({
          title: "Task created",
          description: "The task has been created successfully.",
        })
      }

      router.refresh()
      onClose()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${event ? "update" : "create"} task. Please try again.`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete() {
    if (!event) return

    setIsLoading(true)
    try {
      // In a real app, this would be an API call to your backend
      await mockApi.deleteTask(event.id)

      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully.",
      })

      router.refresh()
      onClose()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete task. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "view" ? "Task Details" : mode === "create" ? "Create Task" : "Edit Task"}
          </DialogTitle>
          <DialogDescription>
            {mode === "view"
              ? "View task details"
              : mode === "create"
                ? "Create a new task and assign it to a team member"
                : "Edit task details and update assignments"}
          </DialogDescription>
        </DialogHeader>

        {mode === "view" && event ? (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">{event.title}</h3>
              <p className="text-sm text-muted-foreground">{event.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Start Date</p>
                <p className="text-sm">{formatDateTime(event.start)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">End Date</p>
                <p className="text-sm">{formatDateTime(event.end)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getPriorityColor(event.priority)}>{event.priority}</Badge>
              <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Task title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Task description" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign To</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an employee" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees.map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="gap-2 sm:gap-0">
                {mode === "edit" && (
                  <Button type="button" variant="destructive" onClick={handleDelete} disabled={isLoading}>
                    Delete
                  </Button>
                )}
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Saving..." : mode === "create" ? "Create" : "Update"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {mode === "view" && (
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

