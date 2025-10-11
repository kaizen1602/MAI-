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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
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
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-900/90 p-6 rounded-2xl shadow-lg space-y-5 h-full flex flex-col border border-gray-200 dark:border-gray-700"
    >
      {/* Header */}
      <div className="flex items-center justify-center gap-2">
        <Sliders className="text-green-600 dark:text-green-400" />
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">
          Filtros
        </h2>
      </div>

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

      {/* Botones */}
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
    </form>
  );
}
