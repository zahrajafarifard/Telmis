"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

import bagImage from "@/public/images/shop/shopping-bag.png";
import "@/components/shop/shared/style.css";

const Orders = () => {
  const searchParams = useSearchParams();

  const factorId = searchParams.get("factorId");
  const trackingCode = searchParams.get("code");

  return (
    <div>
      <Image
        src={bagImage}
        width={200}
        height={200}
        alt="عکس"
        className="mx-auto mt-24 mb-7 screen1250:w-40 screen1250:h-40"
      />

      <h1
        style={{ direction: "rtl" }}
        className="text-[#1D8020] text-[32px] font-semibold text-center screen1250:text-xl px-3"
      >
        سفارش شما با موفقیت پرداخت و ثبت شد.
      </h1>
      {trackingCode ? (
        <h1
          style={{ direction: "rtl" }}
          className="text-[#A60014] text-[32px] font-semibold text-center screen1250:text-xl px-3"
        >
          کد پیگیری {trackingCode}
        </h1>
      ) : null}
      <h4
        style={{ direction: "rtl" }}
        className="text-[#6D6F72] text-xl text-center mt-7 mb-16 screen1250:text-lg screen1250:mb-12 px-3"
      >
        سفارش شما در انتظار تایید می باشد.
      </h4>

      <Link href={`/shop/user/orders/${factorId}`}>
        <div className="button px-14 whitespace-nowrap text-lg w-fit mx-auto text-center py-3">
          <span className="button-hover-effect"></span>
          <p className="button-hover-effect-text text-2xl screen1250:text-xl">
            پیگیری سفارش
          </p>
        </div>
      </Link>

      <Link href={"/shop"}>
        <h5 className="text-[#A60014] text-2xl mt-8 mb-16 text-center screen1250:text-lg ">
          بازگشت به فروشگاه
        </h5>
      </Link>
    </div>
  );
};

export default Orders;
