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
import { useForm, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// Define Zod schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginFormValues = z.infer<typeof loginSchema>
type SignupFormValues = z.infer<typeof signupSchema>

export default function Login() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [tabs, setTabs] = useState<"login" | "signup">("login")

  const { register: loginRegister, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const { register: signupRegister, handleSubmit: handleSignupSubmit, formState: { errors: signupErrors, },reset:signupReset } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  })

  const onLoginSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.post('/user/signin', data)
      console.log(response)
      window.localStorage.setItem('access_token', response.data.token)
      toast.success("Login successful", ToastStyles.success)
      router.push("/dashboard")
    } catch (error) {
      const fetchError = error as AxiosError
      if (fetchError.response?.status === HttpStatusCode.NotFound) {
        toast.error("User not found", ToastStyles.error)
      } else {
        toast.error("An error occurred", ToastStyles.error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const onSignupSubmit: SubmitHandler<SignupFormValues> = async (data) => {
    setIsLoading(true)
    try {
      const response = await axiosInstance.post('/user/signup', data)
      console.log(response)
      toast.success("User registered successfully", ToastStyles.success)
      signupReset()
      setTabs("login")
      
    } catch (error) {
      const fetchError = error as AxiosError
      if (fetchError.response?.status === HttpStatusCode.Conflict) {
        toast.error("User already exists", ToastStyles.error)
      } else {
        toast.error("An error occurred", ToastStyles.error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("login", tokenResponse.access_token)
      try {
        const response = await axiosInstance.post('/user/google/signin', { token: tokenResponse.access_token })
        console.log(response)
        window.localStorage.setItem('access_token', response.data.token)
        toast.success('User signed in successfully', ToastStyles.success)
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      } catch (error) {
        console.log(error)
        const fetchError = error as AxiosError
        if (fetchError.response?.status === HttpStatusCode.NotFound) {
          toast.error("Please register before continuing", ToastStyles.error)
        }
      }
    },
    scope: "https://www.googleapis.com/auth/calendar.events"
  })

  const signup = useGoogleLogin({
    onSuccess: async (tokenResponse: TokenResponse) => {
      setIsLoading(true)
      console.log("signup ", tokenResponse)
      try {
        const response = await axiosInstance.post('/user/google/signup', { token: tokenResponse.access_token })
        console.log(response)
        toast.success("User signed up successfully", ToastStyles.success)
        setIsLoading(false)
        setTimeout(() => {
          router.push('/login')
        }, 1000)
      } catch (error) {
        const fetchError = error as AxiosError
        if (fetchError.response?.status === HttpStatusCode.NotFound) {
          toast.error('User not found', ToastStyles.error)
        } else if (fetchError.response?.status === HttpStatusCode.Conflict) {
          toast.error('User already exists', ToastStyles.error)
        } else {
          toast.error('Please try again', ToastStyles.error)
        }
        setIsLoading(false)
      }
    },
    scope: "https://www.googleapis.com/auth/calendar.events"
  })

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
            <form onSubmit={handleLoginSubmit(onLoginSubmit)}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john@example.com" {...loginRegister("email")} />
                  {loginErrors.email && <span className="text-red-500 text-sm">{loginErrors.email.message}</span>}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input id="password" type="password" {...loginRegister("password")} />
                  {loginErrors.password && <span className="text-red-500 text-sm">{loginErrors.password.message}</span>}
                </div>
                <GoogleLoginButton isLoading={isLoading} onLogin={login} />
              </CardContent>
              <CardFooter className="mt-10">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={handleSignupSubmit(onSignupSubmit)}>
              <CardContent className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" {...signupRegister("name")} />
                  {signupErrors.name && <span className="text-red-500 text-sm">{signupErrors.name.message}</span>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input id="register-email" type="email" placeholder="john@example.com" {...signupRegister("email")} />
                  {signupErrors.email && <span className="text-red-500 text-sm">{signupErrors.email.message}</span>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input id="register-password" type="password" {...signupRegister("password")} />
                  {signupErrors.password && <span className="text-red-500 text-sm">{signupErrors.password.message}</span>}
                </div>
                <GoogleLoginButton isLoading={isLoading} onLogin={signup} />
              </CardContent>
              <CardFooter className="mt-10">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}