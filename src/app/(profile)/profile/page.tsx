"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserProfile } from "../../../../actions/profile";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
  const router = useRouter();

  const schema = profileType === "band" ? profileSchema : gigProviderSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
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

  useEffect(() => {
    if (profile) {
      toast.success("Profile created successfully");
      router.push("/");
    }
  }, [profile, router]);

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
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 pointer-events-none" />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-2xl p-8 bg-white rounded-lg shadow-lg gradient-background2 opacity-50">
        <h1 className="text-5xl font-bold text-center gradient-title mb-8">
          Create Or Update Your Profile
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Profile Type */}
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
                className="w-full"
                rows={3}
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

            {/* Conditional Genre Field */}
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

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-8"
          >
            {loading ? "Creating Profile..." : "Create Profile"}
          </Button>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm mt-1">{error.message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
