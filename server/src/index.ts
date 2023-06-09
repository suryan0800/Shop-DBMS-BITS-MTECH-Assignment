// server/main.js
import dotenv from 'dotenv';

const envFileName = `.env.${process.env.NODE_ENV || 'dev'}`
dotenv.config({path: envFileName});

import path from 'path';
import express from 'express';
import jwtHandler from './configs/OncePerRequestFilter';
import loginRouter from './api/Login';
import testRouter from './api/Test';
import customerRouter from './api/CustomerApi';
import logisticsRouter from './api/LogisticsApi';
import sellerRouter from './api/SellerApi';

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json())

app.use((req, res, next) => {
  console.log("Time: ", new Date())
  console.log(`${req.method}: ${req.path}`)
  next()
})

app.use('/user', loginRouter)

app.use('/api/test', jwtHandler, testRouter)

app.use('/api/customer', jwtHandler, customerRouter)

app.use('/api/seller', jwtHandler, sellerRouter)

app.use('/api/logistics', jwtHandler, logisticsRouter)


// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../../ui/build')));

// All other GET requests not handled before will return our React app
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../ui/build', 'index.html'));
});

// Listen to the respective port 
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});


