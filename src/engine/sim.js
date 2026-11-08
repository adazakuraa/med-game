// 診療エンカウンターのエンジン：行動・時間経過・内部状態の更新
import { generatePatient } from './patient.js';
import { DISEASE_BY_ID } from '../data/diseases/index.js';
import { DRUG_BY_ID, FLUID_BY_ID, FREQS, O2_DEVICES, ROUTE_LABEL } from '../data/drugs.js';
import { TEST_BY_ID } from '../data/tests.js';
import { LABS } from '../data/labs.js';
import { QUESTION_BY_ID } from '../data/questions.js';
import { EXAM_BY_ID } from '../data/exams.js';
import { DDX_BY_ID } from '../data/ddx.js';
import { labValue, vitals, labFlag, formatLab } from './physiology.js';
import { answer, examFinding, testReport, fmt } from './findings.js';
import { evaluateRx, evaluateFluid } from './pharm.js';
import { clamp, hashRand } from './rng.js';

// プレイヤー自身が行う処置
export const PROCEDURES = [
  { id: 'drain_R', name: '胸腔ドレナージ（右）', side: '右', min: 20 },
  { id: 'drain_L', name: '胸腔ドレナージ（左）', side: '左', min: 20 },
  { id: 'ng', name: '胃管（経鼻胃管）挿入・減圧', min: 10 },
  { id: 'cooling', name: '積極的冷却（冷水噴霧・送風・氷嚢）', min: 10 },
  { id: 'foley', name: '尿道カテーテル留置', min: 10 },
  { id: 'epley', name: 'Epley法（浮遊耳石置換法）', min: 10 },
  { id: 'enema', name: 'グリセリン浣腸・摘便', min: 15 },
];

export const LOCATION = { er: '救急外来', ward: '一般病棟', icu: 'ICU', home: '自宅' };
export const DEPTS = {
  surgery: '外科', cardio: '循環器内科', resp: '呼吸器内科', endo: '内分泌代謝内科',
  gi: '消化器内科', uro: '泌尿器科', obgyn: '産婦人科', icu: '集中治療科', cvs: '心臓血管外科', neuro: '脳神経内科', nsurg: '脳神経外科', nephro: '腎臓内科', ortho: '整形外科',
};

export const disease = (enc) => DISEASE_BY_ID[enc.patient.diseaseId];

function gluSet(enc) {
  const p = enc.patient;
  let s = 95 + p.z.GLU * 8;
  if (p.comorb.includes('dm2')) s = 150 + p.z.GLU * 15;
  if (p.comorb.includes('t1dm')) s = 170 + p.z.GLU * 20;
  return s + (enc.state ? enc.state.burden * 0.3 : 0);
}

function diureticNeed(p) {
  return 20 * (p.homeMeds.includes('furosemide_po') ? 2 : 1) * (p.crBase > 1.5 ? 2 : 1);
}

function drugCovers(d, key, p) {
  if (!d.covers?.includes(key)) return false;
  const res = p.vars.res || {};
  if (key === 'ecoli' && res.esbl && !d.covers.includes('esbl')) return false;
  if (d.resistKey && res[d.resistKey] && key === 'ecoli') return false;
  return true;
}

function orderActive(o, t, phase) {
  if (t < o.start) return false;
  if (o.stopT != null && t >= o.stopT) return false;
  if (o.end != null && t >= o.end) return false;
  if (phase === 'home' && (o.kind !== 'rx' || !['po', 'inh'].includes(o.route))) return false;
  return true;
}

/** 現在有効な治療の効果をまとめる */
export function effects(enc, t = enc.t) {
  const p = enc.patient, dz = disease(enc);
  const eff = { covers: {}, tags: {}, ivVolRate: 0, ivRateTotal: 0, dextroseGph: 0, kRate: 0, o2Device: null, o2Flow: 0, o2Label: null, nppv: false, diuresis: 0, npo: false };
  for (const o of enc.orders) {
    if (!orderActive(o, t, enc.phase)) continue;
    if (o.kind === 'rx') {
      const d = DRUG_BY_ID[o.drugId];
      const f = o.doseFactor ?? 1;
      if (d.abx) for (const k of dz.organisms) if (drugCovers(d, k, p)) eff.covers[k] = Math.max(eff.covers[k] || 0, f);
      const windowed = (o.freq === 'once' || o.freq === 'prn') && d.effectHours;
      if (windowed && t >= o.start + d.effectHours * 60) continue;
      for (const tag of d.tags || []) {
        let v = 1;
        if (tag === 'insulin') v = d.id === 'insulin_bolus' ? 0.6 : o.dose / (0.1 * p.weight);
        else if (tag === 'potassium') v = o.dose;
        else if (tag === 'vasopressor' || tag === 'betablocker' || tag === 'bp_lower') v = o.dose;
        else if (tag === 'diuretic') v = Math.min(1.5, (o.dose / diureticNeed(p)) * f);
        else if (tag === 'nitrate') v = o.route === 'sl' || o.dose >= 0.5 ? 1 : 0.5;
        eff.tags[tag] = (eff.tags[tag] || 0) + v;
        if (tag === 'diuretic') eff.diuresis += 260 * v * (windowed ? 1 : Math.min(1, (6 * FREQS[o.freq].perDay) / 24));
      }
    } else if (o.kind === 'fluid') {
      const F = FLUID_BY_ID[o.fluidId];
      const rate = o.mode === 'bolus' ? 1000 : o.rate;
      eff.ivVolRate += rate * F.vol;
      eff.ivRateTotal += rate;
      eff.dextroseGph += (rate / 1000) * F.glucose;
      eff.kRate += (rate / 1000) * F.k;
      eff.naRate = (eff.naRate || 0) + (rate / 1000) * F.na;
      if (F.blood) eff.rbcRate = (eff.rbcRate || 0) + rate;
    } else if (o.kind === 'o2') {
      eff.o2Device = o.device; eff.o2Flow = o.flow; eff.nppv = o.device === 'nppv';
      eff.o2Label = O2_DEVICES.find((x) => x.id === o.device).name + (o.device === 'nppv' ? '' : ` ${o.flow}L/分`);
    } else if (o.kind === 'npo') eff.npo = true;
  }
  return eff;
}

