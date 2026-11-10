// ビタミンB12欠乏症（胃切除後）
// 出典: 日本血液学会『血液専門医テキスト』, Stabler SP. Vitamin B12 deficiency. N Engl J Med 2013
import { outpatient } from './common.js';
export default outpatient({
  id: 'b12_def', name: 'ビタミンB12欠乏症', dept: '内科', weight: 3,
  demo: { age: [60, 85], ageMode: 'uniform', male: 0.6 },
  comorb: { extra: {} },
  vars: (rng) => ({ y: rng.int(5, 12) }),
  cc: () => '手足のしびれとふらつき、疲れやすい', ccKey: 'fatigue',
  history: {
    onset: { p: 1, text: '半年くらい前から足先がしびれて、最近は手もしびれます。' },
    character: { p: 1, text: '暗いところだとふらついて、歩きにくいです。疲れやすく、息切れもします。' },
    fatigue: { p: 1, text: 'だるいです。' },
    memory: { p: 0.5, text: '（家族）最近少し物忘れが増えました。' },
    pmh: { p: 1, text: '{y}年前に胃がんで胃を全部とりました。' },
    meds: { p: 1, text: '糖尿病でメトホルミンを飲んでいます。ビタミンの注射は受けていません。' },
    palpitation: { p: 0.5, text: '動悸がします。' },
    weightloss: { p: 0, text: '' }, bloodystool: { p: 0, text: '' }, heatcold: { p: 0, text: '' }, menses: { p: 0, text: '' }, mood: { p: 0, text: '' }, sleep: { p: 0, text: '' },
  },
  exam: { conjunctiva: { p: 1, text: '眼瞼結膜はやや蒼白、眼球結膜に軽い黄染。' }, tremor: { p: 0.7, text: '下肢の振動覚・位置覚の低下、アキレス腱反射の低下。Romberg徴候陽性。' }, oral_mucosa: { p: 0.6, text: '舌が赤く平滑（Hunter舌炎）。' } },
  labs: { HB: { add: [-4, -2.5], k: 0 }, MCV: { add: [18, 28], k: 0 }, B12: { mul: [0.15, 0.3], k: 0 }, TBIL: { add: [0.5, 1.2], k: 0 }, PLT: { mul: [0.6, 0.85], k: 0 } },
  natural: -0.003,
  therapies: [{ id: 'tx', label: 'ビタミンB12の補充（胃切除後は筋注が基本）', req: { tag: 'b12' }, effect: -0.4, lagH: 12, required: true, deadlineH: [24, 24, 24] }],
  useful: ['cbc', 'b12', 'chem', 'thyroid', 'ferritin', 'hba1c'], key: [['cbc'], ['b12']],
  dispo: () => ({ ok: ['home'], best: 'home', why: 'ビタミンB12欠乏症：外来でB12の補充（筋注）' }),
  teaching: [
    '大球性貧血（MCV高値）・しびれ・振動覚低下・ふらつき（後索障害）・認知機能低下はビタミンB12欠乏を考える。',
    '胃全摘後（数年たってから）・萎縮性胃炎（悪性貧血）・メトホルミンの長期内服・菜食がリスク。',
    'LDH・間接ビリルビン上昇（無効造血）、汎血球減少を伴うことも。',
    '治療はB12の補充（筋注、または大量の内服でも吸収される）。神経症状は治療が遅れると残る。',
  ],
  sources: ['Stabler SP. Vitamin B12 deficiency. N Engl J Med 2013'],
  ideal: () => [{ a: 'test', ids: ['cbc', 'b12', 'chem'] }, { a: 'rx', drugId: 'mecobalamin', route: 'po', dose: 500, freq: 'q8h', days: 28 }],
});
