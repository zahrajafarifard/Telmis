"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import Pagination from "@/components/shared/pagination/page";

import Details from "./details";
// import Sort from "../shared/sort/page";
import WaningIcon from "@/public/images/shop/error-red.svg";
import Sort from "../../shared/sort";

const Favotite = () => {
  const _token = useSelector((state: RootState) => state.token.token);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [selectedSort, setSelectedSort] = useState<number>(1);

  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage: number = 8;
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const _fav = async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/apiClient/favorites`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + _token,
          },
          body: JSON.stringify({
            sort: selectedSort,
            page: currentPage,
            pageSize: itemsPerPage,
          }),
        }
      );

      switch (res.status) {
        case 200:
          const data = await res.json();

          setFavoriteProducts(data?.data?.rows);
          setTotalItems(data?.data?.count);

          break;

        default:
          break;
      }
    };
    if (_token) {
      _fav();
    }
  }, [
    _token,
    selectedSort,
    setFavoriteProducts,
    currentPage,
    setCurrentPage,
    setTotalItems,
    itemsPerPage,
  ]);

  const handlePageChange = (page: number | string) => {
    if (page !== "...") {
      setCurrentPage(Number(page));
    }
  };

  return (
    <div>
      <div className="w-[80%] mx-auto mt-14">
        <div className="flex flex-row-reverse items-center gap-4">
          <span className="text-[#221D23] text-2xl font-semibold">
            محصولات مورد علاقه
          </span>
          <Link href="https://telmis.ir/shop">
            <span className="text-[#A60014] underline">بازگشت به فروشگاه</span>
          </Link>
          <hr className="flex-grow border-[#DFDFDF]" />

          <Sort selectedSort={selectedSort} setSelectedSort={setSelectedSort} />
        </div>

        {favoriteProducts?.length === 0 ? (
          <div className=" flex flex-col justify-center items-center mt-40">
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
              هنوز موردی به لیست علاقه‌مندی‌های خود اضافه نکرده‌اید.
            </div>
          </div>
        ) : (
          <div
            style={{ direction: "rtl" }}
            className="grid grid-cols-4 gap-10 my-20"
          >
            {favoriteProducts?.map((item: any) => {
              return (
                <div key={item.id}>
                  <Details item={item} setFavoriteProducts={setFavoriteProducts}/>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ direction: "rtl" }} className=" mt-20 mb-4">
        {favoriteProducts?.length > 0 && (
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

export default Favotite;
