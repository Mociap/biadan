const fs = require('fs');
const path = require('path');

// ============================================================================
// BOTANICAL HIGH-DEFINITION VECTOR GENERATOR: NAVY BLUE & WHITE WEDDING ROSES
// ============================================================================

function getSharedDefs() {
  return `
<defs>
  <!-- Navy Blue Rose Gradients -->
  <radialGradient id="navyPetalOuter" cx="35%" cy="30%" r="75%">
    <stop offset="0%" stop-color="#2a5282"/>
    <stop offset="45%" stop-color="#1b365d"/>
    <stop offset="100%" stop-color="#0f223d"/>
  </radialGradient>
  <radialGradient id="navyPetalMid" cx="40%" cy="35%" r="70%">
    <stop offset="0%" stop-color="#346299"/>
    <stop offset="50%" stop-color="#1e3e6b"/>
    <stop offset="100%" stop-color="#102542"/>
  </radialGradient>
  <radialGradient id="navyPetalInner" cx="45%" cy="40%" r="65%">
    <stop offset="0%" stop-color="#3d72b0"/>
    <stop offset="55%" stop-color="#183761"/>
    <stop offset="100%" stop-color="#09172a"/>
  </radialGradient>
  <radialGradient id="navyRoseCenter" cx="45%" cy="45%" r="55%">
    <stop offset="0%" stop-color="#244b7a"/>
    <stop offset="50%" stop-color="#122847"/>
    <stop offset="100%" stop-color="#060f1b"/>
  </radialGradient>

  <!-- White Rose Gradients -->
  <radialGradient id="whitePetalOuter" cx="35%" cy="30%" r="75%">
    <stop offset="0%" stop-color="#ffffff"/>
    <stop offset="60%" stop-color="#f2f6fa"/>
    <stop offset="100%" stop-color="#dce6f0"/>
  </radialGradient>
  <radialGradient id="whitePetalMid" cx="40%" cy="35%" r="70%">
    <stop offset="0%" stop-color="#ffffff"/>
    <stop offset="55%" stop-color="#ebf2f8"/>
    <stop offset="100%" stop-color="#d0dfed"/>
  </radialGradient>
  <radialGradient id="whitePetalInner" cx="45%" cy="40%" r="65%">
    <stop offset="0%" stop-color="#ffffff"/>
    <stop offset="50%" stop-color="#fdfbf7"/>
    <stop offset="85%" stop-color="#e3ecf5"/>
    <stop offset="100%" stop-color="#bccedc"/>
  </radialGradient>
  <radialGradient id="whiteRoseCenter" cx="45%" cy="45%" r="55%">
    <stop offset="0%" stop-color="#fffdf8"/>
    <stop offset="45%" stop-color="#f5efe0"/>
    <stop offset="85%" stop-color="#dce5ee"/>
    <stop offset="100%" stop-color="#a4bccf"/>
  </radialGradient>

  <!-- White Blossom / Anemone Gradients -->
  <linearGradient id="blossomPetal" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#ffffff"/>
    <stop offset="70%" stop-color="#f5f8fc"/>
    <stop offset="100%" stop-color="#dce7f2"/>
  </linearGradient>

  <!-- Eucalyptus & Foliage Gradients -->
  <linearGradient id="eucLeaf1" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#8ba9be"/>
    <stop offset="50%" stop-color="#678a9f"/>
    <stop offset="100%" stop-color="#496c82"/>
  </linearGradient>
  <linearGradient id="eucLeaf2" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#9fc0d4"/>
    <stop offset="55%" stop-color="#779cb3"/>
    <stop offset="100%" stop-color="#51768c"/>
  </linearGradient>
  <linearGradient id="eucLeafDark" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#64859a"/>
    <stop offset="60%" stop-color="#4a6a7e"/>
    <stop offset="100%" stop-color="#324f60"/>
  </linearGradient>
  <linearGradient id="sageLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#a8c5b5"/>
    <stop offset="60%" stop-color="#7e9e8d"/>
    <stop offset="100%" stop-color="#557564"/>
  </linearGradient>

  <!-- Golden Berries & Stamen Gradients -->
  <radialGradient id="goldBerry" cx="35%" cy="35%" r="65%">
    <stop offset="0%" stop-color="#fff8d6"/>
    <stop offset="35%" stop-color="#f7d877"/>
    <stop offset="75%" stop-color="#cca136"/>
    <stop offset="100%" stop-color="#997418"/>
  </radialGradient>
  <linearGradient id="goldStem" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#ebd27d"/>
    <stop offset="100%" stop-color="#b08b2c"/>
  </linearGradient>
</defs>
`;
}

