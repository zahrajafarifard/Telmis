import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import Pagination from "../../../shared-component/pagination";
import ProductDetails from "./product-details";
import errIcn from "../../../../assets/images/error2.svg";

const ProductsPerCategory = ({
  selectedCategory,
  currentPage,
  setCurrentPage,
  searchItem,
}) => {
  const [productsPerCategory, setProductsPerCategory] = useState([]);

  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");

  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 8;

  const handlePageChange = (page) => {
    if (page !== "...") {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  useEffect(() => {
    const _products = async () => {
      const endpoint = searchItem
        ? `${process.env.REACT_APP_URL}/products/search`
        : `${process.env.REACT_APP_URL}/products/productsPerCategory`;

      const bodyData = {
        categoryId: selectedCategory,
        page: currentPage,
        pageSize: itemsPerPage,
        ...(searchItem && { searchItem }),
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },

        body: JSON.stringify(bodyData),
      });

      switch (response.status) {
        case 200:
          const data = await response.json();

          if (searchItem) {
            setProductsPerCategory(data?.data?.rows);
            setTotalItems(data?.data?.count || 0);
          } else {
            setProductsPerCategory(data?.products?.rows);
            setTotalItems(data?.products?.count || 0);
          }

          break;

        default:
          break;
      }
    };

    token && _products();
  }, [
    token,
    setProductsPerCategory,
    selectedCategory,
    currentPage,
    setTotalItems,
    searchItem,
  ]);

  if (productsPerCategory?.length === 0) {
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
    <div>
      <div className="grid grid-cols-4 my-24 gap-y-10 ">
        {productsPerCategory?.map((item, index) => {
          return (
            <ProductDetails
              key={item.id}
              index={index}
              item={item}
              setProducts={setProductsPerCategory}
            />
          );
        })}
      </div>

      <div className="">
        {productsPerCategory?.length !== 0 && (
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

export default ProductsPerCategory;
