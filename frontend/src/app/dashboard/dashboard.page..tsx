"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Calendar } from "@/components/calendar"
import { TaskList } from "@/components/task-list"
import { TaskDetail } from "@/components/task-detail"
import type { PopulatedTask } from "@/types"
import axiosInstance from "@/lib/axios"
import { useGlobalContext } from "@/providers/global.providers"
import useSWR from "swr"
import { fetcher, ToastStyles } from "@/lib/utils"
import { toast } from "sonner"

export interface TaskData{
  tasks:PopulatedTask[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const {data,mutate}=useSWR<TaskData>('/task',fetcher)
  
  const [tasks, setTasks] = useState<PopulatedTask[]>([])
  console.log(data)
  useEffect(()=>{
    if(data){
      setTasks(data.tasks)
    }
  },[data])
  const [selectedTask, setSelectedTask] = useState<PopulatedTask | null>(null)
  const [isLoading] = useState(false)
  const {user,setUser}=useGlobalContext()
  useEffect(() => {

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

    // const loadTasks = async () => {
    //   setIsLoading(true)
    //   try {
    //     // setTasks([])
    //   } catch (error) {
    //     console.error("Failed to fetch tasks:", error)
    //   } finally {
    //     setIsLoading(false)
    //   }
    // }

    // loadTasks()
  }, [selectedDate, router, setUser])

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setSelectedTask(null)
  }

  const handleTaskSelect = (task: PopulatedTask) => {
    setSelectedTask(task)
  }

  const handleTaskUpdate = async  (updatedTask: PopulatedTask) => {
    // setTasks(tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    try {
      await axiosInstance.put(`/task/${updatedTask._id}`,updatedTask)
      mutate()
      setSelectedTask(null)
      toast.success("updated successfully",ToastStyles.success)      
    } catch (error) {
      console.log(error)
      toast.error("please try again",ToastStyles.error)
    }
  }


  const handleTaskDelete = async (taskId: string) => {
    try {
      await axiosInstance.delete(`/task/${taskId}`)
      setSelectedTask(null)
      mutate()
      toast.success("delete successfully",ToastStyles.success)
    } catch (error) {
      console.log(error)
      toast.error("please try again",ToastStyles.error)  
    }
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
            mutate={mutate}
            isLoading={isLoading}
            onTaskSelect={handleTaskSelect}
            userRole={user.role}
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

