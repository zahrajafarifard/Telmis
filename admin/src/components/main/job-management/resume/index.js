import React, { useState } from "react";

import AllResumes from "./all-resumes";
import RefusedResumes from "./refused-resumes";
import AcceptedResumes from "./accepted-resumes";

const Resume = () => {
  const [selectedItem, setSelectedItem] = useState("resumes");

  return (
    <div className="w-[90%] mx-auto">
      <div className="relative">
        <div className="flex flex-row ">
          <div
            className={`${
              selectedItem === "resumes"
                ? "border-b-4 border-b-red-700 text-[#221D23]"
                : "text-[#D9D9D9]"
            } py-4 cursor-pointer`}
            onClick={() => setSelectedItem("resumes")}
          >
            همه رزومه ها
          </div>

          <div
            className={`${
              selectedItem === "accepted-resumes"
                ? "border-b-4 border-b-red-700 text-[#221D23]"
                : "text-[#D9D9D9]"
            } mx-10 py-4 cursor-pointer`}
            onClick={() => setSelectedItem("accepted-resumes")}
          >
            رزومه های تایید شده
          </div>

          <div
            className={`${
              selectedItem === "refused-resumes"
                ? "border-b-4 border-b-red-700 text-[#221D23]"
                : "text-[#D9D9D9]"
            }  py-4  cursor-pointer`}
            onClick={() => setSelectedItem("refused-resumes")}
          >
            رزومه های رد شده
          </div>
        </div>
        <div className="w-full border absolute bottom-[1px] -z-10" />
      </div>

      {selectedItem === "resumes" && (
        <div>
          <AllResumes />
        </div>
      )}
      {selectedItem === "refused-resumes" && (
        <div>
          <RefusedResumes />
        </div>
      )}
      {selectedItem === "accepted-resumes" && (
        <div>
          <AcceptedResumes />
        </div>
      )}
    </div>
  );
};

export default Resume;
