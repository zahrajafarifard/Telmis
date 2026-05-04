import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment-jalaali";

import printIcon from "../../../../assets/images/Print_light.svg";

const OrderDetails = () => {
  const printRef = useRef(null);
  const location = useLocation();
  const _factorId = location?.state?.factorId;

  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState();
  const [factor, setFactor] = useState([]);

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  useEffect(() => {
    const fetchFactor = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/factor/getFactor/${_factorId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        setFactor(data?.data);
      }
    };

    if (token) {
      fetchFactor();
    }
  }, [token, setFactor]);

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
              .space-x-8 { margin: 0 32px; }
              .px-10 { padding: 0 10px; }
              .flex { display: flex; }
              .flex-row { flex-direction: row; }
              .justify-between { justify-content: space-between; }
              .rounded-md { border-radius: 4px; }
              .text-right { text-align: right; }
              .text-color { color: #6D6F72; }
              .bg-color { background-color: #F7F7F7; }
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
      <div className="flex flex-row space-x-4 space-x-reverse justify-between w-full mt-8 pb-10">
        <div className="text-[#221D23] text-2xl font-semibold my-auto">
          جزییات فاکتور # {factor[0]?.trackingCode}
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
          <img
            src={printIcon}
            width={24}
            height={24}
            alt="group"
            className="ml-2"
          />
          <span className="text-[#fff] my-auto ">پرینت کنید</span>
        </div>
      </div>

      <div ref={printRef}>
        {factor?.map((item) => {
          return (
            <div key={item.id} className="my-14">
              <div className="flex flex-row w-full mx-auto my-10 space-x-8 space-x-reverse">
                <div className="w-[18%] my-auto text-right">
                  کد پیگیری سفارش:
                </div>

                <div className="bg-[#F7F7F7] w-[32%] text-[#6D6F72] p-3 rounded-[6px]">
                  {factor[0]?.trackingCode}
                </div>
                <div className="w-[18%] my-auto text-right">
                  تاریخ ثبت سفارش:
                </div>

                <div className="bg-[#F7F7F7] w-[32%] text-[#6D6F72] p-3 rounded-[6px]">
                  {factor[0]?.trackingCode}
                </div>
              </div>
              <div className="flex flex-row w-full mx-auto my-10 space-x-8 space-x-reverse">
                <div className="w-[18%] my-auto text-right">
                  نام و نام خانوادگی گیرنده:
                </div>

                <div className="bg-[#F7F7F7] w-[32%] text-[#6D6F72] p-3 rounded-[6px]">
                  {item?.Client?.name}
                </div>
                <div className="w-[18%] my-auto text-right">
                  شماره تماس گیرنده:
                </div>

                <div className="bg-[#F7F7F7] w-[32%] text-[#6D6F72] p-3 rounded-[6px]">
                  {item?.Client?.mobile}
                </div>
              </div>
              <div className="flex flex-row w-full mx-auto my-10 space-x-8 space-x-reverse">
                <div className="w-[18%] my-auto text-right">
                  نحوه ی ارسال محصول:
                </div>
                <div className="bg-[#F7F7F7] w-[32%] text-[#6D6F72] p-3 rounded-[6px]">
                  توسط پیک
                </div>
                <div className="w-[18%] my-auto text-right">
                  زمان تحویل سفارش:
                </div>

                <div className="bg-[#F7F7F7] w-[32%] text-[#6D6F72] p-3 rounded-[6px]">
                  {moment(
                    item?.TimeSlot?.startTime,
                    "YYYY-MM-DD HH:mm:ss"
                  ).format("dddd jD jMMMM jYYYY")}
                </div>
              </div>

              <div className="flex flex-row justify-between my-8">
                <span className="my-auto"> آدرس گیرنده:</span>
                <div className="w-[81%] bg-[#F7F7F7] text-[#6D6F72] py-3 px-4 rounded-md text-right">
                  {item?.ClientAddress?.address +
                    "  ، پلاک :" +
                    item.ClientAddress?.buildingNumber +
                    "  ، کد پستی:" +
                    item.ClientAddress?.postalCode}
                </div>
              </div>
              <hr />

              <div className="flex flex-row justify-between mt-10">
                <span className="my-auto">مبلغ کل فاکتور:</span>

                <div className="w-[81%] bg-[#F7F7F7] text-[#6D6F72] py-3 px-4 rounded-md text-right">
                  {factor[0]?.netPrice.toLocaleString()} تومان
                </div>
              </div>

              <div className="flex flex-row w-full mx-auto my-10 space-x-8 space-x-reverse">
                <div className="w-[22%] my-auto text-right">
                  مبلغ اولیه سفارش:
                </div>

                <div className="bg-[#F7F7F7] w-[20%] text-[#6D6F72] p-3 rounded-[6px]">
                  {factor[0]?.price.toLocaleString()}
                </div>
                <div className="w-[18%] my-auto text-right">هزینه ارسال:</div>
                <div className="bg-[#F7F7F7] w-[20%] text-[#6D6F72] p-3 rounded-[6px]">
                  {factor[0]?.shippingCost.toLocaleString()}
                </div>
                <div className="w-[18%] my-auto text-right">
                  تخفیف اعمال شده:
                </div>
                <div className="bg-[#F7F7F7] w-[20%] text-[#6D6F72] p-3 rounded-[6px]">
                  {factor[0]?.discount.toLocaleString()}
                </div>
              </div>
              <hr />
              <div>
                {item?.FactorDetails?.map((details) => {
                  return (
                    <div
                      key={details?.id}
                      className="flex flex-row  w-full  my-10 justify-between"
                    >
                      <div className="w-[30%] flex flex-row">
                        <div className="my-auto border border-[#E3E3E3] rounded-[2px] p-2">
                          <img
                            src={`${
                              process.env.REACT_APP_URL
                            }/uploads/product/${details?.mainImage
                              ?.replace(/\\/g, "/")
                              ?.split("/")
                              ?.pop()}`}
                            className="mx-auto w-28 h-16 my-auto object-contain"
                            loading="lazy"
                            alt="Product Image"
                          />
                        </div>

                        <div className="my-auto mr-4">
                          <div className="text-[#2B2B2B] my-auto text-right w-full">
                            {details?.mainTitle}
                          </div>

                          <div className="text-sm text-[#6D6F72] mt-1">
                            {details?.FactorDetailMeta?.map(
                              (v) => `${v.key} : ${v.value}`
                            ).join(" - ")}
                          </div>
                        </div>
                      </div>

                      <div className="w-[70%] flex flex-row mx-auto my-10 space-x-8 space-x-reverse">
                        <div className="w-[25%] my-auto">قیمت محصول:</div>

                        <div className="bg-[#F7F7F7] w-[25%] text-[#6D6F72] p-3 rounded-[6px]">
                          {(+details?.price).toLocaleString()}
                        </div>
                        <div className="w-[25%] my-auto">تعداد :</div>

                        <div className="bg-[#F7F7F7] w-[25%] text-[#6D6F72] p-3 rounded-[6px]">
                          {details?.count}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* <div className="flex flex-row justify-between my-8">
                <span className="my-auto"> تخفیف اعمال شده:</span>
                <div className="w-[84%] bg-[#F7F7F7] text-[#6D6F72] py-3 px-4 rounded-md">
                  {(+discount)?.toLocaleString()}
                </div>
              </div> */}
              {/* <div className="flex flex-row justify-between my-8">
                <span className="my-auto"> قیمت کل فاکتور </span>
                <div className="w-[84%] bg-[#F7F7F7] text-[#6D6F72] py-3 px-4 rounded-md">
                  {(+item?.price).toLocaleString()}
                </div>
              </div> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderDetails;
