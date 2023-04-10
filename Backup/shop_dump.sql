--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1
-- Dumped by pg_dump version 15.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: shop; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA shop;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: app_acl; Type: TABLE; Schema: shop; Owner: -
--

CREATE TABLE shop.app_acl (
    acl_group character varying(50),
    node_name character varying(50),
    active boolean NOT NULL,
    created_tmps character varying(100),
    created_by character varying(100)
);


--
-- Name: customer; Type: TABLE; Schema: shop; Owner: -
--

CREATE TABLE shop.customer (
    c_id integer NOT NULL,
    customer_mail_id character varying(150) NOT NULL,
    customer_name character varying(150) NOT NULL,
    phone_number character varying(20),
    address character varying(500),
    pincode integer
);


--
-- Name: customer_c_id_seq; Type: SEQUENCE; Schema: shop; Owner: -
--

ALTER TABLE shop.customer ALTER COLUMN c_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME shop.customer_c_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: logistics_worker; Type: TABLE; Schema: shop; Owner: -
--

CREATE TABLE shop.logistics_worker (
    lw_id integer NOT NULL,
    logistics_worker_mail_id character varying(150) NOT NULL,
    logistics_worker_name character varying(150) NOT NULL,
    phone_number character varying(20),
    deliv_loc_pincode integer NOT NULL
);


--
-- Name: logistics_worker_lw_id_seq; Type: SEQUENCE; Schema: shop; Owner: -
--

ALTER TABLE shop.logistics_worker ALTER COLUMN lw_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME shop.logistics_worker_lw_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: order_dtls; Type: TABLE; Schema: shop; Owner: -
--

CREATE TABLE shop.order_dtls (
    order_id integer NOT NULL,
    selling_product_id integer NOT NULL,
    customer_mail_id character varying(150) NOT NULL,
    quantity integer NOT NULL,
    price numeric NOT NULL,
    payment_method character varying(50) NOT NULL,
    delivery_address character varying(500) NOT NULL,
    delivery_pincode integer NOT NULL,
    logistics_worker_mail_id character varying(150),
    delivery_status character varying(50)
);


--
-- Name: order_dtls_order_id_seq; Type: SEQUENCE; Schema: shop; Owner: -
--

ALTER TABLE shop.order_dtls ALTER COLUMN order_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME shop.order_dtls_order_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: pincode_location; Type: TABLE; Schema: shop; Owner: -
--

CREATE TABLE shop.pincode_location (
    pin_id integer NOT NULL,
    pincode integer NOT NULL,
    location_nm character varying(100) NOT NULL
);


--
-- Name: pincode_location_pin_id_seq; Type: SEQUENCE; Schema: shop; Owner: -
--

ALTER TABLE shop.pincode_location ALTER COLUMN pin_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME shop.pincode_location_pin_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: product; Type: TABLE; Schema: shop; Owner: -
--

CREATE TABLE shop.product (
    product_id integer NOT NULL,
    product_name character varying(150) NOT NULL,
    description character varying(500) NOT NULL
);


--
-- Name: product_product_id_seq; Type: SEQUENCE; Schema: shop; Owner: -
--

ALTER TABLE shop.product ALTER COLUMN product_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME shop.product_product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: seller; Type: TABLE; Schema: shop; Owner: -
--

CREATE TABLE shop.seller (
    s_id integer NOT NULL,
    seller_mail_id character varying(150) NOT NULL,
    seller_name character varying(150) NOT NULL,
    phone_number character varying(20),
    address character varying(500),
    pincode integer
);


--
-- Name: role_mapping; Type: VIEW; Schema: shop; Owner: -
--

CREATE VIEW shop.role_mapping AS
 SELECT s.seller_mail_id AS mail_id,
    'SELLER'::text AS acl_group
   FROM shop.seller s
UNION ALL
 SELECT c.customer_mail_id AS mail_id,
    'CUSTOMER'::text AS acl_group
   FROM shop.customer c
UNION ALL
 SELECT lw.logistics_worker_mail_id AS mail_id,
    'LOGISTICS_WORKER'::text AS acl_group
   FROM shop.logistics_worker lw;


--
-- Name: seller_s_id_seq; Type: SEQUENCE; Schema: shop; Owner: -
--

ALTER TABLE shop.seller ALTER COLUMN s_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME shop.seller_s_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: selling_product; Type: TABLE; Schema: shop; Owner: -
--

CREATE TABLE shop.selling_product (
    selling_product_id integer NOT NULL,
    seller_mail_id character varying(150) NOT NULL,
    product_id integer NOT NULL,
    selling_price numeric NOT NULL,
    no_of_available_stocks integer NOT NULL
);


--
-- Name: selling_product_selling_product_id_seq; Type: SEQUENCE; Schema: shop; Owner: -
--