// ============================================================================
// HIGH DEFINITION ROSE BUILDER
// ============================================================================

/**
 * Creates a detailed botanical Rose (Navy Blue or White)
 * @param {number} cx Center X
 * @param {number} cy Center Y
 * @param {number} r Radius
 * @param {number} rot Rotation in degrees
 * @param {'navy' | 'white'} variant
 */
function createRose(cx, cy, r, rot = 0, variant = 'navy') {
  const isNavy = variant === 'navy';
  const outerFill = isNavy ? 'url(#navyPetalOuter)' : 'url(#whitePetalOuter)';
  const midFill = isNavy ? 'url(#navyPetalMid)' : 'url(#whitePetalMid)';
  const innerFill = isNavy ? 'url(#navyPetalInner)' : 'url(#whitePetalInner)';
  const centerFill = isNavy ? 'url(#navyRoseCenter)' : 'url(#whiteRoseCenter)';
  
  const rimStroke = isNavy ? '#6898ca' : '#ffffff';
  const rimStrokeOpacity = isNavy ? 0.75 : 0.95;
  const shadowStroke = isNavy ? '#0a1728' : '#b0c4d8';
  const shadowOpacity = isNavy ? 0.6 : 0.45;
  const sepalsColor = '#416175';

  // Base sepals (green/navy leaf tips beneath the rose)
  const sepals = `
    <!-- Sepals -->
    <path d="M 0 0 C -${r*0.2} -${r*0.8} -${r*0.6} -${r*1.15} 0 -${r*1.28} C ${r*0.1} -${r*1.05} ${r*0.2} -${r*0.8} 0 0 Z" fill="${sepalsColor}" opacity="0.85" transform="rotate(22)"/>
    <path d="M 0 0 C -${r*0.2} -${r*0.8} -${r*0.6} -${r*1.15} 0 -${r*1.28} C ${r*0.1} -${r*1.05} ${r*0.2} -${r*0.8} 0 0 Z" fill="${sepalsColor}" opacity="0.85" transform="rotate(145)"/>
    <path d="M 0 0 C -${r*0.2} -${r*0.8} -${r*0.6} -${r*1.15} 0 -${r*1.28} C ${r*0.1} -${r*1.05} ${r*0.2} -${r*0.8} 0 0 Z" fill="${sepalsColor}" opacity="0.85" transform="rotate(265)"/>
  `;

  // Layer 1: Outer Guard Petals (6 large, gracefully curved petals)
  let outerPetals = '';
  const numOuter = 6;
  for (let i = 0; i < numOuter; i++) {
    const angle = (i * 360 / numOuter) + (i % 2 === 0 ? 3 : -3);
    const pR = r * 0.98;
    const w = r * 0.58;
    outerPetals += `
      <g transform="rotate(${angle})">
        <!-- Petal shadow -->
        <path d="M 0 ${r*0.15} 
                 C -${w*1.1} -${pR*0.45} -${w*1.15} -${pR*0.88} -${w*0.5} -${pR*1.02} 
                 C -${w*0.1} -${pR*1.06} ${w*0.1} -${pR*1.06} ${w*0.5} -${pR*1.02} 
                 C ${w*1.15} -${pR*0.88} ${w*1.1} -${pR*0.45} 0 ${r*0.15} Z" 
              fill="${outerFill}" stroke="${shadowStroke}" stroke-width="${r*0.025}" stroke-opacity="${shadowOpacity}" />
        <!-- Petal rim highlight -->
        <path d="M -${w*0.85} -${pR*0.82} 
                 C -${w*0.45} -${pR*1.03} ${w*0.45} -${pR*1.03} ${w*0.85} -${pR*0.82}" 
              fill="none" stroke="${rimStroke}" stroke-width="${r*0.03}" stroke-opacity="${rimStrokeOpacity}" stroke-linecap="round" />
      </g>
    `;
  }

  // Layer 2: Mid-Outer Petals (5 cupping petals, rotated offset)
  let midPetals = '';
  const numMid = 5;
  for (let i = 0; i < numMid; i++) {
    const angle = (i * 360 / numMid) + 36;
    const pR = r * 0.78;
    const w = r * 0.48;
    midPetals += `
      <g transform="rotate(${angle})">
        <path d="M 0 ${r*0.08} 
                 C -${w*1.1} -${pR*0.4} -${w*1.05} -${pR*0.85} -${w*0.4} -${pR*0.98} 
                 C 0 -${pR*1.04} ${w*0.4} -${pR*0.98} ${w*1.05} -${pR*0.85} 
                 C ${w*1.1} -${pR*0.4} 0 ${r*0.08} 0 ${r*0.08} Z" 
              fill="${midFill}" stroke="${shadowStroke}" stroke-width="${r*0.02}" stroke-opacity="${shadowOpacity}" />
        <path d="M -${w*0.75} -${pR*0.78} 
                 C -${w*0.3} -${pR*0.99} ${w*0.3} -${pR*0.99} ${w*0.75} -${pR*0.78}" 
              fill="none" stroke="${rimStroke}" stroke-width="${r*0.025}" stroke-opacity="${rimStrokeOpacity}" stroke-linecap="round" />
      </g>
    `;
  }

  // Layer 3: Inner Petals (5 tighter, elegant cupping petals)
  let innerPetals = '';
  const numInner = 5;
  for (let i = 0; i < numInner; i++) {
    const angle = (i * 360 / numInner) + 18;
    const pR = r * 0.58;
    const w = r * 0.38;
    innerPetals += `
      <g transform="rotate(${angle})">
        <path d="M 0 0 
                 C -${w*1.05} -${pR*0.35} -${w*0.95} -${pR*0.82} -${w*0.35} -${pR*0.96} 
                 C 0 -${pR*1.02} ${w*0.35} -${pR*0.96} ${w*0.95} -${pR*0.82} 
                 C ${w*1.05} -${pR*0.35} 0 0 0 0 Z" 
              fill="${innerFill}" stroke="${shadowStroke}" stroke-width="${r*0.018}" stroke-opacity="${shadowOpacity}" />
        <path d="M -${w*0.65} -${pR*0.75} 
                 C 0 -${pR*0.98} ${w*0.65} -${pR*0.75} ${w*0.65} -${pR*0.75}" 
              fill="none" stroke="${rimStroke}" stroke-width="${r*0.022}" stroke-opacity="${rimStrokeOpacity}" stroke-linecap="round" />
      </g>
    `;
  }

  // Layer 4: Tight Center Rosebud Whorl (Spiral heart)
  const cR = r * 0.38;
  const centerWhorl = `
    <!-- Center Base Cup -->
    <ellipse cx="0" cy="0" rx="${cR*0.92}" ry="${cR*0.84}" fill="${centerFill}" />
    <!-- Tightly wrapped spiral folds -->
    <path d="M -${cR*0.75} -${cR*0.2} 
             C -${cR*0.8} ${cR*0.5} ${cR*0.2} ${cR*0.8} ${cR*0.7} ${cR*0.3} 
             C ${cR*0.85} -${cR*0.1} ${cR*0.45} -${cR*0.7} -${cR*0.1} -${cR*0.75} 
             C -${cR*0.6} -${cR*0.7} -${cR*0.8} -${cR*0.4} -${cR*0.75} -${cR*0.2} Z" 
          fill="${innerFill}" stroke="${shadowStroke}" stroke-width="${r*0.018}" stroke-opacity="${shadowOpacity}" />
    <!-- Center inner whorl curl 1 -->
    <path d="M -${cR*0.45} -${cR*0.5} 
             C ${cR*0.25} -${cR*0.7} ${cR*0.7} -${cR*0.2} ${cR*0.45} ${cR*0.45} 
             C ${cR*0.1} ${cR*0.7} -${cR*0.45} ${cR*0.4} -${cR*0.5} -${cR*0.05} 
             C -${cR*0.55} -${cR*0.35} -${cR*0.45} -${cR*0.5} -${cR*0.45} -${cR*0.5} Z" 
          fill="${centerFill}" stroke="${rimStroke}" stroke-width="${r*0.02}" stroke-opacity="${rimStrokeOpacity*0.9}" />
    <!-- Center inner whorl curl 2 -->
    <path d="M -${cR*0.3} -${cR*0.1} 
             C -${cR*0.35} ${cR*0.3} ${cR*0.2} ${cR*0.45} ${cR*0.35} ${cR*0.15} 
             C ${cR*0.4} -${cR*0.2} ${cR*0.05} -${cR*0.4} -${cR*0.2} -${cR*0.35} Z" 
          fill="${innerFill}" stroke="${rimStroke}" stroke-width="${r*0.02}" stroke-opacity="${rimStrokeOpacity}" />
    <!-- Center heart dot / deep core -->
    <ellipse cx="0" cy="0" rx="${cR*0.18}" ry="${cR*0.14}" fill="${shadowStroke}" />
    <path d="M -${cR*0.12} -${cR*0.05} Q 0 -${cR*0.18} ${cR*0.12} -${cR*0.05}" fill="none" stroke="${rimStroke}" stroke-width="${r*0.018}" stroke-opacity="${rimStrokeOpacity}"/>
  `;

  return `
  <!-- ${variant.toUpperCase()} ROSE (cx=${cx}, cy=${cy}, r=${r}) -->
  <g transform="translate(${cx.toFixed(1)}, ${cy.toFixed(1)}) rotate(${rot.toFixed(1)})">
    ${sepals}
    ${outerPetals}
    ${midPetals}
    ${innerPetals}
    ${centerWhorl}
  </g>
  `;
}

