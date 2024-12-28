// app/(routes)/gig-providers/show-all/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { ProfileResponse } from "@/lib/types-profile";
import MotionWrapperDelay from "@/components/MotionWrapperDelay";
import FeatureMotionWrapper from "@/components/FeatureMotionWrapper";
import ShareButton from "@/components/ShareButton";
import SearchBar from "@/components/SearchBar";
import { PulseLoader } from "react-spinners";
import { getAllGigProviders } from "../../../../actions/profile";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginatedGigProviders {
  gigProviders: ProfileResponse[];
  totalPages: number;
  currentPage: number;
}

const GigProvidersPage = () => {
  const [paginatedGigProviders, setPaginatedGigProviders] =
    useState<PaginatedGigProviders>({
      gigProviders: [],
      totalPages: 1,
      currentPage: 1,
    });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchGigProviders = async (query?: string, page: number = 1) => {
    setLoading(true);
    try {
      const data = await getAllGigProviders(query, page);
      setPaginatedGigProviders(data);
    } catch (error) {
      console.error("Error fetching gig providers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchGigProviders(searchQuery, currentPage);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="container mx-auto py-4">
      <MotionWrapperDelay
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        variants={{
          hidden: { opacity: 0, x: -100 },
          visible: { opacity: 1, x: 0 },
        }}
      >
        <h1 className="text-5xl md:text-6xl lg:text-8xl mt-0 font-bold gradient-title text-center mb-10">
          Discover Gig Providers
        </h1>
      </MotionWrapperDelay>

      <div className="max-w-md mx-auto my-8">
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
          <SearchBar
            placeholder="Search gig providers by name, services, or location..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </MotionWrapperDelay>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <PulseLoader color="#36d7b7" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedGigProviders.gigProviders.map((provider, index) => (
              <FeatureMotionWrapper key={provider.id} index={index}>
                <Link href={`/view-profile/${provider.userId}`}>
                  <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full gradient-background10">
                    <CardHeader>
                      <div className="object-contain rounded-t-lg w-full h-96">
                        <img
                          src={provider.imageUrl || "/placeholder-provider.jpg"}
                          alt={provider.name}
                          className="object-cover rounded-lg w-full h-full"
                        />
                      </div>
                      <CardTitle className="text-xl">{provider.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">
                        Services: {provider.services}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Location: {provider.location}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <p className="text-sm text-muted-foreground truncate">
                        {provider.description || "No description available"}
                      </p>
                      <div className="ml-3">
                        <ShareButton
                          userId={provider.userId}
                          profileType="gigProvider"
                        />
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </FeatureMotionWrapper>
            ))}
          </div>

          {paginatedGigProviders.gigProviders.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              {searchQuery
                ? "No gig providers found matching your search."
                : "No gig providers found. Be the first to create a gig provider profile!"}
            </div>
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
                    { length: paginatedGigProviders.totalPages },
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
                        currentPage === paginatedGigProviders.totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GigProvidersPage;
