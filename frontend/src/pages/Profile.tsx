import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import ProfileHeader from "../components/ProfileHeader";
import ProfileInfo from "../components/ProfileInfo";
import UserPosts from "../components/UserPosts";
import ProfilePurchases from "../components/PurchaseHistory";
import EditProfileModal from "../components/EditProfileModal";
import { usuarios } from "../data/usuarios";

export default function ProfilePage() {
  const [user, setUser] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setUser(usuarios[0]); // usuario logueado simulado
  }, []);

  const handleSave = (updatedUser: any) => {
    setUser(updatedUser);
    console.log("Usuario actualizado:", updatedUser);
  };

  const handleEdit = () => {
    setShowModal(true);
  };

  if (!user) return <div className="text-center py-20 text-gray-600">Cargando perfil...</div>;

  return (
    <div
      className="min-h-screen bg-fixed bg-center bg-cover"
      style={{ backgroundImage: "url('/fondoMuro.jpg')" }}
    >
      <Navbar />

      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Columna izquierda - Información del perfil (más ancha) */}
          <div className="lg:w-2/3 w-full">
            {/* Encabezado */}
            <ProfileHeader
              name={user.name}
              username={user.username}
              imageUrl={user.imageUrl}
              onEdit={handleEdit}
            />

            {/* Información personal */}
            <div className="mt-8">
              <ProfileInfo email={user.email} city={user.city} joinDate={user.joinDate} bio={user.bio} />
            </div>

            {/* Historial de compras */}
            <div className="mt-8">
              <ProfilePurchases purchases={user.purchases} />
            </div>
          </div>

          {/* Columna derecha - Publicaciones (más angstra) */}
          <div className="lg:w-1/3 w-full">
            <UserPosts posts={user.posts} />
          </div>
        </div>

        {/* Modal para editar */}
        {showModal && (
          <EditProfileModal
            user={user}
            onSave={handleSave}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    </div>
  );
}