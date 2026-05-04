import React from "react";
import Image from "next/image";
import "@/components/shared/style.css";

const Products = () => {
  return (
    <div className=" bg-[#F7F7F7] rounded-[16px] ">
      <div className=" flex flex-row justify-between w-[80%] mx-auto py-8">
        <Image
          src="/test/prod.png"
          width={320}
          height={270}
          alt=""
          className="-mt-14"
        />
        <div className="my-auto">
          <div className="text-[#2B2B2B] text-right text-2xl font-bold">
            عنواع محصولات شبکه ای نرم افزاری
          </div>
          <div className="text-[#848484] text-right text-2xl font-semibold my-1">
            مدل ROG Rapture GT-AX11000
          </div>
          <div
            style={{ direction: "rtl" }}
            className="text-[#919191] text-right "
          >
            <span>تعداد پورت شبکه (LAN): چهار عدد</span>
            <span className="text-[#A60014] text-[10px] underline">
              اطلاعات بیشتر
            </span>
          </div>

          <div className="button bg-[#A60014] rounded-[50px] text-center text-white text-sm py-3 w-fit px-10 ml-auto mt-2">
            <span className="button-hover-effect"></span>
            <p className="button-hover-effect-text "> مشاهده محصولات </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
