import puppeteer from 'puppeteer';

export default async (req, res) => {
  const urlUsername = req.query.username;

  if (!urlUsername) {
    return res.status(400).json({ error: 'Username is required' });
  }

  let browser;

  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--disable-gpu', '--no-sandbox', '--disable-dev-shm-usage']
    });
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
    if (browser) await browser.close();
  }
};
