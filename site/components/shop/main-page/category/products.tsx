import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Details from "../product-details";
import "@/components/shop/shared/style.css";
import errIcon from "@/public/images/shop/error-red.svg";

const Products = () => {
  const [selected, setSelected] = useState(0);
  const [products, setProducts] = useState<any>([]);

  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const sortedProducts = useMemo(() => {
    let sorted = [...products];

    if (selected === 2) {
      sorted.sort((a, b) => b.bestSelling! - a.bestSelling!);
    } else if (selected === 1) {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (selected === 0) {
      sorted = sorted.filter((a) => a.discount > 0);
    }

    return sorted;
  }, [products, selected]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/all`,

        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ limit: 10, offset }),
        }
      );

      switch (response.status) {
        case 200:
          const data = await response.json();
          const newProducts = data?.data;

          setProducts((prev: any[]) => [...prev, ...newProducts]);
          setOffset((prevOffset: number) => prevOffset + 10);

          if (newProducts.length < 10) {
            setHasMore(false);
          }

          break;

        case 404:
          setHasMore(false);

          break;

        default:
          break;
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, []);

  const handleSelect = (index: number) => {
    setSelected(index);
  };

  return (
    <div className="my-11">
      <h3 className="text-[30px] text-black text-center">محصولات ما</h3>
      <hr className="w-[70px] mx-auto border-[#A60014] bg-[#A60014] h-[3px]" />

      <div className="w-full mx-auto flex flex-row-reverse space-x-6 my-5 space-x-reverse justify-center">
        <div
          className={`flex
          ${selected === 0 ? "button " : ""}
          `}
        >
          <span
            className={`${selected === 0 ? "button-hover-effect" : ""}`}
          ></span>
          <span
            className={` button-hover-effect-text px-7 py-2 text-[15px] text-[#222] text-center rounded-[50px] cursor-pointer ${
              selected === 0 ? " text-white" : " bg-white"
            }`}
            onClick={() => handleSelect(0)}
          >
            تخفیف خورده
          </span>
        </div>
        <div
          className={`flex
          ${selected === 1 ? "button " : ""}
          `}
        >
          <span
            className={`${selected === 1 ? "button-hover-effect" : ""}`}
          ></span>
          <span
            className={` button-hover-effect-text px-7 py-2 text-[15px] text-[#222] text-center rounded-[50px] cursor-pointer ${
              selected === 1 ? " text-white" : " bg-white"
            }`}
            onClick={() => handleSelect(1)}
          >
            محصولات جدید
          </span>
        </div>
        <div
          className={`flex
          ${selected === 2 ? "button " : ""}
          `}
        >
          <span
            className={`${selected === 2 ? "button-hover-effect" : ""}`}
          ></span>
          <span
            className={` button-hover-effect-text px-7 py-2 text-[15px] text-[#222] text-center rounded-[50px] cursor-pointer ${
              selected === 2 ? " text-white" : " bg-white"
            }`}
            onClick={() => handleSelect(2)}
          >
            پرفروش‌ترین ها
          </span>
        </div>
      </div>

      {sortedProducts?.length == 0 ? (
        <div className=" w-fit mx-auto  pt-10 pb-12 my-24 screen1000:my-8">
          <div className="w-fit mx-auto mb-4">
            <Image
              width={6}
              height={6}
              alt=""
              src={errIcon}
              className="w-24 h-24 screen1000:w-20 screen1000:h-20"
            />
          </div>
          <div
            style={{ direction: "rtl" }}
            className="text-[#6D6F72] text-2xl text-center screen1000:text-lg"
          >
            محصولی وجود ندارد .
          </div>
        </div>
      ) : (
        <div
          style={{ direction: "rtl" }}
          className="grid grid-cols-5 gap-7 my-10"
        >
          {sortedProducts?.map((item: any) => {
            return (
              <div key={item?.id}>
                <Details item={item} />
              </div>
            );
          })}
        </div>
      )}

      {hasMore ? (
        <div
          onClick={fetchProduct}
          className="button w-44 cursor-pointer mx-auto py-3 text-lg text-center mt-10 screen1250:text-base"
        >
          <span className="button-hover-effect"></span>
          <p className="button-hover-effect-text"> محصولات بیشتر </p>
        </div>
      ) : null}
    </div>
  );
};

export default Products;
