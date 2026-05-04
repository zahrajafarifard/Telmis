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
      className="rounded-[9px] flex flex-col justify-center items-center shadow-[1px_1px_10px_1px_rgba(0,0,0,0.13)] pt-9 pb-6
      transform transition-transform duration-700 hover:scale-110
      screen690:hover:scale-100
      screen690:transition-none "
    >
      <Image src={img} width={61} height={61} alt={title} className="mb-5" />
      <h4 className="mb-5">{title}</h4>
      <div
        style={{ direction: "rtl" }}
        className="px-4 text-center text-[#919191]"
      >
        {texts?.map((item, index) => {
          return (
            <div
              key={index}
              className="
              screen1540:tracking-tight
              screen1460:text-[15px]
              screen1250:tracking-normal
              screen1250:text-base"
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
