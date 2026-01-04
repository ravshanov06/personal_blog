import express from 'express';
import cors from 'cors';
import postsRoute from './routes/postRoute.js';
import authRoute from './routes/authRoute.js';
import commentRoute from './routes/commentRoute.js';

const app = express();


app.use(cors());
app.use(express.json());


app.use('/api/posts', postsRoute);
app.use('/api/auth', authRoute);
app.use('/api/comments', commentRoute);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;