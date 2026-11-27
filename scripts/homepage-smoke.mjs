import puppeteer from 'puppeteer';
import assert from 'node:assert/strict';
import { mkdirSync, writeFileSync } from 'node:fs';

const base = process.env.PREVIEW_URL || 'https://mindvault-homepage-preview.pages.dev';
const out = process.env.QA_DIR || '/root/.hermes/cache/scratch/mindvault-homepage-qa';
mkdirSync(out, { recursive: true });
const booking = 'https://calendar.app.google/ksdfb41yF333wmv76';
const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome', headless: false,
  env: { ...process.env, DISPLAY: ':99' },
  // The VNC server has no physical mouse; emulate desktop pointer hardware.
  // Mobile touch emulation below still switches these media queries to coarse/none.
  args: ['--no-sandbox', '--disable-dev-shm-usage',
    '--blink-settings=availablePointerTypes=4,primaryPointerType=4,availableHoverTypes=2,primaryHoverType=2'],
});
const report = { base, checks: [], errors: [] };
const page = await browser.newPage();
page.on('pageerror', e => report.errors.push(e.message));
page.on('console', m => { if (m.type() === 'error') report.errors.push(m.text()); });
const wait = ms => new Promise(r => setTimeout(r, ms));
async function check(name, fn) {
  await fn(); report.checks.push(name); console.log('PASS', name);
}
async function popupClick(selector) {
  const pending = new Promise(resolve => page.once('popup', resolve));
  await page.click(selector);
  const popup = await Promise.race([pending, wait(30000).then(() => { throw new Error('No booking popup'); })]);
  await popup.waitForFunction(() => location.hostname.includes('calendar.google') || location.hostname === 'calendar.app.google', { timeout: 30000 });
  console.log('BOOKING_DESTINATION', popup.url());
  assert.match(popup.url(), /^https:\/\/(calendar\.app\.google|calendar\.google\.com)\//);
  await popup.close();
}
try {
  await page.setViewport({ width: 1440, height: 1000 });
  const response = await page.goto(base, { waitUntil: 'networkidle2' });
  assert.equal(response.status(), 200);
  await check('Homepage title, copy, inline images and Google booking links', async () => {
    assert.equal(await page.title(), 'MindVault Studio | Book 15 Minutes with John');
    assert.match(await page.$eval('h1', e => e.textContent), /Stop losing jobs/);
    assert.equal(await page.$$eval('img', els => els.filter(e => !e.complete || !e.naturalWidth).length), 0);
    const links = await page.$$eval('a[href*="calendar.app.google"]', els => els.map(e => e.href));
    assert.ok(links.length >= 10); assert.ok(links.every(h => h === booking));
  });
  await wait(1200);
  await page.screenshot({ path: `${out}/desktop.png` });
  await check('Desktop mouse-following sprite', async () => {
    await page.mouse.move(380, 280); await wait(400);
    const a = await page.$eval('#buddy', e => ({ hidden: e.hidden, transform: e.style.transform }));
    await page.mouse.move(600, 350); await wait(600);
    const b = await page.$eval('#buddy', e => ({ hidden: e.hidden, transform: e.style.transform }));
    assert.equal(b.hidden, false); assert.notEqual(a.transform, b.transform);
  });
  await check('Homepage booking button opens Google calendar', async () => popupClick('.hero .btn'));
  await page.mouse.move(2, 2);
  await check('Solutions open automatically as the page scrolls', async () => {
    const states = [];
    for (const step of [0, 1, 2, 3]) {
      await page.evaluate(step => {
        document.documentElement.style.scrollBehavior = 'auto';
        const top = document.querySelector('#sols').getBoundingClientRect().top + scrollY;
        scrollTo(0, top - innerHeight * .42 + step * 230 + 15);
      }, step);
      await wait(1000);
      states.push(await page.$$eval('.sol', es => es.findIndex(e => e.classList.contains('open'))));
    }
    assert.deepEqual(states, [0, 1, 2, 3]);
  });
  await check('Sticky navigation and fixed booking card', async () => {
    await page.evaluate(() => document.querySelector('#how').scrollIntoView()); await wait(1000);
    assert.equal(await page.$eval('#nav', e => getComputedStyle(e).position), 'sticky');
    assert.equal(await page.$eval('#toast', e => getComputedStyle(e).position), 'fixed');
    assert.equal(await page.$eval('#toast', e => e.classList.contains('show')), true);
  });
  await check('Booking band expands as it enters view', async () => {
    await page.evaluate(() => document.querySelector('#bookBand').scrollIntoView()); await wait(1000);
    const inset = await page.$eval('#bookBand', e => Number(e.style.getPropertyValue('--bi')));
    assert.ok(inset < 2);
  });
  await check('No horizontal scrolling at desktop and phone widths', async () => {
    for (const width of [1440, 980, 720, 430, 390, 375, 320]) {
      await page.setViewport({ width, height: 900, isMobile: width < 720, hasTouch: width < 720 });
      await page.goto(base, { waitUntil: 'networkidle2' });
      const dimensions = await page.evaluate(() => ({ width: innerWidth, scroll: document.documentElement.scrollWidth }));
      assert.ok(dimensions.scroll <= dimensions.width, JSON.stringify(dimensions));
      if (width === 390) {
        await page.mouse.move(180, 220); await wait(400);
        assert.equal(await page.$eval('#buddy', e => e.hidden), true);
        await page.screenshot({ path: `${out}/mobile.png`, fullPage: true });
      }
    }
  });
  await page.setViewport({ width: 1440, height: 1000 });
  const slugs = ['growth-scorecard', 'roi-calculator', 'follow-up-generator', 'review-request-generator', 'estimate-tracker', 'onboarding-checklist', 'solar-savings-calculator'];
  for (const slug of slugs) {
    await check(`Legacy URL and refresh: ${slug}`, async () => {
      await page.goto(`${base}/#/${slug}`, { waitUntil: 'networkidle2' });
      await page.waitForSelector('#root h1');
      assert.equal(new URL(page.url()).pathname, '/tools/');
      assert.equal(new URL(page.url()).hash, `#/${slug}`);
      const heading = await page.$eval('#root h1', e => e.textContent);
      assert.ok(heading.trim());
      await page.reload({ waitUntil: 'networkidle2' });
      await page.waitForSelector('#root h1');
      assert.equal(await page.$eval('#root h1', e => e.textContent), heading);
      console.log('TOOL', slug, heading);
    });
  }
  await check('Growth scorecard result screen booking button opens Google calendar', async () => {
    await page.goto(`${base}/#/growth-scorecard`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('#root h1');
    await page.evaluate(() => [...document.querySelectorAll('button')].filter(b => b.textContent.trim() === 'No').forEach(b => b.click()));
    await wait(150);
    await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Get My Score').click());
    await page.waitForSelector(`a[href="${booking}"]`);
    assert.match(await page.$eval('#root', e => e.textContent), /Your Growth Score/);
    await page.screenshot({ path: `${out}/scorecard-result.png`, fullPage: true });
    await popupClick(`a[href="${booking}"]`);
  });
  for (const path of ['/privacy', '/demo.html', '/resources/seo-aeo-geo-one-pager/', '/audience-intelligence/', '/review/']) {
    await check(`Preserved page: ${path}`, async () => {
      const r = await page.goto(base + path, { waitUntil: 'networkidle2' });
      assert.equal(r.status(), 200); assert.ok((await page.$eval('body', e => e.textContent)).trim());
      assert.equal(await page.$('#heroTitle'), null);
      if (path === '/demo.html') assert.equal(await page.$eval('a.cta', e => e.href), booking);
    });
  }
  await check('No browser JavaScript or console errors', async () => assert.deepEqual(report.errors, []));
  report.passed = true;
} catch (e) {
  report.passed = false; report.failure = e.stack;
  await page.screenshot({ path: `${out}/failure.png` }).catch(() => {});
  console.error(e); process.exitCode = 1;
} finally {
  writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 2));
  await browser.close();
  console.log(JSON.stringify(report, null, 2));
}
