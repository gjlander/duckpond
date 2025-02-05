import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import asyncHandler from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import User from '../models/User.js';

const signUp = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    const found = await User.findOne({ email });

    if (found) throw new ErrorResponse('Email already exists', 400);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    });

    const secret = process.env.JWT_SECRET; // This will come from the server environment
    const payload = { userId: user._id }; // The data we want to enclose in the JWT
    const tokenOptions = { expiresIn: '6d' }; // We will limit the dura

    const token = jwt.sign(payload, secret, tokenOptions);

    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        httpOnly: true,
        sameSite: isProduction ? 'None' : 'Lax',
        secure: isProduction,
    };

    res.cookie('token', token, cookieOptions);

    res.status(201).json({ success: 'welcome back' });
});

const signIn = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) throw new ErrorResponse('User not found', 404);

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch)
        throw new ErrorResponse('Invalid email or password', 401);

    const secret = process.env.JWT_SECRET; // This will come from the server environment
    const payload = { userId: user._id }; // The data we want to enclose in the JWT
    const tokenOptions = { expiresIn: '6d' }; // We will limit the dura

    const token = jwt.sign(payload, secret, tokenOptions);

    // for using cookie
    // const isProduction = process.env.NODE_ENV === 'production';
    // const cookieOptions = {
    //     httpOnly: true,
    //     sameSite: isProduction ? 'None' : 'Lax',
    //     secure: isProduction,
    // };

    // res.cookie('token', token, cookieOptions);

    res.status(201).json({ user: payload, token });
});

const signOut = asyncHandler(async (req, res) => {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        httpOnly: true,
        sameSite: isProduction ? 'None' : 'Lax',
        secure: isProduction,
    };

    res.clearCookie('token', cookieOptions);

    res.json({ success: 'You have signed out.' });
});

const me = asyncHandler(async (req, res) => {
    const user = await User.findById(req.userId);

    if (!user) throw new ErrorResponse('User not found', 404);

    res.status(200).json(user);
});

export { signUp, signIn, signOut, me };

// // get all users
// const getAllUsers = asyncHandler(async (req, res) => {
//     const users = await User.find().populate('readingList.bookRefId');

//     if (!users.length) {
//         return res.status(200).json({ msg: 'No users in the DB' });
//     }

//     res.status(200).json(users);
// });

// // create a new user
// const createUser = asyncHandler(async (req, res) => {
//     // We grab exactly the keys that we have in the blueprint (Schema)
//     const { firstName, lastName, email } = req.body;

//     if (!firstName || !lastName || !email)
//         throw new ErrorResponse(
//             'First name, last name, and email are required',
//             400
//         );

//     const found = await User.findOne({ email });

//     if (found) throw new ErrorResponse('Email already exists', 400);

//     const user = await User.create({ firstName, lastName, email });

//     res.status(201).json(user);
// });

// // get one user
// const getOneUser = asyncHandler(async (req, res) => {
//     const { id } = req.params;
//     const user = await User.findById(id).populate('readingList.bookRefId');

//     if (!user) throw new ErrorResponse('User not found', 404);

//     res.status(200).json(user);
// });

// // update a user
// const updateUser = asyncHandler(async (req, res) => {
//     const { firstName, lastName, email } = req.body;
//     const { id } = req.params;

//     if (!firstName || !lastName || !email)
//         throw new ErrorResponse(
//             'First name, last name, and email are required',
//             400
//         );

//     const user = await User.findByIdAndUpdate(
//         id,
//         { firstName, lastName, email },
//         { new: true }
//     );

//     if (!user) throw new ErrorResponse('User not found', 404);

//     res.status(200).json(user);
// });

// // delete a user
// const deleteOneUser = asyncHandler(async (req, res) => {
//     const { id } = req.params;

//     const user = await User.findByIdAndDelete(id);

//     if (!user) throw new ErrorResponse('User not found', 404);

//     res.status(200).json({ message: 'User deleted' });
// });

// const addBookToList = asyncHandler(async (req, res) => {
//     const { bookRefId } = req.body;
//     const { id } = req.params;

//     if (!bookRefId) throw new ErrorResponse('bookRefId required', 400);

//     const newBook = {
//         bookRefId,
//     };
//     const user = await User.findById(id);

//     if (!user) throw new ErrorResponse('User not found', 404);

//     user.readingList.push(newBook);
//     await user.save();

//     res.status(200).json(user);
// });

// const updateBookInList = asyncHandler(async (req, res) => {
//     const { id, bookId } = req.params;
//     const { status } = req.body;

//     if (!status) throw new ErrorResponse('bookRefId required', 400);

//     const user = await User.findById(id);

//     if (!user) throw new ErrorResponse('User not found', 404);

//     const book = user.readingList.id(bookId);

//     if (!book) throw new ErrorResponse('Book not found', 404);

//     book.status = status;
//     await user.save();

//     res.status(200).json(user);
// });

// const removeBookFromList = asyncHandler(async (req, res) => {
//     const { id, bookId } = req.params;

//     const user = await User.findById(id);

//     if (!user) throw new ErrorResponse('User not found', 404);

//     user.readingList.id(bookId).deleteOne();
//     await user.save();

//     res.status(200).json(user);
// });

// export {
//     getAllUsers,
//     getOneUser,
//     createUser,
//     updateUser,
//     deleteOneUser,
//     addBookToList,
//     removeBookFromList,
//     updateBookInList,
// };
