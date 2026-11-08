// テスト用：模範的な診療（ideal）と無治療をシミュレートする
import * as S from '../src/engine/sim.js';
import { labValue } from '../src/engine/physiology.js';
import { DISEASE_BY_ID } from '../src/data/diseases/index.js';

function cond(enc, when) {
  if (!when) return true;
  const v = S.currentVitals(enc);
  const p = enc.patient;
  switch (when) {
    case 'spo2<92': return v.rawSpO2 < 92;
    case 'sev2': return p.sev === 2 || v.SBP < 90;
    case 'vol>1500': return enc.state.volume > 1500;
    case 'sev>=1': return p.sev >= 1;
    case 'sbp<90': return v.SBP < 90 && enc.state.ivCryst >= 1000;
    case 'sbp>=100': return v.SBP >= 100;
    case 'shock': return v.SBP < 90;
    case 'sbp>160': return v.SBP > 160;
    case 'alcohol': return p.alcohol === 'daily';
    case 'su': return !!p.vars.su;
    case 'age50': return p.age >= 50;
    case 'tpa_ok': return p.vars.lastNormalH + enc.t / 60 < 4.5 && !p.homeMeds.some((m) => ['warfarin', 'apixaban'].includes(m)) && v.SBP <= 185 && labValue(enc, 'GLU', {}) >= 50;
    case 'k<5': return labValue(enc, 'K', {}) < 5.0;
    case 'glu<250': return enc.state.glu < 250;
    case 'cs1_nopde5': return p.vars.cs1 && !p.homeMeds.includes('sildenafil') && v.SBP > 110;
    default: return true;
  }
}

