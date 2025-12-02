import { supabase } from './supabase';
import type { CreateOrderRequest, Order, OrderItem } from '../types';

/**
 * Create a new order with items
 */
export async function createOrder(request: CreateOrderRequest): Promise<{ order: Order; items: OrderItem[] } | null> {
  if (!supabase) {
    console.error('Supabase is not configured');
    return null;
  }

  try {
    // Calculate totals
    const totalAmount = request.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = request.items.reduce((sum, item) => sum + item.quantity, 0);

    // Generate order number
    const { data: orderNumberData, error: orderNumberError } = await supabase
      .rpc('generate_order_number');

    if (orderNumberError) {
      console.error('Error generating order number:', orderNumberError);
      return null;
    }

    // Create order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumberData,
        total_amount: totalAmount,
        total_items: totalItems,
        status: 'pending',
        customer_name: request.customerName || '',
        customer_phone: request.customerPhone || '',
        table_number: request.tableNumber || '',
        notes: request.notes || '',
      })
      .select()
      .single();

    if (orderError || !orderData) {
      console.error('Error creating order:', orderError);
      return null;
    }

    // Create order items
    const orderItems = request.items.map(item => ({
      order_id: orderData.id,
      dish_id: item.id,
      dish_name: item.name,
      dish_category: item.category,
      dish_price: item.price,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
      is_popular: item.popular || false,
    }));

    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)
      .select();

    if (itemsError || !itemsData) {
      console.error('Error creating order items:', itemsError);
      // Rollback: delete the order
      await supabase.from('orders').delete().eq('id', orderData.id);
      return null;
    }

    // Transform database response to application types
    const order: Order = {
      id: orderData.id,
      orderNumber: orderData.order_number,
      totalAmount: parseFloat(orderData.total_amount),
      totalItems: orderData.total_items,
      status: orderData.status,
      customerName: orderData.customer_name,
      customerPhone: orderData.customer_phone,
      tableNumber: orderData.table_number,
      notes: orderData.notes,
      createdAt: orderData.created_at,
      updatedAt: orderData.updated_at,
    };

    const items: OrderItem[] = itemsData.map(item => ({
      id: item.id,
      orderId: item.order_id,
      dishId: item.dish_id,
      dishName: item.dish_name,
      dishCategory: item.dish_category,
      dishPrice: parseFloat(item.dish_price),
      quantity: item.quantity,
      subtotal: parseFloat(item.subtotal),
      isPopular: item.is_popular,
      createdAt: item.created_at,
    }));

    return { order, items };
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

/**
 * Get order by ID with items
 */
export async function getOrder(orderId: string): Promise<{ order: Order; items: OrderItem[] } | null> {
  if (!supabase) {
    console.error('Supabase is not configured');
    return null;
  }

  try {
    // Get order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !orderData) {
      console.error('Error fetching order:', orderError);
      return null;
    }

    // Get order items
    const { data: itemsData, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', orderId);

    if (itemsError || !itemsData) {
      console.error('Error fetching order items:', itemsError);
      return null;
    }

    const order: Order = {
      id: orderData.id,
      orderNumber: orderData.order_number,
      totalAmount: parseFloat(orderData.total_amount),
      totalItems: orderData.total_items,
      status: orderData.status,
      customerName: orderData.customer_name,
      customerPhone: orderData.customer_phone,
      tableNumber: orderData.table_number,
      notes: orderData.notes,
      createdAt: orderData.created_at,
      updatedAt: orderData.updated_at,
    };

    const items: OrderItem[] = itemsData.map(item => ({
      id: item.id,
      orderId: item.order_id,
      dishId: item.dish_id,
      dishName: item.dish_name,
      dishCategory: item.dish_category,
      dishPrice: parseFloat(item.dish_price),
      quantity: item.quantity,
      subtotal: parseFloat(item.subtotal),
      isPopular: item.is_popular,
      createdAt: item.created_at,
    }));

    return { order, items };
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

/**
 * Get recent orders
 */
export async function getRecentOrders(limit: number = 10): Promise<Order[]> {
  if (!supabase) {
    console.error('Supabase is not configured');
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error || !data) {
      console.error('Error fetching orders:', error);
      return [];
    }

    return data.map(orderData => ({
      id: orderData.id,
      orderNumber: orderData.order_number,
      totalAmount: parseFloat(orderData.total_amount),
      totalItems: orderData.total_items,
      status: orderData.status,
      customerName: orderData.customer_name,
      customerPhone: orderData.customer_phone,
      tableNumber: orderData.table_number,
      notes: orderData.notes,
      createdAt: orderData.created_at,
      updatedAt: orderData.updated_at,
    }));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}
