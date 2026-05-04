import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import moment from "moment-jalaali";

import Pagination from "../../../shared-component/pagination";
import sortIcon from "../../../../assets/images/Sort.svg";
import priceIcon from "../../../../assets/images/Ip.svg";
import prodNameIcon from "../../../../assets/images/File_light.svg";
import dateIcon from "../../../../assets/images/Calendar.svg";
import clockIcon from "../../../../assets/images/clock.svg";
import viewIcon from "../../../../assets/images/overview.svg";
import errIcn from "../../../../assets/images/error2.svg";

const Orders = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState({});
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [factorStatuses, setFactorStatuses] = useState([]);
  const _token = useSelector((state) => state.reducer.token);
  const [token, setToken] = useState();
  const [orders, setOrders] = useState([]);

  const [totalItems, settTotalItems] = useState(0);
  const itemsPerPage = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    if (page !== "...") {
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    setToken(_token);
  }, [_token]);

  useEffect(() => {
    const fetchFactorStatuses = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/factor/status`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        setFactorStatuses(data?.data);
      }
    };

    if (token) {
      fetchFactorStatuses();
    }
  }, [token]);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_URL}/factor/getAllFactors`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${_token}`,
          },
          body: JSON.stringify({
            page: currentPage,
            pageSize: itemsPerPage,
          }),
        }
      );

      if (response.status === 200) {
        const data = await response.json();

        const initialSelectedItems = data?.data?.rows.reduce((acc, order) => {
          acc[order.id] = {
            id: order?.StatusFactor?.id,
            status: order?.StatusFactor?.status,
            color: order?.StatusFactor?.color,
            bgColor: order?.StatusFactor?.bgColor,
          };
          return acc;
        }, {});

        setSelectedItems(initialSelectedItems);
        setOrders(data?.data?.rows);
        settTotalItems(data?.data?.count);
      }
    };

    if (_token) {
      fetchOrders();
    }
  }, [
    _token,
    setSelectedItems,
    setOrders,

    currentPage,
    setCurrentPage,
    settTotalItems,
    itemsPerPage,
  ]);

  const toggleDropdown = (orderId) => {
    setOpenDropdowns((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  const changeStatusFactorHandler = async (factorId, statusId) => {
    const response = await fetch(
      `${process.env.REACT_APP_URL}/factor/changeStatus/${factorId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          status: statusId,
        }),
      }
    );

    switch (response.status) {
      case 200:
        break;

      default:
        break;
    }
  };

  const handleCheckboxChange = async (orderId, itemId) => {
    await changeStatusFactorHandler(orderId, itemId);

    const selectedStatus = factorStatuses.find(
      (status) => status.id === itemId
    );

    setSelectedItems((prevState) => ({
      ...prevState,
      [orderId]: {
        id: itemId,
        color: selectedStatus?.color,
        bgColor: selectedStatus?.bgColor,
      },
    }));
    setOpenDropdowns({});
  };

  return (
    <div className="w-[90%] mx-auto">
      <div className="flex flex-row space-x-4 space-x-reverse justify-between w-full mt-8 pb-10">
        <div className="text-[#221D23] text-2xl font-semibold my-auto">
          فاکتور خرید و سفارشات
        </div>
        <hr className="flex-grow my-auto border-[#D9D9D9]" />
        <div className="bg-[#F2F2F2] rounded-[50px] flex flex-row px-10 py-2">
          <img
            src={sortIcon}
            width={24}
            height={24}
            alt="group"
            className="ml-2"
          />
          <span className="text-[#979797] my-auto text-[20px]">مرتب سازی</span>
        </div>
      </div>

      <div className="mt-12">
        <div className="bg-[#F7F7F7] grid grid-cols-6 place-items-center py-4 rounded-[4px]">
          <div className="my-auto">ردیف</div>
          <div className="flex flex-row">
            <span className="text-[#333] text-sm"> مبلغ پرداختی </span>
            <img src={priceIcon} className="w-6 h-6 mr-2" alt="icon" />
          </div>
          <div className="flex flex-row">
            <span className="text-[#333] text-sm">نام محصولات خریداری شده</span>
            <img src={prodNameIcon} className="w-6 h-6 mr-2" alt="icon" />
          </div>
          <div className="flex flex-row">
            <span className="text-[#333] text-sm">تاریخ خرید </span>
            <img src={dateIcon} className="w-6 h-6 mr-2" alt="icon" />
          </div>
          <div className="flex flex-row">
            <span className="text-[#333] text-sm">ساعت خرید </span>
            <img src={clockIcon} className="w-6 h-6 mr-2" alt="icon" />
          </div>
          <div className="my-auto">عملیات</div>
        </div>

        <div>
          {orders?.length === 0 ? (
            <div className=" w-fit mx-auto  pt-10 pb-12 px-20 my-24">
              <div className="w-fit mx-auto mb-4">
                <img src={errIcn} className="w-24 h-24" />
              </div>
              <div className="text-[#6D6F72] text-2xl">
                سفارشی ثبت نشده است .
              </div>
            </div>
          ) : (
            orders?.map((order, index) => (
              <div
                key={order.id}
                className="grid grid-cols-6 py-4 border border-[#D9D9D9] rounded-[4px] my-6"
              >
                <p className="bg-gradient-to-r from-[#A60014] to-[#600B0E] rounded-full w-8 h-5 mx-auto text-white text-xs flex items-center justify-center">
                  {index + 1}
                </p>
                <div>{Number(order?.price).toLocaleString()}</div>
                <div>
                  {order?.FactorDetails?.map((product, i, array) => (
                    <span key={i}>
                      {product?.Product?.mainTitle}
                      {i < array.length - 1 && ", "}
                    </span>
                  ))}
                </div>
                <div>{moment(order?.createdAt).format("jYYYY/jMM/jDD")}</div>
                <div>{moment(order?.createdAt).format("HH:mm")}</div>
                <div className="relative">
                  <div className=" my-auto flex flex-row justify-center space-x-1 space-x-reverse">
                    <button
                      onClick={() => {
                        toggleDropdown(order.id);
                      }}
                      style={{
                        backgroundColor: `${
                          selectedItems[order.id]?.bgColor || "#f0f0f0"
                        }`,
                        color: `${selectedItems[order.id]?.color || "#000"}`,
                      }}
                      className="rounded-full px-4 py-2 w-32 text-sm whitespace-nowrap"
                    >
                      {selectedItems[order.id] &&
                        factorStatuses.find(
                          (item) => item.id === selectedItems[order.id].id
                        )?.status}
                    </button>

                    <img
                      onClick={() =>
                        navigate("/order-details", {
                          state: { factorId: order?.id },
                        })
                      }
                      src={viewIcon}
                      className="w-8 h-7 my-auto"
                    />
                  </div>
                  {openDropdowns[order.id] && (
                    <div className="absolute top-11 right-7 rounded-lg z-30 bg-white shadow-[-4px_3px_10px_1px_rgba(0,0,0,0.19)]">
                      {factorStatuses.map((item) => (
                        <div
                          onClick={() => {
                            handleCheckboxChange(order.id, item.id);
                          }}
                          key={item.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "5px",
                            color: `${item.color}`,
                          }}
                        >
                          <input
                            type="radio"
                            name={`dropdown-item-${order.id}`}
                            checked={
                              selectedItems[order.id]?.id === item.id || false
                            }
                            onChange={() => {
                              handleCheckboxChange(order.id, item.id);
                            }}
                            className="accent-[#A60014] m-3"
                          />
                          <label className="text-sm pl-3 whitespace-nowrap">
                            {item.status}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="">
        {orders?.length !== 0 && (
          <Pagination
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            current={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Orders;
