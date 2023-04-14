export type OrderDTO = {
    order_id: number, 
    selling_product_id: number, 
    customer_mail_id: string, 
    quantity: number, 
    price: number, 
    payment_method: string, 
    delivery_address: string, 
    delivery_location: string, 
    delivery_pincode: number, 
    logistics_worker_mail_id: string, 
    delivery_status: string 
}