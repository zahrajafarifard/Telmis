"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";

import { clearCart } from "@/store/slices/cart";

import CardItem from "./CardItem";
import searchIcon from "@/public/images/shop/package_search.svg";
import warningIcon from "@/public/images/shop/error.svg";
import carIcon from "@/public/images/shop/package_car.svg";
import arrowIcon from "@/public/images/shop/Arrow_left.svg";
import ChooseAddress from "../shared/address/choose-address";
import AddNewAddress from "../shared/address/add-new-address";
import AddressDetails from "../shared/address/address-details";
import Delivery from "./delivery/page";
import "@/components/shop/shared/style.css";

interface addressesType {
  id: number;
  address: string;
  postalCode: string;
  addressName: string;
  buildingNumber: string;
  unit: string;
  city: string;
  province: string;
  neighbourhood: string;
}

const CheckOut: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const _token = useSelector((state: RootState) => state.token.token);

  const cart = useSelector((state: RootState) => state.cart.items);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalDiscount = cart.reduce(
    (total, item) => total + item.discount * item.quantity,
    0
  );

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null
  );
  const [addresses, setAddresses] = useState<addressesType[]>([]);

  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<addressesType>();
  const [newAddressModal, setNewAddressModal] = useState(false);
  const [addressDetailsModal, setAddressDetailsModal] = useState(false);
  const [chooseAddressModal, setChooseAddressModal] = useState(false);
  const [locationData, setLocationData] = useState<any>(null);

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [reloading, setReloading] = useState<boolean>(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (showAlert) {
      const timer = setTimeout(() => {
        setShowAlert(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showAlert]);

  useEffect(() => {
    if (selectedSlot) {
      setShowAlert(false);
    }
  }, [setShowAlert, selectedSlot]);

  useEffect(() => {
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
          setReloading(false);

          const data = await response.json();

          setSelectedAddress(data?.data[0]);
          setSelectedAddressId(data?.data[0]?.id);
          setAddresses(data?.data);
          break;

        default:
          break;
      }
    };

    if (_token) {
      _addresses();
    }
  }, [_token, setSelectedAddress, reloading]);

  useEffect(() => {
    if (selectedAddressId) {
      setSelectedAddress(
        addresses?.find((item) => item.id === selectedAddressId)
      );
    }
  }, [selectedAddressId]);

  const handleCardClick = (index: number) => {
    setSelectedCard(index);
  };

  const registerOrderHandler = async () => {
    const filteredItems = cart?.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      options: item?.options,
    }));

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/factor/order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + _token,
        },
        body: JSON.stringify({
          address: selectedAddress?.id,
          slot: selectedSlot,
          cart: filteredItems,
        }),
      }
    );

    switch (response.status) {
      case 201:
        const data = await response.json();

        router.push(
          `/shop/orders/?factorId=${data?.factorId}&code=${data?.trackingCode}`
        );
        dispatch(clearCart());

        break;

      case 400:
        alert("all fields are required");
        break;
      case 401:
        break;
      case 403:
        alert("product doesnt exist anymore");
        //return product id from server and delete it from cart

        break;
      case 408:
        alert("time sltot is not available");
        break;
      case 409:
        alert("count === 0");
        //return product id from server and delete it from cart

        break;

      default:
        break;
    }
  };

  return (
    <div className="relative">
      {showAlert && (
        <div
          className="bg-[#FFF099] flex flex-row text-[#D76B00] py-4 px-20 rounded-e-[2px] rounded-s-[8px] absolute 
          -top-20 right-[10%] z-20 screen1200:right-[5%]
          screen1000:fixed
          screen1000:top-32
          screen1000:right-0  "
        >
          <div className="my-auto mr-2 ">
            لطفا بازه زمانی تحویل سفارش را انتخاب کنید
          </div>
          <Image
            src={warningIcon}
            width={26}
            height={26}
            alt="warning icon"
            className=" my-auto"
          />
        </div>
      )}
      <div className="w-[80%] mx-auto mt-28 flex flex-row-reverse space-x-6 space-x-reverse screen1200:w-[90%] ">
        <div className="w-[70%] screen1200:w-[65%] screen1000:w-full">
          <CardItem
            icon={carIcon}
            title="ارسال به آدرس انتخاب شده"
            action={{ text: "انتخاب آدرس", icon: arrowIcon }}
            selected={selectedCard === 0 || selectedCard === null}
            address={
              selectedAddress
                ? `${selectedAddress?.address}، پلاک ${selectedAddress?.buildingNumber}، واحد ${selectedAddress?.unit}، کد پستی ${selectedAddress?.postalCode}`
                : ""
            }
            onClick={() => handleCardClick(0)}
            setChooseAddressModal={setChooseAddressModal}
          />

          <div className="pointer-events-none cursor-not-allowed">
            <CardItem
              icon={searchIcon}
              title="دریافت حضوری از تلمیس"
              address="تهران، میرداماد، شمس تبریزی شمالی، ک.نیک رای، پلاک3 واحد2"
              selected={selectedCard === 1}
              onClick={() => handleCardClick(1)}
            />
          </div>
        </div>

        <div
          className="w-[30%] shadow-[0px_4px_14px_0px_rgba(0,0,0,0.15)] rounded-[8px] p-8 h-fit screen1200:w-[35%]
        screen1000:hidden
        "
        >
          <div className="flex flex-row-reverse justify-between w-[100%] mx-auto ">
            <span className="text-[#858585] text-sm ">قیمت کل</span>
            <span style={{ direction: "rtl" }} className="text-sm">
              {Number(totalPrice).toLocaleString()} تومان
            </span>
          </div>
          <div className="flex flex-row-reverse justify-between w-[100%] mx-auto my-4 ">
            <span
              style={{ direction: "rtl" }}
              className="text-[#858585] text-sm "
            >
              تخفیف اعمال شده
            </span>
            <span style={{ direction: "rtl" }} className="text-sm">
              {Number(totalDiscount).toLocaleString()} تومان
            </span>
          </div>
          <div className="flex flex-row-reverse justify-between w-[100%] mx-auto mb-4 ">
            <span className="text-[#858585] text-sm ">هزینه ارسال </span>
            <span style={{ direction: "rtl" }} className="text-sm">
              {Number(shippingCost)
                ? Number(shippingCost).toLocaleString() + "تومان"
                : "تعیین نشده"}
            </span>
          </div>
          <div className="flex flex-row-reverse justify-between w-[100%] mx-auto border-t  py-5">
            <span className="text-[#858585] text-sm ">مبلغ قابل پرداخت </span>
            <span style={{ direction: "rtl" }} className="text-sm">
              {shippingCost
                ? Number(
                    totalPrice - totalDiscount + shippingCost!
                  ).toLocaleString() + "تومان"
                : "تعیین نشده"}
            </span>
          </div>

          <div
            onClick={() => {
              if (!selectedSlot) {
                return setShowAlert(true);
              }
              registerOrderHandler();
            }}
            className={`button  py-3  w-full text-lg text-center
               ${
                 !selectedSlot || !selectedAddress?.id
                   ? "cursor-not-allowed"
                   : "cursor-pointer"
               }
              `}
          >
            <span className="button-hover-effect"></span>
            <p className="button-hover-effect-text ">
              {!selectedAddress?.id
                ? "انتخاب ادرس و زمان تحویل"
                : selectedSlot
                ? " ثبت سفارش"
                : "انتخاب زمان ارسال"}
            </p>
          </div>
        </div>
      </div>

      {chooseAddressModal && (
        <div>
          <div
            onClick={() => setChooseAddressModal(false)}
            className="fixed inset-0 flex items-center justify-center z-20 backdrop-blur-[2px]  bg-black bg-opacity-50 overflow-hidden"
          />

          <ChooseAddress
            setNewAddressModal={setNewAddressModal}
            setChooseAddressModal={setChooseAddressModal}
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            setSelectedAddressId={setSelectedAddressId}
            setReloading={setReloading}
          />
        </div>
      )}

      {newAddressModal && (
        <div>
          <div
            onClick={() => setNewAddressModal(false)}
            className="fixed inset-0 flex items-center justify-center z-20 bg-black backdrop-blur-[2px]  bg-opacity-50 overflow-hidden"
          />
          <AddNewAddress
            locationData={locationData}
            setLocationData={setLocationData}
            setNewAddressModal={setNewAddressModal}
            setAddressDetailsModal={setAddressDetailsModal}
          />
        </div>
      )}

      {addressDetailsModal && (
        <div>
          <div
            onClick={() => setAddressDetailsModal(false)}
            className="fixed inset-0 flex items-center justify-center z-20 backdrop-blur-[2px]  bg-black bg-opacity-50 overflow-hidden"
          />
          <AddressDetails
            locationData={locationData}
            setNewAddressModal={setNewAddressModal}
            setAddressDetailsModal={setAddressDetailsModal}
            setSelectedAddress={setSelectedAddress}
            setReloading={setReloading}
          />
        </div>
      )}

      <Delivery
        selectedSlot={selectedSlot}
        setSelectedSlot={setSelectedSlot}
        setShippingCost={setShippingCost}
      />

      <div className=" hidden screen1000:flex flex-col w-[90%] mx-auto shadow-[0px_4px_14px_0px_rgba(0,0,0,0.15)] rounded-[8px] p-8 mb-20">
        <div className="flex flex-row-reverse justify-between w-[100%] mx-auto ">
          <span className="text-[#858585] text-sm ">قیمت کل</span>
          <span style={{ direction: "rtl" }} className="text-sm">
            {Number(totalPrice).toLocaleString()} تومان
          </span>
        </div>
        <div className="flex flex-row-reverse justify-between w-[100%] mx-auto my-4 ">
          <span
            style={{ direction: "rtl" }}
            className="text-[#858585] text-sm "
          >
            تخفیف اعمال شده
          </span>
          <span style={{ direction: "rtl" }} className="text-sm">
            {Number(totalDiscount).toLocaleString()} تومان
          </span>
        </div>
        <div className="flex flex-row-reverse justify-between w-[100%] mx-auto mb-4 ">
          <span className="text-[#858585] text-sm ">هزینه ارسال </span>
          <span style={{ direction: "rtl" }} className="text-sm">
            {Number(shippingCost).toLocaleString()} تومان
          </span>
        </div>
        <div className="flex flex-row-reverse justify-between w-[100%] mx-auto border-t  py-5">
          <span className="text-[#858585] text-sm ">مبلغ قابل پرداخت </span>
          <span style={{ direction: "rtl" }} className="text-sm">
            {Number(
              totalPrice - totalDiscount + shippingCost!
            )?.toLocaleString()}
            تومان
          </span>
        </div>

        <div
          onClick={() => {
            if (!selectedSlot) {
              return setShowAlert(true);
            }
            registerOrderHandler();
          }}
          className={`button px-3 w-[90%] mx-auto py-3 text-lg text-center screen770:text-base
               ${
                 !selectedSlot || !selectedAddress?.id
                   ? "cursor-not-allowed"
                   : "cursor-pointer"
               }
              `}
        >
          <span className="button-hover-effect"></span>
          <p className="button-hover-effect-text ">
            {!selectedAddress?.id
              ? "انتخاب ادرس و زمان تحویل"
              : selectedSlot
              ? " ثبت سفارش"
              : "انتخاب زمان ارسال"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;
