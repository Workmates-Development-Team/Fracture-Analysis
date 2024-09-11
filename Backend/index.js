
import express from 'express';
import userRouter from './src/Users/routes.js';
import adminRoutes from './admin/routes.js';
import notificationRoutes from './Notification/routes.js';


import cors from 'cors'


import dbConnection from './src/config/db.js';


const app = express();

app.use(cors())
app.use(express.json()); 
app.use('/user', userRouter);
app.use('/admin', adminRoutes);
app.use('/notification', notificationRoutes);

app.get('/', (req, res) => {
  res.send('Working...')
})

dbConnection();
app.listen(3400, () => {
  console.log('Server is running on port 3400');
});
