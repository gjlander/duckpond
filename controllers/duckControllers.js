import { isValidObjectId } from 'mongoose';
import DuckModel from '../models/Duck.js';

const getAllDucks = async (req, res, next) => {
  const ducks = await DuckModel.find().populate('owner');
  res.json(ducks);
};

const createDuck = async (req, res, next) => {
  const { body } = req;

  const newDuck = await (await DuckModel.create({ ...body })).populate('owner');

  res.status(201).json(newDuck);
};

const getDuckById = async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });
  const duck = await DuckModel.findById(id).populate('owner');

  if (!duck) throw new Error(`Duck with id of ${id} doesn't exist`, { cause: 404 });

  res.json(duck);
};

const updateDuck = async (req, res, next) => {
  const {
    userId,
    params: { id },
    body: { name, imgUrl, quote }
  } = req;

  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });

  // const updatedDuck = await Duck.findByIdAndUpdate(id, body, {
  //     new: true,
  // }).populate('owner');

  const duckInDatabase = await DuckModel.findById(id);

  if (!duckInDatabase) throw new Error(`Duck with id of ${id} doesn't exist`, { cause: 404 });

  duckInDatabase.name = name;
  duckInDatabase.imgUrl = imgUrl;
  duckInDatabase.quote = quote;

  // RBAC: Only users with role of admin can edit everything

  if (userId !== duckInDatabase.owner.toString()) {
    throw new Error('Not authorized', { cause: 403 });
  }

  await duckInDatabase.save();

  res.json(duckInDatabase);
};

const deleteDuck = async (req, res, next) => {
  const {
    userId,
    params: { id }
  } = req;

  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });

  const duckInDatabase = await DuckModel.findById(id);

  if (!duckInDatabase) throw new Error(`Duck with id of ${id} doesn't exist`, { cause: 404 });

  if (userId !== duckInDatabase.owner.toString()) {
    throw new Error('Not authorized', { cause: 403 });
  }
  await DuckModel.findByIdAndDelete(id);

  res.json({ success: `Duck with id of ${id} was deleted` });
};

export { getAllDucks, createDuck, getDuckById, updateDuck, deleteDuck };