function makeCtx(enc, eff, vit, cache = {}) {
  return {
    enc, state: enc.state, eff, vit, rawSpO2: vit.rawSpO2,
    lab: (id) => labValue(enc, id, cache),
    initVit: enc.initVit, initLab: (id) => enc.initLabs[id],
  };
}

export function therapySatisfied(th, eff, enc) {
  const r = th.req;
  if (r.coverage) return Math.min(...r.coverage.map((k) => eff.covers[k] || 0)) >= 0.5;
  if (r.tag) return (eff.tags[r.tag] || 0) >= (r.min ?? 0.5);
  if (r.anyTag) return r.anyTag.some((t) => (eff.tags[t] || 0) > 0) || (r.orFluidK && eff.kRate >= 5);
  if (r.o2) return !!eff.o2Device;
  if (r.fluidTotal) return enc.state.ivCryst >= r.fluidTotal;
  if (r.dextrose) return eff.dextroseGph >= 3;
  if (r.surgery) return !!enc.state.surgeryDone;
  if (r.procDone) return !!enc.state.procDone?.[r.procDone];
  if (r.fn) return r.fn(enc, eff);
  return false;
}

export function isRequired(th, enc) {
  return typeof th.required === 'function' ? th.required(enc) : !!th.required;
}

// ===== エンカウンター生成 =====
export function newEncounter(o) {
  const patient = generatePatient(o);
  const enc = {
    v: 1, patient, t: 0, phase: 'er', log: [], asked: {}, examined: {}, tests: [], orders: [], ddx: [], finalDx: null,
    consults: [], dispo: null, harms: [], warns: [], infos: [], alerts: [], discomfort: 0, cost: 0,
    thStart: {}, thNeed: {}, abxHours: 0, abxStartT: null, nextId: 1, lastVitals: null, ended: false,
    outcome: null, score: null, nurseT: {}, urgent: false, revisitT: null, deathT: null, consultRevealT: null,
  };
  enc.state = {
    burden: patient.burden0, volume: patient.initVolume, glu: 0, kDelta: 0, hco3Bonus: 0, ivCryst: 0, crInjury: 0,
    perforated: false, comp: {}, cured: false, dead: false, surgeryDone: null, surgeryAt: null, anaphylaxis: null, hypoEvent: null,
    procAt: {}, procDone: {}, drains: {},
  };
  enc.state.glu = patient.initGlu ?? gluSet(enc);
  const dz0 = DISEASE_BY_ID[patient.diseaseId];
  if (dz0.initHbLoss) enc.state.hbLoss = dz0.initHbLoss(patient);
  const eff = effects(enc);
  enc.initVit = vitals(enc, eff);
  const cache = {};
  enc.initLabs = Object.fromEntries(Object.keys(LABS).map((id) => [id, labValue(enc, id, cache)]));
  enc.lastVitals = { t: 0, v: vitals(enc, eff, 'triage'), by: 'トリアージ' };
  enc.urgent = patient.arrival === 'ambulance' && patient.sev === 2;
  addLog(enc, 'arrive', `${patient.arrival === 'ambulance' ? '救急車で搬送' : '独歩で来院'}。主訴：${patient.cc}`);
  return enc;
}

export function addLog(enc, type, text, extra = {}) {
  const e = { id: enc.nextId++, t: enc.t, type, text, ...extra };
  enc.log.push(e);
  return e;
}

function alert(enc, kind, text, important = false) {
  const a = { t: enc.t, kind, text, important, seen: false };
  enc.alerts.push(a);
  addLog(enc, 'alert', text, { kind });
  return a;
}

function recordIssues(enc, issues, context) {
  for (const i of issues) {
    const list = i.level === 'harm' ? enc.harms : i.level === 'warn' ? enc.warns : enc.infos;
    if (!list.some((x) => x.code === i.code)) list.push({ ...i, t: enc.t, context });
  }
}

