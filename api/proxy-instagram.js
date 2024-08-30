import fetch from 'node-fetch';

const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

export default async function handler(req, res) {
  const {
    query: { username },
  } = req;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    console.log(`Fetching Instagram profile for username: ${username}`);

    const response = await fetch(`https://proxy.cors.sh/https://www.instagram.com/${username}/`, {
        headers: {
            'x-cors-api-key': 'temp_2c0bbfae5513891c6847521b9abed15a',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            'Origin': 'https://instagram-profile-editor.vercel.app/',
            'X-Requested-With': 'XMLHttpRequest'
        }
    });

    if (!response.ok) {
      const errorText = await response.text(); // Capture the error response body
      console.error(`Failed to fetch Instagram data. Status: ${response.status}, Body: ${errorText}`);
      return res.status(response.status).json({
        error: 'Failed to fetch Instagram data',
        status: response.status,
        body: errorText,
      });
    }

    const body = await response.text();
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(body);
  } catch (error) {
    console.error('Error fetching Instagram data:', error);
    res.status(500).json({
      error: 'Error fetching Instagram data',
      message: error.message,
      stack: error.stack,
    });
  }
}
