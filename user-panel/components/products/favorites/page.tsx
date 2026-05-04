"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";

import { RootState } from "@/store/store";

import ProductDetails from "./favorite-details";
import Pagination from "@/components/shared/pagination/page";
import Sort from "@/components/shared/sort/page";

interface ProductType {
  id: number;
  mainImage: string;
  mainTitle: string;
  model?: string;
  price: number;
  discount: number;
  count: number;
  Product: {
    mainImage: string;
    mainTitle: string;
    price: string;
    model: string;
  };
}

const Favorites = () => {
  const _token = useSelector((state: RootState) => state.client.token);

  const [products, setProducts] = useState<ProductType[]>([]);
  const [selectedSort, setSelectedSort] = useState<number>(0);

  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage: number = 8;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handlePageChange = (page: number | string) => {
    if (page !== "...") {
      setCurrentPage(Number(page));
    }
  };
  useEffect(() => {
    const _favorites = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/favorites`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + _token,
          },
          body: JSON.stringify({
            page: currentPage,
            pageSize: itemsPerPage,
          }),
        }
      );

      switch (response.status) {
        case 200:
          const data = await response.json();
          setProducts(data?.data?.rows);
          setTotalItems(data?.data?.count);
          break;

        default:
          break;
      }
    };

    _favorites();
  }, [currentPage, setCurrentPage, setTotalItems, itemsPerPage, _token]);

  useEffect(() => {
    const _favorites = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/sort-favorites`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + _token,
          },
          body: JSON.stringify({
            page: currentPage,
            pageSize: itemsPerPage,
            selectedSort,
          }),
        }
      );

      switch (response.status) {
        case 200:
          const data = await response.json();

          setProducts(data?.data?.rows);
          setTotalItems(data?.data?.count);

          break;

        default:
          break;
      }
    };

    // _token && selectedSort && _favorites();
    if (_token && selectedSort) {
      _favorites();
    }
  }, [
    currentPage,
    selectedSort,
    _token,
    setCurrentPage,
    setTotalItems,
    itemsPerPage,
    _token,
  ]);

  return (
    <div className="w-[80%] mx-auto">
      <div className="flex flex-row-reverse space-x-4 space-x-reverse justify-between  w-full mt-12 pb-10">
        <div className="text-[#1E1B1B] text-2xl font-semibold my-auto ">
          محصولات مورد علاقه
        </div>
        <Link href={"https://telmis.ir/shop"} className="my-auto ">
          <div className="text-[#A60014] font-semibold my-auto underline">
            بازگشت به فروشگاه
          </div>
        </Link>
        <hr className="flex-grow my-auto border-[#D9D9D9]" />
        <Sort setSelectedSort={setSelectedSort} selectedSort={selectedSort} />
      </div>
      <div style={{ direction: "rtl" }} className="grid grid-cols-3">
        {products?.map((item: ProductType) => {
          return (
            <div key={item.id}>
              <ProductDetails item={item} setProducts={setProducts} />
            </div>
          );
        })}
      </div>

      <div style={{ direction: "rtl" }} className="my-20">
        {totalItems > 0 && (
          <Pagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            current={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Favorites;
