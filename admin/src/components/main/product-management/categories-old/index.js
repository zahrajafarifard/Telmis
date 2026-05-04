import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import errIcn from "../../../../assets/images/error2.svg";
import searchIcon from "../../../../assets/images/search-black.svg";
import addIcon from "../../../../assets/images/Add_User.svg";
import SubCateories from "./sub-categories";
import Category from "./main-category";

const Categories = () => {
  const navigate = useNavigate();

  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [searchItem, setSearchItem] = useState("");
  const [categories, setCategories] = useState([]);
  const [reloading, setReloading] = useState(false);
  const [categoryId, setCategoryId] = useState(null);

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  useEffect(() => {
    const _cats = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/categories/parents`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      switch (response.status) {
        case 200:
          const data = await response.json();

          setCategories(data?.data);
          data?.data[0] && setSelectedCategory(data?.data[0]?.id);

          break;

        default:
          break;
      }
    };

    token && _cats();
  }, [token, setSelectedCategory, setCategories, reloading]);

  if (categories?.length === 0) {
    return (
      <div className="relative">
        <div className=" w-fit mx-auto  pt-10 pb-12 px-20 my-40">
          <div className="w-fit mx-auto mb-4">
            <img src={errIcn} className="w-24 h-24" />
          </div>
          <div className="text-[#6D6F72] text-2xl">
            هیچ دسته بندی وجود ندارد
          </div>
        </div>
        <div className="fixed  bottom-20 w-[78%]">
          <Category
            setReloading={setReloading}
            reloading={reloading}
            categoryId={categoryId}
            setCategoryId={setCategoryId}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="w-[90%] mx-auto">
      <div className="relative flex flex-row justify-between">
        <div className="flex flex-row  ">
          {categories?.map((cat, index) => {
            return (
              <div
                key={cat?.id}
                className={`${
                  selectedCategory === cat?.id
                    ? "border-b-4 border-b-red-700 text-[#221D23]"
                    : "text-[#D9D9D9]"
                }  py-4 ml-10 cursor-pointer`}
                onClick={() => setSelectedCategory(cat?.id)}
              >
                {cat?.name}
              </div>
            );
          })}
        </div>
        <div className="w-[58%] border absolute bottom-[1px] -z-10" />

        <div className="flex flex-row absolute -bottom-5 left-0  ">
          <div className="my-auto bg-white py-2  ml-3 rounded-[50px] shadow-[0_4px_15px_2px_rgba(0,0,0,0.099)] flex flex-row px-2 cursor-pointer w-72">
            <img src={searchIcon} className="ml-1" />
            <input
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
              placeholder="جست و جو"
              className="w-72 rounded-lg focus:outline-none"
            />
          </div>
          <div
            onClick={() => navigate("/add-sub-category")}
            className="my-auto bg-[#A60014] py-2  rounded-[50px] flex flex-row px-12 cursor-pointer"
          >
            <img src={addIcon} className="ml-2" />
            <span className="text-white  my-auto">افزودن زیر دسته </span>
          </div>
        </div>
      </div>

      {selectedCategory && <SubCateories selectedCategory={selectedCategory} />}

      <Category
        setReloading={setReloading}
        reloading={reloading}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
      />
    </div>
  );
};

export default Categories;
