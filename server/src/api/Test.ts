import securedFilter from '../configs/SecuredFilter';
import express from 'express';
import { Pool } from 'pg';

const testRouter = express.Router()
const pool = new Pool();

// Handle GET requests to /api route
testRouter.get("/hello", (req, res) => {
    res.json({ message: "Hello from server!" });
});

// Handle GET requests to /api route
testRouter.get("/secured/hello",
    securedFilter(['SELL_PRODUCT_UPDATE_VIEW']),
    (req, res) => {
        res.json({ message: "Hello from server!" });
    });

testRouter.get("/getBirdsFromDB", (req, res) => {

    const query = `
      SELECT * FROM tryout.birds;
      `;

    pool
        .query(query)
        .then(response => {
            res.json(response.rows)
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ error: err })
        })

})

export default testRouter;

