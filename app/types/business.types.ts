export interface Business {
  id: number;
  user_id: number;
  name: string;
  description: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  whatsapp: string;
  instagram: string;
  tiktok: string;
  website: string;
  logo_url: string;
  is_verified: boolean;
  created_at: string;
}

export interface BusinessMetric {
  id: number;
  business_id: number;
  revenue: number;
  operational_cost: number;
  cogs: number;
  net_profit: number;
  period: string; // MM-YYYY format based on API docs handling maybe
  period_start: string;
  period_end: string;
  created_at: string;
}

// And other similar interfaces like BusinessScore
