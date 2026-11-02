/* 道诡异仙：诳语双界 — art
 * 内联 SVG 场景底图：两种世界的“纸本水墨 + 冷光”。
 * 不依赖任何外部图片。
 */
(function () {
  'use strict';

  const svg = (inner) => `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" preserveAspectRatio="xMidYMid slice">${inner}</svg>`
  )}")`;

  const paper = (seed, dark) => {
    let s = '';
    for (let i = 0; i < 40; i++) {
      const x = Math.abs(Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453 % 900);
      const y = Math.abs(Math.sin(seed * 93.9898 + i * 12.233) * 24634.6345 % 600);
      const w = 50 + (i % 7) * 30;
      const o = 0.025 + (i % 5) * 0.012;
      s += `<path d="M${x.toFixed(0)} ${y.toFixed(0)} q ${(w / 2).toFixed(0)} ${(w / 7).toFixed(0)} ${w} 0" stroke="${dark ? '#e8dfcc' : '#1b1712'}" stroke-opacity="${o.toFixed(3)}" stroke-width="${(0.7 + (i % 4) * 0.4).toFixed(1)}" fill="none"/>`;
    }
    return s;
  };

  const figure = (x, y, s, color, op) => `
    <g transform="translate(${x} ${y}) scale(${s})" fill="${color}" opacity="${op}">
      <circle cx="0" cy="-42" r="14"/>
      <path d="M-16 -26 q16 -8 32 0 l6 34 q-22 10 -44 0 Z"/>
      <path d="M-13 8 l-6 34 h10 l8 -26 l8 26 h10 l-6 -34 Z"/>
    </g>`;

  const arts = {
    // 病房：冷白、窗格、铁床、躺着的人
    ward: svg(`
      <rect width="900" height="600" fill="#ddd8cb"/>
      <rect y="380" width="900" height="220" fill="#c9c2b2"/>
      <rect x="90" y="40" width="290" height="330" fill="#cfd4d2" stroke="#7e857f" stroke-width="4"/>
      <path d="M235 40v330M90 205h290" stroke="#7e857f" stroke-width="4"/>
      <path d="M90 205 h290" stroke="#7e857f" stroke-width="2" opacity=".5"/>
      <circle cx="330" cy="90" r="26" fill="#f6f2e6" opacity=".85"/>
      <path d="M330 64 v-8 M330 116 v8 M304 90 h-8 M356 90 h8" stroke="#9aa09a" stroke-width="2"/>
      <rect x="110" y="330" width="640" height="26" fill="#a9a292" stroke="#6f6a5f" stroke-width="3"/>
      <rect x="150" y="356" width="18" height="120" fill="#726c60"/>
      <rect x="690" y="356" width="18" height="120" fill="#726c60"/>
      <rect x="130" y="296" width="560" height="40" fill="#efe9dc" stroke="#7c766a" stroke-width="3"/>
      <path d="M130 322 h560" stroke="#b9b3a6" stroke-width="2"/>
      <rect x="150" y="270" width="120" height="34" rx="6" fill="#f5f0e4" stroke="#8a8478" stroke-width="2"/>
      ${figure(540, 300, 1.02, '#8d8579', 0.55)}
      <rect x="700" y="232" width="120" height="70" fill="#f2ede1" stroke="#8a8478" stroke-width="2"/>
      <rect x="716" y="222" width="88" height="12" fill="#8a8478"/>
      <circle cx="760" cy="268" r="12" fill="#c9a24b"/>
      <path d="M700 420 h150" stroke="#8f887a" stroke-width="2" stroke-dasharray="3 10" opacity=".7"/>
      ${paper(3, false)}
    `),

    // 走廊：长透视、护士站、坐着的人、药柜
    corridor: svg(`
      <rect width="900" height="600" fill="#d7d1c3"/>
      <path d="M0 0 L330 210 L330 430 L0 600 Z" fill="#c6bfae"/>
      <path d="M900 0 L570 210 L570 430 L900 600 Z" fill="#cec7b6"/>
      <path d="M330 210 L570 210 L640 600 L260 600 Z" fill="#b3ab9a"/>
      <path d="M330 430 L570 430 L640 600 L260 600 Z" fill="#9d9483"/>
      <rect x="380" y="238" width="150" height="96" fill="#f4ecd8" stroke="#8a8170" stroke-width="3"/>
      <rect x="380" y="238" width="150" height="22" fill="#e4d8bd"/>
      ${figure(470, 330, 0.85, '#6f6758', 0.75)}
      <path d="M470 318 v-14" stroke="#6f6758" stroke-width="3"/>
      <circle cx="508" cy="300" r="9" fill="#c9a24b"/>
      <path d="M382 352 h146" stroke="#8a8170" stroke-width="2"/>
      <rect x="300" y="150" width="36" height="170" fill="#ece5d5" stroke="#8a8170" stroke-width="2"/>
      <rect x="574" y="150" width="36" height="170" fill="#ece5d5" stroke="#8a8170" stroke-width="2"/>
      <rect x="640" y="250" width="120" height="180" fill="#ded6c3" stroke="#7d7465" stroke-width="4"/>
      <circle cx="690" cy="330" r="7" fill="#5e574b"/>
      <path d="M300 380 q-40 40 -10 90" stroke="#6d6557" stroke-width="6" fill="none" opacity=".5"/>
      <path d="M450 60 l46 46 -46 46 -46 -46Z" fill="none" stroke="#8b8273" stroke-width="2" opacity=".6"/>
      ${paper(7, false)}
    `),

    // 杂物间：铁架、病历、洗胃机、胶管
    utility: svg(`
      <rect width="900" height="600" fill="#d3cdbf"/>
      <rect x="0" y="430" width="900" height="170" fill="#b3ac9d"/>
      <rect x="70" y="100" width="330" height="330" fill="#a8a192" stroke="#6d6557" stroke-width="4"/>
      <path d="M70 205h330M70 310h330" stroke="#6d6557" stroke-width="3"/>
      <rect x="96" y="126" width="70" height="56" fill="#e9e2d0"/>
      <rect x="184" y="126" width="100" height="56" fill="#ded6c1"/>
      <rect x="96" y="232" width="120" height="56" fill="#e9e2d0"/>
      <rect x="240" y="232" width="60" height="56" fill="#cfc7b2"/>
      <rect x="96" y="336" width="90" height="56" fill="#ded6c1"/>
      <rect x="470" y="250" width="270" height="230" fill="#ece6d8" stroke="#7c7464" stroke-width="4"/>
      <circle cx="605" cy="320" r="40" fill="#cfc8b6" stroke="#7c7464" stroke-width="3"/>
      <path d="M605 280v80M565 320h80" stroke="#7c7464" stroke-width="3"/>
      <path d="M470 400 q-70 40 -50 120 q20 50 100 30" stroke="#4f565f" stroke-width="14" fill="none" stroke-linecap="round"/>
      <rect x="500" y="440" width="210" height="22" fill="#9d9586"/>
      <rect x="120" y="440" width="120" height="14" fill="#8f8778"/>
      <path d="M760 120 q-40 140 20 260" stroke="#7c7464" stroke-width="3" fill="none" opacity=".5"/>
      ${paper(11, false)}
    `),

    // 料房：溶洞、荧石、通铺、白灵淼
    liaofang: svg(`
      <rect width="900" height="600" fill="#191612"/>
      <path d="M0 0 L0 600 L900 600 L900 0 Q740 130 590 80 Q400 20 280 130 Q130 250 0 0 Z" fill="#211d18"/>
      <path d="M90 320 q80 -140 200 -100 q130 40 110 160 q-20 130 -150 130 q-160 0 -160 -190 Z" fill="#29241d"/>
      <path d="M580 180 q120 -70 200 30 q80 100 -20 200 q-110 80 -180 0 q-60 -80 0 -230 Z" fill="#2d2720"/>
      <g fill="#7fe0c8" opacity=".95">
        <circle cx="190" cy="290" r="5"/><circle cx="235" cy="355" r="3.4"/><circle cx="150" cy="380" r="4"/>
        <circle cx="650" cy="260" r="5"/><circle cx="700" cy="315" r="3.4"/><circle cx="620" cy="345" r="4"/>
      </g>
      <g fill="#7fe0c8" opacity=".14">
        <circle cx="190" cy="290" r="70"/><circle cx="650" cy="260" r="80"/>
      </g>
      <rect x="90" y="470" width="720" height="80" fill="#3a332a"/>
      <path d="M110 470 q70 -34 140 0 q70 34 140 0 q70 -34 140 0 q70 34 140 0 q70 -34 140 0" fill="none" stroke="#544a3c" stroke-width="5"/>
      <path d="M320 470 v-46 q34 -34 68 0 v46" fill="#4b4337"/>
      ${figure(650, 452, 1.15, '#c9c0ae', 0.9)}
      <path d="M650 410 q-10 -26 0 -38" stroke="#e7dfcf" stroke-width="3" fill="none" opacity=".8"/>
      ${paper(17, true)}
    `),

    // 丹房：黑丹炉、火光、丹阳子
    danfang: svg(`
      <rect width="900" height="600" fill="#120f0c"/>
      <path d="M0 0 L0 600 L900 600 L900 0 Q690 90 510 55 Q290 20 140 115 Q60 165 0 0 Z" fill="#1d1712"/>
      <circle cx="450" cy="380" r="170" fill="#2a2018"/>
      <path d="M320 500 q130 -66 260 0 q44 22 44 64 h-348 q0 -42 44 -64Z" fill="#38281b"/>
      <path d="M350 360 q100 -120 200 0 q34 66 -22 110 q-78 54 -156 0 q-56 -44 -22 -110Z" fill="#472c1a" stroke="#7d4a22" stroke-width="4"/>
      <path d="M382 350 q68 -66 136 0" fill="none" stroke="#cf7a2c" stroke-width="5" opacity=".85"/>
      <ellipse cx="450" cy="540" rx="230" ry="28" fill="#26170e"/>
      <g fill="#dd7c2c" opacity=".55"><circle cx="450" cy="486" r="7"/><circle cx="505" cy="462" r="4.5"/><circle cx="398" cy="468" r="3.5"/></g>
      ${figure(700, 470, 1.2, '#120d09', 0.92)}
      <path d="M700 428 q-14 -30 4 -44 q18 14 8 44" fill="#2b1e13"/>
      <rect x="120" y="300" width="60" height="24" fill="#3b2d20" transform="rotate(-12 150 312)"/>
      ${paper(23, true)}
    `),

    // 玄阳住处：石床、道袍、玉佩
    xuanyang: svg(`
      <rect width="900" height="600" fill="#181410"/>
      <path d="M0 0 L0 600 L900 600 L900 0 Q720 90 560 60 Q360 20 200 130 Q80 210 0 0 Z" fill="#231d17"/>
      <rect x="160" y="340" width="420" height="130" fill="#31291f" stroke="#4f4336" stroke-width="4"/>
      <rect x="140" y="306" width="460" height="38" fill="#3f3529"/>
      <path d="M600 250 q64 -46 106 10 l-22 200 q-54 32 -96 -10 Z" fill="#4b4335"/>
      <path d="M642 306 q32 -22 54 0 l-8 118 q-32 14 -48 -4Z" fill="#5b5343"/>
      <circle cx="668" cy="336" r="13" fill="#7fe0c8" stroke="#2c5e52" stroke-width="2"/>
      <circle cx="668" cy="336" r="4" fill="#d8fff5"/>
      <path d="M250 110 q44 -34 88 0" stroke="#6d6152" stroke-width="3" fill="none"/>
      <rect x="700" y="420" width="90" height="60" fill="#2e271e" stroke="#4f4336" stroke-width="3"/>
      <circle cx="745" cy="450" r="9" fill="#b98b3e" opacity=".8"/>
      ${paper(29, true)}
    `),

    // 洞口：晨光、松林、烟、人群
    cave: svg(`
      <rect width="900" height="600" fill="#0f0d0b"/>
      <path d="M0 0 L0 600 L900 600 L900 0 L760 100 Q620 30 470 100 Q300 170 160 95 Q70 50 0 0 Z" fill="#191511"/>
      <path d="M290 600 L290 420 Q450 296 610 420 L610 600 Z" fill="#e6dfcc"/>
      <path d="M320 600 L320 440 Q450 346 580 440 L580 600 Z" fill="#f6efdc"/>
      <path d="M416 600 L416 476 Q450 432 484 476 L484 600 Z" fill="#fdf8ea"/>
      <path d="M130 420 q64 -130 40 -230" stroke="#57503f" stroke-width="9" fill="none" opacity=".55"/>
      <path d="M790 440 q44 -150 10 -250" stroke="#57503f" stroke-width="9" fill="none" opacity=".55"/>
      <path d="M620 190 q46 -84 0 -160" stroke="#8a8375" stroke-width="7" fill="none" opacity=".3"/>
      <g fill="#38422f" opacity=".85"><path d="M690 600 l32 -170 l32 170Z"/><path d="M756 600 l28 -132 l28 132Z"/></g>
      ${figure(390, 560, 1.25, '#3d3529', 0.9)}
      ${figure(430, 566, 1.05, '#4a4133', 0.85)}
      ${figure(360, 566, 1.0, '#4a4133', 0.85)}
      ${paper(31, true)}
    `)
  };

  window.ART = arts;
  document.addEventListener('DOMContentLoaded', function () {
    const style = document.createElement('style');
    style.textContent = Object.keys(arts).map(k => `[data-art="${k}"] .art-layer.ink{background-image:${arts[k]}}`).join('\n');
    document.head.appendChild(style);
  });
})();
