// 医学的整合性・データ整合性の自動チェック（人によるレビューの代替として実装）
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DISEASES } from '../src/data/diseases/index.js';
import { QUESTION_BY_ID, QUESTIONS } from '../src/data/questions.js';
import { EXAM_BY_ID, EXAMS } from '../src/data/exams.js';
import { TEST_BY_ID } from '../src/data/tests.js';
import { LABS } from '../src/data/labs.js';
import { DRUGS, FREQS } from '../src/data/drugs.js';
import { DDX_BY_ID } from '../src/data/ddx.js';
import { CONTRA_RULES } from '../src/engine/pharm.js';
import * as S from '../src/engine/sim.js';
import { labValue } from '../src/engine/physiology.js';
import { answer, examFinding, testReport } from '../src/engine/findings.js';
import { generatePatient } from '../src/engine/patient.js';
import { scoreCase } from '../src/engine/scoring.js';
import { runIdeal, runUntreated } from './helpers.js';

const ALL_TAGS = new Set(DRUGS.flatMap((d) => d.tags || []));
const COVER_KEYS = new Set(['spn', 'hinf', 'ecoli', 'esbl', 'anaerobe', 'atypical', 'prsp', 'listeria', 'mrsa', 'gpc', 'gc', 'chlamydia']);

test('疾患データの参照先がすべて存在する', () => {
  for (const d of DISEASES) {
    assert.ok(DDX_BY_ID[d.id], `${d.id} が鑑別リストにない`);
    assert.ok(d.sources?.length, `${d.id} に出典がない`);
    assert.ok(d.teaching?.length, `${d.id} に学習ポイントがない`);
    for (const k of Object.keys(d.history || {})) assert.ok(QUESTION_BY_ID[k], `${d.id}.history.${k}`);
    for (const k of Object.keys(d.exam || {})) assert.ok(EXAM_BY_ID[k], `${d.id}.exam.${k}`);
    for (const k of Object.keys(d.tests || {})) assert.ok(TEST_BY_ID[k], `${d.id}.tests.${k}`);
    for (const k of Object.keys(d.labs || {})) assert.ok(LABS[k], `${d.id}.labs.${k}`);
    for (const id of d.useful) assert.ok(TEST_BY_ID[id] || id === 'amy', `${d.id}.useful.${id}`);
    for (const g of d.key || []) for (const id of g) assert.ok(TEST_BY_ID[id], `${d.id}.key.${id}`);
    for (const o of d.organisms) assert.ok(COVER_KEYS.has(o), `${d.id}.organisms.${o}`);
    for (const th of d.therapies) {
      if (th.req.tag) assert.ok(ALL_TAGS.has(th.req.tag), `${d.id}.${th.id} tag ${th.req.tag}`);
      for (const t of th.req.anyTag || []) assert.ok(ALL_TAGS.has(t), `${d.id}.${th.id} tag ${t}`);
      for (const k of th.req.coverage || []) assert.ok(DRUGS.some((x) => x.covers?.includes(k)), `${k} をカバーする薬がない`);
      assert.equal((typeof th.deadlineH === 'function' ? th.deadlineH(S.newEncounter({ seed: 1, diseaseId: d.id, level: 9 })) : th.deadlineH).length, 3);
    }
    for (const k of Object.keys(d.harmTags || {})) assert.ok(ALL_TAGS.has(k) || k === 'abx', `${d.id}.harmTags.${k}`);
    assert.equal(d.sev.p.length, 3);
    assert.ok(Math.abs(d.sev.p.reduce((a, b) => a + b, 0) - 1) < 1e-9, `${d.id} 重症度の確率の合計が1でない`);
  }
});

