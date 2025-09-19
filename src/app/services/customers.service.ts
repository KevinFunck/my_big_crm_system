import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Customer } from '../models/customer.class';
@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private client: SupabaseClient;

  constructor() {
    const supabaseUrl = 'https://hyecsfjqnwyytpyvgsbz.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5ZWNzZmpxbnd5eXRweXZnc2J6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNjU4MjMsImV4cCI6MjA3Mjc0MTgyM30.MSfPq6NclppSbPxirRsZ-bbepvtGOWjvZQS2CNZ8mz4';
  
    this.client = createClient(supabaseUrl, supabaseKey);
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
