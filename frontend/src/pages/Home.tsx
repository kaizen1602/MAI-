import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/fondo-agro.jpg')" }}
      ></div>
      <div className="absolute inset-0 bg-blue-900/40"></div>

      {/* Contenedor */}
      <div className="relative bg-white/95 rounded-3xl shadow-xl p-8 md:p-16 max-w-3xl w-full text-center backdrop-blur-md">
        {/* Logo */}
        <div className="flex justify-center mb-6 md:mb-10">
          <img
            src="/logoSin.png"
            alt="Logo Agro Mercado"
            className="w-48 h-32 md:w-80 md:h-60 object-contain mix-blend-multiply drop-shadow-md"
          />
        </div>

        {/* Título */}
        <h2 className="text-2xl md:text-5xl font-extrabold text-blue-800 mb-4 md:mb-6">
          Bienvenido a Mercado Agro Inteligente
        </h2>

        {/* Descripción */}
        <p className="text-lg md:text-xl text-gray-700 mb-8 md:mb-12 leading-relaxed">
          Conecta productores y compradores agrícolas de manera <br />
          simple, eficiente y moderna.
        </p>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 md:px-8 md:py-4 bg-blue-600 text-white text-lg md:text-xl font-semibold rounded-xl shadow hover:bg-blue-700 hover:scale-105 transition-transform"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3 md:px-8 md:py-4 border-2 border-blue-600 text-blue-700 text-lg md:text-xl font-semibold bg-white rounded-xl shadow hover:bg-blue-50 hover:scale-105 transition-transform"
          >
            Crear Cuenta
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
