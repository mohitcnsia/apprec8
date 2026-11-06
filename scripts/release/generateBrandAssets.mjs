// scripts/release/generateBrandAssets.mjs
// Generates the 3 brand directions for Apprec8 / Appreci8 (G48):
// 1. cosmic-star ("Chamak & The Infinite Cosmos")
// 2. infinite-bloom ("Growth, Sprout & Wonder")
// 3. playful-geometric ("Modern Joy & Digital Discovery")
//
// Generates 15 PNG assets per direction (45 total):
// - wordmark-apprec.png (1000x280)
// - wordmark-appreci.png (1000x280)
// - wordmark.png (1000x280)
// - app-icon.png (512x512)
// - adaptive-icon-foreground.png (1024x1024, artwork strictly inside 66% circle)
// - notification-mark.png (96x96, pure white on transparent)
// - 7 Subject icons (256x256 each): English, Science, Word Power, Treasure Words, Maths, Reasoning, Well-being
// - feature-graphic.png (1024x500)
// - overview-sheet.png (1600x1100, master presentation sheet)

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PROJECT_ROOT = process.cwd();
const BRAND_DIR = path.join(PROJECT_ROOT, 'docs', 'release', 'brand');
const TMP_DIR = path.join(PROJECT_ROOT, '.tmp_brand_gen');

// Ensure tmp directory exists
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

// Brand color palette constants
const COLORS = {
  plumDark: '#200424',
  plum: '#3b0940',
  plumLight: '#54155b',
  mauve: '#85508a',
  mauveLight: '#a66ea8',
  lilac: '#F5D2F8',
  lilacLight: '#fae6fc',
  goldStar: '#F5C842',
  goldDeep: '#dcb51b',
  goldStroke: '#C99A12',
  white: '#FFFFFF',
  pinkCheek: '#F29BB8',
  coralBlush: '#F27C9C',
  charcoalInk: '#3b0940',
};

// Mascot Chamak SVG Path & Features
function getChamakSvg({ cx, cy, scale = 1, mood = 'happy', glow = false, idPrefix = 'c' }) {
  const glowAttr = glow ? `filter="url(#${idPrefix}-glow)"` : '';
  return `
    <g transform="translate(${cx}, ${cy}) scale(${scale}) translate(-38, -42)" ${glowAttr}>
      <defs>
        <linearGradient id="${idPrefix}-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFE885" />
          <stop offset="50%" stop-color="#F5C842" />
          <stop offset="100%" stop-color="#DCB51B" />
        </linearGradient>
        <filter id="${idPrefix}-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#DCB51B" flood-opacity="0.6" />
        </filter>
      </defs>
      <!-- Golden Body -->
      <path d="M38 4l9.5 19.3 21.3 3.1-15.4 15 3.6 21.2L38 52.6 19 62.6l3.6-21.2-15.4-15 21.3-3.1z"
            fill="url(#${idPrefix}-gold)" stroke="#C99A12" stroke-width="3" stroke-linejoin="round" />
      <!-- Eyes -->
      <ellipse cx="31" cy="34" rx="3.6" ry="4.6" fill="${COLORS.charcoalInk}" />
      <ellipse cx="45" cy="34" rx="3.6" ry="4.6" fill="${COLORS.charcoalInk}" />
      <!-- Eye Catchlights -->
      <circle cx="32.2" cy="32.4" r="1.3" fill="#FFFFFF" />
      <circle cx="46.2" cy="32.4" r="1.3" fill="#FFFFFF" />
      <!-- Cheeks -->
      <circle cx="25" cy="41" r="3.2" fill="${COLORS.pinkCheek}" opacity="0.85" />
      <circle cx="51" cy="41" r="3.2" fill="${COLORS.pinkCheek}" opacity="0.85" />
      <!-- Smile -->
      <path d="M31.5 42c3.8 4 9.2 4 13 0" stroke="${COLORS.charcoalInk}" stroke-width="2.6" fill="none" stroke-linecap="round" />
    </g>
  `;
}

// Lemniscate point helper: x(t) = cx + rx * cos(t)/(1+sin^2(t)), y(t) = cy + ry * sin(t)cos(t)/(1+sin^2(t))
function getLemniscatePt(t, cx, cy, rx, ry) {
  const sinT = Math.sin(t);
  const cosT = Math.cos(t);
  const denom = 1 + sinT * sinT;
  return {
    x: cx + (rx * cosT) / denom,
    y: cy + (ry * sinT * cosT) / denom
  };
}

// -------------------------------------------------------------
// Direction 1: COSMIC STAR ("Chamak & The Infinite Cosmos")
// -------------------------------------------------------------
function renderCosmicInfinity({ cx, cy, rx, ry, strokeWidth = 14, idPrefix = 'cosmic' }) {
  // Left loop: t from pi/2 to 3pi/2
  const leftPts = [];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const t = (Math.PI / 2) + (i / steps) * Math.PI;
    leftPts.push(getLemniscatePt(t, cx, cy, rx, ry));
  }
  const leftPath = `M ${leftPts[0].x.toFixed(1)} ${leftPts[0].y.toFixed(1)} ` +
    leftPts.slice(1).map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

  // Right loop: digital blocks dissolving into space
  const blocks = [];
  // Lower right branch (t: 3pi/2 -> 2pi)
  for (let i = 0; i <= 20; i++) {
    const frac = i / 20;
    const t = 1.5 * Math.PI + frac * 0.5 * Math.PI;
    const pt = getLemniscatePt(t, cx, cy, rx, ry);
    const driftX = frac * frac * 32;
    const driftY = -frac * frac * 18 + (frac * 12);
    const sz = strokeWidth * (1.1 - frac * 0.42);
    const op = (1 - frac * 0.35).toFixed(2);
    blocks.push({
      x: pt.x + driftX - sz / 2,
      y: pt.y + driftY - sz / 2,
      w: sz,
      h: sz,
      rx: 3,
      opacity: op,
      fill: frac > 0.6 ? COLORS.lilac : COLORS.goldStar
    });
  }

  // Upper right branch (t: 0 -> pi/2)
  for (let i = 0; i <= 20; i++) {
    const frac = i / 20;
    const t = frac * 0.5 * Math.PI;
    const pt = getLemniscatePt(t, cx, cy, rx, ry);
    const driftX = (1 - frac) * (1 - frac) * 44;
    const driftY = -(1 - frac) * 36;
    const sz = strokeWidth * (0.62 + frac * 0.42);
    const op = (0.55 + frac * 0.45).toFixed(2);
    blocks.push({
      x: pt.x + driftX - sz / 2,
      y: pt.y + driftY - sz / 2,
      w: sz,
      h: sz,
      rx: 3,
      opacity: op,
      fill: frac < 0.4 ? COLORS.lilac : COLORS.goldStar
    });
  }

  // Scattered stardust particles
  const stars = [];
  for (let j = 0; j < 18; j++) {
    const sx = cx + rx * 0.75 + (j * 8) + (Math.sin(j * 4.2) * 16);
    const sy = cy - ry * 0.35 - (j * 5) + (Math.cos(j * 3.1) * 14);
    const sz = 3.5 + (j % 4) * 2.2;
    const op = Math.max(0.25, (0.85 - j * 0.035)).toFixed(2);
    stars.push({ x: sx, y: sy, sz, op, isStar: j % 3 === 0 });
  }

  const svgBlocks = blocks.map(b =>
    `<rect x="${b.x.toFixed(1)}" y="${b.y.toFixed(1)}" width="${b.w.toFixed(1)}" height="${b.h.toFixed(1)}" rx="${b.rx}" fill="${b.fill}" opacity="${b.opacity}" />`
  ).join('\n');

  const svgStars = stars.map(s => {
    if (s.isStar) {
      return `
        <g transform="translate(${s.x.toFixed(1)}, ${s.y.toFixed(1)}) scale(${s.sz / 10})" opacity="${s.op}">
          <path d="M0 -10 L2.5 -2.5 L10 0 L2.5 2.5 L0 10 L-2.5 2.5 L-10 0 L-2.5 -2.5 Z" fill="${COLORS.goldStar}" />
        </g>
      `;
    }
    return `<rect x="${(s.x - s.sz/2).toFixed(1)}" y="${(s.y - s.sz/2).toFixed(1)}" width="${s.sz.toFixed(1)}" height="${s.sz.toFixed(1)}" rx="1.5" fill="${COLORS.lilac}" opacity="${s.op}" />`;
  }).join('\n');

  return `
    <g class="cosmic-infinity">
      <defs>
        <linearGradient id="${idPrefix}-left-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FFE57F" />
          <stop offset="60%" stop-color="#F5C842" />
          <stop offset="100%" stop-color="#DCB51B" />
        </linearGradient>
      </defs>
      <!-- Left solid loop -->
      <path d="${leftPath}" fill="none" stroke="url(#${idPrefix}-left-grad)" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Digital dissolving cubes -->
      ${svgBlocks}
      <!-- Cosmic star sparkles -->
      ${svgStars}
    </g>
  `;
}

