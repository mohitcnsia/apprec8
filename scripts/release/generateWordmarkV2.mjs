// scripts/release/generateWordmarkV2.mjs
// Generates Wordmark V2 for Apprec8 / Appreci8 (Task G53)
// Key requirements:
// 1. Redo the wordmark only, both spellings: 'apprec' + ∞ and 'appreci' + ∞.
// 2. The ∞ sits on the baseline at x-height like a lowercase letter (matching 'a', 'c', 'e', 'r').
// 3. Same stroke weight as the font text (Nunito 900 at 112px has ~15.5px stroke width).
// 4. Left loop solid (with a clean, open counter hole matching the eye of 'o' / 'c').
// 5. Right loop breaking into pixel blocks (digital square tiles) that drift up and to the right.
// 6. 2 color variants: white on plum (#2B0632), plum on white (#FFFFFF).
// 7. Output directory: docs/release/brand/wordmark-v2/

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PROJECT_ROOT = process.cwd();
const OUT_DIR = path.join(PROJECT_ROOT, 'docs', 'release', 'brand', 'wordmark-v2');
const TMP_DIR = path.join(PROJECT_ROOT, '.tmp_wordmark_v2');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

// Brand Palette
const BRAND = {
  plumDeep: '#2B0632',
  plum: '#3B0940',
  plumMedium: '#54155B',
  mauve: '#85508A',
  lilac: '#F5D2F8',
  goldStar: '#DCB51B',
  white: '#FFFFFF',
};

/**
 * Builds the SVG markup for the inline wordmark.
 * Font size: 112px Nunito 900
 * Baseline: Y = 180
 * x-height: Y = 125 (total lowercase height = 55px)
 * Stroke width: 15.5px
 */
