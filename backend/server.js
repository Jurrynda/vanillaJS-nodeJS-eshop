import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import config from './config';
import userRouter from './routers/userRouter';
import orderRouter from './routers/orderRouter';
import productRouter from './routers/productRouter';
import uploadRouter from './routers/uploadRouter';

mongoose
  .connect(config.MONGODB_URL)
  .then(() => {
    console.log('Connected to Mongodb.');
  })
  .catch((error) => {
    console.log(error.reason);
  });

const app = express();
const PORT = 5000;
app.use(cors());
app.use(bodyParser.json());
app.use('/api/products', productRouter);
app.use('/api/uploads', uploadRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
app.get('/api/paypal/clientId', (req, res) => {
  res.send({ clientId: config.PAYPAL_CLIENT_ID });
});
app.use('/uploads', express.static(path.join(__dirname, '/../uploads')));
app.use(express.static(path.join(__dirname, '/../frontend')));
app.use((err, req, res, next) => {
  const status = err.name && err.name === 'ValidationError' ? 400 : 500;
  res.status(status).send({ message: err.message });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/../frontend/index.html'));
});

app
  .listen(config.PORT || PORT, () => {
    console.log('server is running on port 5000');
  })
  .on('error', () => {
    process.once('SIGUSR2', () => {
      process.kill(process.pid, 'SIGUSR2');
    });
  });
