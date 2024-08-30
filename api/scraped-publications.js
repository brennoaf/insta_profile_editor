import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import fetch from 'node-fetch';

export default async (req, res) => {
  const urlUsername = req.query.username;

  if (!urlUsername) {
    return res.status(400).json({ error: 'Username is required' });
  }

  let browser;

  try {
    // Detect if we're in a serverless environment
    const isServerless = process.env.NODE_ENV === 'production';

    if (isServerless) {
      // Use smaller Chromium for serverless environments
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: true, // In serverless environments, headless should be true
      });
    } else {
      // Use Puppeteer with full Chromium in local development
      browser = await puppeteer.launch({
        headless: 'new', // 'new' for Puppeteer v18
        args: ['--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage']
      });
    }

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
      const numberOfImages = 12; // Forcing image load quantity to 12
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

    res.json({ 
      posts: postsBase64, 
      highlightData 
    });

  } catch (error) {
    console.error('Error fetching profile information:', error);
    res.status(500).json({ error: 'Failed to fetch profile information' });
  } finally {
    if (browser) await browser.close();  // Ensure the browser is closed even if an error occurs
  }
};

async function fetchImageAsBase64(url) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return `data:image/jpeg;base64,${Buffer.from(buffer).toString('base64')}`;
}
