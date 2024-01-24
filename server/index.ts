import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import postRoutes from './routes/posts';
import userRoutes from './routes/users';
import listRoutes from './routes/lists';

const app = express();
app.use(express.json());
dotenv.config();

app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
// app.use(cors({ origin: 'https://learners-react.vercel.app' }));
app.use(cors()); // local

app.use('/posts', postRoutes);
app.use('/user', userRoutes);
app.use('/list', listRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port : ${PORT}`));

export default app;
    