// app/(routes)/bands/show-all/page.tsx
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
import { getAllBands } from "../../../../actions/profile";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { parseLocationName } from "@/lib/locationUtils";

interface PaginatedBands {
  bands: ProfileResponse[];
  totalPages: number;
  currentPage: number;
}

const BandsPage = () => {
  const [paginatedBands, setPaginatedBands] = useState<PaginatedBands>({
    bands: [],
    totalPages: 1,
    currentPage: 1,
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchBands = async (query?: string, page: number = 1) => {
    setLoading(true);
    try {
      const data = await getAllBands(query, page);
      setPaginatedBands(data);
    } catch (error) {
      console.error("Error fetching bands:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchBands(searchQuery, currentPage);
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
        <h1 className="text-5xl md:text-6xl lg:text-8xl mt-0 font-bold mb-0 gradient-title text-center">
          Discover Bands
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
            placeholder="Search bands by name, genre, or location..."
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
            {paginatedBands.bands.map((band, index) => (
              <FeatureMotionWrapper key={band.id} index={index}>
                <Link href={`/view-profile/${band.userId}`}>
                  <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full gradient-background10">
                    <CardHeader>
                      <div className="object-contain rounded-t-lg w-full h-96">
                        <img
                          src={band.imageUrl || "/placeholder-band.jpg"}
                          alt={band.name}
                          className="object-cover rounded-lg w-full h-full object-center"
                        />
                      </div>
                      <CardTitle className="text-xl">{band.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">
                        Genre: {band.genre}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Location: {parseLocationName(band.location)}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground truncate">
                        {band.description || "No description available"}
                      </p>
                      <div className="ml-3">
                        <ShareButton userId={band.userId} profileType="band" />
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </FeatureMotionWrapper>
            ))}
          </div>

          {paginatedBands.bands.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              {searchQuery
                ? "No bands found matching your search."
                : "No bands found. Be the first to create a band profile!"}
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
                    { length: paginatedBands.totalPages },
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
                        currentPage === paginatedBands.totalPages
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

export default BandsPage;
