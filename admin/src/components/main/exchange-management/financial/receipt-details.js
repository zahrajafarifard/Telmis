import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

import moment from "moment-jalaali";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import modalImage from "../../../../assets/images/modalBack.png";
import viewIcon from "../../../../assets/images/view.svg";
import downloadIcon from "../../../../assets/images/download.svg";
import DeleteIcon from "../../../../assets/images/Trash.svg";
import EditIcon from "../../../../assets/images/edit-red.svg";
import downloadIconRed from "../../../../assets/images/download.svg";
import zoomInIcon from "../../../../assets/images/zoom-in.svg";
import zoomOutIcon from "../../../../assets/images/zoom-out.svg";
import closeIcon from "../../../../assets/images/close.svg";
import DownloadDoneIcon from "../../../../assets/images/download-done.svg";
import DeleteRedIcon from "../../../../assets/images/Trash.svg";
import EditRedIcon from "../../../../assets/images/edit-red.svg";
import CheckCircleIcon from "../../../../assets/images/Check_ring.svg";
import "./style.css";

const RecieptDetails = ({ receipt, index, setReceipts }) => {
  const navigate = useNavigate();
  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  const [zoom, setZoom] = useState(1);
  const [showViewReceiptModal, setShowViewReceiptModal] = useState(false);
  const [showDeleteReceiptModal, setShowDeleteReceiptModal] = useState(false);

  const zoomIn = () => {
    setZoom((prevZoom) => prevZoom + 0.1);
  };

  const zoomOut = () => {
    setZoom((prevZoom) => (prevZoom > 0.2 ? prevZoom - 0.1 : prevZoom));
  };

  const deleteReceiptHandler = async () => {
    let _response, _data;

    _response = await fetch(
      `${process.env.REACT_APP_URL}/exchange/delete-receipt`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          id: receipt?.id,
        }),
      }
    );

    switch (_response.status) {
      case 200:
        _data = await _response.json();

        setReceipts((prevStates) => {
          return prevStates?.filter((item) => item.id !== receipt?.id);
        });

      default:
        break;
    }
  };

  const downloadReceiptHandler = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/exchange/downloadReceipt/${
          receipt?.id
        }/${"admin"}`,
        {
          method: "GET",
          headers: {
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
  return (
    <div className="grid grid-cols-6 justify-center place-items-center py-2 text-[#221D23] text-sm border border-[#D9D9D9] border-opacity-50 rounded-[4px] my-6">
      <div className="bg-gradient-to-r to-[#B71F26] from-[#640509] text-white rounded-full w-6 h-6 flex mx-auto items-center justify-center ">
        {index + 1}
      </div>
      <div>{receipt?.title}</div>
      <div>{moment(receipt?.date).format("jYYYY/jMM/jDD")}</div>
      <div className="text-[#26AA2B]">
        {Number(receipt?.price).toLocaleString()}
      </div>
      <div>
        {receipt?.status ? (
          <div>
            <img src={DownloadDoneIcon} className="my-auto" />
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="flex flex-row ">
        <div
          onClick={() => {
            setShowViewReceiptModal(true);
          }}
          className="bg-[#221D23] w-8 h-8 my-auto rounded-full cursor-pointer flex justify-center items-center"
        >
          <img src={viewIcon} className="w-5 h-5 brightness-0 invert" />
        </div>
        <div
          onClick={downloadReceiptHandler}
          className="bg-[#1281DA] w-8 h-8 mx-2 my-auto rounded-full cursor-pointer flex justify-center items-center"
        >
          <img src={downloadIcon} className="w-5 h-5 brightness-0 invert" />
        </div>
        <div
          onClick={() => {
            navigate("/edit-receipt", { state: { id: receipt?.id } });
          }}
          className="bg-[#12B26C] w-8 h-8 my-auto ml-2 rounded-full cursor-pointer flex justify-center items-center"
        >
          <img src={EditIcon} className="w-5 h-5 brightness-0 invert" />
        </div>

        <div
          onClick={() => setShowDeleteReceiptModal(true)}
          className="bg-[#A60014] w-8 h-8 my-auto rounded-full cursor-pointer flex justify-center items-center"
        >
          <img src={DeleteIcon} className="w-5 h-5 brightness-0 invert" />
        </div>
      </div>

      <div className={`${showViewReceiptModal && " relative"} `}>
        {showViewReceiptModal &&
          ReactDOM.createPortal(
            <>
              <div
                className="w-full h-full bg-[#2C2C2C]   bg-opacity-[81%] fixed top-0 left-0 z-20 menu "
                onClick={() => {
                  setShowViewReceiptModal(false);
                }}
              />

              <div className="z-30 fixed justify-center mx-auto inset-x-0 my-auto inset-y-0 font-Peyda w-[50%] h-1/2">
                <div className="bg-gradient-to-r to-[#B71F26] from-[#640509] px-8 py-3  rounded-t-[10px] ">
                  <div className="flex flex-row-reverse justify-between">
                    <div className="flex flex-row-reverse">
                      <img
                        onClick={zoomIn}
                        src={zoomInIcon}
                        className="w-8 h-8 my-auto cursor-pointer"
                      />
                      <img
                        onClick={zoomOut}
                        src={zoomOutIcon}
                        className="w-8 h-8 mx-5 my-auto cursor-pointer"
                      />
                      <div
                        onClick={downloadReceiptHandler}
                        className="flex justify-center items-center text-[#640509] border bg-white text-sm font-bold w-10 h-10  rounded-full cursor-pointer"
                      >
                        <img
                          src={downloadIconRed}
                          className="w-5 h-5 my-auto "
                        />
                      </div>

                      <div
                        onClick={() => {
                          setShowViewReceiptModal(false);
                          navigate("/edit-receipt", {
                            state: { id: receipt?.id },
                          });
                        }}
                        className="flex justify-center items-center text-[#640509] border bg-white text-sm font-bold w-10 h-10 mx-2 rounded-full cursor-pointer"
                      >
                        <img src={EditRedIcon} className="w-5 h-5 my-auto " />
                      </div>
                      <div
                        onClick={() => {
                          setShowViewReceiptModal(false);
                          setShowDeleteReceiptModal(true);
                        }}
                        className="flex justify-center items-center text-[#640509] border bg-white text-sm font-bold w-10 h-10 rounded-full cursor-pointer"
                      >
                        <img src={DeleteRedIcon} className="w-6 h-6 my-auto " />
                      </div>
                    </div>
                    <div
                      onClick={() => {
                        setShowViewReceiptModal(false);
                      }}
                      className="my-auto cursor-pointer "
                    >
                      <img src={closeIcon} className="w-6 h-6 my-auto" />
                    </div>
                  </div>
                </div>

                <div className="relative w-full h-full rounded-b-[10px]  overflow-auto  mx-auto my-auto">
                  <img
                    style={{ transform: `scale(${zoom})` }}
                    src={`${process.env.REACT_APP_URL}/uploadedFiles/${
                      receipt?.company
                    }/receipts/${receipt.file.split(/[\/\\]/).pop()}`}
                    className="w-full  mx-auto my-auto"
                  />
                </div>
              </div>
            </>,

            document.getElementById("modal")
          )}
      </div>

      <div className={`${showDeleteReceiptModal && " relative"} `}>
        {showDeleteReceiptModal &&
          ReactDOM.createPortal(
            <div>
              <div
                className="w-full h-full bg-[#4c4c4c]   opacity-60 fixed top-0 left-0 z-20 "
                onClick={() => setShowDeleteReceiptModal(false)}
              />
              <div
                style={{
                  background: `url(${modalImage})`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
                className="font-Peyda rounded-[15px] py-10 px-20 w-1/3 z-30 fixed justify-center h-fit mx-auto inset-x-0 my-auto inset-y-0"
              >
                <div className=" w-full mx-auto">
                  <img src={CheckCircleIcon} className=" w-10 h-10 mx-auto" />
                </div>
                <div className="text-xl text-white mx-auto w-fit pt-3">
                  آیا از حذف این فاکتور مطمئن هستید؟
                </div>
                <div className="mt-10 flex flex-row w-[75%] mx-auto">
                  <div
                    onClick={() => setShowDeleteReceiptModal(false)}
                    className="border border-white bg-white text-center text-[#919191] text-lg mx-auto  py-2 rounded-[50px] cursor-pointer w-44 mr-2"
                  >
                    لغو
                  </div>

                  <div
                    onClick={() => {
                      setShowDeleteReceiptModal(false);
                      deleteReceiptHandler();
                    }}
                    className="bg-[#FFDA8A] text-[#221D23] text-center text-lg mx-auto py-2 rounded-[50px] cursor-pointer w-44 ml-2"
                  >
                    حذف
                  </div>
                </div>
              </div>
            </div>,

            document.getElementById("modal")
          )}
      </div>
    </div>
  );
};

export default RecieptDetails;
