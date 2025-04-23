import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database } from "@/types/db";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Download, MoreHorizontal, Eye, User, ArrowUpDown } from "lucide-react";
import { format } from "date-fns";

type User = Database["public"]["Tables"]["users"]["Row"];

interface UsersTableProps {
  data: User[];
}

export function UsersTable({ data = [] }: UsersTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [userStatus, setUserStatus] = useState("all");
  const [userRole, setUserRole] = useState("all");

  const filteredUsers = data.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    
    const matchesSearch =
      fullName.includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.id.toString().includes(searchTerm);

    const matchesStatus = 
      userStatus === "all" || 
      (user.status || '').toLowerCase() === userStatus.toLowerCase();

    const matchesRole =
      userRole === "all" || 
      (user.role || '').toLowerCase() === userRole.toLowerCase();

    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>View and manage all system users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4 mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
              <Select value={userRole} onValueChange={setUserRole}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={userStatus} onValueChange={setUserStatus}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>
                    <div className="flex items-center">
                      Created
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">USER-{user.id.toString().padStart(6, '0')}</TableCell>
                      <TableCell>{user.first_name} {user.last_name}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleVariant(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(user.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions for badge variants
function getStatusVariant(status?: string) {
  switch (status?.toLowerCase()) {
    case 'active':
      return 'default';
    case 'inactive':
      return 'secondary';
    case 'suspended':
      return 'destructive';
    default:
      return 'outline';
  }
}

function getRoleVariant(role?: string) {
  switch (role?.toLowerCase()) {
    case 'admin':
      return 'destructive';
    case 'manager':
      return 'secondary';
    case 'user':
      return 'default';
    default:
      return 'outline';
  }
}