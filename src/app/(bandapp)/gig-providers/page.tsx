import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllGigProviders } from "../../../../actions/gigProviders";
import Link from "next/link";
import { ProfileResponse } from "@/lib/types-profile";
import MotionWrapperDelay from "@/components/MotionWrapperDelay";
import FeatureMotionWrapper from "@/components/FeatureMotionWrapper";
import ShareButton from "@/components/ShareButton";

const GigProvidersPage = async () => {
  const gigProviders: ProfileResponse[] = await getAllGigProviders();

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
        <h1 className="text-5xl md:text-6xl lg:text-8xl mt-0 font-bold  gradient-title text-center mb-10">
          Discover Gig Providers
        </h1>
      </MotionWrapperDelay>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gigProviders.map((provider, index) => (
          <FeatureMotionWrapper key={provider.id} index={index}>
            <Link href={`/view-profile/${provider.userId}`}>
              <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full gradient-background10 ">
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

      {gigProviders.length === 0 && (
        <div className="text-center text-muted-foreground py-12">
          No gig providers found. Be the first to create a gig provider profile!
        </div>
      )}
    </div>
  );
};

export default GigProvidersPage;
