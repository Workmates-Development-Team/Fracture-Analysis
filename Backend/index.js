
import express from 'express';
import userRouter from './src/Users/routes.js';

import cors from 'cors'


import dbConnection from './src/config/db.js';


const app = express();

app.use(cors())
app.use(express.json()); 
app.use('/api/v1/user', userRouter);

dbConnection();
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
