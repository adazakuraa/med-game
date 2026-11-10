// 1型糖尿病（新規発症、ケトアシドーシス前）
// 出典: 日本糖尿病学会『糖尿病診療ガイドライン2024』
import { outpatient } from './common.js';
export default outpatient({
  id: 't1dm_new', name: '1型糖尿病（新規発症）', dept: '内分泌代謝内科', weight: 2, minLevel: 2,
  demo: { age: [18, 35], ageMode: 'young', male: 0.5 },
  sev: { p: [0.5, 0.4, 0.1], burden: [[24, 32], [32, 40], [40, 48]] },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '喉が渇いてトイレが近く、やせてきた', ccKey: 'polyuria',
  history: {
    onset: { p: 1, text: '1か月前から喉がとても渇き、水やジュースをたくさん飲んで、トイレが近くなりました。' },
    polyuria: { p: 1, text: '夜中も何度もトイレに起きます。' },
    weightloss: { p: 1, text: '1か月で5kgやせました。食欲はあります。' },
    fatigue: { p: 1, text: 'だるいです。' },
    nausea: { p: 0.2, text: '少し吐き気があります。' },
    abdpain: { p: 0, text: 'お腹は痛くありません。' },
    family: { p: 1, text: '家族に糖尿病の人はいません。' },
    diet: { p: 1, text: '喉が渇くのでスポーツドリンクをたくさん飲んでいます。' },
    meds: { p: 1, text: '薬は飲んでいません。' },
  },
  exam: { gen_appear: { p: 1, text: 'やせ型。意識清明。' }, oral_mucosa: { p: 0.6, text: '口腔内がやや乾燥。' }, chest_insp: { p: 0, text: '' } },
  labs: { GLU: { add: [250, 400], k: 0 }, HBA1C: { add: [5, 7], k: 0 }, U_GLU: { to: [4, 4], k: 0 }, U_KET: { to: [1, 2], k: 0 }, BHB: { to: [800, 2000], k: 0 } },
  tests: {},
  natural: -0.002,
  therapies: [{ id: 'insulin', label: 'インスリン治療の開始（内分泌内科と連携、強化インスリン療法）', req: { fn: (enc, eff) => (eff.tags.insulin_sc || 0) > 0 || (eff.tags.insulin || 0) > 0 }, effect: -0.4, lagH: 6, required: true, deadlineH: [24, 24, 24] }],
  harmTags: { metformin_rx: '1型糖尿病（インスリン欠乏・ケトーシス）にメトホルミン単独' },
  useful: ['bs_poct', 'chem', 'ua', 'vbg', 'bhb', 'hba1c', 'thyroid'], key: [['bs_poct', 'chem'], ['ua', 'bhb'], ['vbg']],
  dispo: () => ({ ok: ['admit', 'home'], best: 'admit', why: '新規発症の1型糖尿病（ケトーシス）：入院でインスリン導入と教育（アシドーシスがあればDKAとして治療）' }),
  teaching: [
    '若年者の口渇・多飲・多尿・体重減少（食欲はある）は糖尿病。急に発症してケトン体が出ていれば1型糖尿病を考える。',
    '血液ガスでアシドーシスがあれば糖尿病性ケトアシドーシス（DKA）として緊急治療。清涼飲料水の多飲で悪化する（ペットボトル症候群）。',
    '1型糖尿病はインスリンが必須。経口薬だけでは治療できない。抗GAD抗体などで確認。',
    '多尿の鑑別：高血糖、高Ca血症、尿崩症、利尿薬、心因性多飲。',
  ],
  sources: ['糖尿病診療ガイドライン2024（日本糖尿病学会）'],
  ideal: () => [{ a: 'test', ids: ['bs_poct', 'chem', 'ua', 'vbg', 'hba1c'] }, { a: 'rx', drugId: 'insulin_basal', route: 'sc', dose: 8, freq: 'q24h', days: 14 }],
});
