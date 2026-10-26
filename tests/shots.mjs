// node tests/shots.mjs : icons + screenshots + play session. Needs puppeteer-core in /tmp/aitest.
import { createRequire } from 'module'; import { spawn } from 'child_process'; import fs from 'fs';
const req = createRequire('/tmp/aitest/'); const puppeteer = req('puppeteer-core');
const root = new URL('..', import.meta.url).pathname; const out = root + 'shots/'; fs.mkdirSync(out, { recursive: true });
const PORT = 3917; const srv = spawn('node', ['server.js'], { cwd: root, env: { ...process.env, PORT } }); await new Promise(r => setTimeout(r, 500));
const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox'] });
const errors = [];
const URL0 = `http://localhost:${PORT}/`;
if (process.argv.includes('icons')) {
  const pg = await b.newPage(); await pg.goto(URL0); await pg.waitForFunction(() => window.Art);
  for (const sz of [192, 512]) { await pg.setViewport({ width: sz, height: sz }); await pg.evaluate(() => { document.body.innerHTML = `<div style="position:fixed;inset:0;background:radial-gradient(#ffe39a,#e8a54a);display:flex;align-items:flex-end;justify-content:center"><div style="position:absolute;left:4%;bottom:6%;width:44%;height:44%">${Art.anvil()}</div><div style="width:62%;height:92%;margin-left:30%">${Art.caveman({ style: 'skull', tool: 'hammer' })}</div></div>`; }); await pg.screenshot({ path: root + `icons/icon-${sz}.png` }); }
  await pg.close();
}
async function page(w, h) {
  const pg = await b.newPage(); await pg.setViewport({ width: w, height: h, deviceScaleFactor: 2, isMobile: w < h || h < 500, hasTouch: true });
  pg.on('pageerror', e => errors.push(`${w}x${h} PAGEERR ${e.message}`)); pg.on('console', m => { if (m.type() === 'error') errors.push(`${w}x${h} CONSOLE ${m.text()}`); });
  return pg;
}
async function setup(pg) {
  await pg.goto(URL0, { waitUntil: 'networkidle0' });
  await pg.evaluate(() => localStorage.clear()); await pg.reload({ waitUntil: 'networkidle0' });
}
// play session at 390x664: real clicks
const pg = await page(390, 664); await setup(pg);
await pg.screenshot({ path: out + '390x664-class.png' });
await pg.click('[data-act="class"][data-arg="hunter"]');
for (let i = 0; i < 25; i++) { await pg.click('#tTree'); await pg.click('#tRock'); }
for (let i = 0; i < 12; i++) await pg.click('#tAnvil');
await pg.screenshot({ path: out + '390x664-base.png' });
const st1 = await pg.evaluate(() => ({ wood: G.s.wood, stone: G.s.stone, weapons: G.s.weapons, crafted: G.s.stats.crafted }));
console.log('after taps', JSON.stringify(st1));
// pause auto-hunt loot popups for screenshot stability
await pg.evaluate(() => { G.s.hunt.auto = false; G.s.customers = []; G.spawnCustomer(); G.spawnCustomer(); G.spawnCustomer(); });
await pg.click('[data-act="tab"][data-arg="shop"]'); await new Promise(r => setTimeout(r, 300));
await pg.screenshot({ path: out + '390x664-shop.png' });
const before = await pg.evaluate(() => G.s.coins);
await pg.click('[data-act="sellAll"]'); const after = await pg.evaluate(() => G.s.coins); console.log('sell coins', before, '->', after);
await pg.evaluate(() => { G.s.coins += 500; G.s.gems += 30; });
await pg.click('[data-act="tab"][data-arg="helpers"]'); await pg.click('[data-act="chest"][data-arg="coin"]'); await new Promise(r => setTimeout(r, 300));
await pg.screenshot({ path: out + '390x664-chest.png' }); await pg.click('#modal .close');
await pg.click('[data-act="chest"][data-arg="gem"]'); await pg.click('#modal .close');
await pg.screenshot({ path: out + '390x664-helpers.png' });
await pg.click('[data-act="tab"][data-arg="upgrades"]'); await pg.screenshot({ path: out + '390x664-upgrades.png' });
await pg.click('[data-act="tab"][data-arg="hunt"]'); await pg.evaluate(() => { G.s.hunt.auto = true; }); await new Promise(r => setTimeout(r, 2500));
await pg.screenshot({ path: out + '390x664-hunt.png' });
// fast-forward hunting to first boss via game ticks (handling loot like a player)
const res = await pg.evaluate(() => { let bosses = 0; for (let i = 0; i < 20000 && bosses < 2; i++) { G.tick(0.1); for (const e of G.events) if (e.type === 'win' && e.boss) bosses++; G.events.length = 0; while (G.s.loot.length) { const g = G.s.loot[0]; G.gearScore(g) > G.gearScore(G.s.hero.gear[g.slot]) ? G.equip(g.id) : G.dropLoot(g.id); } while (G.s.hero.pts) G.allocate('dex'); if (G.s.energy < 1) G.s.energy = 50; } return { bosses, area: G.s.hunt.area, stage: G.s.hunt.stage, lv: G.s.hero.lv, gear: Object.keys(G.s.hero.gear) }; });
console.log('hunt ff', JSON.stringify(res));
// force a loot popup screenshot
await pg.evaluate(() => { G.s.loot.push(G.makeGear(12, true)); }); await new Promise(r => setTimeout(r, 400));
await pg.screenshot({ path: out + '390x664-loot.png' }); await pg.click('[data-act="equip"]');
await pg.evaluate(() => { G.s.hunt.auto = false; });
await pg.click('[data-act="tab"][data-arg="hero"]'); await pg.screenshot({ path: out + '390x664-hero.png' });
await pg.click('#btnSettings'); await pg.screenshot({ path: out + '390x664-settings.png' }); await pg.click('#modal .close');
// offline summary
await pg.evaluate(() => { G.s.last = Date.now() - 2 * 3600 * 1000; localStorage.setItem(G.KEY, JSON.stringify(G.s)); });
await pg.evaluate(() => { window.__noSave = 1; });
const save = await pg.evaluate(() => JSON.stringify({ ...G.s, last: Date.now() - 2 * 3600 * 1000 }));
await pg.evaluate((sv) => { clearInterval(UI.loop); window.G.save = () => {}; localStorage.setItem('agesIdleRpg.save', sv); }, save);
await pg.reload({ waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 400));
await pg.screenshot({ path: out + '390x664-away.png' });
const saveState = await pg.evaluate(() => JSON.stringify(G.s));
await pg.close();
// sizes: each tab
for (const [w, h] of [[390, 664], [360, 640], [844, 340], [740, 360], [1280, 800]]) {
  const p = await page(w, h); await p.goto(URL0, { waitUntil: 'networkidle0' });
  await p.evaluate((sv) => { const s = JSON.parse(sv); s.last = Date.now(); s.hunt.auto = true; localStorage.setItem('agesIdleRpg.save', JSON.stringify(s)); }, saveState);
  await p.reload({ waitUntil: 'networkidle0' }); await new Promise(r => setTimeout(r, 300));
  await p.evaluate(() => { G.s.customers = []; G.spawnCustomer(); G.spawnCustomer(); G.spawnCustomer(); G.s.settings.autoSellWorse = true; });
  const tabsList = (w <= 400 || process.argv.includes('all')) ? ['base', 'shop', 'hunt', 'helpers', 'upgrades', 'hero'] : ['base', 'shop', 'hunt', 'hero'];
  for (const t of tabsList) { await p.evaluate(() => { UI.closeModal(); G.s.loot = []; }); await p.click(`#nav [data-arg="${t}"]`); await new Promise(r => setTimeout(r, t === 'hunt' ? 1200 : 200)); await p.evaluate(() => { G.s.loot = []; }); await p.screenshot({ path: out + `${w}x${h}-${t}.png` });
    const ov = await p.evaluate(() => { const bad = []; const vw = innerWidth, vh = innerHeight; for (const el of document.querySelectorAll('#top *, #nav *, .panel > *, .full > *')) { const r = el.getBoundingClientRect(); if (r.width && (r.right > vw + 1 || r.left < -1)) bad.push(el.className || el.tagName); } return { bad: bad.slice(0, 5), docScroll: document.documentElement.scrollHeight > vh }; });
    if (ov.bad.length || ov.docScroll) console.log(w, h, t, 'overflow', JSON.stringify(ov)); }
  await p.click('#btnSettings'); await p.screenshot({ path: out + `${w}x${h}-settings.png` });
  await p.close();
}
console.log('ERRORS', errors.length ? errors : 'none');
await b.close(); srv.kill();
