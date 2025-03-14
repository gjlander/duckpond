import { isValidObjectId } from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorStatus from '../utils/ErrorResponse.js';
import WildDuckModel from '../models/WildDuck.js';

const getAllWildDucks = asyncHandler(async (req, res, next) => {
    const wildDucks = await WildDuckModel.find();
    res.json(wildDucks);
});

const createWildDuck = asyncHandler(async (req, res, next) => {
    const { body } = req;

    const newWildDuck = await WildDuckModel.create({ ...body });

    res.status(201).json(newWildDuck);
});

const getWildDuckById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) throw new ErrorResponse('Invalid id', 400);
    const wildDuck = await WildDuckModel.findById(id);

    if (!wildDuck)
        throw new ErrorResponse(`WildDuck with id of ${id} doesn't exist`, 404);

    res.json(wildDuck);
});

const updateWildDuck = asyncHandler(async (req, res, next) => {
    const {
        params: { id },
        body: { name, imgUrl, quote },
    } = req;

    if (!isValidObjectId(id)) throw new ErrorResponse('Invalid id', 400);

    const wildDuckInDatabase = await WildDuckModel.findById(id);

    if (!wildDuckInDatabase)
        throw new ErrorResponse(`WildDuck with id of ${id} doesn't exist`, 404);

    wildDuckInDatabase.name = name;
    wildDuckInDatabase.imgUrl = imgUrl;
    wildDuckInDatabase.quote = quote;

    await wildDuckInDatabase.save();

    res.json(wildDuckInDatabase);
});

const deleteWildDuck = asyncHandler(async (req, res, next) => {
    const {
        params: { id },
    } = req;

    if (!isValidObjectId(id)) throw new ErrorResponse('Invalid id', 400);

    const wildDuckInDatabase = await WildDuckModel.findById(id);

    if (!wildDuckInDatabase)
        throw new ErrorResponse(`WildDuck with id of ${id} doesn't exist`, 404);

    await WildDuckModel.findByIdAndDelete(id);

    res.json({ success: `WildDuck with id of ${id} was deleted` });
});

export {
    getAllWildDucks,
    createWildDuck,
    getWildDuckById,
    updateWildDuck,
    deleteWildDuck,
};
