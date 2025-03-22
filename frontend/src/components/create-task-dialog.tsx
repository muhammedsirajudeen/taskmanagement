"use client"

import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import useSWR, { KeyedMutator } from "swr"
import { fetcher } from "@/lib/utils"
import { User } from "@/types"
import axiosInstance from "@/lib/axios"
import { TaskData } from "@/app/dashboard/dashboard.page."

interface CreateTaskDialogProps {
  isOpen: boolean
  onClose: () => void
  date: Date
  mutate: KeyedMutator<TaskData>
}

interface UserDataProps {
  users: User[]
  status: number
}

const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters")
    .trim()
    .refine(val => val.length > 0, "Title cannot be only whitespace")
    .refine(val => !/^\s+|\s+$/.test(val), "Title cannot start or end with whitespace")
    .refine(
      val => /^[a-zA-Z0-9\s\-_.,!?:;()[\]{}'"#$%&*+<>=@^`~\/\\]+$/.test(val),
      "Title contains invalid characters"
    ),
  description: z
    .string()
    .min(10)
    .max(500, "Description must be less than 500 characters")
    .optional()
    .transform(val => val === "" ? undefined : val?.trim()),
  priority: z.enum(["Low", "Medium", "High"], {
    errorMap: () => ({ message: "Please select a valid priority level" })
  }),
  assignee: z
    .string()
    .min(1, "Assignee is required")
    .refine(val => val.trim().length > 0, "Please select a valid assignee"),
  dueDate: z
    .string()
    .min(1, "Due date is required")
    .refine(val => {
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, "Please enter a valid date and time")
    .refine(val => {
      const selectedDate = new Date(val);
      const now = new Date();
      return selectedDate >= now;
    }, "Due date must be in the future"),
})

type TaskFormData = z.infer<typeof taskSchema>

export function CreateTaskDialog({ isOpen, onClose, date, mutate }: CreateTaskDialogProps) {
  const { data } = useSWR<UserDataProps>("/user/managed/all", fetcher)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "Medium",
      assignee: "",
      dueDate: format(date, "yyyy-MM-dd'T'HH:mm"),
    },
  })

  const onSubmit = async (formData: TaskFormData) => {
    console.log("Submitted Data:", formData)
    try {
      const response = await axiosInstance.post('/task/', formData)
      console.log(response)
      onClose()
      mutate()
      reset()
    } catch (error) {
      console.error("Failed to create task:", error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input id="title" {...register("title")} />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">Description</label>
              <Textarea id="description" {...register("description")} rows={4} />
              {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="priority" className="text-sm font-medium">Priority</label>
                <Select onValueChange={(value) => setValue("priority", value as TaskFormData["priority"])}>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
                {errors.priority && <p className="text-red-500 text-sm">{errors.priority.message}</p>}
              </div>

              <div className="grid gap-2">
                <label htmlFor="assignee" className="text-sm font-medium">Assignee</label>
                <Select onValueChange={(value) => setValue("assignee", value)}>
                  <SelectTrigger id="assignee">
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    {data?.users.map((user) => (
                      <SelectItem key={user._id} value={user._id}>{user.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.assignee && <p className="text-red-500 text-sm">{errors.assignee.message}</p>}
              </div>
            </div>

            <div className="grid gap-2">
              <label htmlFor="dueDate" className="text-sm font-medium">Due Date & Time</label>
              <Input id="dueDate" type="datetime-local" {...register("dueDate")} />
              {errors.dueDate && <p className="text-red-500 text-sm">{errors.dueDate.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}