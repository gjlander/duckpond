import { Router } from 'express';
import validateJOI from '../middlewares/validateJOI.js';
import {
    getAllWildDucks,
    createWildDuck,
    getWildDuckById,
    updateWildDuck,
    deleteWildDuck,
} from '../controllers/wildDuckControllers.js';
import { duckSchema } from '../joi/schemas.js';

const wildDuckRouter = Router();

wildDuckRouter
    .route('/')
    .get(getAllWildDucks)
    .post(validateJOI(duckSchema), createWildDuck);

wildDuckRouter
    .route('/:id')
    .get(getWildDuckById)
    .put(validateJOI(duckSchema), updateWildDuck)
    .delete(deleteWildDuck);

export default wildDuckRouter;
