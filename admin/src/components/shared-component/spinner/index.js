import React from "react";
import "./Spinner.css";

const Spinner = () => {
  return (
    <div className="flex flex-col bg-white w-[70%] py-11 mx-auto rounded-sm">
      <div className="spinner-container mx-auto">
        <div className="background-image"></div>

        <div className="bouncing-circle"></div>
      </div>

      <div
        style={{ direction: "rtl" }}
        className="w-fit font-semibold text-[#b71f26] mx-auto pt-10 font-Peyda  flex flex-row my-auto"
      >
        در حال بارگزاری فایل(ها)
        <div className="animate-pulse text-2xl my-auto -mt-1 mr-2">...</div>
      </div>
    </div>
  );
};

export default Spinner;
