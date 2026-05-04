"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import closeIcon from "@/public/images/shop/close.svg";
import locationIcon from "@/public/images/shop/location.svg";
import leftIcon from "@/public/images/shop/left_light.svg";
import editIcon from "@/public/images/shop/edit.svg";
import editIcon2 from "@/public/images/shop/edit-gray.svg";
import EditAddress from "./edit-address";

interface addressesType {
  id: number;
  address: string;
  postalCode: string;
  addressName: string;
  buildingNumber: string;
  unit: string;
  province: string;
  neighbourhood: string;
  city: string;
}
interface PropsType {
  setNewAddressModal: (val: boolean) => void;
  setChooseAddressModal: (val: boolean) => void;
  setReloading: (val: boolean) => void;
  addresses: addressesType[];
  setSelectedAddressId: (val: number) => void;
  selectedAddressId: number | null;
}
const ChooseAddress: React.FC<PropsType> = ({
  setNewAddressModal,
  setChooseAddressModal,
  addresses,
  setSelectedAddressId,
  selectedAddressId,
  setReloading,
}) => {
  const _token = useSelector((state: RootState) => state.token.token);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState<addressesType | null>(
    null
  );

  const fetchAddressToEdit = async (id: number) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/clients/address/${id}`,

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

        setEditModalOpen(true);
        setAddressToEdit(data?.data);

        break;

      default:
        break;
    }
  };

  return (
    <div
      className="font-Peyda rounded-[15px] p-10 w-1/2 z-30 fixed justify-center h-fit mx-auto inset-x-0 my-auto inset-y-0 bg-white
      screen1250:w-2/3
      screen750:w-[90%]
      screen750:p-5 
      "
    >
      <div className="flex flex-row-reverse justify-between">
        <p className="text-[#221D23] text-2xl screen1250:text-xl">
          انتخاب آدرس
        </p>
        <Image
          onClick={() => {
            setChooseAddressModal(false);
          }}
          src={closeIcon}
          width={37}
          height={37}
          alt="ایکن بستن"
          className="cursor-pointer  screen1250:w-6 screen1250:h-6"
        />
      </div>
      <div
        onClick={() => {
          setNewAddressModal(true);
          setChooseAddressModal(false);
        }}
        className="flex flex-row-reverse justify-between border border-[#D9D9D9] rounded-[8px] my-4 cursor-pointer"
      >
        <div className="flex flex-row justify-between space-x-2 p-5">
          <p className="text-[#221D23] text-2xl my-auto screen1250:text-xl screen750:text-base">
            افزودن آدرس جدید
          </p>
          <Image
            src={locationIcon}
            width={29}
            height={29}
            alt="ایکن لوکیشن"
            className="my-auto screen1250:w-6 screen1250:h-6"
          />
        </div>

        <Image
          src={leftIcon}
          width={29}
          height={29}
          alt="ایکن فلش"
          className="my-auto  screen1250:w-6 screen1250:h-6"
        />
      </div>

      {addresses.length === 0 ? (
        <div
          style={{ direction: "rtl" }}
          className="text-[#919191] text-2xl text-center my-20 screen1000:text-lg screen1000:my-8"
        >
          آدرسی وجود ندارد.
        </div>
      ) : (
        addresses?.map((item) => {
          const formattedAddress = `${item?.address}، پلاک ${item?.buildingNumber}، واحد ${item?.unit}، کد پستی ${item?.postalCode}`;
          return (
            <div
              style={{ direction: "rtl" }}
              key={item?.id}
              className="border-[0.75px] border-[#d9d9d9] rounded-[8px] p-6 mb-5"
            >
              <div className="flex flex-row justify-between">
                <div
                  onClick={() => {
                    setSelectedAddressId(item?.id);
                    setChooseAddressModal(false);
                  }}
                  className="flex flex-row"
                >
                  <input
                    type="radio"
                    name="address"
                    value={item?.id}
                    checked={selectedAddressId === item?.id}
                    className="accent-[#A60014] cursor-pointer"
                    onChange={() => {
                      setSelectedAddressId(item?.id);
                      setChooseAddressModal(false);
                    }}
                  />
                  <div className="mx-5">
                    <p className="text-[#221D23] text-lg screen1250:text-base">
                      {item?.addressName}
                    </p>
                    <p className="line-clamp-1 hover:line-clamp-none text-[#919191] screen1250:text-sm">
                      {formattedAddress}
                    </p>
                  </div>
                </div>

                <Image
                  onClick={() => {
                    fetchAddressToEdit(item.id);
                  }}
                  src={selectedAddressId === item?.id ? editIcon : editIcon2}
                  width={29}
                  height={29}
                  alt="ایکن ویرایش"
                  className="my-auto  screen1250:w-6 screen1250:h-6 cursor-pointer"
                />
              </div>
            </div>
          );
        })
      )}

      {editModalOpen && addressToEdit && (
        <EditAddress
          setEditModalOpen={setEditModalOpen}
          addressToEdit={addressToEdit}
          setReloading={setReloading}
          setAddressToEdit={setAddressToEdit}
        />
      )}
    </div>
  );
};

export default ChooseAddress;