test('薬剤データの用量・ルールが妥当', () => {
  for (const d of DRUGS) {
    assert.ok(d.info && d.generic && d.brands.length, d.id);
    for (const [route, r] of Object.entries(d.routes)) {
      assert.ok(r.min > 0 && r.min <= r.max, `${d.id}.${route} min/max`);
      for (const f of r.freqs) assert.ok(FREQS[f], `${d.id} freq ${f}`);
      if (r.maxDaily) assert.ok(r.maxDaily >= r.min, `${d.id} maxDaily`);
      for (const rr of d.renal || []) assert.ok(!r.maxDaily || rr.maxDaily <= r.maxDaily, `${d.id} 腎機能低下時の上限が通常上限を超える`);
    }
    for (const c of d.contra || []) assert.ok(CONTRA_RULES[c], `${d.id} contra ${c}`);
    for (const k of d.covers || []) assert.ok(COVER_KEYS.has(k), `${d.id} covers ${k}`);
    if (d.covers?.includes('esbl')) assert.ok(d.covers.includes('ecoli'));
    const renal = d.renal || [];
    for (let i = 1; i < renal.length; i++) assert.ok(renal[i].crclBelow < renal[i - 1].crclBelow && renal[i].maxDaily <= renal[i - 1].maxDaily, `${d.id} 腎機能ルールの順序`);
  }
});

const N = 150;
function* patients() {
  for (const d of DISEASES) for (let i = 0; i < N; i++) yield S.newEncounter({ seed: 77 + i * 13, diseaseId: d.id, level: 9 });
}

test('生成された患者の値が生理学的範囲内で、未解決の差し込み文字がない', () => {
  for (const enc of patients()) {
    const p = enc.patient;
    const v = enc.initVit;
    assert.ok(v.HR >= 30 && v.HR <= 190 && v.SBP >= 40 && v.SBP <= 240 && v.SpO2 >= 55 && v.SpO2 <= 100 && v.T >= 34 && v.T <= 42.5, `${p.diseaseId} vitals ${JSON.stringify(v)}`);
    for (const [id, L] of Object.entries(LABS)) {
      const x = enc.initLabs[id];
      assert.ok(Number.isFinite(x), `${p.diseaseId} ${id} が数値でない`);
      if (L.abs) assert.ok(x >= L.abs[0] && x <= L.abs[1], `${p.diseaseId} ${id}=${x}`);
    }
    for (const q of QUESTIONS) {
      const a = answer(enc, q.id).text;
      assert.ok(a && !/\{\w+\}/.test(a), `${p.diseaseId} 問診 ${q.id}: ${a}`);
    }
    for (const e of EXAMS) {
      const f = examFinding(enc, e.id, v).text;
      assert.ok(f && !/\{\w+\}/.test(f), `${p.diseaseId} 診察 ${e.id}: ${f}`);
    }
    for (const id of Object.keys(TEST_BY_ID)) {
      if (TEST_BY_ID[id].kind === 'lab') continue;
      const r = testReport(enc, id, v, enc.initLabs.K).text;
      assert.ok(r && !/\{\w+\}/.test(r), `${p.diseaseId} 検査 ${id}: ${r}`);
    }
    if (p.pregnant) assert.ok(p.sex === 'F' && p.age >= 18 && p.age <= 42);
    if (p.sex === 'M') assert.ok(!p.comorb.includes('pregnancy'));
    assert.ok(p.weight >= 30 && p.weight <= 120, `体重 ${p.weight}`);
  }
});

test('同じシードからは同じ患者が生成される（再現性）', () => {
  const a = generatePatient({ seed: 12345, month: 1, level: 5 });
  const b = generatePatient({ seed: 12345, month: 1, level: 5 });
  assert.deepEqual(a, b);
});

// ---- 疾患ごとの医学的制約 ----
const byDisease = (id) => [...Array(N)].map((_, i) => S.newEncounter({ seed: 9000 + i * 7, diseaseId: id, level: 9 }));

