// 患者の内部状態からバイタル・検査値を導出する（医学的に連動する値はここで一元的に計算）
import { LABS, refFor } from '../data/labs.js';
import { DISEASE_BY_ID } from '../data/diseases/index.js';
import { clamp, hashRand } from './rng.js';

const disease = (enc) => DISEASE_BY_ID[enc.patient.diseaseId];

function baseOf(p, id) {
  const L = LABS[id];
  if (!L.base) return 0;
  const b = L.base.m != null ? L.base : L.base[p.sex];
  return b.m + p.z[id] * b.sd;
}

function applyDisease(enc, id, v) {
  const d = disease(enc);
  const e = d.labs?.[id];
  const roll = enc.patient.rolls.labs[id];
  if (!e || !roll || !roll.on) return v;
  const f = clamp(enc.state.burden / 100, 0, 1);
  const w = clamp(Math.pow(f, e.k ?? 1) * enc.patient.r[id], 0, 1.25);
  if (e.ord) return enc.state.burden > 10 ? roll.g : v;
  if (e.to != null) return v + (roll.v - v) * w;
  if (e.add != null) return v + roll.v * w;
  if (e.mul != null) return v * (1 + (roll.v - 1) * w);
  return v;
}

/** 検査値（真値）。cache は同一時点での再計算を省く */
export function labValue(enc, id, cache = {}) {
  if (cache[id] != null) return cache[id];
  const p = enc.patient, st = enc.state, d = disease(enc);
  const L = LABS[id];
  const get = (x) => labValue(enc, x, cache);
  const f = clamp(st.burden / 100, 0, 1);
  let v;
  switch (id) {
    case 'CR': {
      v = p.crBase;
      if (st.volume > 800) v *= 1 + ((st.volume - 800) / 1000) * 0.18;
      v = applyDisease(enc, 'CR', v);
      v += st.crInjury || 0;
      break;
    }
    case 'BUN': {
      v = baseOf(p, 'BUN') * (p.crBase / 0.85) ** 0.6;
      if (st.volume > 500) v += ((st.volume - 500) / 1000) * 9;
      v = applyDisease(enc, 'BUN', v);
      break;
    }
    case 'GLU': v = st.glu; break;
    case 'K': {
      v = baseOf(p, 'K') + (p.comorb.includes('ckd') ? 0.4 : 0) + st.kDelta;
      v = applyDisease(enc, 'K', v);
      break;
    }
    case 'NA': {
      v = applyDisease(enc, 'NA', baseOf(p, 'NA'));
      const g = get('GLU');
      if (g > 100) v -= (1.6 * (g - 100)) / 100;
      break;
    }
    case 'HCO3': {
      v = d.hco3Fn ? d.hco3Fn(st.burden) : applyDisease(enc, 'HCO3', 24 + (p.z.CL * -0.5));
      v -= Math.max(0, get('LAC') - 1.5) * 0.9;
      v += st.hco3Bonus || 0;
      break;
    }
    case 'PCO2': {
      const h = get('HCO3');
      const extra = d.pco2Extra ? (d.pco2Extra[0] + (d.pco2Extra[1] - d.pco2Extra[0]) * p.r.PCO2 / 1.2) * f : 0;
      const art = h < 22 ? 1.5 * h + 8 + extra : 40 + (h - 24) * 0.7;
      v = art + 6; // 静脈血
      break;
    }
    case 'PH': {
      const h = get('HCO3');
      const pco2a = get('PCO2') - 6;
      v = 6.1 + Math.log10(h / (0.03 * pco2a)) - 0.03;
      break;
    }
    case 'AG': v = get('NA') - get('CL') - get('HCO3'); break;
    case 'EGFR': {
      const cr = get('CR');
      v = 194 * Math.pow(cr, -1.094) * Math.pow(p.age, -0.287) * (p.sex === 'F' ? 0.739 : 1);
      break;
    }
    case 'HBA1C': v = p.hba1cBase; break;
    case 'BNP': {
      v = baseOf(p, 'BNP');
      if (p.comorb.includes('chf')) v = 220 * (1 + 0.25 * p.z.BNP) + (p.comorb.includes('ckd') ? 80 : 0);
      v = applyDisease(enc, 'BNP', v);
      break;
    }
    case 'U_GLU': {
      const g = get('GLU');
      v = g > 500 ? 5 : g > 350 ? 4 : g > 250 ? 3 : g > 170 ? 2 : 0;
      break;
    }
    case 'U_KET': {
      const k = get('BHB');
      v = k > 3000 ? 4 : k > 1500 ? 3 : k > 600 ? 2 : 0;
      v = Math.max(v, applyDisease(enc, 'U_KET', 0));
      break;
    }
    default: {
      if (L.ord) v = applyDisease(enc, id, 0);
      else v = applyDisease(enc, id, baseOf(p, id));
    }
  }
  if (d.labHook) v = d.labHook(enc, id, v);
  if (L.abs) v = clamp(v, L.abs[0], L.abs[1]);
  cache[id] = v;
  return v;
}

