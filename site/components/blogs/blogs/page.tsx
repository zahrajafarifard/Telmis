"use client";
import React, { useState } from "react";

import Headers from "../header";
import Main from "./main";

interface Props {
  sort: string | undefined;
  category: string | undefined;
}

interface articleType {
  id: number;
  articleTitle: string;
  shortDescription: string;
  author: string;
  mainImage: string;
  ArticleType: { id: number; type: string };
  createdAt: string;
}

const Blogs: React.FC<Props> = ({ sort, category }) => {
  const [searchItem, setSearchItem] = useState<string>("");
  const [articles, setArticles] = useState<articleType[]>([]);

  const searchHandler = async () => {
    const _response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/articles/search-article`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          searchItem,
        }),
      }
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

  return (
    <div>
      <Headers
        showSearch={true}
        setSearchItemProps={setSearchItem}
        searchHandlerProps={searchHandler}
        searchItemProps={searchItem}
      />
      <Main sort={sort} category={category} searchResult={articles} />
    </div>
  );
};

export default Blogs;
