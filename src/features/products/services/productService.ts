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
    try {
      const response = await apiClient.get<Product[]>("/product/products")
      return response.data
    } catch (error) {
      console.error("Error fetching products:", error)
      throw new Error("Error fetching products")
    }
  },

  /**
   * Fetches a single product by its ID.
   * @param id - The ID of the product.
   * @returns A promise that resolves to the product or null.
   * @throws Error if the request fails.
   */
  getProduct: async (id: string): Promise<Product | null> => {
    try {
      const response = await apiClient.get<Product>(`/product/by-id/${id}`)
      return response.data
    } catch (error) {
      console.error(`Error fetching product with ID ${id}:`, error)
      throw new Error(`Error fetching product with ID ${id}`)
    }
  },

  /**
   * Creates a new product.
   * @param product - Product data excluding the ID.
   * @returns A promise that resolves to the created product.
   * @throws Error if the request fails.
   */
  createProduct: async (product: Omit<Product, "id_product">): Promise<Product> => {
    try {
      const response = await apiClient.post<Product>("/product/create-product", product)
      return response.data
    } catch (error) {
      console.error("Error creating product:", error)
      throw new Error("Error creating product")
    }
  },

  /**
   * Updates an existing product.
   * @param product - The product object including its ID.
   * @returns A promise that resolves to the updated product.
   * @throws Error if the request fails.
   */
  updateProduct: async (product: Product): Promise<Product> => {
    try {
      const response = await apiClient.put<Product>(`/product/update-product/${product.id_product}`, product)
      return response.data
    } catch (error) {
      console.error(`Error updating product with ID ${product.id_product}:`, error)
      throw new Error(`Error updating product with ID ${product.id_product}`)
    }
  },

  /**
   * Sets a product's state to inactive.
   * @param id - The ID of the product.
   * @throws Error if the request fails.
   */
  inactivateProduct: async (id: string): Promise<void> => {
    try {
      await apiClient.patch(`/product/inactivate/${id}`)
    } catch (error) {
      console.error(`Error inactivating product with ID ${id}:`, error)
      throw new Error(`Error inactivating product with ID ${id}`)
    }
  },

  /**
   * Sets a product's state to active.
   * @param id - The ID of the product.
   * @throws Error if the request fails.
   */
  activateProduct: async (id: string): Promise<void> => {
    try {
      await apiClient.patch(`/product/activate/${id}`)
    } catch (error) {
      console.error(`Error activating product with ID ${id}:`, error)
      throw new Error(`Error activating product with ID ${id}`)
    }
  },

  /**
   * Toggles the active/inactive state of a product.
   * @param id - The ID of the product.
   * @param currentState - The current state of the product.
   * @returns A promise that resolves to the updated product.
   * @throws Error if the toggle or subsequent fetch fails.
   */
  toggleProductState: async (id: string, currentState?: boolean): Promise<Product> => {
    try {
      if (currentState) {
        await ProductService.inactivateProduct(id)
      } else {
        await ProductService.activateProduct(id)
      }

      const updatedProduct = await ProductService.getProduct(id)

      if (!updatedProduct) {
        throw new Error(`Product with ID ${id} not found after toggle`)
      }

      return updatedProduct
    } catch (error) {
      console.error(`Error toggling state for product with ID ${id}:`, error)
      throw error
    }
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
