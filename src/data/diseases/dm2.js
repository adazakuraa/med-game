// 2型糖尿病（初診）
// 出典: 日本糖尿病学会『糖尿病診療ガイドライン2024』『糖尿病治療ガイド2024』
import { outpatient } from './common.js';
export default outpatient({
  id: 'dm2', name: '2型糖尿病（初診）', weight: 6,
  demo: { age: [35, 75], ageMode: 'uniform', male: 0.6 },
  comorb: { extra: { htn: 0.5, dyslip: 0.5 } },
  sev: { p: [0.5, 0.4, 0.1], burden: [[18, 24], [24, 30], [30, 36]] },
  vars: (rng, sev) => ({ a1c: [7.4, 8.8, 11][sev] + rng.range(0, 0.8), gT: [200, 270, 360][sev] }),
  cc: () => '喉が渇いてトイレが近い', ccKey: 'polyuria',
  history: {
    onset: { p: 1, text: '数か月前から喉が渇いて、水をよく飲み、夜中もトイレに起きます。' },
    character: { p: 1, text: '疲れやすく、喉が渇きます。' },
    polyuria: { p: 1, text: '喉が渇いて水をたくさん飲み、トイレも近いです。' },
    weightloss: { p: 0.5, text: '食べているのに3kg痩せました。' },
    fatigue: { p: 0.7, text: '疲れやすいです。' },
    family: { p: 0.8, text: '母が糖尿病です。' },
    diet: { p: 1, text: '甘い缶コーヒーを1日3本飲みます。運動はしていません。' },
    nausea: { p: 0, text: '' }, abdpain: { p: 0, text: '' },
  },
  exam: { skin: { p: 0.2, text: '足に小さな傷があるが、本人は気づいていない（感覚低下）。' } },
  labs: { HBA1C: { add: [0, 0], k: 1 }, U_GLU: { ord: [2, 4], p: 1 } },
  labHook: (enc, id, v) => (id === 'HBA1C' ? enc.patient.vars.a1c : v),
  initGlu: [[180, 230], [230, 320], [320, 420]],
  gluSetpointDrift: (enc) => (enc.patient.vars.gT - enc.state.glu) * 0.3,
  natural: 0,
  therapies: [{ id: 'dmtx', label: '食事・運動療法と、必要なら経口薬（メトホルミンなど）', req: { tag: 'metformin_rx' }, effect: -0.12, lagH: 24, required: (enc) => enc.patient.sev >= 1, deadlineH: [99, 168, 48] }],
  dynamics: (enc) => (enc.patient.sev === 0 ? -0.06 : 0),
  useful: ['hba1c', 'chem', 'ua', 'cbc', 'bs_poct', 'ecg', 'vbg'], key: [['hba1c', 'chem', 'bs_poct'], ['ua']],
  extrasOk: () => [],
  teaching: [
    '口渇・多飲・多尿・体重減少は高血糖の症状。HbA1c 6.5%以上と血糖値で糖尿病と診断する。',
    'まずケトアシドーシス（DKA）・高浸透圧高血糖状態などの急性合併症がないか確認する（尿ケトン・血液ガス）。',
    '治療の基本は食事療法・運動療法。必要に応じてメトホルミンなどの経口薬（腎機能・脱水・造影剤に注意）。目標は一般にHbA1c 7%未満。',
    '合併症（網膜症・腎症・神経障害）と動脈硬化リスク（血圧・脂質・喫煙）を評価する。足の観察も大切。',
  ],
  sources: ['糖尿病診療ガイドライン2024（日本糖尿病学会）', '糖尿病治療ガイド2024'],
  ideal: (p) => [{ a: 'test', ids: ['hba1c', 'chem', 'ua'] }, { a: 'wait', min: 70 }, { a: 'rx', drugId: 'metformin_rx', route: 'po', dose: 250, freq: 'q12h', days: 14, when: 'sev>=1' }],
});
