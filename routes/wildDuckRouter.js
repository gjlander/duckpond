import { Router } from 'express';
import validateZod from '../middlewares/validateZod.js';
import {
  getAllWildDucks,
  createWildDuck,
  getWildDuckById,
  updateWildDuck,
  deleteWildDuck
} from '../controllers/wildDuckControllers.js';
import { wildDuckSchema } from '../zod/schemas.js';

const wildDuckRouter = Router();

wildDuckRouter.route('/').get(getAllWildDucks).post(validateZod(wildDuckSchema), createWildDuck);

wildDuckRouter
  .route('/:id')
  .get(getWildDuckById)
  .put(validateZod(wildDuckSchema), updateWildDuck)
  .delete(deleteWildDuck);

export default wildDuckRouter;
