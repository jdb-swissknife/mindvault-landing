import puppeteer from 'puppeteer';
import { mkdirSync } from 'node:fs';
const out = '/root/.hermes/cache/scratch/mindvault-homepage-qa';
mkdirSync(out, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome', headless: false,
  env: { ...process.env, DISPLAY: ':99' },
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--blink-settings=availablePointerTypes=4,primaryPointerType=4,availableHoverTypes=2,primaryHoverType=2'],
});
try {
  for (const [label, width] of [['desktop',1440],['phone',390]]) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 1000, isMobile: width < 720, hasTouch: width < 720 });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    for (const [version, url] of [['original','file:///root/Downloads/mindvault-claude.html'],['preview','https://mindvault-homepage-preview.pages.dev/']]) {
      await page.goto(url, { waitUntil: 'networkidle2' });
      await page.evaluate(() => document.fonts.ready);
      await new Promise(r => setTimeout(r, 500));
      await page.screenshot({ path: `${out}/${label}-${version}-full.png`, fullPage: true });
    }
    await page.close();
  }
} finally { await browser.close(); }
