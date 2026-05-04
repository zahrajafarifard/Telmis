"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
// import SimilarProductDetails from "./similar-product-details";
import SimilarProductDetails from "../main-page/product-details";

import errIcon from "@/public/images/shop/error-red.svg";

interface ProductType {
  id: number;
  mainImage: string;
  mainTitle: string;
  subTitle: string;
  price: number;
  discount: number;
  count: number;
}
interface PropsType {
  categoryId: number;
  productId: number;
}

const SimilarProducts: React.FC<PropsType> = ({ categoryId, productId }) => {
  const [similarProducts, setSimilarProducts] = useState<ProductType[]>([]);

  useEffect(() => {
    const _products = async () => {
      const _response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/relatedProducts/${categoryId}/${productId}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      switch (_response.status) {
        case 200:
          const _data = await _response.json();

          setSimilarProducts(_data?.data);

          break;

        default:
          break;
      }
    };

    _products();
  }, []);

  return (
    <div>
      <div className="w-full mx-auto flex flex-row-reverse space-x-4 space-x-reverse justify-between  screen750:my-16">
        <div style={{ direction: "rtl" }} className="flex flex-row">
          <div className="my-auto text-[#221D23] font-semibold text-2xl screen1250:text-xl screen750:text-base">
            محصولات مشابه
          </div>
        </div>
        <hr className="flex flex-grow mx-auto my-auto" />
      </div>

      {similarProducts?.length === 0 ? (
        <div className=" w-fit mx-auto  pt-10 pb-12 my-40 screen1000:my-8">
          <div className="w-fit mx-auto mb-4">
            <Image
              width={6}
              height={6}
              alt="ایکن هشدار"
              src={errIcon}
              className="w-24 h-24 screen1000:w-20 screen1000:h-20"
            />
          </div>
          <div
            style={{ direction: "rtl" }}
            className="text-[#6D6F72] text-2xl text-center screen1000:text-lg "
          >
            هیچ محصولی وجود ندارد .
          </div>
        </div>
      ) : (
        <div
          style={{ direction: "rtl" }}
          className="grid grid-cols-5  gap-7  mt-28 mb-24"
        >
          {similarProducts?.map((item) => {
            return <SimilarProductDetails key={item.id} item={item} />;
          })}
        </div>
      )}
    </div>
  );
};

export default SimilarProducts;
