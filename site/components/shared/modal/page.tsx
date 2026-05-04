import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div>
      <div
        onClick={() => {
          onClose();
        }}
        className="bg-black bg-opacity-5 fixed top-0 left-0 h-full w-full "
      />
      <div
        style={{
          background: `url(/images/shop/modalBack.png)`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
        className="font-Peyda rounded-[15px] py-10 px-2 w-1/3 z-30 fixed justify-center h-fit mx-auto inset-x-0 my-auto inset-y-0 screen1360:w-[40%] 
        screen1250:w-1/2 screen750:w-2/3 screen500:w-[84%] screen750:py-5
        "
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
