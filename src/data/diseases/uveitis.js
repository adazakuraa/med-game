// 急性前部ぶどう膜炎（虹彩毛様体炎）
// 出典: 日本眼炎症学会『ぶどう膜炎診療ガイドライン』
import { outpatient } from './common.js';
export default outpatient({
  id: 'uveitis', name: '急性前部ぶどう膜炎', dept: '眼科', weight: 2,
  demo: { age: [20, 50], ageMode: 'young', male: 0.6 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '目が赤く痛い、まぶしい', ccKey: 'red_eye',
  history: {
    onset: { p: 1, text: '2日前から{side}目が赤く、ズーンと痛みます。' },
    character: { p: 1, text: 'まぶしくて目を開けていられません。少しかすみます。' },
    vision: { p: 1, text: '少しかすんで見えます。' },
    itch: { p: 0, text: 'かゆみや目やにはありません。' },
    sickcontact: { p: 0, text: '' }, nausea: { p: 0, text: '' },
    headache: { p: 0.3, text: '目の奥が痛みます。' },
    pmh: { p: 0.6, text: '数年前から腰が痛く、朝にこわばります（強直性脊椎炎と言われています）。' },
    allergy: { p: 0, text: '' },
  },
  exam: { eye: { p: 1, text: '{side}眼の角膜周囲の充血（毛様充血）、眼脂なし。瞳孔はやや小さい。' }, pupils: { p: 0.6, text: '{side}眼の縮瞳、対光反射は遅い。' } },
  tests: { slit: [{ p: 1, persist: true, text: '{side}眼の前房に炎症細胞とフレア、角膜後面沈着物。角膜は染まらない。' }] },
  natural: 0.01,
  therapies: [{ id: 'eye', label: '眼科で診断・治療（ステロイド点眼・散瞳薬）、全身疾患の検索', req: { fn: (enc, eff) => (eff.tags.eye_steroid || 0) > 0 || enc.consults.some((c) => c.dept === 'eye') }, effect: -0.5, lagH: 6, required: true, deadlineH: [24, 24, 24] }],
  consult: { eye: '眼科：急性前部ぶどう膜炎です。ステロイド点眼と散瞳薬で治療します。HLA-B27関連（強直性脊椎炎）が疑われるので、膠原病内科でも評価をお願いします。' },
  useful: ['slit', 'acuity', 'iop', 'crp', 'esr', 'cxr'], key: [['slit']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '急性前部ぶどう膜炎：眼科外来で治療（翌日に再診）' }),
  teaching: [
    '眼痛・羞明・視力低下・角膜周囲の充血（毛様充血）で眼脂がないのはぶどう膜炎・角膜炎・緑内障発作などの重い目の病気。結膜炎とは区別し眼科へ。',
    '急性前部ぶどう膜炎はHLA-B27（強直性脊椎炎・炎症性腸疾患・反応性関節炎）、サルコイドーシス、ベーチェット病などに伴う。',
    'ステロイド点眼は眼科で（角膜ヘルペスなどを悪化させるため、診断せずに使わない）。',
  ],
  sources: ['ぶどう膜炎診療ガイドライン（日本眼炎症学会）'],
  ideal: () => [{ a: 'test', ids: ['acuity', 'slit'] }, { a: 'consult', dept: 'eye', delayMin: 1 }, { a: 'wait', min: 70 }],
});
