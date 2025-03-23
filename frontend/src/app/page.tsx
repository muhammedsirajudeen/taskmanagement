"use client"
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, CheckCircleIcon, UsersIcon } from "lucide-react";
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '@/lib/utils';
import { User } from '@/types';
interface TokenVerificationResponse {
  message: string
  user: User
}
export default function Home() {
  const router = useRouter()
  const { data } = useSWR<TokenVerificationResponse>('/user/verify', fetcher)

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold">TaskFlow</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">Features</a>
            <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900">How it works</a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900">Pricing</a>
          </nav>
          {
            data?.user ? (
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => {
                  router.push("/dashboard")
                }} >Dashboard</Button>
              </div>

            )
              :
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => {
                  router.push("/login")
                }} >Log in</Button>
                <Button>Sign up</Button>
              </div>

          }
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 mb-6">
            Effortless Task Management for Teams
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            A powerful calendar-based task assignment platform that simplifies workflow management and boosts team productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started Free
            </Button>
            <Button size="lg" variant="outline">
              Book a Demo
            </Button>
          </div>

          {/* App Preview */}
          <div className="bg-white p-4 rounded-lg shadow-xl border border-gray-200 max-w-5xl mx-auto">
            <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
              <div className="text-center text-gray-500">
                <CalendarIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Calendar Interface Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CalendarIcon className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Intuitive Calendar View</CardTitle>
                <CardDescription>Schedule and visualize tasks across days, weeks, or months with our flexible calendar interface</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Easily drag and drop tasks, set deadlines, and get a clear overview of team workload at a glance.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <UsersIcon className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Role-Based Access</CardTitle>
                <CardDescription>Manager and Employee roles with appropriate permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Managers can create, assign and supervise tasks while employees can efficiently track and update their assignments.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircleIcon className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Complete Task Management</CardTitle>
                <CardDescription>Full CRUD operations for tasks with detailed tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Create, read, update, and delete tasks while keeping record of progress, comments, and completion status.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your account and set up your organization</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Add Team Members</h3>
              <p className="text-gray-600">Invite employees and assign appropriate roles</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Create Tasks</h3>
              <p className="text-gray-600">Schedule tasks and assign them to team members</p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">4</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Track Progress</h3>
              <p className="text-gray-600">Monitor completion and manage workloads</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Simple, Transparent Pricing</h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <CardDescription>For small teams or personal use</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Up to 5 users</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Basic task management</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Calendar view</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Get Started</Button>
              </CardFooter>
            </Card>

            <Card className="border-blue-200 shadow-lg">
              <CardHeader className="bg-blue-50 rounded-t-lg">
                <div className="py-1 px-3 bg-blue-600 text-white text-xs rounded-full w-fit mb-4">POPULAR</div>
                <CardTitle>Pro</CardTitle>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold">$12</span>
                  <span className="text-gray-600">/user/month</span>
                </div>
                <CardDescription>For growing teams</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Unlimited users</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Advanced task management</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Role-based permissions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Analytics dashboard</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Try Free for 14 Days</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold">Custom</span>
                </div>
                <CardDescription>For large organizations</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Everything in Pro</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>SSO Authentication</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Custom integrations</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                    <span>Dedicated support</span>
                  </li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Contact Sales</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to streamline your task management?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of teams that use TaskFlow to boost productivity and simplify collaboration.
          </p>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            Get Started Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="h-6 w-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">TaskFlow</h2>
              </div>
              <p className="text-sm">Streamlining task management for teams of all sizes.</p>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
                <li><a href="#" className="hover:text-white">Roadmap</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Guides</a></li>
                <li><a href="#" className="hover:text-white">API Reference</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-medium mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">&copy; 2025 TaskFlow. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">Terms</a>
              <a href="#" className="text-gray-400 hover:text-white">Privacy</a>
              <a href="#" className="text-gray-400 hover:text-white">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}