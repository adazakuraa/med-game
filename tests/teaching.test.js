// 研修医モードの教育コンテンツの網羅性・参照整合性
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { QUESTIONS, QUESTION_BY_ID } from '../src/data/questions.js';
import { EXAMS, EXAM_BY_ID } from '../src/data/exams.js';
import { TESTS, TEST_BY_ID } from '../src/data/tests.js';
import { LABS } from '../src/data/labs.js';
import { DRUGS, FLUIDS, O2_DEVICES } from '../src/data/drugs.js';
import { DDX_BY_ID } from '../src/data/ddx.js';
import { DISEASES } from '../src/data/diseases/index.js';
import { DEPTS } from '../src/engine/sim.js';
import * as S from '../src/engine/sim.js';
import { QUESTION_WHY, EXAM_WHY, TEST_WHY, LAB_MEANING, DRUG_ROLE, FLUID_ROLE, O2_ROLE, DEPT_ROLE, APPROACHES, DISEASE_NOTES } from '../src/data/teaching.js';
import { nextSteps, ddxReasoning, attendingAnswer, recommended, treatmentThinking } from '../src/engine/hints.js';
import { runIdeal } from './helpers.js';

test('すべての問診・診察・検査・薬剤・輸液・酸素・診療科に解説がある', () => {
  for (const q of QUESTIONS) assert.ok(QUESTION_WHY[q.id], `問診 ${q.id}`);
  for (const e of EXAMS) assert.ok(EXAM_WHY[e.id], `診察 ${e.id}`);
  for (const t of TESTS) if (t.cat !== 'single') assert.ok(TEST_WHY[t.id], `検査 ${t.id}`);
  for (const id of Object.keys(LABS)) assert.ok(LAB_MEANING[id] && (LAB_MEANING[id].H || LAB_MEANING[id].L), `検査値 ${id}`);
  for (const d of DRUGS) assert.ok(DRUG_ROLE[d.id], `薬 ${d.id}`);
  for (const f of FLUIDS) assert.ok(FLUID_ROLE[f.id], `輸液 ${f.id}`);
  for (const o of O2_DEVICES) assert.ok(O2_ROLE[o.id], `酸素 ${o.id}`);
  for (const k of Object.keys(DEPTS)) assert.ok(DEPT_ROLE[k], `診療科 ${k}`);
});

test('主訴別アプローチの参照先が存在し、全疾患の主訴に対応している', () => {
  for (const d of DISEASES) {
    const a = APPROACHES[d.ccKey];
    assert.ok(a, `${d.id} の主訴 ${d.ccKey}`);
    assert.ok(a.ddx.some((x) => x.id === d.id), `${d.ccKey} の鑑別に ${d.id} がない`);
    assert.ok(DISEASE_NOTES[d.id]?.overview && DISEASE_NOTES[d.id].treatment.length && DISEASE_NOTES[d.id].flow, `${d.id} の疾患ノート`);
  }
  for (const [k, a] of Object.entries(APPROACHES)) {
    for (const q of a.keyQ) assert.ok(QUESTION_BY_ID[q], `${k}.keyQ ${q}`);
    for (const e of a.keyE) assert.ok(EXAM_BY_ID[e], `${k}.keyE ${e}`);
    for (const t of a.keyT) assert.ok(TEST_BY_ID[t], `${k}.keyT ${t}`);
    for (const x of a.ddx) {
      assert.ok(DDX_BY_ID[x.id], `${k}.ddx ${x.id}`);
      for (const c of x.clues || []) {
        const [type, id] = c.split(':');
        const ok = { q: QUESTION_BY_ID, e: EXAM_BY_ID, t: TEST_BY_ID, H: LABS, L: LABS }[type]?.[id];
        assert.ok(ok, `${k}.${x.id} clue ${c}`);
      }
    }
  }
});

test('推奨（★）の検査には疾患の重要検査が含まれる', () => {
  for (const d of DISEASES) {
    const e = S.newEncounter({ seed: 1, diseaseId: d.id, level: 9 });
    const rec = recommended(e);
    const extra = new Set(APPROACHES[d.ccKey].ddx.find((x) => x.id === d.id).tests || []);
    for (const g of d.key || []) assert.ok(g.some((id) => rec.t.has(id) || extra.has(id)), `${d.id} の重要検査 ${g.join('/')} が★にも「疑ったら」にもない`);
  }
});

test('ヒント関数がどの段階でも例外なく動き、模範診療後の推論で正解が上位に来る', () => {
  for (const d of DISEASES) {
    const e = S.newEncounter({ seed: 21, diseaseId: d.id, sev: 1, level: 9 });
    assert.ok(nextSteps(e).length > 0);
    ddxReasoning(e); treatmentThinking(e);
    const a = attendingAnswer(e);
    assert.equal(a.name, d.name);
    // 推奨された問診・診察をすべて行い、模範的な検査を出して結果を待つ
    const rec = recommended(e);
    for (const q of rec.q) S.ask(e, q);
    for (const x of rec.e) S.examine(e, x);
    S.orderTests(e, [...rec.t, ...(APPROACHES[d.ccKey].ddx.find((x) => x.id === d.id).tests || [])].filter((id) => !(id.includes('cta') && e.patient.allergies.includes('contrast'))));
    S.advance(e, 90);
    const r = ddxReasoning(e);
    const rank = r.findIndex((x) => x.id === d.id);
    assert.ok(rank >= 0 && rank <= 2, `${d.id} の推論順位 ${rank}: ${r.slice(0, 3).map((x) => x.id + x.pro.length).join(',')}`);
    runIdeal(S.newEncounter({ seed: 21, diseaseId: d.id, sev: 1, level: 9 }));
  }
});
