"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import Details from "./details";

import addIcon from "@/public/images/shop/Add-white.svg";
import AddNewAddress from "../../shared/address/add-new-address";
import Modal from "@/components/shared/modal/page";
import AddressDetails from "../../shared/address/address-details";
import errIcon from "@/public/images/shop/error-red.svg";
import Header from "@/components/shared/header/page";
import bgImage from "@/public/images/bg-header.png";
const Addresses = () => {
  const _token = useSelector((state: RootState) => state.token.token);

  const [addresses, setAddresses] = useState<any>([]);
  const [locationData, setLocationData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addressDetailsModal, setAddressDetailsModal] = useState(false);
  const [reloading, setReloading] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    setReloading(false);
    const _addresses = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/clients/addresses`,
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
          setAddresses(data?.data);
          break;

        default:
          break;
      }
    };

    if (_token) {
      _addresses();
    }
  }, [
    _token,
    setAddresses,
    isModalOpen,
    setIsModalOpen,
    addressDetailsModal,
    setAddressDetailsModal,
    reloading,
    setReloading,
  ]);

  return (
    <div>
      <Header title="آدرس‌های من" text="" image={bgImage} />
      <div className="w-[80%] mx-auto pb-20">
        <div className="w-full mx-auto flex flex-row-reverse justify-between space-x-4 space-x-reverse my-20">
          <div
            className="my-auto text-[#221D23] text-2xl font-semibold
              screen1440:text-xl
              screen750:text-lg
              screen450:text-[17px]
              screen400:text-base"
          >
            آدرس‌های من
          </div>
          <hr className="flex flex-grow mx-auto my-auto" />
          <div className="bg-gradient-to-r from-[#A60014] to-[#600B0E] cursor-pointer rounded-[50px] my-auto flex flex-row-reverse  space-x-2 space-x-reverse py-3 px-6">
            <Image src={addIcon} width={25} height={25} alt="add" />
            <span onClick={() => setIsModalOpen(true)} className="text-white">
              افزودن آدرس جدید
            </span>
          </div>
        </div>

        {isModalOpen && (
          <Modal isOpen={true} onClose={closeModal}>
            <div
              onClick={() => setIsModalOpen(false)}
              className="w-screen h-screen top-0 left-0 fixed bg-black  bg-opacity-20 backdrop-blur-[2px] "
            />
            <AddNewAddress
              locationData={locationData}
              setLocationData={setLocationData}
              setNewAddressModal={setIsModalOpen}
              setAddressDetailsModal={setAddressDetailsModal}
            />
          </Modal>
        )}

        {addressDetailsModal && (
          <div>
            <div
              onClick={() => setAddressDetailsModal(false)}
              className="fixed inset-0 flex items-center justify-center z-20 bg-black backdrop-blur-[2px]  bg-opacity-50 overflow-hidden"
            />
            <AddressDetails
              locationData={locationData}
              setAddressDetailsModal={setAddressDetailsModal}
            />
          </div>
        )}
        {addresses?.length === 0 ? (
          <div className=" w-fit mx-auto  pt-10 pb-12 my-24 screen1000:my-8">
            <div className="w-fit mx-auto mb-4">
              <Image
                width={6}
                height={6}
                alt=""
                src={errIcon}
                className="w-24 h-24 screen1000:w-20 screen1000:h-20"
              />
            </div>
            <div
              style={{ direction: "rtl" }}
              className="text-[#6D6F72] text-2xl text-center screen1000:text-lg"
            >
              آدرسی در حساب شما ثبت نشده! لطفاً یک آدرس جدید اضافه کنید.
            </div>
          </div>
        ) : (
          addresses?.map((address: any) => {
            return (
              <Details
                key={address?.id}
                address={address}
                setAddresses={setAddresses}
                setReloading={setReloading}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Addresses;
