import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../data/context/AuthContext";
import { toast } from "react-hot-toast";
import SupportDataService from "../data/services/SupportDataService";
import type { Department, Municipality } from "../data/types/product.types";

export default function CompleteProfilePage() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    address_details: "",
    department_id: null as number | null,
    municipality_id: null as number | null,
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [municipalities, setMunicipalities] = useState<Municipality[]>([]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        phone_number: user.phone_number || prev.phone_number,
        address_details: user.address_details || prev.address_details,
        department_id: user.department?.id || prev.department_id,
        municipality_id: user.municipality?.id || prev.municipality_id,
      }));
    }

    let mounted = true;
    const load = async () => {
      try {
        const deps = await SupportDataService.getDepartments();
        if (mounted) setDepartments(deps);
        const deptId = user?.department?.id || null;
        if (deptId) {
          const muns = await SupportDataService.getMunicipalitiesByDepartment(deptId);
          if (mounted) setMunicipalities(muns);
        }
      } catch (err) {
        console.error("Error loading support data:", err);
      }
    };
    load();
    return () => { mounted = false };
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDepartmentChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value) || null;
    setFormData((prev) => ({ ...prev, department_id: id, municipality_id: null }));
    setMunicipalities([]);
    if (id) {
      try {
        const muns = await SupportDataService.getMunicipalitiesByDepartment(id);
        setMunicipalities(muns);
      } catch (err) { console.error(err) }
    }
  };

  const handleMunicipalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = Number(e.target.value) || null;
    setFormData((prev) => ({ ...prev, municipality_id: id }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("phone_number", formData.phone_number);
      submitData.append("address_details", formData.address_details);
      if (formData.department_id) submitData.append("department_id", String(formData.department_id));
      if (formData.municipality_id) submitData.append("municipality_id", String(formData.municipality_id));
      if (profileImage) submitData.append("profile_image", profileImage);

      await updateProfile(submitData);
      toast.success("Perfil actualizado");
      navigate('/profile');
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || 'Error actualizando perfil');
    } finally { setIsSubmitting(false) }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-bold mb-4">Completa tu perfil</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Nombre</label>
            <input name="name" value={formData.name} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block font-medium">Teléfono</label>
            <input name="phone_number" value={formData.phone_number} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block font-medium">Departamento</label>
            <select value={formData.department_id ?? ""} onChange={handleDepartmentChange} className="w-full border rounded px-3 py-2">
              <option value="">Selecciona</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-medium">Ciudad / Municipio</label>
            <select value={formData.municipality_id ?? ""} onChange={handleMunicipalityChange} className="w-full border rounded px-3 py-2" disabled={municipalities.length===0}>
              <option value="">Selecciona</option>
              {municipalities.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block font-medium">Dirección</label>
            <textarea name="address_details" value={formData.address_details} onChange={handleInputChange} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <label className="block font-medium">Foto de perfil</label>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && <img src={imagePreview} alt="preview" className="mt-2 w-32 h-32 object-cover rounded-full" />}
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => navigate('/profile')} className="px-4 py-2 border rounded">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded">{isSubmitting ? 'Guardando...' : 'Guardar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
