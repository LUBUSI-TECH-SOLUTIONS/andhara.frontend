import apiClient from "@/app/apiClient"
import { supplierStatic } from "@/shared/static"
import type { Product } from "@/features/products/types/productTypes"

/**
 * Service responsible for interacting with the product API and managing product-related logic.
 */
export const ProductService = {
  /**
   * Retrieves the name of a supplier by its ID from a static supplier list.
   * @param supplierId - The ID of the supplier.
   * @returns The supplier name, or the ID if not found.
   */
  getSupplierName: (supplierId: string): string => {
    const supplier = supplierStatic.find((s) => s.id === supplierId)
    return supplier ? supplier.supplier_name : supplierId
  },

  /**
   * Returns supplier options for filtering, derived from a static list.
   * @returns An array of supplier IDs and names.
   */
  getSupplierFilterOptions: () => {
    return supplierStatic.map((supplier) => ({
      id: supplier.id,
      supplier_name: supplier.supplier_name,
    }))
  },

  /**
   * Fetches all products from the backend.
   * @returns A promise that resolves to a list of products.
   * @throws Error if the request fails.
   */
  getProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>("/v1/product/products")
    return response.data
  },

  /**
   * Fetches a single product by its ID.
   * @param id - The ID of the product.
   * @returns A promise that resolves to the product or null.
   * @throws Error if the request fails.
   */
  getProduct: async (id: string): Promise<Product | null> => {
    const response = await apiClient.get<Product>(`/v1/product/by-id/${id}`)
    return response.data
  },

  /**
   * Creates a new product.
   * @param product - Product data excluding the ID.
   * @returns A promise that resolves to the created product.
   * @throws Error if the request fails.
   */
  createProduct: async (product: Omit<Product, "id_product">): Promise<Product> => {
    const response = await apiClient.post<Product>("/v1/product/create-product", product)
    return response.data
  },

  /**
   * Updates an existing product.
   * @param product - The product object including its ID.
   * @returns A promise that resolves to the updated product.
   * @throws Error if the request fails.
   */
  updateProduct: async (product: Product): Promise<Product> => {
    const response = await apiClient.put<Product>(`/v1/product/update-product/${product.id_product}`, product)
    return response.data
  },

  /**
   * Sets a product's state to inactive.
   * @param id - The ID of the product.
   * @throws Error if the request fails.
   */
  toggleProductState: async (product: Product): Promise<void> => {
    const newState = !product.product_state;
    await apiClient.patch(
      `/v1/product/toggle-product/${product.id_product}?activate=${newState}`
    );
  },

  /**
   * Filters a list of products by the supplier ID.
   * @param products - The full list of products.
   * @param supplierId - The ID of the supplier to filter by.
   * @returns The filtered list of products.
   */
  filterProductsBySupplier: (products: Product[], supplierId: string | null): Product[] => {
    if (!supplierId) return products
    return products.filter((product) => product.id_supplier === supplierId)
  },
}
