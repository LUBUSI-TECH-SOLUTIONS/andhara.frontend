export interface Product {
  name: string
  units_sold: number
  profit: number
  net: number
}

export interface SalesReport {
  date: string // formato "YYYY-MM-DD"
  location: string
  products_sold: number
  total_quantity: number
  total_net: number
  total_profit: number
  products: Product[]
}

export type SalesReportParams = {
  skip?: number;
  limit?: number;
  id_branch?: string | number;
  mont?: number;
  year?: number;
  start_date?: string;
  end_date?: string;
};