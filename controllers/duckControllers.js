import ErrorStatus from '../utils/errorStatus.js';
import DuckModel from '../models/duckModel.js';

const getAllDucks = async (req, res, next) => {
    try {
        const ducks = await DuckModel.find();
        return res.json(ducks);
    } catch (error) {
        next(error);
    }
};

const createDuck = async (req, res, next) => {
    try {
        const { name, imgUrl, quote } = req.body;
        if (!name || !imgUrl)
            throw new ErrorStatus('Missing required fields!, 400');

        const newDuck = await DuckModel.create({
            name,
            imgUrl,
            quote,
        });

        return res.status(201).json(newDuck);
    } catch (error) {
        next(error);
    }
};

export { getAllDucks, createDuck };