ALTER TABLE shop.selling_product ALTER COLUMN selling_product_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME shop.selling_product_selling_product_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: app_acl; Type: TABLE DATA; Schema: shop; Owner: -
--

COPY shop.app_acl (acl_group, node_name, active, created_tmps, created_by) FROM stdin;
SELLER	SELL_PRODUCT_UPDATE_VIEW	t	2023-04-09 22:45:03.552138+05:30	SYSTEM
LOGISTICS_WORKER	DELIVER_STATUS_UPDATE_VIEW	t	2023-04-09 22:45:03.552138+05:30	SYSTEM
CUSTOMER	CUST_ITEMS_ORDER_VIEW	t	2023-01-19 22:45:03.552138+05:30	SYSTEM
\.


--
-- Data for Name: customer; Type: TABLE DATA; Schema: shop; Owner: -
--

COPY shop.customer (c_id, customer_mail_id, customer_name, phone_number, address, pincode) FROM stdin;
1	vsvasan1956@gmail.com	Srinivasan Venkataraman	8870310469	E 11, Neyveli	607801
2	mmbanu0@gmail.com	Mangalabanu M	8870310479	E 11, Neyveli	607801
4	vmahalingam66@gmail.com	Vijayalakshmi Mahalingam	9940653949	92/34 Mettu Street	612001
\.


--
-- Data for Name: logistics_worker; Type: TABLE DATA; Schema: shop; Owner: -
--

COPY shop.logistics_worker (lw_id, logistics_worker_mail_id, logistics_worker_name, phone_number, deliv_loc_pincode) FROM stdin;
1	suryan0800@outlook.com	Surya S	7397152594	607801
2	2022MT13011@wilp.bits-pilani.ac.in	Narayanan S	7397152594	612001
\.


--
-- Data for Name: order_dtls; Type: TABLE DATA; Schema: shop; Owner: -
--

COPY shop.order_dtls (order_id, selling_product_id, customer_mail_id, quantity, price, payment_method, delivery_address, delivery_pincode, logistics_worker_mail_id, delivery_status) FROM stdin;
1	2	vsvasan1956@gmail.com	1	23000	CASH	E 11, Neyveli	607801	\N	NOT YET DISPATCHED
\.


--
-- Data for Name: pincode_location; Type: TABLE DATA; Schema: shop; Owner: -
--

COPY shop.pincode_location (pin_id, pincode, location_nm) FROM stdin;
1	560100	Electronic City, Bangalore
2	560068	Roopena Agrahara, Bangalore
3	607801	Neyveli 1, Tamilnadu
4	612001	Mettu Street, Kumbakonam
\.


--
-- Data for Name: product; Type: TABLE DATA; Schema: shop; Owner: -
--

COPY shop.product (product_id, product_name, description) FROM stdin;
1	HP Omen	Laptop
2	Pocophone X5 Pro	Mobile Phone
3	Kadai	Kitchen Vessel
4	Gas Stove	Kitchenware
\.


--
-- Data for Name: seller; Type: TABLE DATA; Schema: shop; Owner: -
--

COPY shop.seller (s_id, seller_mail_id, seller_name, phone_number, address, pincode) FROM stdin;
2	suryan0800@gmail.com	ABC Electronics	7397152594	C 205, Electronic City	560100
4	chander1993@gmail.com	DEF Kitchen Essentials	9632240088	507, Silk Board	560068
\.


--
-- Data for Name: selling_product; Type: TABLE DATA; Schema: shop; Owner: -
--

COPY shop.selling_product (selling_product_id, seller_mail_id, product_id, selling_price, no_of_available_stocks) FROM stdin;
1	suryan0800@gmail.com	1	50000	5
2	suryan0800@gmail.com	2	25000	2
5	chander1993@gmail.com	3	1500	1
6	chander1993@gmail.com	4	5000	3
\.


--
-- Name: customer_c_id_seq; Type: SEQUENCE SET; Schema: shop; Owner: -
--

SELECT pg_catalog.setval('shop.customer_c_id_seq', 4, true);


--
-- Name: logistics_worker_lw_id_seq; Type: SEQUENCE SET; Schema: shop; Owner: -
--

SELECT pg_catalog.setval('shop.logistics_worker_lw_id_seq', 2, true);


--
-- Name: order_dtls_order_id_seq; Type: SEQUENCE SET; Schema: shop; Owner: -
--

SELECT pg_catalog.setval('shop.order_dtls_order_id_seq', 1, true);


--
-- Name: pincode_location_pin_id_seq; Type: SEQUENCE SET; Schema: shop; Owner: -
--

SELECT pg_catalog.setval('shop.pincode_location_pin_id_seq', 4, true);


--
-- Name: product_product_id_seq; Type: SEQUENCE SET; Schema: shop; Owner: -
--

SELECT pg_catalog.setval('shop.product_product_id_seq', 4, true);


--
-- Name: seller_s_id_seq; Type: SEQUENCE SET; Schema: shop; Owner: -
--

