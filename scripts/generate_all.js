const fs = require('fs');
const path = require('path');
const {
  getSharedDefs,
  createRose,
  createWhiteBlossom,
  createRosebud,
  createEucLeaf,
  createWillowLeaf,
  createGoldenBerryCluster
} = require('./build_florals');

const sharedDefs = getSharedDefs();

// ============================================================================
// 1. FLORAL DIVISOR (300 x 84)
// ============================================================================
function generateDivisor() {
  const width = 300;
  const height = 84;
  const cx = 150;
  const cy = 42;

  // Stems
  const stems = `
    <!-- Left Stems -->
    <path d="M 150 42 Q 100 48 20 40" stroke="#5d7d93" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.85" />
    <path d="M 140 40 Q 95 30 45 28" stroke="#7898ac" stroke-width="1.3" fill="none" stroke-linecap="round" opacity="0.75" />
    <path d="M 140 44 Q 95 58 55 54" stroke="#7898ac" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.75" />

    <!-- Right Stems -->
    <path d="M 150 42 Q 200 48 280 40" stroke="#5d7d93" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.85" />
    <path d="M 160 40 Q 205 30 255 28" stroke="#7898ac" stroke-width="1.3" fill="none" stroke-linecap="round" opacity="0.75" />
    <path d="M 160 44 Q 205 58 245 54" stroke="#7898ac" stroke-width="1.2" fill="none" stroke-linecap="round" opacity="0.75" />
  `;

  // Foliage
  let foliage = '';
  // Left foliage
  foliage += createEucLeaf(125, 43, 16, 12, 135, 1);
  foliage += createEucLeaf(125, 43, 14, 11, 225, 2);
  foliage += createEucLeaf(105, 44, 18, 13, 140, 2);
  foliage += createEucLeaf(105, 44, 16, 11, 230, 1);
  foliage += createEucLeaf(82, 44, 17, 12, -225, 2);
  foliage += createEucLeaf(82, 44, 15, 10, -140, 1);
  foliage += createEucLeaf(60, 43, 14, 10, -220, 2);
  foliage += createEucLeaf(60, 43, 13, 9, -135, 1);
  foliage += createEucLeaf(38, 42, 13, 9, -210, 1);
  foliage += createEucLeaf(38, 42, 12, 8, -125, 2);
  foliage += createWillowLeaf(20, 40, 15, -175, 1);

  // Upper/lower left secondary leaves
  foliage += createEucLeaf(125, 32, 12, 9, 15, 2);
  foliage += createEucLeaf(95, 28, 11, 8, 10, 1);
  foliage += createEucLeaf(68, 27, 10, 7, 5, 2);
  foliage += createWillowLeaf(45, 28, 12, 5, 2);

  // Right foliage
  foliage += createEucLeaf(175, 43, 16, 12, -45, 1);
  foliage += createEucLeaf(175, 43, 14, 11, 45, 2);
  foliage += createEucLeaf(195, 44, 18, 13, -40, 2);
  foliage += createEucLeaf(195, 44, 16, 11, 50, 1);
  foliage += createEucLeaf(218, 44, 17, 12, 45, 2);
  foliage += createEucLeaf(218, 44, 15, 10, -40, 1);
  foliage += createEucLeaf(240, 43, 14, 10, 40, 2);
  foliage += createEucLeaf(240, 43, 13, 9, -45, 1);
  foliage += createEucLeaf(262, 42, 13, 9, 30, 1);
  foliage += createEucLeaf(262, 42, 12, 8, -55, 2);
  foliage += createWillowLeaf(280, 40, 15, -5, 1);

  // Upper/lower right secondary leaves
  foliage += createEucLeaf(175, 32, 12, 9, -15, 2);
  foliage += createEucLeaf(205, 28, 11, 8, -10, 1);
  foliage += createEucLeaf(232, 27, 10, 7, -5, 2);
  foliage += createWillowLeaf(255, 28, 12, -5, 2);

  // Golden berries
  const berryPoints = [
    {x: 120, y: 55, r: 2.5}, {x: 124, y: 52, r: 2.1}, {x: 115, y: 57, r: 1.8},
    {x: 95, y: 55, r: 2.4}, {x: 90, y: 52, r: 2.0}, {x: 75, y: 53, r: 2.2}, {x: 70, y: 56, r: 1.8},
    {x: 180, y: 55, r: 2.5}, {x: 176, y: 52, r: 2.1}, {x: 185, y: 57, r: 1.8},
    {x: 205, y: 55, r: 2.4}, {x: 210, y: 52, r: 2.0}, {x: 225, y: 53, r: 2.2}, {x: 230, y: 56, r: 1.8},
    // Upper accent berries
    {x: 108, y: 26, r: 1.9}, {x: 140, y: 24, r: 2.3}, {x: 160, y: 24, r: 2.3}, {x: 192, y: 26, r: 1.9}
  ];
  const berries = createGoldenBerryCluster(berryPoints);

  // Central Flowers: Navy Blue Rose + White Rose + White Blossom
  // 1. Navy Rose (left center)
  const navyRose = createRose(135, 42, 16.5, 25, 'navy');
  // 2. White Rose (right center)
  const whiteRose = createRose(165, 41, 15.5, -15, 'white');
  // 3. Delicate White Blossom (top center)
  const blossom = createWhiteBlossom(150, 29, 10, 0);

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
${sharedDefs}
<g id="floral-divisor-hd">
  ${stems}
  ${foliage}
  ${berries}
  ${blossom}
  ${whiteRose}
  ${navyRose}
</g>
</svg>
  `.trim();
}

// ============================================================================
// 2. FLORAL RAMO (200 x 450)
// ============================================================================
function generateRamo() {
  const width = 200;
  const height = 450;

  const stems = `
    <!-- Main undulating vertical stem -->
    <path d="M 35 30 Q 65 120 55 220 Q 45 320 65 425" stroke="#5d7d93" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.85" />
    <path d="M 48 90 Q 95 150 80 215" stroke="#7898ac" stroke-width="1.4" fill="none" stroke-linecap="round" opacity="0.7" />
    <path d="M 52 245 Q 95 310 65 375" stroke="#7898ac" stroke-width="1.4" fill="none" stroke-linecap="round" opacity="0.7" />
  `;

  let foliage = '';
  // Top stem leaves
  foliage += createWillowLeaf(35, 30, 22, -80, 1);
  foliage += createEucLeaf(40, 55, 18, 12, -60, 2);
  foliage += createEucLeaf(38, 55, 16, 11, -120, 1);
  foliage += createEucLeaf(48, 85, 20, 13, -50, 1);
  foliage += createEucLeaf(44, 85, 17, 12, -130, 2);
  foliage += createEucLeaf(58, 115, 22, 14, -40, 2);
  foliage += createEucLeaf(52, 115, 19, 13, -135, 1);
  foliage += createEucLeaf(64, 145, 24, 15, -30, 1);
  foliage += createEucLeaf(56, 145, 20, 13, -140, 2);
  foliage += createEucLeaf(68, 175, 23, 14, -20, 2);

  // Bottom stem leaves
  foliage += createEucLeaf(65, 275, 24, 15, 30, 2);
  foliage += createEucLeaf(50, 275, 20, 13, 140, 1);
  foliage += createEucLeaf(60, 310, 23, 14, 45, 1);
  foliage += createEucLeaf(48, 310, 19, 12, 135, 2);
  foliage += createEucLeaf(56, 345, 21, 13, 50, 2);
  foliage += createEucLeaf(45, 345, 18, 11, 130, 1);
  foliage += createEucLeaf(58, 380, 19, 12, 60, 1);
  foliage += createEucLeaf(50, 380, 16, 10, 120, 2);
  foliage += createWillowLeaf(65, 425, 22, 80, 1);

  // Side sprig leaves
  foliage += createEucLeaf(88, 165, 16, 10, -10, 2);
  foliage += createEucLeaf(95, 190, 15, 10, 15, 1);
  foliage += createEucLeaf(90, 290, 16, 10, 25, 2);
  foliage += createEucLeaf(85, 330, 17, 11, 40, 1);

  // Golden berries
  const berryPoints = [
    {x: 60, y: 70, r: 2.8}, {x: 66, y: 74, r: 2.2}, {x: 58, y: 78, r: 2.4},
    {x: 82, y: 135, r: 3.0}, {x: 90, y: 138, r: 2.5}, {x: 85, y: 145, r: 2.2},
    {x: 105, y: 185, r: 3.2}, {x: 112, y: 192, r: 2.6},
    {x: 100, y: 275, r: 3.0}, {x: 108, y: 282, r: 2.5},
    {x: 80, y: 360, r: 2.8}, {x: 86, y: 365, r: 2.2}, {x: 76, y: 370, r: 2.5},
    {x: 62, y: 405, r: 2.6}, {x: 68, y: 410, r: 2.0}
  ];
  const berries = createGoldenBerryCluster(berryPoints);

  // Flowers around center
  // 1. Navy Rose (Primary, lush)
  const navyRose = createRose(76, 215, 24, 20, 'navy');
  // 2. White Rose (Secondary, elegant contrast)
  const whiteRose = createRose(74, 260, 20, -35, 'white');
  // 3. Delicate White Blossom (accent)
  const blossom = createWhiteBlossom(98, 235, 14, 15);
  // 4. Navy Rosebud (top accent)
  const budNavy = createRosebud(72, 170, 14, -20, 'navy');
  // 5. White Rosebud (bottom accent)
  const budWhite = createRosebud(68, 295, 13, 25, 'white');

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
${sharedDefs}
<g id="floral-ramo-hd">
  ${stems}
  ${foliage}
  ${berries}
  ${budNavy}
  ${budWhite}
  ${blossom}
  ${whiteRose}
  ${navyRose}
</g>
</svg>
  `.trim();
}

