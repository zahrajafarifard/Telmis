"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useForm } from "react-hook-form";

import closeIcon from "@/public/images/shop/close.svg";
import warningIcon from "@/public/images/shop/error-red.svg";
import locationIcon from "@/public/images/shop/location.svg";

interface PropsType {
  setNewAddressModal?: (val: boolean) => void;
  setAddressDetailsModal?: (val: boolean) => void;
  setReloading?: (val: boolean) => void;
  locationData?: any;
  // setSelectedAddress?: (val: AddressFormValues) => void;
  setSelectedAddress?: any
}

type AddressFormValues = {
  address: string;
  city: string;
  province: string;
  neighbourhood: string;
  postalCode: string;
  addressName: string;
  buildingNumber: string;
  unit: string;
};

const AddressDetails: React.FC<PropsType> = ({
  locationData,
  setNewAddressModal,
  setAddressDetailsModal,
  setSelectedAddress,
  setReloading,
}) => {
  const _token = useSelector((state: RootState) => state.token.token);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm<AddressFormValues>({
    mode: "onChange",
    defaultValues: {
      address: locationData?.address_compact || "",
      city: locationData?.city || "",
      province: locationData?.province || "",
      neighbourhood: locationData?.primary || "",
      postalCode: "",
      addressName: "",
      buildingNumber: "",
      unit: "",
    },
  });

  useEffect(() => {
    if (locationData) {
      setValue("address", locationData.address_compact || "");
      setValue("city", locationData.city || "");
      setValue("province", locationData.province || "");
      setValue("neighbourhood", locationData.primary || "");
    }
  }, [locationData, setValue]);

  const onSubmit = async (data: AddressFormValues) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/clients/address`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + _token,
        },
        body: JSON.stringify({ address: data }),
      }
    );

    switch (response.status) {
      case 201:
        setReloading?.(true);
        setSelectedAddress?.(data);
        setNewAddressModal?.(false);
        setAddressDetailsModal?.(false);
        break;
      case 403:
        alert("عنوان انتخابی برای آدرس تکراری است");
        break;
      default:
        alert("خطا در ثبت آدرس، لطفا دوباره تلاش کنید.");
        break;
    }
  };

  return (
    <div
      className="font-Peyda rounded-[15px] p-10 w-1/2 z-30 fixed justify-center h-fit mx-auto inset-x-0 my-auto inset-y-0 bg-white
      screen1360:w-2/3 screen750:w-[90%] screen750:p-5"
    >
      <div className="flex flex-row-reverse justify-between">
        <p className="text-[#221D23] text-2xl screen1250:text-xl screen750:text-lg">
          تکمیل جزئیات
        </p>
        <Image
          onClick={() => setAddressDetailsModal?.(false)}
          src={closeIcon}
          width={37}
          height={37}
          alt="ایکن بستن"
          className="cursor-pointer screen1250:w-6 screen1250:h-6"
        />
      </div>

      {(!isDirty || !isValid) && (
        <div
          style={{ direction: "rtl" }}
          className="bg-[#F9BCBC] py-3 text-[#940707] flex flex-row rounded-s-[2px] rounded-e-[8px] w-1/2 ml-auto"
        >
          <Image
            src={warningIcon}
            width={26}
            height={26}
            alt="warning icon"
            className="mr-14 ml-2"
          />
          <div className="text-right my-auto">
            لطفا فیلدهای ضروری را پر کنید.
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <div className="relative flex flex-row space-x-5 border rounded-lg p-5 screen1250:p-2 screen1250:space-x-2">
          <div className="w-full text-right">
            <p className="text-[#221D23] text-lg pb-2 screen1250:text-base">
              نشانی پستی
            </p>
            <input
              className="w-full mt-2 text-right outline-none text-[#919191] text-sm screen1250:text-sm"
              dir="rtl"
              placeholder="آدرس خود را وارد کنید"
              {...register("address", { required: "آدرس الزامی است" })}
            />
          </div>
          <Image
            src={locationIcon}
            width={29}
            height={29}
            alt="ایکن لوکیشن"
            className="screen1250:w-6 screen1250:h-6 my-auto"
          />
        </div>

        <div className="flex flex-row-reverse justify-between space-x-6 space-x-reverse">
          {[
            { label: "استان", name: "province" },
            { label: "شهر", name: "city" },
          ].map((field) => (
            <div
              key={field.name}
              className="border p-5 border-[#D9D9D9] rounded-lg w-1/2 screen1250:p-2"
            >
              <label className="text-right text-lg text-[#221D23] screen1250:text-base block">
                <span className="text-[#A60014]">*</span> {field.label}
              </label>
              <input
                className="w-full mt-2 text-right outline-none"
                dir="rtl"
                placeholder={`${field.label} خود را وارد کنید`}
                {...register(field.name as keyof AddressFormValues, {
                  required: `${field.label} الزامی است`,
                })}
              />
            </div>
          ))}
        </div>

        <div className="border p-5 border-[#D9D9D9] rounded-lg">
          <label className="text-right text-lg text-[#221D23] screen1250:text-base block">
            <span className="text-[#A60014]">*</span> محله
          </label>
          <input
            className="w-full mt-2 text-right outline-none"
            dir="rtl"
            placeholder="محله خود را وارد کنید"
            {...register("neighbourhood", { required: "محله الزامی است" })}
          />
        </div>

        <div className="flex flex-row-reverse justify-between space-x-6 space-x-reverse">
          {[
            {
              label: "پلاک",
              name: "buildingNumber",
              placeholder: "پلاک خود را وارد کنید",
            },
            {
              label: "واحد",
              name: "unit",
              placeholder: "واحد خود را وارد کنید",
            },
          ].map((field) => (
            <div
              key={field.name}
              className="border p-5 border-[#D9D9D9] rounded-lg w-1/2 screen1250:p-2"
            >
              <label className="text-right text-lg text-[#221D23] screen1250:text-base block">
                <span className="text-[#A60014]">*</span> {field.label}
              </label>
              <input
                className="w-full mt-2 text-right outline-none"
                dir="rtl"
                placeholder={field.placeholder}
                {...register(field.name as keyof AddressFormValues, {
                  required: `${field.label} الزامی است`,
                })}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-row-reverse justify-between space-x-6 space-x-reverse">
          {[
            {
              label: "کد پستی",
              name: "postalCode",
              placeholder: "کد پستی خود را وارد کنید",
            },
            {
              label: "عنوان آدرس",
              name: "addressName",
              placeholder: "عنوان آدرس را وارد کنید",
            },
          ].map((field) => (
            <div
              key={field.name}
              className="border p-5 border-[#D9D9D9] rounded-lg w-1/2 screen1250:p-2"
            >
              <label className="text-right text-lg text-[#221D23] screen1250:text-base block">
                <span className="text-[#A60014]">*</span> {field.label}
              </label>
              <input
                className="w-full mt-2 text-right outline-none"
                dir="rtl"
                placeholder={field.placeholder}
                {...register(field.name as keyof AddressFormValues, {
                  required: `${field.label} الزامی است`,
                })}
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={!isDirty || !isValid}
          className={`button py-2 whitespace-nowrap w-full text-2xl text-center screen1250:text-xl screen750:text-lg ${
            !isDirty || !isValid ? "cursor-not-allowed" : ""
          }`}
        >
          <span className="button-hover-effect"></span>
          <p className="button-hover-effect-text">ثبت آدرس</p>
        </button>
      </form>
    </div>
  );
};

export default AddressDetails;
