import { useState, useEffect, useRef } from "react";
import { Search, XCircle, SlidersHorizontal, X, ChevronDown } from "lucide-react";
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Flag para evitar disparo en el primer render
  const isFirstRender = useRef(true);

  // Contar filtros activos
  const activeFiltersCount = Object.values(filters).filter(v => v !== "").length;

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

  // Aplicar filtros cuando cambian (skip primer render) - SOLO EN DESKTOP
  useEffect(() => {
    // Skip first render to avoid double loading
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Solo aplicar automáticamente en desktop (drawer cerrado)
    if (isDrawerOpen) return;

    const timer = setTimeout(() => {
      onFilter(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, onFilter, isDrawerOpen]);

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

  const applyAndClose = () => {
    onFilter(filters);
    setIsDrawerOpen(false);
  };

  // Cerrar drawer con Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsDrawerOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Prevenir scroll del body cuando el drawer está abierto
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  return (
    <>
      {/* === VERSIÓN MÓVIL: Botón + Drawer === */}
      <div className="lg:hidden">
        {/* Botón para abrir filtros */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border-2 border-blue-500 text-blue-600 dark:text-blue-400 px-6 py-4 rounded-2xl shadow-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-all active:scale-[0.98]"
        >
          <SlidersHorizontal className="h-5 w-5" />
          <span className="font-semibold text-lg">Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Backdrop */}
        {isDrawerOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />
        )}

        {/* Drawer desde abajo */}
        <div
          className={`fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ease-out ${
            isDrawerOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col">
            {/* Handle para arrastrar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>

            {/* Header del drawer */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Filtros
              </h2>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Contenido scrolleable */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-4">
                {/* Búsqueda rápida */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Buscar
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={filters.name}
                      onChange={handleChange}
                      placeholder="Buscar productos..."
                      className="w-full border border-gray-200 dark:border-gray-600 rounded-xl pl-11 pr-4 py-3 text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Tipo de Producto */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Tipo de Producto
                  </label>
                  <div className="relative">
                    <select
                      name="productType"
                      value={filters.productType}
                      onChange={handleChange}
                      className="w-full appearance-none border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                    >
                      <option value="">Todos los productos</option>
                      {productTypes.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Ciudad */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={filters.city}
                    onChange={handleChange}
                    placeholder="Ej: Bogotá, Medellín..."
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                {/* Ordenar */}
                <div className="flex flex-col">
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    Ordenar por
                  </label>
                  <div className="relative">
                    <select
                      name="sortBy"
                      value={filters.sortBy}
                      onChange={handleChange}
                      className="w-full appearance-none border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-base bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all pr-10"
                    >
                      <option value="">Más relevantes</option>
                      <option value="priceAsc">Precio: Menor a Mayor</option>
                      <option value="priceDesc">Precio: Mayor a Menor</option>
                      <option value="dateDesc">Más recientes</option>
                      <option value="dateAsc">Más antiguos</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción fijos */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 space-y-3">
              <button
                onClick={applyAndClose}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98]"
              >
                Ver resultados
              </button>
              <button
                onClick={handleReset}
                className="w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold py-4 rounded-xl transition-all"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* === VERSIÓN DESKTOP: Filtros inline === */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg py-5 px-6 rounded-2xl">
        <div className="grid grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                name="name"
                value={filters.name}
                onChange={handleChange}
                placeholder="Buscar..."
                className="w-full border border-gray-200 dark:border-gray-600 rounded-lg pl-10 pr-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Tipo de Producto */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
              Tipo de Producto
            </label>
            <select
              name="productType"
              value={filters.productType}
              onChange={handleChange}
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
              Ciudad
            </label>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleChange}
              placeholder="Ej: Bogotá"
              className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Ordenar + Limpiar */}
          <div className="flex flex-col">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
              Ordenar
            </label>
            <div className="flex gap-2">
              <select
                name="sortBy"
                value={filters.sortBy}
                onChange={handleChange}
                className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">Predeterminado</option>
                <option value="priceAsc">Menor precio</option>
                <option value="priceDesc">Mayor precio</option>
                <option value="dateDesc">Más recientes</option>
              </select>
              <button
                onClick={handleReset}
                className="p-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                title="Limpiar filtros"
              >
                <XCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
