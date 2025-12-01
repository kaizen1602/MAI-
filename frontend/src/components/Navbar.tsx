import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaDollarSign, FaChartLine } from "react-icons/fa";
import {
  FiHome,
  FiPlus,
  FiLogOut,
  FiMenu,
  FiX,
  FiSearch,
} from "react-icons/fi";
import toast from "react-hot-toast";
import PublishPostModal from "./PublishPostModal";
import { useAuth } from "../data/context/AuthContext";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sesión cerrada con éxito ✅");
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handlePublishSubmit = async (postData: any) => {
    toast.success("¡Publicación creada con éxito!");
    setShowPublishModal(false);
    window.location.reload();
  };

  return (
    <>
      {/* 🔷 Navbar principal */}
      <nav className="relative flex items-center justify-between px-6 py-3 text-white shadow-xl bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 backdrop-blur-md">
        {/* Logo + Nombre */}
        <div className="flex items-center space-x-3">
          <div className="p-1 bg-white rounded-full shadow-md">
            <img
              src="/logoSin.png"
              alt="Logo Agro Mercado"
              className="w-10 h-10 rounded-full"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-wider md:text-3xl">
              MAI
            </span>
          </div>
        </div>

        {/* Botón menú móvil */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>

        {/* 🔹 Links escritorio */}
        <div className="hidden space-x-6 text-lg font-medium md:flex">
          <Link
            to="/wall"
            className="flex items-center space-x-1 transition hover:text-yellow-300"
          >
            <FiHome /> <span>Inicio</span>
          </Link>
          <Link
            to="/sales"
            className="flex items-center space-x-1 transition hover:text-yellow-300"
          >
            <FaDollarSign /> <span>Vender</span>
          </Link>
          <Link
            to="/shopping"
            className="flex items-center space-x-1 transition hover:text-yellow-300"
          >
            <FiSearch /> <span>Comprar</span>
          </Link>
          <Link
            to="/charts"
            className="flex items-center space-x-1 transition hover:text-yellow-300"
          >
            <FaChartLine /> <span>Estadisticas</span>
          </Link>
        </div>

        {/* 🔹 Acciones escritorio */}
        <div className="items-center hidden space-x-4 md:flex">
          {/* ✅ Nuevo botón “Publicar” moderno */}
          <button
            onClick={() => setShowPublishModal(true)}
            className="relative flex items-center justify-center px-5 py-2.5 rounded-lg font-semibold text-white 
              bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 shadow-lg 
              transition-all duration-300 hover:scale-105 hover:shadow-blue-400/50
              before:absolute before:inset-0 before:bg-gradient-to-r before:from-cyan-300 before:via-blue-400 before:to-indigo-400 
              before:opacity-0 hover:before:opacity-20 before:rounded-lg before:blur-md overflow-hidden"
          >
            <FiPlus className="mr-1" /> Publicar
          </button>

          {/* 🔽 Menú de perfil con foto */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 focus:outline-none"
            >
              <img
                src={user?.profile_image || "/default-avatar.png"}
                alt="Perfil"
                className="w-10 h-10 transition-transform border-2 border-white rounded-full hover:scale-105"
              />
              <span className="hidden font-medium md:block">
                {user?.name || "Usuario"}
              </span>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 z-50 w-48 mt-2 overflow-hidden text-gray-800 bg-white rounded-lg shadow-lg animate-fadeIn">
                <Link
                  to="/profile"
                  className="block px-4 py-3 transition hover:bg-blue-100"
                  onClick={() => setShowProfileMenu(false)}
                >
                  👤 Mi perfil
                </Link>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    handleLogout();
                  }}
                  className="w-full px-4 py-3 text-left text-red-600 transition hover:bg-red-100"
                >
                  🚪 Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 🔹 Menú móvil */}
        {isMenuOpen && (
          <div className="absolute left-0 z-50 w-full shadow-lg top-full bg-blue-900/95 md:hidden animate-fadeIn backdrop-blur-lg">
            <div className="flex flex-col py-4 space-y-1">
              <Link
                to="/wall"
                className="flex items-center px-6 py-3 space-x-2 transition hover:bg-blue-800"
                onClick={closeMenu}
              >
                <FiHome /> <span>Inicio</span>
              </Link>
              <Link
                to="/sales"
                className="flex items-center px-6 py-3 space-x-2 transition hover:bg-blue-800"
                onClick={closeMenu}
              >
                <FaDollarSign /> <span>Vender</span>
              </Link>
              <Link
                to="/shopping"
                className="flex items-center px-6 py-3 space-x-2 transition hover:bg-blue-800"
                onClick={closeMenu}
              >
                <FiSearch /> <span>Comprar</span>
              </Link>
              <Link
                to="/charts"
                className="flex items-center px-6 py-3 space-x-2 transition hover:bg-blue-800"
                onClick={closeMenu}
              >
                <FaChartLine /> <span>Gráficas</span>
              </Link>

              <Link
                to="/profile"
                className="flex items-center px-6 py-3 space-x-2 transition hover:bg-blue-800"
                onClick={closeMenu}
              >
                <FaUser /> <span>Mi Perfil</span>
              </Link>

              <button
                onClick={() => {
                  closeMenu();
                  setShowPublishModal(true);
                }}
                className="flex items-center px-6 py-3 space-x-2 font-semibold text-white transition rounded-md bg-gradient-to-r from-cyan-400 to-blue-500 hover:scale-105"
              >
                <FiPlus className="mr-1" /> Publicar
              </button>

              <button
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className="flex items-center px-6 py-3 space-x-2 font-semibold text-white transition bg-red-500 hover:bg-red-600"
              >
                <FiLogOut className="mr-1" /> Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Modal de publicación */}
      <PublishPostModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onSubmit={handlePublishSubmit}
      />
    </>
  );
}

export default Navbar;
