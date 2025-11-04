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
    <div className="bg-white dark:bg-blue-950 border-t border-b border-blue-200 dark:border-blue-800 shadow-md py-4 px-6 flex flex-wrap items-center justify-between gap-4">
      {/* Tipo de Producto */}
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Tipo de Producto
        </label>
        <select
          name="productType"
          value={filters.productType}
          onChange={handleChange}
          className="border border-blue-300 rounded-lg px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/40 dark:text-white focus:ring-2 focus:ring-blue-400 transition"
        >
          <option value="">Todos</option>
          {productTypes.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Ciudad */}
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Ciudad
        </label>
        <input
          type="text"
          name="city"
          value={filters.city}
          onChange={handleChange}
          placeholder="Ej: Bogotá"
          className="border border-blue-300 rounded-lg px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/40 dark:text-white focus:ring-2 focus:ring-blue-400 transition"
        />
      </div>

      {/* Nombre del Producto */}
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Nombre
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-blue-400" />
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={handleChange}
            placeholder="Ej: Tomate"
            className="border border-blue-300 rounded-lg pl-10 px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/40 dark:text-white focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
      </div>

      {/* Ordenar */}
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-blue-900 dark:text-blue-300">
          Ordenar
        </label>
        <select
          name="sortBy"
          value={filters.sortBy}
          onChange={handleChange}
          className="border border-blue-300 rounded-lg px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/40 dark:text-white focus:ring-2 focus:ring-blue-400 transition"
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
        className="flex items-center gap-2 bg-blue-100 text-blue-900 dark:bg-blue-800 dark:text-white px-4 py-2 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-700 transition"
      >
        <XCircle className="h-4 w-4" /> Limpiar
      </button>
    </div>
  );
}
