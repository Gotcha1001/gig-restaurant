"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserProfile, getUserProfile } from "../../../../actions/profile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useFetch from "../../../../hooks/use-fetch";
import { profileSchema, gigProviderSchema } from "@/lib/validation";
import type {
  Profile,
  ProfileResponse,
  ProfileFormData,
} from "@/lib/types-profile";

type ProfileType = "band" | "gigProvider";

export default function UserProfile() {
  const [profileType, setProfileType] = useState<ProfileType>("band");
  const [isUpdate, setIsUpdate] = useState(false);
  const router = useRouter();

  const schema = profileType === "band" ? profileSchema : gigProviderSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(schema),
  });

  const {
    data: profile,
    loading,
    error,
    fn: createProfileFn,
  } = useFetch<ProfileResponse, [Profile]>(
    createUserProfile as (data: Profile) => Promise<ProfileResponse>
  );

  // Fetch existing profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const existingProfile = await getUserProfile();
        console.log("Fetched profile:", existingProfile);

        if (existingProfile && existingProfile.profile) {
          setIsUpdate(true);
          setProfileType(existingProfile.profileType as ProfileType);

          // Pre-populate form fields with profile data
          setValue("name", existingProfile.name || "");
          setValue("imageUrl", existingProfile.imageUrl || "");
          setValue("location", existingProfile.profile.location || "");
          setValue("description", existingProfile.profile.description || "");
          setValue("website", existingProfile.profile.website || "");

          if (existingProfile.profileType === "band") {
            setValue("genre", existingProfile.profile.genre || "");
            setValue("videoUrl", existingProfile.profile.videoUrl || "");
          } else {
            setValue("services", existingProfile.profile.services || "");
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile data");
      }
    };

    fetchProfile();
  }, [setValue]);

  // Handle successful profile creation/update
  useEffect(() => {
    if (profile) {
      toast.success(
        isUpdate
          ? "Profile updated successfully"
          : "Profile created successfully"
      );

      // Redirect to home page after successful submission
      router.push("/");
    }
  }, [profile, isUpdate, router]);

  const onSubmit = async (data: ProfileFormData) => {
    const profileData: Profile =
      profileType === "band"
        ? {
            ...data,
            profileType: "band",
            genre: data.genre || "",
            services: undefined,
          }
        : {
            ...data,
            profileType: "gigProvider",
            services: data.services || "",
            genre: undefined,
            videoUrl: undefined,
          };

    createProfileFn(profileData);
  };

  useEffect(() => {
    reset();
  }, [profileType, reset]);

  return (
    <div className="relative min-h-screen flex justify-center items-center py-8">
      <div className="relative z-10 w-full max-w-2xl p-8 gradient-background2 rounded-lg shadow-lg opacity-80">
        <Alert className="mb-6">
          <AlertTitle>
            {isUpdate ? "Update Your Profile" : "Create Your Profile"}
          </AlertTitle>
          <AlertDescription>
            {isUpdate
              ? "Your existing profile information has been loaded. Make changes and save to update."
              : "Fill in your profile information to get started."}
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Type Selection */}
          <div>
            <select
              value={profileType}
              onChange={(e) => setProfileType(e.target.value as ProfileType)}
              className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="band">Band</option>
              <option value="gigProvider">Gig Provider</option>
            </select>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                {...register("name")}
                placeholder="Name"
                className="w-full"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Input
                {...register("imageUrl")}
                placeholder="Profile Image URL"
                className="w-full"
              />
              {errors.imageUrl && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>

            <div>
              <Input
                {...register("location")}
                placeholder="Location"
                className="w-full"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <Textarea
                {...register("description")}
                placeholder="Description"
                className="w-full min-h-[100px]"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <Input
                {...register("website")}
                placeholder="Website"
                type="url"
                className="w-full"
              />
              {errors.website && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.website.message}
                </p>
              )}
            </div>

            {profileType === "band" ? (
              <>
                <div>
                  <Input
                    {...register("genre")}
                    placeholder="Genre"
                    className="w-full"
                  />
                  {errors.genre && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.genre.message}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    {...register("videoUrl")}
                    placeholder="Video URL"
                    type="url"
                    className="w-full"
                  />
                  {errors.videoUrl && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.videoUrl.message}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div>
                <Input
                  {...register("services")}
                  placeholder="Services"
                  className="w-full"
                />
                {errors.services && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.services.message}
                  </p>
                )}
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-4 rounded-md hover:bg-blue-700"
          >
            {loading
              ? isUpdate
                ? "Updating Profile..."
                : "Creating Profile..."
              : isUpdate
              ? "Update Profile"
              : "Create Profile"}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
}
