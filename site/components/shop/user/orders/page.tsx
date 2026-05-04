"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import titleIcon from "@/public/images/shop/finacial-title.svg";
import dateIcon from "@/public/images/shop/finacial-calendar.svg";
import clockIcon from "@/public/images/shop/clock-01.svg";
import priceIcon from "@/public/images/shop/finacial-price.svg";
import prodIcon from "@/public/images/shop/File_light.svg";
import actionIcon from "@/public/images/shop/finacial-actions.svg";
import searchIcon from "@/public/images/shop/Search.svg";
import AllFactors from "./all/page";
import Current from "./current/page";
import Delivered from "./delivered/page";
import Canceled from "./canceled/page";

import WaningIcon from "@/public/images/shop/error-red.svg";

const Orders = () => {
  const _token = useSelector((state: RootState) => state.token.token);

  const [selectedItem, setSelectedItem] = useState<string>("all");
  const [searchItem, setSearchItem] = useState<string>("");
  const [orders, setOrders] = useState<any>([]);
  const [responseStatus, setResponseStatus] = useState<number>(0);

  const serachFileHandler = async () => {
    setResponseStatus(0);
    let _data;

    const _response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/apiClient/search-factors`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + _token,
        },
        body: JSON.stringify({
          item: searchItem,
        }),
      }
    );

    switch (_response.status) {
      case 200:
        _data = await _response.json();

        setOrders(_data?.data);
        setSearchItem("");

        break;
      case 404:
        setSearchItem("");
        setResponseStatus(404);

        break;
      default:
        break;
    }
  };

  return (
    <div className="w-[100%] mx-auto relative mt-12">
      <div className="w-[90%] mx-auto relative mt-12">
        <div className="flex flex-row-reverse">
          <div
            className={`${
              selectedItem === "all"
                ? "border-b-4 border-b-red-700 text-[#221D23]"
                : "text-[#D9D9D9]"
            }  py-4 cursor-pointer text-2xl screen1000:text-xl`}
            onClick={() => {
              setOrders([]);
              setResponseStatus(0);
              setSelectedItem("all");
            }}
          >
            همه
          </div>
          <div
            className={`${
              selectedItem === "current"
                ? "border-b-4 border-b-red-700 text-[#221D23]"
                : "text-[#D9D9D9]"
            } mx-10 py-4 cursor-pointer text-2xl screen1000:text-xl`}
            onClick={() => {
              setOrders([]);
              setResponseStatus(0);
              setSelectedItem("current");
            }}
          >
            جاری
          </div>
          <div
            className={`${
              selectedItem === "delivered"
                ? "border-b-4 border-b-red-700 text-[#221D23]"
                : "text-[#D9D9D9]"
            } py-4 cursor-pointer text-2xl screen1000:text-xl `}
            onClick={() => {
              setOrders([]);
              setResponseStatus(0);
              setSelectedItem("delivered");
            }}
          >
            تحویل شده
          </div>
          <div
            className={`${
              selectedItem === "canceled"
                ? "border-b-4 border-b-red-700 text-[#221D23]"
                : "text-[#D9D9D9]"
            } mr-10 py-4  cursor-pointer text-2xl screen1000:text-xl`}
            onClick={() => {
              setOrders([]);
              setResponseStatus(0);
              setSelectedItem("canceled");
            }}
          >
            لغو شده
          </div>
          <div className="mr-auto mb-3 bg-[#F7F7F7] rounded-lg w-[29%] flex flex-row space-x-2  justify-end px-4">
            <input
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              className="w-[80%] bg-transparent my-auto text-[#A3A3A3] text-right p-2 outline-none"
              placeholder="جست و جو"
            />
            <Image
              onClick={serachFileHandler}
              src={searchIcon}
              className="w-6 h-6 my-auto mx-auto cursor-pointer"
              alt="جست و جو"
            />
          </div>
        </div>
        <div className="w-full border absolute bottom-[1px] -z-10" />
      </div>

      <div
        style={{ direction: "rtl" }}
        className="bg-[#F7F7F7] w-[90%] mx-auto rounded-[4px] grid grid-cols-7 my-6 py-4 place-items-center
        screen1230:grid-cols-6
        "
      >
        <span className="text-[#333] text-sm">ردیف</span>
        <div className="flex flex-row">
          <span className="text-[#333] text-sm">شماره سفارش</span>
          <Image
            src={titleIcon}
            className="w-5 h-5 my-auto mx-auto mr-1 brightness-0"
            alt="شماره سفارش"
          />
        </div>
        <div className="flex flex-row">
          <span className="text-[#333] text-sm"> مبلغ پرداختی</span>
          <Image
            src={priceIcon}
            className="w-5 h-5 my-auto mx-auto mr-1 brightness-0"
            alt="مبلغ پرداختی"
          />
        </div>
        <div className="flex flex-row">
          <span className="text-[#333] text-sm text-center">
            نام محصولات خریداری شده
          </span>
          <Image
            src={prodIcon}
            className="w-5 h-5 my-auto mx-auto mr-1"
            alt="نام محصولات خریداری شده"
          />
        </div>

        <div className="flex flex-row">
          <span className="text-[#333] text-sm">تاریخ خرید</span>
          <Image
            src={dateIcon}
            className="w-5 h-5 my-auto mx-auto mr-1 brightness-0"
            alt="تاریخ"
          />
        </div>
        <div className="flex flex-row screen1230:hidden">
          <span className="text-[#333] text-sm">ساعت خرید</span>
          <Image
            src={clockIcon}
            className="w-5 h-5 my-auto mx-auto mr-1"
            alt="ساعت"
          />
        </div>

        <div className="flex flex-row">
          <span className="text-[#333] text-sm">عملیات</span>
          <Image
            src={actionIcon}
            className="w-5 h-5 my-auto mx-auto mr-1 brightness-0"
            alt="عملیات"
          />
        </div>
      </div>

      {responseStatus === 404 ? (
        <div className="flex flex-col justify-center items-center mt-20">
          <Image
            src={WaningIcon}
            width={100}
            height={100}
            alt=""
            className="mx-auto mb-3"
          />
          <div
            style={{ direction: "rtl" }}
            className="text-[#6D6F72] text-2xl text-center"
          >
            نتیجه‌ای برای جست‌وجوی شما پیدا نشد.
          </div>
        </div>
      ) : (
        <div className="w-[100%] mx-auto">
          {selectedItem === "all" && (
            <div>
              <AllFactors orders={orders} />
            </div>
          )}
          {selectedItem === "current" && (
            <div>
              <Current orders={orders} />
            </div>
          )}
          {selectedItem === "delivered" && (
            <div>
              <Delivered orders={orders} />
            </div>
          )}
          {selectedItem === "canceled" && (
            <div>
              <Canceled orders={orders} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Orders;
