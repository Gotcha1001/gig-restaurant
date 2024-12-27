"use client";
import { useEffect, useState } from "react";
import { getUserProfileById } from "../../../../../actions/profile";
import { useParams } from "next/navigation";

import MotionWrapperDelay from "@/components/MotionWrapperDelay";
import MotionImageAll from "@/components/MotionImageAll";
import VideoDisplay from "@/components/VideoDisplay";
import { FacebookIcon, InstagramIcon } from "@/components/icons/social-icons";
import BandPhotosCarousel from "@/components/BandPhotosCarousel";

interface Profile {
  name: string;
  imageUrl: string;
  profileType: "band" | "gigProvider";
  profile: {
    name: string;
    imageUrl: string;
    location: string;
    description?: string;
    website?: string;
    genre?: string;
    videoUrl?: string;
    services?: string;
    email?: string;
    phoneNumber?: string;
    headerImage?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    bandMembers: string[];
    photos: string[];
  };
}

export default function ProfileDisplay() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { profileSlug } = useParams(); // Get the profileSlug from the route params
  console.log("Fetched User ID:", profileSlug);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (profileSlug) {
          const userData = await getUserProfileById(profileSlug); // Use the profileSlug here
          if (!userData || !userData.profile) {
            setError("Profile not found for ID " + profileSlug);
          } else {
            setProfile(userData);
          }
        } else {
          setError("No user ID provided in URL");
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileSlug]); // Run the effect when profileSlug changes

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-800 to-purple-900">
        <div className="relative w-16 h-16">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute top-1 left-1 w-14 h-14 border-4 border-purple-500 border-t-transparent rounded-full animate-spin-slow"></div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-800 to-purple-900">
        <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20">
          <h2 className="text-red-400 text-2xl font-bold">
            Error Loading Profile
          </h2>
          <p className="text-gray-300 mt-4">{error}</p>
        </div>
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-800 to-purple-900">
        <div className="backdrop-blur-lg bg-white/10 p-8 rounded-2xl shadow-2xl border border-white/20">
          <h2 className="text-yellow-400 text-2xl font-bold">
            No Profile Found Yet
          </h2>
          <p className="text-gray-300 mt-4">
            Please create a profile to get started.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen gradient-background9  py-12 px-4 sm:px-6 lg:px-8 rounded-lg flex justify-center items-center">
      <div className="w-full max-w-4xl mx-auto">
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
          <MotionImageAll>
            <h1 className="text-6xl sm:text-3xl md:text-6xl lg:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4 gradient-title text-center">
              {profile.profile.name}
            </h1>
          </MotionImageAll>
        </MotionWrapperDelay>

        {/* Hero Section */}
        <div className="relative mb-24">
          <MotionWrapperDelay
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            variants={{
              hidden: { opacity: 0, y: 100 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <div className="h-64 rounded-3xl overflow-hidden relative">
              <img
                src={profile.profile.headerImage || "/bg.jpg"} // Use the headerImage if available, fallback to default
                alt="Header image"
                className="w-full h-full object-cover object-center rounded-3xl"
              />
            </div>
          </MotionWrapperDelay>

          <MotionImageAll>
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur"></div>
                <img
                  src={profile.profile.imageUrl}
                  alt={profile.profile.name}
                  className="relative w-32 h-32 rounded-full border-2 border-white/50 shadow-2xl object-cover"
                />
              </div>
            </div>
          </MotionImageAll>
        </div>

        {/* Carousel section  */}
        {profile.profile.photos && profile.profile.photos.length > 0 && (
          <BandPhotosCarousel photos={profile.profile.photos} />
        )}

        {/* carousel for the gig providers
        {profile.profile.photos && profile.profile.photos.length > 0 && (
          <BandPhotosCarousel photos={profile.profile.photos} />
        )} */}

        {/* Profile Content */}
        <div className="backdrop-blur-lg gradient-background10  rounded-3xl border  p-8 shadow-2xl">
          {/* Profile Type Badge */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-white/10 text-blue-300">
              {profile.profileType === "band" ? "Band" : "Gig Provider"}
            </span>
          </div>

          {profile.profileType === "gigProvider" && (
            <>
              <MotionWrapperDelay
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                variants={{
                  hidden: { opacity: 0, y: 100 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <div className="text-center mb-12 p-6 backdrop-blur-lg bg-indigo-900/20 border border-white/20 hover:shadow-2xl hover:bg-gradient-to-r from-red-600 to-purple-600 hover:text-white transition-all duration-300 rounded-3xl shadow-lg">
                  <h3 className="text-3xl text-white font-semibold mb-4">
                    Live Music Every Week
                  </h3>
                  <p className="text-lg text-gray-100 mb-6">
                    We provide live entertainment throughout the week. Contact
                    us to secure your bands performance slot and be part of our
                    vibrant music scene.
                  </p>
                  {profile.profile.email && (
                    <a
                      href={`mailto:${profile.profile.email}`}
                      className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white text-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                      Contact For Booking
                    </a>
                  )}
                </div>
              </MotionWrapperDelay>
            </>
          )}

          {/* Location */}
          {profile.profile.location && (
            <MotionWrapperDelay
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              variants={{
                hidden: { opacity: 0, x: -100 },
                visible: { opacity: 1, x: 0 },
              }}
            >
              <div className="text-center mb-12 gradient-background2 mx-auto w-3/5 max-w-lg p-4 rounded-lg shadow-lg">
                <p className="text-gray-300 flex items-center justify-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-500/30 flex items-center justify-center">
                    📍
                  </span>
                  {profile.profile.location}
                </p>
              </div>
            </MotionWrapperDelay>
          )}

          {/* Video */}
          {profile.profile.videoUrl && (
            <div className="mb-16 w-full flex justify-center">
              <div className="w-full max-w-3xl">
                <VideoDisplay url={profile.profile.videoUrl} />
              </div>
            </div>
          )}

          {/* Profile Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Genre (for band) or Services (for gig provider) */}
              {profile.profileType === "band" && profile.profile.genre && (
                <div className="backdrop-blur-lg bg-indigo-900/20 p-6 rounded-2xl border border-white/20 hover:shadow-2xl hover:bg-gradient-to-r from-red-600 to-purple-600 hover:text-white transition-all duration-300">
                  <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3">
                    Genre
                  </h3>
                  <p className="text-gray-300">{profile.profile.genre}</p>
                </div>
              )}

              {/* Contact Information */}
              {(profile.profile.email || profile.profile.phoneNumber) && (
                <MotionWrapperDelay
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  variants={{
                    hidden: { opacity: 0, y: 100 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <div className="backdrop-blur-lg bg-indigo-900/20 p-6 rounded-2xl border border-white/20 hover:shadow-2xl hover:bg-gradient-to-r from-red-600 to-purple-600 hover:text-white transition-all duration-300">
                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3">
                      Contact Information
                    </h3>
                    {profile.profile.email && (
                      <p className="text-gray-300 mb-2">
                        <span className="font-medium">Email:</span>{" "}
                        <a
                          href={`mailto:${profile.profile.email}`}
                          className="hover:text-blue-400 transition-colors duration-300"
                        >
                          {profile.profile.email}
                        </a>
                      </p>
                    )}
                    {profile.profile.phoneNumber && (
                      <p className="text-gray-300">
                        <span className="font-medium">Phone:</span>{" "}
                        <a
                          href={`tel:+27${
                            profile.profile.phoneNumber.startsWith("0")
                              ? profile.profile.phoneNumber.slice(1)
                              : profile.profile.phoneNumber
                          }`}
                          className="hover:text-blue-400 transition-colors duration-300"
                        >
                          {profile.profile.phoneNumber}
                        </a>
                      </p>
                    )}
                  </div>
                </MotionWrapperDelay>
              )}

              {/* Social Media Links */}
              {(profile.profile.facebookUrl ||
                profile.profile.instagramUrl) && (
                <MotionWrapperDelay
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  variants={{
                    hidden: { opacity: 0, y: 100 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <div className="backdrop-blur-lg bg-indigo-900/20 p-6 rounded-2xl border border-white/20 hover:shadow-2xl hover:bg-gradient-to-r from-red-600 to-purple-600 hover:text-white transition-all duration-300">
                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3">
                      Social Media
                    </h3>
                    <div className="space-y-3">
                      {profile.profile.facebookUrl && (
                        <a
                          href={profile.profile.facebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition-colors duration-300"
                        >
                          <FacebookIcon className="w-5 h-5 text-blue-500" />
                          <span>Facebook Profile</span>
                        </a>
                      )}
                      {profile.profile.instagramUrl && (
                        <a
                          href={profile.profile.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 text-gray-300 hover:text-pink-400 transition-colors duration-300"
                        >
                          <InstagramIcon className="w-5 h-5 text-pink-500" />
                          <span>Instagram Profile</span>
                        </a>
                      )}
                    </div>
                  </div>
                </MotionWrapperDelay>
              )}

              {profile.profileType === "gigProvider" &&
                profile.profile.services && (
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
                    <div className="backdrop-blur-lg bg-indigo-900/20 p-6 rounded-2xl border border-white/20 hover:shadow-2xl hover:bg-gradient-to-r from-red-600 to-purple-600 hover:text-white transition-all duration-300">
                      <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3">
                        Services
                      </h3>
                      <p className="text-gray-300">
                        {profile.profile.services}
                      </p>
                    </div>
                  </MotionWrapperDelay>
                )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* About */}
              {profile.profile.description && (
                <MotionWrapperDelay
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  variants={{
                    hidden: { opacity: 0, y: 100 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <div className="backdrop-blur-lg bg-indigo-900/20 p-6 rounded-2xl border border-white/20 hover:shadow-2xl hover:bg-gradient-to-r from-red-600 to-purple-600 hover:text-white transition-all duration-300">
                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3">
                      About
                    </h3>
                    <p className="text-gray-300">
                      {profile.profile.description}
                    </p>
                  </div>
                </MotionWrapperDelay>
              )}

              {/* Website */}
              {profile.profile.website && (
                <MotionWrapperDelay
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  variants={{
                    hidden: { opacity: 0, x: -100 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <div className="backdrop-blur-lg bg-indigo-900/20 p-6 rounded-2xl border border-white/20 hover:shadow-2xl hover:bg-gradient-to-r from-red-600 to-purple-600 hover:text-white transition-all duration-300">
                    <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3">
                      Website
                    </h3>
                    <a
                      href={profile.profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    >
                      {profile.profile.website}
                    </a>
                  </div>
                </MotionWrapperDelay>
              )}

              {profile.profileType === "band" &&
                profile.profile.bandMembers &&
                profile.profile.bandMembers.length > 0 && (
                  <MotionWrapperDelay
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    variants={{
                      hidden: { opacity: 0, y: 100 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <div className="backdrop-blur-lg bg-indigo-900/20 p-6 rounded-2xl border border-white/20 hover:shadow-2xl hover:bg-gradient-to-r from-red-600 to-purple-600 hover:text-white transition-all duration-300">
                      <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-3">
                        Band Members
                      </h3>
                      <div className="space-y-2">
                        {profile.profile.bandMembers.map(
                          (member, index) =>
                            member && (
                              <p key={index} className="text-gray-300">
                                {member}
                              </p>
                            )
                        )}
                      </div>
                    </div>
                  </MotionWrapperDelay>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
