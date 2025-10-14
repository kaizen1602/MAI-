import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const Button = ({ children, onClick }: ButtonProps) => (
  <button
    onClick={onClick}
    className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 transition font-medium"
  >
    {children}
  </button>
);
