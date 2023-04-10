import express from 'express';
import { Pool } from 'pg';
import { sign } from 'jsonwebtoken';

const loginRouter = express.Router()
const pool = new Pool();

loginRouter.post("/Login", (req, res) => {
  const userName = req.body.userName;
  const pass = req.body.password;

  const query = {
    text: `SELECT mail_id, acl_group, split_part(mail_id, '@', 1) as pass FROM shop.role_mapping where mail_id = $1`,
    values: [userName]
  };

  pool
    .query(query)
    .then(response => {
      // console.log("Selected Rows: ", response);
      // console.log(response.rows)
      if (response.rows.length && response.rows[0].pass === pass) {
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        let data = {
          loginTime: Date(),
          userId: response.rows[0].mail,
          userName: response.rows[0].user_name
        }
        const token = sign(data, jwtSecretKey, { expiresIn: 60 * 40 });
        res.json({ jwtToken: token, isSuccess: 'true', ...data });
      } else {
        res.status(403).send({ error: 'Not Authorized', message: 'Either invalid user or Token expired' })
      }

    })
    .catch(err => {
      console.error(err.message);
      res.status(500).send({ error: err.message })
    })

});

export default loginRouter;