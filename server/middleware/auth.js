import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const isCustomAuth = token.length < 500; // if token length is less than 500, it is our own custom token- not google Auth
        let decodedData;
    
        if (token && isCustomAuth) {
            decodedData = jwt.verify(token, 'test'); // test is the secret key
            req.userId = decodedData?.id;
        } else {
            decodedData = jwt.decode(token); // if token is google's token
            req.userId = decodedData?.sub; // sub is the google's name for unique id
        }
    
        next(); //gives permission
    } catch (error) {
        console.log(error);
    }
}

export default auth;