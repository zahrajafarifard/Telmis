import React, { useState, useEffect } from "react";

import { useSelector } from "react-redux";

import Details from "./details";
import checkIcon from "../../../../../assets/images/Check_ring.svg";
// import closeIcon from "../../../../../assets/images/user.svg";
import refuseIcon from "../../../../../assets/images/refuse.svg";
import ErrIcon from "../../../../../assets/images/error2.svg";
import nameIcn from "../../../../../assets/images/account_circle.svg";
import phoneIcn from "../../../../../assets/images/file.svg";
import calendarIcn from "../../../../../assets/images/Calendar.svg";
import actionIcn from "../../../../../assets/images/actions.svg";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");
  const [checkedComments, setCheckedComments] = useState([]);
  const [message, setMessage] = useState("");
  const [unconfirmedComments, setUnconfirmedComments] = useState(0);

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [message]);

  useEffect(() => {
    const fetchedComment = async () => {
      let _response, _data;
      _response = await fetch(
        `${process.env.REACT_APP_URL}/products/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({}),
        }
      );

      switch (_response.status) {
        case 200:
          _data = await _response.json();

          console.log(_data?.unconfirmedByAdmin);

          setUnconfirmedComments(_data?.unconfirmedByAdmin);

          setComments(_data?.data);
          break;

        default:
          break;
      }
    };
    token && fetchedComment();
  }, [token, setComments]);

  const confirmCommentHandler = async () => {
    let _response;

    _response = await fetch(
      `${process.env.REACT_APP_URL}/products/confirm-comments`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },

        body: JSON.stringify({
          comments: checkedComments,
        }),
      }
    );

    switch (_response.status) {
      case 201:
        checkedComments?.map((req) => {
          return setComments((prevStates) => {
            return prevStates.filter((item) => item.id !== req.id);
          });
        });

        setCheckedComments("");

        break;

      default:
        break;
    }
  };

  const denyCommentHandler = async () => {
    let _response;

    _response = await fetch(
      `${process.env.REACT_APP_URL}/products/refuse-comments`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },

        body: JSON.stringify({
          comments: checkedComments,
        }),
      }
    );

    switch (_response.status) {
      case 200:
        checkedComments?.map((req) => {
          return setComments((prevStates) => {
            return prevStates.filter((item) => item.id !== req.id);
          });
        });

        setCheckedComments("");
        break;

      default:
        break;
    }
  };
  return (
    <div className="w-[90%] mx-auto">
      <div className="rounded-[8px] p-8 ">
        <div className="flex flex-row justify-between  space-x-4 space-x-reverse w-full mb-10">
          <div className="text-[#1E1B1B] text-lg font-semibold my-auto ">
            لیست دیدگاه کاربران
          </div>
          <hr className="flex flex-grow my-auto border-[#D9D9D9]" />

          <div className="text-[#8F8F8F] text-sm my-auto">
            {unconfirmedComments} دیدگاه جدید
          </div>
        </div>
        <div className="grid grid-cols-8 bg-[#F7F7F7]  text-[#919191] py-2 justify-center rounded-[4px]">
          <div className="text-center">گزینه</div>
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
            <span className="my-auto mr-2">نظر </span>
          </div>
          <div className="text-center flex flex-row justify-center items-center">
            {/* <img src={phoneIcn} className="my-auto" /> */}
            <span className="my-auto mr-2">امتیاز </span>
          </div>
          <div className="text-center flex flex-row justify-center items-center">
            <img src={calendarIcn} className="my-auto" />
            <span className="my-auto mr-2">تاریخ </span>
          </div>

          <div>
            {checkedComments?.length !== 0 ? (
              <div className="text-center flex flex-row justify-center">
                <div
                  onClick={confirmCommentHandler}
                  className="w-1/2 bg-[#A60014] text-white text-sm my-auto flex flex-row justify-center p-1 rounded-[50px] cursor-pointer"
                >
                  <img src={checkIcon} className="w-4 h-4 my-auto ml-2" />
                  تایید
                </div>
                <div
                  onClick={denyCommentHandler}
                  className="w-1/2 text-white bg-[#221D23] text-sm my-auto flex flex-row justify-center mr-2 p-1 rounded-[100px] cursor-pointer whitespace-nowrap"
                >
                  <img src={refuseIcon} className="w-4 h-4 my-auto ml-2" />
                  رد کردن
                </div>
              </div>
            ) : (
              <div className="text-center flex flex-row justify-center items-center">
                <img src={actionIcn} className="my-auto" />
                <span className="my-auto mr-2">عملیات </span>
              </div>
            )}
          </div>
        </div>
        <div className="">
          {comments?.length !== 0 ? (
            comments?.map((item) => {
              return (
                <div key={item.id}>
                  <Details
                    setComments={setComments}
                    id={item.id}
                    name={item.name}
                    mail={item.mail}
                    rating={item.rating}
                    comment={item.text}
                    date={item.createdAt}
                    setCheckedComments={setCheckedComments}
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
    </div>
  );
};

export default Comments;