// ===== 時間経過 =====
function step(enc, dtMin) {
  const dtH = dtMin / 60, st = enc.state, p = enc.patient, d = disease(enc);
  const eff = effects(enc);
  const cache = {};
  const vit = vitals(enc, eff);
  const ctx = makeCtx(enc, eff, vit, cache);
  const sat = {};
  for (const th of d.therapies) {
    const needed = th.when ? th.when(ctx) : true;
    if (needed && enc.thNeed[th.id] == null) enc.thNeed[th.id] = enc.t;
    sat[th.id] = therapySatisfied(th, eff, enc);
    if (sat[th.id] && enc.thStart[th.id] == null) enc.thStart[th.id] = enc.t;
  }
  const covered = d.organisms.length && d.organisms.every((k) => (eff.covers[k] || 0) >= 0.5);
  if (covered) {
    if (enc.abxStartT == null) enc.abxStartT = enc.t;
    enc.abxHours += dtH;
  }

  // 病勢（burden）の変化
  let dB;
  const fixedByProc = d.curedBy && st.procDone?.[d.curedBy];
  if (st.cured) dB = -1.0;
  else if (fixedByProc) dB = -1.2;
  else if (st.surgeryDone) dB = st.perforated ? -0.8 : -1.3;
  else if (st.perforated) dB = 0.9;
  else dB = d.natural * (p.refractory && d.natural > 0 ? 1.4 : 1);
  if (!st.cured && !st.surgeryDone && !fixedByProc) {
    for (const th of d.therapies) {
      if (!th.effect || !sat[th.id] || enc.t - enc.thStart[th.id] < th.lagH * 60) continue;
      const fac = th.req.coverage ? Math.min(1, ...th.req.coverage.map((k) => eff.covers[k] || 0)) : 1;
      dB += th.effect * fac * (p.refractory ? 0.3 : 1);
    }
    if (d.dynamics) {
      let x = d.dynamics(enc, eff);
      if (x < 0 && p.refractory) x *= 0.4;
      dB += x;
    }
  }
  if (vit.SpO2 < 88) dB += 0.4;
  if (vit.SBP < 85 && !eff.tags.vasopressor) dB += 0.5;
  if (st.volume > 3500) dB += 0.4;
  const ana = st.anaphylaxis;
  if (ana && !ana.resolved && enc.t >= ana.t) {
    if (eff.tags.epinephrine) {
      ana.resolved = true; ana.resolvedT = enc.t;
      alert(enc, 'nurse', '看護師：アドレナリン投与後、血圧が回復し膨疹も消退してきました。');
    } else dB += enc.t - ana.t > 90 ? 12 : 4;
  }
  if (st.hypoEvent && enc.t >= st.hypoEvent.t && enc.t < st.hypoEvent.until) dB += 2;
  const K = labValue(enc, 'K', cache);
  if ((K < 2.5 || K > 7.0) && !eff.tags.calcium) dB += 6;
  if (st.glu < 40) dB += 4;
  st.burden = clamp(st.burden + dB * dtH, 0, 100);

  // 治癒判定（抗菌薬は所定期間が必要）
  if (!st.cured && st.burden <= 3) {
    const needAbx = d.minAbxDays && !st.surgeryDone;
    if ((!needAbx || enc.abxHours >= d.minAbxDays * 24 - 12) && (!d.minHoursToCure || enc.t >= d.minHoursToCure * 60)) st.cured = true;
    else if (covered) st.burden = 3;
  }
  // 穿孔
  if (d.perforateAt && !st.perforated && !st.surgeryDone && st.burden >= d.perforateAt) {
    st.perforated = true; st.comp.perforation = enc.t;
    if (enc.phase !== 'home') alert(enc, 'nurse', '看護師：腹痛が急に強くなり、お腹全体が痛いと訴えています。', true);
  }
  // 体液量
  const loss = d.fluidLoss ? d.fluidLoss(st.burden, eff, enc) * (st.cured ? 0.2 : 1) : st.burden > 40 ? 25 : 0;
  const drink = !eff.npo && (d.canDrink ? d.canDrink(st.burden, eff) : st.burden < 55) && vit.JCS < 10 && !(st.surgeryAt && enc.t >= st.surgeryAt && enc.t < st.surgeryAt + 360);
  let dV = loss + (drink ? 0 : 60) - eff.ivVolRate + eff.diuresis;
  if (drink && st.volume > 0) dV -= enc.phase === 'home' ? 60 : 40;
  if (drink && st.volume < -500 && d.id !== 'adhf') dV += 30;
  st.volume += dV * dtH;
  st.ivCryst += eff.ivVolRate * dtH;
  st.diuresed = (st.diuresed || 0) + eff.diuresis * dtH;
  st.rbcIn = (st.rbcIn || 0) + (eff.rbcRate || 0) * dtH;
  // 血糖
  const ins = eff.tags.insulin || 0;
  const dka = !!d.gluSetpointDrift;
  const drift = typeof d.gluSetpointDrift === 'function' ? d.gluSetpointDrift(enc) : d.gluSetpointDrift;
  let dG = dka && !st.cured ? drift : (gluSet(enc) - st.glu) * (dka ? 0.3 : 0.5);
  dG -= Math.min(75, 0.2 * st.glu) * ins;
  dG += eff.dextroseGph * (dka ? 4 : 1.2);
  if (dka) dG -= eff.ivRateTotal * 0.02;
  st.glu = clamp(st.glu + dG * dtH, 15, 1500);
  // カリウム
  let dK = -0.06 * ins - 0.03 * (eff.tags.diuretic || 0) + 0.01 * (eff.kRate + (eff.tags.potassium || 0));
  if (d.kNoRegulate && st.glu > 250 && !st.cured) dK -= 0.02;
  if (!d.kNoRegulate || st.cured) dK -= st.kDelta * 0.08;
  st.kDelta += dK * dtH;
  st.hco3Bonus *= Math.pow(0.85, dtH);
  // 腎障害
  if (st.volume > 3000 || vit.SBP < 80) st.crInjury += 0.03 * dtH;
  else st.crInjury = Math.max(0, st.crInjury - 0.01 * dtH);
  // 合併症の記録
  if (K < 3.0) st.comp.hypok ??= enc.t;
  if (K > 6.0) st.comp.hyperk ??= enc.t;
  if (st.glu < 70 && enc.initLabs.GLU >= 70) st.comp.hypoglycemia ??= enc.t;
  if (st.glu < 40) st.comp.severeHypo = (st.comp.severeHypo || 0) + dtMin;
  if (labValue(enc, 'CR', cache) >= p.crBase * 1.5 && enc.initLabs.CR < p.crBase * 1.5) st.comp.aki ??= enc.t;
  if (st.burden >= 100 && !st.dead) { st.dead = true; enc.deathT = enc.t; }
  return { vit, eff };
}

