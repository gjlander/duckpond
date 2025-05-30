import { Router } from 'express';
import validateZod from '../middlewares/validateZod.js';
import verifyToken from '../middlewares/verifyToken.js';
import { getAllDucks, createDuck, getDuckById, updateDuck, deleteDuck } from '../controllers/duckControllers.js';
import { duckSchema, wildDuckSchema as updateDuckSchema } from '../zod/schemas.js';

const duckRouter = Router();

duckRouter.route('/').get(getAllDucks).post(verifyToken, validateZod(duckSchema), createDuck);

duckRouter
  .route('/:id')
  .get(getDuckById)
  .put(verifyToken, validateZod(updateDuckSchema), updateDuck)
  .delete(verifyToken, deleteDuck);

export default duckRouter;
