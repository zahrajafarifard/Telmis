// Pagination.js
import React from "react";

import arrowBackward from "../../../assets/images/prev.svg";
import arrowBackwardDisabled from "../../../assets/images/prev.svg";
import arrowForward from "../../../assets/images/next.svg";
import arrowForwardDisabled from "../../../assets/images/next.svg";

const Pagination = ({ totalItems, itemsPerPage, current, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const generatePagination = () => {
    let pages = [];

    // Always show the first page
    pages.push(1);

    // Show dots if current page is far from the first page
    if (current > 3) {
      pages.push("...");
    }

    // Show the previous page, current page, and next page
    if (current > 2) {
      pages.push(current - 1);
    }
    if (current !== 1 && current !== totalPages) {
      pages.push(current);
    }
    if (current < totalPages - 1) {
      pages.push(current + 1);
    }

    // Show dots if current page is far from the last page
    if (current < totalPages - 2) {
      pages.push("...");
    }

    // Always show the last page

    // if (totalPages !== 0 ) {
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePagination();

  return (
    <div className="flex flex-row-reverse justify-center py-10 mt-10 bg-[#F7F7F7]">
      {current === 1 ? (
        <div className="bg-[#D9D9D9] rounded-[4px]">
          <img src={arrowBackwardDisabled} className="w-10 h-10 my-auto" />
        </div>
      ) : (
        <div className="bg-gradient-to-tr to-[#660E0E] via-[#901111] from-[#B21414] rounded-[4px]">
          <img
            src={arrowBackward}
            className="w-10 h-10 my-auto brightness-0 invert"
          />
        </div>
      )}
      {pages.map((page, index) => {
        return (
          <button
            key={index}
            onClick={() => {
              if (page === "<" && current > 1) {
                onPageChange(current - 1);
              } else if (page === ">" && current < totalPages) {
                onPageChange(current + 1);
              } else if (page !== "<" && page !== ">" && page !== "...") {
                onPageChange(page);
              }
            }}
            className={`mx-2 my-auto ${
              page === current
                ? "border text-red-800 border-red-800 py-1.5 px-4 rounded-[4px] "
                : " text-[#666] py-1.5 px-3  "
            }`}
          >
            {page}
          </button>
        );
      })}

      {current === totalPages ? (
        <div className="bg-[#D9D9D9] rounded-[4px]">
          <img
            src={arrowBackwardDisabled}
            className="w-10 h-10 my-auto scale-x-[-1]"
          />
        </div>
      ) : (
        <div className="bg-gradient-to-tr to-[#660E0E] via-[#901111] from-[#B21414] rounded-[4px]">
          <img src={arrowForward} className="w-10 h-10 my-auto" />
        </div>
      )}
    </div>
  );
};

export default Pagination;
