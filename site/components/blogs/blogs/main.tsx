"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Pagination from "@/components/shared/pagination/page";
import BlogDetails from "../blog-details";
import Category from "../categories/page";
import Sort from "../sort";
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

interface Props {
  sort: string | undefined;
  category: string | undefined;
  searchResult: {
    id: number;
    articleTitle: string;
    shortDescription: string;
    author: string;
    mainImage: string;
    ArticleType: { id: number; type: string };
    createdAt: string;
  }[];
}

const Main: React.FC<Props> = ({ sort, category, searchResult }) => {
  const [articles, setArticles] = useState<articleType[]>([]);
  const [selectedSort, setSelectedSort] = useState<number>(0);
  const [selectedArticleType, setSelectedArticleType] = useState<number>(0);

  const [totalItems, setTotalItems] = useState<number>(0);
  const itemsPerPage: number = 6;
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handlePageChange = (page: number | string) => {
    if (page !== "...") {
      setCurrentPage(Number(page));
    }
  };

  useEffect(() => {
    if (searchResult) {
      setArticles(searchResult);
    }
  }, [searchResult]);

  useEffect(() => {
    const _url = `${process.env.NEXT_PUBLIC_API_URL}/articles/articlesWithoutConditions`;

    const _articles = async () => {
      const _response = await fetch(_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page: currentPage,
          pageSize: itemsPerPage,
        }),
      });

      switch (_response.status) {
        case 200:
          const _data = await _response.json();
          setArticles(_data?.data?.rows);
          setTotalItems(_data?.data?.count);
          break;
        default:
          break;
      }
    };

    if (!category && !sort && selectedSort == 0 && selectedArticleType == 0) {
      _articles();
    }
  }, [setCurrentPage, setTotalItems, currentPage, itemsPerPage]);

  useEffect(() => {
    const _url = `${process.env.NEXT_PUBLIC_API_URL}/articles`;
    let _body = "";

    if (sort) {
      _body = sort;
    }

    if (selectedSort) {
      _body = String(selectedSort);
    }

    const _articles = async () => {
      const _response = await fetch(_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item: _body,
          page: currentPage,
          pageSize: itemsPerPage,
        }),
      });

      switch (_response.status) {
        case 200:
          const _data = await _response.json();
          setArticles(_data?.data?.rows);
          setTotalItems(_data?.data?.count);
          break;

        default:
          break;
      }
    };

    if (selectedSort || sort) {
      _articles();
    }
  }, [
    setArticles,
    selectedSort,
    sort,
    setCurrentPage,
    setTotalItems,
    currentPage,
    itemsPerPage,
  ]);

  useEffect(() => {
    const _url = `${process.env.NEXT_PUBLIC_API_URL}/articles/sameTypeArticles`;
    let _body = "";

    if (category) {
      _body = category;
    }

    if (selectedArticleType) {
      _body = String(selectedArticleType);
    }

    const _articles = async () => {
      const _response = await fetch(_url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item: _body,
          page: currentPage,
          pageSize: itemsPerPage,
        }),
      });

      switch (_response.status) {
        case 200:
          const _data = await _response.json();
          setArticles(_data?.data?.rows);
          setTotalItems(_data?.data?.count);
          break;

        default:
          break;
      }
    };

    if (selectedArticleType || category) {
      _articles();
    }
  }, [
    setArticles,
    selectedArticleType,
    category,
    setCurrentPage,
    setTotalItems,
    currentPage,
    itemsPerPage,
  ]);

  return (
    <div
      className="w-[70%] mx-auto   screen1250:w-[80%]
        screen750:w-[90%]"
    >
      <div
        className="w-[100%] mx-auto flex flex-row-reverse justify-between my-24  space-x-4 space-x-reverse
          screen950:space-x-2
          screen950:space-x-reverse
          screen750:space-x-4
          screen750:space-x-reverse
      "
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
            نتیجه جست و جوی شما
          </div>
        </div>
        <hr className="flex flex-grow mx-auto my-auto" />

        <Category
          setSelectedArticleType={setSelectedArticleType}
          setSelectedSortProps={setSelectedSort}
        />

        <Sort
          setSelectedSortProps={setSelectedSort}
          setSelectedArticleType={setSelectedArticleType}
        />
      </div>
      {articles?.length === 0 ? (
        <div
          className="w-fit mx-auto  pt-10 pb-12 my-20
          screen750:my-16"
        >
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
            className="text-[#6D6F72] text-2xl text-center screen1000:text-lg"
          >
            هیچ مقاله ای وجود ندارد .
          </div>
        </div>
      ) : (
        <div
          style={{ direction: "rtl" }}
          className="w-full mx-auto grid grid-cols-3 gap-10 mb-20
            screen750:mb-16
            screen1250:gap-x-4
            screen1000:grid-cols-2
            screen705:grid-cols-1
            screen705:gap-y-10
          "
        >
          {articles?.map((item) => {
            return (
              <div key={item.id}>
                <BlogDetails item={item} />
              </div>
            );
          })}
        </div>
      )}

      <div style={{ direction: "rtl" }} className="my-20">
        {totalItems > 0 && (
          <Pagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            current={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Main;
