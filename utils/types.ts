export interface ShopifyImage {
  id: number;
  position: number;
  src: string | null;
}

export interface Variants {
  barcode: string
  inventory_quantity: number
  inventory_item_id: number
  inventory_id: number
  price: string
  sku: string
  option1: string
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

export interface EbayProduct {
  ItemID: string;
  Title: string;
  Currency:string;
  ListingDetails: {
    ViewItemURL: string;
  };
  Seller: {
    UserID: string
  };
  PictureDetails: {
    PictureURL: string
  };
  ShipToLocations: string;
  SellingStatus: {
    CurrentPrice: {
      value: string,
      _currencyID: string;
    };
  }
  Quantity: string;
  Storefront: {
    StoreURL: string
   };
}