// server.js

require('dotenv').config();
const cors = require('cors');
const express = require('express');
const { authRoute, authCallbackRoute, profileRoute, mediaRoute } = require('./app');

const app = express();
const port = 3000;

// Configurar o middleware CORS
app.use(cors({ origin: '*' }));

app.use('/auth', authRoute);
app.use('/auth/callback', authCallbackRoute);
app.use('/profile', profileRoute);
app.use('/media', mediaRoute);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
