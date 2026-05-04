import React, { useState } from "react";
import Advanced from "./advanced";
import Daily from "./daily";

const Shipping = () => {
  const [selectedItem, setSelectedItem] = useState("advanced");
  return (
    <div className="w-[90%] mx-auto">
      <div className="relative">
        <div className="flex flex-row  ">
          <div
            className={`${
              selectedItem === "advanced"
                ? "border-b-4 border-b-red-700 text-[#221D23]"
                : "text-[#D9D9D9]"
            }  py-4  cursor-pointer`}
            onClick={() => setSelectedItem("advanced")}
          >
            تنظیمات پیشرفته
          </div>
          <div
            className={`${
              selectedItem === "daily"
                ? "border-b-4 border-b-red-700 text-[#221D23]"
                : "text-[#D9D9D9]"
            } mx-10 py-4  cursor-pointer`}
            onClick={() => setSelectedItem("daily")}
          >
            تنظیمات روزانه
          </div>
        </div>
        <div className="w-full border absolute bottom-[1px] -z-10" />
      </div>

      {selectedItem === "advanced" && (
        <div>
          <Advanced />
        </div>
      )}
      {selectedItem === "daily" && (
        <div>
          <Daily />
        </div>
      )}
    </div>
  );
};

export default Shipping;
