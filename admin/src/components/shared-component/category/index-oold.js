import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ReactDOM from "react-dom";

import CheckCircleIcon from "../../../assets/images/Check_ring.svg";
import addIcon2 from "../../../assets/images/Check_ring.svg";
import modalImage from "../../../assets/images/modalBack.png";
import catIcon from "../../../assets/images/Bookmark.svg";
import addIcon from "../../../assets/images/Add_ring.svg";
import editIcon from "../../../assets/images/Edit_red.svg";
import deleteIcon from "../../../assets/images/Remove.svg";
import WarningIcon from "../../../assets/images/error.svg";

const Category = ({ setReloading, reloading, categoryId, setCategoryId }) => {
  const [response, setResponse] = useState({ code: 0, msg: "" });

  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setResponse({ code: 0, msg: "" });
    }, 4000);

    return () => clearTimeout(timer);
  }, [response]);

  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [showCategory, setShowCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState({
    id: 0,
    type: "",
  });

  useEffect(() => {
    const _articleType = async () => {
      let _response, _data;
      _response = await fetch(
        `${process.env.REACT_APP_URL}/exchange/category/${categoryId}`,
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

    token && categoryId && _articleType();
  }, [token, categoryId, setEditingCategory]);

  useEffect(() => {
    const _articleType = async () => {
      let _response, _data;
      _response = await fetch(
        `${process.env.REACT_APP_URL}/exchange/categories`,
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
          setCategories(_data?.data);

          break;

        default:
          break;
      }
    };

    token && _articleType();
  }, [token, reloading, setCategories]);

  const deleteCategoryHandler = async () => {
    let _response, _data;
    _response = await fetch(
      `${process.env.REACT_APP_URL}/exchange/delete-cat`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          categoryId,
        }),
      }
    );

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
    setReloading(false);
    let _response;

    _response = await fetch(`${process.env.REACT_APP_URL}/exchange/add-cat`, {
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

        break;
      case 409:
        setReloading(true);
        setResponse({ code: 409, msg: "مقدار وارد شده تکراری می باشد" });
        break;

      case 500:
        setReloading(true);
        setResponse({ code: 500, msg: "خطای سمت سرور ، لطفا بعدا تلاش کنید" });
        break;

      default:
        setReloading(true);
        setResponse({ code: 500, msg: "خطای سمت سرور ، لطفا بعدا تلاش کنید" });
        break;
    }
  };
  const editCategoryHandler = async () => {
    setReloading(false);
    let _response;

    _response = await fetch(`${process.env.REACT_APP_URL}/exchange/edit-cat`, {
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
        setReloading(true);
        break;

      case 409:
        setReloading(true);
        setResponse({ code: 409, msg: "مقدار وارد شده تکراری می باشد" });
        break;

      case 500:
        setReloading(true);
        setResponse({ code: 500, msg: "خطای سمت سرور ، لطفا بعدا تلاش کنید" });
        break;

      default:
        setReloading(true);
        setResponse({ code: 500, msg: "خطای سمت سرور ، لطفا بعدا تلاش کنید" });
        break;
    }
  };

  const handleCheckboxChange = (id) => {
    setCategoryId((prevCategoryId) => (prevCategoryId === id ? null : id));
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
      <div className=" w-full ">
        <div className=" bg-[#F7F7F7] flex flex-row rounded-t-[10px] pr-10 py-4  ">
          <img src={catIcon} className="w-6 h-6 my-auto" />
          <span className="text-[#221D23] text-xl mr-2 my-auto">دسته بندی</span>
        </div>

        <div className="border border-t-0 max-h-[195px] overflow-auto">
          {categories?.map((item) => {
            return (
              <div key={item.id} className="w-full flex pr-10 py-4">
                <input
                  checked={categoryId === item.id} // Check if the current item is the selected one
                  onChange={() => handleCheckboxChange(item.id)}
                  type="checkbox"
                  className="my-auto accent-[#A60014] border border-[#A60014] w-5 h-5"
                />
                <span className="my-auto mr-2 text-[#7A7A7A] ">
                  {item?.type}
                </span>
              </div>
            );
          })}
        </div>

        <div className="rounded-b-[8px] border border-t-0 py-4 px-10  ">
          <div className="flex flex-row justify-between">
            <div
              onClick={() => {
                setShowCategory("add");
              }}
              className="flex mb-4 cursor-pointer"
            >
              <img src={addIcon} className="w-6 h-6" />
              <span className="text-[#A60014] underline mr-2">
                افزودن دسته جدید
              </span>
            </div>
            <div
              onClick={() => {
                setShowCategory("edit");
              }}
              className="flex mb-4 cursor-pointer"
            >
              <img src={editIcon} className="w-6 h-6" />
              <span className="text-[#A60014] underline mr-2">ویرایش </span>
            </div>
            <div
              onClick={() => {
                setShowDeleteCategoryModal(true);
              }}
              className="flex mb-4 cursor-pointer"
            >
              <img src={deleteIcon} className="w-6 h-6" />
              <span className="text-[#A60014] underline mr-2">حذف </span>
            </div>
          </div>

          {showCategory === "add" && (
            <div className="flex flex-row justify-between">
              <input
                value={newCategory}
                onChange={(e) => {
                  setNewCategory(e.target.value);
                }}
                placeholder="دسته بندی جدید را وارد کنید"
                className="bg-[#F7F7F7] text-[#8F8F8] p-4 text-xs w-[85%] rounded-[5px] focus:outline-none"
              />
              <div
                onClick={addCategoryHandler}
                className="bg-[#A60014] rounded-[4px] w-12 flex justify-center items-center cursor-pointer"
              >
                <img src={addIcon2} className="w-7 h-7" />
              </div>
            </div>
          )}
          {showCategory === "edit" && (
            <div className="flex flex-row justify-between">
              <input
                value={editingCategory.type}
                onChange={(e) => {
                  setEditingCategory((prev) => ({
                    ...prev,
                    type: e.target.value,
                  }));
                }}
                placeholder="دسته بندی جدید را وارد کنید"
                className="bg-[#F7F7F7] text-[#8F8F8] p-4 text-xs w-[85%] rounded-[5px] focus:outline-none"
              />
              <div
                onClick={editCategoryHandler}
                className="bg-[#A60014] rounded-[4px] w-12 flex justify-center items-center cursor-pointer"
              >
                <img src={addIcon2} className="w-7 h-7" />
              </div>
            </div>
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