// -------------------------------------------------------------
// Direction 2: INFINITE BLOOM ("Growth, Sprout & Wonder")
// -------------------------------------------------------------
function renderBloomInfinity({ cx, cy, rx, ry, strokeWidth = 14, idPrefix = 'bloom' }) {
  // Left loop: organic vine with sprouting golden leaves
  const leftPts = [];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const t = (Math.PI / 2) + (i / steps) * Math.PI;
    leftPts.push(getLemniscatePt(t, cx, cy, rx, ry));
  }
  const leftPath = `M ${leftPts[0].x.toFixed(1)} ${leftPts[0].y.toFixed(1)} ` +
    leftPts.slice(1).map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

  // Leaf sprouts along the left loop
  const leafIndices = [12, 25, 38, 48];
  const leaves = leafIndices.map((idx, k) => {
    const pt = leftPts[idx];
    const prev = leftPts[idx - 1] || pt;
    const next = leftPts[idx + 1] || pt;
    const angle = Math.atan2(next.y - prev.y, next.x - prev.x) * (180 / Math.PI) + (k % 2 === 0 ? 45 : -45);
    return `
      <g transform="translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)}) rotate(${angle.toFixed(1)})">
        <path d="M0 0 C 8 -12, 22 -8, 20 6 C 14 12, 4 8, 0 0 Z" fill="${COLORS.goldStar}" stroke="${COLORS.goldStroke}" stroke-width="1.8" />
        <path d="M0 0 C 6 2, 14 2, 18 6" stroke="${COLORS.goldStroke}" stroke-width="1.2" fill="none" />
      </g>
    `;
  }).join('\n');

  // Right loop: digital pollen cubes & floral seed pixels dissolving
  const pollen = [];
  for (let i = 0; i <= 20; i++) {
    const frac = i / 20;
    const t = 1.5 * Math.PI + frac * 0.5 * Math.PI;
    const pt = getLemniscatePt(t, cx, cy, rx, ry);
    const driftX = frac * frac * 36;
    const driftY = -frac * frac * 22 + (frac * 14);
    const sz = strokeWidth * (1.15 - frac * 0.45);
    const op = (1 - frac * 0.38).toFixed(2);
    pollen.push({
      x: pt.x + driftX - sz / 2,
      y: pt.y + driftY - sz / 2,
      w: sz,
      h: sz,
      rx: 4,
      opacity: op,
      fill: frac > 0.5 ? COLORS.lilac : COLORS.goldStar
    });
  }

  for (let i = 0; i <= 20; i++) {
    const frac = i / 20;
    const t = frac * 0.5 * Math.PI;
    const pt = getLemniscatePt(t, cx, cy, rx, ry);
    const driftX = (1 - frac) * (1 - frac) * 46;
    const driftY = -(1 - frac) * 38;
    const sz = strokeWidth * (0.65 + frac * 0.45);
    const op = (0.5 + frac * 0.5).toFixed(2);
    pollen.push({
      x: pt.x + driftX - sz / 2,
      y: pt.y + driftY - sz / 2,
      w: sz,
      h: sz,
      rx: 4,
      opacity: op,
      fill: frac < 0.5 ? COLORS.mauveLight : COLORS.goldStar
    });
  }

  // Floating blossom seeds
  const seeds = [];
  for (let j = 0; j < 16; j++) {
    const sx = cx + rx * 0.72 + (j * 8.5) + (Math.sin(j * 3.5) * 14);
    const sy = cy - ry * 0.38 - (j * 5.2) + (Math.cos(j * 2.8) * 12);
    const sz = 3.5 + (j % 4) * 2.2;
    const op = Math.max(0.2, (0.85 - j * 0.04)).toFixed(2);
    seeds.push(`
      <circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${(sz/2).toFixed(1)}" fill="${j % 2 === 0 ? COLORS.goldStar : COLORS.lilac}" opacity="${op}" />
    `);
  }

  const svgPollen = pollen.map(b =>
    `<rect x="${b.x.toFixed(1)}" y="${b.y.toFixed(1)}" width="${b.w.toFixed(1)}" height="${b.h.toFixed(1)}" rx="${b.rx}" fill="${b.fill}" opacity="${b.opacity}" />`
  ).join('\n');

  return `
    <g class="bloom-infinity">
      <defs>
        <linearGradient id="${idPrefix}-stem-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${COLORS.lilac}" />
          <stop offset="50%" stop-color="${COLORS.mauveLight}" />
          <stop offset="100%" stop-color="${COLORS.goldStar}" />
        </linearGradient>
      </defs>
      <!-- Vine path -->
      <path d="${leftPath}" fill="none" stroke="url(#${idPrefix}-stem-grad)" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Golden leaf sprouts -->
      ${leaves}
      <!-- Dissolving digital pollen blocks -->
      ${svgPollen}
      <!-- Floating blossom seeds -->
      ${seeds.join('\n')}
    </g>
  `;
}

// -------------------------------------------------------------
// Direction 3: PLAYFUL GEOMETRIC ("Modern Joy & Digital Discovery")
// -------------------------------------------------------------
function renderGeometricInfinity({ cx, cy, rx, ry, strokeWidth = 16, idPrefix = 'geom' }) {
  // Dual-tone modern geometric ribbon
  const leftPts = [];
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const t = (Math.PI / 2) + (i / steps) * Math.PI;
    leftPts.push(getLemniscatePt(t, cx, cy, rx, ry));
  }
  const leftPath = `M ${leftPts[0].x.toFixed(1)} ${leftPts[0].y.toFixed(1)} ` +
    leftPts.slice(1).map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

  // Clean isometric voxel cubes breaking away in an architectural grid
  const voxels = [];
  for (let i = 0; i <= 20; i++) {
    const frac = i / 20;
    const t = 1.5 * Math.PI + frac * 0.5 * Math.PI;
    const pt = getLemniscatePt(t, cx, cy, rx, ry);
    const driftX = frac * 34;
    const driftY = -frac * 18;
    const sz = strokeWidth * (1.1 - frac * 0.4);
    const op = (1 - frac * 0.32).toFixed(2);
    voxels.push({
      x: pt.x + driftX - sz / 2,
      y: pt.y + driftY - sz / 2,
      w: sz,
      h: sz,
      rx: 2,
      opacity: op,
      fill: frac > 0.5 ? COLORS.lilac : COLORS.goldStar
    });
  }

  for (let i = 0; i <= 20; i++) {
    const frac = i / 20;
    const t = frac * 0.5 * Math.PI;
    const pt = getLemniscatePt(t, cx, cy, rx, ry);
    const driftX = (1 - frac) * 44;
    const driftY = -(1 - frac) * 34;
    const sz = strokeWidth * (0.68 + frac * 0.42);
    const op = (0.55 + frac * 0.45).toFixed(2);
    voxels.push({
      x: pt.x + driftX - sz / 2,
      y: pt.y + driftY - sz / 2,
      w: sz,
      h: sz,
      rx: 2,
      opacity: op,
      fill: frac < 0.5 ? COLORS.mauveLight : COLORS.goldStar
    });
  }

  // Floating geometric learning blocks
  const scatter = [];
  for (let j = 0; j < 15; j++) {
    const sx = cx + rx * 0.76 + (j * 8) + (j % 2 === 0 ? 6 : -6);
    const sy = cy - ry * 0.35 - (j * 5.5) + (j % 3 === 0 ? 8 : -4);
    const sz = 4 + (j % 3) * 2.5;
    const op = Math.max(0.25, (0.9 - j * 0.045)).toFixed(2);
    scatter.push(`
      <rect x="${(sx - sz/2).toFixed(1)}" y="${(sy - sz/2).toFixed(1)}" width="${sz.toFixed(1)}" height="${sz.toFixed(1)}" rx="1.5" fill="${j % 2 === 0 ? COLORS.goldStar : COLORS.lilac}" opacity="${op}" />
    `);
  }

  const svgVoxels = voxels.map(b =>
    `<rect x="${b.x.toFixed(1)}" y="${b.y.toFixed(1)}" width="${b.w.toFixed(1)}" height="${b.h.toFixed(1)}" rx="${b.rx}" fill="${b.fill}" opacity="${b.opacity}" stroke="${COLORS.charcoalInk}" stroke-width="1.2" />`
  ).join('\n');

  return `
    <g class="geometric-infinity">
      <!-- Shadow depth track -->
      <path d="${leftPath}" fill="none" stroke="${COLORS.plumDark}" stroke-width="${strokeWidth + 4}" stroke-linecap="round" stroke-linejoin="round" opacity="0.6" />
      <!-- Golden ribbon track -->
      <path d="${leftPath}" fill="none" stroke="${COLORS.goldStar}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />
      <!-- Lilac inner pinstripe -->
      <path d="${leftPath}" fill="none" stroke="${COLORS.lilac}" stroke-width="${strokeWidth * 0.3}" stroke-linecap="round" stroke-linejoin="round" opacity="0.9" />
      <!-- Digital modular voxel blocks -->
      ${svgVoxels}
      <!-- Floating geometric blocks -->
      ${scatter.join('\n')}
    </g>
  `;
}

