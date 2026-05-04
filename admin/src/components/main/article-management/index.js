import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import searchIcon from "../../../assets/images/search-black.svg";
import errIcn from "../../../assets/images/error2.svg";
import addIcon from "../../../assets/images/Add_User.svg";
import ArticleDetails from "./article-details";
import Pagination from "../../shared-component/pagination";

const Article = () => {
  const navigate = useNavigate();
  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");
  const [responseStatus, setResponseStatus] = useState(0);
  const [searchItem, setSearchItem] = useState("");
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  const [totalItems, settTotalItems] = useState(0);
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    if (page !== "...") {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    const fetchJobs = async () => {
      const endpoint = searchItem
        ? `${process.env.REACT_APP_URL}/articles/search-article`
        : `${process.env.REACT_APP_URL}/articles`;

      const bodyData = {
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

          settTotalItems(data?.data?.count || 0);
          setArticles(data?.data?.rows || []);
          setResponseStatus(200);

          break;

        case 404:
          setArticles([]);
          settTotalItems(0);
          setResponseStatus(404);
          break;

        default:
          setArticles([]);
          settTotalItems(0);
          break;
      }
    };

    if (token) {
      fetchJobs();
    }
  }, [token, currentPage, searchItem]);

  const searchHandler = () => {
    setCurrentPage(1);
  };

  return (
    <div className="w-[90%] mx-auto">
      <div className="flex flex-row justify-between space-x-4 space-x-reverse w-full mt-8 mb-14">
        <div className="text-[#1E1B1B] text-lg font-semibold my-auto">
          اطلاعات مقاله
        </div>
        <hr className="flex flex-grow my-auto border-[#D9D9D9]" />
        <div className="my-auto  py-2  rounded-[50px] shadow-[0_4px_15px_2px_rgba(0,0,0,0.099)] flex flex-row px-2 cursor-pointer w-72">
          <img
            onClick={() => searchHandler()}
            src={searchIcon}
            className="ml-1"
          />
          <input
            value={searchItem}
            onChange={(e) => setSearchItem(e.target.value)}
            placeholder="جست و جو"
            className="w-72 rounded-lg focus:outline-none"
          />
        </div>
        <div
          onClick={() => navigate("/add-new-article")}
          className="my-auto bg-[#A60014] py-2  rounded-[50px] flex flex-row px-16 cursor-pointer"
        >
          <img src={addIcon} className="ml-2" />
          <span className="text-white">افزودن مقاله</span>
        </div>
      </div>

      {/* //////////////////////////////////////////// */}
      {articles?.length !== 0 ? (
        <div className="grid grid-cols-3 gap-14">
          {articles?.map((item) => {
            return (
              <div key={item.id}>
                <ArticleDetails item={item} setArticles={setArticles} />
              </div>
            );
          })}
        </div>
      ) : responseStatus === 404 ? (
        <div className=" w-fit mx-auto  pt-10 pb-12 px-20 mt-20">
          <div className="w-fit mx-auto mb-4">
            <img src={errIcn} className="w-24 h-24" />
          </div>
          <div className="text-[#6D6F72] text-2xl">هیچ مقاله ای پیدا نشد.</div>
        </div>
      ) : (
        <div className="text-[#6D6F72] w-full text-2xl my-auto mx-auto h-full flex flex-col items-center justify-center mt-44">
          <img src={errIcn} className="mb-3 w-20 h-20 " />
          <span> در حال حاضر مقاله ای برای نمایش وجود ندارد.</span>
        </div>
      )}

      <div className="">
        {articles?.length !== 0 && (
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

export default Article;
