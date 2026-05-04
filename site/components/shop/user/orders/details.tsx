import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import moment from "moment-jalaali";
import viewIcon from "@/public/images/shop/view.svg";

const Details: React.FC<any> = ({ item, index }) => {
  const router = useRouter();

  return (
    <div className="w-[100%] mx-auto rounded-[4px] grid grid-cols-7 my-6 py-4 place-items-center border-[1px] border-[#D9D9D9] screen1230:grid-cols-6">
      <div className="bg-gradient-to-r from-[#A60014] to-[#600B0E] text-white px-4 py-0 text-xs rounded-full">
        {index + 1}
      </div>
      <div className="text-[#6D6F72]">{item?.trackingCode}</div>
      <div style={{ direction: "rtl" }} className="text-[#6D6F72]">
        {Number(item?.price).toLocaleString()} تومان
      </div>
      <div
        style={{ direction: "rtl" }}
        className="text-[#6D6F72] text-center line-clamp-1 hover:line-clamp-none"
      >
        {item?.FactorDetails?.map((product: any, index: number) => {
          return (
            <span key={product?.id} className="text-[#6D6F72]">
              {product?.Product?.mainTitle}
              {index < item?.FactorDetails?.length - 1 && ", "}
            </span>
          );
        })}
      </div>
      <div className="text-[#6D6F72]">
        {moment(item.createdAt).format("jYYYY/jMM/jDD")}
      </div>
      <div className="text-[#6D6F72] screen1230:hidden">
        {moment(item.createdAt).format("HH:mm")}
      </div>
      <div className="flex flex-row-reverse space-x-2 w-[80%] mx-auto screen1400:w-[90%] screen1230:w-[95%]  ">
        <div
          onClick={() => {

            
            router.push(`/shop/user/orders/${item?.id}`);
          }}
          className="bg-[#221D23] rounded-full p-1 w-fit h-fit my-auto cursor-pointer"
        >
          <Image
            src={viewIcon}
            width={15}
            height={15}
            alt="نمایش جزییات"
            className="invert"
          />
        </div>
        <div
          style={{
            color: item?.StatusFactor?.color,
            backgroundColor: item?.StatusFactor?.bgColor,
          }}
          className="rounded-full text-xs py-1 px-2 w-[80%] text-center"
        >
          {item?.StatusFactor?.status}
        </div>
      </div>
    </div>
  );
};

export default Details;
