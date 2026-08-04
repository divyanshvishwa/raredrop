export interface ProductColor {
  name: string;
  hex: string;
  image_url: string;
}

export interface Product {
  id: string;
  name: string;
  price: number; // Price will be a number in the database
  type: "core" | "exclusive";
  total_quantity: number;
  remaining_quantity: number;
  image_url: string | null;
  images: string[];
  drop_id: string;
  sizes: string[];
  category: string | null;
  gender: string | null;
  created_at: string;
  colors?: ProductColor[];
  description?: string; // Add description to the base Product interface
}

// New interface for accessories, allowing string price and making some fields optional
export interface AccessoryProduct extends Omit<Product, 'price' | 'type' | 'total_quantity' | 'remaining_quantity' | 'images' | 'drop_id' | 'sizes' | 'category' | 'gender' | 'created_at'> {
  price: string; // Price is a string for accessories (e.g., '₹123')
  type?: "core" | "exclusive"; // Make optional
  total_quantity?: number; // Make optional
  remaining_quantity?: number; // Make optional
  images?: string[]; // Make optional
  drop_id?: string; // Make optional
  sizes?: string[]; // Make optional
  category?: string; // Make optional
  gender?: string; // Make optional
  created_at?: string; // Make optional
}

export interface Order {
  id: string;
  email: string;
  product_id: string;
  quantity: number;
  size: string | null;
  color: string | null;
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

