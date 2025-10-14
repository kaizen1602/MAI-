import { useState } from "react";
import { Search, XCircle, Sliders } from "lucide-react";

interface FiltersProps {
  onFilter: (filters: any) => void;
}

export default function Filters({ onFilter }: FiltersProps) {
  const [filters, setFilters] = useState({
    productType: "",
    postType: "",
    minPrice: "",
    maxPrice: "",
    city: "",
    name: "",
    dateFrom: "",
    dateTo: "",
    sortBy: "",
  });

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
    setShowMobileFilters(false); // Close mobile filters after applying
  };

  const handleReset = () => {
    const resetFilters = {
      productType: "",
      postType: "",
      minPrice: "",
      maxPrice: "",
      city: "",
      name: "",
      dateFrom: "",
      dateTo: "",
      sortBy: "",
    };
    setFilters(resetFilters);
    onFilter({});
    setShowMobileFilters(false); // Close mobile filters after resetting
  };

  // Filter form content (shared between desktop and mobile)
  const FilterForm = () => (
    <div className="flex-grow space-y-4">
      {/* Tipo de producto */}
      <div>
        <label className="block text-base font-semibold mb-1">
          Tipo de Producto
        </label>
        <select
          name="productType"
          value={filters.productType}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
        >
          <option value="">Todos</option>
          <option value="cultivo">Cultivo</option>
          <option value="carnico">Cárnico</option>
          <option value="lacteo">Lácteo</option>
          <option value="otros">Otros</option>
        </select>
      </div>

      {/* Tipo de publicación */}
      <div>
        <label className="block text-base font-semibold mb-1">
          Tipo de Publicación
        </label>
        <select
          name="postType"
          value={filters.postType}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
        >
          <option value="">Todas</option>
          <option value="venta">Venta</option>
          <option value="compra">Compra</option>
        </select>
      </div>

      {/* Rango de precios */}
      <div className="flex space-x-2">
        <div className="flex-1">
          <label className="block text-base font-semibold mb-1">
            Precio Mín
          </label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="flex-1">
          <label className="block text-base font-semibold mb-1">
            Precio Máx
          </label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* Ciudad o municipio */}
      <div>
        <label className="block text-base font-semibold mb-1">
          Ciudad o Municipio
        </label>
        <input
          type="text"
          name="city"
          value={filters.city}
          onChange={handleChange}
          placeholder="Ej: Bogotá"
          className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Nombre */}
      <div>
        <label className="block text-base font-semibold mb-1">
          Nombre producto
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleChange}
            placeholder="Ej: Tomate"
            className="w-full border rounded-lg pl-10 px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* Fecha */}
      <div>
        <label className="block text-base font-semibold mb-1">Fecha</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium mb-1">Desde</label>
            <input
              type="date"
              name="dateFrom"
              value={filters.dateFrom}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Hasta</label>
            <input
              type="date"
              name="dateTo"
              value={filters.dateTo}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Ordenar */}
      <div>
        <label className="block text-base font-semibold mb-1">
          Ordenar por
        </label>
        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={handleChange}
          className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 dark:text-white"
        >
          <option value="">Predeterminado</option>
          <option value="priceAsc">Precio: Menor a Mayor</option>
          <option value="priceDesc">Precio: Mayor a Menor</option>
          <option value="dateDesc">Más recientes</option>
          <option value="dateAsc">Más antiguos</option>
        </select>
      </div>
    </div>
  );

  // Buttons section (shared between desktop and mobile)
  const FilterButtons = () => (
    <div className="flex justify-between pt-2">
      <button
        type="submit"
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
      >
        <Search className="h-4 w-4" /> Aplicar
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="flex items-center gap-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
      >
        <XCircle className="h-4 w-4" /> Limpiar
      </button>
    </div>
  );

  // Mobile filter button
  const MobileFilterButton = () => (
    <button
      onClick={() => setShowMobileFilters(true)}
      className="lg:hidden fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg z-50 hover:bg-green-700 transition-all duration-200 ease-in-out"
      aria-label="Filtros"
      style={{ zIndex: 9999 }}
    >
      <Sliders className="h-6 w-6" />
    </button>
  );

  // Mobile filter modal
  const MobileFilterModal = () => (
    <div 
      className={`fixed inset-0 z-50 ${showMobileFilters ? 'block' : 'hidden'}`}
      style={{ zIndex: 10000 }}
    >
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => setShowMobileFilters(false)}
      ></div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900/90 rounded-2xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sliders className="text-green-600 dark:text-green-400" />
                <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">
                  Filtros
                </h2>
              </div>
              <button 
                type="button"
                onClick={() => setShowMobileFilters(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>

            <FilterForm />
            
            {/* Botones */}
            <div className="flex justify-between pt-6">
              <button
                type="submit"
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                <Search className="h-4 w-4" /> Aplicar
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition"
              >
                <XCircle className="h-4 w-4" /> Limpiar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop filters - visible only on large screens */}
      <form
        onSubmit={handleSubmit}
        className="hidden lg:block bg-white dark:bg-gray-900/90 p-6 rounded-2xl shadow-lg space-y-5 h-full flex flex-col border border-gray-200 dark:border-gray-700"
      >
        {/* Header */}
        <div className="flex items-center justify-center gap-2">
          <Sliders className="text-green-600 dark:text-green-400" />
          <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">
            Filtros
          </h2>
        </div>

        <FilterForm />
        <FilterButtons />
      </form>

      {/* Mobile filter button */}
      <MobileFilterButton />
      
      {/* Mobile filter modal */}
      <MobileFilterModal />
    </>
  );
}