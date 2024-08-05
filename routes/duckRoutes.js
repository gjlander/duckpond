import express from 'express';
import { getAllDucks, createDuck } from '../controllers/duckControllers.js';

const duckRouter = express.Router();

duckRouter.route('/').get(getAllDucks).post(createDuck);

// duckRouter.route('/:id').get(getDuckById).put(editDuck).delete(deleteDuck);

export default duckRouter;
