// Pure game logic (no DOM). Exposed as window.G so tests can drive it.
(function () {
  const D = (typeof window!=="undefined" && window.GameData) || require('./data.js');
  const R = Math.random;
  const G = { s: null, events: [], rng: R };
  const rnd = () => G.rng();
  const emit = (type, data = {}) => G.events.push({ type, ...data });
  const age = () => D.AGES[G.s.age];

  G.fresh = () => ({
    v: 1, cls: null, age: 0, coins: 25, gems: 30, energy: 50, wood: 0, stone: 0,
    weapons: {}, sel: 'club', anvil: 1, job: null, upg: {}, customers: [], nextCust: 2, custId: 1, sellAcc: 0,
    helpers: [], hid: 1, chests: 0,
    hero: { lv: 1, xp: 0, pts: 0, stats: { str: 0, dex: 0, int: 0, vit: 0, agi: 0, luck: 0 }, gear: {} },
    hunt: { area: 0, stage: 1, maxArea: 0, finalBeaten: false, auto: true, fight: null, rest: 0 },
    loot: [], gid: 1, last: Date.now(), stats: { sold: 0, crafted: 0, kills: 0, earned: 0 },
    settings: { autoSellWorse: true },
  });

  // ---------- derived ----------
  const U = (id) => G.s.upg[id] || 0;
  G.U = U;
  G.resCap = () => Math.floor(50 * Math.pow(1.5, U('storage')));
  G.shelfCap = () => 10 + 4 * U('racks');
  G.shelfCount = () => Object.values(G.s.weapons).reduce((a, b) => a + b, 0);
  G.queueMax = () => 3 + Math.floor(U('sign') / 2);
  G.custInterval = () => 6 * Math.pow(0.88, U('sign'));
  G.priceMul = () => (1 + 0.3 * (G.s.anvil - 1)) * (1 + 0.15 * U('counter'));
  G.price = (w) => Math.round(w.price * G.priceMul());
  G.craftSpeed = () => 1 + 0.15 * U('hands');
  G.unlocked = () => age().weapons.filter(w => w.lv <= G.s.anvil);
  G.weapon = (id) => age().weapons.find(w => w.id === id);
  G.anvilCost = () => Math.round(80 * Math.pow(2.6, G.s.anvil - 1));
  G.upgCost = (u) => Math.round(u.base * Math.pow(u.g, U(u.id)));
  G.chestCost = () => Math.round(80 * Math.pow(1.3, Math.min(G.s.chests, 25)));
  G.GEM_CHEST = 25;
  G.offlineCapH = () => 4 + U('fire');
  G.helperPower = (task) => G.s.helpers.filter(h => h.task === task).reduce((a, h) => a + D.RARITIES[h.r].power, 0);
  G.tapWood = () => 1 + U('axe');
  G.tapStone = () => 1 + U('pick');

  // ---------- base: gather ----------
  G.addRes = (k, n) => { const cap = G.resCap(); const before = G.s[k]; G.s[k] = Math.min(cap, G.s[k] + n); return G.s[k] - before; };
  G.chop = () => { const n = G.addRes('wood', G.tapWood()); emit('gain', { k: 'wood', n }); return n; };
  G.mine = () => { const n = G.addRes('stone', G.tapStone()); emit('gain', { k: 'stone', n }); return n; };

  // ---------- crafting ----------
  G.canAfford = (w) => G.s.wood >= w.wood && G.s.stone >= w.stone;
  // Crafting follows customer orders: front of queue first, skipping wants already
  // covered by shelf stock (or the job on the anvil). Falls back to the selected /
  // best affordable recipe only when every order is covered or the queue is empty.
  G.nextOrder = () => {
    const have = { ...G.s.weapons }; if (G.s.job) have[G.s.job.id] = (have[G.s.job.id] || 0) + 1;
    for (const c of G.s.customers) {
      const w = G.weapon(c.want); if (!w || w.lv > G.s.anvil) continue;
      if (have[c.want] > 0) { have[c.want]--; continue; }
      return { w, cid: c.id };
    }
    return null;
  };
  G.need = (w) => ({ wood: Math.max(0, Math.ceil(w.wood - G.s.wood)), stone: Math.max(0, Math.ceil(w.stone - G.s.stone)) });
  G.needText = (w) => { const n = G.need(w); const p = []; if (n.wood) p.push(`${n.wood} more wood`); if (n.stone) p.push(`${n.stone} more stone`); return p.length ? 'Need ' + p.join(' and ') : ''; };
  G.fallbackRecipe = () => { const w = G.weapon(G.s.sel); return w && w.lv <= G.s.anvil && G.canAfford(w) ? w : G.unlocked().slice().reverse().find(G.canAfford); };
  // What the anvil will craft next: { w, order: bool, blocked: bool }
  G.craftPlan = () => {
    if (G.s.job) return { w: G.weapon(G.s.job.id), order: false, blocked: false, busy: true };
    const o = G.nextOrder();
    if (o) return { w: o.w, order: true, cid: o.cid, blocked: !G.canAfford(o.w) };
    const w = G.fallbackRecipe(); return w ? { w, order: false, blocked: false } : null;
  };
  G.startJob = (forceId) => {
    if (G.s.job) return true;
    if (G.shelfCount() >= G.shelfCap()) return false;
    let w;
    if (forceId) { w = G.weapon(forceId); if (!w || w.lv > G.s.anvil || !G.canAfford(w)) return false; }
    else { const p = G.craftPlan(); if (!p || p.blocked) return false; w = p.w; } // unaffordable order: wait for materials
    G.s.wood -= w.wood; G.s.stone -= w.stone;
    G.s.job = { id: w.id, p: 0 };
    return true;
  };
  G.craftWork = (sec) => {
    if (!G.s.job && !G.startJob()) return false;
    const j = G.s.job; j.p += sec * G.craftSpeed();
    const w = G.weapon(j.id);
    if (j.p >= w.time) {
      G.s.weapons[w.id] = (G.s.weapons[w.id] || 0) + 1; G.s.stats.crafted++; G.s.job = null;
      emit('crafted', { id: w.id });
      const left = j.p - w.time; if (left > 0.01 && G.startJob()) G.s.job.p = Math.min(left, 1);
    }
    return true;
  };
  G.tapAnvil = () => G.craftWork(1);
  G.upgradeAnvil = () => {
    if (G.s.anvil >= age().anvilMax) return false;
    const c = G.anvilCost(); if (G.s.coins < c) return false;
    G.s.coins -= c; G.s.anvil++; emit('anvil'); return true;
  };

  // ---------- shop ----------
  G.spawnCustomer = () => {
    const ul = G.unlocked(); if (!ul.length) return; const inStock = ul.filter(w => G.s.weapons[w.id] > 0);
    const pool = inStock.length && rnd() < 0.75 ? inStock : ul;
    const w = pool[Math.floor(rnd() * pool.length)];
    const look = Math.floor(rnd() * 6);
    G.s.customers.push({ id: G.s.custId++, want: w.id, wait: 0, look });
  };
  G.CUST_PATIENCE = 45;
  G.sell = (i) => {
    const c = G.s.customers[i]; if (!c) return 0;
    if (!(G.s.weapons[c.want] > 0)) { emit('nostock', { i }); return 0; }
    G.s.weapons[c.want]--; const p = G.price(G.weapon(c.want));
    G.s.coins += p; G.s.stats.sold++; G.s.stats.earned += p; G.s.customers.splice(i, 1);
    emit('sold', { p, cid: c.id }); return p;
  };
  G.sellFirstPossible = () => { const i = G.s.customers.findIndex(c => G.s.weapons[c.want] > 0); return i >= 0 ? G.sell(i) : 0; };

  // ---------- helpers ----------
  G.rollRarity = (gem) => { const x = rnd(); if (gem) return x < 0.62 ? 1 : x < 0.92 ? 2 : 3; return x < 0.72 ? 0 : x < 0.95 ? 1 : x < 0.995 ? 2 : 3; };
  G.HELPER_MAX = 12;
  G.openChest = (gem) => {
    if (G.s.helpers.length >= G.HELPER_MAX) return null;
    if (gem) { if (G.s.gems < G.GEM_CHEST) return null; G.s.gems -= G.GEM_CHEST; }
    else { const c = G.chestCost(); if (G.s.coins < c) return null; G.s.coins -= c; G.s.chests++; }
    const r = G.rollRarity(gem);
    const h = { id: G.s.hid++, name: D.HELPER_NAMES[Math.floor(rnd() * D.HELPER_NAMES.length)], r, task: null, look: Math.floor(rnd() * 6) };
    G.s.helpers.push(h);
    // auto-assign to a free task
    for (const t of ['chop', 'mine', 'craft', 'sell']) if (G.taskCount(t) < 2) { h.task = t; break; }
    emit('helper', { h }); return h;
  };
  G.taskCount = (t) => G.s.helpers.filter(h => h.task === t).length;
  G.assign = (id, task) => {
    const h = G.s.helpers.find(x => x.id === id); if (!h) return false;
    if (task && h.task !== task && G.taskCount(task) >= 2) return false;
    h.task = task || null; return true;
  };
  G.release = (id) => {
    const i = G.s.helpers.findIndex(x => x.id === id); if (i < 0) return 0;
    const h = G.s.helpers[i]; const val = Math.round(30 * D.RARITIES[h.r].power);
    G.s.helpers.splice(i, 1); G.s.coins += val; return val;
  };

  // ---------- upgrades ----------
  G.buyUpgrade = (id) => {
    const u = D.UPGRADES.find(x => x.id === id); if (!u || U(id) >= u.max) return false;
    const c = G.upgCost(u); if (G.s.coins < c) return false;
    G.s.coins -= c; G.s.upg[id] = U(id) + 1; return true;
  };

  // ---------- hero ----------
  G.cls = () => D.CLASSES[G.s.cls || 'warrior'];
  G.gearSum = (k) => Object.values(G.s.hero.gear).reduce((a, g) => a + (g ? g[k] || 0 : 0), 0);
  G.heroStats = () => {
    const h = G.s.hero, st = h.stats, c = G.cls();
    const main = st[c.main];
    const off = st.str + st.dex + st.int - main;
    const atk = Math.round((8 + 3 * main + 0.5 * off + 2 * (h.lv - 1) + G.gearSum('atk')) * Math.pow(1.035, h.lv - 1));
    const hp = Math.round((100 + 25 * st.vit + 14 * (h.lv - 1) + G.gearSum('hp')) * Math.pow(1.035, h.lv - 1) * (c.hp || 1));
    const spd = 0.8 * (1 + 0.03 * st.agi + G.gearSum('spd') / 100 + (c.spd || 0));
    const crit = Math.min(0.75, (0.05 + 0.01 * st.luck + G.gearSum('crit') / 100) * (c.critMul || 1));
    const critDmg = c.critMul ? 2.2 : 1.6;
    const combo = Math.min(0.6, G.gearSum('combo') / 100 + 0.004 * st.dex);
    return { atk, hp, spd, crit, critDmg, combo, dr: c.dr || 0, splash: c.splash || 0, heal: c.heal || 0 };
  };
  G.xpNeed = (lv) => Math.round(25 * Math.pow(1.22, lv - 1));
  G.addXp = (n) => {
    const h = G.s.hero; h.xp += n;
    while (h.xp >= G.xpNeed(h.lv)) { h.xp -= G.xpNeed(h.lv); h.lv++; h.pts += 3; G.s.gems += 3; G.s.energy = Math.max(G.s.energy, G.energyMax()); emit('levelup', { lv: h.lv }); }
  };
  G.allocate = (k, n = 1) => { const h = G.s.hero; n = Math.min(n, h.pts); if (n <= 0 || !(k in h.stats)) return false; h.stats[k] += n; h.pts -= n; return true; };
  G.energyMax = () => 50;

  // ---------- gear ----------
  G.makeGear = (lv, boss) => {
    const slot = D.GEAR_SLOTS[Math.floor(rnd() * D.GEAR_SLOTS.length)];
    const x = rnd(); let r = x < 0.68 ? 0 : x < 0.9 ? 1 : x < 0.985 ? 2 : 3; if (boss) r = Math.min(3, r + 1);
    const base = Math.pow(1.15, lv), mul = Math.pow(D.RARITIES[r].power, 0.6), v = () => 0.8 + rnd() * 0.4;
    const g = { id: G.s.gid++, slot, lv, r, hp: 0, atk: 0, spd: 0, combo: 0, crit: 0 };
    if (slot === 'weapon') g.atk = Math.round(4 * base * mul * v());
    if (slot === 'ring') { g.atk = Math.round(2 * base * mul * v()); g.crit = Math.round((1 + rnd() * 3) * (r + 1)); }
    if (slot === 'armour') g.hp = Math.round(22 * base * mul * v());
    if (slot === 'helmet') { g.hp = Math.round(14 * base * mul * v()); g.atk = Math.round(1 * base * mul * v()); }
    if (slot === 'necklace') { g.hp = Math.round(10 * base * mul * v()); g.atk = Math.round(1.2 * base * mul * v()); }
    const extras = ['spd', 'combo', 'crit']; const n = r; // rarer = more secondary stats
    for (let i = 0; i < n; i++) { const k = extras[Math.floor(rnd() * 3)]; g[k] += Math.round(1 + rnd() * 2 * (r + 1)); }
    return g;
  };
  G.gearScore = (g) => g ? g.atk * 5 + g.hp + (g.spd + g.combo + g.crit) * (2 + g.lv * 0.6) : 0;
  G.gearValue = (g) => Math.round(6 * Math.pow(1.13, g.lv) * Math.pow(D.RARITIES[g.r].power, 0.6));
  G.equip = (gid) => {
    const i = G.s.loot.findIndex(g => g.id === gid); if (i < 0) return false;
    const g = G.s.loot.splice(i, 1)[0]; const old = G.s.hero.gear[g.slot];
    if (old) { G.s.coins += G.gearValue(old); }
    G.s.hero.gear[g.slot] = g; return true;
  };
  G.dropLoot = (gid) => {
    const i = G.s.loot.findIndex(g => g.id === gid); if (i < 0) return 0;
    const g = G.s.loot.splice(i, 1)[0]; const v = G.gearValue(g); G.s.coins += v; return v;
  };

  // ---------- hunting ----------
  G.monIdx = () => G.s.hunt.area * 10 + G.s.hunt.stage - 1;
  G.makeMonster = () => {
    const H = G.s.hunt, ar = age().areas[H.area], boss = H.stage === 10;
    const m = boss ? ar.boss : ar.monsters[Math.floor(rnd() * ar.monsters.length)];
    const i = G.monIdx();
    let hp = 40 * Math.pow(1.215, i), atk = 6 * Math.pow(1.185, i);
    if (boss) { hp *= 4; atk *= 1.5; if (m.final) { hp *= 1.5; atk *= 1.2; } }
    return { ...m, boss, hp: Math.round(hp), maxHp: Math.round(hp), atk: Math.round(atk), spd: boss ? 0.6 : 0.7, lv: i + 1 };
  };
  G.startFight = () => {
    const H = G.s.hunt; if (H.fight) return true;
    if (G.s.loot.length) return false; // waiting for loot decision
    if (G.s.energy < 1) return false;
    G.s.energy -= 1;
    const hs = G.heroStats();
    H.fight = { mon: G.makeMonster(), php: hs.hp, pmax: hs.hp, pt: 0, mt: 0.3 };
    emit('fightstart'); return true;
  };
  G.fightStep = (dt) => {
    const H = G.s.hunt, f = H.fight; if (!f) return;
    const hs = G.heroStats(), m = f.mon;
    f.pt += dt * hs.spd; f.mt += dt * m.spd;
    while (f.pt >= 1 && m.hp > 0 && f.php > 0) {
      f.pt -= 1;
      const hits = rnd() < hs.combo ? 2 : 1;
      for (let k = 0; k < hits && m.hp > 0; k++) {
        const crit = rnd() < hs.crit; let d = hs.atk * (crit ? hs.critDmg : 1) * (1 + hs.splash) * (0.9 + rnd() * 0.2);
        d = Math.max(1, Math.round(d)); m.hp = Math.max(0, m.hp - d);
        if (hs.heal) f.php = Math.min(f.pmax, f.php + Math.round(f.pmax * hs.heal));
        emit('hit', { who: 'mon', d, crit, combo: k > 0 });
      }
    }
    while (f.mt >= 1 && m.hp > 0 && f.php > 0) {
      f.mt -= 1; const d = Math.max(1, Math.round(m.atk * (1 - hs.dr) * (0.9 + rnd() * 0.2)));
      f.php = Math.max(0, f.php - d); emit('hit', { who: 'hero', d });
    }
    if (m.hp <= 0) G.winFight(); else if (f.php <= 0) G.loseFight();
  };
  G.winFight = () => {
    const H = G.s.hunt, m = H.fight.mon, i = G.monIdx(), ag = age();
    let coins = Math.round(10 * Math.pow(1.16, i) * (m.boss ? 5 : 1));
    const xp = Math.round(6 * Math.pow(1.13, i) * (m.boss ? 5 : 1));
    G.s.coins += coins; G.s.stats.kills++; H.fight = null;
    let gems = 0, drop = null;
    if (m.boss || rnd() < 0.3) {
      drop = G.makeGear(i + 1, m.boss);
      const cur = G.s.hero.gear[drop.slot];
      if (G.s.settings.autoSellWorse && cur && G.gearScore(drop) <= G.gearScore(cur)) { coins += G.gearValue(drop); G.s.coins += G.gearValue(drop); drop.autoSold = true; }
      else G.s.loot.push(drop);
    }
    G.addXp(xp);
    let unlocked = null, final = false;
    if (m.boss) {
      gems = 10 * (H.area + 1); G.s.gems += gems;
      if (H.area < ag.areas.length - 1) { H.area++; H.maxArea = Math.max(H.maxArea, H.area); unlocked = ag.areas[H.area].name; H.stage = 1; }
      else { final = !H.finalBeaten; H.finalBeaten = true; H.stage = 1; }
    } else H.stage++;
    emit('win', { coins, xp, gems, drop, boss: m.boss, unlocked, final, name: m.name });
  };
  G.loseFight = () => {
    const H = G.s.hunt; H.fight = null; H.stage = Math.max(1, H.stage - 1); H.rest = 2;
    emit('lose');
  };
  G.setArea = (a) => { const H = G.s.hunt; if (a > H.maxArea || a < 0 || H.fight) return false; H.area = a; H.stage = 1; return true; };

  // ---------- main tick ----------
  G.tick = (dt, offline) => {
    const s = G.s; if (!s.cls) return;
    s.energy = Math.min(G.energyMax(), s.energy + dt / 5);
    const chopP = G.helperPower('chop'), mineP = G.helperPower('mine'), craftP = G.helperPower('craft'), sellP = G.helperPower('sell');
    if (chopP) G.addRes('wood', chopP * 0.5 * (1 + 0.25 * U('axe')) * dt);
    if (mineP) G.addRes('stone', mineP * 0.5 * (1 + 0.25 * U('pick')) * dt);
    if (craftP) G.craftWork(craftP * 0.5 * dt);
    // customers
    s.nextCust -= dt;
    if (s.nextCust <= 0) { s.nextCust = G.custInterval() * (0.7 + rnd() * 0.6); if (s.customers.length < G.queueMax()) G.spawnCustomer(); }
    for (const c of s.customers) c.wait += dt;
    const before = s.customers.length; s.customers = s.customers.filter(c => c.wait < G.CUST_PATIENCE);
    if (s.customers.length < before) emit('left');
    if (sellP) { s.sellAcc += sellP * 0.35 * dt; while (s.sellAcc >= 1) { s.sellAcc -= 1; if (!G.sellFirstPossible()) { s.sellAcc = 0; break; } } }
    // hunt
    if (!offline) {
      const H = s.hunt;
      if (H.rest > 0) H.rest -= dt;
      else if (H.fight) G.fightStep(dt);
      else if (H.auto) G.startFight();
    }
  };

  G.applyOffline = (sec) => {
    const capped = Math.min(sec, G.offlineCapH() * 3600);
    if (capped < 30) return null;
    const s = G.s, b = { wood: s.wood, stone: s.stone, coins: s.coins, crafted: s.stats.crafted, sold: s.stats.sold };
    const evs = G.events.length;
    let t = capped; while (t > 0) { const d = Math.min(1, t); G.tick(d, true); t -= d; }
    G.events.length = evs;
    return { sec: capped, real: sec, crafted: s.stats.crafted - b.crafted, sold: s.stats.sold - b.sold, coins: s.coins - b.coins, wood: s.wood - b.wood, stone: s.stone - b.stone };
  };

  // ---------- save ----------
  G.KEY = 'agesIdleRpg.save';
  G.serialize = () => { G.s.last = Date.now(); return JSON.stringify(G.s); };
  G.exportSave = () => btoa(unescape(encodeURIComponent(G.serialize())));
  G.load = (json) => { const f = G.fresh(), d = JSON.parse(json); G.s = Object.assign(f, d); G.s.hero = Object.assign(f.hero, d.hero || {}); G.s.hunt = Object.assign(f.hunt, d.hunt || {}); G.s.hunt.fight = null; return G.s; };
  G.importSave = (txt) => G.load(decodeURIComponent(escape(atob(txt.trim()))));
  G.save = () => { try { localStorage.setItem(G.KEY, G.serialize()); } catch (e) {} };
  G.chooseClass = (c) => {
    G.s.cls = c; const main = D.CLASSES[c].main;
    G.s.hero.stats[main] = 2;
  };

  G.s = G.fresh();
  if (typeof window !== 'undefined') window.G = G; else module.exports = G;
})();
