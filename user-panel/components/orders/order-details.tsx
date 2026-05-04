"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";

import moment from "moment-jalaali";
import { RootState } from "@/store/store";
import printIcon from "@/public/images/Print_light.svg";

interface Product {
  mainTitle: string;
  price: number;
  discount: number;
}

interface TimeSlot {
  startTime: string;
  DaysOfYear: {
    slotDuration: number;
  };
}

interface FactorDetail {
  id: number;
  count: number;
  Product: Product;
}

interface ClientAddress {
  address: string;
  buildingNumber: string;
  postalCode: string;
}

interface Client {
  name: string;
}

interface Factor {
  id: number;
  Client: Client;
  ClientAddress: ClientAddress;
  TimeSlot: TimeSlot;
  StatusFactor: {
    status: string;
    bgColor: string;
    color: string;
  };
  FactorDetails: FactorDetail[];
  price: number;
}

const OrderDetails = () => {
  moment.loadPersian({ usePersianDigits: true, dialect: "persian-modern" });
  const pathname = usePathname();
  const printRef = useRef<HTMLDivElement>(null);
  const _token = useSelector((state: RootState) => state.client.token);

  const _factorId = pathname.split("/").pop();

  const [factor, setFactor] = useState<Factor[]>([]);
  const [discoumt, setDiscount] = useState<number>(0);

  // let totalDiscount = 0;

  useEffect(() => {
    const fetchFactor = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/factor/${_factorId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${_token}`,
          },
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        let totalDiscount = 0;
        await data?.data[0]?.FactorDetails?.forEach((item: FactorDetail) => {
          totalDiscount += (item?.Product?.discount || 0) * (item?.count || 0);
        });

        setDiscount(totalDiscount);
        setFactor(data?.data);
      }
    };

    if (_token) {
      fetchFactor();
    }
  }, [_token, setFactor]);

  const handlePrint = () => {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;

      const iframe = document.createElement("iframe");
      iframe.style.position = "absolute";
      iframe.style.width = "0px";
      iframe.style.height = "0px";
      iframe.style.border = "none";
      document.body.appendChild(iframe);

      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      doc?.open();
      doc?.write(`
        <html>
          <head>
            <title>فاکتور</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                direction: rtl;
                margin: 0;
                padding: 20px;
              }
              div {
                line-height: 55px;
              }
              .my-14 { margin: 14px 0; }
              .flex { display: flex; }
              .flex-row { flex-direction: row; }
              .justify-between { justify-content: space-between; }
              .rounded-md { border-radius: 4px; }
              .text-right { text-align: right; }
              .text-[#6D6F72] { color: #6D6F72; }
              .bg-[#F7F7F7] { background-color: #F7F7F7; }
            </style>
          </head>
          <body>${printContent}</body>
        </html>
      `);
      doc?.close();

      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 1000);
    }
  };

  return (
    <div className="w-[90%] mx-auto">
      <div className="flex flex-row-reverse space-x-4 space-x-reverse justify-between w-full mt-8 pb-10">
        <div className="text-[#221D23] text-2xl font-semibold my-auto">
          جزییات فاکتور
        </div>
        <hr className="flex-grow my-auto border-[#D9D9D9]" />
        <div
          style={{
            backgroundColor: `${factor[0]?.StatusFactor?.bgColor}`,
            color: `${factor[0]?.StatusFactor?.color}`,
          }}
          className="rounded-[50px] flex flex-row px-10 py-2"
        >
          وضعیت فاکتور:{factor[0]?.StatusFactor?.status}
        </div>
        <div
          onClick={handlePrint}
          className="bg-[#A60014] rounded-[50px] flex flex-row px-10 py-2 cursor-pointer"
        >
          <span className="text-[#fff] my-auto ">پرینت کنید</span>
          <Image
            src={printIcon}
            width={24}
            height={24}
            alt="group"
            className="ml-2"
          />
        </div>
      </div>

      <div ref={printRef} style={{ direction: "rtl" }}>
        {factor?.map((item: Factor) => {
          console.log("item", item);

          return (
            <div key={item.id} className="my-14">
              <div className="flex flex-row justify-between">
                <span className="my-auto">نام و نام خانوادگی گیرنده:</span>

                <div className="w-[84%] bg-[#F7F7F7] text-[#6D6F72] py-3 px-4 rounded-md text-right">
                  {item.Client.name}
                </div>
              </div>
              <div className="flex flex-row justify-between my-8">
                <span className="my-auto"> آدرس گیرنده:</span>
                <div className="w-[84%] bg-[#F7F7F7] text-[#6D6F72] py-3 px-4 rounded-md text-right">
                  {item.ClientAddress.address +
                    "  ، پلاک :" +
                    item.ClientAddress.buildingNumber +
                    "  ، کد پستی:" +
                    item.ClientAddress.postalCode}
                </div>
              </div>
              <div className="flex flex-row justify-between ">
                <span className="my-auto"> تاریخ تحویل:</span>
                <div className="w-[84%] bg-[#F7F7F7] text-[#6D6F72] py-3 px-4 rounded-md flex flex-row">
                  <div>
                    {moment(
                      item.TimeSlot.startTime,
                      "YYYY-MM-DD HH:mm:ss"
                    ).format("dddd jD jMMMM jYYYY")}
                  </div>
                  <div className="mx-4">
                    {moment(
                      item.TimeSlot.startTime,
                      "YYYY-MM-DD HH:mm:ss"
                    ).format("HH:mm")}
                    <span className="mx-2"> تا</span>
                    {moment(item.TimeSlot.startTime, "YYYY-MM-DD HH:mm:ss")
                      .add(item.TimeSlot?.DaysOfYear?.slotDuration, "minutes")
                      .format("HH:mm")}
                  </div>
                </div>
              </div>

              <div>
                {item?.FactorDetails?.map(
                  (details: FactorDetail, index: number) => {
                    return (
                      <div
                        key={details?.id}
                        className="flex flex-row space-x-10 space-x-reverse my-10 justify-between"
                      >
                        <div className="flex flex-row justify-between space-x-9 space-x-reverse">
                          <span className="my-auto whitespace-nowrap ml-24">
                            نام محصول {index + 1}:
                          </span>

                          <div className="w-[84%] bg-[#F7F7F7] text-[#6D6F72] py-3 px-4 rounded-md">
                            {details?.Product?.mainTitle}
                          </div>
                        </div>
                        <div className="flex flex-row justify-between space-x-4 space-x-reverse">
                          <span className="my-auto whitespace-nowrap">
                            قیمت محصول:
                          </span>

                          <div className="w-[84%] bg-[#F7F7F7] text-[#6D6F72] py-3 px-4 rounded-md">
                            <span>
                              {(+details?.Product?.price).toLocaleString()}
                            </span>

                            <span className="mx-2">تومان</span>
                          </div>
                        </div>
                        <div className="flex flex-row justify-between space-x-4 space-x-reverse">
                          <span className="my-auto whitespace-nowrap">
                            تخفیف :
                          </span>

                          <div className="w-[84%] bg-[#F7F7F7] text-[#6D6F72] py-3 px-4 rounded-md">
                            <span>
                              {(+details?.Product?.discount).toLocaleString()}
                            </span>
                            <span className="mx-2">تومان</span>
                          </div>
                        </div>
                        <div className="flex flex-row justify-between space-x-4 space-x-reverse">
                          <span className="my-auto whitespace-nowrap">
                            تعداد :
                          </span>

                          <div className="w-[84%] bg-[#F7F7F7] text-[#6D6F72] py-3 px-4 rounded-md">
                            {details?.count}
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              <div className="flex flex-row justify-between my-8">
                <span className="my-auto"> تخفیف اعمال شده:</span>
                <div className="w-[84%] bg-[#F7F7F7] text-[#6D6F72] py-3 px-4 rounded-md">
                  <span>{(+discoumt)?.toLocaleString()}</span>
                  <span className="mx-2">تومان</span>
                </div>
              </div>
              <div className="flex flex-row justify-between my-8">
                <span className="my-auto"> قیمت کل فاکتور </span>
                <div className="w-[84%] bg-[#F7F7F7] text-[#6D6F72] py-3 px-4 rounded-md">
                  <span>{(+item?.price).toLocaleString()}</span>
                  <span className="mx-2">تومان</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderDetails;
