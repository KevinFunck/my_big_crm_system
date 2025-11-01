import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'environments/environments';
import { Order } from '../models/order.class';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  /** Get all orders */
  async getOrders(): Promise<Order[]> {
    const { data, error } = await this.client.from('orders').select('*');
    if (error) throw error;
    return data as Order[];
  }

  /** Get an order by ID */
  async getOrderById(id: string): Promise<Order> {
    const { data, error } = await this.client
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as Order;
  }

  /** Add a new order */
  async addOrder(order: Order): Promise<Order[]> {
    const { data, error } = await this.client
      .from('orders')
      .insert([order])
      .select('*');
    if (error) throw error;
    return data || [];
  }

  /** Update an existing order */
  async updateOrder(order: Order): Promise<Order> {
    const { data, error } = await this.client
      .from('orders')
      .update(order)
      .eq('id', order.id)
      .select()
      .single();
    if (error) throw error;
    return data as Order;
  }

  /** Delete an order */
  async deleteOrder(id: string): Promise<void> {
    const { error } = await this.client
      .from('orders')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  /** Optional: get orders by customer ID */
  async getOrdersByCustomerId(customerId: string): Promise<Order[]> {
    const { data, error } = await this.client
      .from('orders')
      .select('*')
      .eq('customer_id', customerId);
    if (error) throw error;
    return data as Order[];
  }
}