function nurseCheck(enc, vit) {
  const conds = [
    ['spo2', vit.SpO2 < 90, `看護師：SpO2が${vit.SpO2}%（${vit.o2}）に低下しています！`],
    ['sbp', vit.SBP < 90, `看護師：血圧が${vit.SBP}/${vit.DBP}mmHgに低下しています！`],
    ['hr', vit.HR >= 130, `看護師：心拍数が${vit.HR}/分まで上がっています。`],
    ['jcs', vit.JCS >= 3, `看護師：呼びかけへの反応が鈍くなっています（JCS ${vit.JCS}）。`],
  ];
  let fired = false;
  for (const [k, c, text] of conds) {
    if (c && (enc.nurseT[k] == null || enc.t - enc.nurseT[k] >= 180)) {
      enc.nurseT[k] = enc.t;
      alert(enc, 'nurse', text, true);
      fired = true;
    }
  }
  const st = enc.state;
  if (st.anaphylaxis && !st.anaphylaxis.resolved && enc.t >= st.anaphylaxis.t && !st.anaphylaxis.alerted) {
    st.anaphylaxis.alerted = true;
    alert(enc, 'nurse', '看護師：投与開始後から全身に膨疹が出て、息苦しさと血圧低下があります！', true);
    fired = true;
  }
  if (st.hypoEvent && enc.t >= st.hypoEvent.t && !st.hypoEvent.alerted) {
    st.hypoEvent.alerted = true;
    alert(enc, 'nurse', '看護師：急に血圧が下がり、意識がもうろうとしています！', true);
    fired = true;
  }
  const insulinOn = (effects(enc).tags.insulin || 0) > 0;
  if ((insulinOn || disease(enc).id === 'hypoglycemia') && st.glu < 80 && (enc.nurseT.glu == null || enc.t - enc.nurseT.glu >= 120)) {
    enc.nurseT.glu = enc.t;
    alert(enc, 'nurse', `看護師：簡易血糖測定で${Math.round(st.glu)}mg/dLです。`, true);
    fired = true;
  }
  if (fired) enc.lastVitals = { t: enc.t, v: vit, by: '看護師' };
  return fired;
}

function processEvents(enc) {
  let important = false;
  for (const ts of enc.tests) {
    if (!ts.done && enc.t >= ts.dueT) {
      ts.done = true;
      alert(enc, 'result', `検査結果：${TEST_BY_ID[ts.id].name}`);
    }
  }
  for (const c of enc.consults) {
    if (!c.replied && enc.t >= c.replyT) {
      c.replied = true;
      c.text = consultReply(enc, c.dept);
      alert(enc, 'consult', c.text, true);
      important = true;
    }
  }
  const st = enc.state;
  const d = disease(enc);
  for (const pr of d.procedures || []) {
    if (st.procAt?.[pr.id] != null && !st.procDone[pr.id] && enc.t >= st.procAt[pr.id] + pr.duration) {
      st.procDone[pr.id] = enc.t;
      pr.onDone(enc);
      alert(enc, 'consult', fmt(pr.doneText, enc.patient.vars), true);
      if (enc.phase === 'er') { enc.phase = pr.after || 'icu'; enc.dispo ??= { type: pr.after === 'ward' ? 'admit' : 'icu', t: enc.t, auto: true }; }
      important = true;
    }
  }
  if (st.surgeryAt && !st.surgeryDone && enc.t >= st.surgeryAt + 60) {
    st.surgeryDone = enc.t;
    st.burden = Math.min(st.burden, st.perforated ? 45 : 22);
    alert(enc, 'consult', st.perforated ? '外科：腹腔鏡下虫垂切除術を施行しました。穿孔性虫垂炎で腹腔内洗浄・ドレーン留置を行いました。術後管理をお願いします。' : '外科：腹腔鏡下虫垂切除術を施行しました。虫垂は腫大・発赤あり（蜂窩織炎性虫垂炎）。術後管理をお願いします。', true);
    if (enc.phase === 'er') { enc.phase = 'ward'; enc.dispo ??= { type: 'admit', t: enc.t, auto: true }; }
    important = true;
  }
  return important;
}

