import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllBands } from "../../../../actions/bands";
import Link from "next/link";
import { ProfileResponse } from "@/lib/types-profile";
import MotionWrapperDelay from "@/components/MotionWrapperDelay";
import FeatureMotionWrapper from "@/components/FeatureMotionWrapper";
import ShareButton from "@/components/ShareButton";

const BandsPage = async () => {
  const bands: ProfileResponse[] = await getAllBands();

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

      {/* ... other header content ... */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bands.map((band, index) => (
          <FeatureMotionWrapper key={band.id} index={index}>
            <Link href={`/view-profile/${band.userId}`}>
              <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full gradient-background10 ">
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
                    Location: {band.location}
                  </p>
                </CardContent>

                <CardFooter className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground truncate">
                    {band.description || "No description available"}
                  </p>
                  <ShareButton userId={band.userId} profileType="band" />
                </CardFooter>
              </Card>
            </Link>
          </FeatureMotionWrapper>
        ))}
      </div>

      {bands.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          No bands found. Be the first to create a band profile!
        </div>
      )}
    </div>
  );
};

export default BandsPage;
