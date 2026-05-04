"use client";
import React from "react";

import CheckOutCmp from "@/components/shop/checkout/page";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import Header from "@/components/shared/header/page";
import bgImage from "@/public/images/bg-header.png";
import SearchItems from "@/components/shop/search/searchItems";

const Checkout = () => {
  const _searchFromCart = useSelector(
    (state: RootState) => state.search.searchItemState
  );
  const _searchValueFromCart = useSelector(
    (state: RootState) => state.search.searchValueState
  );
  return (
    <div>
      <Header title="آدرس و زمان ارسال" text="" image={bgImage} />

      {_searchFromCart?.length !== 0 ? (
        <SearchItems
          items={_searchFromCart}
          searchValue={_searchValueFromCart}
        />
      ) : (
        <CheckOutCmp />
      )}
    </div>
  );
};

export default Checkout;
