import express from 'express';
import cors from 'cors';
import postsRoute from './routes/postRoute.js';
import authRoute from './routes/authRoute.js';
import commentRoute from './routes/commentRoute.js';

const app = express();


app.use(cors({
  origin: '*', // For development. Change to your specific frontend URL in production.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());


app.use('/api/posts', postsRoute);
app.use('/api/auth', authRoute);
app.use('/api/comments', commentRoute);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;
