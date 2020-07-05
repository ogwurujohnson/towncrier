require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const processRequest = require('./processRequest');
const cron = require('./cron');

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors());

cron.start();

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('welcome');
});

app.post('/receive', async (req, res) => {
  const { body } = req;
  processRequest(body.content);
  res.status(201).json({success: true})
});

app.listen(port, () => {
  console.log(`connected to ${port}`)
})