function buildWordmarkSvg({
  spelling = 'apprec', // 'apprec' | 'appreci'
  variant = 'white-on-plum', // 'white-on-plum' | 'plum-on-white' | 'white-transparent' | 'plum-transparent'
  showGuides = false,
  width = 1000,
  height = 280,
  scale = 1,
  offsetX = 0,
  offsetY = 0,
}) {
  const isApprec = spelling === 'apprec';
  const isWhite = variant.startsWith('white');
  const isTransparent = variant.endsWith('transparent');

  const bgColor = isTransparent
    ? 'transparent'
    : isWhite
    ? BRAND.plumDeep
    : BRAND.white;
  const textColor = isWhite ? BRAND.white : BRAND.plum;
  const goldStar = BRAND.goldStar;
  const accentLilac = isWhite ? BRAND.lilac : BRAND.mauve;
  const ambientCol = isWhite ? BRAND.white : BRAND.plum;

  // Horizontal alignment calibration
  // In Nunito 900 at 112px, starting at textStartX centers the whole mark on a 1000px banner
  const textStartX = (isApprec ? 190 : 165) + offsetX;
  const leftApexX = isApprec ? textStartX + 348 : textStartX + 392;
  const cy = 152.5 + offsetY;
  const waistX = leftApexX + 44;
  const leftClX = leftApexX + 7.75;
  const topClY = 132.75 + offsetY;
  const botClY = 172.25 + offsetY;

  // 1. Symmetrical Solid Left Loop (Clean open counter hole matching 'o' / 'c')
  const leftLoop = `
    M ${waistX} ${cy}
    C ${waistX - 14} ${topClY + 2}, ${leftClX + 16} ${topClY}, ${leftClX} ${cy}
    C ${leftClX + 16} ${botClY}, ${waistX - 14} ${botClY - 2}, ${waistX} ${cy}
  `;

  // 2. Right Loop Lead-in Curves (Symmetrical waist crossing)
  const rightTopLead = `
    M ${waistX} ${cy}
    C ${waistX + 14} ${topClY + 2}, ${waistX + 22} ${topClY}, ${waistX + 28} ${topClY}
  `;
  const rightBottomLead = `
    M ${waistX} ${cy}
    C ${waistX + 14} ${botClY - 2}, ${waistX + 22} ${botClY}, ${waistX + 28} ${botClY}
  `;

  // 3. Pixel Blocks forming the right loop contour
  const b1 = { x: waistX + 32, y: 165 + offsetY, sz: 14.5, rx: 2.5, col: textColor };
  const b2 = { x: waistX + 45, y: 153 + offsetY, sz: 14, rx: 2.5, col: textColor };
  const b3 = { x: waistX + 47, y: 137 + offsetY, sz: 14, rx: 2.5, col: textColor };
  const b4 = { x: waistX + 42, y: 121 + offsetY, sz: 13.5, rx: 2.5, col: textColor };
  const b5 = { x: waistX + 29, y: 117 + offsetY, sz: 13.5, rx: 2.5, col: textColor };

  // 4. Ascending Pixel Cloud Drifting Up and Right
  const driftBlocks = [
    { x: waistX + 57, y: 110 + offsetY, sz: 12, rx: 2.5, col: textColor },
    { x: waistX + 69, y: 95 + offsetY, sz: 11, rx: 2, col: accentLilac },
    { x: waistX + 82, y: 80 + offsetY, sz: 10, rx: 2, col: goldStar },
    { x: waistX + 96, y: 66 + offsetY, sz: 9, rx: 2, col: textColor },
    { x: waistX + 111, y: 53 + offsetY, sz: 8, rx: 1.5, col: accentLilac },
    { x: waistX + 127, y: 41 + offsetY, sz: 7, rx: 1.5, col: goldStar },
    { x: waistX + 144, y: 30 + offsetY, sz: 6, rx: 1.5, col: textColor },
    { x: waistX + 162, y: 20 + offsetY, sz: 5, rx: 1, col: accentLilac },
    
    // Ambient floating starlet pixels
    { x: waistX + 75, y: 118 + offsetY, sz: 7.5, rx: 1.5, col: ambientCol },
    { x: waistX + 91, y: 98 + offsetY, sz: 6.5, rx: 1.5, col: goldStar },
    { x: waistX + 109, y: 78 + offsetY, sz: 5.5, rx: 1.5, col: accentLilac },
    { x: waistX + 129, y: 60 + offsetY, sz: 5, rx: 1, col: ambientCol },
  ];

  const allBlocks = [b1, b2, b3, b4, b5, ...driftBlocks];
  const blocksSvg = allBlocks
    .map((b) => `<rect x="${b.x.toFixed(2)}" y="${b.y.toFixed(2)}" width="${b.sz.toFixed(2)}" height="${b.sz.toFixed(2)}" rx="${b.rx}" fill="${b.col}" />`)
    .join('\n      ');

  const guidesSvg = showGuides
    ? `
      <!-- Technical Guidelines -->
      <line x1="60" y1="${125 + offsetY}" x2="${width - 60}" y2="${125 + offsetY}" stroke="${isWhite ? 'rgba(245,210,248,0.5)' : 'rgba(133,80,138,0.5)'}" stroke-dasharray="4 4" stroke-width="1.5" />
      <line x1="60" y1="${180 + offsetY}" x2="${width - 60}" y2="${180 + offsetY}" stroke="${isWhite ? 'rgba(220,181,27,0.8)' : 'rgba(220,181,27,0.9)'}" stroke-dasharray="4 4" stroke-width="1.5" />
      <text x="65" y="${118 + offsetY}" font-family="monospace" font-weight="700" font-size="11" fill="${isWhite ? '#F5D2F8' : '#85508a'}">X-HEIGHT (Y=125, H=55px)</text>
      <text x="65" y="${196 + offsetY}" font-family="monospace" font-weight="700" font-size="11" fill="${isWhite ? '#DCB51B' : '#dcb51b'}">BASELINE (Y=180)</text>
    `
    : '';

  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" style="background:${bgColor}; overflow:hidden;">
      <text x="${textStartX}" y="${180 + offsetY}" font-family="'Nunito', sans-serif" font-weight="900" font-size="112" letter-spacing="-2.5" fill="${textColor}">${spelling}</text>
      <path d="${leftLoop}" fill="none" stroke="${textColor}" stroke-width="15.5" stroke-linecap="round" stroke-linejoin="round" />
      <path d="${rightTopLead}" fill="none" stroke="${textColor}" stroke-width="15.5" stroke-linecap="round" />
      <path d="${rightBottomLead}" fill="none" stroke="${textColor}" stroke-width="15.5" stroke-linecap="round" />
      ${blocksSvg}
      ${guidesSvg}
    </svg>
  `;
}

/**
 * Builds standalone HTML wrapper for Google Chrome screenshot renderer.
 */
function buildHtmlPage(svgContent, bgColor = 'transparent') {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    html, body {
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: ${bgColor};
      -webkit-font-smoothing: antialiased;
    }
  </style>
</head>
<body>
  ${svgContent}
</body>
</html>`;
}

/**
 * Builds the Master Overview Presentation Sheet (1600x1200)
 */
