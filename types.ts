
export interface CategoryConfig {
  id: string;
  name: string;
  isFront: boolean; // true = Front Page, false = Back Page
}

export interface Dish {
  id: string;
  name: string;
  price: number;
  category: string; // Changed from enum to string to allow dynamic creation
  description: string;
  imageUrl: string;
  spicyLevel?: 0 | 1 | 2 | 3; // 0: none, 1: mild, 2: medium, 3: super
  popular?: boolean;
}

export interface CartItem extends Dish {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  totalAmount: number;
  totalItems: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'completed' | 'cancelled';
  customerName?: string;
  customerPhone?: string;
  tableNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  dishId: string | null;
  dishName: string;
  dishCategory: string;
  dishPrice: number;
  quantity: number;
  subtotal: number;
  isPopular: boolean;
  createdAt: string;
}

export interface CreateOrderRequest {
  items: CartItem[];
  customerName?: string;
  customerPhone?: string;
  tableNumber?: string;
  notes?: string;
}
