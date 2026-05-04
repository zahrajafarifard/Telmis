"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import moment from "moment-jalaali";
import Link from "next/link";
import Image from "next/image";
import BlogDetails from "./blog-details";
import Sort from "./sort";
import errIcon from "@/public/images/shop/error-red.svg";

interface articleType {
  id: number;
  articleTitle: string;
  shortDescription: string;
  author: string;
  mainImage: string;
  ArticleType: { id: number; type: string };
  createdAt: string;
}
const FirstChild = () => {
  const router = useRouter();
  moment.loadPersian({ usePersianDigits: true, dialect: "persian-modern" });

  const [articles, setArticles] = useState<articleType[]>([]);

  const [selectedSort, setSelectedSort] = useState<number>(0);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (selectedSort) {
      router.push(`/blogs?sort=${selectedSort}`);
    }
  }, [selectedSort]);

  useEffect(() => {
    const _articles = async () => {
      const _response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/articles`
      );

      switch (_response.status) {
        case 200:
          const _data = await _response.json();
          setArticles(_data?.data);

          break;

        default:
          break;
      }
    };

    _articles();
  }, [setArticles]);

  if (articles?.length === 0) {
    return (
      <div className=" w-fit mx-auto  pt-10 pb-12 my-24 screen1000:my-8 ">
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
          هیچ مقاله ای وجود ندارد .
        </div>
      </div>
    );
  }

  const articlesToDisplay =
    screenWidth <= 1000 && screenWidth > 705 ? articles.slice(0, 2) : articles;
  return (
    <div
      className="w-[70%] mx-auto
      screen1250:w-[80%]
      screen750:w-[90%] "
    >
      <div
        className="w- mx-auto flex flex-row-reverse space-x-4 space-x-reverse justify-between my-20
         screen750:my-16
        screen450:space-x-2
        screen450:space-x-reverse  "
      >
        <div style={{ direction: "rtl" }} className="flex flex-row">
          <div
            className="my-auto text-[#221D23] font-semibold text-2xl
            screen1440:text-xl
            screen750:text-lg
            screen450:text-[17px]
            screen400:text-base
            "
          >
            بر اساس دسته بندی
          </div>
          <Link href="/blogs" className="my-auto">
            <div
              className="my-auto mr-3 text-[#A60014] underline font-[500] text-xl
              screen1440:text-base
              screen750:text-xs
              screen450:text-[11px]
              screen450:mr-2
              screen400:text-[10px]
              screen400:mr-1
              "
            >
              مشاهده همه مقالات
            </div>
          </Link>
        </div>
        <hr className="flex flex-grow mx-auto my-auto" />

        <Sort setSelectedSortProps={setSelectedSort} />
      </div>

      <div
        style={{ direction: "rtl" }}
        className="w-full mx-auto grid grid-cols-3 gap-x-7 
        
          screen1250:gap-x-4
          screen1000:grid-cols-2
          screen705:grid-cols-1
          screen705:gap-y-10
        "
      >
        {articlesToDisplay?.map((item) => {
          return (
            <div key={item.id}>
              <BlogDetails item={item} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FirstChild;
