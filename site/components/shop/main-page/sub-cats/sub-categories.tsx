"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Products from "./products";
import Styles from "@/components/shop/shared/hiddenScrollbar.module.css";

interface Category {
  id: number;
  name: string;
  image: string;
  products: any[];
}

interface SubCategoriesProps {
  catName: string;
  items: Category[];
}

const SubCategories: React.FC<SubCategoriesProps> = ({ catName, items }) => {
  const [subCategoryName, setSubCategoryName] = useState<string>("");
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );

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
    if (items?.length > 0) {
      setSubCategoryName(items[0].name);
      setProducts(items[0].products);
      setSelectedCategoryId(items[0].id);
    }
  }, [items]);

  const handleCategoryClick = (cat: Category) => {
    setSubCategoryName(cat.name);
    setProducts(cat.products);
    setSelectedCategoryId(cat.id);
  };

  const getImageUrl = (imagePath: string): string => {
    const cleanPath = imagePath?.replace(/\\/g, "/").split("/").pop();
    return `${process.env.NEXT_PUBLIC_API_URL}/uploads/product/${cleanPath}`;
  };

  return (
    <div className="w-[80%] mx-auto my-16">
      <div className="my-14 w-full flex flex-row-reverse">
        <span className="text-[#A60014] text-lg">/{catName}</span>
        <span className="text-[#919191] text-lg">/فروشگاه</span>
        <span className="text-[#919191] text-lg">خانه</span>
      </div>

      <div className="my-5">
        <h3 className="text-[30px] text-black text-center">{catName}</h3>
        <hr className="w-[70px] mx-auto border-[#A60014] bg-[#A60014] h-[3px] mb-4" />

        <div
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className={`flex flex-row-reverse mb-14 space-x-6 space-x-reverse w-full 
            mx-auto justify-center items-center py-10 ${Styles.scrollContainer} `}
        >
          {items?.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              className="cursor-pointer"
            >
              <div
                className={`border-[3px] rounded-full 
              w-32 h-32 flex justify-center items-center p-5
              ${
                cat?.id === selectedCategoryId
                  ? "border-[#A60014] "
                  : "border-[#f1f1f1] "
              }
              `}
              >
                <Image
                  src={getImageUrl(cat.image)}
                  alt={`تصویر ${cat.name}`}
                  className="object-contain select-none"
                  width={115}
                  height={115}
                />
              </div>
              <div className="leading-[26px] text-center text-[#222] select-none">
                {cat.name}
              </div>
            </div>
          ))}
        </div>

        <Products items={products} subCatName={subCategoryName} />
      </div>
    </div>
  );
};

export default SubCategories;
