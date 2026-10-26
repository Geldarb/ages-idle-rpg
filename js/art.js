// All art drawn in code as inline SVG strings. Original designs.
// Style: thick dark-brown outlines, flat cel shading (one shade + one highlight), soft ground shadows.
const OL = '#2e1c0e'; // outline colour
const SW = 3.5;
let _uid = 0; const uid = () => 'a' + (++_uid);
function svg(vb, body, cls = '') { return `<svg class="${cls}" viewBox="${vb}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`; }
// Union-of-circles blob with one shared outline: outline pass then fill pass.
function blob(circles, fill, sw = SW) { return circles.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r + sw / 2}" fill="${OL}"/>`).join('') + circles.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r - 0.2}" fill="${fill}"/>`).join(''); }
function mix(hex, amt) { // amt<0 darker, >0 lighter
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  r = Math.round(r + (t - r) * p); g = Math.round(g + (t - g) * p); b = Math.round(b + (t - b) * p);
  return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
}
const shadow = (cx, cy, rx, ry = 5) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="rgba(60,35,10,.22)"/>`;

const Art = {
  mix,
  // Big-headed caveman. opts: skin, hair, style(afro|long|skull|bun), outfit, tool, flip, mood(happy|grim)
  caveman(o = {}) {
    const skin = o.skin || '#f4c592', sk2 = mix(skin, -0.14), hair = o.hair || '#4a2a14', hr2 = mix(hair, 0.22);
    const outfit = o.outfit || '#e8862e', of2 = mix(outfit, -0.2), spot = mix(outfit, -0.55);
    const tool = o.tool ? Art.tool(o.tool) : '';
    const cid = uid();
    let back = '', front = '';
    if (o.style === 'long') {
      back = `<path d="M22 40 Q16 96 30 104 L70 104 Q84 96 78 40 Z" fill="${hair}" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/><path d="M28 70 Q26 90 32 98 M72 70 Q74 90 68 98" stroke="${hr2}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
      front = `<path d="M23 50 Q22 14 50 14 Q78 14 77 50 L70 40 L64 46 L58 36 L50 44 L42 36 L36 46 L30 40 Z" fill="${hair}" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/><path d="M34 22 Q44 16 56 18" stroke="${hr2}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    } else if (o.style === 'afro') {
      front = blob([[30, 30, 12], [44, 20, 14], [60, 20, 14], [72, 32, 12], [24, 44, 9], [76, 46, 9], [50, 28, 14]], hair) + `<path d="M36 18 q4 -4 8 0 M56 16 q4 -4 8 0 M28 34 q3 -3 6 0 M66 30 q3 -3 6 0" stroke="${hr2}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    } else if (o.style === 'bun') {
      front = blob([[50, 12, 9]], hair) + `<path d="M44 8 q5 -3 10 0" stroke="${hr2}" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M24 50 Q22 20 50 20 Q78 20 76 50 Q70 34 56 32 Q50 40 40 32 Q30 36 24 50Z" fill="${hair}" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/><rect x="44" y="16" width="12" height="6" rx="2" fill="#e8c27a" stroke="${OL}" stroke-width="2"/>`;
      back = `<path d="M24 46 Q20 74 28 80 L34 60Z M76 46 Q80 74 72 80 L66 60Z" fill="${hair}" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/>`;
    } else { // horned skull helmet over shaggy hair
      back = `<path d="M22 44 Q16 84 28 92 L40 84 L50 92 L60 84 L72 92 Q84 84 78 44Z" fill="${hair}" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/>`;
      front = `<path d="M26 30 Q8 30 6 8 Q18 20 32 20Z" fill="#f6eedb" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/><path d="M74 30 Q92 30 94 8 Q82 20 68 20Z" fill="#f6eedb" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/>
        <path d="M24 46 Q22 10 50 10 Q78 10 76 46 L68 42 L62 48 L56 42 L50 48 L44 42 L38 48 L32 42Z" fill="#f6eedb" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/>
        <path d="M30 38 Q34 22 50 18" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".9"/><path d="M62 40 Q72 34 72 24" stroke="#d6c8a8" stroke-width="3" fill="none" stroke-linecap="round"/>
        <path d="M36 26 Q42 22 46 28 Q44 34 38 33Z M64 26 Q58 22 54 28 Q56 34 62 33Z" fill="${OL}"/><path d="M48 34 L50 30 L52 34Z" fill="${OL}"/>`;
    }
    const grim = o.mood === 'grim' || o.style === 'skull';
    const brows = grim ? `<path d="M33 52 L45 55 M67 52 L55 55" stroke="${OL}" stroke-width="3.5" stroke-linecap="round"/>` : `<path d="M34 51 Q39 48 44 51 M56 51 Q61 48 66 51" stroke="${OL}" stroke-width="3" fill="none" stroke-linecap="round"/>`;
    const mouth = grim ? `<path d="M44 74 Q50 71 56 74" stroke="${OL}" stroke-width="3" fill="none" stroke-linecap="round"/>` : `<path d="M42 71 Q50 79 58 71 Z" fill="#7a2a1a" stroke="${OL}" stroke-width="2.5" stroke-linejoin="round"/><path d="M45 72 L55 72" stroke="#fff" stroke-width="2"/>`;
    const neck = o.style === 'skull' ? `<path d="M34 84 Q50 94 66 84" stroke="#e8dcc0" stroke-width="3" fill="none"/><path d="M38 86 l-2 6 M46 89 l0 6 M54 89 l0 6 M62 86 l2 6" stroke="#f6eedb" stroke-width="3.5" stroke-linecap="round"/>` : `<circle cx="50" cy="90" r="3.2" fill="#6ac0e0" stroke="${OL}" stroke-width="2"/>`;
    const body = `
      ${shadow(50, 136, 24, 5)}
      <path d="M43 110 L42 132 M57 110 L58 132" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>
      <path d="M34 133 Q36 128 44 129 L45 134Z M66 133 Q64 128 56 129 L55 134Z" fill="${OL}" stroke="${OL}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M33 88 Q22 98 24 110" stroke="${OL}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M33 88 Q22 98 24 110" stroke="${skin}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <defs><clipPath id="${cid}"><path d="M32 82 L68 82 Q74 98 72 116 L64 112 L57 118 L50 112 L43 118 L36 112 L28 116 Q26 98 32 82Z"/></clipPath></defs>
      <g clip-path="url(#${cid})"><rect x="20" y="78" width="60" height="44" fill="${outfit}"/><rect x="56" y="78" width="24" height="44" fill="${of2}"/>
        <path d="M36 92 q4 -3 7 1 q-1 5 -6 4 q-3 -2 -1 -5Z M56 88 q5 -2 6 3 q-3 4 -7 1Z M46 104 q4 -3 7 1 q-2 5 -6 3Z M62 104 q3 -2 5 2 q-2 3 -5 1Z M30 106 q3 -2 5 1 q-2 3 -5 1Z" fill="${spot}"/>
        <path d="M30 82 L70 116" stroke="${mix(outfit, -0.4)}" stroke-width="5"/></g>
      <path d="M32 82 L68 82 Q74 98 72 116 L64 112 L57 118 L50 112 L43 118 L36 112 L28 116 Q26 98 32 82Z" fill="none" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/>
      ${neck}
      ${back}
      <defs><clipPath id="${cid}h"><rect x="25" y="26" width="50" height="58" rx="14"/></clipPath></defs>
      <rect x="25" y="26" width="50" height="58" rx="14" fill="${skin}"/>
      <g clip-path="url(#${cid}h)"><rect x="62" y="20" width="16" height="70" fill="${sk2}"/><rect x="20" y="76" width="60" height="10" fill="${sk2}" opacity=".6"/></g>
      <rect x="25" y="26" width="50" height="58" rx="14" fill="none" stroke="${OL}" stroke-width="${SW}"/>
      <ellipse cx="24" cy="58" rx="4" ry="6" fill="${skin}" stroke="${OL}" stroke-width="2.5"/><ellipse cx="76" cy="58" rx="4" ry="6" fill="${sk2}" stroke="${OL}" stroke-width="2.5"/>
      ${brows}
      <ellipse cx="39.5" cy="60" rx="3.6" ry="4.6" fill="${OL}"/><ellipse cx="60.5" cy="60" rx="3.6" ry="4.6" fill="${OL}"/>
      <circle cx="40.8" cy="58.2" r="1.4" fill="#fff"/><circle cx="61.8" cy="58.2" r="1.4" fill="#fff"/>
      <path d="M50 61 Q55 67 49 69" stroke="${mix(skin, -0.35)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      ${mouth}
      <ellipse cx="33" cy="69" rx="4" ry="2.3" fill="#f0806a" opacity=".55"/><ellipse cx="67" cy="69" rx="4" ry="2.3" fill="#f0806a" opacity=".55"/>
      ${front}
      <g transform="translate(72 100) rotate(-18)">${tool}</g>
      <path d="M67 88 Q78 94 74 102" stroke="${OL}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M67 88 Q78 94 74 102" stroke="${skin}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="73" cy="102" r="5" fill="${skin}" stroke="${OL}" stroke-width="2.5"/>`;
    return svg('0 0 100 140', o.flip ? `<g transform="translate(100 0) scale(-1 1)">${body}</g>` : body, o.cls || 'sprite');
  },
  // tool held in hand, origin at grip
  tool(t) {
    const handle = (len, c = '#a8682e') => `<rect x="-3.5" y="${-len}" width="7" height="${len + 8}" rx="3.5" fill="${c}" stroke="${OL}" stroke-width="2.5"/><path d="M-1 ${-len + 4} L-1 4" stroke="${mix(c, 0.3)}" stroke-width="1.6"/>`;
    const rope = (y) => `<path d="M-5 ${y} L5 ${y + 3} M-5 ${y + 4} L5 ${y + 7}" stroke="#e8c27a" stroke-width="2.4" stroke-linecap="round"/>`;
    switch (t) {
      case 'axe': return handle(36) + `<path d="M2 -38 Q22 -46 22 -26 Q20 -16 2 -22Z" fill="#aab2bb" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/><path d="M8 -36 Q18 -38 18 -30" stroke="#e4e8ec" stroke-width="2.5" fill="none" stroke-linecap="round"/>` + rope(-34);
      case 'pick': return handle(36) + `<path d="M-20 -30 Q0 -46 20 -30 L14 -27 Q0 -36 -14 -27Z" fill="#aab2bb" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/>` + rope(-36);
      case 'hammer': return handle(30) + `<path d="M-13 -44 L13 -44 Q16 -36 13 -28 L-13 -28 Q-16 -36 -13 -44Z" fill="#b8bec6" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/><path d="M-9 -40 L6 -40" stroke="#eef0f2" stroke-width="2.5" stroke-linecap="round"/>` + rope(-30);
      case 'club': return `<path d="M-3 8 L-5 -12 Q-12 -38 0 -44 Q12 -38 5 -12 L3 8Z" fill="#b8763a" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/><path d="M-4 -30 Q-3 -38 1 -40" stroke="#dca066" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="3" cy="-28" r="2" fill="${OL}"/><circle cx="-2" cy="-20" r="1.8" fill="${OL}"/>`;
      case 'bow': return `<path d="M-6 -40 Q18 -16 -6 8" stroke="${OL}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M-6 -40 Q18 -16 -6 8" stroke="#b8763a" stroke-width="4" fill="none" stroke-linecap="round"/><line x1="-6" y1="-40" x2="-6" y2="8" stroke="#f6eedb" stroke-width="1.6"/>` + rope(-18);
      case 'staff': return handle(48, '#7a4a22') + blob([[0, -52, 8]], '#6ee0ff', 3) + `<circle cx="-2.5" cy="-55" r="2.6" fill="#fff"/><path d="M-8 -44 L-4 -48 M8 -44 L4 -48" stroke="#e8c27a" stroke-width="2.5" stroke-linecap="round"/>`;
      default: return '';
    }
  },
  tree(o = {}) {
    const g = o.g || '#8cc63f', d = mix(g, -0.25), l = mix(g, 0.3), tr = '#9a6232';
    return svg('0 0 100 120', `${shadow(50, 113, 30, 6)}
      <path d="M40 114 Q44 100 43 70 L57 70 Q56 100 62 114 Q50 118 40 114Z" fill="${tr}" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/>
      <path d="M53 76 L53 106" stroke="${mix(tr, -0.25)}" stroke-width="5" stroke-linecap="round"/><path d="M46 84 Q48 92 46 100" stroke="#c08a52" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      ${blob([[30, 54, 18], [50, 60, 18], [70, 54, 18], [24, 38, 16], [50, 30, 22], [76, 38, 16], [40, 20, 14], [62, 20, 14]], d)}
      ${[[30, 50, 15], [50, 54, 15], [70, 50, 14], [26, 36, 13], [50, 28, 19], [74, 36, 13], [42, 20, 12], [60, 20, 12]].map(([x, y, r]) => `<circle cx="${x}" cy="${y - 2}" r="${r}" fill="${g}"/>`).join('')}
      ${[[42, 18, 7], [58, 16, 6], [28, 32, 6], [50, 28, 8]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${l}"/>`).join('')}
      <path d="M22 58 q6 4 12 0 M48 64 q6 4 12 0 M66 58 q5 3 10 0" stroke="${mix(g, -0.38)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`, o.cls || 'sprite');
  },
  stump() { return svg('0 0 100 76', `${shadow(50, 68, 34, 6)}<path d="M20 30 L20 58 Q14 66 26 64 Q50 72 74 64 Q86 66 80 58 L80 30Z" fill="#a8693a" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/><path d="M66 34 L66 64" stroke="#7e4a24" stroke-width="7"/><path d="M32 40 L32 60 M46 42 L46 64" stroke="#7e4a24" stroke-width="2.5" stroke-linecap="round"/>
    <ellipse cx="50" cy="30" rx="30" ry="11" fill="#eec58e" stroke="${OL}" stroke-width="${SW}"/><ellipse cx="50" cy="30" rx="20" ry="7" fill="none" stroke="#cf9a60" stroke-width="2.2"/><ellipse cx="50" cy="30" rx="10" ry="3.5" fill="none" stroke="#cf9a60" stroke-width="2.2"/><path d="M50 30 L66 24" stroke="#b88050" stroke-width="2"/>`, 'sprite'); },
  rock(o = {}) {
    const c = o.c || '#a7adb5';
    return svg('0 0 100 84', `${shadow(50, 76, 44, 6)}
      <path d="M10 74 L14 46 Q20 22 42 18 L62 12 Q84 18 88 42 L92 74Z" fill="${c}" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/>
      <path d="M12 74 L14 62 Q50 54 90 62 L92 74Z" fill="${mix(c, -0.25)}"/>
      <path d="M62 14 Q84 20 88 42 L92 74 L74 74 Q80 44 62 14Z" fill="${mix(c, -0.14)}"/>
      <path d="M22 40 Q28 26 42 22 L58 18" stroke="${mix(c, 0.45)}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M36 44 L44 40 L48 48 M62 30 L70 38" stroke="${mix(c, -0.4)}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M10 74 L14 46 Q20 22 42 18 L62 12 Q84 18 88 42 L92 74Z" fill="none" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/>
      <ellipse cx="6" cy="76" rx="5" ry="3.5" fill="${c}" stroke="${OL}" stroke-width="2.5"/><ellipse cx="96" cy="77" rx="4" ry="3" fill="${c}" stroke="${OL}" stroke-width="2.5"/>`, o.cls || 'sprite');
  },
  // Stone anvil on a log base
  anvil(o = {}) {
    const g = uid();
    const glow = o.glow ? `<defs><radialGradient id="${g}"><stop offset="0" stop-color="#ffe066" stop-opacity=".9"/><stop offset="1" stop-color="#ffe066" stop-opacity="0"/></radialGradient></defs><circle cx="50" cy="40" r="40" fill="url(#${g})"/>` : '';
    return svg('0 0 100 92', `${glow}${shadow(50, 86, 38, 5)}
      <path d="M28 56 L72 56 L76 84 Q50 90 24 84Z" fill="#a8693a" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/><path d="M62 58 L64 86" stroke="#7e4a24" stroke-width="6"/><path d="M36 62 L36 82" stroke="#7e4a24" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M6 28 L82 26 Q94 26 94 36 Q80 40 72 46 L70 58 L30 58 L28 46 Q14 42 6 36Z" fill="#9aa1aa" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/>
      <path d="M30 46 L70 46 L70 58 L30 58Z" fill="#7a818a"/><path d="M28 46 Q14 42 6 36 L6 28" fill="none"/>
      <path d="M12 30 L82 29" stroke="#dfe3e8" stroke-width="4" stroke-linecap="round"/>
      <path d="M6 28 L82 26 Q94 26 94 36 Q80 40 72 46 L70 58 L30 58 L28 46 Q14 42 6 36Z" fill="none" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/>
      <path d="M44 38 L52 36 L56 42" stroke="#5f666e" stroke-width="2.5" fill="none" stroke-linecap="round"/>`, o.cls || 'sprite');
  },
  // Weapon icons by key
  weapon(k, cls = 'icon') {
    const wd = (x, y, w, h, c = '#a8682e') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3.5" fill="${c}" stroke="${OL}" stroke-width="${SW}"/><path d="M${x + 2.5} ${y + 4} L${x + 2.5} ${y + h - 4}" stroke="${mix(c, 0.3)}" stroke-width="2"/>`;
    const rope = (y) => `<path d="M43 ${y} L57 ${y + 4} M43 ${y + 6} L57 ${y + 10}" stroke="#ecc77e" stroke-width="3" stroke-linecap="round"/>`;
    const W = {
      club: `<path d="M44 90 L40 50 Q28 18 50 10 Q72 18 60 50 L56 90Z" fill="#b8763a" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/><path d="M56 22 Q66 30 60 50 L56 90 L52 90 Q58 50 56 22Z" fill="#8e5626"/><path d="M42 36 Q42 22 50 16" stroke="#e0a870" stroke-width="3.5" fill="none" stroke-linecap="round"/><circle cx="47" cy="34" r="3" fill="${OL}"/><circle cx="56" cy="44" r="3" fill="${OL}"/><rect x="41" y="76" width="18" height="7" fill="#6b3d1a" stroke="${OL}" stroke-width="2"/>`,
      knife: `<path d="M50 8 Q66 30 59 60 L41 60 Q34 30 50 8Z" fill="#9ea6b0" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/><path d="M50 8 Q66 30 59 60 L52 60 Q58 30 50 8Z" fill="#7d858f"/><path d="M45 52 Q42 30 49 16" stroke="#e4e8ec" stroke-width="3" fill="none" stroke-linecap="round"/>` + wd(43, 60, 14, 30, '#8a5428') + rope(66),
      spear: wd(46, 30, 8, 64) + `<path d="M50 4 L64 32 L50 40 L36 32Z" fill="#8a929c" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/><path d="M50 4 L64 32 L50 40Z" fill="#6c747d"/><path d="M44 30 L50 12" stroke="#d8dde2" stroke-width="2.5" stroke-linecap="round"/>` + rope(40),
      axe: wd(46, 16, 8, 78) + `<path d="M54 12 Q88 4 88 32 Q86 48 54 42Z" fill="#a0a8b2" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/><path d="M80 14 Q90 26 86 40 Q80 46 72 44 Q84 30 80 14Z" fill="#7d858f"/><path d="M60 18 Q74 12 80 20" stroke="#e4e8ec" stroke-width="3" fill="none" stroke-linecap="round"/>` + rope(22),
      hammer: wd(46, 32, 8, 62, '#e6dcc4') + `<path d="M22 12 L78 12 Q82 24 78 38 L22 38 Q18 24 22 12Z" fill="#949ba4" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/><path d="M22 30 L78 30 L78 38 L22 38Z" fill="#737a83"/><path d="M28 18 L60 18" stroke="#d4d9de" stroke-width="3.5" stroke-linecap="round"/>` + rope(40),
      bow: `<path d="M32 6 Q88 50 32 94" stroke="${OL}" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M32 6 Q88 50 32 94" stroke="#b8763a" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M40 16 Q62 34 64 46" stroke="#e0a870" stroke-width="2.5" fill="none" stroke-linecap="round"/><line x1="32" y1="6" x2="32" y2="94" stroke="#f6eedb" stroke-width="2.5"/><path d="M18 50 L72 50" stroke="${OL}" stroke-width="5"/><path d="M18 50 L72 50" stroke="#8a5428" stroke-width="2.5"/><path d="M80 50 L68 43 L68 57Z" fill="#8a929c" stroke="${OL}" stroke-width="2.5" stroke-linejoin="round"/><path d="M14 44 L22 50 L14 56" stroke="#e05a3a" stroke-width="4" fill="none"/>`,
      blade: `<path d="M50 4 Q72 30 62 68 L38 68 Q28 30 50 4Z" fill="#4a3a66" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/><path d="M50 4 Q72 30 62 68 L54 68 Q62 30 50 4Z" fill="#33284a"/><path d="M46 14 Q40 36 44 60" stroke="#a894d8" stroke-width="3.5" fill="none" stroke-linecap="round"/><rect x="32" y="66" width="36" height="8" rx="4" fill="#d6a640" stroke="${OL}" stroke-width="3"/>` + wd(44, 74, 12, 20, '#7a3a22'),
      mace: wd(46, 40, 8, 54) + blob([[50, 28, 18]], '#9ea6b0') + `<path d="M58 14 Q68 22 66 36 Q60 44 52 46 Q66 32 58 14Z" fill="#7d858f"/><path d="M38 22 Q42 14 50 12" stroke="#e4e8ec" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M50 2 L55 12 L45 12Z M76 28 L66 23 L66 33Z M24 28 L34 23 L34 33Z" fill="#c8ced4" stroke="${OL}" stroke-width="2.5" stroke-linejoin="round"/>` + rope(46),
    };
    return svg('0 0 100 100', W[k] || W.club, cls);
  },
  gear(slot, color = '#b9bfc6', cls = 'icon') {
    const d = mix(color, -0.3), l = mix(color, 0.4);
    const G = {
      armour: `<path d="M26 18 L40 12 Q50 22 60 12 L74 18 L86 40 L72 46 L70 88 L30 88 L28 46 L14 40Z" fill="${color}" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/><path d="M58 20 L72 22 L70 88 L56 88Z" fill="${d}" opacity=".7"/><path d="M30 88 L36 80 L42 88 L50 80 L58 88 L64 80 L70 88" fill="none" stroke="${OL}" stroke-width="2.5"/><circle cx="40" cy="50" r="4.5" fill="${mix(color, -0.55)}"/><circle cx="56" cy="66" r="5" fill="${mix(color, -0.55)}"/><circle cx="38" cy="72" r="3" fill="${mix(color, -0.55)}"/><path d="M34 30 Q40 24 46 26" stroke="${l}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`,
      helmet: `<path d="M22 34 Q4 28 6 6 Q18 22 32 24Z M78 34 Q96 28 94 6 Q82 22 68 24Z" fill="#f6eedb" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/><path d="M16 64 Q16 18 50 18 Q84 18 84 64Z" fill="${color}" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/><path d="M60 22 Q84 30 84 64 L66 64 Q70 34 60 22Z" fill="${d}" opacity=".7"/><path d="M26 46 Q28 28 44 24" stroke="${l}" stroke-width="4" fill="none" stroke-linecap="round"/><rect x="12" y="60" width="76" height="13" rx="6" fill="#8a5428" stroke="${OL}" stroke-width="${SW}"/><path d="M18 64 L80 64" stroke="#b07a44" stroke-width="2.5"/>`,
      necklace: `<path d="M20 14 Q50 78 80 14" stroke="${OL}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M20 14 Q50 78 80 14" stroke="#9a6432" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M50 48 L66 64 L50 90 L34 64Z" fill="${color}" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/><path d="M50 48 L66 64 L50 90Z" fill="${d}"/><path d="M42 62 L50 54" stroke="${l}" stroke-width="3" stroke-linecap="round"/><path d="M28 34 L32 44 L36 34Z M64 34 L68 44 L72 34Z" fill="#f6eedb" stroke="${OL}" stroke-width="2.5" stroke-linejoin="round"/>`,
      ring: `<circle cx="50" cy="62" r="25" fill="none" stroke="${OL}" stroke-width="15"/><circle cx="50" cy="62" r="25" fill="none" stroke="#d6a640" stroke-width="8"/><path d="M30 54 Q34 44 44 40" stroke="#ffe7a0" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M50 10 L66 28 L50 44 L34 28Z" fill="${color}" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/><path d="M50 10 L66 28 L50 44Z" fill="${d}"/><path d="M42 28 L50 18" stroke="${l}" stroke-width="3" stroke-linecap="round"/>`,
    };
    if (slot === 'weapon') return Art.weapon('mace', cls).replace(/#9ea6b0/g, color).replace(/#7d858f/g, d);
    return svg('0 0 100 100', G[slot], cls);
  },
  // Parametric beast. o: body, belly, kind(boar|wolf|bear|cat|mammoth), crown
  beast(o = {}) {
    const c = o.body || '#8a5a3a', b = o.belly || '#c49a6c', k = o.kind || 'boar', dk = mix(c, -0.22), lt = mix(c, 0.25);
    const S = `stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"`;
    const cid = uid();
    let ears = '', snout = '', extra = '', tail = '', back = '';
    const eye = (x, y) => `<path d="M${x - 7} ${y - 6} L${x + 5} ${y - 2}" stroke="${OL}" stroke-width="4" stroke-linecap="round"/><ellipse cx="${x}" cy="${y + 2}" rx="4.5" ry="4" fill="#ffe14a" stroke="${OL}" stroke-width="2"/><circle cx="${x - 1}" cy="${y + 2.5}" r="2" fill="${OL}"/>`;
    if (k === 'boar') { ears = `<path d="M26 36 L18 16 L38 28Z" fill="${c}" ${S}/><path d="M24 30 L21 22 L30 28Z" fill="#e8a0a0"/>`; back = `<path d="M44 34 L48 22 L54 32 L60 20 L64 32 L72 22 L74 34" fill="${dk}" ${S}/>`; snout = `<ellipse cx="13" cy="58" rx="10" ry="9" fill="#efa8a8" ${S}/><ellipse cx="10" cy="56" rx="2" ry="3" fill="${OL}"/><ellipse cx="16" cy="56" rx="2" ry="3" fill="${OL}"/>`; extra = `<path d="M22 66 Q10 72 8 58" stroke="${OL}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M22 66 Q10 72 8 58" stroke="#f6eedb" stroke-width="4" fill="none" stroke-linecap="round"/>`; tail = `<path d="M98 54 q8 -2 6 6 q-4 2 -2 -3" stroke="${OL}" stroke-width="3" fill="none"/>`; }
    if (k === 'wolf') { ears = `<path d="M24 36 L22 8 L42 28Z M38 30 L44 6 L56 30Z" fill="${c}" ${S}/><path d="M26 28 L25 16 L34 26Z" fill="${b}"/>`; snout = `<path d="M24 50 L0 56 Q0 64 6 64 L28 66Z" fill="${b}" ${S}/><ellipse cx="2" cy="57" rx="3.5" ry="3" fill="${OL}"/>`; extra = `<path d="M8 63 L11 70 L14 63 M17 64 L19 70 L22 64" fill="#fff" stroke="${OL}" stroke-width="1.8" stroke-linejoin="round"/>`; tail = `<path d="M94 52 Q116 40 108 18 Q104 34 92 42Z" fill="${c}" ${S}/><path d="M106 24 Q108 32 102 38" stroke="${lt}" stroke-width="3" fill="none"/>`; back = `<path d="M46 36 L50 28 L54 36 L58 28 L62 36" fill="${dk}" ${S}/>`; }
    if (k === 'bear') { ears = blob([[24, 32, 8], [48, 28, 8]], c) + `<circle cx="24" cy="32" r="4" fill="${b}"/><circle cx="48" cy="28" r="4" fill="${b}"/>`; snout = `<ellipse cx="20" cy="60" rx="12" ry="9" fill="${b}" ${S}/><ellipse cx="14" cy="55" rx="5" ry="3.5" fill="${OL}"/><path d="M14 64 Q20 68 26 64" stroke="${OL}" stroke-width="2.5" fill="none"/>`; extra = `<path d="M15 64 L17 69 L19 64" fill="#fff" stroke="${OL}" stroke-width="1.5"/>`; }
    if (k === 'cat') { ears = `<path d="M22 36 L20 14 L38 28Z M40 30 L48 12 L54 32Z" fill="${c}" ${S}/><path d="M24 30 L23 20 L31 27Z" fill="#e8a0a0"/>`; snout = `<ellipse cx="20" cy="60" rx="10" ry="7.5" fill="${b}" ${S}/><path d="M14 54 L19 58 L24 54Z" fill="#d06a6a" stroke="${OL}" stroke-width="1.5"/>`; extra = `<path d="M13 64 L16 84 L20 65Z M24 65 L28 84 L31 64Z" fill="#fff" ${S}/><path d="M60 36 L63 48 M72 34 L74 48 M84 38 L84 50" stroke="${mix(c, -0.5)}" stroke-width="4.5" stroke-linecap="round"/>`; tail = `<path d="M96 52 Q116 44 108 22" stroke="${OL}" stroke-width="11" fill="none" stroke-linecap="round"/><path d="M96 52 Q116 44 108 22" stroke="${c}" stroke-width="5" fill="none" stroke-linecap="round"/>`; }
    if (k === 'mammoth') { back = blob([[60, 34, 18], [80, 40, 14]], dk); ears = `<path d="M46 32 Q28 28 28 54 Q40 66 54 54Z" fill="${dk}" ${S}/>`; snout = `<path d="M22 54 Q6 70 10 92 Q16 98 22 90 Q20 74 34 62Z" fill="${c}" ${S}/><path d="M14 74 L20 76 M13 82 L19 83" stroke="${dk}" stroke-width="2.5" stroke-linecap="round"/>`; extra = `<path d="M28 66 Q2 76 4 50" stroke="${OL}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M28 66 Q2 76 4 50" stroke="#f6eedb" stroke-width="5" fill="none" stroke-linecap="round"/>`; tail = `<path d="M100 56 Q108 62 104 72" stroke="${OL}" stroke-width="4" fill="none" stroke-linecap="round"/>`; }
    const crown = o.crown ? `<path d="M22 24 L24 4 L33 15 L40 0 L47 15 L56 4 L58 24Z" fill="#ffd23f" ${S}/><path d="M22 24 L58 24 L58 19 L22 19Z" fill="#e8a51a" stroke="${OL}" stroke-width="2.5"/><circle cx="40" cy="12" r="3" fill="#e0503a" stroke="${OL}" stroke-width="1.5"/>` : '';
    const leg = (x, y, w, h, col) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${col}" ${S}/><path d="M${x} ${y + h - 6} L${x + w} ${y + h - 6}" stroke="${OL}" stroke-width="2"/>`;
    const body = `${shadow(62, 98, 44, 6)}
      ${tail}${leg(36, 70, 12, 26, dk)}${leg(78, 70, 12, 26, dk)}
      ${back}
      <defs><clipPath id="${cid}"><ellipse cx="66" cy="58" rx="34" ry="25"/></clipPath></defs>
      <ellipse cx="66" cy="58" rx="${34 + SW / 2}" ry="${25 + SW / 2}" fill="${OL}"/><ellipse cx="66" cy="58" rx="34" ry="25" fill="${c}"/>
      <g clip-path="url(#${cid})"><ellipse cx="66" cy="84" rx="40" ry="14" fill="${dk}"/><ellipse cx="62" cy="70" rx="22" ry="9" fill="${b}" opacity=".85"/><path d="M50 40 Q66 32 84 38" stroke="${lt}" stroke-width="5" fill="none" stroke-linecap="round"/></g>
      ${leg(50, 72, 12, 26, c)}${leg(88, 72, 11, 24, c)}
      ${ears}${blob([[36, 52, 20]], c)}<path d="M22 46 Q30 36 44 38" stroke="${lt}" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M40 68 Q52 64 54 52" stroke="${dk}" stroke-width="5" fill="none" stroke-linecap="round"/>${snout}
      ${eye(31, 48)}
      ${extra}${crown}`;
    return svg('-4 -2 120 106', body, o.cls || 'sprite');
  },
  chest(kind = 'wood', cls = 'icon') {
    const c = kind === 'gem' ? '#7a4bd1' : '#b8763a', dc = mix(c, -0.25), t = kind === 'gem' ? '#ffd23f' : '#c8ced4', dt = mix(t, -0.25);
    return svg('0 0 100 100', `${shadow(50, 92, 40, 5)}
      <rect x="10" y="44" width="80" height="46" rx="6" fill="${c}" stroke="${OL}" stroke-width="${SW}"/><rect x="12" y="74" width="76" height="14" fill="${dc}"/>
      <path d="M10 46 Q10 14 50 14 Q90 14 90 46Z" fill="${c}" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/><path d="M18 36 Q22 22 40 20" stroke="${mix(c, 0.3)}" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M12 60 L88 60 M12 30 Q50 26 88 30" stroke="${dc}" stroke-width="2.5" fill="none"/>
      <rect x="10" y="42" width="80" height="9" fill="${t}" stroke="${OL}" stroke-width="2.5"/><path d="M24 15 L24 90 M76 15 L76 90" stroke="${OL}" stroke-width="9"/><path d="M24 17 L24 88 M76 17 L76 88" stroke="${t}" stroke-width="4.5"/>
      <path d="M40 36 L60 36 L60 58 Q50 66 40 58Z" fill="${t}" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/><path d="M50 44 L50 52" stroke="${OL}" stroke-width="4" stroke-linecap="round"/>
      ${kind === 'gem' ? `<path d="M50 4 L54 10 L50 16 L46 10Z" fill="#9ff" stroke="${OL}" stroke-width="2"/>` : ''}`, cls);
  },
  coin: () => svg('0 0 40 40', `<circle cx="20" cy="20" r="16" fill="#ffc93c" stroke="${OL}" stroke-width="3"/><path d="M20 36 A16 16 0 0 0 36 20 L31 20 A11 11 0 0 1 20 31Z" fill="#e8a01a"/><circle cx="20" cy="20" r="10" fill="none" stroke="#e09a1a" stroke-width="2.5"/><path d="M11 16 Q13 10 19 9" stroke="#fff2b0" stroke-width="2.5" fill="none" stroke-linecap="round"/><circle cx="20" cy="20" r="16" fill="none" stroke="${OL}" stroke-width="3"/>`, 'ico'),
  gem: () => svg('0 0 40 40', `<path d="M20 4 L35 15 L20 37 L5 15Z" fill="#d84be8" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/><path d="M5 15 L35 15 L20 37Z" fill="#a52ac0"/><path d="M12 15 L20 5 L28 15Z" fill="#f7b4ff"/><path d="M20 15 L20 34" stroke="#d84be8" stroke-width="2"/><path d="M20 4 L35 15 L20 37 L5 15Z" fill="none" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/>`, 'ico'),
  energy: () => svg('0 0 40 40', `<path d="M25 2 L7 23 L18 23 L13 38 L33 15 L22 15Z" fill="#3fb6ff" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/><path d="M22 8 L12 21 L17 21" stroke="#c8ecff" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`, 'ico'),
  wood: () => svg('0 0 40 40', `<rect x="3" y="11" width="32" height="18" rx="9" fill="#a8693a" stroke="${OL}" stroke-width="3"/><path d="M8 24 L26 24" stroke="#7e4a24" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="29" cy="20" rx="6" ry="8" fill="#eec58e" stroke="${OL}" stroke-width="2.5"/><ellipse cx="29" cy="20" rx="2.5" ry="3.5" fill="none" stroke="#cf9a60" stroke-width="1.5"/>`, 'ico'),
  stone: () => svg('0 0 40 40', `<path d="M5 33 L7 18 Q13 5 26 7 Q37 12 35 33Z" fill="#a7adb5" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/><path d="M6 33 L7 27 Q20 24 35 28 L35 33Z" fill="#80878f"/><path d="M11 18 Q15 11 22 10" stroke="#e4e8ec" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M5 33 L7 18 Q13 5 26 7 Q37 12 35 33Z" fill="none" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/>`, 'ico'),
  skull: () => svg('0 0 40 40', `<path d="M7 20 Q7 3 20 3 Q33 3 33 20 L28 25 L28 33 L12 33 L12 25Z" fill="#fff" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/><circle cx="14.5" cy="17" r="4" fill="${OL}"/><circle cx="25.5" cy="17" r="4" fill="${OL}"/><path d="M17 28 L17 33 M23 28 L23 33" stroke="${OL}" stroke-width="2"/>`, 'ico'),
  fire: () => svg('0 0 100 100', `${shadow(50, 90, 38, 7)}<ellipse cx="50" cy="84" rx="34" ry="9" fill="#8a7a6a" stroke="${OL}" stroke-width="3"/>
    <path d="M18 88 L80 72 M20 72 L82 88" stroke="${OL}" stroke-width="13" stroke-linecap="round"/><path d="M18 88 L80 72 M20 72 L82 88" stroke="#a8693a" stroke-width="7" stroke-linecap="round"/>
    <path d="M50 6 Q78 38 70 62 Q64 82 50 82 Q32 82 30 62 Q28 42 42 32 Q42 46 50 50 Q58 32 50 6Z" fill="#f06a2a" stroke="${OL}" stroke-width="${SW}" stroke-linejoin="round"/>
    <path d="M50 30 Q66 50 62 66 Q58 78 50 78 Q38 78 38 64 Q38 54 46 48 Q48 58 52 58 Q56 46 50 30Z" fill="#ffb62e"/><path d="M50 56 Q58 66 55 74 Q50 78 46 74 Q44 66 50 56Z" fill="#fff0a0"/>`, 'sprite'),
  bush: (c = '#9bc23a') => svg('0 0 60 42', blob([[14, 28, 11], [30, 20, 14], [46, 28, 11]], c, 3) + `<circle cx="26" cy="15" r="5" fill="${mix(c, 0.3)}"/><path d="M8 38 L52 38" stroke="${OL}" stroke-width="3"/><path d="M14 32 q4 3 8 0 M36 32 q4 3 8 0" stroke="${mix(c, -0.3)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`, 'sprite'),
  tuft: (c = '#6aae34') => svg('0 0 30 20', `<path d="M4 19 Q6 8 10 4 Q11 12 13 18 Q15 6 20 2 Q19 12 19 18 Q22 10 27 8 Q25 14 25 19Z" fill="${c}" stroke="${OL}" stroke-width="2" stroke-linejoin="round"/>`, 'sprite'),
  pebble: () => svg('0 0 30 18', `<ellipse cx="15" cy="10" rx="12" ry="7" fill="#a7adb5" stroke="${OL}" stroke-width="2.5"/><path d="M8 8 Q11 5 15 5" stroke="#e4e8ec" stroke-width="2" fill="none" stroke-linecap="round"/>`, 'sprite'),
  torch: () => svg('0 0 60 100', `${shadow(30, 96, 20, 4)}<path d="M14 96 L44 44 M46 96 L16 44" stroke="${OL}" stroke-width="9" stroke-linecap="round"/><path d="M14 96 L44 44 M46 96 L16 44" stroke="#a8693a" stroke-width="4.5" stroke-linecap="round"/><path d="M22 66 L38 66" stroke="#e8c27a" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M10 40 L50 40 L44 54 L16 54Z" fill="#9aa1aa" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/><path d="M30 2 Q48 22 42 36 Q38 42 30 42 Q20 42 18 34 Q16 24 26 18 Q26 28 30 30 Q34 18 30 2Z" fill="#f06a2a" stroke="${OL}" stroke-width="3" stroke-linejoin="round"/><path d="M30 18 Q40 30 36 38 Q30 42 24 38 Q24 30 30 18Z" fill="#ffd23f"/>`, 'sprite'),
  logs: () => svg('0 0 80 60', [[6, 38], [30, 38], [54, 38], [18, 18], [42, 18], [30, -2]].map(([x, y]) => `<rect x="${x}" y="${y + 4}" width="22" height="18" rx="9" fill="#a8693a" stroke="${OL}" stroke-width="2.5"/><ellipse cx="${x + 11}" cy="${y + 13}" rx="8" ry="8" fill="#eec58e" stroke="${OL}" stroke-width="2.5"/><circle cx="${x + 11}" cy="${y + 13}" r="3.5" fill="none" stroke="#cf9a60" stroke-width="1.5"/>`).join(''), 'sprite'),
  stake: () => svg('0 0 20 70', `<path d="M3 68 L3 14 L10 2 L17 14 L17 68Z" fill="#b8763a" stroke="${OL}" stroke-width="2.5" stroke-linejoin="round"/><path d="M12 12 L12 66" stroke="#8e5626" stroke-width="4"/><path d="M2 40 L18 44" stroke="#e8c27a" stroke-width="3"/>`, 'sprite'),
  // Wide layered forest strip for scene backdrops (tiles horizontally).
  forest(seed = 1) {
    let x = -10, out = '', r = seed;
    const rnd = () => { r = (r * 9301 + 49297) % 233280; return r / 233280; };
    const back = [], front = [];
    while (x < 410) { back.push([x, 30 + rnd() * 14, 26 + rnd() * 10]); x += 34 + rnd() * 10; }
    x = 8; while (x < 420) { front.push([x, 56 + rnd() * 12, 22 + rnd() * 8]); x += 46 + rnd() * 16; }
    out += `<rect x="0" y="0" width="400" height="120" fill="#6fae3a"/>`;
    out += blob(back.map(([a, b, c]) => [a, b, c]), '#5d9a32', 3) + back.map(([a, b, c]) => `<circle cx="${a - 4}" cy="${b - 6}" r="${c * 0.5}" fill="#74b23e"/>`).join('');
    out += front.map(([a, b, c]) => `<path d="M${a - 5} 120 L${a - 4} ${b + 10} L${a + 4} ${b + 10} L${a + 5} 120Z" fill="#9a6232" stroke="${OL}" stroke-width="3"/>` + blob([[a - c * 0.6, b, c * 0.7], [a + c * 0.6, b, c * 0.7], [a, b - c * 0.5, c * 0.85]], '#86c23f', 3) + `<circle cx="${a - 3}" cy="${b - c * 0.7}" r="${c * 0.35}" fill="#a6d84e"/>`).join('');
    return svg('0 0 400 120', out, 'backdrop').replace('<svg ', '<svg preserveAspectRatio="xMidYMax slice" ');
  },
};
window.Art = Art;
if (typeof module !== 'undefined') module.exports = Art;
