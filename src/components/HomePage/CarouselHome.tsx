import MotionWrapperDelay from "../MotionWrapperDelay";
import CompanyCarousel from "./CompanyCarousel";

const CarouselSection = () => {
  return (
    <section className=" py-20 px-5">
      <div className="container mx-auto">
        <MotionWrapperDelay
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, delay: 0.8 }}
          variants={{
            hidden: { opacity: 0, y: 100 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <h3 className="text-3xl font-bold mb-12 text-center">
            Trusted By Industry Leaders
          </h3>
        </MotionWrapperDelay>
        <CompanyCarousel />
      </div>
    </section>
  );
};

export default CarouselSection;
