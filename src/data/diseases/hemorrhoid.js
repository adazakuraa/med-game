// 内痔核からの出血
// 出典: 日本大腸肛門病学会『肛門疾患（痔核・痔瘻・裂肛）・直腸脱診療ガイドライン2020年版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'hemorrhoid', name: '内痔核（痔核からの出血）', dept: '消化器外科', weight: 5,
  demo: { age: [25, 70], ageMode: 'uniform', male: 0.5 },
  comorb: { extra: { constip: 0.4 } },
  vars: (rng) => ({ d: rng.int(2, 7) }),
  cc: () => '排便のときに血が出る', ccKey: 'hematochezia',
  history: {
    onset: { p: 1, text: '{d}日前から、排便のたびに真っ赤な血が出ます。' },
    character: { p: 1, text: '便の後にポタポタと鮮やかな赤い血が垂れて、トイレットペーパーにも付きます。' },
    bloodystool: { p: 1, text: '便の表面に赤い血が付いています。便に混ざってはいません。黒い便ではありません。' },
    constipation: { p: 1, text: '便秘がちで、トイレで強くいきむことが多いです。' },
    abdpain: { p: 0, text: '' }, diarrhea: { p: 0, text: '' }, fever: { p: 0, text: '' }, weightloss: { p: 0, text: '' }, dizziness: { p: 0, text: '' },
    meds: { p: 1, text: '特に飲んでいません。' },
    pmh: { p: 0.4, text: '前にも同じことがあり、自然に止まりました。' },
  },
  exam: { rectal: { p: 1, text: '肛門鏡で3時・7時方向に内痔核（腫大・うっ血、一部に出血の跡）。直腸に腫瘤は触れない。' }, abd_palp: { p: 0, text: '' } },
  tests: { fobt: { p: 1 } },
  natural: -0.25,
  therapies: [{ id: 'tx', label: '痔核の外用薬と排便習慣の改善（食物繊維・水分・いきまない）', req: { anyTag: ['hemorrhoid_topical'] }, effect: -0.3, lagH: 6, required: true, deadlineH: [24, 24, 24] }],
  useful: ['cbc', 'fobt'], key: [['cbc']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '痔核からの出血：貧血がなければ外来治療。40歳以上・便通異常・貧血・家族歴があれば大腸内視鏡で大腸がんを除外' }),
  teaching: [
    '排便時の鮮血（便の表面に付く・ポタポタ垂れる）で痛みが少なければ内痔核からの出血が多い。痛みが強ければ裂肛・血栓性外痔核。',
    '直腸診・肛門鏡で痔核を確認する。「痔だろう」で終わらせず、便に血が混ざる・便通の変化・体重減少・貧血・40歳以上では大腸内視鏡で大腸がんを除外する。',
    '貧血の有無を血算で確認。',
    '治療は便通の改善（食物繊維・水分・長くいきまない）と外用薬。出血を繰り返す・脱出する痔核は硬化療法（ALTA）や手術。',
  ],
  sources: ['肛門疾患（痔核・痔瘻・裂肛）・直腸脱診療ガイドライン2020年版（日本大腸肛門病学会）'],
  ideal: () => [{ a: 'test', ids: ['cbc'] }, { a: 'rx', drugId: 'hemorrhoid_oint', route: 'top', dose: 2, freq: 'q12h', days: 7 }],
});
