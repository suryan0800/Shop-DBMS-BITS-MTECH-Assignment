import { RequestHandler } from 'express';

function securedFilter(whoCanAccess: string[]): RequestHandler {
    const reqHandler: RequestHandler = (req, res, next) => {
        if (whoCanAccess 
            && whoCanAccess.length 
            && req.user?.node_list?.some(val => whoCanAccess.includes(val))) {
                return next()
        }
        return res.status(403).send({ error: "User doesn't have the required Authority to perform the action" });
    }
    return reqHandler;
}
 
export default securedFilter;



