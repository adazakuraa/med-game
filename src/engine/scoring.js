// 転帰判定と診療評価
import { DISEASE_BY_ID } from '../data/diseases/index.js';
import { DDX_BY_ID } from '../data/ddx.js';
import { TEST_BY_ID } from '../data/tests.js';
import { QUESTION_BY_ID } from '../data/questions.js';
import { EXAM_BY_ID } from '../data/exams.js';
import { labValue } from './physiology.js';
import { isRequired } from './sim.js';
import { hashRand } from './rng.js';

const GENERIC_USEFUL = new Set(['cbc', 'chem', 'crp', 'ua', 'vbg', 'ecg']);

export const OUTCOME_LABEL = {
  complete: '完全回復', improved: '軽快', complication: '合併症（回復）', sequela: '後遺症', recurrence: '再発',
  revisit: '悪化・再受診', death: '死亡', transfer: '転院',
};

function ctxOf(enc) {
  return { initVit: enc.initVit, initLab: (id) => enc.initLabs[id] };
}

export function determineOutcome(enc) {
  const st = enc.state, p = enc.patient, d = DISEASE_BY_ID[p.diseaseId];
  const notes = [];
  if (enc.endHow === 'death') return { kind: 'death', notes };
  if (enc.endHow === 'revisit') return { kind: 'revisit', notes: ['退院後に症状が悪化し、再受診しました。'] };
  const comp = [];
  if (st.comp.perforation) comp.push('虫垂穿孔');
  if (st.comp.aki) comp.push('急性腎障害');
  if (st.comp.hypok) comp.push('低カリウム血症');
  if (st.comp.hypoglycemia) comp.push('低血糖');
  if (st.anaphylaxis) comp.push('アナフィラキシー');
  if (st.hypoEvent) comp.push('薬剤性の重篤な低血圧');
  if (st.comp.iatrogenic) comp.push('医原性気胸');
  if (st.comp.ich) comp.push('頭蓋内出血');
  const crNow = labValue(enc, 'CR', {});
  if ((st.comp.severeHypo || 0) >= 60) return { kind: 'sequela', notes: ['遷延する重症低血糖による神経学的後遺症'] };
  if (st.comp.aki && crNow >= p.crBase * 1.5) return { kind: 'sequela', notes: ['腎機能が元に戻らず、慢性腎臓病に移行しました。'] };
  if (d.residualAbove != null && !st.cured && st.burden >= d.residualAbove) return { kind: 'sequela', notes: [d.residualText || '後遺症が残りました。'] };
  if (st.cured) {
    if (d.nonOperative && !st.surgeryDone && hashRand(p.seed, 'recur') < 0.25) return { kind: 'recurrence', notes: ['抗菌薬で軽快しましたが、数か月後に虫垂炎が再発しました（非手術治療の再発率は約2〜3割）。'] };
    if (comp.length) return { kind: 'complication', notes: comp };
    return { kind: 'complete', notes };
  }
  if (st.burden < 25) return { kind: 'improved', notes: comp };
  return { kind: 'revisit', notes: ['症状が残存し、再受診が必要となりました。'] };
}

function fmtDur(min) {
  if (min == null) return '—';
  if (min < 60) return `${Math.round(min)}分`;
  return `${Math.floor(min / 60)}時間${Math.round(min % 60) ? Math.round(min % 60) + '分' : ''}`;
}

