export interface User {
    _id: string
    name: string
    email: string
    role: "Manager" | "Employee"
}

export interface Task {
    _id: string
    title: string
    description: string
    assignee: string
    assignedBy: string
    dueDate: string
    priority: "Low" | "Medium" | "High"
    status: "Pending" | "In Progress" | "Completed"
    createdAt: string
}
export interface PopulatedTask extends Omit<Task, "assignee" | "assignedBy"> {
    assignee: User
    assignedBy: User
}