SELECT pg_catalog.setval('shop.seller_s_id_seq', 4, true);


--
-- Name: selling_product_selling_product_id_seq; Type: SEQUENCE SET; Schema: shop; Owner: -
--

SELECT pg_catalog.setval('shop.selling_product_selling_product_id_seq', 6, true);


--
-- Name: customer customer_pk; Type: CONSTRAINT; Schema: shop; Owner: -
--

ALTER TABLE ONLY shop.customer
    ADD CONSTRAINT customer_pk PRIMARY KEY (customer_mail_id);


--
-- Name: logistics_worker logistics_worker_pk; Type: CONSTRAINT; Schema: shop; Owner: -
--

ALTER TABLE ONLY shop.logistics_worker
    ADD CONSTRAINT logistics_worker_pk PRIMARY KEY (logistics_worker_mail_id);


--
-- Name: order_dtls order_pk; Type: CONSTRAINT; Schema: shop; Owner: -
--

ALTER TABLE ONLY shop.order_dtls
    ADD CONSTRAINT order_pk PRIMARY KEY (order_id);


--
-- Name: pincode_location pincode_location_pk; Type: CONSTRAINT; Schema: shop; Owner: -
--

ALTER TABLE ONLY shop.pincode_location
    ADD CONSTRAINT pincode_location_pk PRIMARY KEY (pincode);


--
-- Name: product product_pk; Type: CONSTRAINT; Schema: shop; Owner: -
--

ALTER TABLE ONLY shop.product
    ADD CONSTRAINT product_pk PRIMARY KEY (product_id);


--
-- Name: seller seller_pk; Type: CONSTRAINT; Schema: shop; Owner: -
--

ALTER TABLE ONLY shop.seller
    ADD CONSTRAINT seller_pk PRIMARY KEY (seller_mail_id);


--
-- Name: selling_product selling_product_pk; Type: CONSTRAINT; Schema: shop; Owner: -
--

ALTER TABLE ONLY shop.selling_product
    ADD CONSTRAINT selling_product_pk PRIMARY KEY (selling_product_id);


--
-- Name: order_dtls fk_customer; Type: FK CONSTRAINT; Schema: shop; Owner: -
--

ALTER TABLE ONLY shop.order_dtls
    ADD CONSTRAINT fk_customer FOREIGN KEY (customer_mail_id) REFERENCES shop.customer(customer_mail_id);


--
-- Name: order_dtls fk_logistics_worker; Type: FK CONSTRAINT; Schema: shop; Owner: -
--

ALTER TABLE ONLY shop.order_dtls
    ADD CONSTRAINT fk_logistics_worker FOREIGN KEY (logistics_worker_mail_id) REFERENCES shop.logistics_worker(logistics_worker_mail_id);


--
-- Name: seller fk_pincode; Type: FK CONSTRAINT; Schema: shop; Owner: -
--

ALTER TABLE ONLY shop.seller
    ADD CONSTRAINT fk_pincode FOREIGN KEY (pincode) REFERENCES shop.pincode_location(pincode);


--
-- Name: customer fk_pincode; Type: FK CONSTRAINT; Schema: shop; Owner: -
--

ALTER TABLE ONLY shop.customer
    ADD CONSTRAINT fk_pincode FOREIGN KEY (pincode) REFERENCES shop.pincode_location(pincode);


--
-- Name: logistics_worker fk_pincode; Type: FK CONSTRAINT; Schema: shop; Owner: -
--

ALTER TABLE ONLY shop.logistics_worker
    ADD CONSTRAINT fk_pincode FOREIGN KEY (deliv_loc_pincode) REFERENCES shop.pincode_location(pincode);


--
-- Name: order_dtls fk_pincode; Type: FK CONSTRAINT; Schema: shop; Owner: -
--

ALTER TABLE ONLY shop.order_dtls
    ADD CONSTRAINT fk_pincode FOREIGN KEY (delivery_pincode) REFERENCES shop.pincode_location(pincode);


--
-- Name: selling_product fk_product; Type: FK CONSTRAINT; Schema: shop; Owner: -
--

ALTER TABLE ONLY shop.selling_product
    ADD CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES shop.product(product_id);


--
-- Name: selling_product fk_seller; Type: FK CONSTRAINT; Schema: shop; Owner: -
--

ALTER TABLE ONLY shop.selling_product
    ADD CONSTRAINT fk_seller FOREIGN KEY (seller_mail_id) REFERENCES shop.seller(seller_mail_id);


--
-- Name: order_dtls fk_selling_product; Type: FK CONSTRAINT; Schema: shop; Owner: -
--

ALTER TABLE ONLY shop.order_dtls
    ADD CONSTRAINT fk_selling_product FOREIGN KEY (selling_product_id) REFERENCES shop.selling_product(selling_product_id);


--
-- PostgreSQL database dump complete
--

