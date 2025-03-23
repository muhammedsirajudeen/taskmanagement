export interface User {
    _id: string
    name: string
    email: string
    role: "Manager" | "Employee"
    manager?: User
}
export interface CalendarEvent {
    id: string
    title: string
    start: Date
    end: Date
    priority: "High" | "Medium" | "Low" | "Default"
    description?: string
    assignedTo?: string
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

