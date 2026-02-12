"use client";

import { useState, useTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { User } from "@/types";
import UserDetail from "@/components/users/user-detail";
import { cn, getUserInitials } from "@/lib/utils";
import { useQueryParams } from "@/hooks/use-query-params";
import { STORAGE_KEYS } from "@/config/constants";
import { useLocalStorage } from "@/hooks/use-debounce";

interface UserTableProps {
  users: User[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

function UserTable({
  users,
  page,
  pageSize,
  total,
  totalPages,
}: UserTableProps) {
  const [density] = useLocalStorage<"comfortable" | "compact">(
    STORAGE_KEYS.DENSITY,
    "comfortable",
  );

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { updateQueryParams } = useQueryParams();
  const [isPending, startTransition] = useTransition();
  const [paginationDirection, setPaginationDirection] = useState<
    "prev" | "next" | null
  >(null);

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  function handleSelectPageSize(val: string) {
    startTransition(() => {
      updateQueryParams({ limit: Number(val), page: 1 });
    });
  }

  function prevPage() {
    setPaginationDirection("prev");
    startTransition(() => {
      updateQueryParams({ page: page - 1 });
    });
  }

  function nextPage() {
    setPaginationDirection("next");
    startTransition(() => {
      updateQueryParams({ page: page + 1 });
    });
  }

  return (
    <>
      <div className="space-y-6">
        {/* Results info */}
        <div className="text-sm text-muted-foreground">
          Showing {users.length === 0 ? 0 : (page - 1) * pageSize + 1} to{" "}
          {Math.min(page * pageSize, total)} of {total} users
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>City</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-muted-foreground">No users found</p>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow
                    key={user.id}
                    onClick={() => handleViewUser(user)}
                    className={cn({
                      "[&>td]:p-4": density === "comfortable",
                      "[&>td]:p-1": density === "compact",
                    })}
                  >
                    <TableCell>
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.image || "/placeholder.svg"}
                          alt={user.username}
                        />
                        <AvatarFallback>{getUserInitials(user)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-sm">{user.phone}</TableCell>
                    <TableCell className="text-sm">
                      {user.company?.name || "-"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {user.address?.city || "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            {totalPages > 1 && (
              <div className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </div>
            )}
            <Select
              value={String(pageSize)}
              onValueChange={handleSelectPageSize}
            >
              <SelectTrigger className="w-full md:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {totalPages > 1 && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={prevPage}
                disabled={
                  page === 1 || (isPending && paginationDirection === "prev")
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextPage}
                disabled={
                  page === totalPages ||
                  (isPending && paginationDirection === "next")
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* User Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="sm:max-w-2xl gap-0">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Complete user information</DialogDescription>
          </DialogHeader>

          {selectedUser && <UserDetail user={selectedUser} />}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default UserTable;
