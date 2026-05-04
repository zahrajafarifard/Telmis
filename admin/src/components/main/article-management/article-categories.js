import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import ReactDOM from "react-dom";

import CheckCircleIcon from "../../../assets/images/Check_ring.svg";
import modalImage from "../../../assets/images/modalBack.png";
import searchIcon from "../../../assets/images/search-black.svg";
import addIcon2 from "../../../assets/images/Check_ring.svg";
import addIcon3 from "../../../assets/images/Add_User.svg";
import editIcon from "../../../assets/images/Edit_red.svg";
import deleteIcon from "../../../assets/images/Trash.svg";
import WarningIcon from "../../../assets/images/error.svg";
import arrowDownIcon from "../../../assets/images/arrow-down.svg";
import arrowUpIcon from "../../../assets/images/arrow-up.svg";

const Category = () => {
  const inputRef = useRef({});

  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");

  const [showCategories, setShowCategories] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [response, setResponse] = useState({ code: 0, msg: "" });

  const [addNewCategory, setAddNewCategory] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState({
    id: 0,
    type: "",
  });

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setResponse({ code: 0, msg: "" });
    }, 4000);

    return () => clearTimeout(timer);
  }, [response]);
  const handleClick = (id) => {
    setEditingCategory({
      id: inputRef.current[id].id,
      type: inputRef.current[id].value,
    });
    inputRef.current[id]?.focus();
  };

  useEffect(() => {
    const _cat = async () => {
      let _response, _data;
      _response = await fetch(
        `${process.env.REACT_APP_URL}/article-job-cat/${categoryId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      switch (_response.status) {
        case 200:
          _data = await _response.json();
          setEditingCategory({
            id: _data?.data?.id,
            type: _data?.data?.type,
          });

          break;

        default:
          break;
      }
    };

    token && categoryId && _cat();
  }, [token, categoryId, setEditingCategory]);

  useEffect(() => {
    const _cats = async () => {
      let _response, _data;
      _response = await fetch(`${process.env.REACT_APP_URL}/article-job-cat`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      switch (_response.status) {
        case 200:
          _data = await _response.json();
          setCategories(_data?.data);

          break;

        default:
          break;
      }
    };

    token && _cats();
  }, [token, reloading, setCategories]);

  const deleteCategoryHandler = async () => {
    let _response, _data;
    _response = await fetch(`${process.env.REACT_APP_URL}/article-job-cat`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        categoryId,
      }),
    });

    switch (_response.status) {
      case 200:
        _data = await _response.json();
        setCategories((prevStates) => {
          return prevStates?.filter((item) => item.id !== categoryId);
        });
        break;

      case 409:
        setResponse({ code: 409, msg: "شماقادر به حذف این دسته بندی نیستید" });
        break;

      default:
        setResponse({ code: 500, msg: "خطای سمت سرور ، لطفا بعدا تلاش کنید" });
        break;
    }
  };

  const addCategoryHandler = async () => {
    // setReloading(false);
    let _response;

    _response = await fetch(`${process.env.REACT_APP_URL}/article-job-cat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        newCategory,
      }),
    });

    switch (_response.status) {
      case 201:
        setNewCategory("");
        setReloading(true);
        setAddNewCategory(false);

        break;
      case 409:
        // setReloading(true);
        setResponse({ code: 409, msg: "مقدار وارد شده تکراری می باشد" });
        break;

      case 500:
        // setReloading(true);
        setResponse({ code: 500, msg: "خطای سمت سرور ، لطفا بعدا تلاش کنید" });
        break;

      default:
        // setReloading(true);
        setResponse({ code: 500, msg: "خطای سمت سرور ، لطفا بعدا تلاش کنید" });
        break;
    }
  };
  const editCategoryHandler = async () => {
    // setReloading(false);



    let _response;

    _response = await fetch(`${process.env.REACT_APP_URL}/article-job-cat`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        editingCategory,
      }),
    });

    switch (_response.status) {
      case 201:
        setNewCategory("");
        // setReloading(true);
        break;

      case 409:
        // setReloading(true);
        setResponse({ code: 409, msg: "مقدار وارد شده تکراری می باشد" });
        break;

      case 500:
        // setReloading(true);
        setResponse({ code: 500, msg: "خطای سمت سرور ، لطفا بعدا تلاش کنید" });
        break;

      default:
        // setReloading(true);
        setResponse({ code: 500, msg: "خطای سمت سرور ، لطفا بعدا تلاش کنید" });
        break;
    }
  };

  return (
    <div>
      {response.code !== 0 && (
        <div className="fixed top-8 right-0 w-fit whitespace-nowrap text-[#434242] text-sm flex flex-row bg-[#FFF099] py-2 pr-14 pl-24  rounded-sm my-auto">
          <img src={WarningIcon} alt="آیکن هشدار" className="my-auto w-6 h-6" />

          <div
            style={{ direction: "rtl" }}
            className="my-auto mr-2 text-[#D76B00]"
          >
            {response.msg}
          </div>
        </div>
      )}
      <div className="w-[90%] mx-auto">
        <div className="flex flex-row justify-between space-x-4 space-x-reverse  w-full mt-8 mb-14">
          <div className="text-[#1E1B1B] text-lg font-semibold my-auto">
            مدیریت دسته بندی مقالات
          </div>
          <hr className="flex flex-grow my-auto border-[#D9D9D9]" />
          <div className="my-auto  py-2  rounded-[50px] shadow-[0_4px_15px_2px_rgba(0,0,0,0.099)] flex flex-row px-2 cursor-pointer w-72">
            <img
              // onClick={() => searchHandler()}
              src={searchIcon}
              className="ml-1"
            />
            <input
              // value={searchItem}
              // onChange={(e) => setSearchItem(e.target.value)}
              placeholder="جست و جو"
              className="w-72 rounded-lg focus:outline-none"
            />
          </div>
        </div>

        <div className="bg-[#F7F7F7] rounded-[15px] p-4">
          <div className="flex flex-row justify-between">
            <span className="text-[#221D23] text-xl mr-2 my-auto">
              دسته بندی مقالات
            </span>
            <div className="flex flex-row">
              <div
                onClick={() => {
                  setAddNewCategory(true);
                  setShowCategories(true);
                }}
                className="bg-red-800 rounded-[4px] p-1"
              >
                <img src={addIcon3} className="w-8 h-8" />
              </div>
              <div
                onClick={() => {
                  setShowCategories((prev) => !prev);
                }}
                className="ml-2 bg-white rounded-[4px] p-1 mr-1"
              >
                <img
                  src={showCategories ? arrowDownIcon : arrowUpIcon}
                  className="w-8 h-8"
                />
              </div>
            </div>
          </div>
          {showCategories ? (
            <div className="border-t mt-4 pt-4 grid grid-cols-2 gap-4">
              {categories?.map((item) => {
                return (
                  <div key={item.id} className="flex flex-row">
                    <input
                      ref={(el) => (inputRef.current[item.id] = el)}
                      id={item?.id}
                      defaultValue={item?.type}
                      className="text-[#221D23] w-full px-2 rounded-[4px] text-xl outline-none"
                      readOnly={categoryId !== item.id}
                      onChange={(e) => {
                        setEditingCategory({
                          id: item.id,
                          type: e.target.value,
                        });
                      }}
                    />
                    <div
                      onClick={() => {
                        setCategoryId(item?.id);
                        setShowDeleteCategoryModal(true);
                      }}
                      className="bg-white rounded-[4px] p-1 mr-2 cursor-pointer"
                    >
                      <img src={deleteIcon} className="w-8 h-8" />
                    </div>
                    {categoryId == item?.id && editingCategory.type !== "" ? (
                      <div
                        onClick={() => {
                          editCategoryHandler();
                        }}
                        className="bg-white rounded-[4px] p-1 mr-2 flex justify-center items-center text-[#A60014] text-sm cursor-pointer"
                      >
                        ویرایش
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setCategoryId(item?.id);
                          handleClick(item?.id);
                        }}
                        className="bg-white rounded-[4px] p-1 mr-2 cursor-pointer"
                      >
                        <img src={editIcon} className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                );
              })}

              {addNewCategory && (
                <div className="flex flex-row space-x-2 space-x-reverse">
                  <input
                    value={newCategory}
                    className="text-[#221D23] w-full px-2 rounded-[4px] text-xl outline-none"
                    onChange={(e) => {
                      setNewCategory(e.target.value);
                    }}
                  />

                  <div
                    onClick={() => {
                      addCategoryHandler();
                    }}
                    className="rounded-[4px] py-2 px-4 bg-[#A60014] flex flex-row justify-center space-x-1 space-x-reverse"
                  >
                    <img src={addIcon2} className="w-6 h-6" />
                    <span className="text-white">ثبت</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className={`${showDeleteCategoryModal && " relative"} `}>
        {showDeleteCategoryModal &&
          ReactDOM.createPortal(
            <div>
              <div
                className="w-full h-full bg-[#4c4c4c]   opacity-60 fixed top-0 left-0 z-20 "
                onClick={() => setShowDeleteCategoryModal(false)}
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
                  آیا از حذف این دسته بندی مطمئن هستید؟
                </div>
                <div className="mt-10 flex flex-row w-[75%] mx-auto">
                  <div
                    onClick={() => setShowDeleteCategoryModal(false)}
                    className="border border-white bg-white text-center text-[#919191] text-lg mx-auto  py-2 rounded-[50px] cursor-pointer w-44 mr-2"
                  >
                    لغو
                  </div>

                  <div
                    onClick={() => {
                      setShowDeleteCategoryModal(false);
                      deleteCategoryHandler();
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

export default Category;
