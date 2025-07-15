import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import prisma from './prisma/client.js';
import eventRoutes from './routes/events.js';

const app = express();
app.use(express.json());
app.use('/events', eventRoutes);

const PORT = process.env.PORT || 3000;

prisma.$connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
