import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());

app.get('/scraped-profile', async (req, res) => {
  const urlUsername = req.query.username;

  if (!urlUsername) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(`https://www.instagram.com/${urlUsername}/`, {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    await page.waitForSelector('meta[property="og:title"]', { timeout: 5000 });

    const scrapedInfo = await page.evaluate(() => {
      const getTextContent = (selector) => {
        const element = document.querySelector(selector);
        return element ? element.getAttribute('content') : null;
      };

      const username = getTextContent('meta[property="og:title"]')?.split(') ')[0].split(' (@')[1] || ' ';
      const profilePicUrl = getTextContent('meta[property="og:image"]') || ' ';
      const name = getTextContent('meta[property="og:title"]')?.split(' (')[0];

      const rawDescription = getTextContent('meta[name="description"]');
      const biography = rawDescription?.split(': ')[1].replace(/"/g, '');
      const followers = rawDescription?.split(', ')[0].split(' ')[0] || 'N/A';
      const following = rawDescription?.split(', ')[1].split(' ')[0] || 'N/A';
      const postQuantity = rawDescription?.split(', ')[2].split(' -')[0].split(' ')[0] || 'N/A';

      return { username, profilePicUrl, name, biography, followers, following, postQuantity };
    });

    await browser.close();

    res.json(scrapedInfo);

  } catch (error) {
    console.error('Error fetching profile information:', error);
    res.status(500).json({ error: 'Failed to fetch profile information' });

  }finally {
    if (browser) {
      await browser.close();  // Certifique-se de fechar o navegador mesmo se ocorrer um erro
    }
  }
});


app.get('/scraped-publications', async (req, res) => {
  const urlUsername = req.query.username;

  if (!urlUsername) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    const browser = await puppeteer.launch({ 
      //Launch params guarantees an invisible process
      headless: 'new', 
      args: ['--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage']
     });
    const page = await browser.newPage();

    await page.goto(`https://www.instagram.com/${urlUsername}/`, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    const getHighlightData = async () => {
      await page.waitForSelector('div.x1qjc9v5 ul._acay li._acaz', { timeout: 10000 });

      const highlights = await page.evaluate(() => {
        const highlightElements = Array.from(document.querySelectorAll('ul._acay > li._acaz'));

        return highlightElements
          .filter(el => !el.style.transition)
          .map(el => {
            const imgEl = el.querySelector('img');
            const titleEl = el.querySelector('span');
            return {
              image: imgEl?.src || '',
              title: titleEl?.innerText || '',
            };
          });
      });

      return highlights;
    };

    const highlightData = await getHighlightData();

    // Convert highlight images to Base64
    for (let highlight of highlightData) {
      if (highlight.image) {
        highlight.image = await fetchImageAsBase64(highlight.image);
      }
    }

    const getImages = async () => {
      const numberOfImages = 12; // forcing image load quantity to 12
      let images = [];
      let lastHeight = await page.evaluate('document.body.scrollHeight');

      while (images.length < numberOfImages) {
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await page.waitForSelector('article img', { timeout: 10000 }).catch(() => {});

        images = await page.evaluate(() => {
          const postElements = Array.from(document.querySelectorAll('article img'));
          return postElements.map(img => img.src);
        });

        const newHeight = await page.evaluate('document.body.scrollHeight');
        if (newHeight === lastHeight) {
          break;
        }
        lastHeight = newHeight;
      }

      return images.slice(0, numberOfImages);
    };

    const posts = await getImages();

    const postsBase64 = await Promise.all(posts.map(url => fetchImageAsBase64(url)));

    await browser.close();

    res.json({ 
      posts: postsBase64, 
      highlightData 
      
    });

  } catch (error) {
    console.error('Error fetching profile information:', error);
    res.status(500).json({ error: 'Failed to fetch profile information' });

  }finally {
    if (browser) {
      await browser.close();  // Certifique-se de fechar o navegador mesmo se ocorrer um erro
    }
  }
});

//Necessário pois as thumbnails de publicação estavam sendo recusadas pelo CORS
async function fetchImageAsBase64(url) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return `data:image/jpeg;base64,${Buffer.from(buffer).toString('base64')}`;
}

const port = 3001;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