function buildOverviewSheetHtml() {
  const card1 = buildWordmarkSvg({ spelling: 'apprec', variant: 'white-on-plum', width: 700, height: 210, offsetY: -35, offsetX: -60 });
  const card2 = buildWordmarkSvg({ spelling: 'apprec', variant: 'plum-on-white', width: 700, height: 210, offsetY: -35, offsetX: -60 });
  const card3 = buildWordmarkSvg({ spelling: 'appreci', variant: 'white-on-plum', width: 700, height: 210, offsetY: -35, offsetX: -45 });
  const card4 = buildWordmarkSvg({ spelling: 'appreci', variant: 'plum-on-white', width: 700, height: 210, offsetY: -35, offsetX: -45 });

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    html, body {
      width: 1600px;
      height: 1200px;
      background: #17021B;
      color: #FFFFFF;
      font-family: 'Nunito', sans-serif;
      padding: 48px 64px;
      overflow: hidden;
      -webkit-font-smoothing: antialiased;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      border-bottom: 2px solid rgba(245, 210, 248, 0.15);
      padding-bottom: 24px;
      margin-bottom: 32px;
    }
    .title {
      font-size: 38px;
      font-weight: 900;
      color: #FFFFFF;
      letter-spacing: -0.5px;
    }
    .subtitle {
      font-size: 16px;
      color: ${BRAND.lilac};
      margin-top: 6px;
      font-weight: 700;
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 20px;
      background: rgba(220, 181, 27, 0.15);
      border: 1px solid ${BRAND.goldStar};
      color: ${BRAND.goldStar};
      font-size: 13px;
      font-weight: 800;
      font-family: 'JetBrains Mono', monospace;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 28px;
    }
    .card {
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45);
      display: flex;
      flex-direction: column;
    }
    .card-preview {
      height: 210px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #2B0632;
    }
    .bg-white { background: #FFFFFF; }
    .card-footer {
      background: rgba(255, 255, 255, 0.04);
      padding: 14px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }
    .card-label {
      font-weight: 800;
      color: #FFFFFF;
    }
    .card-tech {
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      color: ${BRAND.lilac};
    }
    .details-row {
      margin-top: 32px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 20px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 24px 32px;
      display: flex;
      justify-content: space-around;
    }
    .detail-item {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      max-width: 440px;
    }
    .detail-icon {
      width: 32px;
      height: 32px;
      border-radius: 10px;
      background: ${BRAND.plumMedium};
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${BRAND.goldStar};
      font-size: 15px;
      font-weight: 900;
      flex-shrink: 0;
    }
    .detail-h { font-size: 15px; font-weight: 800; color: #FFFFFF; }
    .detail-p { font-size: 13px; color: ${BRAND.lilac}; margin-top: 4px; line-height: 1.4; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">Apprec8 / Appreci8 — Wordmark V2</div>
      <div class="subtitle">Logo fix: the ∞ sits on the baseline at x-height as the last letter (Task G53)</div>
    </div>
    <div class="badge">SPEC: G53 WORDMARK FIX</div>
  </div>

  <div class="grid">
    <!-- Card 1: apprec8 White on Plum -->
    <div class="card">
      <div class="card-preview">
        ${card1}
      </div>
      <div class="card-footer">
        <span class="card-label">apprec8 · White on Plum</span>
        <span class="card-tech">Primary Dark Brand · 1000×280</span>
      </div>
    </div>

    <!-- Card 2: apprec8 Plum on White -->
    <div class="card">
      <div class="card-preview bg-white">
        ${card2}
      </div>
      <div class="card-footer">
        <span class="card-label">apprec8 · Plum on White</span>
        <span class="card-tech">Editorial & Print · 1000×280</span>
      </div>
    </div>

    <!-- Card 3: appreci8 White on Plum -->
    <div class="card">
      <div class="card-preview">
        ${card3}
      </div>
      <div class="card-footer">
        <span class="card-label">appreci8 · White on Plum</span>
        <span class="card-tech">Phonetic Spelling Variant · 1000×280</span>
      </div>
    </div>

    <!-- Card 4: appreci8 Plum on White -->
    <div class="card">
      <div class="card-preview bg-white">
        ${card4}
      </div>
      <div class="card-footer">
        <span class="card-label">appreci8 · Plum on White</span>
        <span class="card-tech">Phonetic Light Variant · 1000×280</span>
      </div>
    </div>
  </div>

  <!-- Anatomy & Technical Callouts -->
  <div class="details-row">
    <div class="detail-item">
      <div class="detail-icon">✓</div>
      <div>
        <div class="detail-h">True Baseline & X-Height Lock</div>
        <div class="detail-p">The ∞ sits firmly on the baseline at x-height (55px height) matching lowercase letters (c, e, a, r). Eliminates any floating gap.</div>
      </div>
    </div>
    <div class="detail-item">
      <div class="detail-icon">✓</div>
      <div>
        <div class="detail-h">Harmonic 15.5px Stroke Weight</div>
        <div class="detail-p">Left loop is calibrated to exact 15.5px stroke width with an open counter hole matching the eye of 'o' and 'c' in Nunito 900.</div>
      </div>
    </div>
    <div class="detail-item">
      <div class="detail-icon">✓</div>
      <div>
        <div class="detail-h">Digital Dissolution Dynamic</div>
        <div class="detail-p">Right loop breaks into discrete square digital pixel blocks drifting up-right into the sky with gold star accents (#DCB51B).</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function renderHtmlToPng(htmlContent, outputPngPath, width, height) {
  const tmpHtml = path.join(TMP_DIR, `render_${Date.now()}_${Math.random().toString(36).substring(7)}.html`);
  fs.writeFileSync(tmpHtml, htmlContent, 'utf-8');

  try {
    const cmd = `"${CHROME_PATH}" --headless --disable-gpu --screenshot="${outputPngPath}" --window-size=${width},${height} "${tmpHtml}"`;
    await execAsync(cmd);
    console.log(`✓ Generated: ${path.relative(PROJECT_ROOT, outputPngPath)} (${width}x${height})`);
  } finally {
    if (fs.existsSync(tmpHtml)) {
      fs.unlinkSync(tmpHtml);
    }
  }
}

async function main() {
  console.log(`\n======================================================`);
  console.log(`🎨 Generating Wordmark V2 Brand Assets (Task G53)`);
  console.log(`======================================================\n`);

  // 1. apprec8 — White on Plum
  await renderHtmlToPng(
    buildHtmlPage(buildWordmarkSvg({ spelling: 'apprec', variant: 'white-on-plum' })),
    path.join(OUT_DIR, 'apprec8-white-on-plum.png'),
    1000,
    280
  );

  // 2. apprec8 — Plum on White
  await renderHtmlToPng(
    buildHtmlPage(buildWordmarkSvg({ spelling: 'apprec', variant: 'plum-on-white' }), '#FFFFFF'),
    path.join(OUT_DIR, 'apprec8-plum-on-white.png'),
    1000,
    280
  );

  // 3. appreci8 — White on Plum
  await renderHtmlToPng(
    buildHtmlPage(buildWordmarkSvg({ spelling: 'appreci', variant: 'white-on-plum' })),
    path.join(OUT_DIR, 'appreci8-white-on-plum.png'),
    1000,
    280
  );

  // 4. appreci8 — Plum on White
  await renderHtmlToPng(
    buildHtmlPage(buildWordmarkSvg({ spelling: 'appreci', variant: 'plum-on-white' }), '#FFFFFF'),
    path.join(OUT_DIR, 'appreci8-plum-on-white.png'),
    1000,
    280
  );

  // 5. Alignment Verification Guides
  await renderHtmlToPng(
    buildHtmlPage(buildWordmarkSvg({ spelling: 'apprec', variant: 'white-on-plum', showGuides: true })),
    path.join(OUT_DIR, 'apprec8-alignment-guides.png'),
    1000,
    280
  );

  await renderHtmlToPng(
    buildHtmlPage(buildWordmarkSvg({ spelling: 'appreci', variant: 'white-on-plum', showGuides: true })),
    path.join(OUT_DIR, 'appreci8-alignment-guides.png'),
    1000,
    280
  );

  // 6. Transparent versions
  await renderHtmlToPng(
    buildHtmlPage(buildWordmarkSvg({ spelling: 'apprec', variant: 'white-transparent' })),
    path.join(OUT_DIR, 'apprec8-white-transparent.png'),
    1000,
    280
  );

  await renderHtmlToPng(
    buildHtmlPage(buildWordmarkSvg({ spelling: 'apprec', variant: 'plum-transparent' })),
    path.join(OUT_DIR, 'apprec8-plum-transparent.png'),
    1000,
    280
  );

  await renderHtmlToPng(
    buildHtmlPage(buildWordmarkSvg({ spelling: 'appreci', variant: 'white-transparent' })),
    path.join(OUT_DIR, 'appreci8-white-transparent.png'),
    1000,
    280
  );

  await renderHtmlToPng(
    buildHtmlPage(buildWordmarkSvg({ spelling: 'appreci', variant: 'plum-transparent' })),
    path.join(OUT_DIR, 'appreci8-plum-transparent.png'),
    1000,
    280
  );

  // 7. Master Overview Presentation Sheet (1600x1200)
  await renderHtmlToPng(
    buildOverviewSheetHtml(),
    path.join(OUT_DIR, 'overview-sheet.png'),
    1600,
    1200
  );

  // Cleanup tmp dir
  if (fs.existsSync(TMP_DIR)) {
    fs.rmSync(TMP_DIR, { recursive: true, force: true });
  }

  console.log(`\n🎉 Wordmark V2 generation complete! Files located in docs/release/brand/wordmark-v2/`);
}

main().catch((err) => {
  console.error('Failed to generate brand assets:', err);
  process.exit(1);
});
