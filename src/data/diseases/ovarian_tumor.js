// 卵巣腫瘍（悪性疑い）
// 出典: 日本婦人科腫瘍学会『卵巣がん・卵管癌・腹膜癌治療ガイドライン2020年版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'ovarian_tumor', name: '卵巣腫瘍（卵巣がんの疑い）', dept: '産婦人科', weight: 2, minLevel: 2,
  demo: { age: [45, 70], ageMode: 'uniform', male: 0 },
  noPregnancy: true,
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => 'お腹が張って、下腹部が重い', ccKey: 'lower_abd_f',
  history: {
    onset: { p: 1, text: '2〜3か月前からお腹が張って、ズボンがきつくなりました。' },
    character: { p: 1, text: '下腹部が重く、少し食べるとお腹がいっぱいになります。' },
    location: { p: 1, text: '下腹部全体です。' },
    lmp: { p: 1, text: '閉経は5年前です。' },
    vagbleed: { p: 0, text: '性器出血はありません。' },
    fever: { p: 0, text: '熱はありません。' },
    nausea: { p: 0, text: '' }, dizziness: { p: 0, text: '' }, dysuria: { p: 0, text: '' }, radiation: { p: 0, text: '' },
    pmh: { p: 1, text: '子どもは産んでいません。' },
    trigger: { p: 0, text: '' }, course: { p: 1, text: '少しずつ大きくなっています。' }, menses: { p: 0, text: '' },
  },
  exam: { abd_palp: { p: 1, text: '下腹部に小児頭大の硬い腫瘤。腹水による軽い膨満。' }, pelvic: { p: 1, text: '{side}付属器に可動性の悪い硬い腫瘤。' } },
  labs: { CA125: { to: [250, 800], k: 0 } },
  tests: { tvus: [{ p: 1, persist: true, text: '{side}卵巣に約10cmの充実部分を含む多房性の腫瘤と、少量の腹水（悪性を疑う）。' }], abd_ct_contrast: [{ p: 1, persist: true, text: '{side}卵巣の充実性・嚢胞性腫瘤、腹水、大網の結節状の肥厚（腹膜播種の疑い）。' }] },
  natural: -0.002,
  therapies: [{ id: 'gyn', label: '産婦人科（婦人科腫瘍）へ紹介：MRI・CTで評価し、手術で診断と治療', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'obgyn') }, effect: -0.2, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  consult: { obgyn: '産婦人科：充実部分を含む卵巣腫瘤・腹水・CA125高値から卵巣がんを疑います。MRIで評価し、手術（病理診断・病期診断・腫瘍減量）と化学療法を行います。' },
  useful: ['tvus', 'abd_us', 'abd_ct_contrast', 'ca125', 'cbc', 'chem', 'uhcg'], key: [['tvus', 'abd_us', 'abd_ct_contrast'], ['ca125']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '卵巣がんの疑い：婦人科腫瘍外来で速やかに精査' }),
  teaching: [
    '卵巣がんは初期症状が乏しく、腹部膨満・早期の満腹感・下腹部の圧迫感・頻尿などで見つかることが多い（silent cancer）。',
    'エコー・MRIで充実部分を含む腫瘤・腹水があれば悪性を疑う。CA125は補助的（子宮内膜症でも上がる）。',
    '突然の激痛は茎捻転・破裂として緊急手術。',
    '診断と治療は手術（病理）と化学療法。',
  ],
  sources: ['卵巣がん・卵管癌・腹膜癌治療ガイドライン2020年版（日本婦人科腫瘍学会）'],
  ideal: () => [{ a: 'test', ids: ['tvus', 'ca125', 'cbc', 'chem'] }, { a: 'consult', dept: 'obgyn', delayMin: 1 }, { a: 'wait', min: 70 }],
});