export function labFlag(enc, id, v) {
  const L = LABS[id];
  const r = refFor(L, enc.patient.sex);
  if (L.ord) return v > r[1] ? 'H' : '';
  if (id === 'EGFR') return v < 60 ? 'L' : '';
  if (v > r[1]) return 'H';
  if (v < r[0]) return 'L';
  return '';
}

export function formatLab(id, v) {
  const L = LABS[id];
  if (L.ord) return ['−', '±', '1+', '2+', '3+', '4+'][Math.round(v)] ?? '−';
  if (L.dp === -2) return String(Math.round(v / 100) * 100);
  return v.toFixed(Math.max(0, L.dp));
}

/** O2投与によるSpO2上昇量 */
export function o2Boost(eff, raw) {
  if (!eff.o2Device) return 0;
  const f = eff.o2Flow || 0;
  let b = { nc: Math.min(6, f * 1.3), mask: 5 + (f - 5) * 0.8, reservoir: 11, nppv: 13 }[eff.o2Device] ?? 0;
  if (raw < 80) b *= 0.75;
  return b;
}

export function computeJCS(enc, sbp) {
  const d = disease(enc), st = enc.state;
  const off = d.id === 'dka' ? -8 : 0;
  let j = 0;
  const b = st.burden;
  if (b >= 92 + off) j = 10; else if (b >= 82 + off) j = 3; else if (b >= 72 + off) j = 1;
  if (st.volume > 4500) j = Math.max(j, 1);
  if (sbp < 70) j = Math.max(j, 3);
  if (st.glu < 35) j = 100; else if (st.glu < 50) j = Math.max(j, 10); else if (st.glu < 60) j = Math.max(j, 1);
  if (st.dead) j = 300;
  return j;
}

/** バイタル（現在値）。noiseKey を与えると測定誤差を加える */
export function vitals(enc, eff, noiseKey) {
  const p = enc.patient, st = enc.state, d = disease(enc);
  const f = clamp(st.burden / 100, 0, 1);
  const bv = p.baseVitals, tg = p.vitalTargets;
  const lerp = (k, base) => {
    const t = tg[k];
    if (!t || t.to == null) return base;
    return base + (t.to - base) * Math.pow(f, t.k);
  };
  let T = lerp('T', bv.T);
  if (eff.tags.antipyretic && T > 37.5) T -= Math.min(1.2, T - 37.0);
  let HR = lerp('HR', bv.HR);
  if (T > 37.5 && !tg.HR) HR += (T - 37) * 8;
  if (st.volume > 300) HR += clamp((st.volume - 300) / 100, 0, 35);
  let RR = lerp('RR', bv.RR);
  let SBP = d.customVitals ? d.customVitals(enc, f).SBP : lerp('SBP', bv.SBP);
  if (st.volume > 1500) SBP -= ((st.volume - 1500) / 100) * 2.0;
  if (eff.tags.nitrate) SBP -= 18;
  if (eff.tags.vasodilator) SBP -= 8;
  if (eff.tags.betablocker) { HR -= Math.min(35, eff.tags.betablocker * 8); SBP -= Math.min(15, eff.tags.betablocker * 4); }
  if (eff.tags.bp_lower) SBP -= Math.min(55, eff.tags.bp_lower * 16);
  if (eff.tags.opioid) { SBP -= 5; HR -= 4; }
  if (eff.tags.vasopressor) SBP += Math.min(40, (eff.tags.vasopressor / 0.1) * 22);
  let SpO2raw = bv.SpO2 - (tg.SpO2?.drop ?? 0) * Math.pow(f, tg.SpO2?.k ?? 1);
  if (st.anaphylaxis && !st.anaphylaxis.resolved && enc.t >= st.anaphylaxis.t) {
    SBP -= 45; HR += 25; SpO2raw -= 7; RR += 6;
  }
  if (st.hypoEvent && enc.t >= st.hypoEvent.t && enc.t < st.hypoEvent.until) { SBP -= 50; HR += 15; }
  if (st.surgeryAt && enc.t >= st.surgeryAt && enc.t < st.surgeryAt + 90) HR += 5;
  if (noiseKey != null) {
    const n = (k, a) => (hashRand(p.seed, 'vn', noiseKey, k) - 0.5) * 2 * a;
    T += n('T', 0.1); HR += n('HR', 3); RR += n('RR', 1); SBP += n('S', 4); SpO2raw += n('O', 0.8);
  }
  SBP = clamp(SBP, 40, 240);
  HR = clamp(HR, 30, 190);
  SpO2raw = clamp(SpO2raw, 55, 100);
  const SpO2 = clamp(SpO2raw + o2Boost(eff, SpO2raw), 55, 100);
  const JCS = computeJCS(enc, SBP);
  return {
    T: Math.round(T * 10) / 10, HR: Math.round(HR), RR: Math.round(clamp(RR, 6, 50)),
    SBP: Math.round(SBP), DBP: Math.round(SBP * 0.58 + 8), SpO2: Math.min(100, Math.round(SpO2)), rawSpO2: SpO2raw, JCS,
    o2: eff.o2Label || '室内気',
  };
}

export const crcl = (enc, cache) => {
  const p = enc.patient;
  const cr = labValue(enc, 'CR', cache);
  return ((140 - p.age) * p.weight) / (72 * cr) * (p.sex === 'F' ? 0.85 : 1);
};
