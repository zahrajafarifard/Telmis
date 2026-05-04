"use client";
import React, { useState, useEffect, useRef } from "react";

import Image from "next/image";
import { useSelector } from "react-redux";

import moment from "moment-jalaali";
import { RootState } from "@/store/store";
import printIcon from "@/public/images/shop/Print_light.svg";

import Header from "@/components/shared/header/page";
import bgImage from "@/public/images/bg-header.png";

interface TimeSlot {
  startTime: string;
  DaysOfYear: {
    slotDuration: number;
    shippingCost: number;
  };
}

interface FactorDetail {
  id: number;
  count: number;
  mainTitle: string;
  // subTitle: string;
  mainImage: string;
  price: number;
  discount: number;
  FactorDetailMeta: { key: string; value: string }[];
}

interface ClientAddress {
  address: string;
  buildingNumber: string;
  postalCode: string;
}

interface Client {
  name: string;
  mobile: string;
}

interface Factor {
  id: number;
  createdAt: string;
  trackingCode: string;
  Client: Client;
  ClientAddress: ClientAddress;
  TimeSlot: TimeSlot;
  StatusFactorId: number;
  StatusFactor: {
    status: string;
    bgColor: string;
    color: string;
  };
  FactorDetails: FactorDetail[];
  price: number;
  netPrice: number;
  discount: number;
  shippingCost: number;
}

interface StatusFactor {
  id: number;
  status: string;
}

