
export interface BillItem {
  id?: string;
  bill_id?: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

export interface BillHistoryItem {
  id: string;
  bill_number: string;
  customer_email: string;
  total: number;
  created_at: string;
}

export interface Product {
  id: string;
  product_id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Client {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  total_purchases: number;
  purchase_count: number;
}