// -------------------------------------------------------------
// Subject Icon Vectors (256x256)
// -------------------------------------------------------------
function getSubjectSvgContent(subjectKey, direction) {
  // Common center 128, 128
  switch (subjectKey) {
    case 'english':
      return `
        <!-- English: Open Gilded Book with Floating Letters -->
        <defs>
          <linearGradient id="eng-book" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="100%" stop-color="${COLORS.lilac}" />
          </linearGradient>
        </defs>
        <!-- Open Pages -->
        <path d="M48 160 C 78 145, 110 148, 128 158 C 146 148, 178 145, 208 160 L 208 88 C 178 74, 146 76, 128 86 C 110 76, 78 74, 48 88 Z"
              fill="url(#eng-book)" stroke="${COLORS.goldDeep}" stroke-width="4" stroke-linejoin="round" />
        <!-- Center Book Spine -->
        <path d="M128 86 L128 168" stroke="${COLORS.goldDeep}" stroke-width="5" stroke-linecap="round" />
        <path d="M48 160 C 78 145, 110 148, 128 158 C 146 148, 178 145, 208 160"
              fill="none" stroke="${COLORS.goldDeep}" stroke-width="4" />
        <!-- Page lines -->
        <line x1="68" y1="105" x2="110" y2="102" stroke="${COLORS.mauve}" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>
        <line x1="68" y1="120" x2="112" y2="117" stroke="${COLORS.mauve}" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>
        <line x1="68" y1="135" x2="105" y2="133" stroke="${COLORS.mauve}" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>
        <line x1="146" y1="102" x2="188" y2="105" stroke="${COLORS.mauve}" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>
        <line x1="144" y1="117" x2="188" y2="120" stroke="${COLORS.mauve}" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>
        <line x1="151" y1="133" x2="188" y2="135" stroke="${COLORS.mauve}" stroke-width="2.5" stroke-linecap="round" opacity="0.6"/>
        <!-- Floating Alphabet Sparks -->
        <text x="76" y="66" font-family="'Nunito', sans-serif" font-weight="900" font-size="28" fill="${COLORS.goldStar}" text-anchor="middle">A</text>
        <text x="128" y="52" font-family="'Nunito', sans-serif" font-weight="900" font-size="34" fill="${COLORS.lilac}" text-anchor="middle">b</text>
        <text x="180" y="68" font-family="'Nunito', sans-serif" font-weight="900" font-size="28" fill="${COLORS.goldStar}" text-anchor="middle">C</text>
        <!-- Sparkles -->
        <circle cx="98" cy="46" r="3" fill="#FFFFFF" />
        <circle cx="158" cy="44" r="3.5" fill="#FFFFFF" />
      `;

    case 'science':
      return `
        <!-- Science: Erlenmeyer Flask with Atomic Energy Rings -->
        <defs>
          <linearGradient id="sci-liquid" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${COLORS.lilac}" />
            <stop offset="100%" stop-color="${COLORS.mauve}" />
          </linearGradient>
        </defs>
        <!-- Flask Body -->
        <path d="M112 56 L144 56 L144 86 L184 168 C 190 180, 182 196, 168 196 L88 196 C 74 196, 66 180, 72 168 L112 86 Z"
              fill="rgba(255,255,255,0.15)" stroke="${COLORS.white}" stroke-width="5" stroke-linejoin="round" />
        <!-- Bubbling potion -->
        <path d="M82 172 C 96 164, 114 176, 128 170 C 142 164, 160 174, 174 172 L 168 194 L 88 194 Z"
              fill="url(#sci-liquid)" opacity="0.85" />
        <ellipse cx="128" cy="56" rx="16" ry="5" fill="${COLORS.white}" opacity="0.8" />
        <!-- Orbiting Rings -->
        <ellipse cx="128" cy="138" rx="66" ry="24" fill="none" stroke="${COLORS.goldStar}" stroke-width="3.5" transform="rotate(-28 128 138)" stroke-dasharray="12 4" />
        <ellipse cx="128" cy="138" rx="66" ry="24" fill="none" stroke="${COLORS.lilac}" stroke-width="3" transform="rotate(28 128 138)" />
        <!-- Spark Bubbles -->
        <circle cx="120" cy="145" r="5" fill="${COLORS.goldStar}" />
        <circle cx="140" cy="130" r="4" fill="${COLORS.white}" />
        <circle cx="112" cy="115" r="3" fill="${COLORS.goldStar}" />
        <circle cx="178" cy="112" r="5.5" fill="${COLORS.goldStar}" />
        <circle cx="78" cy="160" r="4.5" fill="${COLORS.lilac}" />
      `;

    case 'word-power':
      return `
        <!-- Word Power: High-Voltage Dialogue Badge -->
        <defs>
          <linearGradient id="wp-spark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFE072" />
            <stop offset="100%" stop-color="${COLORS.goldDeep}" />
          </linearGradient>
        </defs>
        <!-- Speech Bubble -->
        <path d="M54 70 C 54 48, 72 38, 128 38 C 184 38, 202 48, 202 70 C 202 110, 184 136, 142 136 L 112 168 L 114 136 C 72 136, 54 110, 54 70 Z"
              fill="${COLORS.lilac}" stroke="${COLORS.white}" stroke-width="5" stroke-linejoin="round" />
        <!-- High Voltage Lightning Spark -->
        <polygon points="132,48 102,96 124,96 112,132 154,84 130,84"
                 fill="url(#wp-spark)" stroke="${COLORS.charcoalInk}" stroke-width="3.5" stroke-linejoin="round" />
        <!-- Energy Rays -->
        <circle cx="78" cy="62" r="4" fill="${COLORS.goldDeep}" />
        <circle cx="178" cy="62" r="4" fill="${COLORS.goldDeep}" />
        <circle cx="186" cy="104" r="5" fill="${COLORS.goldStar}" />
      `;

    case 'treasure-words':
      return `
        <!-- Treasure Words: Sparkling Gilded Word Chest -->
        <defs>
          <linearGradient id="tw-chest" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#722378" />
            <stop offset="100%" stop-color="${COLORS.plumDark}" />
          </linearGradient>
        </defs>
        <!-- Chest Base -->
        <path d="M58 116 L198 116 L186 186 C 184 194, 176 200, 168 200 L88 200 C 80 200, 72 194, 70 186 Z"
              fill="url(#tw-chest)" stroke="${COLORS.goldDeep}" stroke-width="5" stroke-linejoin="round" />
        <!-- Open Chest Lid -->
        <path d="M52 114 C 52 74, 96 68, 128 68 C 160 68, 204 74, 204 114 Z"
              fill="url(#tw-chest)" stroke="${COLORS.goldStar}" stroke-width="5" />
        <!-- Golden Metal Straps -->
        <path d="M84 68 L84 200" stroke="${COLORS.goldStar}" stroke-width="6" />
        <path d="M172 68 L172 200" stroke="${COLORS.goldStar}" stroke-width="6" />
        <!-- Glowing Lock Badge -->
        <circle cx="128" cy="132" r="14" fill="${COLORS.goldStar}" stroke="${COLORS.goldStroke}" stroke-width="3" />
        <circle cx="128" cy="130" r="3.5" fill="${COLORS.charcoalInk}" />
        <path d="M128 133 L128 140" stroke="${COLORS.charcoalInk}" stroke-width="3" stroke-linecap="round" />
        <!-- Radiant Overflowing Word Crystals -->
        <polygon points="128,42 136,56 128,70 120,56" fill="${COLORS.lilac}" stroke="${COLORS.white}" stroke-width="2" />
        <polygon points="100,52 106,62 100,72 94,62" fill="${COLORS.goldStar}" stroke="${COLORS.white}" stroke-width="2" />
        <polygon points="156,52 162,62 156,72 150,62" fill="${COLORS.goldStar}" stroke="${COLORS.white}" stroke-width="2" />
        <circle cx="128" cy="32" r="3" fill="#FFFFFF" />
      `;

    case 'maths':
      return `
        <!-- Maths: Geometric Compass, Calculus & Infinity -->
        <defs>
          <linearGradient id="math-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FFE072" />
            <stop offset="100%" stop-color="${COLORS.goldDeep}" />
          </linearGradient>
        </defs>
        <!-- Drafting Triangle / Ruler -->
        <polygon points="56,186 196,186 196,56" fill="rgba(245,210,248,0.2)" stroke="${COLORS.white}" stroke-width="4.5" stroke-linejoin="round" />
        <polygon points="90,172 172,172 172,96" fill="${COLORS.plumDark}" stroke="${COLORS.white}" stroke-width="3" />
        <!-- Math Operations Badges -->
        <circle cx="92" cy="74" r="22" fill="url(#math-grad)" stroke="${COLORS.goldStroke}" stroke-width="3" />
        <text x="92" y="83" font-family="'Nunito', sans-serif" font-weight="900" font-size="28" fill="${COLORS.charcoalInk}" text-anchor="middle">+</text>
        <circle cx="170" cy="142" r="18" fill="${COLORS.lilac}" stroke="${COLORS.white}" stroke-width="2.5" />
        <text x="170" y="150" font-family="'Nunito', sans-serif" font-weight="900" font-size="24" fill="${COLORS.charcoalInk}" text-anchor="middle">×</text>
        <!-- Mathematical Pi Symbol -->
        <text x="134" y="115" font-family="'Nunito', sans-serif" font-weight="900" font-size="34" fill="${COLORS.goldStar}">π</text>
      `;

    case 'reasoning':
      return `
        <!-- Reasoning: Interlocking Puzzle Pieces & Insight Bulb -->
        <defs>
          <linearGradient id="reas-bulb" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFF2A3" />
            <stop offset="100%" stop-color="${COLORS.goldDeep}" />
          </linearGradient>
        </defs>
        <!-- Interlocking Puzzle Piece (Left) -->
        <path d="M60 84 L100 84 C 100 94, 114 94, 114 84 L128 84 L128 124 C 118 124, 118 138, 128 138 L128 174 L60 174 Z"
              fill="${COLORS.lilac}" stroke="${COLORS.white}" stroke-width="4" stroke-linejoin="round" opacity="0.85" />
        <!-- Interlocking Puzzle Piece (Right) -->
        <path d="M128 84 L196 84 L196 174 L154 174 C 154 164, 140 164, 140 174 L128 174 Z"
              fill="${COLORS.mauve}" stroke="${COLORS.white}" stroke-width="4" stroke-linejoin="round" opacity="0.85" />
        <!-- Insight Lightbulb -->
        <circle cx="128" cy="74" r="28" fill="url(#reas-bulb)" stroke="${COLORS.goldStroke}" stroke-width="3.5" />
        <path d="M116 98 L140 98 L136 112 L120 112 Z" fill="${COLORS.white}" stroke="${COLORS.charcoalInk}" stroke-width="2.5" />
        <line x1="122" y1="116" x2="134" y2="116" stroke="${COLORS.white}" stroke-width="3" stroke-linecap="round" />
        <!-- Radiant Insight Rays -->
        <line x1="128" y1="36" x2="128" y2="24" stroke="${COLORS.goldStar}" stroke-width="4" stroke-linecap="round" />
        <line x1="156" y1="46" x2="166" y2="38" stroke="${COLORS.goldStar}" stroke-width="4" stroke-linecap="round" />
        <line x1="100" y1="46" x2="90" y2="38" stroke="${COLORS.goldStar}" stroke-width="4" stroke-linecap="round" />
      `;

    case 'well-being':
      return `
        <!-- Well-being: Radiant Heart Embraced by Calming Warmth -->
        <defs>
          <linearGradient id="wb-heart" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFA8C2" />
            <stop offset="60%" stop-color="${COLORS.coralBlush}" />
            <stop offset="100%" stop-color="#C24068" />
          </linearGradient>
        </defs>
        <!-- Gentle Caring Hands / Wings Base -->
        <path d="M48 152 C 60 188, 100 198, 128 198 C 156 198, 196 188, 208 152 C 190 156, 170 148, 154 158 C 142 166, 134 168, 128 168 C 122 168, 114 166, 102 158 C 86 148, 66 156, 48 152 Z"
              fill="${COLORS.lilac}" stroke="${COLORS.white}" stroke-width="3.5" stroke-linejoin="round" />
        <!-- Radiant Loving Heart -->
        <path d="M128 66 C 114 36, 68 40, 68 84 C 68 122, 112 144, 128 162 C 144 144, 188 122, 188 84 C 188 40, 142 36, 128 66 Z"
              fill="url(#wb-heart)" stroke="${COLORS.white}" stroke-width="4.5" stroke-linejoin="round" />
        <!-- Inner Heart Highlight -->
        <path d="M84 76 C 84 56, 102 54, 114 66" stroke="#FFFFFF" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.75" />
        <!-- Chamak's Comforting Star Sparkles -->
        <g transform="translate(162, 54) scale(0.9)">
          <path d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z" fill="${COLORS.goldStar}" />
        </g>
        <circle cx="78" cy="116" r="4" fill="${COLORS.goldStar}" />
        <circle cx="178" cy="116" r="4" fill="${COLORS.goldStar}" />
      `;

    default:
      return `<circle cx="128" cy="128" r="40" fill="${COLORS.goldStar}" />`;
  }
}

