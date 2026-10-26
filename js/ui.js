// DOM layer: renders tabs from G.s, routes taps to G actions.
(function () {
  const D = window.GameData, A = window.Art, $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const SUF = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
  const fmt = (n) => { n = Math.floor(n); if (n < 1000) return String(n); let i = 0; let x = n; while (x >= 1000 && i < SUF.length - 1) { x /= 1000; i++; } return (x < 10 ? x.toFixed(2) : x < 100 ? x.toFixed(1) : Math.floor(x)) + SUF[i]; };
  const LOOKS = [{ hair: '#4a2a14', style: 'afro', outfit: '#d9a441' }, { hair: '#7a3a1a', style: 'long', outfit: '#c9b25a' }, { hair: '#2a1a0a', style: 'bun', outfit: '#e07a3a' }, { hair: '#9a5a2a', style: 'afro', outfit: '#8ab04a' }, { hair: '#3a2a2a', style: 'long', outfit: '#d07a9a', skin: '#e0a878' }, { hair: '#5a3a1a', style: 'bun', outfit: '#7ab0d0', skin: '#c88a5a' }];
  const ui = { tab: 'base', sig: '', fxSeen: 0, modalLock: false, queue: [] };
  window.UI = ui;
  const s = () => G.s;
  const heroArt = (extra = {}) => { const c = G.cls(); return A.caveman({ style: c.style, outfit: c.outfit, tool: c.tool, ...extra }); };

  // ---------- floating text / toasts ----------
  function floatAt(x, y, text, cls = '') { const el = document.createElement('div'); el.className = 'float ' + cls; el.textContent = text; const r = $('#app').getBoundingClientRect(); el.style.left = (x - r.left) + 'px'; el.style.top = (y - r.top) + 'px'; $('#fx').appendChild(el); setTimeout(() => el.remove(), 900); }
  function floatOn(sel, text, cls) { const el = typeof sel === 'string' ? $(sel) : sel; if (!el) return; const r = el.getBoundingClientRect(); floatAt(r.left + r.width / 2 + (Math.random() * 30 - 15), r.top + r.height * 0.3, text, cls); }
  function toast(t) { const el = document.createElement('div'); el.textContent = t; $('#toast').appendChild(el); setTimeout(() => el.remove(), 2200); }
  ui.toast = toast;

  // ---------- modal ----------
  function openModal(title, html, opts = {}) { $('#mTitle').textContent = title; $('#mBody').innerHTML = html; $('#modal').hidden = false; $('.close', $('#modal')).style.display = opts.noClose ? 'none' : ''; ui.modal = opts.id || title; }
  function closeModal() { if (ui.modal === 'class') return; $('#modal').hidden = true; ui.modal = null; nextQueued(); }
  ui.openModal = openModal; ui.closeModal = closeModal;
  function queueModal(fn) { ui.queue.push(fn); if (!ui.modal) nextQueued(); }
  function nextQueued() { const f = ui.queue.shift(); if (f) f(); else if (s().loot.length && ui.modal == null) lootModal(); }

  // ---------- tabs ----------
  const tabs = {};
  tabs.base = {
    sig: () => [s().anvil, s().sel, helperSig('chop') + helperSig('mine') + helperSig('craft')].join('|'),
    build() {
      const h = (t) => s().helpers.filter(x => x.task === t);
      const hfig = (x, l, b, w = 13) => `<div style="position:absolute;left:${l}%;bottom:${b}%;width:${w}%;height:34%;pointer-events:none">${A.caveman({ ...LOOKS[x.look], tool: x.task === 'chop' ? 'axe' : x.task === 'mine' ? 'pick' : 'hammer', flip: x.task === 'mine' })}</div>`;
      const scene = `<div class="scene base-scene" id="scene">
        <div class="bd-forest">${A.forest(3)}</div>
        <div class="deco" style="left:6%;top:56%;width:7%;height:6%">${A.tuft()}</div><div class="deco" style="left:60%;top:84%;width:7%;height:6%">${A.tuft()}</div><div class="deco" style="left:88%;top:80%;width:7%;height:6%">${A.tuft('#7ab83a')}</div>
        <div class="deco" style="left:20%;top:90%;width:6%;height:5%">${A.pebble()}</div><div class="deco" style="left:92%;top:40%;width:6%;height:5%">${A.pebble()}</div>
        <div class="deco" style="left:82%;top:84%;width:16%;height:15%">${A.logs()}</div>
        <div class="tap" data-act="chop" id="tTree" style="left:22%;top:-2%;width:34%;height:50%">${A.tree()}<span class="lbl">Tap: chop</span></div>
        <div class="tap" data-act="mine" id="tRock" style="left:66%;top:44%;width:32%;height:30%">${A.rock()}<span class="lbl">Tap: mine</span></div>
        <div class="deco" style="left:1%;top:44%;width:15%;height:11%">${A.bush()}</div>
        <div style="position:absolute;left:4%;top:80%;width:16%;height:16%">${A.stump()}</div>
        <div class="tap" data-act="anvil" id="tAnvil" style="left:28%;top:62%;width:28%;height:30%">${A.anvil()}<div class="prog"><i id="craftProg"></i></div><span class="lbl">Tap: craft</span></div>
        <div style="position:absolute;left:50%;top:44%;width:17%;height:54%;pointer-events:none">${heroArt({ tool: 'hammer' })}</div>
        ${h('chop').map((x, i) => hfig(x, 2 + i * 13, 52)).join('')}
        ${h('mine').map((x, i) => hfig(x, 74 + i * 12, 64, 12)).join('')}
        ${h('craft').map((x, i) => hfig(x, 14 + i * 4, 60 - i * 6, 12)).join('')}
      </div>`;
      const ul = D.AGES[s().age].weapons;
      const recipes = ul.map(w => { const lk = w.lv > s().anvil; return `<button class="recipe ${s().sel === w.id ? 'sel' : ''} ${lk ? 'locked' : ''}" data-act="sel" data-arg="${w.id}"><span class="cnt" data-w="${w.id}">0</span><div class="ic">${A.weapon(w.id)}</div><b>${w.name}</b>${lk ? `Anvil Lv ${w.lv}` : `${w.wood}🪵 ${w.stone}🪨 · ${fmt(G.price(w))}c`}</button>`; }).join('');
      const max = s().anvil >= D.AGES[s().age].anvilMax;
      return scene + `<div class="panel">
        <div class="res"><div class="pill">${A.wood()}<b id="rWood"></b></div><div class="pill">${A.stone()}<b id="rStone"></b></div><div class="pill"><span>🗡</span><b id="rShelf"></b></div></div>
        <div class="card" style="margin-top:8px"><div class="flex"><div style="width:44px;height:40px">${A.anvil()}</div><div class="grow"><b>Stone Anvil Lv ${s().anvil}</b><div class="small">Weapons sell for x${(1 + 0.3 * (s().anvil - 1)).toFixed(1)}. Higher levels unlock recipes.</div></div>
        ${max ? '<span class="small">MAX</span>' : `<button class="btn gold" data-act="anvilUp" data-cost="${G.anvilCost()}">${A.coin()}${fmt(G.anvilCost())}</button>`}</div></div>
        <h3>Recipes <span class="small">(helpers craft the selected one)</span></h3><div class="recipes">${recipes}</div></div>`;
    },
    update() {
      $('#rWood').textContent = `${fmt(s().wood)}/${fmt(G.resCap())}`; $('#rStone').textContent = `${fmt(s().stone)}/${fmt(G.resCap())}`; $('#rShelf').textContent = `${G.shelfCount()}/${G.shelfCap()}`;
      const j = s().job; $('#craftProg').style.width = j ? Math.min(100, j.p / G.weapon(j.id).time * 100) + '%' : '0%';
      $$('[data-w]').forEach(e => e.textContent = s().weapons[e.dataset.w] || 0);
    },
  };
  function helperSig(t) { return s().helpers.filter(h => h.task === t).map(h => h.id).join(','); }

  tabs.shop = {
    sig: () => s().customers.map(c => c.id).join(',') + '|' + helperSig('sell') + '|' + s().anvil,
    build() {
      const cs = s().customers.map((c, i) => `<div class="cust" data-act="sell" data-arg="${c.id}" id="c${c.id}"><div class="bub" data-want="${c.want}">${A.weapon(c.want)}</div><div class="fig">${A.caveman({ ...LOOKS[c.look] })}</div><div class="pat"><i data-pat="${c.id}"></i></div></div>`).join('');
      const sellers = s().helpers.filter(h => h.task === 'sell');
      const scene = `<div class="scene shop-scene" id="scene"><div class="bd-forest short">${A.forest(7)}</div><div class="path"></div>
        <div class="deco" style="left:1%;top:22%;width:11%;height:30%">${A.torch()}</div><div class="deco" style="right:1%;top:22%;width:11%;height:30%">${A.torch()}</div>
        <div class="deco" style="left:90%;top:90%;width:7%;height:6%">${A.tuft()}</div><div class="deco" style="left:30%;top:90%;width:6%;height:5%">${A.pebble()}</div>
        <div class="shopkeep">${heroArt({ tool: null })}</div>
        ${sellers.map((x, i) => `<div class="seller" style="left:${64 + i * 12}%">${A.caveman({ ...LOOKS[x.look] })}</div>`).join('')}
        <div class="counter"></div>
        <div class="queue">${cs || '<div style="align-self:center;background:rgba(59,38,20,.7);color:#fff;padding:4px 10px;border-radius:8px;font-size:13px">Waiting for customers...</div>'}</div>
        <div class="deco" style="left:1%;top:72%;width:13%;height:22%">${A.fire()}</div>
      </div>`;
      const ul = G.unlocked();
      return scene + `<div class="panel">
        <div class="card flex"><div class="grow"><b>Tap a customer to sell</b><div class="small">Customers want what's in their bubble. Next in <span id="nextC"></span>s · queue <span id="qn"></span></div></div><button class="btn" data-act="sellAll">Sell all</button></div>
        <h3>Weapon shelf <span class="small" id="shelfN"></span></h3>
        <div class="stock">${ul.map(w => `<div class="it"><div class="ic">${A.weapon(w.id)}</div><b data-w="${w.id}">0</b><div>${fmt(G.price(w))}c</div></div>`).join('')}</div>
        <div class="small" style="margin-top:8px">Sold ${'<span id="soldN"></span>'} weapons in total. Assign Sell helpers to sell automatically.</div></div>`;
    },
    update() {
      $$('[data-w]').forEach(e => e.textContent = s().weapons[e.dataset.w] || 0);
      for (const c of s().customers) { const p = $(`[data-pat="${c.id}"]`); if (p) p.style.width = (100 - c.wait / G.CUST_PATIENCE * 100) + '%'; const b = $(`#c${c.id} .bub`); if (b) b.classList.toggle('no', !(s().weapons[c.want] > 0)); }
      $('#nextC').textContent = Math.max(0, s().nextCust).toFixed(0); $('#qn').textContent = `${s().customers.length}/${G.queueMax()}`; $('#shelfN').textContent = `${G.shelfCount()}/${G.shelfCap()}`; $('#soldN').textContent = fmt(s().stats.sold);
    },
  };

  tabs.hunt = {
    sig: () => { const H = s().hunt; return [H.area, H.maxArea, H.fight ? H.fight.mon.name + H.fight.mon.lv : 'none', H.auto, H.finalBeaten].join('|'); },
    build() {
      const H = s().hunt, ag = D.AGES[s().age], ar = ag.areas[H.area], f = H.fight;
      const mon = f ? f.mon : (H.stage === 10 ? { ...ar.boss, boss: true, lv: G.monIdx() + 1 } : { ...ar.monsters[H.stage % ar.monsters.length], boss: false, lv: G.monIdx() + 1 });
      const scene = `<div class="scene hunt-scene" id="scene" style="--abg:${ar.bg}">
        <div class="bd-forest">${A.forest(H.area * 5 + 2)}</div>
        <div class="stakes">${Array.from({ length: 9 }, () => A.stake()).join('')}</div>
        <div class="deco" style="left:42%;top:30%;width:15%;height:14%">${A.bush()}</div><div class="deco" style="left:30%;top:86%;width:7%;height:6%">${A.tuft()}</div><div class="deco" style="left:60%;top:90%;width:6%;height:5%">${A.pebble()}</div>
        <div class="fighter hero" id="fHero"><div class="hpb bar hp"><i id="hpHero"></i></div>${heroArt()}</div>
        ${mon ? `<div class="fighter mon" id="fMon" style="${mon.boss ? 'width:48%;max-width:220px;height:70%' : ''}"><div class="hpb bar hp"><i id="hpMon"></i></div>${A.beast({ ...mon, crown: mon.boss })}</div><div class="mname ${mon.boss ? 'boss' : ''}">${mon.boss ? '☠ BOSS ' : ''}${mon.name} · Lv ${mon.lv}</div>` : ''}
        <div class="status" id="hStatus"></div>
      </div>`;
      const areas = ag.areas.map((a, i) => `<button class="btn ${i === H.area ? 'gold' : 'blue'}" data-act="area" data-arg="${i}" ${i > H.maxArea ? 'disabled' : ''}>${i + 1}. ${a.name}${i > H.maxArea ? ' 🔒' : ''}</button>`).join('');
      return scene + `<div class="panel">
        <div class="card flex"><div class="grow"><b>${ag.name} · ${ar.name}</b><div class="small">Stage <span id="hStage"></span>/10 · every 10th fight is a boss. Fights cost 1 energy.</div></div>
        <button class="btn ${H.auto ? '' : 'grey'}" data-act="auto">Auto: ${H.auto ? 'ON' : 'OFF'}</button></div>
        ${H.finalBeaten ? `<div class="card" style="background:#ffe9a0"><b>🏆 You conquered the Stone Age!</b><div class="small">${ag.next} coming soon. Keep farming for gear and levels.</div></div>` : ''}
        ${!H.auto ? `<button class="btn" style="width:100%;margin-bottom:8px" data-act="fight">Fight!</button>` : ''}
        <h3>Areas</h3><div class="areas">${areas}</div>
        <div class="small" style="margin-top:8px">Kills: <span id="kills"></span>. Losing a fight sends you back one stage; level up and gear up, then try again.</div></div>`;
    },
    update() {
      const H = s().hunt, f = H.fight;
      $('#hStage').textContent = H.stage; $('#kills').textContent = fmt(s().stats.kills);
      if (f) { $('#hpHero').style.width = (f.php / f.pmax * 100) + '%'; const m = $('#hpMon'); if (m) m.style.width = (f.mon.hp / f.mon.maxHp * 100) + '%'; }
      else { $('#hpHero').style.width = '100%'; const m = $('#hpMon'); if (m) m.style.width = '100%'; }
      $('#hStatus').textContent = H.rest > 0 ? 'Recovering...' : s().loot.length ? 'Loot waiting!' : !f && s().energy < 1 ? 'Out of energy, resting...' : !f && !H.auto ? 'Ready' : f ? `HP ${fmt(f.php)}` : 'Searching...';
    },
  };

  tabs.helpers = {
    sig: () => s().helpers.map(h => h.id + h.task).join(',') + s().helpers.length,
    build() {
      const hs = s().helpers;
      const tasks = Object.entries(D.TASKS).map(([k, n]) => `<div class="task"><b>${n}</b> ${G.taskCount(k)}/2<div>Power ${G.helperPower(k).toFixed(1)}</div></div>`).join('');
      const opts = (h) => `<option value="">Idle</option>` + Object.entries(D.TASKS).map(([k, n]) => `<option value="${k}" ${h.task === k ? 'selected' : ''} ${h.task !== k && G.taskCount(k) >= 2 ? 'disabled' : ''}>${n}</option>`).join('');
      return `<div class="full">
        <h3>Loot chests</h3>
        <div class="chests"><div class="card chest"><div class="ic">${A.chest('wood')}</div><b>Wooden Chest</b><div class="small">Mostly common, some rare</div><button class="btn gold" data-act="chest" data-arg="coin" data-cost="${G.chestCost()}">${A.coin()}${fmt(G.chestCost())}</button></div>
        <div class="card chest"><div class="ic">${A.chest('gem')}</div><b>Spirit Chest</b><div class="small">Rare or better</div><button class="btn blue" data-act="chest" data-arg="gem" data-gems="${G.GEM_CHEST}">${A.gem()}${G.GEM_CHEST}</button></div></div>
        <div class="small">Gems come from bosses and level-ups. No real money, ever. Helpers: ${hs.length}/${G.HELPER_MAX}</div>
        <h3>Jobs (max 2 each)</h3><div class="tasks">${tasks}</div>
        <h3>Your helpers</h3>
        ${hs.length ? `<div class="hgrid">${hs.map(h => { const r = D.RARITIES[h.r]; return `<div class="helper" style="border-color:${r.color}"><div class="fig">${A.caveman(LOOKS[h.look])}</div><div class="grow"><b>${h.name}</b> <span class="rar" style="color:${r.color}">${r.name}</span><div class="small">x${r.power} output</div><select data-assign="${h.id}">${opts(h)}</select><button class="btn red" style="min-height:24px;padding:0 6px;font-size:11px;margin-top:3px" data-act="release" data-arg="${h.id}">Release +${fmt(30 * r.power)}c</button></div></div>`; }).join('')}</div>` : '<div class="card small">No helpers yet. Open a chest!</div>'}
      </div>`;
    },
    update() {},
  };

  tabs.upgrades = {
    sig: () => JSON.stringify(s().upg),
    build() {
      return `<div class="full"><h3>Upgrades</h3>${D.UPGRADES.map(u => { const lv = G.U(u.id), max = lv >= u.max; return `<div class="card upg"><div class="grow"><b>${u.name}</b> <span class="small">Lv ${lv}/${u.max}</span><div class="small">${u.desc}</div></div>${max ? '<b>MAX</b>' : `<button class="btn gold" data-act="upg" data-arg="${u.id}" data-cost="${G.upgCost(u)}">${A.coin()}${fmt(G.upgCost(u))}</button>`}</div>`; }).join('')}
      <div class="card small">Stats: storage ${fmt(G.resCap())}, shelf ${G.shelfCap()}, queue ${G.queueMax()}, customer every ${G.custInterval().toFixed(1)}s, price x${G.priceMul().toFixed(2)}, craft speed x${G.craftSpeed().toFixed(2)}, offline cap ${G.offlineCapH()}h.</div></div>`;
    },
    update() {},
  };

  tabs.hero = {
    sig: () => [s().hero.lv, s().hero.pts > 0, JSON.stringify(s().hero.stats), Object.values(s().hero.gear).map(g => g && g.id).join(',')].join('|'),
    build() {
      const h = s().hero, c = G.cls(), st = G.heroStats();
      const slots = D.GEAR_SLOTS.map(k => { const g = h.gear[k]; return `<button class="gslot" data-act="gear" data-arg="${k}" style="${g ? `border-color:${D.RARITIES[g.r].color}` : ''}">${g ? A.gear(k, D.RARITIES[g.r].color) + `<span class="lv">Lv${g.lv}</span>` : `<span class="small" style="font-size:9px">${k}</span>`}</button>`; }).join('');
      const rows = Object.entries(D.STATS).map(([k, n]) => `<div class="statrow"><b>${n}${k === c.main ? ' ★' : ''}</b><span class="grow">${h.stats[k]}</span><button class="btn" data-act="stat" data-arg="${k}" ${h.pts ? '' : 'disabled'}>+1</button><button class="btn blue" data-act="stat5" data-arg="${k}" ${h.pts >= 5 ? '' : 'disabled'}>+5</button></div>`).join('');
      return `<div class="full">
        <div class="card hero-top"><div class="hero-fig">${heroArt()}</div><div class="grow"><b style="font-size:18px">${c.name}</b> · Lv ${h.lv}<div class="small">${c.desc}</div><div class="bar xp" style="margin-top:6px"><i id="xpBar"></i></div><div class="small" id="xpTxt"></div></div></div>
        <div class="card"><b>Gear</b> <span class="small">(tap to inspect)</span><div class="gslots" style="margin-top:4px">${slots}</div></div>
        <div class="card"><div class="kv"><span>❤ HP: <b>${fmt(st.hp)}</b></span><span>⚔ ATK: <b>${fmt(st.atk)}</b></span><span>⚡ Speed: <b>${st.spd.toFixed(2)}/s</b></span><span>🎯 Crit: <b>${Math.round(st.crit * 100)}%</b> x${st.critDmg}</span><span>✌ Combo: <b>${Math.round(st.combo * 100)}%</b></span><span>${st.dr ? '🛡 Block: <b>' + st.dr * 100 + '%</b>' : st.heal ? '✚ Heal/hit: <b>3%</b>' : ''}</span></div></div>
        <div class="card"><b>Stat points: ${h.pts}</b> <span class="small">(+3 per level, ★ = main stat)</span>${rows}</div></div>`;
    },
    update() { const h = s().hero; $('#xpBar').style.width = (h.xp / G.xpNeed(h.lv) * 100) + '%'; $('#xpTxt').textContent = `XP ${fmt(h.xp)} / ${fmt(G.xpNeed(h.lv))}`; },
  };

  function showTab(t) {
    ui.tab = t; ui.sig = ''; $$('#nav button').forEach(b => b.classList.toggle('on', b.dataset.arg === t)); render(true);
  }
  ui.showTab = showTab;
  function render(force) {
    const T = tabs[ui.tab]; const sg = T.sig();
    if (force || sg !== ui.sig) { const sc = $('.panel, .full', $('#view')); const top = sc ? sc.scrollTop : 0; $('#view').innerHTML = T.build(); ui.sig = sg; const sc2 = $('.panel, .full', $('#view')); if (sc2 && !force) sc2.scrollTop = top; }
    T.update();
    // affordability
    $$('[data-cost]').forEach(b => b.disabled = s().coins < +b.dataset.cost);
    $$('[data-gems]').forEach(b => b.disabled = s().gems < +b.dataset.gems);
    renderTop();
  }
  function renderTop() {
    $('#coins').textContent = fmt(s().coins); $('#gems').textContent = fmt(s().gems); $('#energy').textContent = `${Math.floor(s().energy)}/${G.energyMax()}`;
    $('#lvl').textContent = 'Lv ' + s().hero.lv;
    const H = s().hunt; $('#areaTag').textContent = `${H.area + 1}-${H.stage}`;
    const pips = $('#pips'); if (pips.children.length !== 10) pips.innerHTML = Array.from({ length: 10 }, (_, i) => `<span class="pip ${i === 9 ? 'boss' : ''}"></span>`).join('');
    [...pips.children].forEach((p, i) => { p.classList.toggle('done', i < H.stage - 1); p.classList.toggle('cur', i === H.stage - 1); });
    const heroBtn = $('#nav [data-arg="hero"]'); const dot = s().hero.pts > 0; if (!!heroBtn.querySelector('.dot') !== dot) heroBtn.innerHTML = 'Hero' + (dot ? '<span class="dot"></span>' : '');
  }

  // ---------- events from game ----------
  function handleEvents() {
    const evs = G.events.splice(0);
    for (const e of evs) {
      if (e.type === 'hit' && ui.tab === 'hunt') {
        if (e.who === 'mon') { floatOn('#fMon', (e.crit ? 'CRIT ' : '') + '-' + fmt(e.d), e.crit ? 'crit' : ''); anim('#fHero', 'atk-h'); anim('#fMon', 'ouch'); }
        else { floatOn('#fHero', '-' + fmt(e.d), 'bad'); anim('#fMon', 'atk-m'); anim('#fHero', 'ouch'); }
      }
      if (e.type === 'win') {
        if (ui.tab === 'hunt') floatOn('#fHero', `+${fmt(e.coins)}c +${fmt(e.xp)}xp`, 'good');
        if (e.drop && e.drop.autoSold && ui.tab === 'hunt') toast(`Auto-sold weaker ${e.drop.slot}`);
        if (e.boss) toast(`Boss ${e.name} defeated! +${e.gems} gems`);
        if (e.unlocked) toast(`New area unlocked: ${e.unlocked}`);
        if (e.final) queueModal(() => openModal('Stone Age conquered!', `<div style="text-align:center"><div style="width:140px;height:120px;margin:0 auto">${A.beast({ kind: 'mammoth', body: '#7a3a22', belly: '#c06a4a', crown: true })}</div><p><b>You beat the Mammoth Titan!</b></p><p>The Copper Age is coming soon. Keep growing your shop, helpers and hero in the meantime.</p><button class="btn" data-act="close">Awesome!</button></div>`));
      }
      if (e.type === 'lose') toast('Defeated! Back one stage. Level up or gear up.');
      if (e.type === 'levelup') { toast(`Level up! Lv ${e.lv} · +3 stat points, +3 gems`); }
      if (e.type === 'crafted' && ui.tab === 'base') floatOn('#tAnvil', '+1 ' + G.weapon(e.id).name, 'good');
      if (e.type === 'sold' && ui.tab === 'shop') floatOn('.counter', `+${fmt(e.p)}c`, 'good');
      if (e.type === 'nostock') toast('Out of stock! Craft it at the Base anvil.');
      if (e.type === 'gain' && ui.tab === 'base') floatOn(e.k === 'wood' ? '#tTree' : '#tRock', e.n ? `+${e.n}` : 'Full!', e.n ? '' : 'bad');
    }
    if (s().loot.length && !ui.modal) lootModal();
  }
  function anim(sel, c) { const el = typeof sel === 'string' ? $(sel) : sel; if (!el) return; el.classList.remove(c); void el.offsetWidth; el.classList.add(c); }

  // ---------- popups ----------
  function statRows(g, cur) {
    const keys = [['hp', 'HP', ''], ['atk', 'ATK', ''], ['spd', 'SPEED', '%'], ['combo', 'COMBO', '%'], ['crit', 'CRIT', '%']];
    return keys.filter(([k]) => g[k] || (cur && cur[k])).map(([k, n, u]) => { const d = g[k] - (cur ? cur[k] : 0); return `<div><span>${n}: ${fmt(g[k])}${u}</span><span class="${d > 0 ? 'up' : d < 0 ? 'down' : ''}">${d > 0 ? '▲' : d < 0 ? '▼' : '='}${d ? fmt(Math.abs(d)) : ''}</span></div>`; }).join('');
  }
  function lootModal() {
    const g = s().loot[0]; if (!g) return; const cur = s().hero.gear[g.slot]; const r = D.RARITIES[g.r];
    const better = G.gearScore(g) > G.gearScore(cur);
    openModal('Dropped loot', `<div class="flex" style="justify-content:space-between;margin-bottom:6px"><b style="text-transform:capitalize;font-size:17px">${g.slot}</b><span class="rar" style="color:${r.color};font-size:14px">${r.name}</span>${better ? '<b style="color:#e8a51a">NEW BEST!</b>' : ''}</div>
      <div class="loot"><div class="big" style="border-color:${r.color}">${A.gear(g.slot, r.color)}<span class="lv" style="position:absolute;bottom:2px;right:4px;font-size:11px;font-weight:bold">Lv${g.lv}</span></div><div class="rows">${statRows(g, cur)}</div></div>
      <div class="small" style="margin:6px 0">${cur ? `Compared with your equipped Lv${cur.lv} ${cur.slot}.` : 'Slot is empty.'} Dropping sells it for ${fmt(G.gearValue(g))} coins.</div>
      <div class="flex" style="justify-content:space-around"><button class="btn red" data-act="drop" data-arg="${g.id}">Drop +${fmt(G.gearValue(g))}c</button><button class="btn" data-act="equip" data-arg="${g.id}">Equip</button></div>`, { id: 'loot' });
  }
  function gearModal(slot) {
    const g = s().hero.gear[slot]; if (!g) return openModal(slot, `<p>No ${slot} equipped yet. Hunt monsters for drops!</p>`);
    const r = D.RARITIES[g.r];
    openModal(`${r.name} ${slot}`, `<div class="loot"><div class="big" style="border-color:${r.color}">${A.gear(slot, r.color)}</div><div class="rows">${statRows(g)}</div></div><div class="small" style="margin-top:6px">Item level ${g.lv}.</div>`);
  }
  function settingsModal() {
    const fsOK = !!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen);
    openModal('Settings', `
      ${fsOK ? '<button class="btn blue" style="width:100%;margin-bottom:8px" data-act="fullscreen">Toggle fullscreen</button>' : ''}
      <label class="card flex" style="font-size:14px"><input type="checkbox" id="optAuto" ${s().settings.autoSellWorse ? 'checked' : ''}> Auto-sell gear drops weaker than what you wear</label>
      <div class="card"><b>Export save</b><textarea id="exportTxt" readonly>${G.exportSave()}</textarea><button class="btn" data-act="copy">Copy</button></div>
      <div class="card"><b>Import save</b><textarea id="importTxt" placeholder="Paste save text here"></textarea><button class="btn blue" data-act="import">Import</button></div>
      <button class="btn red" style="width:100%" data-act="reset">Reset game</button>
      <div class="version">Ages Idle RPG ${D.VERSION} · No ads, no real-money purchases.</div>`, { id: 'settings' });
    $('#optAuto').onchange = (e) => { s().settings.autoSellWorse = e.target.checked; G.save(); };
  }
  function classModal() {
    openModal('Choose your class', `<p class="small" style="margin-top:0">Welcome to the Stone Age! Pick a hero class (permanent for this save).</p><div class="classes">${Object.entries(D.CLASSES).map(([k, c]) => `<button class="cls" data-act="class" data-arg="${k}"><div class="fig">${A.caveman({ style: c.style, outfit: c.outfit, tool: c.tool })}</div><div><b style="font-size:17px">${c.name}</b><div class="small">${c.desc}</div></div></button>`).join('')}</div>`, { id: 'class', noClose: true });
  }
  function awayModal(r) {
    const h = Math.floor(r.sec / 3600), m = Math.floor(r.sec % 3600 / 60);
    queueModal(() => openModal('While you were away', `<div style="text-align:center"><div style="width:110px;height:100px;margin:0 auto">${A.fire()}</div><p>You were gone <b>${h}h ${m}m</b>${r.real > r.sec ? ` (capped at ${G.offlineCapH()}h)` : ''}. Your helpers kept busy:</p>
      <div class="kv" style="text-align:left;margin-bottom:10px"><span>🪵 Wood: <b>+${fmt(Math.max(0, r.wood))}</b></span><span>🪨 Stone: <b>+${fmt(Math.max(0, r.stone))}</b></span><span>⚒ Crafted: <b>${fmt(r.crafted)}</b></span><span>🛒 Sold: <b>${fmt(r.sold)}</b></span><span>💰 Coins: <b>+${fmt(Math.max(0, r.coins))}</b></span></div>
      ${r.crafted + r.sold === 0 ? '<p class="small">Tip: assign helpers to Craft and Sell to earn while away.</p>' : ''}<button class="btn" data-act="close">Collect</button></div>`, { id: 'away' }));
  }

  // ---------- input ----------
  const actions = {
    tab: (a) => showTab(a), close: () => closeModal(), settings: () => settingsModal(),
    chop: (a, el) => { G.chop(); anim(el, 'hit'); }, mine: (a, el) => { G.mine(); anim(el, 'hit'); },
    anvil: (a, el) => { if (!G.tapAnvil()) toast(G.shelfCount() >= G.shelfCap() ? 'Shelf full! Sell weapons in the Shop.' : 'Need more wood/stone. Tap the tree and rock!'); anim(el, 'hit'); },
    sel: (a) => { const w = G.weapon(a); if (w.lv > s().anvil) return toast(`Upgrade the anvil to Lv ${w.lv}`); s().sel = a; ui.sig = ''; },
    anvilUp: () => { if (G.upgradeAnvil()) toast('Anvil upgraded!'); },
    sell: (a) => { const i = s().customers.findIndex(c => c.id === +a); G.sell(i); },
    sellAll: () => { let n = 0; while (G.sellFirstPossible()) n++; if (!n) toast('Nothing in stock that customers want.'); },
    chest: (a) => { if (s().helpers.length >= G.HELPER_MAX) return toast('Helper camp full. Release one first.'); const h = G.openChest(a === 'gem'); if (h) { const r = D.RARITIES[h.r]; openModal('New helper!', `<div style="text-align:center"><div style="width:90px;height:126px;margin:0 auto">${A.caveman(LOOKS[h.look])}</div><h2 style="color:${r.color};margin:4px">${r.name}</h2><p><b>${h.name}</b> joins your tribe (x${r.power} output)${h.task ? ` and starts: <b>${D.TASKS[h.task]}</b>` : '. All jobs are full, assign them below.'}</p><button class="btn" data-act="close">Great!</button></div>`); ui.sig = ''; } },
    release: (a) => { const v = G.release(+a); toast(`Released, +${fmt(v)} coins`); },
    upg: (a) => { G.buyUpgrade(a); },
    auto: () => { s().hunt.auto = !s().hunt.auto; }, fight: () => { if (!G.startFight()) toast(s().energy < 1 ? 'Out of energy' : 'Busy'); },
    area: (a) => { if (!G.setArea(+a)) toast('Finish the current fight first'); },
    stat: (a) => G.allocate(a, 1), stat5: (a) => G.allocate(a, 5),
    gear: (a) => gearModal(a),
    equip: (a) => { G.equip(+a); ui.modal = null; $('#modal').hidden = true; ui.sig = ''; nextQueued(); },
    drop: (a) => { const v = G.dropLoot(+a); toast(`Dropped, +${fmt(v)} coins`); ui.modal = null; $('#modal').hidden = true; nextQueued(); },
    class: (a) => { G.chooseClass(a); ui.modal = null; $('#modal').hidden = true; $('#avatarArt').innerHTML = heroArt(); G.save(); toast('Tap the tree and rock, then craft at the anvil!'); render(true); },
    fullscreen: () => { const d = document; if (d.fullscreenElement || d.webkitFullscreenElement) (d.exitFullscreen || d.webkitExitFullscreen).call(d); else { const e = d.documentElement; (e.requestFullscreen || e.webkitRequestFullscreen).call(e); } },
    copy: () => { const t = $('#exportTxt'); t.select(); navigator.clipboard ? navigator.clipboard.writeText(t.value).then(() => toast('Copied!'), () => toast('Select and copy manually')) : document.execCommand('copy'); },
    import: () => { try { G.importSave($('#importTxt').value); G.save(); closeModal(); $('#avatarArt').innerHTML = heroArt(); toast('Save imported!'); render(true); } catch (e) { toast('That save text is not valid.'); } },
    reset: () => { if (confirm('Erase all progress?')) { localStorage.removeItem(G.KEY); G.s = G.fresh(); ui.modal = null; $('#modal').hidden = true; classModal(); render(true); } },
    reload: () => { if (ui.waitingSW) ui.waitingSW.postMessage('skipWaiting'); else location.reload(); },
  };
  ui.actions = actions;
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]'); if (!el || el.disabled) return;
    const f = actions[el.dataset.act]; if (f) { f(el.dataset.arg, el); handleEvents(); render(); }
  });
  document.addEventListener('change', (e) => { const id = e.target.dataset.assign; if (id) { if (!G.assign(+id, e.target.value)) toast('That job already has 2 helpers'); render(true); } });
  $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal' && !['class', 'loot'].includes(ui.modal)) closeModal(); });

  // ---------- boot ----------
  function boot() {
    $('#icoCoin').innerHTML = A.coin(); $('#icoGem').innerHTML = A.gem(); $('#icoEn').innerHTML = A.energy();
    const raw = localStorage.getItem(G.KEY); let away = null;
    if (raw) { try { G.load(raw); away = G.applyOffline((Date.now() - (G.s.last || Date.now())) / 1000); } catch (e) { G.s = G.fresh(); } }
    $('#avatarArt').innerHTML = heroArt();
    showTab('base');
    if (!G.s.cls) classModal(); else if (away) awayModal(away);
    let last = performance.now();
    ui.loop = setInterval(() => { const now = performance.now(); let dt = Math.min(1, (now - last) / 1000); last = now; if (!ui.paused) G.tick(dt); handleEvents(); render(); }, 100);
    setInterval(G.save, 5000);
    document.addEventListener('visibilitychange', () => { if (document.hidden) G.save(); else if (G.s.cls) { const r = G.applyOffline((Date.now() - G.s.last) / 1000); if (r) awayModal(r); last = performance.now(); } });
    window.addEventListener('pagehide', G.save);
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      navigator.serviceWorker.register('sw.js').then(reg => {
        const ready = (w) => { ui.waitingSW = w; $('#updateBar').hidden = false; };
        if (reg.waiting && navigator.serviceWorker.controller) ready(reg.waiting);
        reg.addEventListener('updatefound', () => { const w = reg.installing; w && w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) ready(w); }); });
        setInterval(() => reg.update().catch(() => {}), 60000);
      }).catch(() => {});
      let reloaded = false; navigator.serviceWorker.addEventListener('controllerchange', () => { if (ui.waitingSW && !reloaded) { reloaded = true; G.save(); location.reload(); } });
    }
  }
  ui.fmt = fmt;
  boot();
})();
