// Game data. Later ages (Copper, Bronze, Iron, Silver, Gold, Castle, Imperial, Heroic, Mythical)
// are added by appending entries to AGES with the same shape.
const VERSION = 'v1.1.0';
const CLASSES = {
  warrior: { name: 'Warrior', main: 'str', desc: 'Melee bruiser. Scales with STR. +30% HP and takes 20% less damage.', tool: 'club', style: 'skull', outfit: '#e8862e', hp: 1.3, dr: 0.2 },
  hunter: { name: 'Hunter', main: 'dex', desc: 'Ranged sharpshooter. Scales with DEX. Double crit chance, crits hit harder, attacks faster.', tool: 'bow', style: 'long', outfit: '#6aa84f', critMul: 2, spd: 0.25 },
  shaman: { name: 'Shaman', main: 'int', desc: 'Spirit magic. Scales with INT. Spirit blasts splash for +25% and every hit heals you.', tool: 'staff', style: 'bun', outfit: '#7b5cc4', splash: 0.25, heal: 0.03 },
};
const STATS = { str: 'STR', dex: 'DEX', int: 'INT', vit: 'VIT (HP)', agi: 'AGI (Speed)', luck: 'LUCK (Crit)' };
const RARITIES = [
  { id: 'common', name: 'Common', color: '#9aa3ad', power: 1 },
  { id: 'rare', name: 'Rare', color: '#3fa0ff', power: 2.5 },
  { id: 'epic', name: 'Epic', color: '#b05cff', power: 6 },
  { id: 'legendary', name: 'Legendary', color: '#ffb000', power: 15 },
];
const GEAR_SLOTS = ['weapon', 'armour', 'helmet', 'necklace', 'ring'];
const HELPER_NAMES = ['Ugg', 'Mog', 'Bonk', 'Zara', 'Grub', 'Tuk', 'Lula', 'Rok', 'Nana', 'Krag', 'Pip', 'Oona', 'Dag', 'Bree', 'Hurk', 'Wren', 'Thok', 'Ila', 'Gorp', 'Suki'];
const TASKS = { chop: 'Chop wood', mine: 'Mine stone', craft: 'Craft', sell: 'Sell' };

const AGES = [{
  id: 'stone', name: 'Stone Age', next: 'Copper Age',
  // wood, stone cost; time in seconds; base price in coins; anvil level needed
  weapons: [
    { id: 'club', name: 'Wooden Club', wood: 3, stone: 0, time: 2, price: 8, lv: 1 },
    { id: 'knife', name: 'Flint Knife', wood: 1, stone: 3, time: 3, price: 14, lv: 1 },
    { id: 'spear', name: 'Stone Spear', wood: 4, stone: 2, time: 4, price: 26, lv: 2 },
    { id: 'axe', name: 'Stone Axe', wood: 5, stone: 5, time: 5, price: 44, lv: 3 },
    { id: 'hammer', name: 'Bone Hammer', wood: 6, stone: 9, time: 6, price: 72, lv: 4 },
    { id: 'bow', name: 'Hunting Bow', wood: 14, stone: 4, time: 8, price: 115, lv: 5 },
    { id: 'mace', name: 'Spiked Mace', wood: 10, stone: 16, time: 9, price: 180, lv: 7 },
    { id: 'blade', name: 'Obsidian Blade', wood: 12, stone: 24, time: 11, price: 290, lv: 9 },
  ],
  anvilMax: 10,
  areas: [
    { name: 'Sunny Plains', bg: '#cfe58a', monsters: [{ name: 'Tusky Boar', kind: 'boar', body: '#9a6a44', belly: '#d8b083' }, { name: 'Pup Wolf', kind: 'wolf', body: '#9aa0aa', belly: '#dde0e4' }], boss: { name: 'Big Tusk', kind: 'boar', body: '#7a4a2a', belly: '#c08a5a' } },
    { name: 'Deep Woods', bg: '#9fcf6a', monsters: [{ name: 'Grey Wolf', kind: 'wolf', body: '#7a808a', belly: '#c8ccd2' }, { name: 'Brown Bear', kind: 'bear', body: '#8a5a32', belly: '#c49a6c' }], boss: { name: 'Old Grizzle', kind: 'bear', body: '#6a4022', belly: '#b5865a' } },
    { name: 'Misty Marsh', bg: '#a6c49a', monsters: [{ name: 'Bog Boar', kind: 'boar', body: '#6a7a44', belly: '#b0c080' }, { name: 'Marsh Cat', kind: 'cat', body: '#c9a24a', belly: '#f0dca0' }], boss: { name: 'Fang Queen', kind: 'cat', body: '#d08a2a', belly: '#f4d090' } },
    { name: 'Frost Ridge', bg: '#d6ecf2', monsters: [{ name: 'Snow Wolf', kind: 'wolf', body: '#e4ecf2', belly: '#ffffff' }, { name: 'Woolly Calf', kind: 'mammoth', body: '#9a6a44', belly: '#c49a6c' }], boss: { name: 'Ice Bear', kind: 'bear', body: '#e8f0f6', belly: '#c8dce8' } },
    { name: 'Ember Valley', bg: '#e9b58a', monsters: [{ name: 'Lava Cat', kind: 'cat', body: '#d0502a', belly: '#ffb070' }, { name: 'Ash Bear', kind: 'bear', body: '#4a4048', belly: '#8a7a80' }], boss: { name: 'Mammoth Titan', kind: 'mammoth', body: '#7a3a22', belly: '#c06a4a', final: true } },
  ],
}];

// Coin upgrades. cost = base * growth^level
const UPGRADES = [
  { id: 'axe', name: 'Sharper Axe', desc: '+1 wood per tap, helpers chop +25%', base: 15, g: 1.55, max: 50 },
  { id: 'pick', name: 'Harder Pick', desc: '+1 stone per tap, helpers mine +25%', base: 15, g: 1.55, max: 50 },
  { id: 'storage', name: 'Bigger Woodpile', desc: '+50% wood & stone storage', base: 30, g: 1.7, max: 40 },
  { id: 'racks', name: 'Weapon Racks', desc: '+4 weapon shelf space', base: 45, g: 1.65, max: 40 },
  { id: 'sign', name: 'Bigger Sign', desc: 'Customers arrive 12% faster, +1 queue spot every 2 levels', base: 40, g: 1.75, max: 20 },
  { id: 'counter', name: 'Fancy Counter', desc: '+15% coins per sale', base: 60, g: 1.6, max: 80 },
  { id: 'hands', name: 'Quick Hands', desc: '+15% crafting speed', base: 50, g: 1.6, max: 60 },
  { id: 'fire', name: 'Cosy Campfire', desc: '+1h offline progress cap (base 4h)', base: 400, g: 2.2, max: 8 },
];
if (typeof window !== "undefined") window.GameData = { VERSION, CLASSES, STATS, RARITIES, GEAR_SLOTS, HELPER_NAMES, TASKS, AGES, UPGRADES }; else module.exports = { VERSION, CLASSES, STATS, RARITIES, GEAR_SLOTS, HELPER_NAMES, TASKS, AGES, UPGRADES };
