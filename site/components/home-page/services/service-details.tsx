import React from "react";
import Image, { StaticImageData } from "next/image";

interface ServiceDetailsProps {
  img: string | StaticImageData; // Allow img to be a string or StaticImageData
  title: string;
  text: string;
  index: number;
}

const ServiceDetails: React.FC<ServiceDetailsProps> = ({
  img,
  title,
  text,
  index,
}) => {
  return (
    <div
      className="rounded-[9px] flex flex-col justify-center items-center shadow-[1px_1px_10px_1px_rgba(0,0,0,0.13)] pt-14 pb-9 
      transform transition-transform duration-700 hover:scale-110
      screen630:transform-none
      screen630:transition-none
      screen630:hover:scale-100 "
    >
      <Image
        src={img}
        width={61}
        height={61}
        alt={`خدمات ${index}`}
        className="mb-5 w-auto h-16 screen1150:w-[54px] screen1150:h-[54px]"
      />
      <h4 className="mb-5 text-2xl screen1150:text-[22px]">{title}</h4>
      <p
        style={{ direction: "rtl" }}
        className={`px-5 text-center text-[#919191] 
        screen1540:px-3 
        screen1440:text-[15px]
        screen1360:text-base
        screen1270:text-[15px]
        screen1150:text-sm
        screen1050:text-base
        screen1050:px-5
        screen890:px-3
        screen890:text-[15px]
        screen705:text-sm
        screen705:tracking-tight
        screen630:tracking-normal
        screen630:text-base
        screen630:px-8
        screen550:px-4
        ${
          index === 1 &&
          "px-9 screen1050:px-7 screen890:px-[15px] screen850:px-10  screen790:px-6 screen630:px-12"
        }
        ${
          index === 4 &&
          `px-[50px] tracking-wide screen1650:px-10 
          screen1650:tracking-normal screen1050:px-14
          screen950:px-10 screen890:px-[29px]
          screen705:px-6
          screen630:px-12
          `
        }

        ${index === 5 && `screen550:px-2 screen550:text-[15.5px] `}
        
        `}
      >
        {text}
      </p>
    </div>
  );
};

export default ServiceDetails;
