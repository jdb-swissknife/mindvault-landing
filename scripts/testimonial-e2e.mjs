import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import puppeteer from 'puppeteer';

const base = process.env.REVIEW_TEST_URL || 'http://127.0.0.1:4179/review/';
const tag = `mvs-e2e-${Date.now()}`;
const directory = `/tmp/${tag}`;
await fs.mkdir(directory, { recursive: true, mode: 0o700 });
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const receipts = [];
try {
  for (const permission of [false, true]) {
    const page = await browser.newPage();
    const issues = [];
    page.on('pageerror', error => issues.push(error.message));
    page.on('console', message => { if (message.type() === 'error') issues.push(message.text()); });
    await page.setViewport({ width: permission ? 390 : 1440, height: 1000 });
    const response = await page.goto(base, { waitUntil: 'networkidle0' });
    assert.equal(response.status(), 200);
    await page.waitForFunction(() => !document.querySelector('#submit').disabled);
    assert.equal(await page.$eval('#permission', input => input.checked), false);
    assert.equal(await page.$eval('#permission', input => input.required), false);
    assert.equal(await page.$eval('.brand img', image => image.complete && image.naturalWidth > 0), true);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    assert.equal(await page.$eval('#review-form', form => form.checkValidity()), false);
    await page.screenshot({ path: `${directory}/${permission ? 'mobile' : 'desktop'}-form.png`, fullPage: true });
    await page.type('#name', `MVS E2E ${permission ? 'Permission' : 'Private'} Test — NOT A CUSTOMER`);
    await page.type('#email', `${tag}-${permission}@example.com`);
    await page.type('#business', 'Synthetic QA record — do not publish');
    await page.type('#testimonial', `SYNTHETIC TEST ONLY: checking the ${permission ? 'optional permission' : 'private feedback'} path. This is not a customer testimonial and must never be published.`);
    if (permission) await page.click('#permission');
    // Browser-required fields and the real permission wording are present.
    const consent = await page.$eval('.check-label span', span => span.textContent);
    assert.ok(consent.includes('This does not include permission to use my photo or company logo.'));
    let payload;
    page.on('request', request => {
      if (request.url().endsWith('/rpc/submit_mvs_testimonial') && request.method() === 'POST') payload = JSON.parse(request.postData());
    });
    await page.click('#submit');
    await page.waitForSelector('#success:not([hidden])', { timeout: 30000 });
    assert.ok(payload);
    const receipt = await page.$eval('#receipt', span => span.textContent);
    assert.equal(receipt, payload.p_id);
    assert.equal(await page.$eval('#review-form', form => form.hidden), true);
    assert.equal(await page.$eval('#permission-summary', (el, expected) => el.textContent.includes(expected), permission ? 'You gave us permission' : 'You have not given permission'), true);
    assert.equal(payload.p_permission, permission);
    assert.deepEqual(issues, []);
    receipts.push({ receipt, payload, consent });
    await page.screenshot({ path: `${directory}/${permission ? 'mobile' : 'desktop'}-success.png`, fullPage: true });
    // A retry with the same UUID and content must return the same receipt, not duplicate the row.
    const retry = await page.evaluate(async payload => {
      const c = window.MVS_REVIEW_CONFIG;
      const response = await fetch(`${c.url}/rest/v1/rpc/submit_mvs_testimonial`, { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: c.anonKey, Authorization: `Bearer ${c.anonKey}` }, body: JSON.stringify(payload) });
      return { status: response.status, body: await response.json() };
    }, payload);
    assert.equal(retry.status, 200);
    assert.equal(retry.body.receipt, receipt);
    console.log(`PASS: ${permission ? 'permission-on / mobile' : 'private / desktop'} submission + server receipt + safe retry`);
    await page.close();
  }

  const page = await browser.newPage();
  await page.setViewport({ width: 320, height: 740 });
  await page.goto(base, { waitUntil: 'networkidle0' });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  await page.type('#name', 'MVS failed-network test');
  await page.type('#email', `${tag}-offline@example.com`);
  await page.type('#testimonial', 'SYNTHETIC FAILURE TEST: this request is intentionally blocked before reaching the server.');
  await page.setRequestInterception(true);
  page.on('request', request => {
    if (request.url().endsWith('/rpc/submit_mvs_testimonial')) request.abort('failed'); else request.continue();
  });
  await page.click('#submit');
  await page.waitForSelector('#error:not([hidden])');
  assert.equal(await page.$eval('#success', el => el.hidden), true);
  assert.equal(await page.$eval('#review-form', el => el.hidden), false);
  assert.equal(await page.$eval('#submit', el => el.disabled), false);
  assert.ok((await page.$eval('#testimonial', el => el.value)).includes('SYNTHETIC FAILURE TEST'));
  await page.screenshot({ path: `${directory}/mobile-network-error.png`, fullPage: true });
  console.log('PASS: 320px layout; network failure does not claim success or erase feedback');
  await page.close();
  await fs.writeFile(`${directory}/receipts.json`, JSON.stringify(receipts, null, 2), { mode: 0o600 });
  console.log(`RECEIPTS_FILE=${directory}/receipts.json`);
} finally {
  await browser.close();
}
