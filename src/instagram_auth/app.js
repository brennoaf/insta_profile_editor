// server.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Carregar variáveis de ambiente
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.use(express.static('public')); // Servir arquivos estáticos da pasta 'public'

// Rota para autenticação
app.get('/auth', (req, res) => {
  const authURL = `https://api.instagram.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
  res.redirect(authURL);
});

// Rota de callback
app.get('/auth/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post('https://api.instagram.com/oauth/access_token', null, {
      params: {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code: code
      }
    });

    const accessToken = response.data.access_token;
    res.redirect(`/data?access_token=${accessToken}`);
  } catch (error) {
    console.error('Erro ao obter o token de acesso:', error.response ? error.response.data : error.message);
    res.status(500).send('Erro ao obter o token de acesso.');
  }
});

// Rota para obter dados combinados
app.get('/data', async (req, res) => {
  const accessToken = req.query.access_token;

  try {
    const [profileResponse, mediaResponse] = await Promise.all([
      axios.get(`https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${accessToken}`),
      axios.get(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}`)
    ]);

    // Combine os dados em um único objeto
    const combinedData = {
      profile: profileResponse.data,
      media: mediaResponse.data
    };

    res.json(combinedData);
  } catch (error) {
    console.error('Erro ao obter dados combinados:', error.response ? error.response.data : error.message);
    res.status(500).send('Erro ao obter dados combinados.');
  }
});

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
