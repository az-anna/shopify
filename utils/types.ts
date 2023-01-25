export interface ShopifyImage {
  id: number;
  position: number;
  src: string | null;
}

export interface Variants {
  inventory_quantity: number
  inventory_id: number
  price: string
}


export interface ShopifyProduct {
  id: number;
  handle: string;
  status: string;
  updated_at: string;
  variants: Variants[]
  images: ShopifyImage[];
}