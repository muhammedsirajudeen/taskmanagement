"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import GoogleLoginButton from "@/components/google.button"
import { TokenResponse, useGoogleLogin } from "@react-oauth/google"
import { useState } from "react"
import axiosInstance from "@/lib/axios"
import { AxiosError, HttpStatusCode } from "axios"
import { ToastStyles } from "@/lib/utils"

export default function Login() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tabs,setTabs]=useState<"login"|"signup">("login")
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          role: "Manager",
        }),
      )

      toast.success("login successful")

      router.push("/dashboard")
      setIsLoading(false)
    }, 1000)
  }
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("login", tokenResponse.access_token)
      try {        
        const response=await axiosInstance.post('/user/google/signin',{token:tokenResponse.access_token})
        console.log(response)
        window.localStorage.setItem('access_token',response.data.token)
        toast.success('user signed in successfully',ToastStyles.success)
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000);
      } catch (error) {
        console.log(error)
        const fetchError=error as AxiosError
        if(fetchError.status===HttpStatusCode.NotFound){
          toast.error("please register before continuing",ToastStyles.error)
        }
      }
      
    },
    scope: "https://www.googleapis.com/auth/calendar"
  });
  const signup= useGoogleLogin({
    onSuccess: async (tokenResponse:TokenResponse) => {
      setIsLoading(true)
      console.log("signup ",tokenResponse)
      try {        
        const response=await axiosInstance.post('/user/google/signup',{token:tokenResponse.access_token})
        console.log(response)
        toast.success("User signed", {
          style: { backgroundColor: "green", color: "white", border: "1px solid #374151" },
        });
        setIsLoading(false)
        setTimeout(()=>{
          router.push('/login')
        },1000)
      } catch (error) {
          const fetchError=error as AxiosError
          if(fetchError.status===HttpStatusCode.NotFound){
            toast.error('user not found',{style:{backgroundColor:"red",color:"white"}})
          }else if(fetchError.status===HttpStatusCode.Conflict){
            toast.error('user already exists',{style:{backgroundColor:"red",color:"white"}})

          }
          else{
            toast.error('please try again')
          }
          setIsLoading(false)
      }
    },
    scope: "https://www.googleapis.com/auth/calendar"
  });
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Task Manager</CardTitle>
          <CardDescription className="text-center">Sign in to your account to continue</CardDescription>
        </CardHeader>
        <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login" onClick={() => setTabs("login")}>Login</TabsTrigger>
            <TabsTrigger value="register" onClick={() => setTabs("signup")}>Register</TabsTrigger>
            </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" required />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <GoogleLoginButton isLoading={isLoading} onLogin={login} />

              </CardContent>
              <CardFooter className="mt-10" >
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input id="register-email" type="email" placeholder="john@example.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input id="register-password" type="password" required />
              </div>
              {/* <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                {/* <select
                  id="role"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Employee">Employee</option>
                  <option value="Manager">Manager</option>
                </select> */}
              {/* </div> */} 
              <GoogleLoginButton isLoading={isLoading} onLogin={signup} />

            </CardContent>
            <CardFooter className="mt-10"  >
              <Button disabled={isLoading} className="w-full">Create Account</Button>
            </CardFooter>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

