"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import Details from "../details";
import Pagination from "@/components/shared/pagination/page";
import WaningIcon from "@/public/images/shop/error-red.svg";

const Canceled: React.FC<any> = ({ orders }) => {
  const _token = useSelector((state: RootState) => state.token.token);
  const [factors, setFactors] = useState<[]>([]);

  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage: number = 8;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handlePageChange = (page: number | string) => {
    if (page !== "...") {
      setCurrentPage(Number(page));
    }
  };

  useEffect(() => {
    const _orders = async () => {
      let _data;
      const _response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/apiClient/canceledFactors`,
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

      switch (_response.status) {
        case 200:
          _data = await _response.json();
          setFactors(_data?.data?.rows);
          setTotalItems(_data?.data?.count);
          break;
      }
    };

    if (_token) {
      _orders();
    }
  }, [_token, setFactors, currentPage, itemsPerPage, setTotalItems]);

  useEffect(() => {
    setFactors(orders);
  }, [orders.length, setFactors]);

  if (factors?.length === 0) {
    return (
      <div className=" flex flex-col justify-center items-center my-20">
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
          در حال حاضر سفارشی وجود ندارد.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <div className="w-[90%] mx-auto">
        {factors?.map((item: any, index: number) => {
          return (
            <div style={{ direction: "rtl" }} key={item?.id}>
              <Details item={item} index={index} />
            </div>
          );
        })}
      </div>

      <div style={{ direction: "rtl" }} className="my-20">
        {factors?.length > 0 && (
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

export default Canceled;
