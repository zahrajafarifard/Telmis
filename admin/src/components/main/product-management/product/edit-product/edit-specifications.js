import React, { useEffect } from "react";
import infoIcon from "../../../../../assets/images/Info.svg";
import starIcon from "../../../../../assets/images/Star.svg";
import starIcon2 from "../../../../../assets/images/Star (1).svg";

const EditProductSpecifications = ({ specifications, setSpecifications }) => {
  useEffect(() => {
    // Fill up to 4 specs if fewer
    if (specifications.length < 4) {
      const filled = [...specifications];
      while (filled.length < 4) {
        filled.push({ key: "", value: "", selected: false });
      }
      setSpecifications(filled);
    }
  }, [specifications, setSpecifications]);

  const handleInputChange = (index, field, value) => {
    const updatedSpecifications = [...specifications];
    updatedSpecifications[index][field] = value;
    setSpecifications(updatedSpecifications);
  };

  const toggleSelection = (index) => {
    const updatedSelection = [...specifications];
    const selectedCount = updatedSelection.filter(
      (spec) => spec.selected
    ).length;

    if (selectedCount >= 3 && !updatedSelection[index].selected) {
      alert("You can select a maximum of 3 items.");
      return;
    }

    updatedSelection[index].selected = !updatedSelection[index].selected;
    setSpecifications(updatedSelection);
  };

  return (
    <div>
      <div className="flex flex-row justify-between space-x-2 space-x-reverse w-full my-8">
        <div className="text-[#1E1B1B] text-2xl my-auto">مشخصات محصول </div>
        <hr className="flex flex-grow my-auto border-[#D9D9D9]" />
      </div>

      <div className="flex flex-row my-10">
        <img src={infoIcon} className="w-6 h-6 my-auto ml-3" />
        <div className="text-[#6D6F72] my-auto">
          با ستاره دار کردن مشخصات، آنها در بخش هدر سایت نمایش داده می شوند.
          می‌توانید حداکثر سه آیتم را انتخاب کنید.
        </div>
      </div>

      {specifications?.map((spec, index) => (
        <div className="flex flex-row space-x-3 w-full" key={index}>
          <img
            src={spec.selected ? starIcon2 : starIcon}
            className="w-8 h-8 ml-3 mt-12 cursor-pointer"
            onClick={() => toggleSelection(index)}
            alt="star-icon"
          />
          <div className="w-full">
            <div className="text-[#221D23] text-[20px] mb-2 text-right">
              {`عنوان مشخصه ${index + 1}`}
            </div>
            <input
              className="w-full p-4 text-[#221D23] placeholder:text-[#919191] bg-[#F7F7F7] rounded-[8px] outline-none"
              placeholder={`عنوان مشخصه ${index + 1}`}
              value={spec.key}
              onChange={(e) => handleInputChange(index, "key", e.target.value)}
            />
          </div>
          <div className="w-full">
            <div className="text-[#221D23] text-[20px] mb-2 text-right">
              جزئیات
            </div>
            <input
              className="w-full p-4 text-[#221D23] placeholder:text-[#919191] bg-[#F7F7F7] rounded-[8px] outline-none"
              placeholder={`جزییات مشخصه ${index + 1}`}
              value={spec.value}
              onChange={(e) =>
                handleInputChange(index, "value", e.target.value)
              }
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default EditProductSpecifications;