// ============================================================================
// WHITE BLOSSOM / JASMINE / ANEMONE (Delicate companion flower)
// ============================================================================

function createWhiteBlossom(cx, cy, r, rot = 0) {
  const petals = [];
  const numPetals = 6;
  for (let i = 0; i < numPetals; i++) {
    const angle = (i * 360 / numPetals);
    const pL = r * 1.05;
    const pW = r * 0.42;
    petals.push(`
      <g transform="rotate(${angle})">
        <path d="M 0 0 
                 C -${pW*0.6} -${pL*0.3} -${pW} -${pL*0.7} -${pW*0.4} -${pL*0.96} 
                 C -${pW*0.1} -${pL*1.04} ${pW*0.1} -${pL*1.04} ${pW*0.4} -${pL*0.96} 
                 C ${pW} -${pL*0.7} ${pW*0.6} -${pL*0.3} 0 0 Z" 
              fill="url(#blossomPetal)" stroke="#cfdce8" stroke-width="0.75" />
        <path d="M 0 -${pL*0.15} L 0 -${pL*0.85}" stroke="#e4eef6" stroke-width="0.8" stroke-linecap="round"/>
      </g>
    `);
  }

  // Golden stamen center
  const stamens = [];
  const numStamens = 10;
  for (let i = 0; i < numStamens; i++) {
    const a = i * (360 / numStamens) + 12;
    const rad = a * Math.PI / 180;
    const sLen = r * 0.42;
    const x = Math.cos(rad) * sLen;
    const y = Math.sin(rad) * sLen;
    stamens.push(`
      <line x1="0" y1="0" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#cda43e" stroke-width="0.85" opacity="0.85" />
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r*0.065).toFixed(1)}" fill="url(#goldBerry)" />
    `);
  }

  return `
  <!-- WHITE BLOSSOM (cx=${cx}, cy=${cy}, r=${r}) -->
  <g transform="translate(${cx.toFixed(1)}, ${cy.toFixed(1)}) rotate(${rot.toFixed(1)})">
    ${petals.join('')}
    <!-- Center pistil -->
    <circle cx="0" cy="0" r="${(r*0.22).toFixed(1)}" fill="#ecd992" stroke="#caa23e" stroke-width="0.75" />
    ${stamens.join('')}
    <circle cx="0" cy="0" r="${(r*0.11).toFixed(1)}" fill="#c49727" />
  </g>
  `;
}

