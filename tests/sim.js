// Headless balance sim: a lazy player bot. node tests/sim.js [minutes]
global.btoa = s => Buffer.from(s, 'binary').toString('base64'); global.atob = s => Buffer.from(s, 'base64').toString('binary');
const D = require('../js/data.js'); const G = require('../js/game.js');
G.s = G.fresh(); G.chooseClass(process.argv[3] || 'warrior');
const mins = +process.argv[2] || 90; const marks = {};
for (let t = 0; t < mins * 60; t++) {
  // 2 taps per second each kind during first 20 min, then mostly idle
  const taps = t < 1200 ? 2 : 0.2;
  for (let k = 0; k < taps; k++) { G.chop(); G.mine(); G.tapAnvil(); G.sellFirstPossible(); }
  const best = G.unlocked().slice(-1)[0]; G.s.sel = best.id;
  G.tick(1);
  for (const g of G.s.loot.slice()) { const cur = G.s.hero.gear[g.slot]; if (G.gearScore(g) > G.gearScore(cur)) G.equip(g.id); else G.dropLoot(g.id); }
  const main = G.cls().main; while (G.s.hero.pts) { G.allocate(main); if (G.s.hero.pts) G.allocate('vit'); if (G.s.hero.pts) G.allocate('agi'); }
  if (G.s.helpers.length < 8) { G.openChest(true); G.openChest(false); }
  G.upgradeAnvil();
  const ups = D.UPGRADES.slice().sort((a, b) => G.upgCost(a) - G.upgCost(b)); for (const u of ups) if (G.upgCost(u) < G.s.coins * 0.5) G.buyUpgrade(u.id);
  for (const e of G.events) { if (e.type === 'win' && e.boss && !marks[e.name] && (marks[e.name]=1)) { console.log(`${(t/60).toFixed(1)}m boss ${e.name} lv${G.s.hero.lv} coins ${Math.round(G.s.coins)} anvil ${G.s.anvil} helpers ${G.s.helpers.length}`); } }
  G.events.length = 0;
  if (t % 600 === 0) console.log(`${t/60}m area${G.s.hunt.area} st${G.s.hunt.stage} lv${G.s.hero.lv} coins ${Math.round(G.s.coins)} sold ${G.s.stats.sold} anvil ${G.s.anvil} atk ${G.heroStats().atk} hp ${G.heroStats().hp} energy ${G.s.energy|0}`);
}
const off = G.applyOffline(3600); console.log('offline 1h', off);
const ex = G.exportSave(); G.importSave(ex); console.log('export/import ok', ex.length);
