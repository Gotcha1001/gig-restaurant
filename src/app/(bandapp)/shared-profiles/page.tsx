"use client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  getSharedProfiles,
  deleteSharedProfile,
} from "../../../../actions/profile";
import { SharedProfileData } from "@/lib/types-profile";
import { useEffect, useState } from "react";
import { useTransition } from "react";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";

export default function SharedProfilesPage() {
  const [profiles, setProfiles] = useState<SharedProfileData[]>([]);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load profiles on mount
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const sharedProfiles = await getSharedProfiles();
        setProfiles(sharedProfiles);
      } catch (error) {
        console.error("Error loading profiles:", error);
        toast.error("Failed to load shared profiles");
      } finally {
        setIsLoading(false);
      }
    };
    loadProfiles();
  }, []);

  const handleDelete = async (profileId: string) => {
    if (confirm("Are you sure you want to remove this shared profile?")) {
      setDeletingId(profileId);
      startTransition(async () => {
        try {
          await deleteSharedProfile(profileId);
          setProfiles(profiles.filter((profile) => profile.id !== profileId));
          toast.success("Profile removed successfully");
        } catch (error) {
          toast.error("Failed to remove profile");
          console.error("Error removing profile:", error);
        } finally {
          setDeletingId(null);
        }
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <ClipLoader color="#0000FF" size={50} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Shared Profiles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile: SharedProfileData) => (
          <Card key={profile.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-4">
                <img
                  src={profile.user.imageUrl || "/placeholder.jpg"}
                  alt={profile.user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold">{profile.user.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Shared {formatDistanceToNow(new Date(profile.shareDate))}{" "}
                    ago
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {profile.shareMessage && (
                <p className="mb-4 text-sm">{profile.shareMessage}</p>
              )}
              <div className="flex justify-between items-center">
                <Link
                  href={`/view-profile/${profile.userId}`}
                  className="text-primary hover:underline"
                >
                  View Profile
                </Link>
                <Button
                  variant="work"
                  size="sm"
                  onClick={() => handleDelete(profile.id)}
                  disabled={isPending || deletingId === profile.id}
                >
                  {deletingId === profile.id ? (
                    <div className="flex items-center gap-2">
                      <ClipLoader color="#FFFFFF" size={14} />
                      <span>Removing...</span>
                    </div>
                  ) : (
                    "Remove"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {profiles.length === 0 && (
        <p className="text-center text-muted-foreground">
          No profiles have been shared yet.
        </p>
      )}
    </div>
  );
}
