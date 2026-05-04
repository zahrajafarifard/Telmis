import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import ProductDetails from "./product-details";
import errIcn from "../../../../assets/images/error2.svg";
import searchIcon from "../../../../assets/images/search-black.svg";
import addIcon from "../../../../assets/images/Add_User.svg";
import Pagination from "../../../shared-component/pagination";

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const _subCatId = location?.state?.id;

  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [searchItem, setSearchItem] = useState("");

  const [totalItems, settTotalItems] = useState(0);
  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    if (page !== "...") {
      setCurrentPage(page);
    }
  };
  useEffect(() => {
    setToken(_token);
  }, [_token]);

  useEffect(() => {
    const _jobs = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/products/ProductsPerSubCategory`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            categoryId: _subCatId,
            page: currentPage,
            pageSize: itemsPerPage,
          }),
        }
      );

      switch (response.status) {
        case 200:
          const data = await response.json();
          setCategory(data?.category);
          setSubCategory(data?.subCategory);

          setProducts(data?.products.rows);
          settTotalItems(data?.products.count);
          break;

        default:
          break;
      }
    };

    token && _subCatId && _jobs();
  }, [token, _subCatId, currentPage, totalItems]);

  if (products?.length === 0) {
    return (
      <div className=" w-fit mx-auto  pt-10 pb-12 px-20 my-24">
        <div className="w-fit mx-auto mb-4">
          <img src={errIcn} className="w-24 h-24" />
        </div>
        <div className="text-[#6D6F72] text-2xl">
          محصولی برای این دسته بندی وجود ندارد.
        </div>
      </div>
    );
  }
  return (
    <div className="w-[90%] mx-auto">
      <div className=" flex flex-row justify-between mt-5">
        <div className="my-auto flex flex-row ">
          <p className="text-[#221D23] text-xl font-semibold tracking-wide my-auto">
            {category}
          </p>

          <p className="text-[#A60014] text-base underline my-auto mr-1">
            {subCategory}
          </p>
        </div>
        <hr className="flex flex-grow my-auto mx-6" />

        <div className="flex flex-row   ">
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
            onClick={() => navigate("/add-product")}
            className="my-auto bg-[#A60014] py-2  rounded-[50px] flex flex-row px-12 cursor-pointer"
          >
            <img src={addIcon} className="ml-2" />
            <span className="text-white  my-auto">افزودن محصول</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 my-24 gap-y-10 ">
        {products?.map((item, index) => {
          return (
            <ProductDetails
              key={item.id}
              index={index}
              item={item}
              setProducts={setProducts}
            />
          );
        })}
      </div>

      <div className="">
        {products?.length !== 0 && (
          <Pagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            current={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Products;
