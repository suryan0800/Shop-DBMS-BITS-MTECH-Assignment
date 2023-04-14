import { ReturnDTO } from 'beans/ReturnDTO';
import { SellingProductDTO } from 'beans/SellingProductDTO';
import securedFilter from 'configs/SecuredFilter';
import express from 'express';
import { Pool } from 'pg';
import { LoginUser } from 'types/custom';

const sellerRouter = express.Router()
const pool = new Pool();

// Handle GET requests to /api route
sellerRouter.get("/hello", (req, res) => {
    res.json({ message: "Hello from server!" });
});

// Handle GET requests to /api route
sellerRouter.get("/ProductView",
    securedFilter(['SELL_PRODUCT_UPDATE_VIEW']),
    (req, res) => {
        const query = `
        select selling_product_id, seller_mail_id, sp.product_id, p.product_name, p.description, selling_price, no_of_available_stocks from shop.selling_product sp left outer join shop.product p on sp.product_id = p.product_id where seller_mail_id = $1
      `;

        pool
            .query<SellingProductDTO>(query, [req.user.mail_id])
            .then(response => {
                res.json(response.rows)
            })
            .catch(err => {
                console.error(err);
                res.status(500).send({ error: err })
            })
    });

sellerRouter.post("/NewProduct",
    securedFilter(['SELL_PRODUCT_UPDATE_VIEW']),
    async (req, res) => {
        const dto: SellingProductDTO = req.body
        const user: LoginUser = req.user
        let retObj: ReturnDTO = null 

        const client = await pool.connect()

        try {
            await client.query('BEGIN')
            const productInsert = `INSERT INTO shop.product (product_name, description) VALUES($1, $2) returning product_id `
            const res = await client.query<SellingProductDTO>(productInsert, [dto.product_name, dto.description])
            dto.product_id = res.rows[0].product_id
            console.log(res)

            const insertSellingProduct = `INSERT INTO shop.selling_product (seller_mail_id, product_id, selling_price, no_of_available_stocks) VALUES($1, $2, $3, $4) `
            await client.query(insertSellingProduct, [user.mail_id, dto.product_id,
            dto.selling_price, dto.no_of_available_stocks])

            await client.query('COMMIT')
            retObj = { status: true, statusMsg: 'Woohoo, Your product went alive. Congratulations in advance for great sales!!!' }
        } catch (e: any) {
            await client.query('ROLLBACK')
            retObj = {status: false, statusMsg: `Aaargh, Server got into some issue. ${e.message}`}
        } finally {
            client.release()
        }

        res.json(retObj)

    })

export default sellerRouter;

