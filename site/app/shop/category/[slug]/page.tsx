"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SubCategoriesCmp from "@/components/shop/main-page/sub-cats/sub-categories";
import Banner from "@/components/shop/shared/banner/page";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import SearchItems from "@/components/shop/search/searchItems";

const SubCategories = () => {
  const params = useParams();
  const slug = params?.slug as string;

  const _searchFromCart = useSelector(
    (state: RootState) => state.search.searchItemState
  );
  const _searchValueFromCart = useSelector(
    (state: RootState) => state.search.searchValueState
  );

  const [items, setItems] = useState([]);
  const [catName, setCatName] = useState("");

  useEffect(() => {
    if (!slug) return;

    const [catId, rawCatName] = slug?.split("-") || [];
    setCatName(decodeURIComponent(rawCatName || ""));

    const fetchSubCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products/productsPerCategorySite`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ categoryId: catId }),
          }
        );

        const subCategories = await response.json();
        setItems(subCategories?.data || []);
      } catch (error) {
        console.error("Failed to fetch subcategories:", error);
      }
    };

    fetchSubCategories();
  }, [slug]);

  return (
    <div>
      <Banner />
      {_searchFromCart?.length !== 0 ? (
        <SearchItems
          items={_searchFromCart}
          searchValue={_searchValueFromCart}
        />
      ) : (
        <SubCategoriesCmp items={items} catName={catName} />
      )}
    </div>
  );
};

export default SubCategories;