/**
 * 時間を進める
 * @returns {{stopped:boolean}} 重要なイベントで停止したか
 */
export function advance(enc, minutes, { stopOnAlert = false } = {}) {
  let left = minutes;
  let stopped = false;
  let lastRound = enc.t;
  while (left > 0 && !enc.state.dead && !enc.ended) {
    const dt = Math.min(10, left);
    enc.t += dt;
    left -= dt;
    const { vit } = step(enc, dt);
    if (enc.phase === 'home') continue;
    const imp = processEvents(enc);
    const n = nurseCheck(enc, vit);
    const roundInt = enc.phase === 'icu' ? 60 : 240;
    if (enc.phase !== 'er' && enc.t - (enc.lastVitals?.t ?? 0) >= roundInt && enc.t - lastRound >= roundInt) {
      enc.lastVitals = { t: enc.t, v: vitals(enc, effects(enc), enc.t), by: '定時測定' };
      lastRound = enc.t;
    }
    if (stopOnAlert && (imp || n)) { stopped = true; break; }
  }
  if (enc.state.dead && !enc.ended) {
    alert(enc, 'nurse', '心肺停止。蘇生処置に反応せず、死亡が確認されました。', true);
    finishCase(enc, 'death');
  }
  return { stopped };
}

// ===== プレイヤーの行動 =====
const currentVitals = (enc) => vitals(enc, effects(enc));

export function ask(enc, qid) {
  if (enc.asked[qid]) return enc.asked[qid];
  const vit = currentVitals(enc);
  const a = answer(enc, qid, vit.JCS);
  enc.asked[qid] = { ...a, t: enc.t };
  addLog(enc, 'q', a.text, { qid, label: QUESTION_BY_ID[qid].text, positive: a.positive });
  advance(enc, 1);
  return enc.asked[qid];
}

export function examine(enc, eid) {
  const vit = currentVitals(enc);
  const f = examFinding(enc, eid, vit);
  const ex = EXAM_BY_ID[eid];
  if (ex.pain) enc.discomfort += f.abnormal ? ex.pain + 0.5 : ex.pain * 0.3;
  enc.examined[eid] = { ...f, t: enc.t };
  addLog(enc, 'exam', f.text, { eid, label: `${ex.name}（${ex.method}）`, positive: f.abnormal });
  advance(enc, ex.pain ? 2 : 1);
  return enc.examined[eid];
}

export function measureVitals(enc) {
  const v = vitals(enc, effects(enc), enc.t);
  enc.lastVitals = { t: enc.t, v, by: '測定' };
  addLog(enc, 'vitals', `T ${v.T}℃ / HR ${v.HR} / BP ${v.SBP}/${v.DBP} / RR ${v.RR} / SpO2 ${v.SpO2}%（${v.o2}）/ JCS ${v.JCS}`, { label: 'バイタル測定' });
  advance(enc, 2);
  return v;
}

export function orderTests(enc, ids) {
  const p = enc.patient;
  const eff = effects(enc);
  const vit = vitals(enc, eff);
  const cache = {};
  let blood = false;
  const ordered = [];
  for (const id of ids) {
    const T = TEST_BY_ID[id];
    if (enc.tests.some((x) => x.id === id && !x.done)) continue;
    let result;
    if (T.kind === 'lab') {
      result = { items: T.items.map((lid) => { const v = labValue(enc, lid, cache); return { id: lid, v, s: formatLab(lid, v), flag: labFlag(enc, lid, v) }; }) };
    } else {
      result = testReport(enc, id, vit, labValue(enc, 'K', cache));
    }
    const ts = { id, orderT: enc.t, dueT: enc.t + T.timeMin + (T.timeMin > 60 ? 0 : 3), done: false, result };
    enc.tests.push(ts);
    enc.cost += T.cost;
    if (T.inv >= 1 && T.sample === 'blood') blood = true;
    if (T.inv >= 1 && !T.sample) enc.discomfort += 0.5;
    ordered.push(T.name);
    // 安全性
    if (T.radiation && p.pregnant) recordIssues(enc, [{ level: T.id.includes('ct') ? 'harm' : 'warn', code: 'rad_preg_' + id, msg: `妊娠中の患者への放射線検査（${T.name}）` }], T.name);
    if (T.contrast) {
      enc.discomfort += 1;
      if (p.allergies.includes('contrast')) {
        recordIssues(enc, [{ level: 'harm', code: 'contrast_allergy', msg: '造影剤アレルギー歴のある患者への造影CT' }], T.name);
        if (!enc.state.anaphylaxis) enc.state.anaphylaxis = { t: enc.t + 10, cause: '造影剤' };
      }
      if (labValue(enc, 'EGFR', cache) < 30) {
        recordIssues(enc, [{ level: 'warn', code: 'contrast_ckd', msg: 'eGFR<30での造影CT（造影剤腎症のリスク）' }], T.name);
        enc.state.crInjury += 0.4;
      }
      if (p.homeMeds.includes('metformin') && labValue(enc, 'EGFR', cache) < 45) recordIssues(enc, [{ level: 'warn', code: 'contrast_metformin', msg: 'メトホルミン内服中・腎機能低下例への造影（乳酸アシドーシスのリスク）' }], T.name);
    }
  }
  if (blood) enc.discomfort += 0.5;
  if (ordered.length) {
    addLog(enc, 'order', `検査オーダー：${ordered.join('、')}`);
    advance(enc, 2);
  }
  return ordered.length;
}

