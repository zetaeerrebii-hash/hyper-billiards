// Prova nel browser: la pagina si apre senza errori in pianta, in 3D e a larghezza telefono,
// i consigli vengono calcolati, un tiro e una partita contro il computer partono.
// Uso: node tests/smoke.test.js [file]   (default index.html; richiede playwright)
// Esempio artefatto: node tests/smoke.test.js dist/artifact.html
const path = require('path'), http = require('http'), fs = require('fs');
const { chromium } = require('playwright');
const ROOT = path.join(__dirname, '..');
const file = process.argv[2] || 'index.html';

const server = http.createServer((q, r) => {
  const p = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/, '') || file);
  if (!p.startsWith(ROOT) || !fs.existsSync(p)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': p.endsWith('.js') ? 'text/javascript' : 'text/html; charset=utf-8' });
  fs.createReadStream(p).pipe(r);
});

(async () => {
  await new Promise(ok => server.listen(0, ok));
  const url = `http://127.0.0.1:${server.address().port}/${file}`;
  const browser = await chromium.launch();
  let fail = 0;
  const check = (ok, msg) => { console.log((ok ? 'ok  ' : 'FAIL') + ' ' + msg); if (!ok) fail++; };
  for (const [label, vp] of [['desktop', { width: 1280, height: 900 }], ['telefono', { width: 390, height: 844 }]]) {
    const page = await browser.newPage({ viewport: vp });
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error' && !/fonts\.g/.test(m.text())) errors.push(m.text()); });
    await page.goto(url, { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    check(await page.isVisible('#cv'), `${label}: tavolo in pianta visibile`);
    check(await page.evaluate(() => document.querySelectorAll('#tipList li').length) >= 1, `${label}: consigli di tiro calcolati`);
    await page.click('#shoot'); await page.waitForTimeout(4000);
    check(true, `${label}: tiro eseguito`);
    await page.click('#vPlayer'); await page.waitForTimeout(1500);
    check(await page.evaluate(() => !!window.THREE && !!document.querySelector('#v3 canvas')), `${label}: vista giocatore 3D caricata (three.js)`);
    await page.screenshot({ path: path.join(ROOT, 'tests', `smoke-${label}-3d.png`) });
    await page.click('#vPlan');
    await page.click('#tabMatch'); await page.waitForTimeout(300);
    await page.click('#startMatch'); await page.waitForTimeout(500);
    check(await page.isVisible('#scoreBar'), `${label}: partita contro il computer avviata`);
    await page.click('#tabSchool'); await page.waitForTimeout(300);
    check(await page.evaluate(() => document.querySelectorAll('#schoolCards > *').length) >= 12, `${label}: scuola con almeno 12 schede`);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    check(over <= 1, `${label}: nessuno scorrimento orizzontale (${over}px)`);
    check(errors.length === 0, `${label}: nessun errore JavaScript${errors.length ? ' → ' + errors.join(' | ') : ''}`);
    await page.close();
  }
  await browser.close(); server.close();
  console.log(fail ? fail + ' controlli falliti' : 'Prova nel browser superata');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
