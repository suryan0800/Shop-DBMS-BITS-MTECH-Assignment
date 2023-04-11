import express from 'express';
import { Pool } from 'pg';
import { sign } from 'jsonwebtoken';
import { LoginUser } from 'types/custom';

const loginRouter = express.Router()
const pool = new Pool();

loginRouter.post("/Login", (req, res) => {
  const userName = req.body.userName;
  const pass = req.body.password;

  const query = {
    text: `select mail_id, rm.acl_group, aa.node_name from shop.role_mapping rm left outer join shop.app_acl aa on rm.acl_group = aa.acl_group where mail_id = $1 and split_part(mail_id, '@', 1) = $2 `,
    values: [userName, pass]
  };

  pool
    .query<LoginUser>(query)
    .then(response => {
      if (response.rows.length) {
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const expiresIn = parseInt(process.env.JWT_TOKEN_EXPIRY);
        const roles = [...new Set(response.rows.map(a => a.acl_group))]
        const node_list = [...new Set(response.rows.map(a => a.node_name))]
        const data: LoginUser = {
          login_time: new Date(),
          mail_id: response.rows[0].mail_id,
          roles,
          node_list
        }

        const token = sign({ ...data }, jwtSecretKey, { expiresIn });

        data.jwt_token = token
        data.is_authenticated = true

        return res.json(data);
      }

      res.status(401).send({ error: 'Not Authorized', message: 'Either Invalid user or Password incorrect' })
    })
    .catch(err => {
      console.error(err.message);
      res.status(500).send({ error: err.message })
    })

});

export default loginRouter;