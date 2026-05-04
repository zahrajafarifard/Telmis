"use client";
import React, { useState } from "react";
import Image from "next/image";

import sortIcon from "@/public/images/Sort.svg";

interface Props {
  setSelectedSort: (value: number) => void;
  selectedSort: number;
}

const Sort: React.FC<Props> = ({ selectedSort, setSelectedSort }) => {
  const [showSort, setShowSort] = useState<boolean>(false);

  const sortHandler = async (val: number) => {
    setSelectedSort(val);
    setSelectedSort(val);
    setShowSort(false);
  };

  return (
    <div>
      <div className="relative">
        <div
          onClick={() => {
            setShowSort((prev) => !prev);
          }}
          className="bg-[#F2F2F2] rounded-[50px]  flex flex-row-reverse px-10 py-2
            screen750:px-2 "
        >
          <Image
            src={sortIcon}
            width={24}
            height={24}
            alt="group"
            className="ml-2 screen750:ml-0 screen750:w-4 screen750:h-4"
          />
          <span
            className="text-[#979797] my-auto text-[20px] 
            screen1440:text-lg
            screen750:hidden "
          >
            مرتب سازی
          </span>
        </div>
        {showSort && (
          <>
            <div
              onClick={() => {
                setShowSort(false);
              }}
              className="w-screen h-screen fixed top-0 left-0  "
            />
            <div className="flex flex-col bg-white shadow-[0px_4px_15px_2px_rgba(0,0,0,0.09)] absolute top-14 left-0 z-20 rounded-[10px] pr-12 py-5 w-56 leading-[31px] ">
              <div
                onClick={() => {
                  sortHandler(1);
                }}
                className="flex flex-row-reverse mb-2 cursor-pointer"
              >
                <Image
                  src="/images/Target_light.svg"
                  width={26}
                  height={26}
                  alt="az"
                  className={`${selectedSort !== 1 && "grayscale opacity-45"}`}
                />
                <span
                  className={`mr-2 ${
                    selectedSort !== 1 ? "text-[#919191]" : "text-black"
                  }`}
                >
                  جدیدترین ها
                </span>
              </div>
              <div
                onClick={() => {
                  sortHandler(2);
                }}
                className="flex flex-row-reverse mb-2 cursor-pointer"
              >
                <Image
                  src="/images/Target_light.svg"
                  width={26}
                  height={26}
                  alt="az"
                  className={`${selectedSort !== 2 && "grayscale opacity-45"}`}
                />
                <span
                  className={`mr-2 ${
                    selectedSort !== 2 ? "text-[#919191]" : "text-black"
                  }`}
                >
                  قدیمی ترین ها
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sort;
