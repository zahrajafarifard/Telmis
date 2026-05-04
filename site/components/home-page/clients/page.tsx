import React from "react";
import ClientsDetails from "./client-details";

import Arike from "../../../public/images/logo-arike.svg";
import Radin from "../../../public/images/logo-radin.svg";
import Robin from "../../../public/images/logo-robin.svg";
import Mojtahedi from "../../../public/images/logo-mojtahedi.png";
import Datis from "../../../public/images/logo-datis.png";
import Dolat from "../../../public/images/logo-dolat.svg";

const Clients = () => {
  const logos: string[] = [Mojtahedi, Arike, Robin, Radin, Datis, Dolat];

  return (
    <div className="my-44 screen630:my-20">
      <h2 className="text-[32px] text-center font-bold text-[#221D23] screen690:text-2xl">
        برخی از مشتریان ما
      </h2>
      <div className="flex flex-row justify-evenly mt-14">
        <ClientsDetails images={logos} />
      </div>
    </div>
  );
};

export default Clients;