const FactoreDetails: React.FC<{ factorId: number }> = ({ factorId }) => {
  moment.loadPersian({ usePersianDigits: true, dialect: "persian-modern" });

  const printRef = useRef<HTMLDivElement>(null);
  const _token = useSelector((state: RootState) => state.token.token);

  const [factor, setFactor] = useState<Factor[]>([]);

  const [statusFactors, setStatusFactors] = useState<StatusFactor[]>([]);

  useEffect(() => {
    const fetchFactor = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/apiClient/factor/${factorId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${_token}`,
          },
        }
      );
      if (response.status === 200) {
        const data = await response.json();

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

  useEffect(() => {
    const _statuses = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/factor/status`,
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
          setStatusFactors(data?.data);
          break;

        default:
          break;
      }
    };

    if (_token) {
      _statuses();
    }
  }, [_token]);

  return (
    <div className="w-[100%] mx-auto">
      <Header
        title="جزییات سفارش"
        text={
          <div className="flex flex-row justify-center space-x-2 space-x-reverse">
            <div
              style={{
                backgroundColor: `${factor[0]?.StatusFactor?.bgColor}`,
                color: `${factor[0]?.StatusFactor?.color}`,
              }}
              className="rounded-[50px] flex flex-row justify-center py-2 text-base w-56"
            >
              وضعیت فاکتور:{factor[0]?.StatusFactor?.status}
            </div>
            <div
              onClick={handlePrint}
              className="bg-white rounded-[50px] flex flex-row justify-center py-2 cursor-pointer w-56"
            >
              <Image
                src={printIcon}
                width={24}
                height={24}
                alt="group"
                className="mr-2"
              />
              <span className="text-[#A60014] my-auto text-base">
                پرینت کنید
              </span>
            </div>
          </div>
        }
        image={bgImage}
      />

      <div className="flex flex-row-reverse justify-between mt-24 mb-14 w-[60%] mx-auto">
        {statusFactors?.map((item: StatusFactor, index: number) => {
          return (
            <React.Fragment key={item.id}>
              <div className="flex flex-row-reverse space-x-4 space-x-reverse justify-between">
                <div className="flex flex-col items-center">
                  <div
                    className={`rounded-lg  text-xl border-[2px]  w-12 h-12 text-center flex items-center justify-center screen750:w-8 screen750:h-8
                    ${
                      item.id === factor[0]?.StatusFactorId
                        ? "border-[#A60014] text-[#A60014]"
                        : "border-[#999] text-[#999]"
                    } 
                    `}
                  >
                    {index + 1}
                  </div>
                  <p
                    className={` text-center mt-3 screen750:text-sm
                       ${
                         item.id === factor[0]?.StatusFactorId
                           ? "text-[#484848]"
                           : " text-[#999]"
                       } 
                    `}
                  >
                    {item?.status}
                  </p>
                </div>
              </div>
              {index !== statusFactors.length - 1 && (
                <hr className="flex flex-grow mt-6 border-[#999] screen750:mt-4 " />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div
        ref={printRef}
        style={{ direction: "rtl" }}
        className="w-[80%] mx-auto"
      >
        {factor?.map((item: Factor) => {
          return (
            <div key={item.id} className="my-4">
              <div className="flex flex-row justify-between">
                <span className="my-auto w-[15%]">کد پیگیری سفارش:</span>

                <div className="w-[32%] bg-[#F7F7F7] text-[#6D6F72] py-3 px-4 rounded-md text-right">
                  {item?.trackingCode}
                </div>
                <span className="my-auto w-[15%] ">تاریخ ثبت سفارش:</span>

                <div className="w-[32%] bg-[#F7F7F7] text-[#6D6F72] py-3 px-4 rounded-md text-right">
                  {moment(item?.createdAt, "YYYY-MM-DD HH:mm:ss").format(
                    "dddd jD jMMMM jYYYY"
                  )}
                </div>
              </div>
              <div className="flex flex-row justify-between my-8">
                <span className="my-auto w-[15%]">
                  نام و نام خانوادگی گیرنده:
                </span>

                <div className="w-[32%] bg-[#F7F7F7] text-[#6D6F72] py-3 px-4 rounded-md text-right">
                  {item?.Client?.name}
                </div>
                <span className="my-auto w-[15%] ">شماره تماس گیرنده:</span>

                <div className="w-[32%] bg-[#F7F7F7] text-[#6D6F72] py-3 px-4 rounded-md text-right">
                  {item?.Client?.mobile}
                </div>
              </div>
              <div className="flex flex-row justify-between">
                <span className="my-auto w-[15%]">نحوه ی ارسال محصول:</span>

                <div className="w-[32%] bg-[#F7F7F7] text-[#6D6F72] py-3 px-4 rounded-md text-right">
                  پیک
                </div>
                <span className="my-auto w-[15%] ">زمان تحویل سفارش:</span>

                <div className="w-[32%] bg-[#F7F7F7] text-[#6D6F72] py-3 px-4 rounded-md flex flex-row">
                  <div>
                    {moment(
                      item.TimeSlot.startTime,
                      "YYYY-MM-DD HH:mm:ss"
                    ).format("dddd jD jMMMM jYYYY")}
                  </div>
                  <div className="mx-4">
                    {moment
                      .utc(item.TimeSlot.startTime, "YYYY-MM-DD HH:mm:ss")
                      .local()
                      .format("HH:mm")}
                    <span className="mx-2"> تا</span>
                    {moment
                      .utc(item.TimeSlot.startTime, "YYYY-MM-DD HH:mm:ss")
                      .local()
                      .add(item.TimeSlot?.DaysOfYear?.slotDuration, "minutes")
                      .format("HH:mm")}
                  </div>
                </div>
              </div>

              <div className="flex flex-row justify-between my-8">
                <span className="my-auto w-[15%]"> آدرس گیرنده:</span>
                <div className="w-[83%] bg-[#F7F7F7] text-[#6D6F72] py-3 px-4 rounded-md text-right">
                  {item.ClientAddress.address +
                    "  ، پلاک :" +
                    item.ClientAddress.buildingNumber +
                    "  ، کد پستی:" +
                    item.ClientAddress.postalCode}
                </div>
              </div>

              <hr />

              <div className="flex flex-row justify-between my-8">
                <span className="my-auto w-[15%]"> مبلغ کل فاکتور: </span>
                <div className="w-[83%] bg-[#F7F7F7] text-[#6D6F72] py-3 px-4 rounded-md">
                  <span>{(item?.netPrice).toLocaleString()}</span>
                  <span className="mx-2">تومان</span>
                </div>
              </div>

              <div className="flex flex-row justify-between my-8">
                <span className="my-auto w-[17%]"> مبلغ اولیه سفارش:</span>
                <div className="w-[20%] bg-[#F7F7F7] text-[#6D6F72] py-3 px-4 rounded-md">
                  <span>{item?.price?.toLocaleString()}</span>
                  <span className="mx-2">تومان</span>
                </div>
                <span className="my-auto w-[12%] text-left pl-5">
                  هزینه ارسال:
                </span>
                <div className="w-[20%] bg-[#F7F7F7] text-[#6D6F72] py-3 px-4 rounded-md">
                  <span>{(item?.shippingCost).toLocaleString()}</span>
                  <span className="mx-2">تومان</span>
                </div>
                <span className="my-auto w-[12%] text-left pl-5">
                  تخفیف اعمال شده:
                </span>
                <div className="w-[20%] bg-[#F7F7F7] text-[#6D6F72] py-3 px-4 rounded-md">
                  <span>{item?.discount?.toLocaleString()}</span>
                  <span className="mx-2">تومان</span>
                </div>
              </div>

              <hr />
              <div>
                {item?.FactorDetails?.map(
                  (details: FactorDetail, index: number) => {
                    return (
                      <div
                        key={details?.id}
                        className="flex flex-row space-x-10 space-x-reverse"
                      >
                        <div className="w-[6%] my-auto">
                          <div className="border py-1 px-2 border-[#E3E3E3] rounded-sm w-fit">
                            <Image
                              src={`${
                                process.env.NEXT_PUBLIC_API_URL
                              }/uploads/product/${details?.mainImage
                                .split(/\\|\//)
                                .pop()}`}
                              alt={details?.mainTitle}
                              width={40}
                              height={50}
                              className="w-[45px] h-[55px] object-cover"
                            />
                          </div>
                        </div>
                        <div
                          className={`grid grid-cols-3 w-full gap-x-5  pt-8 pb-10 ${
                            index === item?.FactorDetails?.length - 1
                              ? "border-0"
                              : "border-b"
                          }`}
                        >
                          <div className="flex flex-col my-auto">
                            <div className=" text-[#2B2B2B]">
                              {details?.mainTitle}
                            </div>

                            <div className="text-sm text-[#6D6F72] mt-1">
                              {details?.FactorDetailMeta?.map(
                                (v: any) => `${v.key}: ${v.value}`
                              ).join(" - ")}
                            </div>
                          </div>

                          <div className="flex flex-row w-full">
                            <span className="my-auto w-1/3 text-left pl-5">
                              قیمت محصول:
                            </span>

                            <div className="w-2/3 bg-[#F7F7F7] text-[#6D6F72] py-3 px-4 rounded-md my-auto">
                              <span>{(details?.price).toLocaleString()}</span>
                              <span className="mx-2">تومان</span>
                            </div>
                          </div>

                          <div className="flex flex-row w-full">
                            <span className="my-auto w-1/3 text-left pl-5">
                              تعداد :
                            </span>
                            <div className="w-2/3 bg-[#F7F7F7] text-[#6D6F72] py-3 px-4 rounded-md my-auto">
                              <span>{details?.count}</span>
                              <span className="mx-2">عدد</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FactoreDetails;
