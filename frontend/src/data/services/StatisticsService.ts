import { BaseService } from './base/BaseService';

import { postService } from './index';

export interface PriceStats {
  product_name: string;
  min_price: number;
  max_price: number;
  avg_price: number;
  total_posts: number;
}

export interface ProductStats {
  product_type: string;
  total_posts: number;
  total_quantity: number;
  avg_price: number;
}

export interface LocationStats {
  municipality: string;
  department: string;
  total_posts: number;
  avg_price: number;
  latitude?: number;
  longitude?: number;
}

export interface MarketTrends {
  date: string;
  total_posts: number;
  avg_price: number;
  total_quantity: number;
}

class StatisticsService extends BaseService {
  /**
   * Obtiene estadísticas de precios por producto usando datos reales
   */
  async getPriceStatistics(): Promise<PriceStats[]> {
    try {
      // Obtener todas las publicaciones (máximo 100 por página)
      // Usar un filtro de estado por defecto para evitar problemas de autenticación
      const response = await postService.getPosts({ per_page: 100, status: 'ACTIVE' });
      const posts = response.data;

      if (!posts || posts.length === 0) {
        return [];
      }

      // Agrupar por producto y calcular estadísticas
      const productStats = new Map<string, {
        prices: number[];
        quantities: number[];
        count: number;
      }>();

      posts.forEach(post => {
        if (post.product && post.price_per_kg && post.quantity_kg) {
          const productName = post.product.name;
          if (!productStats.has(productName)) {
            productStats.set(productName, { prices: [], quantities: [], count: 0 });
          }
          const stats = productStats.get(productName)!;
          stats.prices.push(post.price_per_kg);
          stats.quantities.push(post.quantity_kg);
          stats.count++;
        }
      });

      // Convertir a formato de estadísticas
      return Array.from(productStats.entries()).map(([productName, stats]) => ({
        product_name: productName,
        min_price: Math.min(...stats.prices),
        max_price: Math.max(...stats.prices),
        avg_price: Math.round(stats.prices.reduce((a, b) => a + b, 0) / stats.prices.length),
        total_posts: stats.count
      }));
    } catch (error) {
      console.error('Error getting price statistics:', error);
      return [];
    }
  }

  /**
   * Obtiene estadísticas por tipo de producto usando datos reales
   */
  async getProductStatistics(): Promise<ProductStats[]> {
    try {
      const response = await postService.getPosts({ per_page: 100, status: 'ACTIVE' });
      const posts = response.data;

      if (!posts || posts.length === 0) {
        return [];
      }

      const typeStats = new Map<string, {
        prices: number[];
        quantities: number[];
        count: number;
      }>();

      posts.forEach(post => {
        if (post.product && post.price_per_kg && post.quantity_kg) {
          const productType = post.product.product_type?.name || 'Sin categoría';
          if (!typeStats.has(productType)) {
            typeStats.set(productType, { prices: [], quantities: [], count: 0 });
          }
          const stats = typeStats.get(productType)!;
          stats.prices.push(post.price_per_kg);
          stats.quantities.push(post.quantity_kg);
          stats.count++;
        }
      });

      return Array.from(typeStats.entries()).map(([productType, stats]) => ({
        product_type: productType,
        total_posts: stats.count,
        total_quantity: Math.round(stats.quantities.reduce((a, b) => a + b, 0)),
        avg_price: Math.round(stats.prices.reduce((a, b) => a + b, 0) / stats.prices.length)
      }));
    } catch (error) {
      console.error('Error getting product statistics:', error);
      return [];
    }
  }

