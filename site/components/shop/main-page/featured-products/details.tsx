import React from "react";

import Image from "next/image";
import "@/components/shop/shared/style.css";

interface PropsType {
  id: number;
  title: string;
  text1: string;
  text2: string;
  img: string;
}

const Details: React.FC<{ item: PropsType }> = ({ item }) => {
  return (
    <div
      style={{ direction: "rtl" }}
      className="bg-[#f1f1f1] p-7 rounded-lg grid grid-cols-2 gap-x-4"
    >
      <div className="my-auto">
        <div className="text-right text-[#222] text-[20px] mb-4">
          {item?.title}
        </div>
        <div className="text-right text-[#222] text-[30px]">{item?.text1}</div>
        <div className="text-right text-[#222] text-[30px]">{item?.text2}</div>

        <div className="button w-44 ml-auto py-3 text-lg text-center my-5 screen1250:text-base">
          <span className="button-hover-effect"></span>
          <p className="button-hover-effect-text text-base"> مشاهده بیشتر </p>
        </div>
      </div>
      <div>
        <Image
          src={item?.img}
          width={100}
          height={100}
          alt={item?.title}
          className="w-full h-full object-contain mx-auto my-auto"
        />
      </div>
    </div>
  );
};

export default Details;
