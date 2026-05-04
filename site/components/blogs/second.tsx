"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import BlogDetails from "./blog-details";
import Category from "./categories/page";

interface articleType {
  id: number;
  articleTitle: string;
  shortDescription: string;
  author: string;
  mainImage: string;
  ArticleType: { id: number; type: string };
  createdAt: string;
}
const SecondChild = () => {
  const router = useRouter();

  const [articles, setArticles] = useState<articleType[]>([]);
  const [selectedArticleType, setSelectedArticleType] = useState<number>(0);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    if (selectedArticleType) {
      router.push(`/blogs?category=${selectedArticleType}`);
    }
  }, [selectedArticleType]);

  useEffect(() => {
    const _articles = async () => {
      const _response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/articles/mostVisited`
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

  const articlesToDisplay =
    screenWidth <= 1000 && screenWidth > 705 ? articles.slice(0, 2) : articles;

  if (articlesToDisplay.length === 0) {
    return;
  }
  return (
    <div
      className="w-[70%] mx-auto
    screen1250:w-[80%]
    screen750:w-[90%] "
    >
      <div
        className="w-full mx-auto flex flex-row-reverse space-x-4 space-x-reverse justify-between my-20
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
            محبوب‌ترین مقالات
          </div>
          <Link href="/blogs" className="my-auto">
            <div
              className="my-auto mr-3 text-[#A60014] underline text-xl
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
        <Category setSelectedArticleType={setSelectedArticleType} />
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

export default SecondChild;
