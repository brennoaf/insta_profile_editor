//THIS IS A SCRAPER + BASIC DISPLAY API BACKEND 
//
//BUT I DONT HAVE A BUSINESS AND META REQUESTS
//THIS CODE WORKS BUT I CANT USE TO GET USER END DATA THATS DOESNT HAVE AN APP ROLE
//

//Esta é uma api de scraper + basic display api da META
// Este código funciona mas foi des continuado pois para a sua utilização eu preciso
// de um empresa registrada, na qual não tenho.


require('dotenv').config();
const cors = require('cors');
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.use(cors());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

app.get('/auth', (req, res) => {
  const authURL = `https://api.instagram.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
  res.redirect(authURL);
});

app.get('/auth/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const response = await axios.post('https://api.instagram.com/oauth/access_token', new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
      code: code
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const accessToken = response.data.access_token;

    res.redirect(`http://127.0.0.1:5500/index.html?access_token=${accessToken}`);
  } catch (error) {
    console.error('Erro ao obter o token de acesso:', error.response ? error.response.data : error.message);
    res.status(500).send('Erro ao obter o token de acesso.');
  }
});

app.get('/profile', async (req, res) => {
  const accessToken = req.query.access_token;

  try {
    const response = await axios.get(`https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${accessToken}`);
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao obter perfil:', error.response ? error.response.data : error.message);
    res.status(500).send('Erro ao obter perfil.');
  }
});

app.get('/media', async (req, res) => {
  const accessToken = req.query.access_token;

  try {
    const response = await axios.get(`https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp,username&access_token=${accessToken}`);
    res.json(response.data);
  } catch (error) {
    console.error('Erro ao obter mídia do usuário:', error.response ? error.response.data : error.message);
    res.status(500).send('Erro ao obter mídia do usuário.');
  }
});


app.get('/scraped-info', async (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const response = await axios.get(`https://www.instagram.com/${username}/`);
    const $ = cheerio.load(response.data);

    const profilePicUrl = $('meta[property="og:image"]').attr('content');
    const name = $('meta[property="og:title"]').attr('content').split(' (')[0] || ' ';
    const biography = $('meta[name="description"]').attr('content').split(' on Instagram: ')[1].replace(/^"|"$/g, '') || ' ';
    const followers = $('meta[name="description"]').attr('content').split(', ')[0].split(' ')[0];
    const following = $('meta[name="description"]').attr('content').split(', ')[1].split(' ')[0];
    const postQuantity = $('meta[name="description"]').attr('content').split(', ')[2].split(' -')[0].split(' ')[0];

    if (profilePicUrl && name && biography) {
      res.json({ profilePicUrl, name, biography, followers, following, postQuantity });
    } else {
      res.status(404).json({ error: 'Profile info not found' });
    }
  } catch (error) {
    console.error('Erro ao obter informações do perfil:', error.response ? error.response.data : error.message);
    res.status(500).send('Erro ao obter informações do perfil.');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
