import React from "react";
import { useRouter } from "next/navigation";

const Summary: React.FC<any> = ({
  totalDiscount,
  totalPrice,
  token,
  setIsModalOpen,
}) => {
  const router = useRouter();

  return (
    <div className="w-[30%] shadow-[0px_4px_14px_0px_rgba(0,0,0,0.15)] rounded-[8px] my-20 p-8 h-fit screen1050:w-[35%] screen1000:w-[40%] screen820:mt-8 screen820:w-full">
      <div className="flex flex-row-reverse justify-between w-[100%] mx-auto ">
        <span className="text-[#858585] text-sm ">قیمت کل</span>
        <span style={{ direction: "rtl" }}>
          {Number(totalPrice).toLocaleString()} تومان
        </span>
      </div>
      <div className="flex flex-row-reverse justify-between w-[100%] mx-auto my-4 ">
        <span className="text-[#858585] text-sm ">تخفیف اعمال شده </span>

        <span style={{ direction: "rtl" }}>
          {Number(totalDiscount).toLocaleString()} تومان
        </span>
      </div>
      <div className="flex flex-row-reverse justify-between w-[100%] mx-auto mb-4 ">
        <span className="text-[#858585] text-sm ">هزینه ارسال </span>

        <span>تعیین نشده </span>
      </div>
      <div className="flex flex-row-reverse justify-between w-[100%] mx-auto border-t  py-5">
        <span className="text-[#858585] text-sm ">مبلغ قابل پرداخت </span>
        <span style={{ direction: "rtl" }}>
          {Number(totalPrice - totalDiscount).toLocaleString()}
          تومان
        </span>
      </div>

      <div
        onClick={() => {
          if (!token) {
            setIsModalOpen(true);
          } else {
            router.push(`/shop/checkout`);
          }
        }}
        className="button w-[92%] mx-auto py-3  text-lg text-center cursor-pointer screen1250:text-base"
      >
        <span className="button-hover-effect"></span>
        <p className="button-hover-effect-text ">تسویه حساب</p>
      </div>
    </div>
  );
};

export default Summary;
