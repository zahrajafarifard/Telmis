import React from "react";
import Image from "next/image";

import "./style.css";

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  return (
    <div className="carousel">
      <div className="carousel-track">
        {images.concat(images).map((image, index) => {
          return (
            <div key={index} className="carousel-item">
              <Image src={image} alt={`Slide ${index}`} className="mx-auto" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Carousel;
