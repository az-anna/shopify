export interface ShopifyImage {
  id: number;
  position: number;
  src: string | null;
}

export interface Variants {
  inventory_quantity: number
  inventory_id: number
  price: string
  sku: string
}


export interface ShopifyProduct {
  id: number;
  title: string;
  vendor: string;
  status: string;
  updated_at: string | null;
  created_at: string | null;
  variants: Variants[]
  images: ShopifyImage[];
}