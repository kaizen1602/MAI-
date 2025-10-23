import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSeedling,
  FaDrumstickBite,
  FaUser,
  FaHistory,
  FaDollarSign,
} from "react-icons/fa";
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Sesión cerrada con éxito ✅");
      navigate("/login");
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error("Error al cerrar sesión");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handlePublishSubmit = async (postData: any) => {
    // El PublishPostModal ya maneja la creación del post
    toast.success("¡Publicación creada con éxito!");
    setShowPublishModal(false);
    // Recargar la página para mostrar el nuevo post
    window.location.reload();
  };

  return (
    <>
      <nav className="bg-green-900 text-white px-6 py-3 shadow-md flex justify-between items-center relative">
        {/* Logo + Nombre */}
        <div className="flex items-center space-x-3">
          <div className="bg-white p-1 rounded-full">
            <img
              src="/logoSin.png"
              alt="Logo Agro Mercado"
              className="w-10 h-10 rounded-full shadow-md"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-1xl md:text-4xl">
              Mercado Agro Inteligente
            </span>
            {user && (
              <span className="text-xs text-yellow-300 hidden md:block">
                Hola, {user.name}
              </span>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Links principales con íconos - Desktop */}
        <div className="hidden md:flex space-x-6">
          <Link
            to="/wall"
            className="flex items-center space-x-1 hover:text-yellow-300"
          >
            <FiHome /> <span>Inicio</span>
          </Link>
          <Link
            to="/sales"
            className="flex items-center space-x-1 hover:text-yellow-300"
          >
            <FaDollarSign /> <span>Quiero Vender</span>
          </Link>
          <Link
            to="/shopping"
            className="flex items-center space-x-1 hover:text-yellow-300"
          >
            <FiSearch /> <span>Quiero Comprar</span>
          </Link>
          <Link
            to="/profile"
            className="flex items-center space-x-1 hover:text-yellow-300"
          >
            <FaUser /> <span>Mi Perfil</span>
          </Link>
          <Link
            to="/"
            className="flex items-center space-x-1 hover:text-yellow-300"
          >
            <FaHistory /> <span>Historico</span>
          </Link>
        </div>

        {/* Acciones - Desktop */}
        <div className="hidden md:flex space-x-3">
          <button
            onClick={() => setShowPublishModal(true)}
            className="flex items-center bg-yellow-300 text-green-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-300 transition"
          >
            <FiPlus className="mr-1" /> Publicar
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            <FiLogOut className="mr-1" /> Cerrar Sesión
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-green-900 shadow-lg md:hidden z-50">
            <div className="flex flex-col py-4">
              <Link
                to="/wall"
                className="flex items-center space-x-2 px-6 py-3 hover:bg-green-800"
                onClick={closeMenu}
              >
                <FiHome /> <span>Inicio</span>
              </Link>
              <Link
                to="/sales"
                className="flex items-center space-x-2 px-6 py-3 hover:bg-green-800"
                onClick={closeMenu}
              >
                <FaDollarSign /> <span>Quiero Vender</span>
              </Link>
              <Link
                to="/shopping"
                className="flex items-center space-x-2 px-6 py-3 hover:bg-green-800"
                onClick={closeMenu}
              >
                <FiSearch /> <span>Quiero Comprar</span>
              </Link>
              <Link
                to="/profile"
                className="flex items-center space-x-2 px-6 py-3 hover:bg-green-800"
                onClick={closeMenu}
              >
                <FaUser /> <span>Mi Perfil</span>
              </Link>
              <Link
                to="/"
                className="flex items-center space-x-2 px-6 py-3 hover:bg-green-800"
                onClick={closeMenu}
              >
                <FaHistory /> <span>Historico</span>
              </Link>

              <button
                onClick={() => {
                  closeMenu();
                  setShowPublishModal(true);
                }}
                className="flex items-center space-x-2 px-6 py-3 bg-yellow-500 text-green-900"
              >
                <FiPlus className="mr-1" /> Publicar
              </button>

              <button
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className="flex items-center space-x-2 px-6 py-3 bg-red-500 text-white"
              >
                <FiLogOut className="mr-1" /> Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </nav>

      <PublishPostModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onSubmit={handlePublishSubmit}
      />
    </>
  );
}

export default Navbar;