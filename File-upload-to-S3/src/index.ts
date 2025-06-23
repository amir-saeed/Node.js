import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { uploadRoutes } from '@routes/upload.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});