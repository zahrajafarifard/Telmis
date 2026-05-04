import React from "react";
import Image from "next/image";

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

import closeIcon from "@/public/images/shop/close.svg";
import locationIcon from "@/public/images/shop/location.svg";

interface EditAddressProps {
  addressToEdit: any;
  setEditModalOpen: (value: boolean) => void;
  setReloading?: (value: boolean) => void;
  setAddressToEdit: (address: any) => void;
}

const EditAddress: React.FC<EditAddressProps> = ({
  addressToEdit,
  setEditModalOpen,
  setReloading,
  setAddressToEdit,
}) => {
  const _token = useSelector((state: RootState) => state.token.token);

  const editAddressHandler = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/clients/addresses`,

      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + _token,
        },
        body: JSON.stringify({
          address: addressToEdit,
        }),
      }
    );

    switch (response.status) {
      case 200:
        setEditModalOpen(false);
        setReloading?.(true);

        break;

      default:
        break;
    }
  };
  return (
    <div
      className="font-Peyda rounded-[15px] p-10 w-1/2 z-30 fixed justify-center h-fit mx-auto inset-x-0 my-auto inset-y-0 bg-white
        screen1360:w-2/3
        screen750:w-[90%]
        screen750:p-5 "
    >
      <div className="flex flex-row-reverse justify-between">
        <p className="text-[#221D23] text-2xl screen1250:text-xl screen750:text-lg">
          ویرایش آدرس
        </p>
        <Image
          onClick={() => {
            setEditModalOpen(false);
          }}
          src={closeIcon}
          width={37}
          height={37}
          alt="بستن"
          className="cursor-pointer screen1250:w-6 screen1250:h-6"
        />
      </div>

      <div className="relative flex flex-row space-x-5 border rounded-lg p-5 my-6 screen1250:my-3">
        <div className="w-full text-right">
          <p className="text-[#221D23] text-lg pb-2 screen1250:base">
            نشانی پستی
          </p>
          <div className="relative group">
            <input
              className="w-full mt-2 text-right outline-none text-[#919191] overflow-hidden text-ellipsis whitespace-nowrap screen1250:text-sm"
              dir="rtl"
              placeholder={addressToEdit?.address || "آدرس خود را وارد کنید"}
              value={addressToEdit.address}
              onChange={(e) =>
                setAddressToEdit({
                  ...addressToEdit,
                  address: e.target.value,
                })
              }
            />
            <div className="absolute left-0 bottom-full mb-2 hidden w-full text-right bg-white border border-gray-300 rounded-lg shadow-md p-2 group-hover:block">
              {addressToEdit?.address || ""}
            </div>
          </div>
        </div>
        <Image
          src={locationIcon}
          width={29}
          height={29}
          alt="لوکیشن"
          className="screen1250:w-6 screen1250:h-6"
        />
      </div>

      <div className=" flex flex-row-reverse justify-between space-x-6 space-x-reverse">
        <div className="border p-5 border-[#D9D9D9] rounded-lg w-1/2 flex flex-row-reverse justify-between screen1250:p-2">
          <div className="flex flex-col justify-end w-full">
            <label className="text-right text-lg text-[#221D23] screen1250:text-base ">
              <span className="text-[#A60014]">*</span> استان
            </label>
            <input
              className="w-full mt-2 text-right outline-none"
              dir="rtl"
              placeholder={addressToEdit?.province}
              value={addressToEdit?.province}
              onChange={(e) => {
                setAddressToEdit({
                  ...addressToEdit,
                  province: e.target.value,
                });
              }}
            />
          </div>
        </div>
        <div className="border p-5 border-[#D9D9D9] rounded-lg w-1/2 flex flex-row-reverse justify-between screen1250:p-2">
          <div className="flex flex-col justify-end w-full">
            <label className="text-right text-lg text-[#221D23] screen1250:text-base ">
              <span className="text-[#A60014]">*</span> شهر
            </label>
            <input
              className="w-full mt-2 text-right outline-none"
              dir="rtl"
              placeholder={addressToEdit?.city}
              value={addressToEdit?.city}
              onChange={(e) => {
                setAddressToEdit({
                  ...addressToEdit,
                  city: e.target.value,
                });
              }}
            />
          </div>
        </div>
      </div>

      <div className="border p-5 border-[#D9D9D9] rounded-lg w-full mx-auto my-6 flex flex-row-reverse justify-between screen1250:p-2 screen1250:my-3">
        <div className="flex flex-col justify-end w-full">
          <label className="text-right text-lg text-[#221D23] screen1250:text-base ">
            <span className="text-[#A60014]">*</span> محله
          </label>
          <input
            className="w-full mt-2 text-right outline-none"
            dir="rtl"
            placeholder={addressToEdit?.neighbourhood}
            value={addressToEdit?.neighbourhood}
            onChange={(e) => {
              setAddressToEdit({
                ...addressToEdit,
                neighbourhood: e.target.value,
              });
            }}
          />
        </div>
      </div>

      <div className="flex flex-row-reverse justify-between space-x-6 space-x-reverse">
        <div className="border p-5 border-[#D9D9D9] rounded-lg w-1/2 flex flex-row-reverse justify-between screen1250:p-2">
          <div className="flex flex-col justify-end w-full">
            <label className="text-right text-lg text-[#221D23] screen1250:text-base ">
              <span className="text-[#A60014]">*</span> پلاک
            </label>
            <input
              className="w-full mt-2 text-right outline-none"
              dir="rtl"
              placeholder="پلاک خود را وارد کنید"
              value={addressToEdit?.buildingNumber}
              onChange={(e) => {
                setAddressToEdit({
                  ...addressToEdit,
                  buildingNumber: e.target.value,
                });
              }}
            />
          </div>
        </div>

        <div className="border p-5 border-[#D9D9D9] rounded-lg w-1/2 flex flex-row-reverse justify-between screen1250:p-2">
          <div className="flex flex-col justify-end w-full">
            <label className="text-right text-lg text-[#221D23] screen1250:text-base ">
              <span className="text-[#A60014]">*</span> واحد
            </label>
            <input
              className="w-full mt-2 text-right outline-none"
              dir="rtl"
              placeholder="واحد  خود را وارد کنید"
              value={addressToEdit?.unit}
              onChange={(e) => {
                setAddressToEdit({
                  ...addressToEdit,
                  unit: e.target.value,
                });
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row-reverse justify-between space-x-6 space-x-reverse my-6 screen1250:my-3">
        <div className="border p-5 border-[#D9D9D9] rounded-lg w-1/2 flex flex-row-reverse justify-between screen1250:p-2">
          <div className="flex flex-col justify-end w-full">
            <label className="text-right text-lg text-[#221D23] screen1250:text-base whitespace-nowrap">
              <span className="text-[#A60014]">*</span> کد پستی
            </label>
            <input
              className="w-full mt-2 text-right outline-none"
              dir="rtl"
              placeholder="کد پستی خود را وارد کنید"
              value={addressToEdit?.postalCode}
              onChange={(e) => {
                setAddressToEdit({
                  ...addressToEdit,
                  postalCode: e.target.value,
                });
              }}
            />
          </div>
        </div>

        <div className="border p-5 border-[#D9D9D9] rounded-lg w-1/2 flex flex-row-reverse justify-between screen1250:p-2">
          <div className="flex flex-col justify-end w-full">
            <label className="text-right text-lg text-[#221D23] screen1250:text-base whitespace-nowrap">
              <span className="text-[#A60014]">*</span> عنوان آدرس
            </label>
            <input
              className="w-full mt-2 text-right outline-none"
              dir="rtl"
              placeholder="عنوان آدرس خود را وارد کنید"
              value={addressToEdit?.addressName}
              onChange={(e) => {
                setAddressToEdit({
                  ...addressToEdit,
                  addressName: e.target.value,
                });
              }}
            />
          </div>
        </div>
      </div>

      <div
        onClick={() => {
          editAddressHandler();
        }}
        className="bg-[#A60014] text-2xl text-white rounded-[50px] w-full mx-auto text-center py-2 mt-10 cursor-pointer"
      >
        ویرایش آدرس
      </div>
    </div>
  );
};

export default EditAddress;
