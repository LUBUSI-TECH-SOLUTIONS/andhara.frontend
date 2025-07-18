export type SelectedProduct = {
  id: string
  name: string
  description: string
  price: number
  quantity: number
  vat: number
}
export type FormValues = {
  customerDocument: string
  branchId: string
  purchaseDuration: string
  paymentType: string
  paymentStatus: string
  remainingBalance: number
  deliveryType: string
  deliveryComment: string
  deliveryCost: number
}
export type ProductSelected = {
  id_product: string
  unit_quantity: number
}

export interface PurchaseRequest {
  customer_document: string
  id_branch: string
  purchase_duration: number,
  payment_type: string
  payment_status: string
  remaining_balance: number
  delivery_type: string
  delivery_comment?: string
  delivery_cost: number
  products: ProductSelected[]
} 


export interface CustomerService {
	id_customer_service: string;
	id_purchase: string;
	service_date: string;
  customer_document: string,
	customer_full_name: string;
	phone_number: string;
	branch_name: string;
	days_remaining: number;
	isComment: boolean;
	contact_comment: string;
	customer_service_status: boolean;
	id_branch: string;
}

export interface CustomerServiceById {
  id_customer_service: string;
  customer: Customer;
  purchase: Purchase;
  last_purchases: LastPurchases;
}

export interface Customer {
  customer_document: string;
  customer_first_name: string;
  customer_last_name: string;
  phone_number: string;
  email: string;
  home_address: string;
  branch_name: string;
  customer_full_name: string;
}

export interface Purchase {
  id_purchase: string;
  purchase_date: string; 
  payment_type: string;
  payment_status: string;
  subtotal_without_vat: number;
  total: number;
  days_remaining: number;
}

export interface LastPurchases {
  historical_purchases: number;
  purchases: PurchaseWithProducts[];
}

export interface PurchaseWithProducts {
  id_purchase: string;
  purchase_date: string;
  purchase_duration: number;
  next_purchase_date: string;
  total_purchase: number;
  products: Product[];
}

export interface Product {
  id_product: string;
  product_name: string;
  unit_quantity: number;
  subtotal_without_vat: number;
  total_price_with_vat: number;
}

export interface CustomerManagement {
  id_customer_service: string;
  contact_comment: string;
  customer_service_status?: boolean;
}