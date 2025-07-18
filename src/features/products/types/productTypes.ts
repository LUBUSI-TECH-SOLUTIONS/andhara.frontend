/**
 * Represents stock information for a specific product in a specific branch.
 */
export interface StockInfo {
  /** Optional product ID. */
  id_product?: string

  /** ID of the branch where the stock is located. */
  id_branch: string

  /** Quantity of the product available in the branch. */
  quantity: number
}

/**
 * Represents the complete information of a product.
 */
export interface Product {
  /** Optional unique product ID. */
  id_product?: string

  /** ID of the supplier associated with the product. */
  id_supplier: string

  /** Name of the product. */
  product_name: string

  /** Description of the product. */
  product_description: string

  /** Purchase price of the product. */
  purchase_price: number

  /** Discount applied to the product (in percentage). */
  product_discount: number

  /** Sale price of the product. */
  sale_price: number

  /** Optional calculated profit margin (in percentage). */
  profit_margin?: number

  /** Optional value-added tax (VAT) applied to the product. */
  vat?: number

  /** Optional state of the product (active/inactive). */
  product_state?: boolean

  /** Array of stock information across branches. */
  stock: StockInfo[]
}

/**
 * Represents filters that can be applied to a product table view.
 */
export interface ProductTableFilters {
  /** Filter by supplier ID. */
  id_supplier: string | null

  /** Filter by minimum discount value. */
  discount: number | null

  /** Filter by minimum stock quantity. */
  minStock: number | null

  /** Filter by product active state. */
  product_state: boolean | null
}
