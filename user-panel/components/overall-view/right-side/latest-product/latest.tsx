"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";

import { RootState } from "@/store/store";
import ProductDetails from "./product-details";

interface ProductType {
  id: number;
  mainImage: string;
  mainTitle: string;
  price: number;
  discount: number;
  count: number;
}
const Newest = () => {
  const _token = useSelector((state: RootState) => state.client.token);
  const [products, setProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    const _products = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/latest`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + _token,
          },
        }
      );

      switch (response.status) {
        case 200:
          const data = await response.json();
          setProducts(data?.data);
          break;

        default:
          break;
      }
    };

    _products();
  }, []);

  return (
    <div className="w-[90%] mx-auto">
      <div className="flex flex-row-reverse space-x-4 space-x-reverse justify-between  w-full mt-12 pb-10">
        <div className="text-[#1E1B1B] text-xl font-semibold my-auto ">
          جدید ترین محصولات
        </div>

        <hr className="flex-grow my-auto border-[#D9D9D9]" />
        <Link href={"https://telmis.ir/shop"} className="my-auto">
          <div className="text-[#A60014] my-auto underline text-xs">
            مشاهده بیشتر
          </div>
        </Link>
      </div>

      <div style={{ direction: "rtl" }} className="grid grid-cols-3">
        {products?.map((item) => {
          return (
            <div key={item.id}>
              <ProductDetails item={item} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Newest;
