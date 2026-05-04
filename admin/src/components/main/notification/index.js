import React, { useState } from "react";

import ExchangeRegistration from "./exchange-registration";
import UserProfile from "./user-profile";
import Financial from "./financial";

const Notification = () => {
  const [selectedItem, setSelectedItem] = useState("new-user");
  return (
    <div className="w-[90%] mx-auto">
      <div className="relative">
        <div className="flex flex-row  ">
          <div
            className={`${
              selectedItem === "new-user"
                ? "border-b-4 border-b-red-700 text-[#221D23]"
                : "text-[#D9D9D9]"
            }  py-4  cursor-pointer`}
            onClick={() => setSelectedItem("new-user")}
          >
            کاربران جدید
          </div>
          <div
            className={`${
              selectedItem === "profile"
                ? "border-b-4 border-b-red-700 text-[#221D23]"
                : "text-[#D9D9D9]"
            } mx-10 py-4  cursor-pointer`}
            onClick={() => setSelectedItem("profile")}
          >
            پروفایل کاربران
          </div>
          <div
            className={`${
              selectedItem === "financial"
                ? "border-b-4 border-b-red-700 text-[#221D23]"
                : "text-[#D9D9D9]"
            }  py-4 cursor-pointer`}
            onClick={() => setSelectedItem("financial")}
          >
            مالی
          </div>
        </div>
        <div className="w-full border absolute bottom-[1px] -z-10" />
      </div>

      {selectedItem === "new-user" && (
        <div>
          <ExchangeRegistration />
        </div>
      )}
      {selectedItem === "profile" && (
        <div>
          <UserProfile />
        </div>
      )}
      {selectedItem === "financial" && (
        <div>
          <Financial />
        </div>
      )}
    </div>
  );
};

export default Notification;