// ============================================================================
// ROSEBUD (Delicate opening bud)
// ============================================================================

function createRosebud(cx, cy, r, rot = 0, variant = 'navy') {
  const isNavy = variant === 'navy';
  const fill = isNavy ? 'url(#navyPetalMid)' : 'url(#whitePetalMid)';
  const stroke = isNavy ? '#6898ca' : '#ffffff';
  const sepalsColor = '#416175';

  return `
  <g transform="translate(${cx.toFixed(1)}, ${cy.toFixed(1)}) rotate(${rot.toFixed(1)})">
    <!-- Sepals -->
    <path d="M -${r*0.2} ${r*0.4} C -${r*0.6} ${r*0.1} -${r*0.7} -${r*0.6} -${r*0.2} -${r*0.9} C -${r*0.15} -${r*0.5} 0 -${r*0.2} 0 ${r*0.4} Z" fill="${sepalsColor}" opacity="0.9" />
    <path d="M ${r*0.2} ${r*0.4} C ${r*0.6} ${r*0.1} ${r*0.7} -${r*0.6} ${r*0.2} -${r*0.9} C ${r*0.15} -${r*0.5} 0 -${r*0.2} 0 ${r*0.4} Z" fill="${sepalsColor}" opacity="0.9" />
    <!-- Bud petals -->
    <ellipse cx="0" cy="0" rx="${r*0.45}" ry="${r*0.7}" fill="${fill}" stroke="${stroke}" stroke-width="0.7" />
    <path d="M -${r*0.35} ${r*0.3} C -${r*0.5} -${r*0.3} 0 -${r*0.75} ${r*0.3} -${r*0.5} C 0 -${r*0.3} -${r*0.1} ${r*0.1} -${r*0.35} ${r*0.3} Z" fill="${fill}" stroke="${stroke}" stroke-width="0.75" />
    <!-- Calyx cup -->
    <ellipse cx="0" cy="${r*0.55}" rx="${r*0.28}" ry="${r*0.2}" fill="${sepalsColor}" />
    <path d="M 0 ${r*0.7} Q 0 ${r*1.2} ${r*0.15} ${r*1.5}" stroke="#53748c" stroke-width="1.2" fill="none" stroke-linecap="round" />
  </g>
  `;
}

