import { Router } from 'express';
import validateJOI from '../middlewares/validateJOI.js';
import verifyToken from '../middlewares/verifyToken.js';
import { signUp, signIn, signOut, me } from '../controllers/auth.js';
import { userSchema, siginSchema } from '../joi/schemas.js';

const authRouter = Router();

authRouter.route('/signup').post(validateJOI(userSchema), signUp);

authRouter.route('/signin').post(validateJOI(siginSchema), signIn);

authRouter.route('/signout').delete(signOut);

authRouter.route('/me').get(verifyToken, me);

export default authRouter;
