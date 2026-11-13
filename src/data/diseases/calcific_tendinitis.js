// 石灰沈着性腱板炎
// 出典: 日本整形外科学会 症状・病気をしらべる「石灰沈着性腱板炎」
import { outpatient } from './common.js';
export default outpatient({
  id: 'calcific_tendinitis', name: '石灰沈着性腱板炎', dept: '整形外科', weight: 3,
  demo: { age: [40, 65], ageMode: 'uniform', male: 0.3 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '夜中に急に肩が激しく痛くなった', ccKey: 'joint_pain',
  history: {
    onset: { p: 1, text: '昨夜、寝ていたら急に{side}肩が激しく痛くなり、眠れませんでした。' },
    character: { p: 1, text: 'ズキズキと激しく痛み、腕をまったく動かせません。' },
    location: { p: 1, text: '{side}肩です。' },
    joint: { p: 1, text: '{side}肩だけです。' },
    trigger: { p: 0, text: 'けがはしていません。' }, fever: { p: 0, text: '熱はありません。' }, stiffness: { p: 0, text: '' },
    pmh: { p: 0, text: '' }, alcohol: { p: 0, text: '' }, meds: { p: 0, text: '' }, chestpain: { p: 0, text: '胸の痛みや息苦しさはありません。' },
  },
  exam: { joint: { p: 1, text: '{side}肩の大結節部に強い圧痛、痛みで自動・他動ともほとんど動かせない。軽い熱感。' } },
  vitals: { T: { to: [37.0, 37.4], k: 0 } },
  labs: { CRP: { to: [0.5, 2], k: 0 } },
  tests: { joint_xr: [{ p: 1, persist: true, text: '{side}肩：棘上筋腱の付着部（大結節の上方）に1.5cmの石灰化。骨折・脱臼なし。' }] },
  natural: -0.08,
  therapies: [{ id: 'tx', label: '鎮痛（NSAIDs）・三角巾で安静、強い痛みは整形外科で局所麻酔薬・ステロイドの注射や石灰の穿刺吸引', req: { anyTag: ['nsaid', 'analgesic'] }, effect: -0.5, lagH: 1, required: true, deadlineH: [6, 6, 6] }],
  useful: ['joint_xr', 'ecg', 'cbc', 'crp'], key: [['joint_xr']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '石灰沈着性腱板炎：鎮痛・安静で外来（強い痛みは整形外科で注射・吸引）' }),
  teaching: [
    '40〜60代女性に多い、夜間などに突然起こる肩の激痛で、まったく動かせない → 石灰沈着性腱板炎。X線で腱板の石灰化が見える。',
    '化膿性関節炎（発熱・炎症反応高値）・骨折・脱臼・心筋梗塞の関連痛を除外する。',
    '急性期はNSAIDs・注射・石灰の穿刺吸引でよくなることが多い。',
  ],
  sources: ['日本整形外科学会 症状・病気をしらべる「石灰沈着性腱板炎」'],
  ideal: () => [{ a: 'test', ids: ['joint_xr'] }, { a: 'rx', drugId: 'loxo', route: 'po', dose: 60, freq: 'q8h', days: 7 }],
});
