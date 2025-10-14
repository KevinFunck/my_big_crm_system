import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from 'environments/environments'; 
import { ContactPerson } from '../models/contact-person.class';

@Injectable({
  providedIn: 'root'
})
export class ContactPersonsService {
  private client: SupabaseClient;

  constructor() {
    this.client = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  /** Get all contact persons */
  async getContactPersons(): Promise<ContactPerson[]> {
    const { data, error } = await this.client.from('contact_person').select('*');
    if (error) throw error;
    return data as ContactPerson[];
  }

  /** Get a contact person by ID */
  async getContactPersonById(id: string): Promise<ContactPerson> {
    const { data, error } = await this.client
      .from('contact_person')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as ContactPerson;
  }

  /** Update an existing contact person */
  async updateContactPerson(person: ContactPerson): Promise<ContactPerson> {
    const { data, error } = await this.client
      .from('contact_person')
      .update(person)
      .eq('id', person.id)
      .select()
      .single();
    if (error) throw error;
    return data as ContactPerson;
  }

  /** Add a new contact person */
  async addContactPerson(person: ContactPerson): Promise<ContactPerson[]> {
    const { data, error } = await this.client
      .from('contact_person')
      .insert([person])
      .select('*');
    if (error) throw error;
    return data || [];
  }

  /** Delete a contact person */
  async deleteContactPerson(id: string): Promise<void> {
    const { error } = await this.client
      .from('contact_person')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  async getContactPersonsByCustomerId(customerId: string): Promise<ContactPerson[]> {
  const { data, error } = await this.client
    .from('contact_person')
    .select('*')
    .eq('customer_id', customerId);   // customer_id muss in der DB vorhanden sein!

  if (error) throw error;
  return data as ContactPerson[];
}
}