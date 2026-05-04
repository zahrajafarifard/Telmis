"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

import { setSearchItem, clearSearchItems } from "@/store/slices/search";
import { useDispatch } from "react-redux";
import { usePathname } from "next/navigation";

const Search = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();

  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [searchItemState, setSearchItemState] = useState<string>("");

  useEffect(() => {
    // !searchItemState && dispatch(clearSearchItems());

    if (!searchItemState) {
      dispatch(clearSearchItems());
    }
  }, [searchItemState, dispatch]);

  useEffect(() => {
    // !showSearch && setSearchItemState("");

    if (!showSearch) {
      setSearchItemState("");
    }
  }, [showSearch]);

  useEffect(() => {
    const _search = async () => {
      const _response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/search`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ searchItem: searchItemState }),
        }
      );

      switch (_response.status) {
        case 200:
          const _data = await _response.json();
          dispatch(setSearchItem(_data?.data));
          break;

        default:
          break;
      }
    };

    // searchItemState && _search();
    if (searchItemState) {
      _search();
    }
  }, [searchItemState]);

  return (
    <div>
      <div className="relative z-10">
        <div
          onClick={() => setShowSearch((prev) => !prev)}
          className={`rounded-full bg-[#f0f0f0]  w-[50px] h-[50px] flex justify-center items-center 
              ${
                pathname === "/shop"
                  ? "screen1150:w-[50px] screen1150:h-[50px] "
                  : `screen1000:w-[50px] screen1000:h-[50px]`
              }

          `}
        >
          <Image
            src={"/images/shop/search.svg"}
            width={32}
            height={32}
            alt="جستجو"
            className="screen1360:w-7 screen1360:h-7"
          />

          
        </div>

        {/* {showSearch && (
          <input
            value={searchItemState}
            onChange={(e) => setSearchItemState(e.target.value)}
            placeholder="محصول مورد نظر را وارد کنید..."
            className=" bg-[#f2f2f2] w-80 rounded-[6px] absolute -bottom-14  p-2 outline-none screen1250:text-sm screen1250:-bottom-12
            screen1360:w-[23rem]
            screen1250:w-[22rem] 
            screen1150:w-64 
            screen1000:w- 
            screen690:w-56 
            screen500:w-52"
          />
        )} */}
      </div>
    </div>
  );
};

export default Search;
