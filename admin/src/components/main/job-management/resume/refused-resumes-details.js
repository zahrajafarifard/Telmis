import React, { useState, useEffect } from "react";
import moment from "moment-jalaali";
import ReactDOM from "react-dom";
import { useSelector } from "react-redux";

import modalImage from "../../../../assets/images/modalBack.png";
import downloadIconRed from "../../../../assets/images/download.svg";
import closeIcon from "../../../../assets/images/close.svg";
import DeleteRedIcon from "../../../../assets/images/refuse-red.svg";
import refuseIcon from "../../../../assets/images/refuse.svg";
import confirmIcon from "../../../../assets/images/confirm.svg";

const AllResumesDetails = ({ item, setCheckedResumes, setResumes }) => {
  const [fileName, setFileName] = useState("");
  const [isChecked, setIsChecked] = useState(false);

  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  useEffect(() => {
    const _fetchResume = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/resume/fetch-resume/${item.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      switch (response.status) {
        case 200:
          const data = await response.json();
          setFileName(data?.data);

          break;

        default:
          break;
      }
    };

    token && _fetchResume();
  }, [token]);

  const [showViewResumeModal, setShowViewResumeModal] = useState(false);

  const [showDeleteResumeModal, setShowDeleteResumeModal] = useState(false);

  const downloadResumeHandler = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/resume/downloadResume/${item?.id}`,
        {
          method: "GET",
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Extract filename from headers
      const disposition = response.headers.get("Content-Disposition");
      const fileName = disposition
        ? disposition.split("filename=")[1].replace(/['"]/g, "")
        : "downloadedFile";

      // Convert the response to blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // Set the filename dynamically
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      alert("There was an error downloading the file");
    }
  };

  const deleteResumeHandler = async () => {
    const response = await fetch(
      `${process.env.REACT_APP_URL}/resume/delete-resume/${item?.id}`,
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
        // const data = await response.json();
        setResumes((prevStates) => {
          return prevStates.filter((cv) => cv.id !== item.id);
        });

        break;

      default:
        break;
    }
  };

  const handleCheckboxChange = (newRequest) => {
    setIsChecked((prevChecked) => !prevChecked);
    setCheckedResumes((prevRequests) => {
      if (isChecked) {
        return prevRequests.filter((request) => request.id !== newRequest.id);
      } else {
        return [...prevRequests, newRequest];
      }
    });
  };

  const _deleteBox = (
    <div
      style={{
        background: `url(${modalImage})`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      className="w-2/3 text-white  mx-auto text-center bg-gradient-to-r from-[#640509] to-[#B71F26] pt-10 pb-12 px-16 font-Peyda rounded-[15px] "
    >
      <div className="text-2xl mb-3">حذف رزومه</div>
      <div style={{ direction: "rtl" }} className="mb-10 text-xl">
        شما در حال حذف رزومه کاربر هستید .
      </div>

      <div className="flex flex-row-reverse justify-center mt-14">
        <div
          onClick={() => {
            setShowDeleteResumeModal(false);
            deleteResumeHandler();
          }}
          className="text-[#221D23] bg-[#FFDA8A] w-1/3 py-1  rounded-[50px] ml-1 cursor-pointer"
        >
          تایید
        </div>
        <div
          onClick={() => setShowDeleteResumeModal(false)}
          className="bg-white text-[#919191] border border-white w-1/3 py-1 rounded-[50px] mr-1 cursor-pointer"
        >
          لغو
        </div>
      </div>
    </div>
  );
  return (
    <div className="grid grid-cols-7 justify-center items-center border w-full mx-auto my-7 py-4 rounded-[4px] border-[#D9D9D9]">
      <div>
        <input
          className="accent-[#B71F26] w-4 h-4 mx-auto my-auto  shadow-[0_2px_4px_0_rgba(133,146,163,0.4)]"
          type="checkbox"
          checked={isChecked}
          onChange={() => {
            handleCheckboxChange({
              id: item?.id,
            });
          }}
        />
      </div>
      <div className="text-[#221D23] text-sm">{item?.name}</div>
      <div className="text-[#221D23] text-sm">{item?.mobile}</div>
      <div className="text-[#221D23] text-sm">
        {moment(item?.updatedAt).format("jYYYY/jMM/jDD")}
      </div>
      <div className="flex flex-row space-x-4 space-x-reverse col-span-3 px-4">
        <div
          onClick={() => setShowDeleteResumeModal(true)}
          className="rounded-full bg-[#A60014] py-1.5 w-full flex flex-row space-x-2 space-x-reverse justify-center cursor-pointer"
        >
          <img src={refuseIcon} className="my-auto" />
          <span className="text-white text-sm my-auto"> حذف رزومه </span>
        </div>
        <div
          onClick={() => {
            setShowViewResumeModal(true);
          }}
          className="rounded-full bg-[#5951D2] py-1.5 w-full flex flex-row space-x-2 space-x-reverse justify-center cursor-pointer"
        >
          <img src={confirmIcon} className="my-auto" />
          <span className="text-white text-sm my-auto"> مشاهده رزومه </span>
        </div>
      </div>

      <div className={`${showDeleteResumeModal && " relative"} `}>
        {showDeleteResumeModal &&
          ReactDOM.createPortal(
            <div>
              <div
                className="w-full h-full bg-[#4c4c4c]   opacity-60 fixed top-0 left-0 z-20 "
                onClick={() => setShowDeleteResumeModal(false)}
              />

              <div className="w-1/2 z-30 fixed justify-center h-fit mx-auto inset-x-0 my-auto inset-y-0">
                {_deleteBox}
              </div>
            </div>,

            document.getElementById("modal")
          )}
      </div>

      <div className={`${showViewResumeModal && " relative"} `}>
        {showViewResumeModal &&
          ReactDOM.createPortal(
            <>
              <div
                className="w-full h-full bg-[#2C2C2C]   bg-opacity-[81%] fixed top-0 left-0 z-20 menu "
                onClick={() => {
                  setShowViewResumeModal(false);
                }}
              />

              <div className="z-30 fixed justify-center mx-auto inset-x-0 my-auto inset-y-0 font-Peyda w-[50%] h-1/2 ">
                <div className="bg-gradient-to-r to-[#B71F26] from-[#640509] px-8 py-3  rounded-t-[10px] ">
                  <div className="flex flex-row-reverse justify-between">
                    <div className="flex flex-row-reverse">
                      <div
                        onClick={downloadResumeHandler}
                        className="flex flex-row-reverse justify-center items-center  border bg-white text-sm w-fit px-4  rounded-full cursor-pointer"
                      >
                        <img
                          src={downloadIconRed}
                          className="w-5 h-5 my-auto "
                        />

                        <span className="text-[#A60014] mr-1">دانلود</span>
                      </div>

                      <div
                        onClick={() => {
                          setShowViewResumeModal(false);
                          setShowDeleteResumeModal(true);
                        }}
                        className="flex flex-row-reverse justify-center items-center text-[#640509] border bg-white text-sm w-fit px-2 py-1 mx-2 rounded-full cursor-pointer"
                      >
                        <img src={DeleteRedIcon} className="w-5 h-5 my-auto " />
                        <span className="text-[#A60014] my-auto mr-1">
                          حذف رزومه
                        </span>
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setShowViewResumeModal(false);
                      }}
                      className="my-auto cursor-pointer "
                    >
                      <img src={closeIcon} className="w-6 h-6 my-auto" />
                    </div>
                  </div>
                </div>

                <div className="relative w-full h-full rounded-b-[10px]  overflow-auto  mx-auto my-auto">
                  {fileName.split(".").pop().toLowerCase() === "pdf" ? (
                    <object
                      data={`${process.env.REACT_APP_URL}/uploads/resume/${fileName}`}
                      type="application/pdf"
                      width="100%"
                      height="100%"
                    ></object>
                  ) : (
                    <div className="text-white text-center relative w-full h-fit rounded-b-[10px] bg-slate-200 py-20">
                      <div
                        onClick={downloadResumeHandler}
                        style={{ direction: "rtl" }}
                        className=" w-fit bg-[#A60014] h-fit mx-auto rounded-full py-3 px-10 cursor-pointer"
                      >
                        دانلود رزومه (Word)
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>,

            document.getElementById("modal")
          )}
      </div>
    </div>
  );
};

export default AllResumesDetails;
