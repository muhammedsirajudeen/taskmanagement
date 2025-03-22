'use client'

import axiosInstance from "@/lib/axios";
import { fetcher, ToastStyles } from "@/lib/utils";
import { useGlobalContext } from "@/providers/global.providers";
import { User } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, MoreHorizontal, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard-layout";

interface UserResponse {
  users: User[]
}

export default function Team() {
  const { setUser, user } = useGlobalContext();
  const router = useRouter();
  const { data, isLoading, mutate } = useSWR<UserResponse>('/user/all', fetcher);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState<string>("");
  const [selectedManager, setSelectedManager] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    async function userVerifier() {
      try {
        const response = await axiosInstance.get('/user/verify');
        console.log(response);
        setUser(response.data.user);
      } catch (error) {
        console.log(error);
        router.push('/login');
      }
    }
    userVerifier();
  }, [router, setUser]);

  if (!user) return null;
  
  const isManager = user.role === "Manager";
  const managers = data?.users.filter(user => user.role === "Manager") || [];

  const handleEditRole = (teamMember: User) => {
    setEditingUser(teamMember);
    setNewRole(teamMember.role);
    setSelectedManager(teamMember?.manager?._id || "");
    console.log(selectedManager)
    setIsDialogOpen(true);
  };

  const handleRoleChange = async () => {
    if (!editingUser) return;
    
    setIsUpdating(true);
    try {
      await axiosInstance.put(`/user/${editingUser._id}/role`, {
        role: newRole,
        manager: selectedManager || null
      });
      
      // Refresh the data
      await mutate();
      
      toast("User updated successfully", ToastStyles.success);
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast("Please try again", ToastStyles.error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <DashboardLayout user={user}>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Team Members</h2>
            <p className="text-muted-foreground">
              Manage your team members and their roles
            </p>
          </div>

        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team</CardTitle>
            <CardDescription>
              {data?.users.length || 0} team members in your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : data?.users && data.users.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    {isManager && <TableHead className="w-16">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.users.map((teamMember) => (
                    <TableRow key={teamMember._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center mr-2">
                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          {teamMember.name || "No name"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          {teamMember.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          teamMember.role === "Manager" 
                            ? "bg-blue-50 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300" 
                            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        }`}>
                          {teamMember.role}
                        </span>
                      </TableCell>
                      {isManager && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditRole(teamMember)}>
                                Assign Role
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <UserIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No team members found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {isManager 
                    ? "Get started by adding your first team member." 
                    : "No team members have been added yet."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Role Assignment Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Role</DialogTitle>
            <DialogDescription>
              Change the role for {editingUser?.name || "this user"}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Select Role
              </label>
              <Select value={newRole} onValueChange={setNewRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {isManager  && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Assign Manager
                </label>
                <Select value={selectedManager}  onValueChange={setSelectedManager}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a manager" />
                  </SelectTrigger>
                  <SelectContent >
                    {managers.map((manager) => (
                      <SelectItem 
                      key={manager._id} 
                      value={manager._id}
                      >
                      {manager.name || manager.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleChange} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}