import Image, { StaticImageData } from "next/image";
import React, { FC } from "react";

interface WhyDetailsProps {
  img: string | StaticImageData;
  title: string;
  text: string;
  dir: string;
  index: number;
}

const WhyDetails: FC<WhyDetailsProps> = ({ img, title, text, dir, index }) => {
  return (
    <div
      className={`flex 
        ${dir === "left" ? "flex-row-reverse" : "flex-row"}
         my-10 screen1270:my-5`}
    >
      <Image
        src={img}
        width={61}
        height={61}
        alt="عکس"
        className=" screen1270:w-[50px]  screen1270:h-[50px]  screen1270:my-auto"
      />

      <div className={`${dir === "left" ? "mr-4" : "ml-4"}`}>
        <h5
          className={`text-[#333] text-2xl mb-2 ${
            dir === "left" ? "text-right" : "text-left"
          } 
          screen1270:text-[20px]
          screen690:text-2xl
          screen400:text-[21px]
          screen350:text-[19px]
          `}
        >
          {title}
        </h5>
        <h6
          style={{ direction: "rtl" }}
          className={`text-[#919191] ${
            dir === "left" ? "text-right" : "text-left"
          }
          ${
            dir === "left" &&
            index == 0 &&
            "screen770:text-[14px] screen770:tracking-tighter"
          }
          ${dir === "right" && index == 1 && "screen730:pr-6"}
          ${
            dir === "right" &&
            index == 2 &&
            " screen950:tracking-wide screen950:pr-10 screen890:pr-0 screen850:pr-[17.6px] screen690:tracking-normal screen690:pr-0"
          }
          ${dir === "left" && index == 2 && " screen890:text-sm"}
            screen1270:tracking-tight
            screen1270:text-[15px]
            screen690:tracking-normal
            screen690:text-base
            screen400:text-[15px]
          `}
        >
          {text}
        </h6>
      </div>
    </div>
  );
};

export default WhyDetails;
