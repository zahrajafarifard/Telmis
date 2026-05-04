import React, { useState, useRef } from "react";

import addImageIcon from "../../../../assets/images/add_a_photo.svg";
import addIcon from "../../../../assets/images/Add_User.svg";
import deleteIcon from "../../../../assets/images/Trash.svg";
import editIcon from "../../../../assets/images/Edit-2.svg";
import checkIcon from "../../../../assets/images/check-01.svg";
import warningIcon from "../../../../assets/images/error2.svg";

const AddNewCategory = ({
  subCategories,
  setSubCategories,
  category,
  setCategory,
}) => {
  const inputSubCatRef = useRef({});
  const fileInputRef = useRef(null);
  const fileInputSubCatRefs = useRef([]); // Array to hold references for each subcategory input

  const handleSubCatClick = (id) => {
    inputSubCatRef.current[id]?.focus();
  };

  const addSubCategory = () => {
    setSubCategories((prevSubCategories) => [
      ...prevSubCategories,
      { id: Date.now(), name: "", image: "", file: "" },
    ]);
  };

  const handleSubCategoryChange = (index, value) => {
    const updatedSubCategories = [...subCategories];
    updatedSubCategories[index].name = value;
    setSubCategories(updatedSubCategories);
  };

  const deleteSubCategory = (id) => {
    const updatedSubCategories = subCategories.filter(
      (subCategory) => subCategory.id !== id
    );
    setSubCategories(updatedSubCategories);
  };

  const handleSubCategoryImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedSubCategories = [...subCategories];
        updatedSubCategories[index].image = reader.result;
        updatedSubCategories[index].file = file;
        setSubCategories(updatedSubCategories);
      };
      reader.readAsDataURL(file); // Read the image as a data URL
    }
  };

  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCategory((prev) => ({ ...prev, image: reader.result, file: file }));
      };
      reader.readAsDataURL(file); // Read the image as a data URL
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click(); // Trigger the hidden file input when the "افزودن تصویر" section is clicked
  };

  const handleSubCatImageClick = (index) => {
    fileInputSubCatRefs.current[index]?.click(); // Trigger the hidden file input for the specific subcategory
  };

  return (
    <div>
      <div
        style={{
          background: "linear-gradient(271deg, #F6B5B5 1.98%, #FFECEC 95.57%)",
        }}
        className="rounded-[10px] p-4 flex flex-row space-x-2 space-x-reverse justify-between mt-14"
      >
        <input
          value={category?.name}
          onChange={(e) => {
            setCategory((prev) => ({ ...prev, name: e.target.value }));
          }}
          className="text-[#221D23] text-2xl font-bold bg-transparent outline-none w-full"
        />

        <div className="bg-[#1DB592] rounded-full flex cursor-pointer">
          <img src={checkIcon} className="w-8 h-8 my-auto" />
        </div>
      </div>

      <div className="flex flex-row space-x-3 space-x-reverse">
        <div className="w-[20%] mx-auto my-3 flex flex-col space-y-3">
          <div className="bg-black flex flex-row justify-between py-2 px-3 rounded-[10px]">
            <div className="text-white leading-9">تصویر دسته بندی</div>

            <div
              onClick={handleImageClick}
              className="bg-white rounded-[4px] flex p-1 my-auto"
            >
              <img src={editIcon} className="w-5 h-5 my-auto" />
            </div>
          </div>

          {category.image ? (
            <div className="border border-[#919191] rounded-[10px] h-full flex flex-col justify-center items-center">
              <img
                src={category?.image}
                alt="Category Image"
                className="mx-auto w-[90%] h-[90%] object-contain"
              />
            </div>
          ) : (
            <div className="border border-[#919191] rounded-[10px] h-full flex flex-col justify-center items-center">
              <img
                src={addImageIcon}
                className="mx-auto w-14"
                loading="lazy"
                alt="Product Image"
              />

              <div onClick={handleImageClick} className="cursor-pointer mt-3">
                <div className="text-[#919191] text-center leading-9">
                  افزودن تصویر
                </div>
              </div>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleCategoryImageChange}
            style={{ display: "none" }}
          />
        </div>

        <div className="bg-[#F7F7F7] rounded-[15px] p-4 my-3 w-[80%]">
          <div className="flex flex-row justify-between border-b pb-5 border-[#d9d9d9]">
            <span className="text-[#221D23] text-2xl leading-9">
              زیر‌دسته ها
            </span>
            <div className="flex flex-row space-x-2 space-x-reverse">
              <div
                onClick={addSubCategory}
                className={`my-auto py-2  rounded-[50px] flex flex-row px-2 cursor-pointer
                    ${category?.name ? "bg-[#A60014] " : "bg-[#D9D9D9] "}`}
              >
                <img
                  src={addIcon}
                  className={`ml-2  ${category?.name ? "" : " brightness-50 "}`}
                />
                <span
                  className={`my-auto ${
                    category?.name ? "text-white" : "text-[#6D6F72]"
                  }`}
                >
                  افزودن زیر دسته
                </span>
              </div>
            </div>
          </div>

          {subCategories.length === 0 ? (
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
            subCategories.map((subCategory, index) => (
              <div
                key={subCategory.id}
                className={`${index === 0 && "mt-10"} mb-4`}
              >
                <div className="w-full flex flex-row space-x-4 space-x-reverse my-4 ">
                  <div className="bg-white border-[0.7px] border-[#E3E3E3] ml-4 p-1 w-14 mx-auto rounded-[1.5px]">
                    {subCategory?.image ? (
                      <img
                        src={subCategory?.image}
                        className="mx-auto w-full h-full object-contain p-0.5"
                        alt="Subcategory Image"
                      />
                    ) : (
                      <img
                        onClick={() => handleSubCatImageClick(index)} // Pass the index
                        src={addImageIcon}
                        className="mx-auto w-full h-full object-contain p-2"
                        alt="Add Subcategory Image"
                      />
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    ref={(el) => (fileInputSubCatRefs.current[index] = el)} // Update the reference for each subcategory
                    onChange={(e) => handleSubCategoryImageChange(e, index)}
                    style={{ display: "none" }}
                  />

                  <div className="leading-9 flex flex-row w-full space-x-2 space-x-reverse text-xl px-2 py-2 bg-white rounded-[4px]">
                    <input
                      ref={(el) =>
                        (inputSubCatRef.current[subCategory.id] = el)
                      }
                      value={subCategory?.name}
                      onChange={(e) =>
                        handleSubCategoryChange(index, e.target.value)
                      }
                      className="text-[#221D23] text-[20px] pr-2 bg-transparent outline-none w-full"
                    />

                    <div
                      onClick={() => handleSubCatClick(subCategory.id)}
                      className="bg-white rounded-[4px] pl-2 flex cursor-pointer "
                    >
                      <img src={editIcon} className="w-5 h-5 my-auto" />
                    </div>
                  </div>

                  <div
                    onClick={() => deleteSubCategory(subCategory.id)}
                    className="bg-white rounded-[4px] flex px-3 cursor-pointer"
                  >
                    <img src={deleteIcon} className="w-6 h-6 my-auto" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AddNewCategory;
