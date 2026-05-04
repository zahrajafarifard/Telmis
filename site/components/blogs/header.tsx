"use client";
import React from "react";
import Image from "next/image";
import style from "./style.module.css";

interface Props {
  showSearch: boolean;
  searchItemProps?: string;
  searchHandlerProps?: () => void;
  setSearchItemProps?: (value: string) => void;
}

const Header: React.FC<Props> = ({
  searchItemProps = "",
  searchHandlerProps = () => {},
  setSearchItemProps = () => {},
  showSearch,
}) => {
  return (
    <div
      className={`${style.backgroundImage} py-72 screen1460:py-60 screen1270:py-48 screen890:py-40 screen750:py-28 `}
    >
      <div
        className="bg-[#F7F7F7] text-[#A60014] text-2xl font-bold leading-[62px] w-fit mx-auto px-11 rounded-full mb-6
      screen1250:text-xl 
      screen1250:leading-[62px]
      "
      >
        اخبار و مقالات
      </div>
      <h1
        className="text-[48px] font-bold leading-[62px] mb-6 text-[#221D23] text-center
      screen1250:text-[40px]
      screen1250:leading-[62px]
      screen1000:text-[37px]
      screen1000:leading-[62px]
      screen750:text-3xl
      screen750:leading-[62px]
      screen1000:w-[80%]
      screen750:w-[90%]
      "
      >
        بهترین مقالات تخصصی برای رشد و یادگیری شما
      </h1>
      <h4
        style={{ direction: "rtl" }}
        className="text-[20px] leading-[37px] text-[#221D23] text-center mb-6 w-1/2 mx-auto
        
          screen1250:text-lg
          screen1250:leading-[37px]
          screen1540:w-[80%]
      
          screen750:text-base
          screen750:leading-[37px]
          screen750:w-[90%]

        "
      >
        در این بخش، مجموعه‌ای از مقالات علمی و آموزشی را برای شما گردآوری
        کرده‌ایم تا به شما در ارتقاء دانش و مهارت‌های حرفه‌ای‌تان کمک کنیم. از
        تازه‌ترین تحقیقات تا راهکارهای عملی، همراه ما باشید.
      </h4>
      {showSearch && (
        <div
          className="w-1/3 mx-auto flex flex-row-reverse justify-between bg-white rounded-l-[50px] rounded-r-[8px] 
          screen1460:w-[40%]
          screen950:w-[60%]
          screen750:w-[70%]
        "
        >
          <div className=" flex flex-row-reverse w-[70%] mr-5">
            <Image
              onClick={searchHandlerProps}
              src="/images/search.svg"
              width={25}
              height={25}
              alt=""
              className="my-auto cursor-pointer screen550:hidden"
            />
            <input
              value={searchItemProps}
              onChange={(e) => setSearchItemProps(e.target.value)}
              dir="rtl"
              placeholder="جست و جو..."
              className="placeholder:text-[#919191] text-right  w-[60%] my-auto focus:outline-none pr-3 screen550:pr-0"
            />
          </div>
          <div
            onClick={searchHandlerProps}
            className="bg-[#A60014] rounded-full px-8 py-3 text-center text-white cursor-pointer whitespace-nowrap
            screen550:px-3
            "
          >
            <span className="screen550:hidden">جست و جو</span>
            <Image
              onClick={searchHandlerProps}
              src="/images/search.svg"
              width={28}
              height={28}
              alt=""
              className="my-auto cursor-pointer hidden screen550:flex invert"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
