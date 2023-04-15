import { OrderDTO } from '../beans/OrderDTO';
import { ReturnDTO } from '../beans/ReturnDTO';
import securedFilter from '../configs/SecuredFilter';
import express from 'express';
import { Pool } from 'pg';
import { LoginUser } from 'types/custom';

const logisticsRouter = express.Router()
const pool = new Pool();

// Handle GET requests to /api route
logisticsRouter.get("/hello", (req, res) => {
    res.json({ message: "Hello from server!" });
});

// Handle GET requests to /api route
logisticsRouter.get("/OrderView",
    securedFilter(['DELIVER_STATUS_UPDATE_VIEW']),
    (req, res) => {
        const query = `
        select order_id, od.customer_mail_id, c.customer_name, quantity, 
        delivery_address, delivery_pincode, pl.location_nm as delivery_location, 
        logistics_worker_mail_id, delivery_status 
        from shop.order_dtls od 
        left outer join shop.customer c 
        on od.customer_mail_id = c.customer_mail_id 
        left outer join shop.pincode_location pl 
        on od.delivery_pincode = pl.pincode 
        where (abs(delivery_pincode - 
            ( select deliv_loc_pincode 
                from shop.logistics_worker lw where logistics_worker_mail_id = $1))) < 10
      `;

        pool
            .query<OrderDTO>(query, [req.user.mail_id])
            .then(response => {
                res.json(response.rows)
            })
            .catch(err => {
                console.error(err);
                res.status(500).send({ error: err })
            })
    });

logisticsRouter.post("/UpdateDeliveryStatus",
    securedFilter(['DELIVER_STATUS_UPDATE_VIEW']),
    async (req, res) => {
        const dto: OrderDTO = req.body
        const user: LoginUser = req.user
        let retObj: ReturnDTO = null 

        const client = await pool.connect()

        try {
            await client.query('BEGIN')
            const updateOrderDelivStatus = `update shop.order_dtls 
            set logistics_worker_mail_id = $1, 
            delivery_status = 'DELIVERED' 
            where order_id = $2 
            and logistics_worker_mail_id is null 
            and ((abs(delivery_pincode - 
                ( select deliv_loc_pincode 
                    from shop.logistics_worker lw where logistics_worker_mail_id = $1))) < 10)
            `;
            const res = await client.query(updateOrderDelivStatus, [user.mail_id, dto.order_id])
            if (res.rowCount != 1) {
                throw new Error(`Either the Order Delivery Status is already updated 
                or Order ID is incorrect 
                or You are not the authorized person to perform the action`)
            }

            await client.query('COMMIT')
            retObj = { status: true, statusMsg: `Woohoo, Thank you for the prompt delivery. 
            See you soon after more delivery like this!!!` }
        } catch (e: any) {
            await client.query('ROLLBACK')
            retObj = {status: false, statusMsg: `Aaargh, Server got into some issue. ${e.message}`}
        } finally {
            client.release()
        }

        res.json(retObj)

    })

export default logisticsRouter;

