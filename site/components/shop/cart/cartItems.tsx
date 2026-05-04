import React from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";

import {
  removeFromCart,
  addToCart,
  decreaseQuantity,
} from "@/store/slices/cart";

import removeIcon from "@/public/images/shop/close.svg";
import incIcon from "@/public/images/shop/Add.svg";
import deactiveIncIcon from "@/public/images/shop/Add_light.svg";
import decIcon from "@/public/images/shop/Remove.svg";

const CartItems: React.FC<any> = ({ item }) => {
  const dispatch = useDispatch();

  const handleRemoveFromCart = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handleAddFromCart = (
    id: number,
    name: string,
    price: number,
    quantity: number,
    image: string,
    discount: number,
    count: number,
    options: { key: string; value: string }[]
  ) => {
    dispatch(
      addToCart({ id, name, price, quantity, image, discount, count, options })
    );
  };

  const handleDecreaseQuantityFromCart = (id: number) => {
    dispatch(decreaseQuantity(id));
  };
  return (
    <div key={item?.id}>
      <div
        style={{ direction: "rtl" }}
        className="grid grid-cols-5 py-3 my-2 w-[90%] mx-auto screen1050:hidden"
      >
        <div className="flex flex-row col-span-2">
          <div
            onClick={() => handleRemoveFromCart(item?.id)}
            className="my-auto cursor-pointer"
          >
            <Image src={removeIcon} width={20} height={20} alt="ایکن حذف" />
          </div>
          <div className="border border-[#E3E3E3] rounded-[2px] py-2 px-4 mx-3 flex justify-center ">
            <Image
              src={`${
                process.env.NEXT_PUBLIC_API_URL
              }/uploads/product/${item?.image
                ?.replace(/\\/g, "/")
                ?.split("/")
                ?.pop()}`}
              alt="عکس محصول"
              className="object-contain"
              width={40}
              height={40}
            />
          </div>
          <p className="text-right my-auto">{item?.name}</p>
        </div>

        <p className="text-center my-auto col-start-3 text-[#858585] text-sm">
          <span>{Number(item?.price).toLocaleString()}</span>
          <span>تومان</span>
        </p>
        <p className="text-center my-auto flex flex-row justify-between border border-[#DEDEDE] rounded-[2px] py-4 px-5">
          <Image
            onClick={() => handleDecreaseQuantityFromCart(item.id)}
            src={decIcon}
            width={20}
            height={20}
            alt="ایکن حذف محصول"
          />
          {item?.quantity}
          <Image
            onClick={() =>
              handleAddFromCart(
                item.id,
                item.name,
                item.price,
                1,
                item.image,
                item.discount,
                item?.count,
                item?.options
              )
            }
            src={item?.quantity == item?.count ? deactiveIncIcon : incIcon}
            width={20}
            height={20}
            alt="ایکن افزودن محصول"
            // className={`${
            //   item?.quantity == item?.count && "cursor-not-allowed"
            // }`}
          />
        </p>
        <p className="text-center my-auto  text-[#858585] text-sm">
          <span>{Number(item?.price - item?.discount).toLocaleString()}</span>
          <span>تومان</span>
        </p>
      </div>
      <div
        style={{ direction: "rtl" }}
        className="screen1050:flex hidden flex-row py-3 my-2 w-[90%] mx-auto"
      >
        <div className="flex flex-row ">
          <div
            onClick={() => handleRemoveFromCart(item?.id)}
            className="my-auto cursor-pointer"
          >
            <Image src={removeIcon} width={20} height={20} alt="ایکن حذف" />
          </div>
          <div className="border border-[#E3E3E3] rounded-[2px] py-2 h-full flex justify-center items-center px-4 mx-3 my-auto">
            <Image
              src={`${
                process.env.NEXT_PUBLIC_API_URL
              }/uploads/product/${item?.image
                ?.replace(/\\/g, "/")
                ?.split("/")
                ?.pop()}`}
              alt="عکس محصول"
              className="object-contain my-auto"
              width={40}
              height={80}
            />
          </div>
        </div>
        <div className=" w-1/2 ">
          <p className="text-right my-auto ">{item?.name}</p>

          <p className="text-right my-auto py-2 text-[#858585] text-sm">
            <span>{Number(item?.price).toLocaleString()}</span>
            <span>تومان</span>
          </p>
          <p className="w-2/3 text-center my-auto flex flex-row justify-around border border-[#DEDEDE] rounded-[2px] py-3 ">
            <Image
              onClick={() => handleDecreaseQuantityFromCart(item.id)}
              src={decIcon}
              width={20}
              height={20}
              alt="ایکن حذف محصول"
            />
            {item?.quantity}
            <Image
              onClick={() =>
                handleAddFromCart(
                  item.id,
                  item.name,
                  item.price,
                  1,
                  item.image,
                  item.discount,
                  item?.count,
                  item?.options
                )
              }
              src={item?.quantity == item?.count ? deactiveIncIcon : incIcon}
              width={20}
              height={20}
              alt="ایکن افزودن محصول"
              // className={`${
              //   item?.quantity == item?.count && "cursor-not-allowed"
              // }`}
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
