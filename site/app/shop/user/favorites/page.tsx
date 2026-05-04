"use client";
import React from "react";

import FavoritesCmp from "@/components/shop/user/favorites/page";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import SearchItems from "@/components/shop/search/searchItems";

const Favorites = () => {
  const _searchFromCart = useSelector(
    (state: RootState) => state.search.searchItemState
  );
  const _searchValueFromCart = useSelector(
    (state: RootState) => state.search.searchValueState
  );
  return _searchFromCart?.length !== 0 ? (
    <SearchItems items={_searchFromCart} searchValue={_searchValueFromCart} />
  ) : (
    <div>
      <FavoritesCmp />
    </div>
  );
};

export default Favorites;
