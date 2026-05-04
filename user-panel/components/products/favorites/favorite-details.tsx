"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";

import { RootState } from "@/store/store";
import FavoritesIcon from "@/public/images/Favorite.svg";

interface ProductType {
  id: number;
  mainImage: string;
  mainTitle: string;
  model?: string;
  price: number;
  discount: number;
  count: number;
  Product: {
    mainImage: string;
    mainTitle: string;
    price: string;
    model: string;
  };
}

interface PropsType {
  item: ProductType;
  setProducts: React.Dispatch<React.SetStateAction<ProductType[]>>;
}
const FavoritesDetails: React.FC<PropsType> = ({ item, setProducts }) => {
  const _token = useSelector((state: RootState) => state.client.token);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  const removeFavorite = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/favorites`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + _token,
        },
        body: JSON.stringify({
          productId: item?.id,
        }),
      }
    );

    switch (response.status) {
      case 200:
        setProducts((prev) => {
          if (item && item.id) {
            return prev.filter((i) => i.id !== item.id);
          }
          return prev;
        });
        break;

      default:
        break;
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="hover:bg-[#F7F7F7] pt-12 pb-6 rounded-[8px] relative"
    >
      {isHovered && (
        <div
          onClick={() => {
            removeFavorite();
          }}
          className="absolute top-5 right-5 cursor-pointer"
        >
          <div className="bg-[#A60014] rounded-full w-11 h-11 flex justify-center">
            <Image src={FavoritesIcon} width={32} height={32} alt="" />
          </div>
        </div>
      )}

      <div className="relative h-40">
        <Image
          src={`${
            process.env.NEXT_PUBLIC_API_URL
          }/uploads/product/${item?.Product?.mainImage?.split(/[\/\\]/)?.pop()}`}
          fill
          alt=""
          className="object-contain"
        />
      </div>
      <p className="text-center text-[#221D23] text-xl font-semibold mt-7">
        {item?.Product?.mainTitle}
      </p>
      <p className="text-center text-[#999] my-3">{item?.Product?.model}</p>
      <p className="text-center text-[#26AA2B]">
        <span>{Number(item?.Product?.price).toLocaleString()}</span>
        <span className="text-[8px]">تومان</span>
      </p>
    </div>
  );
};

export default FavoritesDetails;
