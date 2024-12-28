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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import FeatureMotionWrapper from "@/components/FeatureMotionWrapper";
import MotionWrapperDelay from "@/components/MotionWrapperDelay";

interface PaginatedProfiles {
  profiles: SharedProfileData[];
  totalPages: number;
  currentPage: number;
}

export default function SharedProfilesPage() {
  const [paginatedProfiles, setPaginatedProfiles] = useState<PaginatedProfiles>(
    {
      profiles: [],
      totalPages: 1,
      currentPage: 1,
    }
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load profiles on mount or page change
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        const data = await getSharedProfiles(currentPage);
        setPaginatedProfiles(data);
      } catch (error) {
        console.error("Error loading profiles:", error);
        toast.error("Failed to load shared profiles");
      } finally {
        setIsLoading(false);
      }
    };
    loadProfiles();
  }, [currentPage]);

  const handleDelete = async (profileId: string) => {
    if (confirm("Are you sure you want to remove this shared profile?")) {
      setDeletingId(profileId);
      startTransition(async () => {
        try {
          await deleteSharedProfile(profileId);
          setPaginatedProfiles((prev) => ({
            ...prev,
            profiles: prev.profiles.filter(
              (profile) => profile.id !== profileId
            ),
          }));
          toast.success("Profile removed successfully");

          // If we've deleted the last item on the current page (except for page 1)
          if (paginatedProfiles.profiles.length === 1 && currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
          }
        } catch (error) {
          toast.error("Failed to remove profile");
          console.error("Error removing profile:", error);
        } finally {
          setDeletingId(null);
        }
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      <MotionWrapperDelay
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7, delay: 0.7 }}
        variants={{
          hidden: { opacity: 0, x: -100 },
          visible: { opacity: 1, x: 0 },
        }}
      >
        <h1 className="text-5xl font-bold mb-8 text-center gradient-title">
          Shared Profiles
        </h1>
      </MotionWrapperDelay>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedProfiles.profiles.map((profile, index) => (
          <FeatureMotionWrapper key={profile.id} index={index}>
            <Card className="hover:shadow-lg transition-shadow opacity-80">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <MotionWrapperDelay
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    variants={{
                      hidden: { opacity: 0, x: 100 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <img
                      src={profile.user.imageUrl || "/placeholder.jpg"}
                      alt={profile.user.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </MotionWrapperDelay>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {profile.user.name}
                    </h3>
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
          </FeatureMotionWrapper>
        ))}
      </div>

      {paginatedProfiles.profiles.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No profiles have been shared yet.
        </p>
      ) : (
        <div className="mt-8 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {Array.from(
                { length: paginatedProfiles.totalPages },
                (_, i) => i + 1
              ).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    className={`cursor-pointer ${
                      currentPage === page
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={
                    currentPage === paginatedProfiles.totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