// ============================================================================
// 3. FLORAL CANTO (500 x 500)
// ============================================================================
function generateCanto() {
  const width = 500;
  const height = 500;

  // Stems sweeping diagonally from top-right towards bottom-left
  const stems = `
    <!-- Main corner stems -->
    <path d="M 485 15 Q 380 90 280 230 Q 200 340 90 440" stroke="#5d7d93" stroke-width="2.6" fill="none" stroke-linecap="round" opacity="0.85" />
    <path d="M 495 80 Q 400 180 320 290 Q 240 400 160 480" stroke="#7898ac" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.75" />
    <path d="M 430 10 Q 320 120 220 220 Q 120 320 30 400" stroke="#7898ac" stroke-width="1.6" fill="none" stroke-linecap="round" opacity="0.75" />
    <path d="M 490 200 Q 380 290 290 380" stroke="#8ba9be" stroke-width="1.4" fill="none" stroke-linecap="round" opacity="0.7" />
  `;

  let foliage = '';
  // Top-right outer leaves
  foliage += createWillowLeaf(485, 20, 32, -45, 1);
  foliage += createEucLeaf(465, 45, 24, 16, -30, 2);
  foliage += createEucLeaf(445, 30, 22, 14, -75, 1);
  foliage += createEucLeaf(440, 75, 26, 17, -25, 1);
  foliage += createEucLeaf(415, 60, 24, 15, -80, 2);
  foliage += createEucLeaf(415, 115, 28, 18, -35, 2);
  foliage += createEucLeaf(385, 95, 25, 16, -85, 1);

  // Mid-diagonal leaves
  foliage += createEucLeaf(365, 165, 30, 19, -40, 1);
  foliage += createEucLeaf(335, 140, 26, 17, -90, 2);
  foliage += createEucLeaf(315, 215, 30, 19, -45, 2);
  foliage += createEucLeaf(275, 180, 27, 17, -100, 1);
  foliage += createEucLeaf(255, 265, 28, 18, -50, 1);
  foliage += createEucLeaf(225, 230, 26, 16, -105, 2);

  // Bottom-left trailing leaves
  foliage += createEucLeaf(195, 325, 26, 17, -55, 2);
  foliage += createEucLeaf(165, 290, 24, 15, -115, 1);
  foliage += createEucLeaf(145, 375, 24, 15, -60, 1);
  foliage += createEucLeaf(115, 345, 22, 14, -120, 2);
  foliage += createEucLeaf(95, 420, 22, 14, -65, 2);
  foliage += createEucLeaf(75, 395, 20, 13, -125, 1);
  foliage += createWillowLeaf(50, 455, 28, 135, 1);

  // Secondary side foliage (branching into canvas)
  foliage += createEucLeaf(470, 150, 25, 16, 10, 2);
  foliage += createEucLeaf(440, 220, 27, 17, 20, 1);
  foliage += createEucLeaf(380, 290, 26, 16, 25, 2);
  foliage += createEucLeaf(320, 360, 24, 15, 35, 1);
  foliage += createEucLeaf(240, 420, 23, 14, 45, 2);
  foliage += createEucLeaf(160, 465, 20, 13, 55, 1);

  // Inner corner foliage
  foliage += createEucLeaf(350, 65, 25, 16, -110, 1);
  foliage += createEucLeaf(280, 115, 26, 16, -120, 2);
  foliage += createEucLeaf(210, 175, 24, 15, -130, 1);
  foliage += createEucLeaf(150, 245, 22, 14, -140, 2);
  foliage += createEucLeaf(95, 320, 20, 13, -150, 1);

  // Golden berries
  const berryPoints = [
    {x: 470, y: 95, r: 3.5}, {x: 480, y: 105, r: 2.8}, {x: 475, y: 115, r: 3.2},
    {x: 435, y: 165, r: 3.8}, {x: 445, y: 175, r: 3.0}, {x: 430, y: 185, r: 2.8},
    {x: 375, y: 235, r: 4.0}, {x: 388, y: 245, r: 3.2}, {x: 370, y: 255, r: 3.0},
    {x: 295, y: 315, r: 3.8}, {x: 305, y: 325, r: 3.0}, {x: 290, y: 335, r: 2.8},
    {x: 225, y: 375, r: 3.5}, {x: 235, y: 385, r: 2.8},
    {x: 165, y: 435, r: 3.2}, {x: 175, y: 445, r: 2.6},
    // Inner berry clusters
    {x: 310, y: 90, r: 3.2}, {x: 320, y: 98, r: 2.6},
    {x: 235, y: 155, r: 3.0}, {x: 245, y: 162, r: 2.4},
    {x: 160, y: 220, r: 2.8}, {x: 170, y: 226, r: 2.2}
  ];
  const berries = createGoldenBerryCluster(berryPoints);

  // Rose & Blossom Arrangement
  // 1. Hero Navy Blue Rose (grand centerpiece)
  const heroNavy = createRose(340, 170, 36, 15, 'navy');
  // 2. Hero White Rose (luxurious companion)
  const heroWhite = createRose(270, 235, 32, -25, 'white');
  // 3. Secondary Navy Blue Rose (top outer)
  const secNavy = createRose(410, 115, 26, 45, 'navy');
  // 4. Secondary White Rose (lower inner)
  const secWhite = createRose(205, 300, 24, 30, 'white');
  // 5. Delicate White Blossoms / Anemones
  const blossom1 = createWhiteBlossom(375, 255, 18, 20);
  const blossom2 = createWhiteBlossom(250, 155, 17, -15);
  // 6. Rosebuds
  const budNavy1 = createRosebud(455, 65, 17, -35, 'navy');
  const budWhite1 = createRosebud(145, 365, 16, 50, 'white');
  const budNavy2 = createRosebud(315, 335, 15, 15, 'navy');

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
${sharedDefs}
<g id="floral-canto-hd">
  ${stems}
  ${foliage}
  ${berries}
  ${budNavy1}
  ${budWhite1}
  ${budNavy2}
  ${blossom1}
  ${blossom2}
  ${secNavy}
  ${secWhite}
  ${heroWhite}
  ${heroNavy}
</g>
</svg>
  `.trim();
}

// ============================================================================
// 4. FLORAL MOLDURA FRENTE (500 x 500)
// ============================================================================
// Front frame overlay: luscious Navy & White roses and climbing botanical vines
// wrapping around the circular photo (center 250, 250, radius ~150).
function generateMolduraFrente() {
  const width = 500;
  const height = 500;

  // Stems circling the lower half and trailing up both sides
  const stems = `
    <!-- Left climbing stem -->
    <path d="M 230 420 Q 140 405 95 320 Q 65 240 85 150 Q 95 110 120 75" stroke="#5d7d93" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.85" />
    <path d="M 180 415 Q 110 365 80 280 Q 65 210 90 145" stroke="#7898ac" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.75" />

    <!-- Right climbing stem -->
    <path d="M 270 420 Q 360 405 405 320 Q 435 240 415 150 Q 405 110 380 75" stroke="#5d7d93" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.85" />
    <path d="M 320 415 Q 390 365 420 280 Q 435 210 410 145" stroke="#7898ac" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.75" />

    <!-- Bottom supporting stem -->
    <path d="M 130 380 Q 250 445 370 380" stroke="#4a6a7e" stroke-width="2.0" fill="none" stroke-linecap="round" opacity="0.8" />
  `;

  let foliage = '';
  // Left climbing foliage
  foliage += createWillowLeaf(120, 75, 22, -60, 1);
  foliage += createEucLeaf(105, 105, 18, 12, -45, 2);
  foliage += createEucLeaf(90, 135, 20, 13, -30, 1);
  foliage += createEucLeaf(75, 170, 22, 14, -15, 2);
  foliage += createEucLeaf(68, 210, 24, 15, 5, 1);
  foliage += createEucLeaf(72, 250, 25, 16, 25, 2);
  foliage += createEucLeaf(82, 290, 26, 17, 45, 1);
  foliage += createEucLeaf(102, 330, 27, 18, 65, 2);
  foliage += createEucLeaf(132, 365, 28, 18, 85, 1);

  // Right climbing foliage
  foliage += createWillowLeaf(380, 75, 22, -120, 1);
  foliage += createEucLeaf(395, 105, 18, 12, -135, 2);
  foliage += createEucLeaf(410, 135, 20, 13, -150, 1);
  foliage += createEucLeaf(425, 170, 22, 14, -165, 2);
  foliage += createEucLeaf(432, 210, 24, 15, 175, 1);
  foliage += createEucLeaf(428, 250, 25, 16, 155, 2);
  foliage += createEucLeaf(418, 290, 26, 17, 135, 1);
  foliage += createEucLeaf(398, 330, 27, 18, 115, 2);
  foliage += createEucLeaf(368, 365, 28, 18, 95, 1);

  // Bottom outward foliage
  foliage += createEucLeaf(160, 415, 26, 17, 105, 2);
  foliage += createEucLeaf(195, 435, 27, 17, 85, 1);
  foliage += createEucLeaf(235, 442, 28, 18, 90, 2);
  foliage += createEucLeaf(275, 440, 28, 18, 90, 1);
  foliage += createEucLeaf(315, 430, 27, 17, 80, 2);
  foliage += createEucLeaf(345, 410, 26, 16, 70, 1);

  // Golden berries
  const berryPoints = [
    // Left vine berries
    {x: 100, y: 120, r: 3.0}, {x: 108, y: 126, r: 2.4},
    {x: 75, y: 190, r: 3.5}, {x: 82, y: 198, r: 2.8}, {x: 70, y: 205, r: 2.5},
    {x: 78, y: 270, r: 3.8}, {x: 86, y: 278, r: 3.0},
    {x: 110, y: 350, r: 3.8}, {x: 118, y: 358, r: 3.0},
    // Right vine berries
    {x: 400, y: 120, r: 3.0}, {x: 392, y: 126, r: 2.4},
    {x: 425, y: 190, r: 3.5}, {x: 418, y: 198, r: 2.8}, {x: 430, y: 205, r: 2.5},
    {x: 422, y: 270, r: 3.8}, {x: 414, y: 278, r: 3.0},
    {x: 390, y: 350, r: 3.8}, {x: 382, y: 358, r: 3.0},
    // Bottom berry sprays
    {x: 175, y: 440, r: 3.2}, {x: 185, y: 446, r: 2.6},
    {x: 325, y: 440, r: 3.2}, {x: 315, y: 446, r: 2.6}
  ];
  const berries = createGoldenBerryCluster(berryPoints);

  // Magnificent Bottom Floral Arrangement (Front Overlay)
  // 1. Hero Navy Blue Rose (left-center bottom, overlapping circle)
  const heroNavy = createRose(205, 395, 32, 15, 'navy');
  // 2. Hero White Rose (right-center bottom, overlapping circle)
  const heroWhite = createRose(285, 398, 30, -20, 'white');
  // 3. Medium Navy Rose (left flank)
  const medNavy = createRose(145, 360, 24, 35, 'navy');
  // 4. Medium White Rose (right flank)
  const medWhite = createRose(350, 365, 23, -35, 'white');
  // 5. White Blossoms (nestled between roses)
  const blossomLeft = createWhiteBlossom(110, 315, 17, 25);
  const blossomRight = createWhiteBlossom(385, 320, 17, -25);
  const blossomCenter = createWhiteBlossom(245, 420, 15, 0);
  // 6. Rosebuds climbing the vines
  const budNavyLeft = createRosebud(88, 235, 16, 20, 'navy');
  const budWhiteRight = createRosebud(412, 235, 16, -20, 'white');
  const budWhiteTopLeft = createRosebud(108, 145, 14, -15, 'white');
  const budNavyTopRight = createRosebud(392, 145, 14, 15, 'navy');

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
${sharedDefs}
<g id="floral-moldura-frente-hd">
  ${stems}
  ${foliage}
  ${berries}
  ${budWhiteTopLeft}
  ${budNavyTopRight}
  ${budNavyLeft}
  ${budWhiteRight}
  ${blossomLeft}
  ${blossomRight}
  ${blossomCenter}
  ${medNavy}
  ${medWhite}
  ${heroWhite}
  ${heroNavy}
</g>
</svg>
  `.trim();
}

