import React from "react";
import { FaEnvelope, FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";

interface ProfileInfoProps {
  email: string;
  city: string;
  joinDate: string;
  bio: string;
}

export default function ProfileInfo({
  email,
  city,
  joinDate,
  bio,
}: ProfileInfoProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="bg-white/90 dark:bg-gray-800 rounded-3xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">
          Información Personal
        </h3>
        <p className="flex items-center text-gray-700 dark:text-gray-300 mb-2">
          <FaEnvelope className="mr-3 text-blue-600" /> {email}
        </p>
        <p className="flex items-center text-gray-700 dark:text-gray-300 mb-2">
          <FaMapMarkerAlt className="mr-3 text-blue-600" /> {city}
        </p>
        <p className="flex items-center text-gray-700 dark:text-gray-300">
          <FaCalendarAlt className="mr-3 text-blue-600" /> Miembro desde:{" "}
          {joinDate}
        </p>
      </div>

      <div className="bg-white/90 dark:bg-gray-800 rounded-3xl shadow-md p-6">
        <h3 className="text-xl font-semibold text-blue-700 mb-4">Biografía</h3>
        <p className="text-gray-700 dark:text-gray-300">{bio}</p>
      </div>
    </div>
  );
}
