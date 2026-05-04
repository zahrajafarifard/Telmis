"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import Products from "./products";
import errIcon from "@/public/images/shop/error-red.svg";
import Styles from "@/components/shop/shared/hiddenScrollbar.module.css";

interface CategoryType {
  id: number;
  name: string;
  image: string;
}
const Categories = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  let isDown = false;
  let startX: number;
  let scrollLeft: number;

  const handleMouseDown = (e: React.MouseEvent) => {
    isDown = true;
    if (scrollRef.current) {
      scrollRef.current.classList.add("active");
      startX = e.pageX - scrollRef.current.offsetLeft;
      scrollLeft = scrollRef.current.scrollLeft;
    }
  };

  const handleMouseLeave = () => {
    isDown = false;
    if (scrollRef.current) scrollRef.current.classList.remove("active");
  };

  const handleMouseUp = () => {
    isDown = false;
    if (scrollRef.current) scrollRef.current.classList.remove("active");
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1; // Adjust scroll speed
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories/parentsCategories`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCategories(data?.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="w-[80%] mx-auto">
      {categories?.length === 0 ? (
        <div className=" w-fit mx-auto  pt-10 pb-12 my-24 screen1000:my-8">
          <div className="w-fit mx-auto mb-4">
            <Image
              width={6}
              height={6}
              alt=""
              src={errIcon}
              className="w-24 h-24 screen1000:w-20 screen1000:h-20"
            />
          </div>
          <div
            style={{ direction: "rtl" }}
            className="text-[#6D6F72] text-2xl text-center screen1000:text-lg"
          >
            محصولی وجود ندارد .
          </div>
        </div>
      ) : (
        <>
          <div className="my-14 w-full flex flex-row-reverse">
            <span className="text-[#A60014] text-lg">/فروشگاه</span>
            <span className="text-[#919191] text-lg">خانه</span>
          </div>
          <div className="my-5">
            <h3 className="text-[30px] text-black text-center">
              خرید بر اساس دسته بندی
            </h3>

            <div
              className={`flex flex-row-reverse my-5 space-x-6 space-x-reverse w-full overflow-auto  mx-auto  py-10 ${Styles.scrollContainer}
             justify-center items-center`}
              ref={scrollRef}
              onMouseDown={handleMouseDown}
              onMouseLeave={handleMouseLeave}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
            >
              {categories?.map((cat) => (
                <Link
                  href={`/shop/category/${cat.id}-${encodeURIComponent(
                    cat?.name
                  )}`}
                  key={cat.id}
                  className="cursor-pointer"
                >
                  <div className="border-[3px] rounded-full border-[#f1f1f1] w-32 h-32 flex justify-center items-center p-5">
                    <Image
                      src={`${
                        process.env.NEXT_PUBLIC_API_URL
                      }/uploads/product/${cat?.image
                        ?.replace(/\\/g, "/")
                        ?.split("/")
                        ?.pop()}`}
                      alt="عکس محصول"
                      className="object-contain overflow-hidden select-none "
                      width={115}
                      height={115}
                    />
                  </div>
                  <div
                    key={cat.id}
                    className="leading-[26px] text-center cursor-pointer text-[#222] select-none "
                  >
                    {cat?.name}
                  </div>
                </Link>
              ))}
            </div>

            <div className="mb-16 mt-28">
              <Products />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Categories;
