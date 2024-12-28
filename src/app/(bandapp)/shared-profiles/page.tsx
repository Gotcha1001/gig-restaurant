import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { getSharedProfiles } from "../../../../actions/profile";
import { SharedProfileData } from "@/lib/types-profile";

export default async function SharedProfilesPage() {
  const sharedProfiles = await getSharedProfiles();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Shared Profiles</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sharedProfiles.map((profile: SharedProfileData) => (
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
              <Link
                href={`/view-profile/${profile.userId}`}
                className="text-primary hover:underline"
              >
                View Profile
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      {sharedProfiles.length === 0 && (
        <p className="text-center text-muted-foreground">
          No profiles have been shared yet.
        </p>
      )}
    </div>
  );
}
