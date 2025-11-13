import React from "react";
import RegisterForm from "../components/userForm";

function Register() {
  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/fondo-agro.jpg')" }}
      ></div>

      <div className="absolute inset-0 bg-blue-900/40"></div>

      {/* Formulario */}
      <div className="relative z-10 w-full max-w-lg px-4">
        <RegisterForm />
      </div>
    </div>
  );
}

export default Register;
