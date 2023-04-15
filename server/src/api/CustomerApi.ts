import { OrderDTO } from '../beans/OrderDTO';
import { ReturnDTO } from '../beans/ReturnDTO';
import { SellingProductDTO } from '../beans/SellingProductDTO';
import securedFilter from '../configs/SecuredFilter';
import express from 'express';
import { Pool } from 'pg';
import { LoginUser } from 'types/custom';

const customerRouter = express.Router()
const pool = new Pool();

// Handle GET requests to /api route
customerRouter.get("/hello", (req, res) => {
    res.json({ message: "Hello from server!" });
});

// Handle GET requests to /api route
customerRouter.get("/ProductView",
    securedFilter(['CUST_ITEMS_ORDER_VIEW']),
    (req, res) => {
        const query = `
        select selling_product_id, sp.seller_mail_id, s.seller_name, s.phone_number, s.address, 
        s.pincode, pl.location_nm, sp.product_id, p.product_name, p.description, selling_price, 
        no_of_available_stocks from shop.selling_product sp 
        left outer join shop.product p on sp.product_id = p.product_id 
        left outer join shop.seller s on sp.seller_mail_id = s.seller_mail_id 
        left outer join shop.pincode_location pl on s.pincode = pl.pincode
      `;

        pool
            .query<SellingProductDTO>(query)
            .then(response => {
                res.json(response.rows)
            })
            .catch(err => {
                console.error(err);
                res.status(500).send({ error: err })
            })
    });

customerRouter.post("/Order",
    securedFilter(['CUST_ITEMS_ORDER_VIEW']),
    async (req, res) => {
        const dto: OrderDTO = req.body
        const user: LoginUser = req.user
        let retObj: ReturnDTO = null 

        const client = await pool.connect()

        try {
            await client.query('BEGIN')
            const pincodeInsert = `insert into shop.pincode_location (pincode, location_nm) 
            values($1, $2) on conflict (pincode) do nothing`
            const res = await client.query(pincodeInsert, [dto.delivery_pincode, dto.delivery_location])

            const checkStock = `update shop.selling_product 
            set no_of_available_stocks = no_of_available_stocks - $1 
            where selling_product_id = $2 and no_of_available_stocks >= $1 
            returning selling_product_id, selling_price `
            const updateStat = await client.query<SellingProductDTO>(checkStock, [dto.quantity, dto.selling_product_id])
            if (updateStat.rowCount == 0) {
                throw new Error('Aaargh, Insufficient stock available to order')
            }

            const insertIntoOrder = `INSERT INTO shop.order_dtls 
            (selling_product_id, customer_mail_id, quantity, price, payment_method, 
                delivery_address, delivery_pincode, logistics_worker_mail_id, delivery_status) 
                VALUES($1, $2, $3, $4, $5, $6, $7, null, 'ORDERED') `
            await client.query(insertIntoOrder, [dto.selling_product_id, user.mail_id,
            dto.quantity, updateStat.rows[0].selling_price, dto.payment_method,
            dto.delivery_address, dto.delivery_pincode])
            await client.query('COMMIT')
            retObj = { status: true, statusMsg: 'Woohoo, your order is placed successfully!!!' }
        } catch (e: any) {
            await client.query('ROLLBACK')
            retObj = {status: false, statusMsg: e.message}
        } finally {
            client.release()
        }

        res.json(retObj)

    })

export default customerRouter;