test('DKA：高血糖・ケトーシス・AG開大性代謝性アシドーシスが常に揃う', () => {
  for (const e of byDisease('dka')) {
    const L = e.initLabs;
    assert.ok(L.GLU >= 250, `血糖 ${L.GLU}`);
    assert.ok(L.PH < 7.31, `pH ${L.PH}`);
    assert.ok(L.HCO3 < 18, `HCO3 ${L.HCO3}`);
    assert.ok(L.AG > 12, `AG ${L.AG}`);
    assert.ok(L.BHB > 3000 && L.U_KET >= 2, 'ケトン');
    assert.ok(L.NA < 140, '高血糖による見かけの低Na');
    assert.ok(e.patient.comorb.includes('t1dm'));
    // pCO2 は代償範囲（Winter式 ±2 を大きく逸脱しない）
    const pco2a = L.PCO2 - 6;
    assert.ok(pco2a >= 1.5 * L.HCO3 + 6 && pco2a <= 1.5 * L.HCO3 + 16, `pCO2 ${pco2a} HCO3 ${L.HCO3}`);
  }
});

test('心不全：BNP上昇・発熱なし、CS1は高血圧', () => {
  for (const e of byDisease('adhf')) {
    assert.ok(e.initLabs.BNP > 200, `BNP ${e.initLabs.BNP}`);
    assert.ok(e.initVit.T < 37.5, `体温 ${e.initVit.T}`);
    if (e.patient.vars.cs1) assert.ok(e.initVit.SBP > 140, `CS1 SBP ${e.initVit.SBP}`);
    assert.ok(e.state.volume < 0, '体液過剰');
    assert.ok(e.patient.comorb.includes('chf'));
  }
});

test('腎盂腎炎：膿尿、尿培養は大腸菌、感受性の記載が耐性フラグと一致', () => {
  let pyuria = 0;
  for (const e of byDisease('pyelo')) {
    if (e.initLabs.U_LEU >= 2 || e.initLabs.U_WBC >= 10) pyuria++;
    const r = testReport(e, 'ucx', e.initVit, 4).text;
    if (r.includes('Escherichia')) {
      const res = e.patient.vars.res;
      assert.equal(r.includes('CTRX R'), res.esbl);
      assert.equal(r.includes('LVFX R'), res.fqR);
    }
  }
  assert.ok(pyuria / N > 0.85, `膿尿の割合 ${pyuria / N}`);
});

test('肺炎：炎症反応上昇、胸部X線で浸潤影が大半に見える', () => {
  let cxr = 0;
  for (const e of byDisease('cap')) {
    assert.ok(e.initLabs.CRP > 3, `CRP ${e.initLabs.CRP}`);
    if (testReport(e, 'cxr', e.initVit, 4).abnormal) cxr++;
  }
  assert.ok(cxr / N > 0.8, `CXR陽性率 ${cxr / N}`);
});

test('胃腸炎：血便・限局性腹膜刺激徴候は出ない', () => {
  for (const e of byDisease('gastro')) {
    assert.ok(!answer(e, 'bloodystool').positive);
    assert.ok(!examFinding(e, 'abd_rebound', e.initVit).abnormal);
    assert.ok(!examFinding(e, 'mcburney', e.initVit).abnormal);
  }
});

test('虫垂炎：右下腹部の所見、糞石は画像と一致', () => {
  for (const e of byDisease('appendicitis')) {
    assert.ok(examFinding(e, 'abd_palp', e.initVit).text.includes('右下腹部'));
    const ct = testReport(e, 'abd_ct_contrast', e.initVit, 4).text;
    assert.equal(ct.includes('糞石'), !!e.patient.vars.fecalith && e.patient.rolls.tests.abd_ct_contrast[1]);
  }
});

test('男性の妊娠反応は常に陰性、妊婦は陽性', () => {
  for (const e of patients()) {
    const r = testReport(e, 'uhcg', e.initVit, 4);
    if (e.patient.sex === 'M') assert.equal(r.abnormal, false);
    if (e.patient.pregnant) assert.equal(r.abnormal, true);
  }
});