export function runIdeal(enc, { dispo = true } = {}) {
  const d = DISEASE_BY_ID[enc.patient.diseaseId];
  const actions = d.ideal(enc.patient);
  const done = new Set();
  const doAction = (a, i) => {
    if (done.has(i) || !cond(enc, a.when)) return;
    if (a.a === 'test' && enc.patient.allergies.includes('contrast')) a = { ...a, ids: a.ids.flatMap((id) => (id === 'chest_cta' ? ['echo', 'leg_us', 'chest_ct'] : id === 'abd_ct_contrast' ? ['abd_us'] : [id])) };
    if (a.a === 'rx' && (enc.patient.allergies.includes(require_allergy(a.drugId)) || (a.drugId === 'aspirin' && enc.patient.comorb.includes('asthma_nsaid')))) {
      if (!alt(a.drugId)) { done.add(i); return; }
      // アレルギーがあれば代替薬
      a = { ...a, drugId: alt(a.drugId), dose: altDose(a.drugId, a.dose), freq: altFreq(a.drugId, a.freq) };
    }
    done.add(i);
    if (a.a === 'test') S.orderTests(enc, a.ids);
    else if (a.a === 'rx') S.prescribe(enc, a);
    else if (a.a === 'fluid') S.addFluid(enc, a);
    else if (a.a === 'o2') S.setO2(enc, a.device, a.flow);
    else if (a.a === 'npo') S.setNPO(enc, true);
    else if (a.a === 'proc') S.procedure(enc, a.id);
    else if (a.a === 'wait') S.advance(enc, a.min);
    else if (a.a === 'consult') {
      S.advance(enc, a.delayMin || 0);
      S.consult(enc, a.dept);
    }
  };
  const tick = () => actions.forEach(doAction);
  tick();
  S.setFinalDx(enc, [d.id], false);
  if (!dispo) return;
  // 入院または外来
  const ctx = { initVit: enc.initVit, initLab: (id) => enc.initLabs[id] };
  const best = d.dispo(enc, ctx).best;
  if (best === 'home') {
    // 外来：経口抗菌薬に切り替え
    if (d.id === 'cap') { stopIV(enc); S.prescribe(enc, { drugId: 'ampc', route: 'po', dose: 500, freq: 'q8h', days: 7 }); }
    if (d.id === 'pyelo') { stopIV(enc); S.prescribe(enc, enc.patient.vars.res.fqR ? { drugId: 'cex', route: 'po', dose: 500, freq: 'q6h', days: 10 } : { drugId: 'lvfx', route: 'po', dose: 500, freq: 'q24h', days: 7 }); }
    S.advance(enc, 60);
    S.discharge(enc);
    return;
  }
  S.dispose(enc, best);
  for (let h = 0; h < 24 * 21 && !enc.ended; h++) {
    tick();
    if (enc.patient.diseaseId === 'dka' && enc.state.glu < 200) {
      // インスリン減量
      const ins = enc.orders.find((o) => o.drugId === 'insulin_r' && S.isOrderActive(enc, o));
      if (ins && ins.dose > enc.patient.weight * 0.05) { S.stopOrder(enc, ins.oid); S.prescribe(enc, { drugId: 'insulin_r', route: 'iv', dose: Math.round(enc.patient.weight * 0.05 * 10) / 10, freq: 'cont', days: 2 }); }
    }
    if (enc.patient.diseaseId === 'adhf' && enc.state.volume > -300) {
      for (const o of enc.orders) if (o.drugId === 'furosemide_iv' && S.isOrderActive(enc, o)) S.stopOrder(enc, o.oid);
    }
    // 処置が必要なのに予定されていなければ再検査・再コンサルト
    for (const pr of d.procedures || []) {
      if (enc.state.procAt[pr.id] == null && h % 3 === 0 && h < 12 && !enc.consults.some((c) => !c.replied)) {
        S.orderTests(enc, d.id === 'acs' ? ['tnt', 'ecg'] : ['head_mri', 'head_ct']);
        S.advance(enc, 50);
        S.consult(enc, pr.depts[0]);
      }
    }
    // 有能な主治医としての調整
    const v = S.currentVitals(enc);
    if (enc.state.glu < 70) { S.prescribe(enc, { drugId: 'glucose50', route: 'iv', dose: 40, freq: 'once', days: 1 }); if (!enc.orders.some((o) => o.fluidId === 'd5w' && S.isOrderActive(enc, o))) S.addFluid(enc, { fluidId: 'd5w', mode: 'cont', rate: 80 }); }
    if (v.SBP < 95) for (const o of enc.orders) if (o.kind === 'rx' && S.isOrderActive(enc, o) && ['landiolol', 'nicardipine', 'ntg', 'carperitide'].includes(o.drugId)) S.stopOrder(enc, o.oid);
    const o2 = enc.orders.find((o) => o.kind === 'o2' && S.isOrderActive(enc, o));
    if (v.SpO2 < 90 && (!o2 || o2.device === 'nc')) S.setO2(enc, 'mask', 7);
    if (o2 && v.rawSpO2 >= 94) S.setO2(enc, null);
    const ivOn = enc.orders.some((o) => o.kind === 'fluid' && S.isOrderActive(enc, o));
    if (!ivOn && enc.state.volume > 1200 && enc.patient.diseaseId !== 'adhf') S.addFluid(enc, { fluidId: 'lr', mode: 'cont', rate: 100 });
    if (ivOn && enc.state.volume < 200 && enc.patient.diseaseId !== 'dka') for (const o of enc.orders) if (o.kind === 'fluid' && S.isOrderActive(enc, o)) S.stopOrder(enc, o.oid);
    if (d.organisms.length && !enc.state.cured && !enc.orders.some((o) => o.kind === 'rx' && S.isOrderActive(enc, o) && o.end && o.end - enc.t > 120 && ['ctrx', 'cmz', 'mepm', 'lvfx', 'abpc_sbt'].includes(o.drugId))) {
      const last = [...enc.orders].reverse().find((o) => o.kind === 'rx' && ['ctrx', 'cmz', 'mepm', 'lvfx', 'abpc_sbt'].includes(o.drugId));
      if (last) S.prescribe(enc, { drugId: last.drugId, route: last.route, dose: last.dose, freq: last.freq, days: 3 });
    }
    S.advance(enc, 60);
    if (enc.state.cured && S.dischargeReady(enc)) break;
  }
  if (!enc.ended) S.discharge(enc);
}

function stopIV(enc) {
  for (const o of enc.orders) if (o.kind === 'rx' && o.route === 'iv' && S.isOrderActive(enc, o)) o.stopT = enc.t;
}
const ALLERGY_OF = { abpc: 'penicillin', aspirin: 'nsaid', ctrx: 'cephem', cmz: 'cephem', ampc: 'penicillin', abpc_sbt: 'penicillin', lvfx: 'quinolone' };
function require_allergy(id) { return ALLERGY_OF[id] || '__none'; }
function alt(id) { return { aspirin: 'prasugrel', ctrx: 'lvfx', cmz: 'mepm', ampc: 'lvfx', abpc_sbt: 'lvfx', lvfx: 'ctrx' }[id]; }
function altDose(id, dose) { return { aspirin: 20, ctrx: 500, cmz: 1000, ampc: 500, abpc_sbt: 500, lvfx: 2000 }[id]; }
function altFreq(id, f) { return { aspirin: 'once', ctrx: 'q24h', cmz: 'q8h', ampc: 'q24h', abpc_sbt: 'q24h', lvfx: 'q24h' }[id]; }

export function runUntreated(enc) {
  S.advance(enc, 14 * 1440);
}