// -------------------------------------------------------------
// HTML Page Generators for Each Asset Type
// -------------------------------------------------------------

function generateHtmlShell({ width, height, bodyContent, background = 'transparent' }) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Quicksand:wght@700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: ${width}px;
      height: ${height}px;
      overflow: hidden;
      background: ${background};
      font-family: 'Nunito', 'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
  </style>
</head>
<body>
  ${bodyContent}
</body>
</html>`;
}

// 1. WORDMARK (1000x280)
function getWordmarkHtml(spelling = 'apprec', direction = 'cosmic-star') {
  // spelling: 'apprec' | 'appreci'
  const text = spelling;
  const isCosmic = direction === 'cosmic-star';
  const isBloom = direction === 'infinite-bloom';
  
  let infinitySvg;
  if (isCosmic) {
    infinitySvg = renderCosmicInfinity({ cx: 120, cy: 95, rx: 90, ry: 64, strokeWidth: 15, idPrefix: `wm-${spelling}` });
  } else if (isBloom) {
    infinitySvg = renderBloomInfinity({ cx: 120, cy: 95, rx: 90, ry: 64, strokeWidth: 15, idPrefix: `wm-${spelling}` });
  } else {
    infinitySvg = renderGeometricInfinity({ cx: 120, cy: 95, rx: 90, ry: 64, strokeWidth: 16, idPrefix: `wm-${spelling}` });
  }

  const textWidth = spelling === 'apprec' ? 440 : 490;
  const infLeft = textWidth + 10;

  const bodyContent = `
    <div style="position:relative; width:1000px; height:280px; display:flex; align-items:center; padding-left:48px;">
      <!-- Wordmark Text -->
      <div style="font-size:116px; font-weight:900; letter-spacing:-3px; color:#FFFFFF; line-height:1; display:flex; align-items:baseline;">
        <span>${text}</span>
      </div>
      <!-- Dissolving Infinity Motif -->
      <div style="position:absolute; left:${infLeft}px; top:45px; width:450px; height:190px;">
        <svg width="450" height="190" viewBox="0 0 300 190" style="overflow:visible;">
          ${infinitySvg}
        </svg>
      </div>
    </div>
  `;

  return generateHtmlShell({ width: 1000, height: 280, bodyContent, background: 'transparent' });
}

// 2. APP ICON (512x512)
function getAppIconHtml(direction = 'cosmic-star') {
  const isCosmic = direction === 'cosmic-star';
  const isBloom = direction === 'infinite-bloom';

  let bgGradient;
  let infinitySvg;
  let chamakTop;

  if (isCosmic) {
    bgGradient = `linear-gradient(145deg, #4d1553 0%, #34073a 50%, #1e0322 100%)`;
    infinitySvg = renderCosmicInfinity({ cx: 256, cy: 290, rx: 168, ry: 110, strokeWidth: 24, idPrefix: 'app-cosmic' });
    chamakTop = getChamakSvg({ cx: 256, cy: 172, scale: 2.1, mood: 'happy', glow: true, idPrefix: 'ch-app' });
  } else if (isBloom) {
    bgGradient = `linear-gradient(145deg, #591b60 0%, #3b0940 55%, #230426 100%)`;
    infinitySvg = renderBloomInfinity({ cx: 256, cy: 290, rx: 168, ry: 110, strokeWidth: 24, idPrefix: 'app-bloom' });
    chamakTop = getChamakSvg({ cx: 256, cy: 220, scale: 2.2, mood: 'happy', glow: true, idPrefix: 'ch-bloom' });
  } else {
    bgGradient = `linear-gradient(145deg, #3f0a45 0%, #2b0630 60%, #17021b 100%)`;
    infinitySvg = renderGeometricInfinity({ cx: 256, cy: 290, rx: 168, ry: 110, strokeWidth: 26, idPrefix: 'app-geom' });
    chamakTop = getChamakSvg({ cx: 256, cy: 168, scale: 2.0, mood: 'happy', glow: true, idPrefix: 'ch-geom' });
  }

  const bodyContent = `
    <div style="width:512px; height:512px; position:relative; background:${bgGradient}; border-radius:112px; overflow:hidden; box-shadow:inset 0 0 0 4px rgba(245,200,66,0.3);">
      <!-- Subtle ambient radial light -->
      <div style="position:absolute; width:400px; height:400px; left:56px; top:56px; background:radial-gradient(circle, rgba(245,210,248,0.15) 0%, transparent 70%); pointer-events:none;"></div>
      <!-- SVG Infinity and Mascot Artwork -->
      <svg width="512" height="512" viewBox="0 0 512 512" style="position:absolute; left:0; top:0;">
        ${infinitySvg}
        ${chamakTop}
      </svg>
    </div>
  `;

  return generateHtmlShell({ width: 512, height: 512, bodyContent, background: 'transparent' });
}

