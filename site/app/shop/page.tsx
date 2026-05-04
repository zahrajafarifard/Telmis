"use client";
import React from "react";

import Categories from "@/components/shop/main-page/category/categories";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";

import SearchItems from "@/components/shop/search/searchItems";
import Banner from "@/components/shop/shared/banner/page";
import HomPageBanner from "@/components/shop/main-page/banner/page";
import FeaturedProducts from "@/components/shop/main-page/featured-products/page";

const Shop = () => {
  const _searchFromCart = useSelector(
    (state: RootState) => state.search.searchItemState
  );
  const _searchValueFromCart = useSelector(
    (state: RootState) => state.search.searchValueState
  );

  return (
    <div>
      <Banner />

      {_searchFromCart?.length !== 0 ? (
        <SearchItems
          items={_searchFromCart}
          searchValue={_searchValueFromCart}
        />
      ) : (
        <>
          <Categories />
          <HomPageBanner />
          <FeaturedProducts />
        </>
      )}
    </div>
  );
};

export default Shop;
