import { isValidObjectId } from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';
import ErrorStatus from '../utils/ErrorResponse.js';
import DuckModel from '../models/Duck.js';

const getAllDucks = asyncHandler(async (req, res, next) => {
    const ducks = await DuckModel.find().populate('owner');
    res.json(ducks);
});

const createDuck = asyncHandler(async (req, res, next) => {
    const { body } = req;

    const newDuck = await (
        await DuckModel.create({ ...body })
    ).populate('owner');

    res.status(201).json(newDuck);
});

const getDuckById = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) throw new ErrorResponse('Invalid id', 400);
    const duck = await DuckModel.findById(id);

    if (!duck)
        throw new ErrorResponse(`Duck with id of ${id} doesn't exist`, 404);

    res.json(duck);
});

const updateDuck = asyncHandler(async (req, res, next) => {
    const {
        userId,
        params: { id },
        body: { name, imgUrl, quote },
    } = req;

    if (!isValidObjectId(id)) throw new ErrorResponse('Invalid id', 400);

    // const updatedDuck = await Duck.findByIdAndUpdate(id, body, {
    //     new: true,
    // }).populate('owner');

    const duckInDatabase = await DuckModel.findById(id);

    if (!duckInDatabase)
        throw new ErrorResponse(`Duck with id of ${id} doesn't exist`, 404);

    duckInDatabase.name = name;
    duckInDatabase.imgUrl = imgUrl;
    duckInDatabase.quote = quote;

    // RBAC: Only users with role of admin can edit everything

    if (userId !== duckInDatabase.owner.toString()) {
        throw new ErrorResponse('Not authorized', 401);
    }

    await duckInDatabase.save();

    res.json(duckInDatabase);
});

const deleteDuck = asyncHandler(async (req, res, next) => {
    const {
        userId,
        params: { id },
    } = req;

    if (!isValidObjectId(id)) throw new ErrorResponse('Invalid id', 400);

    const duckInDatabase = await DuckModel.findById(id);

    if (!duckInDatabase)
        throw new ErrorResponse(`Duck with id of ${id} doesn't exist`, 404);

    if (userId !== duckInDatabase.owner.toString()) {
        throw new ErrorResponse('Not authorized', 401);
    }
    await DuckModel.findByIdAndDelete(id);

    res.json({ success: `Duck with id of ${id} was deleted` });
});

export { getAllDucks, createDuck, getDuckById, updateDuck, deleteDuck };