// 3. ADAPTIVE ICON FOREGROUND (1024x1024)
// Must keep key artwork strictly inside central 66% circle (radius ~338px, diameter ~676px centered at 512,512)
function getAdaptiveForegroundHtml(direction = 'cosmic-star') {
  const isCosmic = direction === 'cosmic-star';
  const isBloom = direction === 'infinite-bloom';

  let infinitySvg;
  let chamakTop;

  // Center (512, 512), with rx=210, ry=138.
  // Maximum horizontal extent: 512 - 210 = 302, 512 + 210 + 50 = 772 (within [174, 850])
  // Vertical extent: Chamak at y=360 (top ~ 240), Infinity bottom at y=650 + 20 = 670 (well within [174, 850])
  if (isCosmic) {
    infinitySvg = renderCosmicInfinity({ cx: 512, cy: 575, rx: 205, ry: 135, strokeWidth: 32, idPrefix: 'ada-cosmic' });
    chamakTop = getChamakSvg({ cx: 512, cy: 420, scale: 2.7, mood: 'happy', glow: true, idPrefix: 'ch-ada' });
  } else if (isBloom) {
    infinitySvg = renderBloomInfinity({ cx: 512, cy: 575, rx: 205, ry: 135, strokeWidth: 32, idPrefix: 'ada-bloom' });
    chamakTop = getChamakSvg({ cx: 512, cy: 480, scale: 2.8, mood: 'happy', glow: true, idPrefix: 'ch-ada-b' });
  } else {
    infinitySvg = renderGeometricInfinity({ cx: 512, cy: 575, rx: 205, ry: 135, strokeWidth: 34, idPrefix: 'ada-geom' });
    chamakTop = getChamakSvg({ cx: 512, cy: 415, scale: 2.6, mood: 'happy', glow: true, idPrefix: 'ch-ada-g' });
  }

  const bodyContent = `
    <div style="width:1024px; height:1024px; position:relative; background:transparent;">
      <svg width="1024" height="1024" viewBox="0 0 1024 1024">
        ${infinitySvg}
        ${chamakTop}
      </svg>
    </div>
  `;

  return generateHtmlShell({ width: 1024, height: 1024, bodyContent, background: 'transparent' });
}

// 4. NOTIFICATION MARK (96x96)
// Monochrome pure white (#FFFFFF) on transparent background
function getNotificationMarkHtml(direction = 'cosmic-star') {
  // Pure white silhouette of infinity loop + Chamak star
  const bodyContent = `
    <div style="width:96px; height:96px; position:relative; background:transparent;">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <!-- White Chamak Star Silhouette -->
        <g transform="translate(48, 30) scale(0.68) translate(-38, -42)">
          <path d="M38 4l9.5 19.3 21.3 3.1-15.4 15 3.6 21.2L38 52.6 19 62.6l3.6-21.2-15.4-15 21.3-3.1z"
                fill="#FFFFFF" />
        </g>
        <!-- White Infinity Left Loop -->
        <path d="M48 68 C 34 82, 14 74, 14 58 C 14 44, 34 40, 48 54 C 58 42, 74 44, 76 54"
              fill="none" stroke="#FFFFFF" stroke-width="6.5" stroke-linecap="round" stroke-linejoin="round" />
        <!-- Right loop dissolving digital blocks -->
        <rect x="74" y="62" width="7" height="7" rx="1.5" fill="#FFFFFF" />
        <rect x="78" y="52" width="6" height="6" rx="1.5" fill="#FFFFFF" />
        <rect x="80" y="42" width="5" height="5" rx="1.5" fill="#FFFFFF" />
        <circle cx="86" cy="34" r="2.2" fill="#FFFFFF" />
        <circle cx="88" cy="46" r="1.8" fill="#FFFFFF" />
      </svg>
    </div>
  `;

  return generateHtmlShell({ width: 96, height: 96, bodyContent, background: 'transparent' });
}

