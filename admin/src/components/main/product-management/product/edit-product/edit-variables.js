import React from "react";
import addIcon from "../../../../../assets/images/Add.svg";

const EditVariables = ({ variables, setVariables }) => {
  const AddVariablesHandler = () => {
    setVariables([...variables, { key: "", items: ["", "", "", "", ""] }]);
  };

  const handleTitleChange = (index, e) => {
    const updatedFormData = [...variables];
    updatedFormData[index].key = e.target.value;
    setVariables(updatedFormData);
  };

  const handleItemChange = (index, itemIndex, e) => {
    const updatedFormData = [...variables];
    updatedFormData[index].items[itemIndex] = e.target.value;
    setVariables(updatedFormData);
  };

  return (
    <div>
      <div className="flex flex-row justify-between space-x-2 space-x-reverse w-full my-8">
        <div className="text-[#1E1B1B] text-2xl my-auto">متغیرهای محصول</div>
        <hr className="flex flex-grow my-auto border-[#D9D9D9]" />

        <div
          onClick={AddVariablesHandler}
          className="my-auto py-2 rounded-[50px] flex flex-row px-4 cursor-pointer bg-[#A60014]"
        >
          <img
            src={addIcon}
            className="ml-2 w-5 h-5 my-auto invert brightness-0"
          />
          <span className="whitespace-nowrap text-white">افزودن متغیر</span>
        </div>
      </div>

      {variables.map((form, formIndex) => (
        <div key={formIndex} className="my-10">
          <div className="block text-[#1E1B1B] text-right mb-1">عنوان:</div>
          <div className="space-x-4 flex flex-row space-x-reverse">
            <input
              type="text"
              value={form.key}
              onChange={(e) => handleTitleChange(formIndex, e)}
              className="w-80 p-2 border border-[#D9D9D9] rounded outline-none placeholder:text-[#919191] text-[#221D23]"
              placeholder="عنوان را وارد کنید"
            />

            {[...Array(5)].map((_, itemIndex) => (
              <div key={itemIndex} className="my-auto">
                <input
                  type="text"
                  value={form.items[itemIndex] || ""}
                  onChange={(e) => handleItemChange(formIndex, itemIndex, e)}
                  className="w-full p-2 border border-[#D9D9D9] rounded outline-none placeholder:text-[#919191] text-[#221D23]"
                  placeholder={`آیتم ${itemIndex + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EditVariables;
