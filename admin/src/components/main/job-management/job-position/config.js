import React from "react";

import Category from "./job-categories";
import EmploymentType from "./eployment-type";
import MilitaryService from "./military-service";

const Config = () => {
  return (
    <div>
      <Category />
      <EmploymentType />
      <MilitaryService />
    </div>
  );
};

export default Config;
