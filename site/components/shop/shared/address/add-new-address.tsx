import React from "react";
import Image from "next/image";

import closeIcon from "@/public/images/shop/close.svg";
import locationIcon from "@/public/images/shop/location.svg";

import Map from "@/components/shop/shared/map";
import "@/components/shop/shared/style.css";

interface PropsType {
  setNewAddressModal?: (val: boolean) => void;
  setAddressDetailsModal?: (val: boolean) => void;
  locationData?: any;
  setLocationData?: any;
}
const AddNewAddress: React.FC<PropsType> = ({
  locationData,
  setLocationData,
  setNewAddressModal,
  setAddressDetailsModal,
}) => {
  return (
    <div
      className="font-Peyda rounded-[15px] p-10 w-[34%] z-30 fixed justify-center h-fit mx-auto inset-x-0 my-auto inset-y-0 bg-white
      screen1360:w-2/3
      screen750:w-[90%]
      screen750:p-5
    "
    >
      <div className="flex flex-row-reverse justify-between space-x-2 p-5  border rounded-lg screen750:p-2">
        <div className="flex flex-row justify-between space-x-5 screen750:space-x-3">
          <div className="text-right">
            <p className="text-[#221D23] text-2xl my-auto screen1250:text-xl screen750:text-lg">
               آدرس جدید
            </p>
            <p
              style={{ direction: "rtl" }}
              className="text-[#919191] screen1250:text-sm screen750:text-xs"
            >
              موقعیت مکانی آدرس خود را مشخص کنید.
            </p>
          </div>
          <Image
            src={locationIcon}
            width={29}
            height={29}
            alt="ایکن لوکیشن"
            className="my-auto  screen1250:w-6 screen1250:h-6"
          />
        </div>
        <Image
          onClick={() => {
            setNewAddressModal?.(false);
          }}
          src={closeIcon}
          width={29}
          height={29}
          alt="ایکن ادرس جدید"
          className="cursor-pointer  screen1250:w-6 screen1250:h-6 my-auto"
        />
      </div>

      <Map locationData={locationData} setLocationData={setLocationData} />

      <div
        onClick={() => {
          setNewAddressModal?.(false);
          setAddressDetailsModal?.(true);
        }}
        className="button px-14 py-2 whitespace-nowrap w-full mx-auto text-2xl screen1250:text-xl screen750:text-lg text-center  mt-4 cursor-pointer"
      >
        <span className="button-hover-effect"></span>
        <p className="button-hover-effect-text "> تایید و ادامه </p>
      </div>
    </div>
  );
};

export default AddNewAddress;