// 5. SUBJECT ICONS (256x256)
function getSubjectIconHtml(subjectKey, direction = 'cosmic-star') {
  const isCosmic = direction === 'cosmic-star';
  const isBloom = direction === 'infinite-bloom';

  let bg;
  let borderStroke;
  if (isCosmic) {
    bg = `linear-gradient(135deg, #4a1450 0%, #2b0630 100%)`;
    borderStroke = `rgba(245, 200, 66, 0.45)`;
  } else if (isBloom) {
    bg = `linear-gradient(135deg, #5c1864 0%, #34073a 100%)`;
    borderStroke = `rgba(245, 210, 248, 0.45)`;
  } else {
    bg = `linear-gradient(135deg, #3d0943 0%, #220326 100%)`;
    borderStroke = `rgba(245, 200, 66, 0.6)`;
  }

  const svgInner = getSubjectSvgContent(subjectKey, direction);

  const bodyContent = `
    <div style="width:256px; height:256px; position:relative; background:${bg}; border-radius:56px; overflow:hidden; box-shadow:inset 0 0 0 3px ${borderStroke}; display:flex; align-items:center; justify-content:center;">
      <svg width="256" height="256" viewBox="0 0 256 256">
        ${svgInner}
      </svg>
    </div>
  `;

  return generateHtmlShell({ width: 256, height: 256, bodyContent, background: 'transparent' });
}

// 6. FEATURE GRAPHIC (1024x500)
function getFeatureGraphicHtml(direction = 'cosmic-star') {
  const isCosmic = direction === 'cosmic-star';
  const isBloom = direction === 'infinite-bloom';

  let bg;
  let heroInfinity;
  let heroChamak;

  if (isCosmic) {
    bg = `linear-gradient(135deg, #591b60 0%, #3b0940 50%, #1a031d 100%)`;
    heroInfinity = renderCosmicInfinity({ cx: 210, cy: 190, rx: 155, ry: 105, strokeWidth: 22, idPrefix: 'fg-cosmic' });
    heroChamak = getChamakSvg({ cx: 210, cy: 82, scale: 2.1, mood: 'happy', glow: true, idPrefix: 'fg-ch' });
  } else if (isBloom) {
    bg = `linear-gradient(135deg, #681f70 0%, #420a48 50%, #220425 100%)`;
    heroInfinity = renderBloomInfinity({ cx: 210, cy: 190, rx: 155, ry: 105, strokeWidth: 22, idPrefix: 'fg-bloom' });
    heroChamak = getChamakSvg({ cx: 210, cy: 125, scale: 2.2, mood: 'happy', glow: true, idPrefix: 'fg-ch-b' });
  } else {
    bg = `linear-gradient(135deg, #4f1155 0%, #300635 55%, #18021c 100%)`;
    heroInfinity = renderGeometricInfinity({ cx: 210, cy: 190, rx: 155, ry: 105, strokeWidth: 24, idPrefix: 'fg-geom' });
    heroChamak = getChamakSvg({ cx: 210, cy: 78, scale: 2.0, mood: 'happy', glow: true, idPrefix: 'fg-ch-g' });
  }

  const bodyContent = `
    <div style="width:1024px; height:500px; position:relative; background:${bg}; color:#FFFFFF; overflow:hidden;">
      <!-- Subtle starlight texture -->
      <div style="position:absolute; right:60px; top:40px; width:440px; height:420px;">
        <svg width="440" height="420" viewBox="0 0 440 420" style="overflow:visible;">
          ${heroInfinity}
          ${heroChamak}
        </svg>
      </div>

      <!-- Left Content Column -->
      <div style="position:absolute; left:64px; top:64px; max-width:520px;">
        <!-- Pronunciation hint -->
        <div style="font-size:22px; font-weight:700; color:rgba(255,255,255,0.75); margin-bottom:8px;">say it &ldquo;appreciate&rdquo;</div>
        
        <!-- Wordmark -->
        <div style="display:flex; align-items:baseline; margin-bottom:18px;">
          <span style="font-size:94px; font-weight:900; letter-spacing:-2px; line-height:1;">apprec</span>
          <span style="display:inline-block; vertical-align:-12px; margin-left:8px;">
            <svg width="140" height="70" viewBox="0 0 200 110" style="overflow:visible;">
              ${renderCosmicInfinity({ cx: 90, cy: 55, rx: 70, ry: 48, strokeWidth: 12, idPrefix: 'fg-inline' })}
            </svg>
          </span>
        </div>

        <!-- Tagline -->
        <div style="font-size:32px; font-weight:800; color:${COLORS.lilac}; line-height:1.25; margin-bottom:28px;">
          Learn and grow,<br>a little every day.
        </div>

        <!-- Value Pills -->
        <div style="display:flex; gap:10px; flex-wrap:wrap;">
          <div style="font-size:18px; font-weight:800; padding:8px 18px; border-radius:999px; background:rgba(255,255,255,0.12); border:1.5px solid rgba(255,255,255,0.25);">Classes 1–12</div>
          <div style="font-size:18px; font-weight:800; padding:8px 18px; border-radius:999px; background:rgba(245,200,66,0.18); border:1.5px solid ${COLORS.goldStar}; color:${COLORS.goldStar};">Free &middot; No ads</div>
          <div style="font-size:18px; font-weight:800; padding:8px 18px; border-radius:999px; background:rgba(255,255,255,0.12); border:1.5px solid rgba(255,255,255,0.25);">Kids &middot; Parents &middot; Teachers</div>
        </div>
      </div>
    </div>
  `;

  return generateHtmlShell({ width: 1024, height: 500, bodyContent, background: '#1a031d' });
}

