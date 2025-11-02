export class Order {
    id: string = '';
    order_number: string = '';
    order_date: string = '';
    delivery_date: string = '';
    status: string = '';
    priority: string = '';
    total_amount: number = 0;
    assigned_contact_person: string = '';
    customer_id: string = '';
    description: string = '';
    title: string = '';

    constructor(obj?: any) {
        if (obj) {
            this.id = obj.id || '';
            this.order_number = obj.order_number || '';
            this.order_date = obj.order_date || '';
            this.delivery_date = obj.delivery_date || '';
            this.status = obj.status || '';
            this.priority = obj.priority || '';
            this.total_amount = obj.total_amount || 0;
            this.assigned_contact_person = obj.assigned_contact_person || '';
            this.customer_id = obj.customer_id || '';
            this.description = obj.description || '';
            this.title = obj.title || '';

        }
    }

    toDbOrder(): any {
        return {
            order_number: this.order_number,
            order_date: this.order_date || null,
            delivery_date: this.delivery_date || null,
            status: this.status,
            priority: this.priority,
            total_amount: this.total_amount,
            assigned_contact_person: this.assigned_contact_person,
            customer_id: this.customer_id,
            description: this.description,
            title: this.title

        };
    }
}