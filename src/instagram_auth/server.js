const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const appRoutes = require('./app');

app.use('/', appRoutes);

app.use(express.static(__dirname));


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