// ---- 処方の安全性ルール ----
test('処方の禁忌・アレルギー・相互作用が検出される', () => {
  const e = S.newEncounter({ seed: 5, diseaseId: 'adhf', level: 9 });
  e.patient.homeMeds.push('sildenafil');
  e.patient.allergies.push('penicillin');
  const o1 = S.prescribe(e, { drugId: 'ntg_spray', route: 'sl', dose: 0.3, freq: 'once' });
  assert.ok(o1.issues.some((i) => i.code === 'pde5' && i.level === 'harm'));
  assert.ok(e.state.hypoEvent, 'PDE5阻害薬＋硝酸薬で低血圧イベント');
  const o2 = S.prescribe(e, { drugId: 'abpc_sbt', route: 'iv', dose: 3000, freq: 'q6h', days: 3 });
  assert.ok(o2.issues.some((i) => i.code === 'allergy'));
  const o3 = S.prescribe(e, { drugId: 'kcl', route: 'iv', dose: 40, freq: 'cont', days: 1 });
  assert.ok(o3.issues.some((i) => i.code === 'kcl_rate'));
  const o4 = S.prescribe(e, { drugId: 'loxo', route: 'po', dose: 60, freq: 'q8h', days: 3 });
  assert.ok(o4.issues.some((i) => i.code === 'severe_hf'));
});

test('腎機能低下時の過量投与が検出される', () => {
  const e = S.newEncounter({ seed: 8, diseaseId: 'cap', level: 9 });
  e.patient.crBase = 3.5; e.patient.age = 85; e.patient.weight = 45;
  const o = S.prescribe(e, { drugId: 'lvfx', route: 'po', dose: 500, freq: 'q24h', days: 5 });
  assert.ok(o.issues.some((i) => i.code === 'renal'));
});

test('DKAで血清K<3.3でのインスリン開始は有害と判定', () => {
  const e = S.newEncounter({ seed: 3, diseaseId: 'dka', level: 9 });
  e.state.kDelta = -3;
  const o = S.prescribe(e, { drugId: 'insulin_r', route: 'iv', dose: 6, freq: 'cont', days: 1 });
  assert.ok(o.issues.some((i) => i.code === 'insulin_lowk'));
});

// ---- 経過シミュレーションの妥当性 ----
test('模範的な診療では大半が救命され、無治療では重症例の大半が死亡する', () => {
  for (const d of DISEASES) {
    for (const sev of [0, 1, 2]) {
      let ok = 0, dead = 0;
      const M = 25;
      for (let i = 0; i < M; i++) {
        const e = S.newEncounter({ seed: 300 + i, diseaseId: d.id, sev, level: 9 });
        runIdeal(e);
        if (!e.state.dead) ok++;
        const u = S.newEncounter({ seed: 300 + i, diseaseId: d.id, sev, level: 9 });
        runUntreated(u);
        if (u.state.dead) dead++;
      }
      assert.ok(ok / M >= 0.8, `${d.id} sev${sev} 模範診療の生存率 ${ok / M}`);
      if (sev === 2 && d.untreatedFatal !== false) assert.ok(dead / M >= 0.8, `${d.id} 重症の無治療死亡率 ${dead / M}`);
      if (d.id === 'gastro' && sev === 0) assert.equal(dead, 0, '軽症の胃腸炎は自然軽快する');
    }
  }
});

test('時間経過で状態が連続的に変化する（急激な不連続がない）', () => {
  for (const d of DISEASES) {
    const e = S.newEncounter({ seed: 42, diseaseId: d.id, sev: 1, level: 9 });
    let prev = S.currentVitals(e);
    for (let i = 0; i < 48 && !e.ended; i++) {
      S.advance(e, 60);
      const v = S.currentVitals(e);
      if (e.ended) break;
      assert.ok(Math.abs(v.HR - prev.HR) < 35, `${d.id} HR jump ${prev.HR}->${v.HR}`);
      assert.ok(Math.abs(v.SBP - prev.SBP) < 40, `${d.id} SBP jump ${prev.SBP}->${v.SBP}`);
      prev = v;
    }
  }
});

test('適切な診療は高得点、不適切な診療は低得点になる', () => {
  const good = S.newEncounter({ seed: 11, diseaseId: 'cap', sev: 1, level: 9 });
  runIdeal(good);
  const bad = S.newEncounter({ seed: 11, diseaseId: 'cap', sev: 1, level: 9 });
  S.setFinalDx(bad, ['gastro'], false);
  S.discharge(bad);
  assert.ok(scoreCase(good).total > scoreCase(bad).total + 30);
});
