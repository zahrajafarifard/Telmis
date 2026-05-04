import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import ReactDOM from "react-dom";

import CheckCircleIcon from "../../../../assets/images/Check_ring.svg";
import modalImage from "../../../../assets/images/modalBack.png";
import searchIcon from "../../../../assets/images/search-black.svg";
import addIcon2 from "../../../../assets/images/Check_ring.svg";
import addIcon3 from "../../../../assets/images/Add_User.svg";
import editIcon from "../../../../assets/images/Edit_red.svg";
import deleteIcon from "../../../../assets/images/Trash.svg";
import WarningIcon from "../../../../assets/images/error.svg";
import arrowDownIcon from "../../../../assets/images/arrow-down.svg";
import arrowUpIcon from "../../../../assets/images/arrow-up.svg";

const MilitaryService = () => {
  const inputRef = useRef({});

  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState("");

  const [showCategories, setShowCategories] = useState(false);
  const [reloading, setReloading] = useState(false);
  const [militaryServiceId, setMilitaryServiceId] = useState(null);
  const [response, setResponse] = useState("");

  const [addNewMilitaryService, setAddNewMilitaryService] = useState(false);
  const [showDeleteMilitaryServiceModal, setShowDeleteMilitaryServiceModal] =
    useState(false);

  const [militaryServices, setMilitaryServices] = useState([]);
  const [newMilitaryServices, setNewMilitaryServices] = useState("");
  const [editingMilitaryService, setEditingMilitaryService] = useState({
    id: 0,
    type: "",
  });

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setResponse("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [response]);
  const handleClick = (id) => {
    setEditingMilitaryService({
      id: inputRef.current[id].id,
      type: inputRef.current[id].value,
    });
    inputRef.current[id]?.focus();
  };

  useEffect(() => {
    const _employmentType = async () => {
      let _response, _data;
      _response = await fetch(
        `${process.env.REACT_APP_URL}/military-service/${militaryServiceId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );

      switch (_response.status) {
        case 200:
          _data = await _response.json();
          setEditingMilitaryService({
            id: _data?.data?.id,
            type: _data?.data?.type,
          });

          break;

        default:
          break;
      }
    };

    token && militaryServiceId && _employmentType();
  }, [token, militaryServiceId]);

  useEffect(() => {
    const _militaryServices = async () => {
      let _response, _data;
      _response = await fetch(`${process.env.REACT_APP_URL}/military-service`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      switch (_response.status) {
        case 200:
          _data = await _response.json();
          setMilitaryServices(_data?.data);
          break;

        default:
          break;
      }
    };

    token && _militaryServices();
  }, [token, reloading, setMilitaryServices]);

  const deleteEmploymentTypeHandler = async () => {
    setResponse("");
    let _response, _data;
    _response = await fetch(`${process.env.REACT_APP_URL}/military-service`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        militaryServiceId,
      }),
    });

    switch (_response.status) {
      case 200:
        _data = await _response.json();
        setMilitaryServices((prevStates) => {
          return prevStates?.filter((item) => item.id !== militaryServiceId);
        });

        break;

      case 409:
        setResponse("you are not allowed to delete ...");
        break;

      default:
        setResponse("خطای سمت سرور ، بعدا تلاش کنید .");
        break;
    }
  };

  const addEmploymentTypeHandler = async () => {
    setResponse("");
    setReloading(false);
    let _response;

    _response = await fetch(`${process.env.REACT_APP_URL}/military-service`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        newMilitaryServices,
      }),
    });

    switch (_response.status) {
      case 201:
        setNewMilitaryServices("");
        setReloading(true);
        setAddNewMilitaryService(false);

        break;
      case 409:
        setReloading(true);
        setResponse("مقدار وارد شده تکراری می باشد.");
        break;
      case 500:
        setReloading(true);
        setResponse("خطای سمت سرور ، بعدا تلاش کنید .");
        break;

      default:
        setReloading(true);
        setResponse("خطای سمت سرور ، بعدا تلاش کنید .");
        break;
    }
  };
  const editEmploymentTypeHandler = async () => {
    setResponse("");
    setReloading(false);

    let _response;

    _response = await fetch(`${process.env.REACT_APP_URL}/military-service`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        editingMilitaryService,
      }),
    });

    switch (_response.status) {
      case 201:
        setReloading(true);

        break;
      case 409:
        setReloading(true);
        setResponse("مقدار وارد شده تکراری می باشد.");
        break;
      case 500:
        setReloading(true);
        setResponse("خطای سمت سرور ، بعدا تلاش کنید .");
        break;

      default:
        setReloading(true);
        setResponse("خطای سمت سرور ، بعدا تلاش کنید .");
        break;
    }
  };

  return (
    <div>
      {response && (
        <div className="fixed top-8 right-0 w-fit whitespace-nowrap text-[#434242] text-sm flex flex-row bg-[#FFF099] py-2 pr-14 pl-24  rounded-sm my-auto">
          <img src={WarningIcon} alt="آیکن هشدار" className="my-auto w-6 h-6" />

          <div
            style={{ direction: "rtl" }}
            className="my-auto mr-2 text-[#D76B00]"
          >
            {response.msg}
          </div>
        </div>
      )}
      <div className="w-[90%] mx-auto my-10">
        <div className="bg-[#F7F7F7] rounded-[15px] p-4">
          <div className="flex flex-row justify-between ">
            <span className="text-[#221D23] text-xl mr-2 my-auto">
              وضعیت خدمت سربازی
            </span>
            <div className="flex flex-row">
              <div
                onClick={() => {
                  setAddNewMilitaryService(true);
                  setShowCategories(true);
                }}
                className="bg-red-800 rounded-[4px] p-1"
              >
                <img src={addIcon3} className="w-8 h-8" />
              </div>
              <div
                onClick={() => {
                  setShowCategories((prev) => !prev);
                }}
                className="ml-2 bg-white rounded-[4px] p-1 mr-1"
              >
                <img
                  src={showCategories ? arrowDownIcon : arrowUpIcon}
                  className="w-8 h-8"
                />
              </div>
            </div>
          </div>
          {showCategories ? (
            <div className="border-t mt-4 pt-4 grid grid-cols-2 gap-4">
              {militaryServices?.map((item) => {
                return (
                  <div key={item.id} className="flex flex-row">
                    <input
                      ref={(el) => (inputRef.current[item.id] = el)}
                      id={item?.id}
                      defaultValue={item?.type}
                      className="text-[#221D23] w-full px-2 rounded-[4px] text-xl outline-none"
                      readOnly={militaryServiceId !== item.id}
                      onChange={(e) => {
                        setEditingMilitaryService({
                          id: item.id,
                          type: e.target.value,
                        });
                      }}
                    />
                    <div
                      onClick={() => {
                        setMilitaryServiceId(item?.id);
                        setShowDeleteMilitaryServiceModal(true);
                      }}
                      className="bg-white rounded-[4px] p-1 mr-2"
                    >
                      <img src={deleteIcon} className="w-8 h-8" />
                    </div>
                    {militaryServiceId == item?.id &&
                    editingMilitaryService.type !== "" ? (
                      <div
                        onClick={() => {
                          editEmploymentTypeHandler();
                        }}
                        className="bg-white rounded-[4px] p-1 mr-2 flex justify-center items-center text-[#A60014] text-sm cursor-pointer"
                      >
                        ویرایش
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          setMilitaryServiceId(item?.id);
                          handleClick(item?.id);
                        }}
                        className="bg-white rounded-[4px] p-1 mr-2"
                      >
                        <img src={editIcon} className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                );
              })}

              {addNewMilitaryService && (
                <div className="flex flex-row space-x-2 space-x-reverse">
                  <input
                    value={newMilitaryServices}
                    className="text-[#221D23] w-full px-2 rounded-[4px] text-xl outline-none"
                    onChange={(e) => {
                      setNewMilitaryServices(e.target.value);
                    }}
                  />

                  <div
                    onClick={() => {
                      addEmploymentTypeHandler();
                    }}
                    className="rounded-[4px] py-2 cursor-pointer px-4 bg-[#A60014] flex flex-row justify-center space-x-1 space-x-reverse"
                  >
                    <img src={addIcon2} className="w-6 h-6" />
                    <span className="text-white">ثبت</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className={`${showDeleteMilitaryServiceModal && " relative"} `}>
        {showDeleteMilitaryServiceModal &&
          ReactDOM.createPortal(
            <div>
              <div
                className="w-full h-full bg-[#4c4c4c]   opacity-60 fixed top-0 left-0 z-20 "
                onClick={() => setShowDeleteMilitaryServiceModal(false)}
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
                  آیا از حذف این دسته بندی مطمئن هستید؟
                </div>
                <div className="mt-10 flex flex-row w-[75%] mx-auto">
                  <div
                    onClick={() => setShowDeleteMilitaryServiceModal(false)}
                    className="border border-white bg-white text-center text-[#919191] text-lg mx-auto  py-2 rounded-[50px] cursor-pointer w-44 mr-2"
                  >
                    لغو
                  </div>

                  <div
                    onClick={() => {
                      setShowDeleteMilitaryServiceModal(false);
                      deleteEmploymentTypeHandler();
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

export default MilitaryService;
