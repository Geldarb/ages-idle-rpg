// All art drawn in code as inline SVG strings. Original designs.
const OL = '#3b2614'; // outline colour
const SW = 3;
function svg(vb, body, cls = '') { return `<svg class="${cls}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`; }

const Art = {
  // Big-headed caveman. opts: skin, hair, style(afro|long|skull|bun), outfit, tool, flip
  caveman(o = {}) {
    const skin = o.skin || '#f2c38f', hair = o.hair || '#4a2a14', outfit = o.outfit || '#e8862e', spot = o.spot || '#8a4a1a';
    const tool = o.tool ? Art.tool(o.tool) : '';
    let hairBack = '', hairFront = '';
    if (o.style === 'long') { hairBack = `<path d="M24 44 Q20 92 34 96 L66 96 Q80 92 76 44 Z" fill="${hair}" stroke="${OL}" stroke-width="${SW}"/>`; hairFront = `<path d="M26 48 Q30 18 50 18 Q72 18 74 48 Q62 34 50 36 Q36 34 26 48Z" fill="${hair}" stroke="${OL}" stroke-width="${SW}"/>`; }
    else if (o.style === 'afro') { hairFront = `<path d="M22 52 Q12 36 24 26 Q26 10 44 12 Q56 4 68 14 Q86 18 80 36 Q90 48 78 54 Q74 38 50 38 Q30 38 22 52Z" fill="${hair}" stroke="${OL}" stroke-width="${SW}"/>`; }
    else if (o.style === 'bun') { hairFront = `<circle cx="50" cy="14" r="9" fill="${hair}" stroke="${OL}" stroke-width="${SW}"/><path d="M26 50 Q26 22 50 22 Q74 22 74 50 Q64 34 50 36 Q36 34 26 50Z" fill="${hair}" stroke="${OL}" stroke-width="${SW}"/>`; }
    else { // skull helmet with horns
      hairBack = `<path d="M26 46 Q22 80 30 86 L70 86 Q78 80 74 46Z" fill="${hair}" stroke="${OL}" stroke-width="${SW}"/>`;
      hairFront = `<path d="M28 30 Q14 26 14 10 Q24 22 34 22Z" fill="#f4ecd8" stroke="${OL}" stroke-width="${SW}"/><path d="M72 30 Q86 26 86 10 Q76 22 66 22Z" fill="#f4ecd8" stroke="${OL}" stroke-width="${SW}"/><path d="M28 42 Q26 16 50 16 Q74 16 72 42 Q62 36 50 38 Q38 36 28 42Z" fill="#f4ecd8" stroke="${OL}" stroke-width="${SW}"/><circle cx="41" cy="29" r="4" fill="${OL}"/><circle cx="59" cy="29" r="4" fill="${OL}"/>`;
    }
    const body = `
      <ellipse cx="50" cy="134" rx="22" ry="5" fill="rgba(0,0,0,.18)"/>
      <rect x="40" y="108" width="7" height="24" rx="3" fill="${OL}"/><rect x="53" y="108" width="7" height="24" rx="3" fill="${OL}"/>
      <rect x="36" y="128" width="12" height="6" rx="3" fill="${OL}"/><rect x="52" y="128" width="12" height="6" rx="3" fill="${OL}"/>
      <path d="M33 84 L67 84 L72 114 L58 110 L50 116 L42 110 L28 114 Z" fill="${outfit}" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/>
      <circle cx="42" cy="96" r="3" fill="${spot}"/><circle cx="58" cy="102" r="3.5" fill="${spot}"/><circle cx="53" cy="90" r="2.5" fill="${spot}"/>
      <path d="M30 88 Q22 98 26 106" stroke="${skin}" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M70 88 Q78 96 76 104" stroke="${skin}" stroke-width="7" fill="none" stroke-linecap="round"/>
      ${hairBack}
      <rect x="28" y="30" width="44" height="54" rx="16" fill="${skin}" stroke="${OL}" stroke-width="${SW}"/>
      <ellipse cx="40" cy="58" rx="3.2" ry="4.2" fill="${OL}"/><ellipse cx="60" cy="58" rx="3.2" ry="4.2" fill="${OL}"/>
      <circle cx="41" cy="56.5" r="1.2" fill="#fff"/><circle cx="61" cy="56.5" r="1.2" fill="#fff"/>
      <path d="M35 49 L45 51 M65 49 L55 51" stroke="${OL}" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M50 60 Q53 66 49 68" stroke="#c98a5a" stroke-width="2" fill="none"/>
      <path d="M43 73 Q50 78 57 73" stroke="${OL}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <ellipse cx="35" cy="68" rx="3.5" ry="2" fill="#f08a7a" opacity=".6"/><ellipse cx="65" cy="68" rx="3.5" ry="2" fill="#f08a7a" opacity=".6"/>
      ${hairFront}
      <g transform="translate(70 96) rotate(-20)">${tool}</g>`;
    return svg('0 0 100 140', o.flip ? `<g transform="translate(100 0) scale(-1 1)">${body}</g>` : body, o.cls || 'sprite');
  },
  // tool held in hand, origin at grip
  tool(t) {
    const handle = (len, c = '#a0642c') => `<rect x="-3" y="${-len}" width="6" height="${len + 6}" rx="3" fill="${c}" stroke="${OL}" stroke-width="2"/>`;
    switch (t) {
      case 'axe': return handle(34) + `<path d="M2 -34 Q18 -40 18 -24 Q16 -16 2 -20Z" fill="#9aa3ad" stroke="${OL}" stroke-width="2.5"/>`;
      case 'pick': return handle(34) + `<path d="M-16 -30 Q0 -42 16 -30 L12 -28 Q0 -34 -12 -28Z" fill="#9aa3ad" stroke="${OL}" stroke-width="2.5"/>`;
      case 'hammer': return handle(30) + `<rect x="-11" y="-40" width="22" height="13" rx="3" fill="#b8bec6" stroke="${OL}" stroke-width="2.5"/>`;
      case 'club': return `<path d="M-3 6 L-5 -14 Q-10 -36 0 -40 Q10 -36 5 -14 L3 6Z" fill="#b5763a" stroke="${OL}" stroke-width="2.5"/><circle cx="-3" cy="-30" r="2" fill="${OL}"/><circle cx="3" cy="-22" r="2" fill="${OL}"/>`;
      case 'bow': return `<path d="M-6 -36 Q14 -16 -6 6" stroke="#a0642c" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M-6 -36 Q14 -16 -6 6" stroke="${OL}" stroke-width="1" fill="none"/><line x1="-6" y1="-36" x2="-6" y2="6" stroke="#eee" stroke-width="1.5"/>`;
      case 'staff': return handle(46, '#7a4a22') + `<circle cx="0" cy="-48" r="8" fill="#6ee0ff" stroke="${OL}" stroke-width="2.5"/><circle cx="-2" cy="-50" r="2.5" fill="#fff"/>`;
      default: return '';
    }
  },
  tree(o = {}) {
    const g = o.g || '#7cc242', d = o.d || '#5a9a2c';
    return svg('0 0 100 120', `<ellipse cx="50" cy="114" rx="26" ry="5" fill="rgba(0,0,0,.18)"/>
      <path d="M42 112 L44 70 L56 70 L58 112 Q50 116 42 112Z" fill="#9a6232" stroke="${OL}" stroke-width="${SW}"/>
      <path d="M50 8 Q70 6 74 22 Q92 24 88 44 Q96 60 78 70 Q70 82 52 76 Q36 84 24 72 Q6 66 12 48 Q4 30 22 24 Q30 6 50 8Z" fill="${g}" stroke="${OL}" stroke-width="${SW}"/>
      <path d="M30 40 Q36 34 44 38 M58 30 Q64 26 70 32 M52 56 Q60 52 66 58" stroke="${d}" stroke-width="3" fill="none" stroke-linecap="round"/>`, o.cls || 'sprite');
  },
  stump() { return svg('0 0 100 70', `<ellipse cx="50" cy="62" rx="30" ry="6" fill="rgba(0,0,0,.18)"/><path d="M22 26 L22 56 Q50 66 78 56 L78 26Z" fill="#a8693a" stroke="${OL}" stroke-width="${SW}"/><ellipse cx="50" cy="26" rx="28" ry="10" fill="#e9c08a" stroke="${OL}" stroke-width="${SW}"/><ellipse cx="50" cy="26" rx="16" ry="5" fill="none" stroke="#c48c55" stroke-width="2"/>`, 'sprite'); },
  rock(o = {}) {
    const c = o.c || '#a3a9b0';
    return svg('0 0 100 80', `<ellipse cx="50" cy="72" rx="40" ry="6" fill="rgba(0,0,0,.18)"/>
      <path d="M12 70 L18 40 Q24 20 44 18 L62 14 Q82 20 86 42 L90 70Z" fill="${c}" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/>
      <path d="M30 34 L40 30 M60 26 L70 34 M48 50 L58 54" stroke="#6f767e" stroke-width="3" stroke-linecap="round"/>
      <path d="M22 66 Q50 60 86 66" stroke="#80868d" stroke-width="3" fill="none"/>`, o.cls || 'sprite');
  },
  anvil(o = {}) {
    const glow = o.glow ? `<circle cx="50" cy="40" r="34" fill="url(#ag)"/>` : '';
    return svg('0 0 100 90', `<defs><radialGradient id="ag"><stop offset="0" stop-color="#ffe066" stop-opacity=".9"/><stop offset="1" stop-color="#ffe066" stop-opacity="0"/></radialGradient></defs>${glow}
      <ellipse cx="50" cy="84" rx="34" ry="5" fill="rgba(0,0,0,.2)"/>
      <path d="M26 54 L74 54 L80 82 L20 82Z" fill="#8a8f96" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/>
      <path d="M10 30 L84 30 Q92 30 92 38 L92 40 Q72 42 66 54 L34 54 Q28 42 14 42 Q8 36 10 30Z" fill="#b9bfc6" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/>
      <path d="M18 34 L80 34" stroke="#e3e7eb" stroke-width="3" stroke-linecap="round"/>`, o.cls || 'sprite');
  },
  // Weapon icons by key
  weapon(k, cls = 'icon') {
    const W = {
      club: `<path d="M44 86 L40 46 Q30 18 50 12 Q70 18 60 46 L56 86Z" fill="#b5763a" stroke="${OL}" stroke-width="${SW}"/><circle cx="46" cy="30" r="3" fill="${OL}"/><circle cx="56" cy="40" r="3" fill="${OL}"/><rect x="42" y="74" width="16" height="6" fill="#6b3d1a"/>`,
      knife: `<path d="M50 10 Q64 30 58 58 L42 58 Q36 30 50 10Z" fill="#9aa3ad" stroke="${OL}" stroke-width="${SW}"/><path d="M50 16 L50 54" stroke="#d7dce1" stroke-width="3"/><rect x="43" y="58" width="14" height="30" rx="4" fill="#8a5428" stroke="${OL}" stroke-width="${SW}"/><path d="M43 66 L57 70 M43 74 L57 78" stroke="#e8c27a" stroke-width="2.5"/>`,
      spear: `<rect x="46" y="28" width="8" height="64" rx="3" fill="#a0642c" stroke="${OL}" stroke-width="${SW}"/><path d="M50 4 L62 30 L50 36 L38 30Z" fill="#7c858f" stroke="${OL}" stroke-width="${SW}"/><path d="M45 36 L55 40 M45 42 L55 46" stroke="#e8c27a" stroke-width="2.5"/>`,
      axe: `<rect x="46" y="16" width="8" height="76" rx="3" fill="#a0642c" stroke="${OL}" stroke-width="${SW}"/><path d="M54 14 Q84 6 84 32 Q82 46 54 40Z" fill="#9aa3ad" stroke="${OL}" stroke-width="${SW}"/><path d="M45 22 L55 26 M45 30 L55 34" stroke="#e8c27a" stroke-width="2.5"/>`,
      hammer: `<rect x="46" y="30" width="8" height="62" rx="3" fill="#e6dcc4" stroke="${OL}" stroke-width="${SW}"/><rect x="24" y="10" width="52" height="26" rx="6" fill="#8d949c" stroke="${OL}" stroke-width="${SW}"/><path d="M30 18 L40 18 M60 26 L70 26" stroke="#c3c9cf" stroke-width="3"/>`,
      bow: `<path d="M34 8 Q86 50 34 92" stroke="#a0642c" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M34 8 Q86 50 34 92" stroke="${OL}" stroke-width="2" fill="none"/><line x1="34" y1="8" x2="34" y2="92" stroke="#f4ecd8" stroke-width="2.5"/><path d="M22 50 L74 50" stroke="#6b3d1a" stroke-width="3"/><path d="M74 50 L64 44 L64 56Z" fill="#7c858f" stroke="${OL}" stroke-width="2"/>`,
      blade: `<path d="M50 4 Q70 30 60 66 L40 66 Q30 30 50 4Z" fill="#3a2f4a" stroke="${OL}" stroke-width="${SW}"/><path d="M50 12 L48 60" stroke="#8e7bb5" stroke-width="3"/><rect x="34" y="64" width="32" height="7" rx="3" fill="#c79a3a" stroke="${OL}" stroke-width="2.5"/><rect x="44" y="70" width="12" height="22" rx="4" fill="#7a3a22" stroke="${OL}" stroke-width="${SW}"/>`,
      mace: `<rect x="46" y="38" width="8" height="54" rx="3" fill="#a0642c" stroke="${OL}" stroke-width="${SW}"/><circle cx="50" cy="28" r="18" fill="#9aa3ad" stroke="${OL}" stroke-width="${SW}"/><path d="M50 4 L54 12 L46 12Z M74 28 L66 24 L66 32Z M26 28 L34 24 L34 32Z" fill="#7c858f" stroke="${OL}" stroke-width="2"/>`,
    };
    return svg('0 0 100 100', W[k] || W.club, cls);
  },
  gear(slot, color = '#b9bfc6', cls = 'icon') {
    const G = {
      weapon: null,
      armour: `<path d="M26 20 L40 14 Q50 22 60 14 L74 20 L84 40 L72 46 L70 86 L30 86 L28 46 L16 40Z" fill="${color}" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/><circle cx="42" cy="50" r="4" fill="#8a4a1a"/><circle cx="58" cy="66" r="5" fill="#8a4a1a"/>`,
      helmet: `<path d="M18 62 Q18 20 50 20 Q82 20 82 62Z" fill="${color}" stroke="${OL}" stroke-width="${SW}"/><path d="M22 34 Q8 26 10 8 Q20 24 32 26Z M78 34 Q92 26 90 8 Q80 24 68 26Z" fill="#f4ecd8" stroke="${OL}" stroke-width="${SW}"/><rect x="14" y="58" width="72" height="12" rx="5" fill="#8a5428" stroke="${OL}" stroke-width="${SW}"/>`,
      necklace: `<path d="M22 16 Q50 74 78 16" stroke="#8a5428" stroke-width="5" fill="none"/><path d="M50 50 L64 64 L50 88 L36 64Z" fill="${color}" stroke="${OL}" stroke-width="${SW}"/><circle cx="34" cy="38" r="5" fill="#f4ecd8" stroke="${OL}" stroke-width="2"/><circle cx="66" cy="38" r="5" fill="#f4ecd8" stroke="${OL}" stroke-width="2"/>`,
      ring: `<circle cx="50" cy="60" r="24" fill="none" stroke="#c79a3a" stroke-width="10"/><circle cx="50" cy="60" r="24" fill="none" stroke="${OL}" stroke-width="2"/><path d="M50 14 L64 30 L50 42 L36 30Z" fill="${color}" stroke="${OL}" stroke-width="${SW}"/>`,
    };
    if (slot === 'weapon') return Art.weapon('mace', cls).replace('#9aa3ad', color);
    return svg('0 0 100 100', G[slot], cls);
  },
  // Parametric beast. o: body, belly, kind(boar|wolf|bear|cat|mammoth), crown
  beast(o = {}) {
    const c = o.body || '#8a5a3a', b = o.belly || '#c49a6c', k = o.kind || 'boar';
    let extra = '', ears = '', snout = '';
    if (k === 'boar') { ears = `<path d="M28 34 L22 18 L38 28Z" fill="${c}" stroke="${OL}" stroke-width="${SW}"/>`; snout = `<ellipse cx="14" cy="56" rx="9" ry="8" fill="#e8a0a0" stroke="${OL}" stroke-width="${SW}"/><circle cx="12" cy="54" r="1.5" fill="${OL}"/><circle cx="16" cy="58" r="1.5" fill="${OL}"/>`; extra = `<path d="M22 64 Q12 70 10 60" stroke="#f4ecd8" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M40 26 L44 18 L48 26 L52 18 L56 26 L60 18 L64 26" stroke="${OL}" stroke-width="3" fill="none"/>`; }
    if (k === 'wolf') { ears = `<path d="M26 34 L24 10 L40 28Z M38 30 L42 8 L52 28Z" fill="${c}" stroke="${OL}" stroke-width="${SW}"/>`; snout = `<path d="M24 50 L2 56 L6 62 L26 64Z" fill="${b}" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/><circle cx="4" cy="57" r="2.5" fill="${OL}"/>`; extra = `<path d="M8 62 L11 68 L14 62" fill="#fff" stroke="${OL}" stroke-width="1.5"/><path d="M92 48 Q108 30 100 60" fill="${c}" stroke="${OL}" stroke-width="${SW}"/>`; }
    if (k === 'bear') { ears = `<circle cx="26" cy="30" r="8" fill="${c}" stroke="${OL}" stroke-width="${SW}"/><circle cx="48" cy="28" r="8" fill="${c}" stroke="${OL}" stroke-width="${SW}"/>`; snout = `<ellipse cx="22" cy="58" rx="10" ry="8" fill="${b}" stroke="${OL}" stroke-width="${SW}"/><ellipse cx="18" cy="54" rx="4" ry="3" fill="${OL}"/>`; }
    if (k === 'cat') { ears = `<path d="M24 34 L22 16 L36 28Z M40 30 L46 14 L52 30Z" fill="${c}" stroke="${OL}" stroke-width="${SW}"/>`; snout = `<ellipse cx="20" cy="58" rx="9" ry="7" fill="${b}" stroke="${OL}" stroke-width="${SW}"/><path d="M15 53 L19 56 L23 53Z" fill="#d06a6a"/>`; extra = `<path d="M14 62 L16 80 L20 63 M24 63 L28 80 L30 62" fill="#fff" stroke="${OL}" stroke-width="2"/><path d="M60 30 L64 42 M72 30 L74 42 M84 34 L84 46" stroke="#5a3a1a" stroke-width="4" stroke-linecap="round"/><path d="M94 50 Q112 40 104 22" stroke="${c}" stroke-width="7" fill="none" stroke-linecap="round"/>`; }
    if (k === 'mammoth') { ears = `<path d="M44 32 Q30 30 30 52 Q40 62 52 52Z" fill="${c}" stroke="${OL}" stroke-width="${SW}"/>`; snout = `<path d="M22 54 Q8 70 12 88 Q16 92 20 86 Q18 72 32 62Z" fill="${c}" stroke="${OL}" stroke-width="${SW}"/>`; extra = `<path d="M26 66 Q4 74 6 52" stroke="#f4ecd8" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M26 66 Q4 74 6 52" stroke="${OL}" stroke-width="1.5" fill="none"/><path d="M50 26 Q70 18 92 34" stroke="${OL}" stroke-width="2" fill="none"/>`; }
    const crown = o.crown ? `<path d="M26 22 L28 6 L36 16 L42 2 L48 16 L56 6 L56 22Z" fill="#ffd23f" stroke="${OL}" stroke-width="2.5"/>` : '';
    const body = `<ellipse cx="60" cy="96" rx="40" ry="6" fill="rgba(0,0,0,.2)"/>
      <rect x="36" y="70" width="12" height="24" rx="5" fill="${c}" stroke="${OL}" stroke-width="${SW}"/><rect x="78" y="70" width="12" height="24" rx="5" fill="${c}" stroke="${OL}" stroke-width="${SW}"/>
      <ellipse cx="66" cy="58" rx="34" ry="24" fill="${c}" stroke="${OL}" stroke-width="${SW}"/>
      <ellipse cx="64" cy="68" rx="22" ry="10" fill="${b}" opacity=".7"/>
      <rect x="50" y="72" width="12" height="24" rx="5" fill="${c}" stroke="${OL}" stroke-width="${SW}"/><rect x="88" y="72" width="11" height="22" rx="5" fill="${c}" stroke="${OL}" stroke-width="${SW}"/>
      ${ears}<circle cx="36" cy="52" r="20" fill="${c}" stroke="${OL}" stroke-width="${SW}"/>${snout}
      <path d="M26 42 L38 46" stroke="${OL}" stroke-width="3" stroke-linecap="round"/><circle cx="31" cy="49" r="3.5" fill="#ffe04a" stroke="${OL}" stroke-width="1.5"/><circle cx="30" cy="49" r="1.6" fill="${OL}"/>
      ${extra}${crown}`;
    return svg('-4 0 116 104', body, o.cls || 'sprite');
  },
  chest(kind = 'wood', cls = 'icon') {
    const c = kind === 'gem' ? '#7a4bd1' : '#b5763a', t = kind === 'gem' ? '#ffd23f' : '#d7dce1';
    return svg('0 0 100 100', `<ellipse cx="50" cy="90" rx="38" ry="5" fill="rgba(0,0,0,.2)"/><rect x="12" y="44" width="76" height="44" rx="6" fill="${c}" stroke="${OL}" stroke-width="${SW}"/><path d="M12 46 Q12 16 50 16 Q88 16 88 46Z" fill="${c}" stroke="${OL}" stroke-width="${SW}"/><rect x="12" y="42" width="76" height="8" fill="${t}" stroke="${OL}" stroke-width="2"/><rect x="42" y="38" width="16" height="22" rx="3" fill="${t}" stroke="${OL}" stroke-width="2.5"/><circle cx="50" cy="50" r="3" fill="${OL}"/>`, cls);
  },
  coin: () => svg('0 0 40 40', `<circle cx="20" cy="20" r="16" fill="#ffc93c" stroke="${OL}" stroke-width="3"/><circle cx="20" cy="20" r="9" fill="none" stroke="#e09a1a" stroke-width="3"/>`, 'ico'),
  gem: () => svg('0 0 40 40', `<path d="M20 4 L34 16 L20 36 L6 16Z" fill="#d64be8" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/><path d="M12 16 L28 16 L20 6" fill="#f3a6ff"/>`, 'ico'),
  energy: () => svg('0 0 40 40', `<path d="M24 3 L8 22 L18 22 L14 37 L32 16 L22 16Z" fill="#3fb6ff" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/>`, 'ico'),
  wood: () => svg('0 0 40 40', `<rect x="4" y="12" width="32" height="16" rx="8" fill="#a8693a" stroke="${OL}" stroke-width="3"/><ellipse cx="30" cy="20" rx="5" ry="7" fill="#e9c08a" stroke="${OL}" stroke-width="2"/>`, 'ico'),
  stone: () => svg('0 0 40 40', `<path d="M6 32 L8 18 Q14 6 26 8 Q36 12 34 32Z" fill="#a3a9b0" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/>`, 'ico'),
  skull: () => svg('0 0 40 40', `<path d="M8 20 Q8 4 20 4 Q32 4 32 20 L28 24 L28 32 L12 32 L12 24Z" fill="#fff" stroke="${OL}" stroke-width="3"/><circle cx="15" cy="17" r="4" fill="${OL}"/><circle cx="25" cy="17" r="4" fill="${OL}"/>`, 'ico'),
  fire: () => svg('0 0 100 100', `<ellipse cx="50" cy="90" rx="34" ry="6" fill="rgba(0,0,0,.2)"/><path d="M22 86 L78 74 M22 74 L78 86" stroke="#8a5428" stroke-width="9" stroke-linecap="round"/><path d="M50 10 Q74 40 66 64 Q60 80 50 80 Q34 80 32 62 Q30 44 44 36 Q42 50 50 52 Q56 34 50 10Z" fill="#ffb62e" stroke="${OL}" stroke-width="${SW}"/><path d="M50 50 Q60 62 54 74 Q44 76 44 66 Q44 58 50 50Z" fill="#fff0a0"/>`, 'sprite'),
  bush: () => svg('0 0 60 40', `<path d="M6 36 Q2 22 14 20 Q16 8 30 10 Q44 6 46 20 Q58 22 54 36Z" fill="#9bbf3a" stroke="${OL}" stroke-width="2.5"/>`, 'sprite'),
};
window.Art = Art;
