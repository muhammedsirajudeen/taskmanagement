import type { Task } from "@/types"

// Mock data for tasks
const mockTasks: Task[] = [
    {
        id: "1",
        title: "Complete project proposal",
        description: "Draft and finalize the project proposal for the new client.",
        assignee: "John Doe",
        assignedBy: "Jane Smith",
        dueDate: new Date().toISOString(),
        priority: "High",
        status: "In Progress",
        createdAt: new Date().toISOString(),
    },
    {
        id: "2",
        title: "Review code changes",
        description: "Review and approve the latest pull request for the frontend changes.",
        assignee: "Jane Smith",
        assignedBy: "John Doe",
        dueDate: new Date().toISOString(),
        priority: "Medium",
        status: "Pending",
        createdAt: new Date().toISOString(),
    },
    {
        id: "3",
        title: "Prepare for client meeting",
        description: "Create slides and gather materials for tomorrow's client presentation.",
        assignee: "Alex Johnson",
        assignedBy: "Jane Smith",
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
        priority: "High",
        status: "Pending",
        createdAt: new Date().toISOString(),
    },
]

// Simulate API calls with mock data
export const fetchTasks = async (): Promise<Task[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Return mock data
    return mockTasks
}

export const createTask = async (taskData: Partial<Task>): Promise<Task> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Create a new task with the provided data
    const newTask: Task = {
        id: Math.random().toString(36).substring(2, 9),
        title: taskData.title || "",
        description: taskData.description || "",
        assignee: taskData.assignee || "",
        assignedBy: "Current User", // This would come from the authenticated user
        dueDate: taskData.dueDate || new Date().toISOString(),
        priority: (taskData.priority as "Low" | "Medium" | "High") || "Medium",
        status: "Pending",
        createdAt: new Date().toISOString(),
    }

    // In a real app, this would be an API call to create the task
    mockTasks.push(newTask)

    return newTask
}

export const updateTask = async (taskData: Task): Promise<Task> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Find the task to update
    const taskIndex = mockTasks.findIndex((task) => task.id === taskData.id)

    if (taskIndex === -1) {
        throw new Error("Task not found")
    }

    // Update the task
    mockTasks[taskIndex] = {
        ...mockTasks[taskIndex],
        ...taskData,
    }

    return mockTasks[taskIndex]
}

export const deleteTask = async (taskId: string): Promise<void> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Find the task to delete
    const taskIndex = mockTasks.findIndex((task) => task.id === taskId)

    if (taskIndex === -1) {
        throw new Error("Task not found")
    }

    // Delete the task
    mockTasks.splice(taskIndex, 1)
}

