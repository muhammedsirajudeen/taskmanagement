export interface User {
    id: string
    name: string
    email: string
    role: "Manager" | "Employee"
}

export interface Task {
    id: string
    title: string
    description: string
    assignee: string
    assignedBy: string
    dueDate: string
    priority: "Low" | "Medium" | "High"
    status: "Pending" | "In Progress" | "Completed"
    createdAt: string
}

