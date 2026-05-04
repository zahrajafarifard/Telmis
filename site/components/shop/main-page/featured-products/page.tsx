import React from "react";

import img1 from "@/public/images/shop/1.svg";
import img2 from "@/public/images/shop/2.svg";
import Details from "./details";

const items: {
  id: number;
  title: string;
  text1: string;
  text2: string;
  img: string;
}[] = [
  {
    id: 1,
    title: "دوربین های امنیتی و نظارتی",
    text1: "پرفروش های با رضایت بالا",
    text2: "انواع دوربین های مداربسته",
    img: img1.src,
  },
  {
    id: 2,
    title: "لپ تاپ و الترابوک",
    text1: "پرفروش های با رضایت بالا",
    text2: "انواع لپ تاپ و الترابوک",
    img: img2.src,
  },
];
const FeaturedProducts = () => {
  return (
    <div className="my-24 w-[80%] mx-auto grid grid-cols-2 gap-8 ">
      {items?.map((item) => {
        return <Details key={item.id} item={item} />;
      })}
    </div>
  );
};

export default FeaturedProducts;