// 7. MASTER PRESENTATION OVERVIEW SHEET (1600x1100)
function getOverviewSheetHtml(direction = 'cosmic-star') {
  let dirTitle = '';
  let dirSubtitle = '';
  let dirDescriptionLines = [];

  if (direction === 'cosmic-star') {
    dirTitle = 'Direction 1: Cosmic Star';
    dirSubtitle = 'Chamak & The Infinite Cosmos';
    dirDescriptionLines = [
      '1. Learning as an infinite celestial journey across curiosity and wonder.',
      '2. Golden stardust infinity ribbon dissolving smoothly into ascending constellation pixels.',
      '3. Mascot Chamak flies joyfully at the apex, inspiring kids with warm celestial energy.'
    ];
  } else if (direction === 'infinite-bloom') {
    dirTitle = 'Direction 2: Infinite Bloom';
    dirSubtitle = 'Growth, Sprout & Wonder';
    dirDescriptionLines = [
      '1. Learning as organic personal vitality, blossoming naturally one day at a time.',
      '2. Botanical infinity vine with golden leaf sprouts dissolving into floating digital pollen cubes.',
      '3. Mascot Chamak emerges as the radiant flower at the heart of the nurturing growth vine.'
    ];
  } else {
    dirTitle = 'Direction 3: Playful Geometric';
    dirSubtitle = 'Modern Joy & Digital Discovery';
    dirDescriptionLines = [
      '1. Modern, modular educational badge design uniting geometric clarity with playful warmth.',
      '2. Dual-tone isometric ribbon cleanly deconstructing into ascending digital voxel blocks.',
      '3. Mascot Chamak anchors the identity as an embossed golden badge crest.'
    ];
  }

  const subjects = [
    { key: 'english', label: 'English' },
    { key: 'science', label: 'Science' },
    { key: 'word-power', label: 'Word Power' },
    { key: 'treasure-words', label: 'Treasure Words' },
    { key: 'maths', label: 'Maths' },
    { key: 'reasoning', label: 'Reasoning' },
    { key: 'well-being', label: 'Well-being' },
  ];

  const subjectCards = subjects.map(s => `
    <div style="display:flex; flex-direction:column; align-items:center; gap:8px;">
      <div style="width:110px; height:110px; background:linear-gradient(135deg, #44114a, #230426); border-radius:24px; border:2px solid rgba(245,200,66,0.35); overflow:hidden;">
        <svg width="110" height="110" viewBox="0 0 256 256">
          ${getSubjectSvgContent(s.key, direction)}
        </svg>
      </div>
      <span style="font-size:14px; font-weight:800; color:${COLORS.lilac};">${s.label}</span>
    </div>
  `).join('\n');

  const bodyContent = `
    <div style="width:1600px; height:1100px; background:#1e0322; color:#FFFFFF; padding:44px 56px; box-sizing:border-box; display:flex; flex-direction:column; justify-content:space-between;">
      
      <!-- Top Header & Brand Rationale -->
      <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid rgba(245,210,248,0.15); padding-bottom:24px;">
        <div>
          <div style="font-size:16px; font-weight:800; color:${COLORS.goldStar}; letter-spacing:2px; text-transform:uppercase; margin-bottom:4px;">Apprec8 Brand Identity System</div>
          <div style="font-size:42px; font-weight:900; letter-spacing:-1px;">${dirTitle} &mdash; <span style="color:${COLORS.lilac}; font-weight:700;">${dirSubtitle}</span></div>
          <div style="margin-top:10px; font-size:16px; line-height:1.45; color:rgba(255,255,255,0.85); max-width:850px;">
            ${dirDescriptionLines.map(line => `<div>&bull; ${line}</div>`).join('')}
          </div>
        </div>

        <!-- Palette Swatches -->
        <div style="display:flex; flex-direction:column; align-items:flex-end;">
          <div style="font-size:13px; font-weight:800; color:rgba(255,255,255,0.6); text-transform:uppercase; letter-spacing:1px; margin-bottom:8px;">Brand Palette</div>
          <div style="display:flex; gap:10px;">
            <div style="text-align:center;">
              <div style="width:48px; height:48px; border-radius:12px; background:${COLORS.plum}; border:2px solid rgba(255,255,255,0.2);"></div>
              <div style="font-size:11px; font-weight:700; color:rgba(255,255,255,0.7); margin-top:4px;">#3b0940</div>
            </div>
            <div style="text-align:center;">
              <div style="width:48px; height:48px; border-radius:12px; background:${COLORS.mauve}; border:2px solid rgba(255,255,255,0.2);"></div>
              <div style="font-size:11px; font-weight:700; color:rgba(255,255,255,0.7); margin-top:4px;">#85508a</div>
            </div>
            <div style="text-align:center;">
              <div style="width:48px; height:48px; border-radius:12px; background:${COLORS.lilac}; border:2px solid rgba(255,255,255,0.2);"></div>
              <div style="font-size:11px; font-weight:700; color:rgba(255,255,255,0.7); margin-top:4px;">#F5D2F8</div>
            </div>
            <div style="text-align:center;">
              <div style="width:48px; height:48px; border-radius:12px; background:${COLORS.goldStar}; border:2px solid rgba(255,255,255,0.2);"></div>
              <div style="font-size:11px; font-weight:700; color:rgba(255,255,255,0.7); margin-top:4px;">#F5C842</div>
            </div>
            <div style="text-align:center;">
              <div style="width:48px; height:48px; border-radius:12px; background:#FFFFFF; border:2px solid rgba(255,255,255,0.2);"></div>
              <div style="font-size:11px; font-weight:700; color:rgba(255,255,255,0.7); margin-top:4px;">#FFFFFF</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mid Section: Wordmarks & Core Icons -->
      <div style="display:grid; grid-template-columns: 1.1fr 0.9fr; gap:36px; align-items:center; margin:16px 0;">
        
        <!-- Left: Wordmarks in both spellings -->
        <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); border-radius:24px; padding:24px 32px;">
          <div style="font-size:14px; font-weight:800; color:${COLORS.goldStar}; text-transform:uppercase; letter-spacing:1px; margin-bottom:12px;">Wordmarks (Both Spellings &middot; Dissolving &infin;)</div>
          
          <!-- Spelling 1: apprec∞ -->
          <div style="margin-bottom:16px; border-bottom:1px dashed rgba(255,255,255,0.1); padding-bottom:12px;">
            <div style="font-size:13px; color:rgba(255,255,255,0.6); margin-bottom:4px;">Original Spelling: &ldquo;apprec8&rdquo; &rarr; apprec&infin;</div>
            <div style="display:flex; align-items:baseline;">
              <span style="font-size:60px; font-weight:900; letter-spacing:-2px;">apprec</span>
              <span style="margin-left:10px;">
                <svg width="150" height="70" viewBox="0 0 240 120" style="overflow:visible;">
                  ${direction === 'cosmic-star' ? renderCosmicInfinity({ cx: 100, cy: 60, rx: 80, ry: 55, strokeWidth: 15, idPrefix: 'ov-wm1' }) :
                    direction === 'infinite-bloom' ? renderBloomInfinity({ cx: 100, cy: 60, rx: 80, ry: 55, strokeWidth: 15, idPrefix: 'ov-wm1' }) :
                    renderGeometricInfinity({ cx: 100, cy: 60, rx: 80, ry: 55, strokeWidth: 16, idPrefix: 'ov-wm1' })}
                </svg>
              </span>
            </div>
          </div>

          <!-- Spelling 2: appreci∞ -->
          <div>
            <div style="font-size:13px; color:rgba(255,255,255,0.6); margin-bottom:4px;">Owner Candidate: &ldquo;appreci8&rdquo; &rarr; appreci&infin; (reads &ldquo;appreciate&rdquo; directly)</div>
            <div style="display:flex; align-items:baseline;">
              <span style="font-size:60px; font-weight:900; letter-spacing:-2px;">appreci</span>
              <span style="margin-left:10px;">
                <svg width="150" height="70" viewBox="0 0 240 120" style="overflow:visible;">
                  ${direction === 'cosmic-star' ? renderCosmicInfinity({ cx: 100, cy: 60, rx: 80, ry: 55, strokeWidth: 15, idPrefix: 'ov-wm2' }) :
                    direction === 'infinite-bloom' ? renderBloomInfinity({ cx: 100, cy: 60, rx: 80, ry: 55, strokeWidth: 15, idPrefix: 'ov-wm2' }) :
                    renderGeometricInfinity({ cx: 100, cy: 60, rx: 80, ry: 55, strokeWidth: 16, idPrefix: 'ov-wm2' })}
                </svg>
              </span>
            </div>
          </div>
        </div>

        <!-- Right: App Icon, Adaptive Icon, Notification Mark -->
        <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); border-radius:24px; padding:24px 32px; display:flex; justify-content:space-around; align-items:center;">
          <!-- App Icon 512 Preview -->
          <div style="text-align:center;">
            <div style="font-size:13px; font-weight:800; color:${COLORS.goldStar}; margin-bottom:10px;">App Icon (512&times;512)</div>
            <div style="width:130px; height:130px; border-radius:28px; overflow:hidden; box-shadow:0 12px 28px rgba(0,0,0,0.4); border:2px solid rgba(245,200,66,0.3);">
              <svg width="130" height="130" viewBox="0 0 512 512">
                <rect width="512" height="512" fill="${COLORS.plum}" />
                ${direction === 'cosmic-star' ? renderCosmicInfinity({ cx: 256, cy: 290, rx: 168, ry: 110, strokeWidth: 24, idPrefix: 'ov-app' }) :
                  direction === 'infinite-bloom' ? renderBloomInfinity({ cx: 256, cy: 290, rx: 168, ry: 110, strokeWidth: 24, idPrefix: 'ov-app' }) :
                  renderGeometricInfinity({ cx: 256, cy: 290, rx: 168, ry: 110, strokeWidth: 26, idPrefix: 'ov-app' })}
                ${getChamakSvg({ cx: 256, cy: direction === 'infinite-bloom' ? 220 : 172, scale: 2.1, mood: 'happy', glow: true, idPrefix: 'ov-ch-app' })}
              </svg>
            </div>
            <div style="font-size:11px; color:rgba(255,255,255,0.6); margin-top:6px;">No small text</div>
          </div>

          <!-- Adaptive Icon Guide Preview -->
          <div style="text-align:center;">
            <div style="font-size:13px; font-weight:800; color:${COLORS.goldStar}; margin-bottom:10px;">Adaptive (Safe 66%)</div>
            <div style="width:130px; height:130px; border-radius:50%; background:#2a0530; border:2px dashed ${COLORS.goldStar}; overflow:hidden; display:flex; align-items:center; justify-content:center;">
              <svg width="115" height="115" viewBox="0 0 1024 1024">
                ${direction === 'cosmic-star' ? renderCosmicInfinity({ cx: 512, cy: 575, rx: 205, ry: 135, strokeWidth: 32, idPrefix: 'ov-ada' }) :
                  direction === 'infinite-bloom' ? renderBloomInfinity({ cx: 512, cy: 575, rx: 205, ry: 135, strokeWidth: 32, idPrefix: 'ov-ada' }) :
                  renderGeometricInfinity({ cx: 512, cy: 575, rx: 205, ry: 135, strokeWidth: 34, idPrefix: 'ov-ada' })}
                ${getChamakSvg({ cx: 512, cy: direction === 'infinite-bloom' ? 480 : 420, scale: 2.7, mood: 'happy', glow: true, idPrefix: 'ov-ch-ada' })}
              </svg>
            </div>
            <div style="font-size:11px; color:rgba(255,255,255,0.6); margin-top:6px;">676px circle safe</div>
          </div>

          <!-- Notification Mark Preview -->
          <div style="text-align:center;">
            <div style="font-size:13px; font-weight:800; color:${COLORS.goldStar}; margin-bottom:10px;">Notification (96&times;96)</div>
            <div style="width:96px; height:96px; border-radius:20px; background:#110114; border:1px solid rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center;">
              <svg width="68" height="68" viewBox="0 0 96 96">
                <g transform="translate(48, 30) scale(0.68) translate(-38, -42)"><path d="M38 4l9.5 19.3 21.3 3.1-15.4 15 3.6 21.2L38 52.6 19 62.6l3.6-21.2-15.4-15 21.3-3.1z" fill="#FFFFFF" /></g>
                <path d="M48 68 C 34 82, 14 74, 14 58 C 14 44, 34 40, 48 54 C 58 42, 74 44, 76 54" fill="none" stroke="#FFFFFF" stroke-width="6.5" stroke-linecap="round" />
                <rect x="74" y="62" width="7" height="7" rx="1.5" fill="#FFFFFF" />
                <rect x="78" y="52" width="6" height="6" rx="1.5" fill="#FFFFFF" />
                <circle cx="86" cy="34" r="2.2" fill="#FFFFFF" />
              </svg>
            </div>
            <div style="font-size:11px; color:rgba(255,255,255,0.6); margin-top:6px;">Pure white &middot; 1-color</div>
          </div>

        </div>
      </div>

      <!-- Bottom Section: 7 Subject Icons Row & Mini Feature Graphic -->
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div style="font-size:14px; font-weight:800; color:${COLORS.goldStar}; text-transform:uppercase; letter-spacing:1px;">7 Subject Icons (256&times;256 &middot; Kid-Friendly Vector Emblems)</div>
        <div style="display:flex; justify-content:space-between; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:24px; padding:18px 24px;">
          ${subjectCards}
        </div>
      </div>

    </div>
  `;

  return generateHtmlShell({ width: 1600, height: 1100, bodyContent, background: '#1e0322' });
}