export function scoreCase(enc) {
  const p = enc.patient, d = DISEASE_BY_ID[p.diseaseId], st = enc.state;
  const ctx = ctxOf(enc);
  const outcome = determineOutcome(enc);
  const res = { outcome, parts: {}, notes: [] };

  // 1. 診断（30）
  const fd = enc.finalDx || { ids: [], undetermined: true };
  const extrasOk = new Set(d.extrasOk ? d.extrasOk(enc, ctx) : []);
  const correct = fd.ids.includes(d.id);
  const wrong = fd.ids.filter((i) => i !== d.id && !extrasOk.has(i));
  let dx = 0;
  let dxNote = '';
  if (correct && !fd.undetermined) { dx = Math.max(15, 30 - 6 * wrong.length); dxNote = wrong.length ? '正解を含むが、根拠の乏しい診断名も併記' : '正しい診断'; }
  else if (correct && fd.undetermined) { dx = 15; dxNote = '正しい疾患を疑ったが確定に至らず'; }
  else if (enc.ddx.some((x) => x.id === d.id)) { dx = 8; dxNote = '鑑別には挙げたが最終診断を誤った'; }
  else dxNote = '正しい診断に至らなかった';
  if (correct && enc.consultRevealT != null) {
    const had = enc.ddx.find((x) => x.id === d.id);
    if (!had || had.addedT > enc.consultRevealT) { dx = Math.max(0, dx - 10); dxNote += '（コンサルタントの意見で診断）'; }
  }
  if (!enc.finalDx) { dx = Math.min(dx, 5); dxNote = '最終診断を記載しなかった'; }
  res.parts.dx = { score: dx, max: 30, note: dxNote, truth: d.name, chosen: fd.ids.map((i) => DDX_BY_ID[i]?.name), wrong: wrong.map((i) => DDX_BY_ID[i]?.name) };

  // 2. 治療（30）
  const ths = [];
  for (const th of d.therapies) {
    if (!isRequired(th, enc)) continue;
    const need = enc.thNeed[th.id];
    if (need == null) continue;
    const startFrom = th.startFromNeed ? need : 0;
    const done = enc.thStart[th.id];
    const dl = (typeof th.deadlineH === 'function' ? th.deadlineH(enc) : th.deadlineH)[p.sev] * 60;
    let status, pts;
    if (done == null) { status = 'missing'; pts = 0; }
    else if (done - startFrom <= dl) { status = 'ontime'; pts = 1; }
    else if (done - startFrom <= dl * 2.5) { status = 'late'; pts = 0.5; }
    else { status = 'verylate'; pts = 0.25; }
    ths.push({ label: th.label, status, pts, delay: done != null ? fmtDur(done - startFrom) : null, deadline: fmtDur(dl) });
  }
  const thBase = ths.length ? (ths.reduce((a, b) => a + b.pts, 0) / ths.length) * 30 : 30;
  const harmPen = Math.min(24, enc.harms.length * 8);
  const warnPen = Math.min(9, enc.warns.length * 3);
  res.parts.tx = { score: Math.max(0, Math.round(thBase - harmPen - warnPen)), max: 30, therapies: ths, harms: enc.harms, warns: enc.warns, infos: enc.infos };

  // 3. 検査（15）
  const ordered = new Set(enc.tests.map((x) => x.id));
  const keys = (d.key || []).concat(p.sex === 'F' && p.age < 50 && d.keyIfFemale ? d.keyIfFemale : []);
  const keyHit = keys.filter((g) => g.some((id) => ordered.has(id))).length;
  const useful = new Set(d.useful);
  const wasted = enc.tests.filter((x) => !useful.has(x.id) && !GENERIC_USEFUL.has(x.id) && !x.id.startsWith('lab_') && !(x.id === 'uhcg' && p.sex === 'F'));
  const dup = enc.tests.filter((x, i) => enc.tests.findIndex((y) => y.id === x.id) !== i && x.orderT - enc.tests.find((y) => y.id === x.id).orderT < 120);
  const wasteCost = wasted.concat(dup).reduce((a, x) => a + TEST_BY_ID[x.id].cost, 0);
  const keyPts = keys.length ? (keyHit / keys.length) * 9 : 9;
  const wastePts = Math.max(0, 6 - wasteCost / 4000);
  res.parts.test = { score: Math.round(keyPts + wastePts), max: 15, missingKeys: keys.filter((g) => !g.some((id) => ordered.has(id))).map((g) => g.map((id) => TEST_BY_ID[id].name).join(' / ')), wasted: wasted.map((x) => TEST_BY_ID[x.id].name), wasteCost, totalCost: enc.cost };

  // 4. 方針（10）
  const dp = d.dispo(enc, ctx);
  const type = enc.dispo?.type ?? 'none';
  let dispoPts = 0;
  if (type === dp.best) dispoPts = 10;
  else if (dp.ok.includes(type)) dispoPts = 7;
  else if (type === 'icu' && dp.ok.includes('admit')) dispoPts = 5;
  else if (type === 'admit' && dp.ok.includes('icu')) dispoPts = 2;
  res.parts.dispo = { score: dispoPts, max: 10, chosen: { home: '帰宅（外来）', admit: '一般病棟入院', icu: 'ICU入院', none: '未決定' }[type], best: { home: '帰宅（外来）', admit: '一般病棟入院', icu: 'ICU入院' }[dp.best], why: dp.why };

  // 5. 転帰（15）
  const oPts = { complete: 15, improved: 12, recurrence: 10, complication: 6, sequela: 3, revisit: 2, death: 0 }[outcome.kind];
  res.parts.outcome = { score: oPts, max: 15 };

  let total = dx + res.parts.tx.score + res.parts.test.score + dispoPts + oPts;
  if (enc.discomfort > 8) { total -= 3; res.notes.push('患者への身体的負担がやや大きかった（不要な疼痛を伴う診察・侵襲的検査）'); }
  total = Math.max(0, Math.min(100, Math.round(total)));
  res.total = total;
  res.grade = total >= 90 ? 'S' : total >= 80 ? 'A' : total >= 65 ? 'B' : total >= 50 ? 'C' : 'D';

  // 死亡の評価：適切な診療でも救命できなかったか
  if (outcome.kind === 'death') {
    const allOnTime = ths.every((t) => t.status === 'ontime');
    res.deathType = allOnTime && enc.harms.length === 0 ? 'unavoidable' : 'avoidable';
    res.deathText = res.deathType === 'unavoidable'
      ? '適切な診療が行われましたが、重症かつ治療抵抗性の経過で救命できませんでした（不可避な死亡）。診療内容は適切と評価されます。'
      : '治療の遅れ・不足、または有害な処置が転帰に影響した可能性があります（回避可能だった可能性のある死亡）。';
    if (res.deathType === 'unavoidable') res.total = Math.max(res.total, 60);
  }

  // 見逃した重要所見
  const missed = [];
  for (const [qid, h] of Object.entries(d.history || {})) {
    const r = p.rolls.history[qid];
    if (r?.on && !enc.asked[qid] && h.p !== 1 && (Array.isArray(h.p) ? h.p[p.sev] : h.p) >= 0.4) missed.push('問診：' + QUESTION_BY_ID[qid].text);
  }
  for (const [eid] of Object.entries(d.exam || {})) {
    if (p.rolls.exam[eid]?.some(Boolean) && !enc.examined[eid] && eid !== 'gen_appear') missed.push('診察：' + EXAM_BY_ID[eid].name);
  }
  res.missed = missed.slice(0, 8);
  res.teaching = d.teaching;
  res.sources = d.sources;
  res.truth = { name: d.name, sev: ['軽症', '中等症', '重症'][p.sev], refractory: p.refractory, organism: p.vars.organism, pregnant: p.pregnant };
  res.xp = res.total;
  return res;
}
