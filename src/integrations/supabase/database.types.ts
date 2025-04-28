
export type BillItem = {
  id: string;
  bill_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  price: number;
  created_at: string;
};

export type Bill = {
  id: string;
  bill_number: string;
  customer_email: string;
  total: number;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  product_id: string;
  name: string;
  price: number;
  stock: number;
  created_at: string;
};

export type CompanyProfile = {
  id: string;
  user_id: string;
  company_name: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  state: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  account_holder_name: string;
  logo_url: string | null;
  signature_url: string | null;
  created_at: string;
  updated_at: string;
};

export interface Database {
  public: {
    Tables: {
      bills: {
        Row: Bill;
        Insert: Omit<Bill, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Bill, 'id'>>;
      };
      bill_items: {
        Row: BillItem;
        Insert: Omit<BillItem, 'id' | 'created_at'>;
        Update: Partial<Omit<BillItem, 'id'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at'>;
        Update: Partial<Omit<Product, 'id'>>;
      };
      company_profiles: {
        Row: CompanyProfile;
        Insert: Omit<CompanyProfile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CompanyProfile, 'id'>>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
