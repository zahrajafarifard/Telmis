import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import modalImage from "../../../../assets/images/modalBack.png";
import CheckCircleIcon from "../../../../assets/images/Check_ring.svg";

import addImageIcon from "../../../../assets/images/add_a_photo.svg";
import WarningIcon from "../../../../assets/images/error.svg";

import searchIcon from "../../../../assets/images/search-black.svg";
import addIcon from "../../../../assets/images/Add_User.svg";
import deleteIcon from "../../../../assets/images/Trash.svg";
import editIcon from "../../../../assets/images/Edit-2.svg";

import refreshIcon from "../../../../assets/images/Refresh_black.svg";
import warningIcon from "../../../../assets/images/error2.svg";

import AddNewCategory from "./add-new-category";

const Categories = () => {
  //////////////////
  const fileInputSubCatRefs = useRef([]);
  //////////////////

  const [response, setResponse] = useState({ code: 0, msg: "" });

  useEffect(() => {
    const timer = setTimeout(() => {
      setResponse({ code: 0, msg: "" });
    }, 4000);
    return () => clearTimeout(timer);
  }, [response]);

  const navigate = useNavigate();
  const inputRef = useRef({});
  const inputSubCatRef = useRef({});
  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");

  const [addNewCategory, setAddNewCategory] = useState(false);
  const [categoryId, setCategoryId] = useState(null);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCatIdForDeletion, setSelectedCatIdForDeletion] = useState([]);

  const [imagePreview, setImagePreview] = useState({});
  const [imageFiles, setImageFiles] = useState({});
  const [imageChanged, setImageChanged] = useState(false);

  const [subCategories, setSubCategories] = useState([]);
  const [category, setCategory] = useState({
    name: "",
    image: "",
    file: "",
  });

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  useEffect(() => {
    const _parents = async () => {
      let _response, _data;
      _response = await fetch(
        `${process.env.REACT_APP_URL}/categories/parents`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (_response.status === 200) {
        _data = await _response.json();
        setCategories(_data?.data);
      }
    };

    token && _parents();
  }, [token]);

  const deleteCategoryHandler = async () => {
    // Delete the category
    const updatedCategories = categories.filter(
      (category) => category.id !== categoryToDelete.id
    );
    setCategories(updatedCategories);
    setShowDeleteCategoryModal(false);
    setCategoryToDelete(null);
  };

  const deleteSubCategoryHandler = (categoryId, subCategoryId) => {
    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        const updatedSubCategories = category.subCategories.filter(
          (subCat) => subCat.id !== subCategoryId
        );
        return { ...category, subCategories: updatedSubCategories };
      }
      return category;
    });
    setCategories(updatedCategories);
  };

  const handleCategoryChange = (e, categoryId) => {
    const updatedCategories = categories.map((category) =>
      category.id === categoryId
        ? { ...category, name: e.target.value }
        : category
    );
    setCategories(updatedCategories);
  };

  const handleSubCategoryChange = (e, categoryId, subCategoryId) => {
    const updatedCategories = categories.map((category) => {
      if (category.id === categoryId) {
        const updatedSubCategories = category.subCategories.map((subCat) =>
          subCat.id === subCategoryId
            ? { ...subCat, name: e.target.value }
            : subCat
        );
        return { ...category, subCategories: updatedSubCategories };
      }
      return category;
    });
    setCategories(updatedCategories);
  };

  const handleClick = (id) => {
    inputRef.current[id]?.focus();
  };

  const handleSubCatClick = (id) => {
    inputSubCatRef.current[id]?.focus();
  };

  const handleImageChange = (categoryId, event) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview((prev) => ({
        ...prev,
        [categoryId]: previewUrl,
      }));
      setImageFiles((prev) => ({
        ...prev,
        [categoryId]: file,
      }));
      // setImageChanged(true);
    }
  };

  const handleEditClick = (categoryId) => {
    document.getElementById(`file-input-${categoryId}`).click();
  };

  const handleSubCategoryImageChange = (categoryId, subCategoryId, event) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview((prev) => ({
        ...prev,
        [`${categoryId}-${subCategoryId}`]: previewUrl,
      }));
      setImageFiles((prev) => ({
        ...prev,
        [subCategoryId]: file,
      }));
      // setImageChanged(true);
    }
  };

  const handleSubCategoryImageClick = (categoryId, subCategoryId) => {
    document
      .getElementById(`file-input-${categoryId}-${subCategoryId}`)
      .click();
  };

  const deleteHandler = async (catId) => {
    console.log("delete cat", catId);
    console.log("selectedCatIdForDeletion", selectedCatIdForDeletion);
    // If selectedCatIdForDeletion is an array, loop through each ID
    const catIdsToDelete =
      selectedCatIdForDeletion.length > 0
        ? selectedCatIdForDeletion
        : [catId || categoryId];

    for (let _catID of catIdsToDelete) {
      console.log("_catID", _catID);

      const response = await fetch(
        `${process.env.REACT_APP_URL}/categories/${_catID}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      switch (response.status) {
        case 200:
          setSubCategories((prevStates) =>
            prevStates.filter((prevState) => prevState.id !== categoryId)
          );
          break;

        case 403:
          setResponse({
            code: 409,
            msg: "شماقادر به حذف این دسته بندی نیستید",
          });
          break;

        default:
          setResponse({
            code: 500,
            msg: "خطای سمت سرور ، لطفا بعدا تلاش کنید",
          });

          break;
      }
    }
  };

  const addCategoryHandler = async () => {
    const filteredsubCategories = subCategories?.map(
      ({ image, id, ...rest }) => rest
    );
    const { image, ...filteredCategory } = category;

    let _response;
    const formData = new FormData();

    formData.append("name", filteredCategory?.name);
    formData.append("image", filteredCategory?.file);

    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    _response = await fetch(`${process.env.REACT_APP_URL}/categories/add`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body: formData,
    });

    switch (_response.status) {
      case 201:
        const _data = await _response.json();

        for (let subCat of filteredsubCategories) {
          const subCategoryFormData = new FormData();

          subCategoryFormData.append("parent", _data?.data);
          subCategoryFormData.append("name", subCat?.name);
          subCategoryFormData.append("image", subCat?.file);

          try {
            const _response = await fetch(
              `${process.env.REACT_APP_URL}/categories/addSubCategory`,
              {
                method: "POST",
                headers: {
                  Authorization: "Bearer " + token,
                },
                body: subCategoryFormData,
              }
            );

            switch (_response.status) {
              case 201:
                console.log("Sub-cats created successfully");

                break;

              default:
                console.error("Error creating sub-category:", _response.status);
                break;
            }
          } catch (error) {
            console.error("Error during fetch:", error);
          }
        }

        break;

      default:
        break;
    }
  };

  const EditSubCategoryHandler = async () => {
    let _response, _data;

    for (let cat of categories) {
      _response = await fetch(
        `${process.env.REACT_APP_URL}/categories/${cat.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            name: cat?.name,
          }),
        }
      );

      switch (_response.status) {
        case 200:
          const data = await _response.json();
          console.log("2000 cat name", cat.id, data?.data);

          for (let subCat of cat.subCategories) {
            if (subCat.parentId == data?.data) {
              const formData = new FormData();

              formData.append("categoryId", subCat?.id);
              formData.append("parent", data?.data);
              formData.append("name", subCat?.name);
              formData.append("image", subCat?.file);

              _response = await fetch(
                `${process.env.REACT_APP_URL}/categories/editSubCategory`,
                {
                  method: "PATCH",
                  headers: {
                    Authorization: "Bearer " + token,
                  },
                  body: formData,
                }
              );

              switch (_response.status) {
                case 200:
                  // navigate(-1);
                  break;
                case 403:
                  setResponse({
                    code: 403,
                    msg: "مقدار وارد شده برای زیر دسته تکراری می باشد",
                  });
                  break;
                default:
                  break;
              }
            }
          }
          break;

        case 403:
          setResponse({ code: 403, msg: "مقدار وارد شده تکراری می باشد" });
          break;

        case 500:
          setResponse({
            code: 500,
            msg: "خطای سمت سرور ، لطفا بعدا تلاش کنید",
          });
          break;

        default:
          break;
      }
    }

    // formData.append("categoryId", categoryId);
    // // formData.append("parent", categoryId);
    // // formData.append("name", subCategoryName);
    // // formData.append("image", imageFile);
    // for (let pair of formData.entries()) {
    //   console.log(pair[0], pair[1]);
    // }
    // _response = await fetch(
    //   `${process.env.REACT_APP_URL}/categories/editSubCategoryxx`,
    //   {
    //     method: "PATCH",
    //     headers: {
    //       Authorization: "Bearer " + token,
    //     },
    //     body: formData,
    //   }
    // );

    // switch (_response.status) {
    //   case 200:
    //     navigate(-1);
    //     break;

    //   default:
    //     break;
    // }
  };

  const addSubCategory = (categoryId) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) =>
        category.id === categoryId
          ? {
              ...category,
              subCategories: [
                ...category.subCategories,
                { id: Date.now(), name: "", image: "", file: "" },
              ],
            }
          : category
      )
    );
  };

  return (
    <div className="w-[90%] mx-auto">
      {response.code !== 0 && (
        <div
          style={{ direction: "rtl" }}
          className="fixed top-8 right-[20%] w-fit whitespace-nowrap text-[#434242] text-sm flex flex-row
           bg-[#FFF099] py-2 pr-14 pl-24  rounded-e-sm my-auto"
        >
          <img src={WarningIcon} alt="آیکن هشدار" className="my-auto w-6 h-6" />

          <div
            style={{ direction: "rtl" }}
            className="my-auto mr-2 text-[#D76B00]"
          >
            {response.msg}
          </div>
        </div>
      )}
      <div className="flex flex-row justify-between space-x-4 space-x-reverse  w-full mt-8 mb-14">
        <div className="text-[#1E1B1B] text-lg font-semibold my-auto">
          مدیریت دسته بندی ها
        </div>
        <hr className="flex flex-grow my-auto border-[#D9D9D9]" />
        <div className="my-auto  py-2  rounded-[50px] shadow-[0_4px_15px_2px_rgba(0,0,0,0.099)] flex flex-row px-2 cursor-pointer w-72">
          <img src={searchIcon} className="ml-1" />
          <input
            placeholder="جست و جو"
            className="w-72 rounded-lg focus:outline-none"
          />
        </div>
        <div
          onClick={() => setAddNewCategory(true)}
          className="my-auto bg-[#A60014] py-2  rounded-[50px] flex flex-row px-2 cursor-pointer"
        >
          <img src={addIcon} className="ml-2" />
          <span className="text-white  my-auto">افزودن دسته‌بندی جدید </span>
        </div>
      </div>

      {addNewCategory && (
        <AddNewCategory
          subCategories={subCategories}
          setSubCategories={setSubCategories}
          category={category}
          setCategory={setCategory}
        />
      )}

      {categories?.map((category) => {
        return (
          <div key={category.id}>
            <div
              style={{
                background:
                  "linear-gradient(271deg, #F6B5B5 1.98%, #FFECEC 95.57%)",
              }}
              className=" rounded-[10px] p-4 flex flex-row justify-between mt-14"
            >
              <input
                ref={(el) => (inputRef.current[category.id] = el)}
                value={category?.name}
                onChange={(e) => handleCategoryChange(e, category.id)}
                id={category?.id}
                className="text-[#221D23] text-2xl font-bold bg-transparent outline-none"
                readOnly={categoryId !== category.id}
              />

              <div className="flex flex-row">
                <div
                  onClick={() => {
                    setCategoryId(category?.id);
                    handleClick(category?.id);
                  }}
                  className="bg-white rounded-[4px] px-1 ml-2 flex cursor-pointer"
                >
                  <img src={editIcon} className="w-6 h-6 my-auto" />
                </div>

                <div
                  onClick={() => {
                    setCategoryId(category?.id);
                    setCategoryToDelete(category);
                    setShowDeleteCategoryModal(true);
                    setSelectedCatIdForDeletion((prev) => [
                      ...prev,
                      category?.id,
                    ]);
                  }}
                  className="bg-white rounded-[4px] flex px-1 cursor-pointer"
                >
                  <img src={deleteIcon} className="w-6 h-6 my-auto" />
                </div>
              </div>
            </div>

            <div className=" flex flex-row space-x-3 space-x-reverse">
              <div className="w-[20%] mx-auto my-3 flex flex-col  space-y-3">
                <div className="bg-black  flex flex-row justify-between py-2 px-3 rounded-[10px]">
                  <div className="text-white leading-9">تصویر دسته بندی</div>

                  <div
                    onClick={() => handleEditClick(category.id)}
                    className="bg-white rounded-[4px] flex p-1 my-auto"
                  >
                    <img src={editIcon} className="w-5 h-5 my-auto" />
                  </div>
                </div>

                <img
                  src={
                    imagePreview[category.id] ||
                    `${
                      process.env.REACT_APP_URL
                    }/uploads/product/${category?.image
                      ?.replace(/\\/g, "/")
                      ?.split("/")
                      ?.pop()}`
                  }
                  className="mx-auto w-[90%] h-full my-auto object-contain"
                  loading="lazy"
                  alt="Category Image"
                />

                <input
                  id={`file-input-${category.id}`}
                  type="file"
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={(e) => handleImageChange(category.id, e)}
                />
              </div>
              <div className="bg-[#F7F7F7] rounded-[15px] p-4 my-3 w-[80%]">
                <div className="flex flex-row justify-between border-b pb-5 border-[#d9d9d9]">
                  <span className="text-[#221D23] text-2xl leading-9">
                    زیر‌دسته ها
                  </span>
                  <div
                    onClick={() => addSubCategory(category.id)}
                    className="flex flex-row space-x-2 space-x-reverse"
                  >
                    <div className="my-auto bg-[#A60014] py-2  rounded-[50px] flex flex-row px-2 cursor-pointer">
                      <img src={addIcon} className="ml-2" />
                      <span className="text-white  my-auto">
                        افزودن زیر دسته
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-10 mb-4">
                  {category?.subCategories?.length === 0 ? (
                    <div className="w-fit mx-auto py-10">
                      <img
                        src={warningIcon}
                        alt="warning icon"
                        className="w-16 h-16 mx-auto mb-3"
                      />
                      <span className="text-[#6D6F72] text-[20px]">
                        در حال حاضر زیر دسته ای ندارید
                      </span>
                    </div>
                  ) : (
                    category?.subCategories?.map((subCat) => {
                      return (
                        <div key={subCat?.id}>
                          <div className=" w-full flex flex-row space-x-4 space-x-reverse my-4 ">
                            <div
                              className="bg-white border-[0.7px] border-[#E3E3E3] ml-4 p-1 w-14 mx-auto rounded-[1.5px] relative"
                              onClick={() =>
                                handleSubCategoryImageClick(
                                  category.id,
                                  subCat.id
                                )
                              }
                            >
                              {subCat?.image ? (
                                <img
                                  src={
                                    imagePreview[
                                      `${category.id}-${subCat.id}`
                                    ] ||
                                    `${
                                      process.env.REACT_APP_URL
                                    }/uploads/product/${subCat?.image
                                      ?.replace(/\\/g, "/")
                                      ?.split("/")
                                      .pop()}`
                                  }
                                  className="mx-auto w-full h-full object-contain"
                                  alt="Subcategory Image"
                                />
                              ) : (
                                <div>add image</div>
                              )}

                              <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-gray-700 bg-opacity-50 text-white font-semibold text-sm">
                                تغییر تصویر
                              </div>
                            </div>

                            <input
                              id={`file-input-${category.id}-${subCat.id}`}
                              type="file"
                              style={{ display: "none" }}
                              accept="image/*"
                              onChange={(e) =>
                                handleSubCategoryImageChange(
                                  category.id,
                                  subCat.id,
                                  e
                                )
                              }
                            />

                            <div className="leading-9 flex flex-wrap w-full justify-between text-xl px-2 py-2 bg-white rounded-[4px]">
                              <input
                                ref={(el) =>
                                  (inputSubCatRef.current[subCat.id] = el)
                                }
                                value={subCat?.name}
                                onChange={(e) =>
                                  handleSubCategoryChange(
                                    e,
                                    category.id,
                                    subCat.id
                                  )
                                }
                                id={subCat?.id}
                                className="text-[#221D23] text-[20px] pr-2 bg-transparent outline-none"
                                // readOnly={categoryId !== subCat.id}
                              />

                              <div
                                onClick={() => {
                                  setCategoryId(subCat?.id);
                                  handleSubCatClick(subCat?.id);
                                }}
                                className="bg-white rounded-[4px] pl-2 flex cursor-pointer "
                              >
                                <img
                                  src={editIcon}
                                  className="w-5 h-5 my-auto"
                                />
                              </div>
                            </div>
                            <div
                              onClick={() => {
                                deleteSubCategoryHandler(
                                  category.id,
                                  subCat.id
                                );

                                setSelectedCatIdForDeletion((prev) => [
                                  ...prev,
                                  subCat?.id,
                                ]);
                              }}
                              className="bg-white rounded-[4px] flex px-3 cursor-pointer"
                            >
                              <img
                                src={deleteIcon}
                                className="w-6 h-6 my-auto"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="flex flex-row justify-center space-x-4 space-x-reverse my-20">
        <div
          onClick={() => {
            // addCategoryHandler();
            // deleteHandler();
            EditSubCategoryHandler();
          }}
          className="bg-[#A60014] w-1/3 flex flex-row justify-center rounded-[50px] cursor-pointer"
        >
          <img
            src={CheckCircleIcon}
            className="w-6 h-6 brightness-0 invert my-auto"
          />
          <span className="text-white mr-2 py-2 my-auto"> ذخیره اطلاعات</span>
        </div>
        <div
          onClick={() => {
            setAddNewCategory(false);
            console.log("cancle", categories);
          }}
          className="border border-[#221D23] rounded-[50px]  w-1/3 flex flex-row justify-center cursor-pointer"
        >
          <img src={refreshIcon} className="w-6 h-6 my-auto " />
          <span className="text-[#221D23] mr-2 py-2 my-auto"> تنظیم مجدد</span>
        </div>
      </div>

      <div className={`${showDeleteCategoryModal && " relative"} `}>
        {showDeleteCategoryModal &&
          ReactDOM.createPortal(
            <div>
              <div
                className="w-full h-full bg-[#4c4c4c] opacity-60 fixed top-0 left-0 z-20 "
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
                    className="border border-white bg-white text-center text-[#919191] text-lg mx-auto py-2 rounded-[50px] cursor-pointer w-44 mr-2"
                  >
                    لغو
                  </div>

                  <div
                    onClick={() => {
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

export default Categories;
