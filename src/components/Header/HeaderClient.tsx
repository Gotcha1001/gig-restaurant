"use client";
import { useState, useEffect } from "react";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs"; // Import useUser hook from Clerk
import Image from "next/image";
import Link from "next/link";
import { FolderOpen, PenBox, MapPin, Menu } from "lucide-react";
import MotionWrapperDelay from "../MotionWrapperDelay";
import { Button } from "../ui/button";
import UserMenu from "../UserMenu";
import UserLoading from "../user-loading";
import { useRouter } from "next/navigation";

const HeaderClient = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isLoaded } = useUser(); // Get current user information from Clerk
  const router = useRouter(); // Use router for redirection

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  return (
    <MotionWrapperDelay
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: 1 }}
      variants={{
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0 },
      }}
    >
      <header className="mx-auto gradient-background2 relative">
        <nav className="py-10 px-8 flex justify-between items-center relative z-20">
          {/* Logo */}
          <Link href={"/"}>
            <Image
              src={"/logo.png"}
              alt="Logo"
              width={80}
              height={120}
              className="h-20 w-auto object-contain horizontal-rotate"
            />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-4">
            <SignedIn>
              <Link href="/allbands">
                <Button
                  variant="work"
                  className="flex items-center gap-2 group"
                >
                  <span className="text-white group-hover:text-black transition-colors duration-200">
                    <FolderOpen size={18} />
                  </span>
                  <span className="hidden md:inline text-white group-hover:text-black">
                    All Bands
                  </span>
                </Button>
              </Link>

              <Link href="/gig-providers">
                <Button
                  variant="work2"
                  className="flex items-center gap-2 group"
                >
                  <span className="text-white group-hover:text-black transition-colors duration-200">
                    <MapPin size={18} />
                  </span>
                  <span className="hidden md:inline text-white group-hover:text-black">
                    Gig Providers
                  </span>
                </Button>
              </Link>
            </SignedIn>

            {/* Dynamic Profile Link */}
            <SignedIn>
              {isLoaded && user ? (
                <Link href={`/view-profile/${user.id}`}>
                  <Button variant="band" className="flex items-center gap-2">
                    <PenBox size={18} />
                    <span className="hidden md:inline">View Profile</span>
                  </Button>
                </Link>
              ) : (
                <p>Loading...</p> // Show loading while user info is being fetched
              )}
            </SignedIn>

            <Link href="/profile">
              <Button variant="work2" className="flex items-center gap-2">
                <PenBox size={18} />
                <span className="hidden md:inline">Design Profile</span>
              </Button>
            </Link>

            <SignedOut>
              <SignInButton forceRedirectUrl="/profile">Login</SignInButton>
            </SignedOut>

            <SignedIn>
              <UserMenu />
            </SignedIn>
          </div>

          {/* Burger Menu for Mobile */}
          <div className="md:hidden flex items-center gap-4">
            <SignedOut>
              <SignInButton forceRedirectUrl="/profile">
                <Button variant="outline">Login</Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserMenu />
            </SignedIn>
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              <Menu size={24} />
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black text-white px-4 py-6 absolute top-full left-0 w-full z-10">
            <SignedIn>
              <Link href="/allbands" onClick={toggleMenu}>
                <Button variant="band" className="w-full text-left mb-4">
                  All Bands
                </Button>
              </Link>
              <Link href="/gig-providers" onClick={toggleMenu}>
                <Button variant="work1" className="w-full text-left mb-4">
                  Gig Providers
                </Button>
              </Link>

              {/* Dynamic Profile Link in Mobile */}
              {isLoaded && user ? (
                <Link href={`/view-profile/${user.id}`} onClick={toggleMenu}>
                  <Button variant="band" className="w-full text-left mb-4">
                    View Profile
                  </Button>
                </Link>
              ) : (
                <p>Loading...</p>
              )}

              <Link href="/profile" onClick={toggleMenu}>
                <Button variant="work1" className="w-full text-left">
                  Design Profile
                </Button>
              </Link>
            </SignedIn>

            <SignedOut>
              <SignInButton forceRedirectUrl="/profile">
                <Button
                  variant="outline"
                  className="w-full text-left "
                  onClick={toggleMenu}
                >
                  Login
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        )}
        <UserLoading />
      </header>
    </MotionWrapperDelay>
  );
};

export default HeaderClient;
