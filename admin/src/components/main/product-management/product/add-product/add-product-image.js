import React from "react";

import editIcon from "../../../../../assets/images/Edit-profile.svg";
import addIcon from "../../../../../assets/images/add-2.svg";
// import editIconRed from "../../../../assets/images/edit-red.svg";
// import addIcon2 from "../../../../assets/images/Add_ring.svg";
// import fileIcon from "../../../../assets/images/file.svg";

const ImageUploader = ({
  previewImage,
  inputRef,
  handleFileUpload,
  fieldName,
  previewFieldName,
  triggerFileInput,
}) => {
  return (
    <div className=" h-full">
      <div className="bg-[#F7F7F7] rounded-[10px] h-24 mx-auto my-auto w-full flex justify-center">
        {previewImage ? (
          <div className="w-28 h-full relative">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full object-contain"
            />
            <div
              onClick={() => triggerFileInput(inputRef)}
              className="absolute bottom-0.5 left-0.5 bg-[#A60014] rounded-[8px] p-[3px]"
            >
              <img src={editIcon} className="w-5 h-5" alt="Edit Icon" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <img
              onClick={() => triggerFileInput(inputRef)}
              src={addIcon}
              className="w-9 h-9"
              alt="Add Icon"
            />
            <div className="text-sm text-[#919191] w-2/3 mx-auto leading-4 mt-2">
              افزودن تصاویر فرعی
            </div>
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        name={fieldName}
        ref={inputRef}
        style={{ display: "none" }}
        onChange={(e) => handleFileUpload(e, fieldName, previewFieldName)}
      />
    </div>
  );
};

export default ImageUploader;
