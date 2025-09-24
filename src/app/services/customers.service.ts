import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Customer } from '../models/customer.class';
import { environment } from 'environments/environments'; 
@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async getCustomers(): Promise<Customer[]> {
    const { data, error } = await this.client.from('customers').select('*');
    if (error) throw error;
    return data as Customer[];
  }

  async getCustomerById(id: string): Promise<Customer> {
    const { data, error } = await this.client
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Customer;
  }


  async updateCustomer(customer: Customer): Promise<Customer> {
    const { data, error } = await this.client
      .from('customers')
      .update(customer)
      .eq('id', customer.id)
      .select()
      .single();

    if (error) throw error;
    return data as Customer;
  }

  async addCustomer(customer: Customer): Promise<Customer[]> {
    const { data, error } = await this.client
      .from('customers')
      .insert([customer])
      .select('*');

    if (error) throw error;
    return data || [];
  }
}
