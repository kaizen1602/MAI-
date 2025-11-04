import { useState, useEffect, useRef } from "react";
import { Search, XCircle, Sliders } from "lucide-react";
import { supportDataService } from "../data/services";
import type {
  Department,
  Municipality,
  ProductType,
} from "../data/types/product.types";
import type { PostType } from "../data/types/post.types";

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

  const [departments, setDepartments] = useState<Department[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isFirstRender = useRef(true);

  useEffect(() => {
    loadSupportData();
  }, []);

  const loadSupportData = async () => {
    try {
      setIsLoading(true);
      const data = await supportDataService.loadAllSupportData();
      setDepartments(data.departments);
      setProductTypes(data.productTypes);
    } catch (error) {
      console.error("Error cargando datos de filtros:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      onFilter(filters);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters, onFilter]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
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
    setTimeout(() => onFilter(resetFilters), 100);
  };

  // --- HORIZONTAL BAR ---
  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-950 border-t border-b border-blue-200 dark:border-blue-800 shadow-lg py-5 px-6 rounded-xl flex flex-wrap items-center justify-between gap-4">
      {/* Tipo de Producto */}
      <div className="flex flex-col min-w-[140px]">
        <label className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1 text-center">
          Tipo de Producto
        </label>
        <select
          name="productType"
          value={filters.productType}
          onChange={handleChange}
          className="border border-blue-300 dark:border-blue-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-blue-800/50 text-blue-900 dark:text-blue-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
        >
          <option value="">Todos</option>
          {productTypes.map((p) => (
            <option
              key={p.id}
              value={p.id}
              className="bg-white dark:bg-blue-800"
            >
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Ciudad */}
      <div className="flex flex-col min-w-[140px]">
        <label className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1 text-center">
          Ciudad
        </label>
        <input
          type="text"
          name="city"
          value={filters.city}
          onChange={handleChange}
          placeholder="Ej: Bogotá"
          className="border border-blue-300 dark:border-blue-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-blue-800/50 text-blue-900 dark:text-blue-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
        />
      </div>

      {/* Nombre del Producto */}
      <div className="flex flex-col min-w-[160px] flex-grow">
        <label className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1 text-center">
          Nombre
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-blue-400 dark:text-blue-300" />
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleChange}
            placeholder="Buscar productos..."
            className="border border-blue-300 dark:border-blue-700 rounded-lg pl-10 px-3 py-2 text-sm bg-white dark:bg-blue-800/50 text-blue-900 dark:text-blue-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm w-full"
          />
        </div>
      </div>

      {/* Ordenar */}
      <div className="flex flex-col min-w-[160px]">
        <label className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-1 text-center">
          Ordenar
        </label>
        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={handleChange}
          className="border border-blue-300 dark:border-blue-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-blue-800/50 text-blue-900 dark:text-blue-100 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm"
        >
          <option value="">Predeterminado</option>
          <option value="priceAsc">Precio: Menor a Mayor</option>
          <option value="priceDesc">Precio: Mayor a Menor</option>
          <option value="dateDesc">Más recientes</option>
          <option value="dateAsc">Más antiguos</option>
        </select>
      </div>

      {/* Botón limpiar */}
      <button
        type="button"
        onClick={handleReset}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 self-end h-fit mt-5"
      >
        <XCircle className="h-4 w-4" /> Limpiar
      </button>
    </div>
  );
}
