// 大腸がん（鉄欠乏性貧血・便通異常）
// 出典: 大腸癌研究会『大腸癌治療ガイドライン医師用2024年版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'colorectal_ca', name: '大腸がん', dept: '消化器内科', weight: 4, minLevel: 2,
  demo: { age: [55, 85], ageMode: 'old', male: 0.55 },
  comorb: { extra: { htn: 0.4, dm2: 0.2 } },
  vars: (rng) => ({ mo: rng.int(2, 6), kg: rng.int(3, 6) }),
  cc: () => '疲れやすく、便に血が混じる', ccKey: 'hematochezia',
  history: {
    onset: { p: 1, text: '{mo}か月前から疲れやすく、階段で息切れがします。' },
    character: { p: 1, text: '最近、便が細くなって、便秘と下痢を繰り返します。' },
    bloodystool: { p: 1, text: '時々、便に暗い赤色の血が混じっています。' },
    constipation: { p: 1, text: '便秘と下痢を繰り返します。' },
    weightloss: { p: 0.8, text: '{kg}kgやせました。' },
    abdpain: { p: 0.4, text: '時々、お腹が張って痛みます。' },
    family: { p: 0.5, text: '父が大腸がんでした。' },
    meds: { p: 1, text: '特に飲んでいません。' },
    pmh: { p: 1, text: '大腸カメラは受けたことがありません。健診の便潜血検査は受けていません。' },
    diarrhea: { p: 0.5, text: '下痢のこともあります。' }, fever: { p: 0, text: '' }, dizziness: { p: 0.3, text: '立ちくらみがします。' },
  },
  exam: { conjunctiva: { p: 1, text: '眼瞼結膜が蒼白。' }, rectal: { p: 0.4, text: '直腸診で指先に硬い腫瘤を触れ、暗赤色の血液が付着。' }, abd_palp: { p: 0.3, text: '左下腹部に可動性の乏しい腫瘤を触れる。' } },
  labs: { HB: { add: [-5, -3], k: 0 }, MCV: { add: [-15, -8], k: 0 }, FER: { mul: [0.05, 0.15], k: 0 } },
  tests: { fobt: { p: 1 }, abd_ct_contrast: [{ p: 0.9, persist: true, text: 'S状結腸に全周性の壁肥厚（約4cm）と周囲リンパ節の腫大。肝転移ははっきりしない。' }] },
  natural: -0.002,
  therapies: [{ id: 'gi', label: '消化器内科コンサルト→大腸内視鏡と生検、病期診断', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'gi') }, required: true, deadlineH: [48, 24, 24], effect: -0.2, lagH: 6 }],
  consult: { gi: '消化器内科：鉄欠乏性貧血と便通異常から大腸がんを強く疑います。大腸内視鏡で生検し、CTで病期を評価して外科手術を相談します。貧血には鉄剤を開始してください。' },
  useful: ['cbc', 'ferritin', 'chem', 'fobt', 'abd_ct_contrast', 'coag'], key: [['cbc'], ['ferritin']],
  dispo: () => ({ ok: ['home', 'admit'], best: 'home', why: '大腸がんの疑い：貧血が高度でなければ外来で速やかに大腸内視鏡' }),
  teaching: [
    '中高年の鉄欠乏性貧血は、消化管からの出血（大腸がん・胃がん）を必ず探す（男性・閉経後女性では特に）。',
    '便通の変化（便が細い・便秘と下痢の繰り返し）・血便・体重減少・家族歴は大腸がんの警告症状。',
    '診断は大腸内視鏡と生検。CTで病期（リンパ節・肝転移）を評価し、手術・化学療法を決める。',
    '便潜血検査による大腸がん検診で早期発見できる。',
  ],
  sources: ['大腸癌治療ガイドライン医師用2024年版（大腸癌研究会）'],
  ideal: () => [{ a: 'test', ids: ['cbc', 'ferritin', 'chem', 'abd_ct_contrast'] }, { a: 'rx', drugId: 'ferrous', route: 'po', dose: 100, freq: 'q24h', days: 30 }, { a: 'consult', dept: 'gi', delayMin: 1 }, { a: 'wait', min: 70 }],
});
