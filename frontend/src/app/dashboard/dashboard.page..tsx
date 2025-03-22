"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Calendar } from "@/components/calendar"
import { TaskList } from "@/components/task-list"
import { TaskDetail } from "@/components/task-detail"
import type { Task } from "@/types"
import { fetchTasks } from "@/lib/api"
import axiosInstance from "@/lib/axios"
import { useGlobalContext } from "@/providers/global.providers"

export default function DashboardPage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const {user,setUser}=useGlobalContext()
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("access_token")
    if (!storedUser) {
      router.push("/login")
      return
    }
    async function userVerifier(){
      try {
        const response=await axiosInstance.get('/user/verify')
        console.log(response)   
        setUser(response.data.user)  
           
      } catch (error) {
        console.log(error)
        router.push('/login')
      }
    }
    
    userVerifier()
    // setUser(JSON.parse(storedUser))
    // setUser({email:"ss",name:"ss",role:"Manager",id:"ss"})
    // Fetch tasks for the selected date
    const loadTasks = async () => {
      setIsLoading(true)
      try {
        const tasksData = await fetchTasks()
        setTasks(tasksData)
      } catch (error) {
        console.error("Failed to fetch tasks:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTasks()
  }, [selectedDate, router])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedTask(null)
  }

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task)
  }

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    setSelectedTask(null)
  }

  const handleTaskCreate = (newTask: Task) => {
    setTasks([...tasks, newTask])
    setSelectedTask(null)
  }

  const handleTaskDelete = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId))
    setSelectedTask(null)
  }

  if (!user) return null

  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col lg:flex-row h-full">
        <div className="w-full lg:w-8/12 p-4">
          <Calendar selectedDate={selectedDate} onDateSelect={handleDateSelect} tasks={tasks} userRole={user.role} />
        </div>
        <div className="w-full lg:w-4/12 border-l border-border">
          <TaskList
            date={selectedDate}
            tasks={tasks}
            isLoading={isLoading}
            onTaskSelect={handleTaskSelect}
            userRole={user.role}
            onTaskCreate={handleTaskCreate}
          />
          {selectedTask && (
            <TaskDetail
              task={selectedTask}
              userRole={user.role}
              onUpdate={handleTaskUpdate}
              onDelete={handleTaskDelete}
              onClose={() => setSelectedTask(null)}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

