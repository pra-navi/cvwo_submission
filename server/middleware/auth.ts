import jwt, { JwtPayload } from 'jsonwebtoken';
import pool from '../../server/models/db';
import { getUserIdAuthQuery } from '../../server/models/userQueries'
import { NextFunction, Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
    userId?: string;
}


const auth = async (req: AuthenticatedRequest, res: Request, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        const isCustomAuth = token ? token.length < 500 : false; // if token length is less than 500, it is our own custom token- not google Auth
        let decodedData : JwtPayload | null;
    
        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, 'test') as JwtPayload; // test is the secret key
            req.userId = decodedData?.id;
        } else {
            decodedData = jwt.decode(token as string) as JwtPayload; // if token is google's token
            req.userId = decodedData?.sub; // sub is the google's name for unique id
        }
        next();
    } catch (error) {
        console.log(error);
    }
}

export default auth;
