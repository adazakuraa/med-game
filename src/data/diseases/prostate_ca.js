// 前立腺がん（PSA高値）
// 出典: 日本泌尿器科学会『前立腺癌診療ガイドライン2023年版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'prostate_ca', name: '前立腺がん', dept: '泌尿器科', weight: 3, minLevel: 2,
  demo: { age: [60, 85], ageMode: 'old', male: 1 },
  comorb: { extra: { htn: 0.5 } },
  vars: () => ({}),
  cc: () => '健診でPSAが高いと言われた', ccKey: 'checkup',
  history: {
    onset: { p: 1, text: '人間ドックでPSAが12と言われました。' },
    character: { p: 1, text: '特に症状はありません。尿の勢いが少し弱いくらいです。' },
    family: { p: 1, text: '父が前立腺がんでした。' },
    pmh: { p: 1, text: '持病は高血圧くらいです。' },
    meds: { p: 1, text: '前立腺肥大の薬（5α還元酵素阻害薬）は飲んでいません。' },
    weightloss: { p: 0, text: '' }, diet: { p: 0, text: '' }, smoking: { p: 0, text: '' }, alcohol: { p: 0, text: '' }, weightgain: { p: 0, text: '' },
  },
  exam: { rectal: { p: 1, text: '直腸診で前立腺右葉に石様硬の結節。' } },
  labs: { PSA: { to: [10, 15], k: 0 } },
  tests: { pvr: [{ p: 1, text: '排尿後残尿 30mL。' }] },
  natural: -0.001,
  therapies: [{ id: 'uro', label: '泌尿器科へ紹介：MRIと前立腺生検、病期に応じて監視・手術・放射線・ホルモン療法', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'uro') }, effect: -0.2, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  consult: { uro: '泌尿器科：PSA高値と直腸診の硬結から前立腺がんを疑います。MRIのあと前立腺生検を行い、悪性度と病期（骨シンチ・CT）に応じて、監視療法・手術・放射線・ホルモン療法を相談します。' },
  useful: ['psa', 'ua', 'chem', 'pvr', 'cbc'], key: [['psa'], ['ua']],
  dispo: () => ({ ok: ['home'], best: 'home', why: 'PSA高値：泌尿器科外来で精査' }),
  teaching: [
    '早期の前立腺がんは無症状で、PSA検診で見つかる。PSAは前立腺肥大・前立腺炎・射精・直腸診の直後でも上がる。',
    '直腸診で石様硬の結節があれば強く疑う。MRIと生検で診断する。',
    '進行すると骨転移（腰痛）・尿閉・水腎症。治療は悪性度・病期・年齢で選ぶ（監視療法も選択肢）。',
  ],
  sources: ['前立腺癌診療ガイドライン2023年版（日本泌尿器科学会）'],
  ideal: () => [{ a: 'test', ids: ['psa', 'ua'] }, { a: 'consult', dept: 'uro', delayMin: 1 }, { a: 'wait', min: 70 }],
});
