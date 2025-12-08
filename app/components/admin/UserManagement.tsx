"use client";

import React, { useState, useEffect } from "react";
import { base44 } from "@/app/api/base44Client";
import { UserEntity } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  User,
  Plus,
  Loader2,
  Trash2,
  Copy,
  CheckCircle2,
  Phone,
} from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  admin: "អ្នកគ្រប់គ្រង",
  manager: "អ្នកគ្រប់គ្រងផលិតផល",
  user: "អ្នកប្រើប្រាស់",
};

const ROLE_COLORS: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700",
  manager: "bg-blue-100 text-blue-700",
  user: "bg-gray-100 text-gray-700",
};

type NewUserForm = {
  phone: string;
  full_name: string;
  password: string;
  role: string;
};

type CreatedUser = UserEntity & { password?: string };

export default function UserManagement() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newUser, setNewUser] = useState<NewUserForm>({
    phone: "",
    full_name: "",
    password: "",
    role: "user",
  });
  const [createdUser, setCreatedUser] = useState<CreatedUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserEntity | null>(null);
  const [copied, setCopied] = useState(false);
  const [users, setUsers] = useState<UserEntity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      const data = await base44.entities.User.list("-created_date");
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users:", err);
    }
    setIsLoading(false);
  };

  const handleCreateUser = async () => {
    if (!newUser.phone || !newUser.full_name) return;

    setIsCreating(true);
    try {
      const password =
        newUser.password ||
        Math.random().toString(36).slice(-10) +
          Math.random().toString(36).slice(-4).toUpperCase();
      const user = await base44.entities.User.create({
        phone: newUser.phone,
        full_name: newUser.full_name,
        role: (newUser.role as UserEntity["role"]) || "user",
      });

      setCreatedUser({ ...user, password });
      setShowCreateDialog(false);
      setNewUser({ phone: "", full_name: "", password: "", role: "user" });
      await loadUsers();
    } catch (err) {
      console.error("Failed to create user:", err);
    }
    setIsCreating(false);
  };

  const handleDeleteUser = async () => {
    if (!deleteUser) return;

    setIsDeleting(true);
    try {
      await base44.entities.User.delete(deleteUser.id);
      setDeleteUser(null);
      await loadUsers();
    } catch (err) {
      console.error("Failed to delete user:", err);
    }
    setIsDeleting(false);
  };

  const copyCredentials = () => {
    if (!createdUser) return;
    const text = `លេខទូរស័ព្ទ: ${createdUser.phone}\nពាក្យសម្ងាត់: ${createdUser.password}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl shadow-sm border">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-gray-50">
          <CardTitle className="text-xl flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-xl">
              <User className="w-6 h-6 text-white" />
            </div>
            គ្រប់គ្រងអ្នកប្រើប្រាស់
          </CardTitle>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="gap-2 h-12 text-base px-5"
          >
            <Plus className="w-5 h-5" />
            បង្កើតគណនី
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <div className="bg-white rounded-xl border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-base">ឈ្មោះពេញ</TableHead>
                    <TableHead className="text-base">លេខទូរស័ព្ទ</TableHead>
                    <TableHead className="text-base">តួនាទី</TableHead>
                    <TableHead className="text-base">បានបង្កើត</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium text-base">
                        {user.full_name || "-"}
                      </TableCell>
                      <TableCell className="text-base">
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          {user.phone || user.email || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            ROLE_COLORS[user.role || "user"] || ROLE_COLORS.user
                          }
                        >
                          {ROLE_LABELS[user.role || "user"] || ROLE_LABELS.user}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-base text-gray-500">
                        {user.created_date
                          ? new Date(user.created_date).toLocaleDateString(
                              "km-KH"
                            )
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {user.role !== "admin" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteUser(user)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {users.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-12 text-gray-500"
                      >
                        រកមិនឃើញអ្នកប្រើប្រាស់។
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl">
              បង្កើតគណនីអ្នកប្រើប្រាស់ថ្មី
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-base">ឈ្មោះពេញ *</Label>
              <Input
                value={newUser.full_name}
                onChange={(e) =>
                  setNewUser({ ...newUser, full_name: e.target.value })
                }
                placeholder="បញ្ចូលឈ្មោះពេញ"
                className="mt-2 h-12 text-base"
              />
            </div>
            <div>
              <Label className="text-base flex items-center gap-2">
                <Phone className="w-4 h-4" />
                លេខទូរស័ព្ទ *
              </Label>
              <Input
                type="tel"
                value={newUser.phone}
                onChange={(e) =>
                  setNewUser({ ...newUser, phone: e.target.value })
                }
                placeholder="012345678"
                className="mt-2 h-12 text-base"
              />
            </div>
            <div>
              <Label className="text-base">តួនាទី *</Label>
              <Select
                value={newUser.role}
                onValueChange={(v) => setNewUser({ ...newUser, role: v })}
              >
                <SelectTrigger className="mt-2 h-12 text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">អ្នកប្រើប្រាស់</SelectItem>
                  <SelectItem value="manager">អ្នកគ្រប់គ្រងផលិតផល</SelectItem>
                  <SelectItem value="admin">អ្នកគ្រប់គ្រង</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-base">ពាក្យសម្ងាត់ (ស្រេចចិត្ត)</Label>
              <Input
                type="text"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                placeholder="បញ្ចូលពាក្យសម្ងាត់ ឬទុកទទេដើម្បីបង្កើតដោយស្វ័យប្រវត្តិ"
                className="mt-2 h-12 text-base"
              />
              <p className="text-sm text-gray-500 mt-2">
                បើទុកទទេ នឹងបង្កើតពាក្យសម្ងាត់ដោយស្វ័យប្រវត្តិ
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
              className="h-12 text-base px-6"
            >
              បោះបង់
            </Button>
            <Button
              onClick={handleCreateUser}
              disabled={!newUser.phone || !newUser.full_name || isCreating}
              className="h-12 text-base px-6"
            >
              {isCreating && (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              )}
              បង្កើតគណនី
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog with Credentials */}
      <Dialog open={!!createdUser} onOpenChange={() => setCreatedUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2 text-green-600">
              <CheckCircle2 className="w-6 h-6" />
              គណនីបានបង្កើតដោយជោគជ័យ
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5">
              <p className="text-base font-semibold text-yellow-800 mb-4">
                សូមចម្លងព័ត៌មាននេះ ហើយផ្តល់ជូនអ្នកប្រើប្រាស់:
              </p>
              <div className="space-y-3 bg-white rounded-lg p-4 border border-yellow-300">
                <div>
                  <Label className="text-sm text-gray-600 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    លេខទូរស័ព្ទ
                  </Label>
                  <p className="text-lg font-mono font-semibold text-gray-900 break-all">
                    {createdUser?.phone}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">ពាក្យសម្ងាត់</Label>
                  <p className="text-lg font-mono font-semibold text-gray-900">
                    {createdUser?.password}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">តួនាទី</Label>
                  <p className="text-lg font-semibold text-gray-900">
                    {ROLE_LABELS[createdUser?.role || "user"] ||
                      ROLE_LABELS.user}
                  </p>
                </div>
              </div>
            </div>
            <Button
              onClick={copyCredentials}
              variant="outline"
              className="w-full h-12 text-base gap-2"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  បានចម្លង!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  ចម្លងព័ត៌មានទាំងអស់
                </>
              )}
            </Button>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setCreatedUser(null)}
              className="h-12 text-base px-6"
            >
              បិទ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteUser} onOpenChange={() => setDeleteUser(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              លុបអ្នកប្រើប្រាស់
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              តើអ្នកប្រាកដថាចង់លុបអ្នកប្រើប្រាស់ &quot;{deleteUser?.full_name}&quot; (
              {deleteUser?.phone || deleteUser?.email})?
              សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-12 text-base px-6">
              បោះបង់
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              className="bg-red-600 hover:bg-red-700 h-12 text-base px-6"
              disabled={isDeleting}
            >
              {isDeleting && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              លុប
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