// ============================================================================
// 5. FLORAL MOLDURA (500 x 500) - Background Layer
// ============================================================================
// Elegant golden rings and soft botanical halo behind the photo
function generateMolduraFundo() {
  const width = 500;
  const height = 500;

  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
${sharedDefs}
<defs>
  <radialGradient id="haloGold" cx="50%" cy="50%" r="50%">
    <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
    <stop offset="70%" stop-color="#f5ecda" stop-opacity="0.35"/>
    <stop offset="88%" stop-color="#e8d7b5" stop-opacity="0.25"/>
    <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
  </radialGradient>
</defs>
<g id="floral-moldura-fundo-hd">
  <!-- Subtle botanical warm glow behind the photo -->
  <circle cx="250" cy="250" r="210" fill="url(#haloGold)" />

  <!-- Double Golden Geometric Wreath Rings -->
  <circle cx="250" cy="250" r="198" fill="none" stroke="#d4af37" stroke-width="1.2" stroke-dasharray="4 6" opacity="0.65" />
  <circle cx="250" cy="250" r="204" fill="none" stroke="#c5a059" stroke-width="0.8" opacity="0.5" />
  <circle cx="250" cy="250" r="188" fill="none" stroke="#e6c875" stroke-width="0.6" opacity="0.4" />

  <!-- Delicate stardust and golden floral accents around the halo -->
  <circle cx="250" cy="46" r="2.8" fill="url(#goldBerry)" />
  <circle cx="242" cy="44" r="1.8" fill="url(#goldBerry)" />
  <circle cx="258" cy="44" r="1.8" fill="url(#goldBerry)" />

  <circle cx="106" cy="106" r="2.4" fill="url(#goldBerry)" />
  <circle cx="394" cy="106" r="2.4" fill="url(#goldBerry)" />

  <circle cx="46" cy="250" r="2.5" fill="url(#goldBerry)" />
  <circle cx="454" cy="250" r="2.5" fill="url(#goldBerry)" />

  <circle cx="106" cy="394" r="2.4" fill="url(#goldBerry)" />
  <circle cx="394" cy="394" r="2.4" fill="url(#goldBerry)" />
</g>
</svg>
  `.trim();
}

// Generate all files
const outDir = path.join(__dirname, '..', 'img');

fs.writeFileSync(path.join(outDir, 'floral-divisor.svg'), generateDivisor(), 'utf8');
console.log('Generated img/floral-divisor.svg');

fs.writeFileSync(path.join(outDir, 'floral-ramo.svg'), generateRamo(), 'utf8');
console.log('Generated img/floral-ramo.svg');

fs.writeFileSync(path.join(outDir, 'floral-canto.svg'), generateCanto(), 'utf8');
console.log('Generated img/floral-canto.svg');

fs.writeFileSync(path.join(outDir, 'floral-moldura-frente.svg'), generateMolduraFrente(), 'utf8');
console.log('Generated img/floral-moldura-frente.svg');

fs.writeFileSync(path.join(outDir, 'floral-moldura.svg'), generateMolduraFundo(), 'utf8');
console.log('Generated img/floral-moldura.svg');

console.log('All 5 floral HD SVGs successfully generated!');
