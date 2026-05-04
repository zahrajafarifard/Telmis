"use client";
import React from "react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import SearchItems from "@/components/shop/search/searchItems";
import ProfileCmp from "@/components/shop/user/profile/page";

const Profile = () => {
  const _searchFromCart = useSelector(
    (state: RootState) => state.search.searchItemState
  );
  const _searchValueFromCart = useSelector(
    (state: RootState) => state.search.searchValueState
  );

  return (
    <div>
      <div className="py-16 text-center leading-[62px] text-white text-[48px] bg-gradient-to-r from-[#A60014] to-[#600B0E]">
        اطلاعات کاربری
      </div>

      {_searchFromCart?.length !== 0 ? (
        <SearchItems
          items={_searchFromCart}
          searchValue={_searchValueFromCart}
        />
      ) : (
        <ProfileCmp />
      )}
    </div>
  );
};

export default Profile;
