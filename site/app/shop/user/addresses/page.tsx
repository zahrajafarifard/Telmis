"use client";
import React from "react";

import AddressesCmp from "@/components/shop/user/addresses/page";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import SearchItems from "@/components/shop/search/searchItems";

const Address = () => {
  const _searchFromCart = useSelector(
    (state: RootState) => state.search.searchItemState
  );
  const _searchValueFromCart = useSelector(
    (state: RootState) => state.search.searchValueState
  );
  return (
    <div>
      {_searchFromCart?.length !== 0 ? (
        <SearchItems
          items={_searchFromCart}
          searchValue={_searchValueFromCart}
        />
      ) : (
        <AddressesCmp />
      )}
    </div>
  );
};

export default Address;
