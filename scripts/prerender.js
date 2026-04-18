import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import pkg from 'serve-handler';
const handler = pkg.default || pkg;

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, '..', 'dist');

async function prerender() {
  // Start a static server for the built files
  const server = createServer((req, res) => handler(req, res, { public: DIST }));
  await new Promise(r => server.listen(9876, r));
  console.log('Serving dist on :9876');

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:9876', { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for React to render
  await page.waitForSelector('h1', { timeout: 10000 });

  // Get the rendered content
  const renderedContent = await page.evaluate(() => {
    return document.getElementById('root').innerHTML;
  });

  // Get the full rendered page HTML for scrapers
  const fullHTML = await page.content();

  await browser.close();
  server.close();

  // Read the original index.html
  const indexPath = resolve(DIST, 'index.html');
  let indexHTML = readFileSync(indexPath, 'utf-8');

  // Replace empty root div with rendered content
  indexHTML = indexHTML.replace(
    '<div id="root"></div>',
    `<div id="root">${renderedContent}</div>`
  );

  // Also inject a noscript block with key content for bots that don't run JS at all
  // Extract visible text content for the noscript fallback
  const noscriptContent = await extractTextContent(renderedContent);
  indexHTML = indexHTML.replace(
    '</head>',
    `</head>\n<noscript><div style="display:none">${noscriptContent}</div></noscript>`
  );

  writeFileSync(indexPath, indexHTML);
  console.log('Prerendered index.html written successfully');
}

async function extractTextContent(html) {
  // Simple extraction: strip HTML tags but keep text for noscript
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 5000); // Keep it reasonable
}

prerender().catch(err => {
  console.error('Prerender failed:', err);
  process.exit(1);
});
