import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);
  const navigate = useNavigate();

  // Mock user data
  const mockUser = {
    email: "test@example.com",
    password: "password123",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage({
        text: "Por favor completa todos los campos ✍️",
        type: "error",
      });
      return;
    }

    if (email === mockUser.email && password === mockUser.password) {
      setMessage({
        text: "¡Inicio de sesión exitoso! 🎉 Bienvenido 🌱",
        type: "success",
      });

      // Redirige después de un breve delay
      setTimeout(() => {
        navigate("/wall");
      }, 1500);
    } else {
      setMessage({
        text: "Credenciales incorrectas ❌ Inténtalo de nuevo.",
        type: "error",
      });
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen">
      {/* Imagen de fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/fondo-agro.jpg')" }}
      ></div>

      {/* Capa oscura */}
      <div className="absolute inset-0 bg-green-900/40"></div>

      {/* Contenedor */}
      <div className="relative z-10 bg-white p-10 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-5xl font-bold text-green-700 mb-6 text-center">
          Iniciar Sesión
        </h1>

        {/* Mensaje dinámico */}
        {message && (
          <div
            className={`mb-4 p-4 rounded-lg text-center font-semibold transition-all duration-500 transform
            ${
              message.type === "error"
                ? "bg-red-100 text-red-700 border border-red-300 animate-shake"
                : "bg-green-100 text-green-700 border border-green-300 animate-fadeIn"
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Correo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition text-2xl shadow-md"
          >
            Entrar
          </button>
        </form>

        <div className="mt-6 p-4 bg-gray-100 rounded-lg text-sm text-gray-700">
          <strong>Datos de prueba:</strong>
          <p>Correo: test@example.com</p>
          <p>Contraseña: password123</p>
        </div>

        <p className="text-center text-gray-600 mt-4">
          ¿No tienes cuenta?{" "}
          <a
            href="/register"
            className="text-green-600 hover:underline font-semibold"
          >
            Crear cuenta
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
