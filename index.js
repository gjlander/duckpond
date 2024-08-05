import express from 'express';
import './db/mongooseClient.js';
import errorHandler from './middlewares/errorHandler.js';
import duckRouter from './routes/duckRoutes.js';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use('/ducks', duckRouter);

app.use(errorHandler);
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