function activeOrders(enc) {
  return enc.orders.filter((o) => orderActive(o, enc.t + 30, enc.phase) || (o.start > enc.t && o.stopT == null));
}

export function prescribe(enc, o) {
  const d = DRUG_BY_ID[o.drugId];
  const vit = currentVitals(enc);
  const ev = evaluateRx(enc, o, vit, activeOrders(enc));
  const delay = o.route === 'po' ? 15 : 10;
  const start = enc.t + delay;
  let end;
  if (o.freq === 'once' || o.freq === 'prn') end = start + (d.effectHours || 1) * 60 * (o.freq === 'prn' ? 3 : 1);
  else end = o.days ? start + o.days * 1440 : null;
  const order = { oid: enc.nextId++, kind: 'rx', drugId: o.drugId, route: o.route, dose: Number(o.dose), freq: o.freq, days: o.days, start, end, doseFactor: ev.doseFactor, issues: ev.issues, t: enc.t };
  enc.orders.push(order);
  recordIssues(enc, ev.issues, d.generic);
  for (const e of ev.events) {
    if ((e === 'anaphylaxis' || e === 'bronchospasm') && !enc.state.anaphylaxis) enc.state.anaphylaxis = { t: start + 10, cause: d.generic };
    if (e === 'ich' && !enc.state.comp.ich) { enc.state.comp.ich = enc.t; enc.state.burden = Math.min(100, enc.state.burden + 25); }
    if (e === 'hypotension' && !enc.state.hypoEvent) enc.state.hypoEvent = { t: start + 10, until: start + 190 };
  }
  if (d.id === 'bicarb') enc.state.hco3Bonus += o.dose / (0.5 * enc.patient.weight);
  if (d.id === 'glucose50') enc.state.glu += o.dose * 2.5;
  const r = d.routes[o.route];
  addLog(enc, 'rx', `処方：${d.generic} ${o.dose}${r.unit} ${ROUTE_LABEL[o.route]} ${FREQS[o.freq].label}${o.days && o.freq !== 'once' ? ` ${o.days}日間` : ''}`);
  advance(enc, 2);
  return order;
}

export function addFluid(enc, o) {
  const F = FLUID_BY_ID[o.fluidId];
  const ev = evaluateFluid(enc, o);
  const start = enc.t + 5;
  const end = o.mode === 'bolus' ? start + (o.volume / 1000) * 60 : null;
  const order = { oid: enc.nextId++, kind: 'fluid', fluidId: o.fluidId, mode: o.mode, volume: o.volume, rate: o.rate, start, end, t: enc.t };
  enc.orders.push(order);
  recordIssues(enc, ev.issues, F.name);
  addLog(enc, 'rx', `輸液：${F.name} ${o.mode === 'bolus' ? `${o.volume}mL 急速投与` : `${o.rate}mL/時 持続`}`);
  advance(enc, 1);
  return order;
}

export function setO2(enc, device, flow) {
  for (const o of enc.orders) if (o.kind === 'o2' && o.stopT == null) o.stopT = enc.t;
  if (device) {
    enc.orders.push({ oid: enc.nextId++, kind: 'o2', device, flow, start: enc.t + 1, end: null, t: enc.t });
    const D = O2_DEVICES.find((x) => x.id === device);
    addLog(enc, 'rx', `酸素：${D.name}${device === 'nppv' ? '' : ` ${flow}L/分`}`);
  } else addLog(enc, 'rx', '酸素投与を中止');
  advance(enc, 1);
}

export function setNPO(enc, on) {
  for (const o of enc.orders) if (o.kind === 'npo' && o.stopT == null) o.stopT = enc.t;
  if (on) enc.orders.push({ oid: enc.nextId++, kind: 'npo', start: enc.t, end: null, t: enc.t });
  addLog(enc, 'rx', on ? '絶飲食を指示' : '絶飲食を解除');
}

