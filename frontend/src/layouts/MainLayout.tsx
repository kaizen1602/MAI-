import { ReactNode } from "react";
import Navbar from "../components/Navbar";
import Filters from "../components/Filters";
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
      <Navbar />

      <div className="flex flex-col lg:flex-row p-4 lg:p-6 gap-6 w-full">
        {/* Sidebar filtros */}
        <aside className="hidden lg:block lg:w-1/6 w-full">
          {onFilter && <Filters onFilter={onFilter} />}
        </aside>

        {/* Contenido principal */}
        <div className="lg:w-4/6 w-full flex flex-col">{children}</div>

        {/* Publicidad */}
        <aside className="hidden lg:block lg:w-1/6 w-full">
          <AdBanner />
        </aside>
      </div>
    </div>
  );
}
