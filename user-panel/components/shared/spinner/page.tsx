import React from "react";
import styles from "./Spinner.module.css"; // Use module CSS for better scoping

const Spinner: React.FC = () => {
  return (
    <div className="flex flex-col bg-white w-[70%] py-11 mx-auto rounded-sm">
      <div className={`${styles.spinnerContainer} mx-auto`}>
        <div className={styles.backgroundImage}></div>
        <div className={styles.bouncingCircle}></div>
      </div>

      <div
        style={{ direction: "rtl" }}
        className="w-fit font-semibold text-[#b71f26] mx-auto pt-1 font-Vazir flex flex-row my-auto"
      >
        در حال بارگزاری 
        <div className="animate-pulse text-2xl my-auto -mt-1 mr-2">...</div>
      </div>
    </div>
  );
};

export default Spinner;
