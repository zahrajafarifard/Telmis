import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import Details from "./details";
import ErrIcon from "../../../assets/images/error2.svg";
import nameIcn from "../../../assets/images/account_circle.svg";
import calendarIcn from "../../../assets/images/Calendar.svg";
import Pagination from "../../shared-component/pagination";

const Comments = () => {
  const [comments, setComments] = useState([]);

  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");
  const [totalItems, settTotalItems] = useState(0);
  const itemsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  useEffect(() => {
    const fetchedComment = async () => {
      let _response, _data;
      _response = await fetch(`${process.env.REACT_APP_URL}/contact-us`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          page: currentPage,
          pageSize: itemsPerPage,
        }),
      });

      switch (_response.status) {
        case 200:
          _data = await _response.json();

          settTotalItems(_data?.data?.count || 0);
          setComments(_data?.data?.rows || []);
          break;

        default:
          break;
      }
    };
    token && fetchedComment();
  }, [
    token,
    setComments,
    currentPage,
    itemsPerPage,
    settTotalItems,
    setCurrentPage,
  ]);

  const handlePageChange = (page) => {
    if (page !== "...") {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-[90%] mx-auto">
      <div className="rounded-[8px] p-8 ">
        <div className="flex flex-row justify-between  space-x-4 space-x-reverse w-full mb-10">
          <div className="text-[#1E1B1B] text-lg font-semibold my-auto whitespace-nowrap">
            ارتباط با ما
          </div>
          <hr className="w-full flex flex-grow my-auto border-[#D9D9D9]" />
        </div>
        <div className="grid grid-cols-6 bg-[#F7F7F7]  text-[#919191] py-2 justify-center rounded-[4px]">
          <div className="text-center">ردیف</div>
          <div className="text-center flex flex-row justify-center items-center">
            <img src={nameIcn} className="my-auto" />
            <span className="my-auto mr-2">نام</span>
          </div>
          <div className="text-center flex flex-row justify-center items-center">
            {/* <img src={phoneIcn} className="my-auto" /> */}
            <span className="my-auto mr-2"> ایمیل</span>
          </div>
          <div className="text-center flex flex-row justify-center items-center col-span-2">
            {/* <img src={phoneIcn} className="my-auto" /> */}
            <span className="my-auto mr-2">متن پیام </span>
          </div>

          <div className="text-center flex flex-row justify-center items-center">
            <img src={calendarIcn} className="my-auto" />
            <span className="my-auto mr-2">تاریخ </span>
          </div>
        </div>
        <div className="">
          {comments?.length !== 0 ? (
            comments?.map((item, index) => {
              return (
                <div key={item.id}>
                  <Details
                    setComments={setComments}
                    id={item.id}
                    name={item.name}
                    mobile={item.mobile}
                    comment={item.message}
                    date={item.createdAt}
                    index={index}
                  />
                </div>
              );
            })
          ) : (
            <div className="pt-10 pb-12 px-20 w-fit mx-auto  mt-12">
              <img src={ErrIcon} className="w-24 h-24 mx-auto" />
              <div className="text-[#6D6F72] text-2xl">
                در حال حاضر نظر وجود ندارد .
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="">
        {comments?.length !== 0 && (
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

export default Comments;
