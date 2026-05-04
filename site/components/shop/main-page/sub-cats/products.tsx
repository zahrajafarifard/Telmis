"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Sort from "../../shared/sort";
import Details from "../product-details";
import styles from "./banner.module.css";
import errIcon from "@/public/images/shop/error-red.svg";

const Products: React.FC<any> = ({ items, subCatName }) => {
  const [selectedSort, setSelectedSort] = useState<number>(0);
  const [products, setProducts] = useState<any>(items);

  useEffect(() => {
    const sortedProducts = [...items];

    if (selectedSort === 2) {
      sortedProducts.sort((a: any, b: any) => b.bestSelling! - a.bestSelling!);
    } else if (selectedSort === 1) {
      sortedProducts.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    setProducts(sortedProducts);
  }, [selectedSort, items]);

  return (
    <div className="">
      <div className="flex flex-row-reverse justify-between space-x-4 space-x-reverse screen1250:space-x-3 screen1250:space-x-reverse">
        <div className="flex flex-row-reverse my-auto">
          <div className="w-full flex flex-row-reverse justify-start text-[#221D23] text-2xl font-semibold">
            <span>محصولات</span> &nbsp;
            <span>{subCatName}</span>
          </div>
        </div>
        <hr className="flex flex-grow border my-auto" />
        <div className="flex flex-row-reverse my-auto">
          <Sort selectedSort={selectedSort} setSelectedSort={setSelectedSort} />
        </div>
      </div>

      {products?.length === 0 ? (
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
        <div
          style={{ direction: "rtl" }}
          className="grid grid-cols-5 gap-7 my-10"
        >
          {products?.map((item: any) => {
            return (
              <div key={item?.id}>
                <Details item={item} />
              </div>
            );
          })}
        </div>
      )}

      {products?.length <= 10 ? null : (
        <div className="button w-44 mx-auto py-3 text-lg text-center my-10 screen1250:text-base">
          <span className="button-hover-effect"></span>
          <p className="button-hover-effect-text"> محصولات بیشتر </p>
        </div>
      )}
    </div>
  );
};

export default Products;
