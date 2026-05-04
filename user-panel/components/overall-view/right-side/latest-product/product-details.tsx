import React from "react";
import Image from "next/image";

interface PropsType {
  item: {
    id: number;
    mainImage: string;
    mainTitle: string;
    price: number;
    discount: number;
    count: number;
  };
}
const ProductDetails: React.FC<PropsType> = ({ item }) => {
  return (
    <div className=" pt-12 pb-6 rounded-[8px] relative">
      <div className="relative h-40">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/product/${item?.mainImage
            ?.split(/[\/\\]/)
            ?.pop()}`}
          fill
          alt=""
          className="object-contain"
        />
      </div>
      <p className="text-center text-[#221D23] font-semibold mt-8 mb-4 ">
        {item.mainTitle}
      </p>

      <p className="text-center text-[#26AA2B]">
        <span>{Number(item.price).toLocaleString()}</span>
        <span className="text-[9px] ms-1">تومان</span>
      </p>
    </div>
  );
};

export default ProductDetails;
