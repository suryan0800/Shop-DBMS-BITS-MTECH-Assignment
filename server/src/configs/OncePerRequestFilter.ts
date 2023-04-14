import { RequestHandler } from 'express';
import { verify } from 'jsonwebtoken';

const jwtHandler: RequestHandler = (req, res, next) => {
    const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    try {
        const token = req.header(tokenHeaderKey);
        const verified: any = verify(token, jwtSecretKey);
        if (verified) {
            req.user = verified
            next();
        } else {
            // Access Denied
            res.status(403).send({ error: "Unable to verify token" });
        }
    } catch (error: any) {
        // Access Denied
        res.status(403).send({ error: error?.message });
    }
}
 
export default jwtHandler;



