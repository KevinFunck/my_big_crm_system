import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
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

  async getCustomers() {
    const { data, error } = await this.client.from('customers').select('*');
    if (error) throw error;
    return data;
  }


  async addCustomer(customer: any) {
  const { data, error } = await this.client.from('customers').insert([customer]); 
  if (error) throw error;
  return data;
}


}
