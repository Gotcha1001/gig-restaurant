"use client";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { shareProfile } from "../../actions/profile";
import { useEffect, useState } from "react";
import { getUserProfile } from "../../actions/profile";

interface ShareButtonProps {
  userId: string;
  profileType: string;
}

export default function ShareButton({ userId, profileType }: ShareButtonProps) {
  const [currentUserType, setCurrentUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserType() {
      try {
        const userProfile = await getUserProfile();
        setCurrentUserType(userProfile.profileType);
      } catch (error) {
        console.error("Error fetching user type:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserType();
  }, []);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents the link navigation

    if (currentUserType === profileType) {
      toast.error(
        "You can only share your profile with different profile types"
      );
      return;
    }

    try {
      await shareProfile(userId, profileType);
      toast.success("Profile shared successfully!");
    } catch {
      toast.error("There was an error sharing this profile. Please try again.");
    }
  };

  // Don't show the button if loading or same profile type
  if (loading || currentUserType === profileType) {
    return null;
  }

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      className="flex items-center gap-2"
    >
      <Share2 className="h-4 w-4" />
      Share Profile
    </Button>
  );
}
