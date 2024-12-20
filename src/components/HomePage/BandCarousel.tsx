"use client";
import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import bandData from "./bandData";
import Image from "next/image";
import MotionWrapperDelay from "../MotionWrapperDelay";

const BandCarousel = () => {
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
        <CarouselContent className="flex gap-5 sm:gap-20 items-center justify-center">
          {bandData.map(({ name, path, id }) => (
            <CarouselItem
              key={id}
              className="basis-1/3 lg:basis-1/6 flex justify-center items-center"
            >
              <div className="relative group">
                <Image
                  src={path}
                  alt={name}
                  width={400} // Adjusted width for larger images
                  height={400} // Adjusted height for uniform size
                  className=" 
                  w-full h-full object-cover rounded-xl shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl grayscale group-hover:grayscale-0"
                />
                <div
                  className="
                absolute inset-0 bg-gradient-to-b from-transparent to-black/30 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-2"
                >
                  <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    {name}
                  </p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </MotionWrapperDelay>
  );
};

export default BandCarousel;
