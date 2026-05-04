"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { clearResponse, updatePriceAndDiscount } from "@/store/slices/cart";

import errIcon from "@/public/images/shop/error-red.svg";
import OTPModal from "../login/OTP";
import AuthModal from "../login/auth";
import Summary from "./summary";
import CartItems from "./cartItems";
import "@/components/shop/shared/style.css";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  discount: number;
  count: number;
}
const Cart = () => {
  const dispatch = useDispatch();
  const cart: CartItem[] = useSelector((state: RootState) => state.cart.items);

  const _token = useSelector((state: RootState) => state.token.token);

  const {
    register,
    setValue,
    getValues,
    formState: { errors, isValid, isDirty },
  } = useForm<{ mobile: string; name: string; password: string }>({
    mode: "all",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOTPModalOpen, setIsOTPModalOpen] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
    dispatch(clearResponse());
  };

  useEffect(() => {
    return () => {
      dispatch(clearResponse());
    };
  }, []);

  const [discountCode, setDiscountCode] = useState<string>("");

  const ids: number[] = cart?.map((item) => item.id);
  const totalPrice: number = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalDiscount: number = cart.reduce(
    (total, item) => total + item.discount * item.quantity,
    0
  );

  const fetchProductPricesAndDiscounts = async (ids: number[]) => {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/products/updateProductPrices/${ids.join(",")}`
    );
    const data = await response.json();

    return data?.data;
  };

  useEffect(() => {
    if (ids?.length > 0) {
      fetchProductPricesAndDiscounts(ids).then((products) => {
        products.forEach((product: CartItem) => {
          dispatch(
            updatePriceAndDiscount({
              id: product.id,
              price: product.price,
              discount: product.discount,
            })
          );
        });
      });
    }
  }, [cart, dispatch]);

  const applyDiscountCode = async () => {
    console.log("decrease the total price after applying the discount code");
  };

  return (
    <div>
      {cart?.length === 0 ? (
        <div className=" w-fit mx-auto  pt-10 pb-12 my-24 screen1000:my-8">
          <div className="w-fit mx-auto mb-4">
            <Image
              width={6}
              height={6}
              alt="ایکن هشدار"
              src={errIcon}
              className="w-24 h-24 screen1000:w-20 screen1000:h-20 "
            />
          </div>
          <div
            style={{ direction: "rtl" }}
            className="text-[#6D6F72] text-2xl text-center screen1000:text-lg"
          >
            سبد خرید شما خالی است.
          </div>
        </div>
      ) : (
        <div className="flex flex-row-reverse w-[80%] mx-auto space-x-3 space-x-reverse screen1250:w-[90%] screen820:flex-col screen820:my-20">
          <div className="w-[70%] shadow-[0px_4px_14px_0px_rgba(0,0,0,0.15)] rounded-[8px] my-20 py-6 screen1050:w-[65%] screen1000:w-[60%] screen820:my-0 screen820:w-full">
            <div className=" border-b border-b-[#E3E3E3] py-2 w-[90%] mx-auto screen1050:hidden">
              <div style={{ direction: "rtl" }} className="grid grid-cols-5">
                <div className="text-[#2B2B2B] text-center">عنوان محصول</div>
                <div></div>
                <div className="text-[#2B2B2B] text-center">قیمت </div>
                <div className="text-[#2B2B2B] text-center">تعداد </div>
                <div className="text-[#2B2B2B] text-center">قیمت نهایی </div>
              </div>
            </div>

            {cart?.map((item) => {
              return <CartItems item={item} key={item?.id} />;
            })}

            <div className="w-[90%] mx-auto flex flex-row-reverse space-x-3 space-x-reverse border-t border-t-[#E3E3E3] pt-6 screen1000:hidden">
              <div className="rounded-e-[4px] rounded-s-[50px] flex flex-row-reverse space-x-6 space-x-reverse flex-grow">
                <input
                  dir="rtl"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="کد تخفیف خود را وارد کنید"
                  className="bg-[#F7F7F7] text-[#919191] outline-none w-[75%] px-6 "
                />

                <div
                  onClick={applyDiscountCode}
                  className="buttonYellow cursor-pointer group w-[25%] mr-auto  py-3 text-lg text-center screen1250:text-base"
                >
                  <span className="button-hover-effect"></span>
                  <p className="button-hover-effect-text group-hover:text-white">
                    اعمال کد تخفیف
                  </p>
                </div>
              </div>
            </div>

            <div className="w-[90%] mx-auto  flex-col space-x-3 space-x-reverse border-t border-t-[#E3E3E3] pt-6 screen1000:flex hidden">
              <input
                dir="rtl"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                placeholder="کد تخفیف خود را وارد کنید"
                className="bg-[#F7F7F7] text-[#919191] outline-none w-full px-6 py-3"
              />
              <div className="flex flex-row-reverse space-x-4 space-x-reverse mt-4 w-full">
                <div
                  onClick={applyDiscountCode}
                  className="buttonYellow cursor-pointer group w-[25%] mr-auto  py-3 text-lg text-center screen1250:text-base"
                >
                  <span className="button-hover-effect"></span>
                  <p className="button-hover-effect-text group-hover:text-white">
                    اعمال کد تخفیف
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Summary
            totalDiscount={totalDiscount}
            totalPrice={totalPrice}
            token={_token}
            setIsModalOpen={setIsModalOpen}
          />
        </div>
      )}

      {isModalOpen && (
        <AuthModal
          isOpen={isModalOpen}
          onClose={closeModal}
          register={register}
          isDirty={isDirty}
          isValid={isValid}
          getValues={getValues}
          setIsOTPModalOpen={setIsOTPModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}

      {isOTPModalOpen && (
        <OTPModal
          isOpen={isOTPModalOpen}
          onClose={() => setIsOTPModalOpen(false)}
          register={register}
          isDirty={isDirty}
          isValid={isValid}
          getValues={getValues}
        />
      )}
    </div>
  );
};

export default Cart;
