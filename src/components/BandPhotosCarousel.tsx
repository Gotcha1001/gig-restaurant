import Autoplay from "embla-carousel-autoplay";
import MotionWrapperDelay from "./MotionWrapperDelay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

const BandPhotosCarousel = ({ photos }: { photos: string[] }) => {
  if (!photos?.length) return null;

  return (
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
      <div className="w-full mb-16">
        <Carousel
          plugins={[
            Autoplay({
              delay: 3000,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {photos.map((photo, index) => (
              <CarouselItem key={index} className="pl-4 basis-1/4">
                <div className="overflow-hidden rounded-lg h-64">
                  <img
                    src={photo}
                    alt={`Band photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>
    </MotionWrapperDelay>
  );
};

export default BandPhotosCarousel;
