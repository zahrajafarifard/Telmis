"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import moment from "moment-jalaali";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "@/store/store";

import Sort from "../shared/sort/page";
import viewIcon from "@/public/images/view.svg";
import titleIcon from "@/public/images/title.svg";
import calendarIcon from "@/public/images/Calendar.svg";
import priceIcon from "@/public/images/price.svg";
import actionsIcon from "@/public/images/loader-01.svg";
import clockIcon from "@/public/images/clock-01.svg";
import Pagination from "@/components/shared/pagination/page";
import "@/components/shared/style.css";

interface Product {
  mainTitle: string;
}

interface StatusFactor {
  id: number;
  status: string;
  color: string;
  bgColor: string;
}

interface FactorDetail {
  Product: Product;
}

interface Order {
  id: number;
  price: number;
  createdAt: string;
  FactorDetails: FactorDetail[];
  StatusFactor: StatusFactor;
}

interface SelectedItem {
  id: number;
  status: string;
  color: string;
  bgColor: string;
}

const Orders = () => {
  moment.loadPersian({ usePersianDigits: true });
  const router = useRouter();
  const [selectedItems, setSelectedItems] = useState<
    Record<number, SelectedItem>
  >({});

  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedSort, setSelectedSort] = useState<number>(0);
  const _token = useSelector((state: RootState) => state.client.token);

  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage: number = 5;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handlePageChange = (page: number | string) => {
    if (page !== "...") {
      setCurrentPage(Number(page));
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/factor`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${_token}`,
          },
          body: JSON.stringify({
            page: currentPage,
            pageSize: itemsPerPage,
          }),
        }
      );

      if (response.status === 200) {
        const data = await response.json();

        const initialSelectedItems = data?.data?.rows.reduce(
          (acc: Record<number, SelectedItem>, order: Order) => {
            acc[order.id] = {
              id: order?.StatusFactor?.id,
              status: order?.StatusFactor?.status,
              color: order?.StatusFactor?.color,
              bgColor: order?.StatusFactor?.bgColor,
            };
            return acc;
          },
          {}
        );

        setOrders(data?.data?.rows);
        setSelectedItems(initialSelectedItems);
        setTotalItems(data?.data?.count);
      }
    };

    if (_token) {
      fetchOrders();
    }
  }, [
    _token,
    setSelectedItems,
    setOrders,

    currentPage,
    setCurrentPage,
    setTotalItems,
    itemsPerPage,
  ]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/factor/sort`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${_token}`,
          },
          body: JSON.stringify({
            page: currentPage,
            pageSize: itemsPerPage,
            selectedSort,
          }),
        }
      );

      if (response.status === 200) {
        const data = await response.json();

        const initialSelectedItems = data?.data?.rows.reduce(
          (acc: Record<number, SelectedItem>, order: Order) => {
            acc[order.id] = {
              id: order?.StatusFactor?.id,
              status: order?.StatusFactor?.status,
              color: order?.StatusFactor?.color,
              bgColor: order?.StatusFactor?.bgColor,
            };
            return acc;
          },
          {}
        );

        console.log("sooorot", data?.data?.rows);

        setOrders(data?.data?.rows);
        setSelectedItems(initialSelectedItems);
        setTotalItems(data?.data?.count);
      }
    };

    if (_token && selectedSort) {
      fetchOrders();
    }
  }, [
    _token,
    setSelectedItems,
    setOrders,
    selectedSort,
    currentPage,
    setCurrentPage,
    setTotalItems,
    itemsPerPage,
  ]);

  // useEffect(() => {
  //   const _orders = async () => {
  //     const _response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/factor`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: "Bearer " + _token,
  //         },
  //         // body: JSON.stringify({
  //         // productId: item?.id,
  //         // }),
  //       }
  //     );

  //     switch (_response.status) {
  //       case 200:
  //         const _data = await _response.json();

  //         setOrders(_data?.data);

  //         break;

  //       default:
  //         break;
  //     }
  //   };

  //   _token && _orders();
  // }, [_token]);

  return (
    <div className="w-[80%] mx-auto">
      <div className="flex flex-row-reverse space-x-4 space-x-reverse justify-between  w-full mt-12 pb-10">
        <div className="text-[#1E1B1B] text-2xl font-semibold my-auto ">
          آخرین خرید و سفارشات
        </div>
        <div className="text-[#A60014] font-semibold my-auto underline">
          بازگشت به فروشگاه
        </div>
        <hr className="flex-grow my-auto border-[#D9D9D9]" />

        <Sort selectedSort={selectedSort} setSelectedSort={setSelectedSort} />
      </div>

      <div className="mt-12">
        <div
          style={{ direction: "rtl" }}
          className="bg-[#F7F7F7] grid grid-cols-6 place-items-center py-4 rounded-[4px]"
        >
          <div className="my-auto">ردیف</div>
          <div className="flex flex-row">
            <span className="text-[#333] text-sm my-auto"> مبلغ پرداختی </span>
            <Image
              src={priceIcon}
              className="w-6 h-6 mr-2 my-auto"
              alt="icon"
            />
          </div>
          <div className="flex flex-row">
            <span className="text-[#333] text-sm text-center my-auto">
              نام محصولات خریداری شده
            </span>
            <Image
              src={titleIcon}
              className="w-6 h-6 mr-2 my-auto"
              alt="icon"
            />
          </div>
          <div className="flex flex-row">
            <span className="text-[#333] text-sm my-auto">تاریخ خرید </span>
            <Image
              src={calendarIcon}
              className="w-6 h-6 mr-2 my-auto"
              alt="icon"
            />
          </div>
          <div className="flex flex-row">
            <span className="text-[#333] text-sm my-auto">ساعت خرید </span>
            <Image
              src={clockIcon}
              className="w-6 h-6 mr-2 my-auto"
              alt="icon"
            />
          </div>
          <div className="flex flex-row">
            <span className="text-[#333] text-sm my-auto">عملیات </span>
            <Image
              src={actionsIcon}
              className="w-6 h-6 mr-2 my-auto"
              alt="icon"
            />
          </div>
        </div>

        <div style={{ direction: "rtl" }}>
          {orders?.map((order: Order, index: number) => {
            return (
              <div
                key={order.id}
                className="grid grid-cols-6  place-items-center py-4 border border-[#D9D9D9] rounded-[4px] my-6"
              >
                <p className="bg-gradient-to-r from-[#A60014] to-[#600B0E] rounded-full w-8 h-5 mx-auto text-white text-xs flex items-center justify-center">
                  {index + 1}
                </p>
                <div>{Number(order?.price).toLocaleString()}</div>
                <div>
                  {order?.FactorDetails?.map(
                    (
                      product: FactorDetail,
                      i: number,
                      array: FactorDetail[]
                    ) => (
                      <span key={i}>
                        {product?.Product?.mainTitle}
                        {i < array.length - 1 && ", "}
                      </span>
                    )
                  )}
                </div>
                <div>{moment(order?.createdAt).format("jYYYY/jMM/jDD")}</div>
                <div>{moment(order?.createdAt).format("HH:mm")}</div>
                <div className="relative">
                  <div className=" my-auto flex flex-row justify-center space-x-1 space-x-reverse ">
                    <div
                      style={{
                        backgroundColor: `${
                          selectedItems[order.id]?.bgColor || "#f0f0f0"
                        }`,
                        color: `${selectedItems[order.id]?.color || "#000"}`,
                      }}
                      className="rounded-full px-4 py-2 w-32 text-sm text-center whitespace-nowrap"
                    >
                      {order?.StatusFactor?.status}
                    </div>
                    <div
                      className="button bg-[#A60014] relative rounded-full w-8 h-8 p-2 my-auto mx-auto flex justify-center items-center cursor-pointer"
                      onClick={() => router.push(`/client/orders/${order?.id}`)}
                    >
                      <span className="button-hover-effect"></span>
                      <Image
                        fill
                        alt="View Order Details"
                        src={viewIcon}
                        className="scale-75 brightness-0 invert button-hover-effect-text"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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

export default Orders;
