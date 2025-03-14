import express from 'express';
import cors from 'cors';
import './db/mongooseClient.js';
import authRouter from './routes/authRouter.js';
import duckRouter from './routes/duckRouter.js';
import wildDuckRouter from './routes/wildDuckRouter.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/ducks', duckRouter);
app.use('/wild-ducks', wildDuckRouter);
app.use('/auth', authRouter);

app.use('*', (req, res) => res.status(404).json({ error: 'Not found' }));

app.use(errorHandler);
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