// ============================================================================
// EUCALYPTUS LEAVES & BRANCHES
// ============================================================================

/**
 * Creates a botanical eucalyptus leaf
 */
function createEucLeaf(x, y, rx, ry, rot, fillVariant = 1) {
  const fill = fillVariant === 1 ? 'url(#eucLeaf1)' : (fillVariant === 2 ? 'url(#eucLeaf2)' : 'url(#eucLeafDark)');
  return `
    <g transform="translate(${x.toFixed(1)}, ${y.toFixed(1)}) rotate(${rot.toFixed(1)})">
      <!-- Leaf blade -->
      <path d="M 0 0 
               C ${rx*0.5} -${ry*0.35} ${rx*0.95} -${ry*0.2} ${rx*1.3} 0 
               C ${rx*0.95} ${ry*0.2} ${rx*0.5} ${ry*0.35} 0 0 Z" 
            fill="${fill}" opacity="0.92" />
      <!-- Central vein -->
      <path d="M 0 0 Q ${rx*0.65} 0 ${rx*1.15} 0" stroke="#e8f2fa" stroke-width="0.65" fill="none" opacity="0.6" stroke-linecap="round" />
    </g>
  `;
}

/**
 * Creates delicate olive/willow leaves
 */
function createWillowLeaf(x, y, len, rot, fillVariant = 1) {
  const fill = fillVariant === 1 ? 'url(#eucLeaf1)' : 'url(#sageLeaf)';
  return `
    <g transform="translate(${x.toFixed(1)}, ${y.toFixed(1)}) rotate(${rot.toFixed(1)})">
      <path d="M 0 0 
               C ${len*0.25} -${len*0.15} ${len*0.75} -${len*0.15} ${len} 0 
               C ${len*0.75} ${len*0.15} ${len*0.25} ${len*0.15} 0 0 Z" 
            fill="${fill}" opacity="0.88" />
      <path d="M 0 0 L ${len*0.9} 0" stroke="#f0f6fc" stroke-width="0.55" opacity="0.6" stroke-linecap="round" />
    </g>
  `;
}

// ============================================================================
// GOLDEN BERRIES SPRIG
// ============================================================================

function createGoldenBerryCluster(points) {
  return points.map(pt => {
    return `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="${pt.r.toFixed(1)}" fill="url(#goldBerry)" stroke="#9c761b" stroke-width="0.4" />`;
  }).join('');
}

// Export modules for individual file generators
module.exports = {
  getSharedDefs,
  createRose,
  createWhiteBlossom,
  createRosebud,
  createEucLeaf,
  createWillowLeaf,
  createGoldenBerryCluster
};
