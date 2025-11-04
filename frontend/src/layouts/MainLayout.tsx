import { ReactNode } from "react";
import Navbar from "../components/Navbar";
import Filters from "../components/filters.tsx";
import AdBanner from "../components/AdBanner";

interface MainLayoutProps {
  children: ReactNode;
  onFilter?: (filters: any) => void;
  showFilters?: boolean;
}

export default function MainLayout({ children, onFilter }: MainLayoutProps) {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat transition-colors duration-300 dark:bg-gray-900"
      style={{
        backgroundImage: "url('/fondoMuro.jpg')",
      }}
    >
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <div className="flex flex-col lg:flex-row p-4 lg:p-6 gap-6 w-full">
        {/* Sidebar filtros */}
        <aside className="hidden lg:block lg:w-1/6 w-full">
          {onFilter && <Filters onFilter={onFilter} />}
        </aside>

        {/* Contenido principal - Ampliado de lg:w-4/6 a lg:w-5/6 para ocupar más espacio */}
        <div className="lg:w-5/6 w-full flex flex-col">{children}</div>

        {/* Publicidad */}
        <aside className="hidden lg:block lg:w-1/6 w-full">
          <AdBanner />
        </aside>
      </div>

      {/* Mobile filters - the Filters component handles its own mobile rendering */}
      {onFilter && (
        <div className="lg:hidden fixed inset-0 pointer-events-none">
          <Filters onFilter={onFilter} />
        </div>
      )}
    </div>
  );
}
