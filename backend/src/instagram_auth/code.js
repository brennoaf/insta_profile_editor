import express from 'express';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Proxy endpoint to Instagram
app.get('/proxy-instagram/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const response = await fetch(`https://www.instagram.com/${username}/`);
    const body = await response.text();
    res.status(200).send(body); // Send the HTML response back to the client
  } catch (error) {
    console.error('Error fetching Instagram data:', error);
    res.status(500).send('Error fetching Instagram data');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
