// ばね指（弾発指）
// 出典: 日本整形外科学会 症状・病気をしらべる「ばね指」, 日本手外科学会 資料
import { outpatient } from './common.js';
export default outpatient({
  id: 'trigger_finger', name: 'ばね指', dept: '整形外科', weight: 4,
  demo: { age: [45, 75], ageMode: 'uniform', male: 0.3 },
  comorb: { extra: { dm2: 0.4 } },
  vars: (rng) => ({ side: rng.pick(['右', '左']), f: rng.pick(['中指', '薬指', '親指']) }),
  cc: (v) => `${v.side}${v.f}が引っかかる`, ccKey: 'joint_pain',
  history: {
    onset: { p: 1, text: '2か月前から、{side}{f}を曲げ伸ばしすると引っかかるようになりました。' },
    character: { p: 1, text: '曲げた指を伸ばすときにカクンと跳ねるように伸びます。付け根が痛いです。' },
    location: { p: 1, text: '{side}{f}の付け根の手のひら側です。' },
    joint: { p: 1, text: '{side}{f}だけです。ほかの関節は腫れていません。' },
    stiffness: { p: 1, text: '朝が一番ひどく、指が曲がったまま伸びにくいです。' },
    pmh: { p: 1, text: '糖尿病で治療中です。' },
    trigger: { p: 0, text: 'けがはしていません。' }, fever: { p: 0, text: '熱はありません。' }, alcohol: { p: 0, text: '' }, meds: { p: 0, text: '' },
  },
  exam: { joint: { p: 1, text: '{side}{f}の中手指節関節掌側（A1滑車部）に圧痛と小結節を触れ、屈伸で弾発現象。腫脹・熱感なし。' } },
  tests: { joint_xr: [{ p: 1, text: '骨・関節に異常なし。', normal: true }] },
  natural: -0.02,
  therapies: [{ id: 'tx', label: '安静・NSAIDs外用/内服、改善しなければ腱鞘内ステロイド注射（整形外科）、腱鞘切開術', req: { anyTag: ['nsaid', 'analgesic'] }, effect: -0.3, lagH: 6, required: true, deadlineH: [48, 48, 48] }],
  useful: ['joint_xr', 'hba1c'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: 'ばね指：外来で安静・鎮痛、腱鞘内注射（改善しなければ腱鞘切開）' }),
  teaching: [
    '指の付け根（A1滑車）の圧痛・結節と、曲げ伸ばしでカクンと跳ねる弾発現象（朝に強い）はばね指（狭窄性屈筋腱腱鞘炎）。',
    '中年女性・手の使いすぎ・糖尿病・透析で多い。',
    '治療は安静・NSAIDs、腱鞘内ステロイド注射（よく効く）、繰り返すなら腱鞘切開術。',
  ],
  sources: ['日本整形外科学会 症状・病気をしらべる「ばね指」'],
  ideal: () => [{ a: 'rx', drugId: 'loxo', route: 'po', dose: 60, freq: 'q8h', days: 7 }],
});
