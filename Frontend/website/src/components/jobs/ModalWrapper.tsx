// src/components/jobs/ModalWrapper.tsx
import React, { ReactNode } from "react";

interface ModalWrapperProps {
  children: ReactNode;
  onClose: () => void;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ children, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-white max-h-[90vh] overflow-y-auto w-full max-w-2xl rounded-2xl p-6 animate-fadeInSlide"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;