export function stopOrder(enc, oid) {
  const o = enc.orders.find((x) => x.oid === oid);
  if (!o || o.stopT != null) return;
  o.stopT = enc.t;
  addLog(enc, 'rx', `中止：${orderLabel(o)}`);
  advance(enc, 1);
}

export function orderLabel(o) {
  if (o.kind === 'rx') {
    const d = DRUG_BY_ID[o.drugId];
    return `${d.generic} ${o.dose}${d.routes[o.route].unit} ${ROUTE_LABEL[o.route]} ${FREQS[o.freq].label}`;
  }
  if (o.kind === 'fluid') return `${FLUID_BY_ID[o.fluidId].name} ${o.mode === 'bolus' ? o.volume + 'mL 急速' : o.rate + 'mL/時'}`;
  if (o.kind === 'o2') return `${O2_DEVICES.find((x) => x.id === o.device).name}${o.device === 'nppv' ? '' : ' ' + o.flow + 'L/分'}`;
  if (o.kind === 'npo') return '絶飲食';
  return '';
}

export function isOrderActive(enc, o) {
  if (o.stopT != null) return false;
  if (o.end != null && enc.t >= o.end) return false;
  return true;
}

export function procedure(enc, procId) {
  const P = PROCEDURES.find((x) => x.id === procId);
  const p = enc.patient, st = enc.state, d = disease(enc);
  enc.discomfort += P.side ? 2 : 1;
  addLog(enc, 'rx', `処置：${P.name}`);
  if (!P.side) {
    st.procs = { ...(st.procs || {}), [P.id]: enc.t + P.min };
    if (P.id === 'ng' && d.id === 'ugib') addLog(enc, 'exam', '胃管からコーヒー残渣様〜暗赤色の排液。', { label: '胃管排液', positive: true });
    else if (P.id === 'ng' && d.id === 'sbo') addLog(enc, 'exam', '胃管から胆汁様の排液が多量（約800mL）。', { label: '胃管排液', positive: true });
    else if (P.id === 'ng') addLog(enc, 'exam', '胃管から少量の胃液のみ。', { label: '胃管排液', positive: false });
    else if (P.id === 'epley') addLog(enc, 'exam', d.id === 'bppv' ? 'Epley法を行った。直後からめまいが軽くなった。' : 'Epley法を行ったが、めまいは変わらない。', { label: 'Epley法', positive: d.id === 'bppv' });
    else if (P.id === 'enema') addLog(enc, 'exam', d.id === 'impaction' ? '摘便・浣腸で多量の硬便が排出された。腹痛が軽くなった。' : '浣腸で少量の便が出た。', { label: '浣腸・摘便', positive: d.id === 'impaction' });
    else if (P.id === 'foley') addLog(enc, 'exam', d.id === 'retention' ? `尿道カテーテルから尿が${p.vars.vol || 900}mL流出。下腹部の張りが軽くなった。` : '尿道カテーテルから尿が少量流出。', { label: '導尿', positive: d.id === 'retention' });
    advance(enc, P.min);
    return;
  }
  st.drains[P.side] = enc.t + P.min;
  if (!(d.id === 'ptx' && p.vars.side === P.side)) {
    recordIssues(enc, [{ level: 'harm', code: 'drain_wrong', msg: `気胸のない側への胸腔ドレナージ（${P.name}）：医原性の気胸・出血の危険` }], P.name);
    st.burden = Math.min(100, st.burden + 12);
    st.comp.iatrogenic ??= enc.t;
  }
  advance(enc, P.min);
}

export function consult(enc, dept) {
  if (enc.consults.some((c) => c.dept === dept && !c.replied)) return;
  const delay = dept === 'surgery' ? 45 : dept === 'icu' ? 30 : 60;
  enc.consults.push({ dept, t: enc.t, replyT: enc.t + delay, replied: false });
  addLog(enc, 'consult', `${DEPTS[dept]}へコンサルト`);
  advance(enc, 3);
}

