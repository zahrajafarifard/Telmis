import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import addIcon from "../../../../../assets/images/add-2.svg";
// import editIconRed from "../../../../assets/images/edit-red.svg";
// import fileIcon from "../../../../assets/images/file.svg";
import editIcon from "../../../../../assets/images/Edit-profile.svg";

const ImageUploader = ({
  id,
  previewImage,
  inputRef,
  handleFileUpload,
  fieldName,
  previewFieldName,
  triggerFileInput,
  image,
  isLoading,
}) => {
  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  const deleteProductImageHandler = async (id, imageField) => {
    let _response, _data;
    _response = await fetch(
      `${process.env.REACT_APP_URL}/products/deleteImage`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          id,
          imageField,
        }),
      }
    );

    switch (_response.status) {
      case 200:
        break;

      default:
        break;
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="h-full">
      <div className="bg-[#F7F7F7] rounded-[10px] h-24 mx-auto my-auto w-28 flex justify-center">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#A60014]"></div>
          </div>
        ) : previewImage ? (
          <div className="w-28 h-full relative">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full object-contain"
              loading="eager"
              onLoad={handleImageLoad}
            />
            <div
              onClick={() => triggerFileInput(inputRef)}
              className="absolute bottom-0.5 left-0.5 bg-[#A60014] rounded-[8px] p-[3px]"
            >
              <img src={editIcon} className="w-5 h-5" alt="Edit Icon" />
            </div>
          </div>
        ) : image ? (
          <div className="w-28 h-full relative">
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#A60014]"></div>
              </div>
            )}
            <img
              src={`${process.env.REACT_APP_URL}/uploads/product/${image
                ?.replace(/\\/g, "/")
                ?.split("/")
                ?.pop()}`}
              className="mx-auto w-full h-full my-auto object-contain"
              loading="lazy"
              onLoad={handleImageLoad}
              alt="Product Image"
            />

            <div
              onClick={() => triggerFileInput(inputRef)}
              className="absolute bottom-0.5 left-0.5 bg-[#A60014] rounded-[8px] p-[3px]"
            >
              <img src={editIcon} className="w-5 h-5" alt="Edit Icon" />
            </div>
          </div>
        ) : (
          <div
            onClick={() => triggerFileInput(inputRef)}
            className="flex flex-col justify-center items-center"
          >
            <img src={addIcon} className="w-9 h-9" alt="Add Icon" />

            <div className="text-sm text-[#919191] w-2/3 mx-auto leading-4 mt-2">
              افزودن تصاویر فرعی
            </div>
          </div>
        )}
      </div>
      {/* <div className="flex flex-row border border-t-0 rounded-b-[10px] py-4 px-5">
        <div
       
          className=" flex flex-row cursor-pointer"
        >
          <img src={editIconRed} className="w-6 h-6" alt="Add Button Icon" />

          <span className="text-[#A60014] underline mr-2">
            {previewImage || image ? "ویرایش" : "افزودن"} تصویر فرعی
          </span>
        </div>

        <span
          onClick={() => {
            deleteProductImageHandler(id, fieldName);
          }}
          className="text-[#A60014] underline mr-2 cursor-pointer"
        >
          حذف
        </span>
      </div> */}
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        style={{ display: "none" }}
        name={fieldName}
        onChange={(e) => handleFileUpload(e, fieldName, previewFieldName)}
      />
    </div>
  );
};

export default ImageUploader;
