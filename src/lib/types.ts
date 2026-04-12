export interface Product {
  id: string;
  name: string;
  price: number;
  type: "core" | "exclusive";
  total_quantity: number;
  remaining_quantity: number;
  image_url: string | null;
  images: string[];
  drop_id: string;
  sizes: string[];
  created_at: string;
}

export interface Order {
  id: string;
  email: string;
  product_id: string;
  quantity: number;
  size: string | null;
  payment_status: "pending" | "paid" | "failed";
  stripe_session_id: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      products: {
        Row: Product;
        Insert: Partial<Pick<Product, "id" | "created_at">> &
          Omit<Product, "id" | "created_at">;
        Update: Partial<Product>;
      };
      orders: {
        Row: Order;
        Insert: Partial<Pick<Order, "id" | "created_at">> &
          Omit<Order, "id" | "created_at">;
        Update: Partial<Order>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
