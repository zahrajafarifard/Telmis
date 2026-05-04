"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Category from "../shared/sub-categories";
import Sort from "../shared/sort";
import ProductDetails from "../shared/product-details";
import Image from "next/image";
import errIcon from "@/public/images/shop/error-red.svg";
import style from "./style.module.css";
interface ProductsType {
  id: number;
  mainImage: string;
  mainTitle: string;
  price: number;
  discount: number;
}

interface CategoryType {
  id: number;
  name: string;
}

const Categories = () => {
  const [selectedSubCategory, setSelectedSubCategory] = useState<number>(0);
  const [selectedSort, setSelectedSort] = useState<number>(0);
  const [productsPerCategory, setProductsPerCategory] = useState<
    ProductsType[]
  >([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [categoryId, setCategoryId] = useState<number>(0);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories/parents`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCategories(data?.data || []);
          if (data?.data?.length > 0) {
            setCategoryId(data.data[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // selectedSubCategory === false ==> sort by categoryId
  // selectedSubCategory === true ==> sort by selectedSubCategory

  useEffect(() => {
    const _products = async () => {
      let type;
      let _catId = selectedSubCategory ? selectedSubCategory : categoryId;

      if (selectedSubCategory) {
        _catId = selectedSubCategory;
        type = "subCat";
      } else {
        _catId = categoryId;
        type = "Cat";
      }

      if (selectedSort === 3) {
        _catId = categoryId;
        type = "Cat";
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/sort`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ type, selectedSort, categoryId: _catId }),
        }
      );

      switch (response.status) {
        case 200:
          const data = await response.json();
          setProductsPerCategory(data?.data);
          break;

        default:
          break;
      }
    };

    // selectedSort && _products();

    if (selectedSort) {
      _products();
    }
  }, [selectedSort]);

  const fetchProducts = async (url: string, body: Record<string, any>) => {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        setProductsPerCategory(data?.data);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchProducts(
        `${process.env.NEXT_PUBLIC_API_URL}/products/productsPerCategorySite`,
        { categoryId }
      );
    }
  }, [categoryId]);

  useEffect(() => {
    if (selectedSubCategory) {
      fetchProducts(
        `${process.env.NEXT_PUBLIC_API_URL}/products/productsPerSubCategorySite`,
        {
          categoryId: selectedSubCategory,
        }
      );
    }
  }, [selectedSubCategory]);

  if (categories.length == 0) {
    return (
      <div className="w-fit mx-auto pt-10 pb-12 my-40 screen1000:my-8">
        <div className="w-fit mx-auto mb-4">
          <Image
            src={errIcon}
            alt="ایکن هشدار"
            className="w-24 h-24 screen1000:w-20 screen1000:h-20"
          />
        </div>
        <div
          style={{ direction: "rtl" }}
          className="text-[#6D6F72] text-2xl text-center screen1000:text-lg"
        >
          هیچ محصولی وجود ندارد.
        </div>
      </div>
    );
  }
  return (
    <div
      className="mt-10 mb-20 w-[80%] mx-auto 
      screen750:w-[90%]"
    >
      <div className="relative flex flex-row-reverse justify-between">
        <div className="flex flex-row-reverse">
          {categories?.map((cat) => (
            <div
              key={cat.id}
              className={`leading-[36px] pb-3 ml-10 cursor-pointer text-2xl screen1250:text-xl screen750:text-base screen750:pb-2 ${
                categoryId === cat.id
                  ? "border-b-4 border-b-red-700 text-[#221D23]"
                  : "text-[#D9D9D9]"
              }`}
              onClick={() => setCategoryId(cat.id)}
            >
              {cat?.name}
            </div>
          ))}
        </div>
        <div className="w-[65%] border absolute bottom-[1px] -z-10 screen790:w-[60%] screen750:w-[84%] screen400:w-[75%]" />

        <div className="flex flex-row-reverse space-x-4 space-x-reverse absolute -bottom-5 left-0 screen750:-bottom-4">
          <Sort selectedSort={selectedSort} setSelectedSort={setSelectedSort} />
          {categoryId && (
            <Category
              categoryId={categoryId}
              selectedSubCategory={selectedSubCategory}
              setSelectedSubCategory={setSelectedSubCategory}
            />
          )}
        </div>
      </div>
      <div
        ref={scrollRef}
        style={{ direction: "rtl" }}
        className={`flex flex-wrap gap-y-6 w-full mx-auto mt-10  overflow-x-auto screen750:flex-nowrap  ${style.scrollContainer} ${style.hiddenScrollbar}
       `}
      >
        {productsPerCategory?.length === 0 ? (
          <div className="w-fit mx-auto pt-10 pb-12 my-10 screen1000:my-8">
            <div className="w-fit mx-auto mb-4">
              <Image
                src={errIcon}
                alt="ایکن هشدار"
                className="w-24 h-24 screen1000:w-20 screen1000:h-20 screen750:w-16 screen750:h-16"
              />
            </div>
            <div
              style={{ direction: "rtl" }}
              className="text-[#6D6F72] text-2xl screen1000:text-xl screen750:text-lg"
            >
              هیچ محصولی وجود ندارد.
            </div>
          </div>
        ) : (
          productsPerCategory?.map((item, index) => (
            <React.Fragment key={item.id}>
              <div className={`w-[24.4%]  mx-auto screen750:w-[235px]  `}>
                <Link href={`/shop/${item?.id}`}>
                  <ProductDetails item={item} showBorder={index !== 1000} />
                </Link>
              </div>

              <div
                className={`w-px bg-[#DFDFDF] mx-auto my-auto screen750:h-min
              ${
                index === productsPerCategory.length - 1 || index === 3
                  ? "h-0"
                  : "h-40"
              }
            `}
              ></div>
            </React.Fragment>
          ))
        )}
      </div>
    </div>
  );
};

export default Categories;