  /**
   * Obtiene estadísticas por ubicación usando datos reales
   */
  async getLocationStatistics(): Promise<LocationStats[]> {
    try {
      const response = await postService.getPosts({ per_page: 100, status: 'ACTIVE' });
      const posts = response.data;

      console.log('Respuesta completa de posts:', response);
      console.log('Datos de posts:', posts);

      if (!posts || posts.length === 0) {
        return [];
      }

      const locationStats = new Map<string, {
        prices: number[];
        count: number;
        municipality: string;
        department: string;
        latitude?: number;
        longitude?: number;
      }>();

      console.log('Datos de posts recibidos:', posts);
      posts.forEach((post, index) => {
        console.log(`Procesando post ${index}:`, post);
        if (post.municipality && post.price_per_kg) {
          // Obtener el nombre del departamento
          // Nota: La API no siempre incluye la relación department en municipality
          // Por eso usamos un valor predeterminado
          let departmentName = 'Sin departamento';
          
          // Intentar obtener el departamento del municipio si tiene la relación
          // Nota: La API puede incluir el departamento en algunos casos
          console.log('Municipio:', post.municipality);
          if (post.municipality && (post.municipality as any).department) {
            const dept = (post.municipality as any).department;
            console.log('Departamento encontrado:', dept);
            if (typeof dept === 'object' && dept.name) {
              departmentName = dept.name;
              console.log('Nombre del departamento establecido:', departmentName);
            } else if (typeof dept === 'string') {
              departmentName = dept;
              console.log('Nombre del departamento establecido (string):', departmentName);
            }
          } else if (post.municipality && (post.municipality as any).department_name) {
            // Si el departamento no está en la relación pero sí como propiedad directa
            departmentName = (post.municipality as any).department_name;
            console.log('Nombre del departamento establecido (department_name):', departmentName);
          } else {
            console.log('No se encontró departamento para este municipio');
          }
          
          const locationKey = `${post.municipality.name}-${departmentName}`;
          console.log('Clave de ubicación:', locationKey);
          
          // Verificar si ya tenemos estadísticas para esta ubicación
          if (!locationStats.has(locationKey)) {
            // Obtener coordenadas del municipio desde los datos del post
            const latitude = post.municipality.latitude;
            const longitude = post.municipality.longitude;
            
            console.log('Coordenadas del municipio:', { latitude, longitude });
            
            locationStats.set(locationKey, {
              prices: [],
              count: 0,
              municipality: post.municipality.name,
              department: departmentName,
              latitude: latitude ? parseFloat(latitude.toString()) : undefined,
              longitude: longitude ? parseFloat(longitude.toString()) : undefined
            });
          }
          
          const stats = locationStats.get(locationKey)!;
          stats.prices.push(post.price_per_kg);
          stats.count++;
          
          console.log('Estadísticas actualizadas:', stats);
        }
      });

      // Convertir a formato de estadísticas
      const locationStatsArray = Array.from(locationStats.values());
      const locationStatsWithAverages = locationStatsArray.map(stats => ({
        municipality: stats.municipality,
        department: stats.department,
        total_posts: stats.count,
        avg_price: Math.round(stats.prices.reduce((a, b) => a + b, 0) / stats.prices.length),
        latitude: stats.latitude,
        longitude: stats.longitude
      }));

      return locationStatsWithAverages;
    } catch (error) {
      console.error('Error getting location statistics:', error);
      return [];
    }
  }

  /**
   * Obtiene tendencias del mercado por fecha usando datos reales
   */
  async getMarketTrends(): Promise<MarketTrends[]> {
    try {
      const response = await postService.getPosts({ per_page: 100, status: 'ACTIVE' });
      const posts = response.data;

      if (!posts || posts.length === 0) {
        return [];
      }

      const dateStats = new Map<string, {
        prices: number[];
        quantities: number[];
        count: number;
      }>();

      posts.forEach(post => {
        if (post.created_at && post.price_per_kg && post.quantity_kg) {
          const date = new Date(post.created_at).toISOString().split('T')[0];
          if (!dateStats.has(date)) {
            dateStats.set(date, { prices: [], quantities: [], count: 0 });
          }
          const stats = dateStats.get(date)!;
          stats.prices.push(post.price_per_kg);
          stats.quantities.push(post.quantity_kg);
          stats.count++;
        }
      });

      return Array.from(dateStats.entries())
        .map(([date, stats]) => ({
          date,
          total_posts: stats.count,
          avg_price: Math.round(stats.prices.reduce((a, b) => a + b, 0) / stats.prices.length),
          total_quantity: Math.round(stats.quantities.reduce((a, b) => a + b, 0))
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-7); // Últimos 7 días
    } catch (error) {
      console.error('Error getting market trends:', error);
      return [];
    }
  }

  /**
   * Obtiene estadísticas generales del mercado usando datos reales
   */
  async getMarketOverview(): Promise<{
    total_posts: number;
    total_users: number;
    total_products: number;
    avg_price: number;
    price_range: { min: number; max: number };
  }> {
    try {
      const response = await postService.getPosts({ per_page: 100, status: 'ACTIVE' });
      const posts = response.data;

      if (!posts || posts.length === 0) {
        return {
          total_posts: 0,
          total_users: 0,
          total_products: 0,
          avg_price: 0,
          price_range: { min: 0, max: 0 }
        };
      }

      const prices = posts.filter(p => p.price_per_kg).map(p => p.price_per_kg!);
      const uniqueUsers = new Set(posts.map(p => p.user.id));
      const uniqueProducts = new Set(posts.filter(p => p.product).map(p => p.product!.id));

      return {
        total_posts: posts.length,
        total_users: uniqueUsers.size,
        total_products: uniqueProducts.size,
        avg_price: prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0,
        price_range: {
          min: prices.length > 0 ? Math.min(...prices) : 0,
          max: prices.length > 0 ? Math.max(...prices) : 0
        }
      };
    } catch (error) {
      console.error('Error getting market overview:', error);
      return {
        total_posts: 0,
        total_users: 0,
        total_products: 0,
        avg_price: 0,
        price_range: { min: 0, max: 0 }
      };
    }
  }
}

export default new StatisticsService();