export type DashboardCustomer = {
  name: string;
  email: string;
  phone: string | null;
  member_since: string | null;
};

export type OrderDelivery = {
  status: string;
  shipped_at: string | null;
  delivered_at: string | null;
  tracking_number: string | null;
  carrier: string | null;
};

export type DashboardOrderSummary = {
  id: number;
  order_number: string;
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
  items_count: number | null;
  delivery: OrderDelivery;
  items?: { id: number; product_name: string; quantity: number; total_price: number }[];
};

export type DashboardQuoteSummary = {
  id: number;
  request_number: string;
  status: string;
  status_label: string;
  urgency: string;
  deadline: string | null;
  created_at: string;
  items_count: number | null;
  has_admin_response: boolean;
  quotation_total: number | null;
  quotation_status: string | null;
  view_quote_url: string | null;
  items?: { id: number; product_name: string; quantity: number; product_sku: string | null }[];
};

export type DashboardSummary = {
  customer: DashboardCustomer;
  total_orders: number;
  processing_orders: number;
  shipped_orders: number;
  completed_orders: number;
  total_spent: number;
  pending_payments: number;
  paid_amount: number;
  quote_counts: { total: number; open: number; quoted: number };
  recent_orders: DashboardOrderSummary[];
  recent_quotes: DashboardQuoteSummary[];
};
