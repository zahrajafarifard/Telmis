"use client";
import React from "react";
import Cart from "@/components/shop/cart/page";

import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import SearchItems from "@/components/shop/search/searchItems";
import Header from "@/components/shared/header/page";
import bgImage from "@/public/images/bg-header.png";

const CartComponent = () => {
  const _searchFromCart = useSelector(
    (state: RootState) => state.search.searchItemState
  );
  const _searchValueFromCart = useSelector(
    (state: RootState) => state.search.searchValueState
  );
  return (
    <div>
      <Header
        title="سبد خرید شما"
        text={
          <>
            <span className="text-[#A60014] text-lg ">سبدخرید</span>
            <span className=" text-[#A60014] text-lg mx-1">/</span>
            <span className="text-[#919191] text-lg">فروشگاه / خانه</span>
          </>
        }
        image={bgImage}
      />
      {_searchFromCart?.length !== 0 ? (
        <SearchItems
          items={_searchFromCart}
          searchValue={_searchValueFromCart}
        />
      ) : (
        <Cart />
      )}
    </div>
  );
};

export default CartComponent;
