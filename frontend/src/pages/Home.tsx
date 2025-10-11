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
      <div className="absolute inset-0 bg-green-900/40"></div>

      {/* Contenedor */}
      <div className="relative bg-white/95 rounded-3xl shadow-xl  p-16 max-w-3xl w-full text-center backdrop-blur-md">
        {/* Logo */}
        <div className="flex justify-center mb-10">
          <img
            src="/logoSin.png"
            alt="Logo Agro Mercado"
            className="w-60 h-60 rounded-full shadow-lg border-4 border-green-500"
          />
        </div>

        {/* Título */}
        <h2 className="text-5xl font-extrabold text-green-800 mb-6">
          Bienvenido a Agro Mercado Inteligente
        </h2>

        {/* Descripción */}
        <p className="text-xl text-gray-700 mb-12 leading-relaxed">
          Conecta productores y compradores agrícolas de manera <br />
          simple, eficiente y moderna.
        </p>

        {/* Botones */}
        <div className="flex justify-center space-x-6">
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-4 bg-green-600 text-white text-xl font-semibold rounded-xl shadow hover:bg-green-700 hover:scale-105 transition-transform"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-4 border-2 border-green-600 text-green-700 text-xl font-semibold bg-white rounded-xl shadow hover:bg-green-50 hover:scale-105 transition-transform"
          >
            Crear Cuenta
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
