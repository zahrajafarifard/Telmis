import React from "react";
import Image, { StaticImageData } from "next/image";

interface SecondChildDetailsProps {
  img: string | StaticImageData; // Allow img to be a string or StaticImageData
  title: string;
  text: string;
}

const SecondChildDetails: React.FC<SecondChildDetailsProps> = ({
  img,
  title,
  text,
}) => {
  const texts: string[] = text.split("...");

  return (
    <div
      className="rounded-[9px]   flex flex-col justify-center items-center shadow-[1px_1px_10px_1px_rgba(0,0,0,0.13)] pt-14 pb-9 
      transform transition-transform duration-700 hover:scale-110 screen1050:w-full screen630:mb-5
      screen630:transition-none
      screen630:hover:scale-100 "
    >
      <Image src={img} width={61} height={61} alt={title} className="mb-5" />
      <h4 className="mb-5">{title}</h4>
      <div
        style={{ direction: "rtl" }}
        className="px-4 text-center text-[#919191] "
      >
        {texts?.map((item, index) => {
          return (
            <div
              key={index}
              className={`border-b-2 border-b-[#919191] border-dotted py-2 whitespace-nowrap last:border-b-0
                screen1150:text-sm
                screen1050:text-base
                ${
                  item.includes("پشتیبانی و نگهداری سیستم های نظارتی") &&
                  "text-[15px]  screen1100:text-[13.5px] "
                }
                ${
                  item.includes("سیستم های تلفن گویا") &&
                  "text-[15px]  screen1100:text-[13.5px] "
                }
                ${
                  item.includes("نصب و پیکربندی دوربین های مداربسته") &&
                  "text-[15px]  screen1100:text-[13.5px] "
                }
                `}
            >
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SecondChildDetails;