function consultReply(enc, dept) {
  const p = enc.patient, d = disease(enc), st = enc.state;
  const name = DEPTS[dept];
  const pr = (d.procedures || []).find((x) => x.depts.includes(dept));
  if (pr) {
    if (st.procAt[pr.id] != null) return `${name}：すでに${pr.label}の準備を進めています。`;
    const res = pr.decide(enc, currentVitals(enc));
    if (res.reveal) enc.consultRevealT ??= enc.t;
    if (res.accept) st.procAt[pr.id] = enc.t + pr.delay;
    return `${name}：${fmt(res.text, enc.patient.vars)}`;
  }
  if (dept === 'surgery') {
    if (!d.surgeon) return '外科：現時点で外科的治療を要する所見は乏しいと考えます。内科的な精査・治療をお願いします。';
    if (st.surgeryAt || st.surgeryDone) return '外科：手術の予定はすでに組んでいます。';
    const imaged = enc.tests.some((x) => x.done && ['abd_us', 'abd_ct_contrast', 'abd_ct_plain'].includes(x.id) && x.result.abnormal);
    const vit = currentVitals(enc);
    const peritoneal = examFinding(enc, 'abd_rebound', vit).abnormal || examFinding(enc, 'abd_guard', vit).abnormal;
    if (imaged || (peritoneal && st.burden >= 50)) {
      st.surgeryAt = enc.t + 120;
      enc.consultRevealT ??= enc.t;
      return `外科：${st.perforated ? '穿孔性虫垂炎の可能性が高いです。' : '急性虫垂炎として矛盾しません。'}緊急で腹腔鏡下虫垂切除術を行います（約2時間後に手術室入室）。絶飲食・抗菌薬投与をお願いします。`;
    }
    return '外科：虫垂炎を疑いますが、手術適応を判断するため画像での確認をお願いします（腹部超音波または造影CT）。結果が出たら再度ご連絡ください。';
  }
  if (dept === 'icu') {
    const vit = currentVitals(enc);
    const need = vit.SBP < 90 || vit.SpO2 < 90 || vit.JCS >= 10 || (p.diseaseId === 'dka' && p.sev >= 1);
    return need ? '集中治療科：重症であり、ICUでの受け入れが可能です。' : '集中治療科：現時点ではICU管理の適応はないと考えます。一般病棟での管理をお願いします。';
  }
  if (dept === 'obgyn') {
    if (p.sex === 'M') return '産婦人科：男性の患者さんですので、当科の対象ではありません。';
    if (p.pregnant) return '産婦人科：経腟超音波で子宮内に胎嚢を確認、妊娠7週相当です。妊娠中でも使用可能な薬剤（セフトリアキソン等）で治療を。レボフロキサシンやCTは避けてください。';
    return '産婦人科：経腟超音波で子宮・付属器に明らかな異常はありません。婦人科疾患は否定的です。';
  }
  if (d.consult?.[dept]) {
    enc.consultRevealT ??= enc.t;
    return fmt(d.consult[dept], p.vars);
  }
  return `${name}：診察しましたが、当科的に緊急性のある疾患は否定的と考えます。`;
}

// 鑑別診断
export function addDdx(enc, dxId) {
  if (enc.ddx.some((x) => x.id === dxId)) return;
  enc.ddx.push({ id: dxId, conf: 30, pro: [], con: [], addedT: enc.t });
}
export function removeDdx(enc, dxId) {
  enc.ddx = enc.ddx.filter((x) => x.id !== dxId);
}
export function setFinalDx(enc, ids, undetermined) {
  enc.finalDx = { ids, undetermined: !!undetermined, t: enc.t };
  addLog(enc, 'dx', undetermined ? `最終診断：確定診断に至らず（疑い：${ids.map((i) => DDX_BY_ID[i].name).join('、') || 'なし'}）` : `最終診断：${ids.map((i) => DDX_BY_ID[i].name).join('、')}`);
}

// 方針
export function dispose(enc, type) {
  if (type === 'home') return discharge(enc);
  enc.dispo = { type, t: enc.t };
  enc.phase = type === 'icu' ? 'icu' : 'ward';
  addLog(enc, 'dispo', `${type === 'icu' ? 'ICU' : '一般病棟'}へ入院`);
  advance(enc, 20);
}

export function dischargeReady(enc) {
  const v = currentVitals(enc);
  return enc.state.burden < 12 && v.rawSpO2 >= 92 && v.SBP >= 90 && v.JCS === 0;
}

export function discharge(enc) {
  if (!enc.dispo) enc.dispo = { type: 'home', t: enc.t };
  enc.dischargeT = enc.t;
  addLog(enc, 'dispo', enc.phase === 'er' ? '外来治療で帰宅' : '退院');
  for (const o of enc.orders) if (o.stopT == null && (o.kind !== 'rx' || !['po', 'inh'].includes(o.route))) o.stopT = enc.t;
  enc.phase = 'home';
  // 自宅での経過（最大14日）
  const until = enc.t + 14 * 1440;
  while (enc.t < until && !enc.state.dead) {
    advance(enc, 60);
    if (enc.state.burden >= 85) { enc.revisitT = enc.t; break; }
    if (enc.state.cured && enc.state.burden <= 0.5 && enc.t - enc.dischargeT > 1440) break;
  }
  if (enc.ended) return;
  finishCase(enc, enc.revisitT ? 'revisit' : 'home_end');
}

/** 病棟での経過を自動で進める */
export function autoProgress(enc) {
  const limit = enc.t + 21 * 1440;
  while (enc.t < limit && !enc.ended) {
    const { stopped } = advance(enc, 60, { stopOnAlert: true });
    if (stopped) return 'alert';
    if (dischargeReady(enc)) return 'ready';
  }
  return enc.ended ? 'ended' : 'limit';
}

function finishCase(enc, how) {
  enc.ended = true;
  enc.endHow = how;
  enc.endT = enc.t;
}

export function nextResultT(enc) {
  const pend = enc.tests.filter((x) => !x.done).map((x) => x.dueT);
  const cons = enc.consults.filter((x) => !x.replied).map((x) => x.replyT);
  const all = pend.concat(cons);
  return all.length ? Math.min(...all) : null;
}

export { currentVitals, hashRand };
