import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';

const verifyToken = asyncHandler(async (req, res, next) => {
    // console.log(req.headers.cookie);

    // const cookies =
    //     req.headers.cookie?.split(';').map((cookie) => cookie.trim()) || [];
    // console.log(cookies);

    // const cookiesObj = cookies.reduce((acc, cookie) => {
    //     const [key, value] = cookie.split('=');
    //     acc[key] = value;
    //     return acc;
    // }, {});

    // const token = cookiesObj.token;

    //using cookies
    // if (!req.headers.cookie)
    //     return res.status(401).json({ error: 'Unauthorized. Please sign in' });

    // const [_, token] = req.headers.cookie?.split('=');

    // console.log(token);

    const token = req.headers.authorization?.split(' ')[1];

    if (!token)
        return res.status(401).json({ error: 'Unauthorized. Please sign in' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.userId;

    next();
});

export default verifyToken;
