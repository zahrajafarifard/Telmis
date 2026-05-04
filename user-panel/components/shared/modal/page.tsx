import React from "react";

interface ModalProps {
  isOpen: boolean;
  // onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  // onClose,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        background: `url(/images/modalBack.png)`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
      className="font-Peyda rounded-[15px] py-10 px-20 w-1/3 z-30 fixed justify-center h-fit mx-auto inset-x-0 my-auto inset-y-0"
    >
      {children}
    </div>
  );
};

export default Modal;
