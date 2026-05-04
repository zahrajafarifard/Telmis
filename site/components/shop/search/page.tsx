"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

import { setSearchItem, clearSearchItems } from "@/store/slices/search";
import { useDispatch } from "react-redux";
import { usePathname } from "next/navigation";

const Search = () => {
  const dispatch = useDispatch();
  const pathname = usePathname();

  const [searchItemState, setSearchItemState] = useState<string>("");

  useEffect(() => {
    if (!searchItemState) {
      dispatch(clearSearchItems());
    }
  }, [searchItemState, dispatch]);

  const searchHandler = async () => {
    const _response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/products/search`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          searchItem: searchItemState,
          page: 1,
          pageSize: 4, //add pagination
        }),
      }
    );

    switch (_response.status) {
      case 200:
        const _data = await _response.json();
        dispatch(
          setSearchItem({
            result: _data?.data?.rows,
            searchValue: searchItemState,
          })
        );
        break;

      default:
        break;
    }
  };

  return (
    <div className="my-auto ">
      <div className="">
        <div
          className={`rounded-full bg-[#f2f2f2] flex justify-center items-center pr-4
              ${
                pathname === "/shop"
                  ? "screen690:p-2"
                  : `screen1000:w-[50px] screen1000:h-[50px]`
              }

          `}
        >
          <Image
            onClick={() => {
              searchHandler();
            }}
            src={"/images/shop/search.svg"}
            width={32}
            height={32}
            alt="جستجو"
            className="cursor-pointer screen1360:w-7 screen1360:h-7"
          />
          <input
            value={searchItemState}
            onChange={(e) => setSearchItemState(e.target.value)}
            placeholder="جست وجو در فروشگاه"
            className=" bg-[#f2f2f2] rounded-full w-56 p-2.5 outline-none 
            screen1360:w-48
            screen1360:text-[15px]
           screen1150:w-44
           screen690:hidden
          
           "
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
