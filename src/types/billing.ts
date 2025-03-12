
export interface BillItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface BillHistoryItem {
  id: string;
  customer: string;
  total: number;
  date: string;
}
