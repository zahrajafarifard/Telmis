"use client";
import React from "react";
import Image from "next/image";

import arrow from "@/public/images/arrow_circle_down.svg";
interface DetailsProps {
  id: number;
  title: string;
  text: string;
}
interface ItemProps {
  item: DetailsProps;
  isActive: boolean;
  onToggle: () => void;
}

const Details: React.FC<ItemProps> = ({ item, isActive, onToggle }) => {
  return (
    <div className="">
      <div
        onClick={onToggle}
        className={`bg-[#F7F7F7] rounded-[50px] text-[#333333] flex flex-row-reverse px-7 py-2 mt-5 justify-between group
          hover:bg-gradient-to-r hover:from-[#C4161C] hover:to-[#600B0E]
          screen690:px-4
          screen400:px-3
        
        ${isActive && " bg-gradient-to-r from-[#C4161C] to-[#600B0E]"}
        `}
      >
        <div
          className={`my-auto text-2xl group-hover:text-white text-right
            screen1000:text-xl
            screen690:text-base
            screen400:text-sm
            ${isActive && " text-white"}
            `}
        >
          {item?.title}
        </div>
        <Image
          src={arrow}
          width={50}
          height={50}
          alt="فلش"
          className={`group-hover:brightness-0 group-hover:invert
            screen1000:w-[34px] 
            screen1000:h-[34px] 
            screen400:w-[30px] 
            screen400:h-[30px] 
            screen350:w-[26px] 
            screen4350:h-[26px] 
             ${isActive && " brightness-0 invert scale-y-[-1]"}
            
            `}
        />
      </div>
      {isActive && (
        <div
          style={{ direction: "rtl" }}
          className=" text-[#919191] bg-[#F7F7F7] text-justify 
          text-2xl tracking-[0.48px] rounded-t-[40px]
          leading-[46px] pt-24 -mt-16  relative -z-10 px-10 pb-10
          screen1000:-mt-12 
          screen1000:text-xl
          screen1000:leading-[40px]
          screen690:text-base
          screen690:leading-[30px]
          screen690:-tracking-[0.32px]
          screen400:text-sm "
        >
          {item?.text}
        </div>
      )}
    </div>
  );
};

export default Details;
