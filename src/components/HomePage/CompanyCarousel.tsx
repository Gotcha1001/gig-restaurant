"use client";
import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import companies from "./companies";
import Image from "next/image";
import MotionWrapperDelay from "../MotionWrapperDelay";

const CompanyCarousel = () => {
  return (
    <MotionWrapperDelay
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.9, delay: 0.8 }}
      variants={{
        hidden: { opacity: 0, y: -100 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <Carousel
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        className="w-full py-10"
      >
        <CarouselContent className="flex gap-5 sm:gap-20 items-center">
          {companies.map(({ name, path, id }) => (
            <CarouselItem key={id} className="basis-1/3 lg:basic-1/6">
              <Image
                src={path}
                alt={name}
                width={200}
                height={56}
                className="h-9 sm:h-14 w-auto object-contain filter brightness-0 invert"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </MotionWrapperDelay>
  );
};

export default CompanyCarousel;
