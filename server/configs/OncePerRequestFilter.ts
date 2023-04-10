import { RequestHandler } from 'express';
import { verify } from 'jsonwebtoken';

const jwtHandler: RequestHandler = (req, res, next) => {
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    try {
        const token = req.header(tokenHeaderKey);
        const verified = verify(token, jwtSecretKey);
        if (verified) {
            next();
        } else {
            // Access Denied
            res.status(401).send({ error: "Unable to verify token" });
        }
    } catch (error: any) {
        // Access Denied
        res.status(401).send({ error: error?.message });
    }
}
 
export default jwtHandler;



