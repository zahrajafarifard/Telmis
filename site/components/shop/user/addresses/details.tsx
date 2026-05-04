import React, { useState } from "react";
import Image from "next/image";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

import Modal from "@/components/shared/modal/page";
import editIcon from "@/public/images/shop/edit.svg";
import deleteIcon from "@/public/images/shop/trash-02.svg";
import infoIcon from "@/public/images/shop/Info.svg";
import EditAddress from "../../shared/address/edit-address";

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

const Details: React.FC<any> = ({ address, setAddresses, setReloading }) => {
  const _token = useSelector((state: RootState) => state.token.token);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const deleteAddressHandler = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/clients/address/${address.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + _token,
        },
      }
    );

    switch (response.status) {
      case 200:
        setAddresses((prev: any) => {
          return prev.filter((item: any) => item.id !== address?.id);
        });
        break;

      default:
        break;
    }
  };

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
    <div className="border border-[#d9d9d9] rounded-[8px] py-7 px-8 my-6 flex flex-row-reverse justify-between w-full mx-auto">
      <div className="my-auto w-[85%] mx-auto">
        <div className="text-right text-[#221D23] text-lg">
          {address?.addressName}
        </div>
        <div
          style={{ direction: "rtl" }}
          className="text-right text-[#919191] line-clamp-1 hover:line-clamp-none"
        >
          {address?.address}، پلاک {address?.buildingNumber}، واحد
          {address?.unit}، کد پستی {address?.postalCode}
        </div>
      </div>

      <div className="flex flex-row space-x-4 my-auto w-[15%] mx-auto">
        <Image
          onClick={() => {
            fetchAddressToEdit(address?.id);
          }}
          src={editIcon}
          width={29}
          height={29}
          alt="edit"
        />
        <Image
          onClick={() => setIsModalOpen(true)}
          src={deleteIcon}
          width={29}
          height={29}
          alt="delete"
        />
      </div>

      {isModalOpen && (
        <Modal isOpen={true} onClose={closeModal}>
          <div className="w-[80%] mx-auto">
            <Image
              src={infoIcon}
              width={84}
              height={84}
              alt="ایکن عملیات موفق"
              className="mx-auto screen1250:w-16 screen1250:h-16"
            />
            <div
              style={{ direction: "rtl" }}
              className="text-white text-center  mt-3 mb-6 text-xl px-4 screen850:text-base screen620:text-sm "
            >
              آیا از حذف این آدرس اطمینان دارید؟
            </div>
            <div className="flex flex-row-reverse w-full mx-auto space-x-2 space-x-reverse">
              <div
                onClick={() => {
                  closeModal();
                  deleteAddressHandler();
                }}
                className="bg-[#FFDA8A] text-[#221D23]  text-center w-1/2 px-3 py-1 mx-auto  rounded-[50px] text-lg cursor-pointer screen850:text-base screen620:text-sm "
              >
                حذف آدرس
              </div>
              <div
                onClick={() => {
                  closeModal();
                }}
                className="bg-[#FFF] text-[#6D6F72] text-center w-1/2 px-3 py-1 mx-auto  rounded-[50px] text-lg cursor-pointer screen850:text-base screen620:text-sm "
              >
                لغو
              </div>
            </div>
          </div>
        </Modal>
      )}

      {editModalOpen && addressToEdit && (
        <div>
          <div
            onClick={() => setEditModalOpen(false)}
            className="fixed inset-0 flex items-center justify-center z-20 bg-black backdrop-blur-[2px] bg-opacity-50 overflow-hidden"
          />
          <EditAddress
            setEditModalOpen={setEditModalOpen}
            addressToEdit={addressToEdit}
            setReloading={setReloading}
            setAddressToEdit={setAddressToEdit}
          />
        </div>
      )}
    </div>
  );
};

export default Details;
