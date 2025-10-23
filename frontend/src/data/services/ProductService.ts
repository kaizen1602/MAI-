/**
 * ProductService.ts
 * 
 * Servicio para la gestión de productos.
 * Implementa operaciones CRUD y búsqueda de productos.
 * 
 * Principios SOLID aplicados:
 * - Single Responsibility: Solo maneja operaciones relacionadas con productos
 * - Open/Closed: Extiende BaseService sin modificarlo
 * - Dependency Inversion: Depende de abstracciones (BaseService, tipos)
 */

import { BaseService } from './base/BaseService';
import { ENDPOINTS } from '../api/endpoints';
import type {
  Product,
  ProductFilters,
  CursorPaginatedResponse,
  CreateProductRequest,
  UpdateProductRequest,
  ProductImage
} from '../types/product.types';

/**
 * Servicio singleton para gestión de productos
 */
export class ProductService extends BaseService {
  private static instance: ProductService;

  /**
   * Constructor privado para implementar patrón Singleton
   */
  private constructor() {
    super();
  }

  /**
   * Obtiene la instancia única del servicio
   */
  public static getInstance(): ProductService {
    if (!ProductService.instance) {
      ProductService.instance = new ProductService();
    }
    return ProductService.instance;
  }

  /**
   * Obtiene lista paginada de productos con filtros opcionales
   * 
   * @param filters - Filtros opcionales (tipo, ubicación, precio, búsqueda)
   * @returns Promise con respuesta paginada de productos
   * 
   * @example
   * const products = await ProductService.getInstance().getProducts({
   *   product_type_id: 1,
   *   min_price: 100,
   *   max_price: 500,
   *   department_id: 1
   * });
   */
  async getProducts(filters?: ProductFilters): Promise<CursorPaginatedResponse<Product>> {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.product_type_id) params.append('product_type_id', filters.product_type_id.toString());
      if (filters.department_id) params.append('department_id', filters.department_id.toString());
      if (filters.municipality_id) params.append('municipality_id', filters.municipality_id.toString());
      if (filters.min_price !== undefined) params.append('min_price', filters.min_price.toString());
      if (filters.max_price !== undefined) params.append('max_price', filters.max_price.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.cursor) params.append('cursor', filters.cursor);
      if (filters.limit) params.append('limit', filters.limit.toString());
    }

    const url = params.toString() 
      ? `${ENDPOINTS.PRODUCTS.BASE}?${params.toString()}`
      : ENDPOINTS.PRODUCTS.BASE;

    return this.handleRequest<CursorPaginatedResponse<Product>>(
      this.client.get(url)
    );
  }

  /**
   * Obtiene un producto específico por ID
   * 
   * @param id - ID del producto
   * @returns Promise con el producto
   * 
   * @example
   * const product = await ProductService.getInstance().getProduct(1);
   */
  async getProduct(id: number): Promise<Product> {
    return this.handleRequest<Product>(
      this.client.get(ENDPOINTS.PRODUCTS.DETAIL(id))
    );
  }

  /**
   * Crea un nuevo producto
   * 
   * @param data - Datos del producto a crear
   * @returns Promise con el producto creado
   * 
   * @example
   * const newProduct = await ProductService.getInstance().createProduct({
   *   name: 'Manzanas Rojas',
   *   description: 'Manzanas frescas de exportación',
   *   price: 250.00,
   *   unit: 'kg',
   *   product_type_id: 1,
   *   department_id: 1,
   *   municipality_id: 1,
   *   contact_phone: '555-1234',
   *   contact_email: 'vendedor@example.com'
   * });
   */
  async createProduct(data: CreateProductRequest): Promise<Product> {
    return this.handleRequest<Product>(
      this.client.post(ENDPOINTS.PRODUCTS.BASE, data)
    );
  }

  /**
   * Actualiza un producto existente
   * 
   * @param id - ID del producto a actualizar
   * @param data - Datos a actualizar
   * @returns Promise con el producto actualizado
   * 
   * @example
   * const updated = await ProductService.getInstance().updateProduct(1, {
   *   price: 300.00,
   *   available: true
   * });
   */
  async updateProduct(id: number, data: UpdateProductRequest): Promise<Product> {
    return this.handleRequest<Product>(
      this.client.put(ENDPOINTS.PRODUCTS.DETAIL(id), data)
    );
  }

  /**
   * Elimina un producto
   * 
   * @param id - ID del producto a eliminar
   * @returns Promise que se resuelve cuando se elimina
   * 
   * @example
   * await ProductService.getInstance().deleteProduct(1);
   */
  async deleteProduct(id: number): Promise<void> {
    await this.handleRequest<void>(
      this.client.delete(ENDPOINTS.PRODUCTS.DETAIL(id))
    );
  }

  /**
   * Agrega una imagen a un producto
   * 
   * @param productId - ID del producto
   * @param image - Archivo de imagen
   * @returns Promise que se resuelve cuando se agrega la imagen
   * 
   * @example
   * const file = event.target.files[0];
   * await ProductService.getInstance().addImage(1, file);
   */
  async addImage(productId: number, image: File): Promise<ProductImage> {
    const formData = new FormData();
    formData.append('image', image);

    return this.handleRequest<ProductImage>(
      this.client.post(ENDPOINTS.PRODUCTS.ADD_IMAGE(productId), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    );
  }

  /**
   * Elimina una imagen de un producto
   * 
   * @param imageId - ID de la imagen a eliminar
   * @returns Promise que se resuelve cuando se elimina
   * 
   * @example
   * await ProductService.getInstance().deleteImage(5);
   */
  async deleteImage(imageId: number): Promise<void> {
    await this.handleRequest<void>(
      this.client.delete(ENDPOINTS.PRODUCTS.DELETE_IMAGE(imageId))
    );
  }

  /**
   * Obtiene productos por tipo
   * 
   * @param productTypeId - ID del tipo de producto
   * @param additionalFilters - Filtros adicionales opcionales
   * @returns Promise con respuesta paginada de productos
   * 
   * @example
   * const frutas = await ProductService.getInstance().getProductsByType(1);
   */
  async getProductsByType(
    productTypeId: number,
    additionalFilters?: Partial<ProductFilters>
  ): Promise<CursorPaginatedResponse<Product>> {
    return this.getProducts({
      ...additionalFilters,
      product_type_id: productTypeId,
    });
  }

  /**
   * Obtiene productos de un usuario específico
   * 
   * @param userId - ID del usuario
   * @param filters - Filtros opcionales
   * @returns Promise con respuesta paginada de productos
   * 
   * @example
   * const myProducts = await ProductService.getInstance().getUserProducts(1);
   */
  async getUserProducts(
    userId: number,
    filters?: Partial<ProductFilters>
  ): Promise<CursorPaginatedResponse<Product>> {
    const params = new URLSearchParams();

    if (filters) {
      if (filters.product_type_id) params.append('product_type_id', filters.product_type_id.toString());
      if (filters.cursor) params.append('cursor', filters.cursor);
      if (filters.limit) params.append('limit', filters.limit.toString());
    }

    const url = params.toString()
      ? `${ENDPOINTS.PRODUCTS.BY_USER(userId)}?${params.toString()}`
      : ENDPOINTS.PRODUCTS.BY_USER(userId);

    return this.handleRequest<CursorPaginatedResponse<Product>>(
      this.client.get(url)
    );
  }

  /**
   * Busca productos por término de búsqueda
   * 
   * @param searchTerm - Término a buscar
   * @param filters - Filtros opcionales adicionales
   * @returns Promise con respuesta paginada de productos
   * 
   * @example
   * const results = await ProductService.getInstance().searchProducts('manzana');
   */
  async searchProducts(
    searchTerm: string,
    filters?: Partial<ProductFilters>
  ): Promise<CursorPaginatedResponse<Product>> {
    return this.getProducts({
      ...filters,
      search: searchTerm,
    });
  }

  /**
   * Obtiene productos por rango de precio
   * 
   * @param minPrice - Precio mínimo
   * @param maxPrice - Precio máximo
   * @param additionalFilters - Filtros adicionales opcionales
   * @returns Promise con respuesta paginada de productos
   * 
   * @example
   * const affordable = await ProductService.getInstance().getProductsByPriceRange(100, 500);
   */
  async getProductsByPriceRange(
    minPrice: number,
    maxPrice: number,
    additionalFilters?: Partial<ProductFilters>
  ): Promise<CursorPaginatedResponse<Product>> {
    return this.getProducts({
      ...additionalFilters,
      min_price: minPrice,
      max_price: maxPrice,
    });
  }
}

// Exportar instancia singleton para conveniencia
export default ProductService.getInstance();
