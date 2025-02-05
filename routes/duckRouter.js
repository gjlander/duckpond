import { Router } from 'express';
import validateJOI from '../middlewares/validateJOI.js';
import verifyToken from '../middlewares/verifyToken.js';
import {
    getAllDucks,
    createDuck,
    getDuckById,
    updateDuck,
    deleteDuck,
} from '../controllers/duckControllers.js';
import { duckSchema } from '../joi/schemas.js';

const duckRouter = Router();

duckRouter
    .route('/')
    .get(getAllDucks)
    .post(verifyToken, validateJOI(duckSchema), createDuck);

duckRouter
    .route('/:id')
    .get(getDuckById)
    .put(verifyToken, validateJOI(duckSchema), updateDuck)
    .delete(verifyToken, deleteDuck);

export default duckRouter;
