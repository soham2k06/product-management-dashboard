import { User } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getUserInitials } from "@/lib/utils";
import { Briefcase, Mail, MapPin, Phone } from "lucide-react";

interface UserDetailProps {
  user: User;
}

function UserDetail({ user }: UserDetailProps) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-4 py-6 border-b">
        <Avatar className="h-20 w-20 border">
          <AvatarImage
            src={user.image || "/placeholder.svg"}
            alt={user.username}
          />
          <AvatarFallback className="text-lg font-semibold">
            {getUserInitials(user)}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1">
          <h3 className="text-xl font-semibold leading-none">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
        </div>
      </div>

      <div className="pt-6 space-y-8">
        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Contact
          </h4>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/30">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <a
                href={`mailto:${user.email}`}
                className="hover:underline break-all"
              >
                {user.email}
              </a>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-3 bg-muted/30">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a href={`tel:${user.phone}`} className="hover:underline">
                {user.phone}
              </a>
            </div>

            {user.address && (
              <div className="flex items-start gap-3 rounded-lg border p-3 bg-muted/30">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div className="space-y-1">
                  <p>{user.address.address}</p>
                  <p className="text-muted-foreground">
                    {user.address.city}, {user.address.state}{" "}
                    {user.address.postalCode}
                  </p>
                  <p className="text-muted-foreground">
                    {user.address.country}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Company Info */}
        {user.company && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Company
            </h4>

            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div className="rounded-lg border p-4 bg-muted/30">
                <p className="text-xs text-muted-foreground">Company</p>
                <p className="font-medium">{user.company.name}</p>
              </div>

              <div className="rounded-lg border p-4 bg-muted/30">
                <p className="text-xs text-muted-foreground">Department</p>
                <p className="font-medium">{user.company.department}</p>
              </div>

              <div className="rounded-lg border p-4 bg-muted/30 sm:col-span-2">
                <p className="text-xs text-muted-foreground">Title</p>
                <p className="font-medium">{user.company.title}</p>
              </div>
            </div>
          </div>
        )}

        {/* Additional Info */}
        {(user.age || user.gender) && (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Additional Info
            </h4>

            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              {user.age && (
                <div className="rounded-lg border p-4 bg-muted/30">
                  <p className="text-xs text-muted-foreground">Age</p>
                  <p className="font-medium">{user.age}</p>
                </div>
              )}

              {user.gender && (
                <div className="rounded-lg border p-4 bg-muted/30">
                  <p className="text-xs text-muted-foreground">Gender</p>
                  <p className="font-medium capitalize">{user.gender}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default UserDetail;
