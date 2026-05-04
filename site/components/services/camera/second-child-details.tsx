import React from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";

interface SecondChildDetailsProps {
  img: string | StaticImageData;
  title: string;
  text: string;
}

const SecondChildDetails: React.FC<SecondChildDetailsProps> = ({
  img,
  title,
  text,
}) => {
  const texts = text.split("...");
  return (
    <div>
      <div
        className="flex flex-col justify-center items-center shadow-[1px_1px_10px_1px_rgba(0,0,0,0.13)] rounded-[9px] py-9 
        transform transition-transform duration-700 hover:scale-110
        screen690:hover:scale-100
        screen690:transition-none "
      >
        <Image src={img} width={56} height={56} alt={title} />
        <h4
          className={`text-[#221D23]  mt-10 mb-5 text-center 
          ${
            title.includes("نصب دوربین‌های آنالوگ ")
              ? "text-lg screen1360:text-base screen1100:text-lg"
              : "text-xl screen1560:text-lg screen1360:text-base screen1100:text-lg"
          }
          `}
        >
          {title}
        </h4>
        {texts?.map((item, index) => {
          return (
            <div
              key={index}
              className="w-[95%] whitespace-nowrap mx-auto text-center text-[#919191] text-sm  border-b border-dotted border-[#D4D4D4] py-2 last:border-b-0
              screen1360:text-[13px]
              screen1100:text-sm
              screen1100:w-[80%]
              "
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
