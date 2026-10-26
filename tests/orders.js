// Crafting follows customer orders. node tests/orders.js
const assert = require('assert');
global.btoa = s => Buffer.from(s, 'binary').toString('base64'); global.atob = s => Buffer.from(s, 'base64').toString('binary');
const D = require('../js/data.js'); const G = require('../js/game.js');
G.s = G.fresh(); G.chooseClass('warrior'); G.s.anvil = 2;
const [a, b] = G.unlocked(); G.s.wood = 100; G.s.stone = 100; G.s.weapons = {}; G.s.sel = a.id;
G.s.customers = [{ id: 1, want: b.id, wait: 0, look: 0 }, { id: 2, want: a.id, wait: 0, look: 0 }];
assert.strictEqual(G.craftPlan().w.id, b.id, 'front of queue first');
G.startJob(); assert.strictEqual(G.s.job.id, b.id);
assert.strictEqual(G.nextOrder().w.id, a.id, 'job covers first order, next is second');
G.s.job = null; G.s.weapons = { [b.id]: 1 };
assert.strictEqual(G.craftPlan().w.id, a.id, 'skip wants covered by stock');
G.s.weapons = { [a.id]: 1, [b.id]: 1 }; assert.strictEqual(G.craftPlan().order, false, 'all covered -> fallback');
G.s.weapons = {}; G.s.wood = 0; G.s.stone = 0;
const p = G.craftPlan(); assert.ok(p.order && p.blocked); assert.ok(!G.startJob(), 'no silent substitute');
assert.match(G.needText(p.w), /^Need \d+ more/);
// helpers keep working: with chop/mine materials arrive and order gets crafted
G.s.wood = 100; G.s.stone = 100; assert.ok(G.startJob()); assert.strictEqual(G.s.job.id, b.id);
// customers only want unlocked weapons
G.s.anvil = 1; for (let i = 0; i < 200; i++) G.spawnCustomer(); assert.ok(G.s.customers.slice(2).every(c => G.weapon(c.want).lv <= 1));
console.log('orders ok');
