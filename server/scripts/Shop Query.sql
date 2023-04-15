-- New script in MyFutureDesk.
-- Date: 11-Apr-2023
-- Time: 4:11:09 PM


-- verify Login and get roles 
select
	mail_id,
	rm.acl_group,
	aa.node_name
from
	shop.role_mapping rm
left outer join shop.app_acl aa on
	rm.acl_group = aa.acl_group
where
	mail_id = $1
	and split_part(mail_id, '@', 1) = $2
	
-- Customer - View products to buy 

select
	selling_product_id,
	sp.seller_mail_id,
	s.seller_name,
	s.phone_number,
	s.address,
	s.pincode,
	pl.location_nm,
	sp.product_id,
	p.product_name,
	p.description,
	selling_price,
	no_of_available_stocks
from
	shop.selling_product sp
left outer join shop.product p on
	sp.product_id = p.product_id
left outer join shop.seller s on
	sp.seller_mail_id = s.seller_mail_id
left outer join shop.pincode_location pl on s.pincode = pl.pincode 

-- Customer order a product 
	
-- Customer order a product - Check and insert pincode, if delivery pincode is not available 
	
insert into shop.pincode_location (pincode, location_nm)
values($1, $2) 
on conflict (pincode) do nothing;

-- Customer order a product - Check and update stock availability 

update
	shop.selling_product
set
	no_of_available_stocks = no_of_available_stocks - $1
where
	selling_product_id = $2
	and no_of_available_stocks >= $1
returning selling_product_id, selling_price ;

-- Customer order a product - insert into order table 

INSERT INTO shop.order_dtls (selling_product_id, customer_mail_id, quantity, price, payment_method, delivery_address, delivery_pincode, logistics_worker_mail_id, delivery_status) 
VALUES($1, $2, $3, $4, $5, $6, $7, null, 'ORDERED');


-- Seller - View his own products 
	
select
	selling_product_id,
	seller_mail_id,
	sp.product_id,
	p.product_name,
	p.description,
	selling_price,
	no_of_available_stocks
from
	shop.selling_product sp
left outer join shop.product p on
	sp.product_id = p.product_id
where
	seller_mail_id = $1
	
-- Seller adds a new product - Check and insert into product table 
	
INSERT INTO shop.product (product_name, description) 
VALUES($1, $2) returning product_id;

-- Seller adds a new product - Insert into selling_product table 

INSERT INTO shop.selling_product (seller_mail_id, product_id, selling_price, no_of_available_stocks) 
VALUES($1, $2, $3, $4);


-- Logistics Worker - View orders near him to deliver based on pincode

select
	order_id,
	od.customer_mail_id,
	c.customer_name,
	quantity,
	delivery_address,
	delivery_pincode,
	pl.location_nm as delivery_location, 
	logistics_worker_mail_id,
	delivery_status
from
	shop.order_dtls od
left outer join shop.customer c on
	od.customer_mail_id = c.customer_mail_id
left outer join shop.pincode_location pl on
	od.delivery_pincode = pl.pincode
where
	(abs(delivery_pincode - (
	select
		deliv_loc_pincode
	from
		shop.logistics_worker lw
	where
		logistics_worker_mail_id = $1))) < 10;

-- Logistics Worker updates the status of order as delivered 
	
update
	shop.order_dtls
set
	logistics_worker_mail_id = $1,
	delivery_status = 'DELIVERED'
where
	order_id = $2
	and logistics_worker_mail_id is null
	and ((abs(delivery_pincode - (
	select
		deliv_loc_pincode
	from
		shop.logistics_worker lw
	where
		logistics_worker_mail_id = $1))) < 10);


-- Auto-generated SQL script #202304150105
UPDATE shop.order_dtls
	SET delivery_status='ORDERED',
	logistics_worker_mail_id= null
	WHERE order_id=4;
UPDATE shop.order_dtls
	SET delivery_status='ORDERED',
	logistics_worker_mail_id= null 
	WHERE order_id=1;
UPDATE shop.order_dtls
	SET delivery_status='ORDERED',
	logistics_worker_mail_id= null 
	WHERE order_id=5;

