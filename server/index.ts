import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import postRoutes from './routes/posts';
import userRoutes from './routes/users';
import listRoutes from './routes/lists'

const app = express();
dotenv.config();

app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// app.use(cors({ origin: 'https://learners-react.vercel.app' }));
app.use(cors()); // cy local

app.use('/posts', postRoutes);
//specify routes after app.use(cors()); else will have network error
app.use('/user', userRoutes);
app.use('/list', listRoutes);

const PORT = process.env.PORT || 5000;

const CONNECTION_URL = process.env.CONNECTION_URL;

if (!CONNECTION_URL) {
    console.error('MongoDB connection URL is not defined.');
    process.exit(1);
}

mongoose.connect(CONNECTION_URL, )
    .then(() => app.listen(PORT, () => console.log(`Server running on port : ${PORT}`)))
    .catch((error) => console.log(error.message));

// mongoose.set('useFindAndModify', false); //make sure don't get any warning in the console

export default app;
    