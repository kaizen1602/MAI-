import React from "react";
import { FaStar } from "react-icons/fa";

interface SellerInfoProps {
  user: { user_id: number; name: string };
}

function SellerInfo({ user }: SellerInfoProps) {
  return (
<div className="p-6 bg-yellow-50 dark:bg-yellow-900/30 rounded-2xl border border-yellow-200 dark:border-yellow-800 shadow-sm">
      <div className="flex items-center mb-3">
<FaStar className="text-yellow-500 mr-2 text-xl" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Información del vendedor</h3>
      </div>
      <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-700 rounded-lg">
        <div className="bg-green-200 dark:bg-green-600 rounded-full w-20 h-20 flex items-center justify-center mb-3">
          <span className="font-bold text-green-800 dark:text-white text-2xl">
            {user?.name?.charAt(0) || "?"}
          </span>
        </div>
        <div className="text-center">
          <h4 className="font-bold text-xl text-gray-800 dark:text-gray-200">
            {user?.name || "Usuario desconocido"}
          </h4>
        </div>
      </div>
    </div>
  );
}

export default SellerInfo;