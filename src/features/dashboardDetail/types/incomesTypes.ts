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
  month?: number;
  year?: number;
  start_date?: string;
  end_date?: string;
};

// Reports

export interface GlobalResume {
  total_purchases: {
    total_purchases: number
    products_involved: number
  }
  customers: {
    customers_involved: number
    branches_involved: number
    total_customers: number
    total_branches: number
  }
  global_financial: {
    total_revenue: number
    total_profit: number
    profit_margin: number
  }
}

export interface ProductSummary {
  rank_position: number
  product_name: string
  units_sold: number
  total_revenue: number
  total_profit: number
  profit_margin: number
}

export interface SalesDashboardResponse {
  global_resume: GlobalResume
  products_summary: ProductSummary[]
}
