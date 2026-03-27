// Supply Request
export interface SupplyRequest {
  id: number;
  business_id: number;
  product_name: string;
  quantity: number;
  status: SupplyRequestStatus;
  description: string;
  created_at: string;
}

export type SupplyRequestStatus = 'open' | 'matched' | 'closed';

export interface CreateSupplyRequestReq {
  business_id: number;
  product_name: string;
  quantity: number;
  status: SupplyRequestStatus;
  description?: string;
}

export interface UpdateSupplyRequestReq {
  product_name?: string;
  quantity?: number;
  status?: SupplyRequestStatus;
}

// Supply Offer
export interface SupplyOffer {
  id: number;
  business_id: number;
  product_name: string;
  quantity: number;
  price: number;
  product_id?: number;
  status: string;
  description: string;
  created_at: string;
}

export interface CreateSupplyOfferReq {
  business_id: number;
  product_name: string;
  quantity: number;
  product_id?: number;
  description?: string;
}

export interface UpdateSupplyOfferReq {
  product_name?: string;
  quantity?: number;
  product_id?: number;
}

// Supply Match
export interface SupplyMatch {
  id: number;
  supply_offer_id: number;
  supply_request_id: number;
  status: SupplyMatchStatus;
  created_at: string;
}

export type SupplyMatchStatus = 'pending' | 'accepted' | 'rejected';

export interface CreateSupplyMatchReq {
  supply_offer_id: number;
  supply_request_id: number;
  status?: SupplyMatchStatus;
}

export interface UpdateSupplyMatchStatusReq {
  status: SupplyMatchStatus;
}