import React from "react";
import Image from "next/image";

interface ProductDetailsType {
  id: number;
  mainImage: string;
  mainTitle: string;
  price: number;
  discount: number;
}
interface Props {
  item: ProductDetailsType;
  showBorder: boolean;
}

const ProductDetails: React.FC<Props> = ({ item, showBorder }) => {
  return (
    <div
      className={`mt-20 screen750:w-[235px] screen750:mt-10  ${
        !showBorder && "border-l border-[#DFDFDF]"
      }`}
    >
      <div className="relative h-40 screen1200:h-28 screen850:h-20">
        <Image
          src={`${
            process.env.NEXT_PUBLIC_API_URL
          }/uploads/product/${item?.mainImage
            ?.replace(/\\/g, "/")
            ?.split("/")
            ?.pop()}`}
          fill
          alt="عکس محصول"
          className="object-contain"
        />
      </div>

      <div className="text-[#221D23] font-semibold text-center mt-8 px-3 overflow-hidden text-ellipsis whitespace-nowrap">
        {item?.mainTitle}
      </div>

      <p className="text-[#27AF37]  text-center mt-4 ">
        <span>{Number(item?.price - item?.discount).toLocaleString()}</span>
        <span className="text-[9px] my-auto mr-0.5">تومان</span>
      </p>
      {item?.discount ? (
        <p className="text-[#8B8B8B] text-opacity-40 line-through text-center mt-1">
          <span>{Number(item?.price).toLocaleString()}</span>
          <span className="text-[9px] my-auto mr-0.5">تومان</span>
        </p>
      ) : (
        <div className="text-[#8B8B8B] text-opacity-40 text-center mt-1 text-sm">
          بدون تخفیف
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