// -------------------------------------------------------------
// Generation Pipeline & Execution
// -------------------------------------------------------------

async function renderHtmlToPng(htmlContent, outputPath, width, height, transparent = true) {
  const tmpHtmlPath = path.join(TMP_DIR, `temp_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.html`);
  fs.writeFileSync(tmpHtmlPath, htmlContent, 'utf8');

  const bgFlag = transparent ? '--default-background-color=00000000' : '';
  const cmd = `"${CHROME_PATH}" --headless --disable-gpu --virtual-time-budget=2000 --screenshot="${outputPath}" --window-size=${width},${height} ${bgFlag} "${tmpHtmlPath}"`;

  try {
    await execAsync(cmd);
  } finally {
    if (fs.existsSync(tmpHtmlPath)) {
      fs.unlinkSync(tmpHtmlPath);
    }
  }
}

async function generateDirection(directionName) {
  console.log(`\n======================================================`);
  console.log(`🚀 Generating Brand Assets for Direction: ${directionName}`);
  console.log(`======================================================`);

  const outDir = path.join(BRAND_DIR, directionName);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const tasks = [];

  // 1. Wordmarks (both spellings + default wordmark.png)
  tasks.push({
    name: 'wordmark-apprec.png',
    fn: () => renderHtmlToPng(getWordmarkHtml('apprec', directionName), path.join(outDir, 'wordmark-apprec.png'), 1000, 280, true)
  });
  tasks.push({
    name: 'wordmark-appreci.png',
    fn: () => renderHtmlToPng(getWordmarkHtml('appreci', directionName), path.join(outDir, 'wordmark-appreci.png'), 1000, 280, true)
  });
  tasks.push({
    name: 'wordmark.png',
    fn: () => renderHtmlToPng(getWordmarkHtml('apprec', directionName), path.join(outDir, 'wordmark.png'), 1000, 280, true)
  });

  // 2. App Icon (512x512)
  tasks.push({
    name: 'app-icon.png',
    fn: () => renderHtmlToPng(getAppIconHtml(directionName), path.join(outDir, 'app-icon.png'), 512, 512, false)
  });

  // 3. Android Adaptive Icon Foreground (1024x1024, transparent)
  tasks.push({
    name: 'adaptive-icon-foreground.png',
    fn: () => renderHtmlToPng(getAdaptiveForegroundHtml(directionName), path.join(outDir, 'adaptive-icon-foreground.png'), 1024, 1024, true)
  });

  // 4. Notification Mark (96x96, pure white on transparent)
  tasks.push({
    name: 'notification-mark.png',
    fn: () => renderHtmlToPng(getNotificationMarkHtml(directionName), path.join(outDir, 'notification-mark.png'), 96, 96, true)
  });

  // 5. 7 Subject Icons (256x256)
  const subjects = [
    'english',
    'science',
    'word-power',
    'treasure-words',
    'maths',
    'reasoning',
    'well-being',
  ];

  for (const sub of subjects) {
    tasks.push({
      name: `subject-${sub}.png`,
      fn: async () => {
        const destPrimary = path.join(outDir, `subject-${sub}.png`);
        const destAlias = path.join(outDir, `${sub}.png`);
        await renderHtmlToPng(getSubjectIconHtml(sub, directionName), destPrimary, 256, 256, true);
        fs.copyFileSync(destPrimary, destAlias);
      }
    });
  }

  // 6. Feature Graphic (1024x500)
  tasks.push({
    name: 'feature-graphic.png',
    fn: () => renderHtmlToPng(getFeatureGraphicHtml(directionName), path.join(outDir, 'feature-graphic.png'), 1024, 500, false)
  });

  // 7. Overview Sheet (1600x1100)
  tasks.push({
    name: 'overview-sheet.png',
    fn: () => renderHtmlToPng(getOverviewSheetHtml(directionName), path.join(outDir, 'overview-sheet.png'), 1600, 1100, false)
  });

  // Execute tasks in parallel batches of 4
  const CONCURRENCY = 4;
  for (let i = 0; i < tasks.length; i += CONCURRENCY) {
    const batch = tasks.slice(i, i + CONCURRENCY);
    console.log(`Processing batch ${Math.floor(i / CONCURRENCY) + 1}/${Math.ceil(tasks.length / CONCURRENCY)} (${batch.map(b => b.name).join(', ')})...`);
    await Promise.all(batch.map(t => t.fn()));
  }

  console.log(`✅ Completed assets for ${directionName}`);
}

async function main() {
  const directions = ['cosmic-star', 'infinite-bloom', 'playful-geometric'];
  const t0 = Date.now();

  for (const dir of directions) {
    await generateDirection(dir);
  }

  // Clean up tmp dir
  if (fs.existsSync(TMP_DIR)) {
    fs.rmSync(TMP_DIR, { recursive: true, force: true });
  }

  console.log(`\n🎉 All 3 Brand Directions Generated Successfully in ${((Date.now() - t0) / 1000).toFixed(1)}s!`);
}

main().catch(err => {
  console.error('Fatal error during brand generation:', err);
  process.exit(1);
});
