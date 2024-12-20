import BandCarousel from "./BandCarousel";

const CarouselSection = () => {
  return (
    <section className=" py-20 px-5">
      <div className="container mx-auto">
        <h3 className="text-3xl font-bold mb-12 text-center">
          Trusted By Industry Leaders
        </h3>
        <BandCarousel />
      </div>
    </section>
  );
};

export default CarouselSection;
