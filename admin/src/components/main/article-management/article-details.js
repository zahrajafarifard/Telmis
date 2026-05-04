import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment-jalaali";

import dotsIconRed from "../../../assets/images/dots-red.svg";
import dotsIconGray from "../../../assets/images/dots-gray.svg";
import removeIcon from "../../../assets/images/Remove.svg";
import avatarIcon from "../../../assets/images/avatar.png";
import editIcon from "../../../assets/images/Edit.svg";
import modalImage from "../../../assets/images/modalBack.png";
import CheckCircleIcon from "../../../assets/images/Check_ring.svg";

const ArticleDetails = ({ item, setArticles }) => {
  const navigate = useNavigate();
  moment.loadPersian({ usePersianDigits: true, dialect: "persian-modern" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAction, setShowAction] = useState(0);
  const [articleId, setArticleId] = useState("");

  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  const deleteHandler = async () => {
    let _response, _data;

    _response = await fetch(
      `${process.env.REACT_APP_URL}/articles/delete-article`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          articleId,
        }),
      }
    );

    switch (_response.status) {
      case 200:
        _data = await _response.json();

        setArticles((prevStates) => {
          return prevStates?.filter((item) => item.id !== articleId);
        });

      default:
        break;
    }
  };
  return (
    <div
      key={item.id}
      className="rounded-[23px] px-5 py-7 flex flex-col justify-start"
      style={{
        borderRadius: "23px",
        backgroundImage: item?.mainImage
          ? `linear-gradient(to bottom, rgba(29,29,29,0.00), rgba(0,0,0,0.89)), url("${process.env.REACT_APP_URL}/uploads/article/${item?.mainImage}")`
          : "none", // Handle the case where there is no image
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <div className=" w-full flex  justify-end relative ">
        <div
          onClick={() => {
            setShowAction(item?.id);
          }}
          className="bg-white rounded-[4px] px-2 py-[7px]"
        >
          <img src={showAction === item?.id ? dotsIconRed : dotsIconGray} />
        </div>
        {showAction === item?.id && (
          <div>
            <div
              onClick={() => {
                setShowAction(0);
              }}
              className="fixed w-screen h-screen top-0 left-0  "
            />
            <div className="absolute top-12 left-0 w-32 bg-white rounded-[4px] p-3">
              <div
                onClick={() =>
                  navigate("/edit-article", { state: { id: item.id } })
                }
                className="flex flex-row mb-2 cursor-pointer"
              >
                <img src={editIcon} className="w-5 h-5 my-auto mx-auto ml-2" />
                <span className="text-[#363636] w-24  text-right text-sm my-auto">
                  ویرایش مقاله
                </span>
              </div>
              <div
                onClick={() => {
                  setArticleId(item?.id);
                  setShowDeleteModal(true);
                }}
                className="flex flex-row cursor-pointer"
              >
                <img
                  src={removeIcon}
                  className="w-5 h-5 my-auto mx-auto ml-2"
                />
                <span className="text-[#A60014] w-24 text-right text-sm my-auto">
                  حذف مقاله
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      <Link key={item.id} to={`/article/${item.id}`} className="cursor-pointer">
        <div className="bg-gradient-to-r from-[#A60014] to-[#600B0E] text-white w-fit  text-center px-5 py-2 rounded-[6px] mt-52 mb-4">
          {item?.ArticleType?.type}
        </div>
        <div className="text-white  text-2xl leading-[43px] font-[600] text-right ">
          {item.articleTitle}
        </div>

        <div className="flex flex-row-reverse justify-between my-auto">
          <div className="text-[#A3A3A3] leading-[31px] my-auto">
            {` ${moment(item.createdAt).format("jDD jMMMM ماه")} `}
          </div>
          <div className="flex flex-row justify-between">
            <div className="ml-4 w-14 h-14 rounded-full  my-auto">
              <img src={avatarIcon} alt="" />
            </div>
            <div>
              <div className="text-white  leading-[25px] font-bold text-right">
                {item.author}
              </div>

              <span className="text-[#A3A3A3]  text-xs text-right">
                نویسنده مقاله
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div className={`${showDeleteModal && " relative"} `}>
        {showDeleteModal &&
          ReactDOM.createPortal(
            <div>
              <div
                className="w-full h-full bg-[#4c4c4c]   opacity-60 fixed top-0 left-0 z-20 "
                onClick={() => setShowDeleteModal(false)}
              />

              <div
                style={{
                  background: `url(${modalImage})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
                className="font-Peyda rounded-[15px] py-10 px-20 w-1/3 z-30 fixed justify-center h-fit mx-auto inset-x-0 my-auto inset-y-0"
              >
                <div className=" w-full mx-auto">
                  <img src={CheckCircleIcon} className=" w-10 h-10 mx-auto" />
                </div>
                <div className="text-xl text-white mx-auto w-fit pt-3">
                  آیا از حذف این مقاله مطمئن هستید؟
                </div>
                <div className="mt-10 flex flex-row w-[75%] mx-auto">
                  <div
                    onClick={() => setShowDeleteModal(false)}
                    className="border border-white bg-white text-center text-[#919191] text-lg mx-auto  py-2 rounded-[50px] cursor-pointer w-44 mr-2"
                  >
                    لغو
                  </div>

                  <div
                    onClick={() => {
                      setShowDeleteModal(false);
                      deleteHandler();
                    }}
                    className="bg-[#FFDA8A] text-[#221D23] text-center text-lg mx-auto py-2 rounded-[50px] cursor-pointer w-44 ml-2"
                  >
                    حذف
                  </div>
                </div>
              </div>
            </div>,

            document.getElementById("modal")
          )}
      </div>
    </div>
  );
};

export default ArticleDetails;
