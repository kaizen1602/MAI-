import React, { useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';

type LocationStat = {
  department: string;
  municipality?: string;
  avg_price?: number;
  total_posts?: number;
};

interface Props {
  data: LocationStat[];
  valueKey?: 'avg_price' | 'total_posts';
  onClickDepartment?: (dept: string) => void;
}

interface TooltipData {
  name: string;
  value: number;
  municipalityCount: number;
  totalPosts: number;
  avgPrice: number;
  x: number;
  y: number;
}

const GEO_JSON_URL = '/data/colombia-departamentos.json';

export default function ColombiaMap({ data, valueKey = 'avg_price', onClickDepartment }: Props) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  const valuesByDept = useMemo(() => {
    const map = new Map<string, number>();
    data.forEach(d => {
      const name = (d.department || '').trim().toLowerCase();
      const val = Number(d[valueKey] ?? 0);
      if (!map.has(name)) map.set(name, val);
      else map.set(name, map.get(name)! + val);
    });
    return map;
  }, [data, valueKey]);

  const detailedDataByDept = useMemo(() => {
    const map = new Map<string, { municipalities: Set<string>; totalPosts: number; avgPrice: number; count: number }>();
    data.forEach(d => {
      const name = (d.department || '').trim().toLowerCase();
      if (!map.has(name)) {
        map.set(name, { municipalities: new Set(), totalPosts: 0, avgPrice: 0, count: 0 });
      }
      const entry = map.get(name)!;
      if (d.municipality) entry.municipalities.add(d.municipality);
      entry.totalPosts += d.total_posts ?? 0;
      entry.avgPrice += d.avg_price ?? 0;
      entry.count++;
    });
    // Calcular promedio de precios
    map.forEach(entry => {
      if (entry.count > 0) {
        entry.avgPrice = entry.avgPrice / entry.count;
      }
    });
    return map;
  }, [data]);

  const allValues = Array.from(valuesByDept.values());
  const min = allValues.length ? Math.min(...allValues) : 0;
  const max = allValues.length ? Math.max(...allValues) : 1;
  const colorScale = scaleLinear<string>().domain([min, max]).range(['#f0f9ff', '#08306b']);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price);

  const handleMouseEnter = (deptNameRaw: string, event: React.MouseEvent) => {
    const key = deptNameRaw.trim().toLowerCase();
    const val = valuesByDept.get(key) ?? 0;
    const detailedData = detailedDataByDept.get(key);

    if (detailedData) {
      setTooltip({
        name: deptNameRaw,
        value: val,
        municipalityCount: detailedData.municipalities.size,
        totalPosts: detailedData.totalPosts,
        avgPrice: detailedData.avgPrice,
        x: event.clientX,
        y: event.clientY,
      });
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (tooltip) {
      setTooltip(prev => (prev ? { ...prev, x: event.clientX, y: event.clientY } : null));
    }
  };

  return (
    <div className="w-full relative" onMouseMove={handleMouseMove}>
      <ComposableMap projection="geoMercator" projectionConfig={{ scale: 2200, center: [-74, 4.5] }} width={800} height={520}>
        <Geographies geography={GEO_JSON_URL}>
          {({ geographies }) =>
            geographies.map(geo => {
              const deptNameRaw = (geo.properties?.name || geo.properties?.departamento || geo.properties?.NOMBRE || '') as string;
              const key = deptNameRaw.trim().toLowerCase();
              const val = valuesByDept.get(key) ?? 0;
              const fill = val ? colorScale(val) : '#f5f5f5';

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fill}
                  stroke="#666"
                  onMouseEnter={(e: React.MouseEvent) => handleMouseEnter(deptNameRaw, e)}
                  onMouseLeave={() => setTooltip(null)}
                  onClick={() => onClickDepartment && onClickDepartment(deptNameRaw)}
                  style={{
                    default: { outline: 'none', cursor: 'pointer' },
                    hover: { outline: 'none', opacity: 0.85, cursor: 'pointer', stroke: '#1e40af', strokeWidth: 2 },
                    pressed: { outline: 'none' },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      {/* Tooltip flotante */}
      {tooltip && (
        <div
          className="fixed bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg text-sm z-50 pointer-events-none"
          style={{
            left: `${tooltip.x + 10}px`,
            top: `${tooltip.y + 10}px`,
          }}
        >
          <div className="font-bold text-blue-300 mb-2">{tooltip.name.toUpperCase()}</div>
          <div className="space-y-1 text-xs">
            <div>
              <span className="text-gray-400">Precio Promedio:</span> <span className="text-green-400 font-semibold">{formatPrice(tooltip.avgPrice)}</span>
            </div>
            <div>
              <span className="text-gray-400">Total Publicaciones:</span> <span className="text-yellow-400 font-semibold">{tooltip.totalPosts.toLocaleString('es-CO')}</span>
            </div>
            <div>
              <span className="text-gray-400">Municipios:</span> <span className="text-blue-400 font-semibold">{tooltip.municipalityCount}</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 items-center mt-4 text-sm">
        <div className="inline-block w-6 h-4" style={{ background: '#f0f9ff' }} /> <span className="text-xs">Bajo</span>
        <div className="inline-block w-6 h-4 ml-2" style={{ background: '#08306b' }} /> <span className="text-xs">Alto</span>
      </div>
    </div>
  );
}
