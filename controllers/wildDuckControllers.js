import { isValidObjectId } from 'mongoose';

import WildDuckModel from '../models/WildDuck.js';

const getAllWildDucks = async (req, res, next) => {
  const wildDucks = await WildDuckModel.find();
  res.json(wildDucks);
};

const createWildDuck = async (req, res, next) => {
  const { body } = req;

  const newWildDuck = await WildDuckModel.create({ ...body });

  res.status(201).json(newWildDuck);
};

const getWildDuckById = async (req, res, next) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });
  const wildDuck = await WildDuckModel.findById(id);

  if (!wildDuck) throw new Error(`WildDuck with id of ${id} doesn't exist`, { cause: 404 });

  res.json(wildDuck);
};

const updateWildDuck = async (req, res, next) => {
  const {
    params: { id },
    body: { name, imgUrl, quote }
  } = req;

  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });

  const wildDuckInDatabase = await WildDuckModel.findById(id);

  if (!wildDuckInDatabase) throw new Error(`WildDuck with id of ${id} doesn't exist`, { cause: 404 });

  wildDuckInDatabase.name = name;
  wildDuckInDatabase.imgUrl = imgUrl;
  wildDuckInDatabase.quote = quote;

  await wildDuckInDatabase.save();

  res.json(wildDuckInDatabase);
};

const deleteWildDuck = async (req, res, next) => {
  const {
    params: { id }
  } = req;

  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: 400 });

  const wildDuckInDatabase = await WildDuckModel.findById(id);

  if (!wildDuckInDatabase) throw new Error(`WildDuck with id of ${id} doesn't exist`, { cause: 404 });

  await WildDuckModel.findByIdAndDelete(id);

  res.json({ success: `WildDuck with id of ${id} was deleted` });
};

export { getAllWildDucks, createWildDuck, getWildDuckById, updateWildDuck, deleteWildDuck };
