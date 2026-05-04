import React, { useState, useEffect } from "react";
// import Image from "next/image";

import Sort from "../shared/sort";
// import prevIcon from "@/public/images/prev.svg";
// import nextIcon from "@/public/images/next.svg";
import ProductDetails from "../main-page/product-details";

interface ProductsType {
  id: number;
  mainImage: string;
  mainTitle: string;
  price: string;
  createdAt: string;
  bestSelling?: number;
}

interface PropsType {
  items: ProductsType[];
  searchValue: string;
}

const SearchItems: React.FC<PropsType> = ({ items, searchValue }) => {
  const [selectedSort, setSelectedSort] = useState<number>(0);
  const [productsPerCategory, setProductsPerCategory] =
    useState<ProductsType[]>(items);

  useEffect(() => {
    const sortedProducts = [...items];

    if (selectedSort === 2) {
      sortedProducts.sort(
        (a: ProductsType, b: ProductsType) => b.bestSelling! - a.bestSelling!
      );
    } else if (selectedSort === 1) {
      sortedProducts.sort(
        (a: ProductsType, b: ProductsType) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    setProductsPerCategory(sortedProducts);
  }, [selectedSort, setProductsPerCategory]);

  return (
    <div className="w-[80%] mx-auto screen750:w-[90%] mb-16">
      <div className="my-16 text-right w-full">
        <span className="text-[#A60014] text-lg">نتایج جست وجو/</span>
        <span className="text-[#919191] text-lg">فروشگاه/</span>
        <span className="text-[#919191] text-lg">خانه</span>
      </div>
      <div className="flex flex-row-reverse justify-between space-x-4 space-x-reverse screen1250:space-x-3 screen1250:space-x-reverse">
        <div className="flex flex-row-reverse my-auto">
          <div
            style={{ direction: "rtl" }}
            className="text-[#221D23] text-2xl font-semibold ml-2 screen1250:text-xl screen750:text-lg screen400:text-base screen400:ml-1"
          >
            {items?.length} نتیجه برای {searchValue}
          </div>
        </div>
        <hr className="flex flex-grow border my-auto" />
        <div className="flex flex-row-reverse my-auto">
          <Sort selectedSort={selectedSort} setSelectedSort={setSelectedSort} />
        </div>
      </div>

      <div
        style={{ direction: "rtl" }}
        className="grid grid-cols-5 gap-6 my-20 screen1250:gap-4 
        screen890:grid-cols-2 screen630:grid-cols-1 screen750:my-10"
      >
        {productsPerCategory?.map((item: any) => (
          <div key={item.id}>
            <ProductDetails item={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchItems;
