// 肛門周囲膿瘍
// 出典: 日本大腸肛門病学会『肛門疾患（痔核・痔瘻・裂肛）・直腸脱診療ガイドライン2020年版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'perianal_abscess', name: '肛門周囲膿瘍', dept: '消化器外科', weight: 3,
  demo: { age: [20, 60], ageMode: 'uniform', male: 0.85 },
  sev: { p: [0.5, 0.4, 0.1], burden: [[20, 28], [28, 36], [36, 44]] },
  comorb: { extra: { dm2: 0.15 } },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => 'お尻の横が腫れて痛い', ccKey: 'anal_pain',
  history: {
    onset: { p: 1, text: '3日前から肛門の{side}横がズキズキ痛み、だんだん腫れてきました。' },
    character: { p: 1, text: '座れないくらい痛く、ずっと痛いです。排便のときだけではありません。' },
    location: { p: 1, text: '肛門の{side}横です。' },
    fever: { p: [0.3, 0.7, 1], text: '昨日から37.8度の熱があります。' },
    bloodystool: { p: 0, text: '便に血は混じっていません。' }, diarrhea: { p: 0.2, text: '先週、下痢をしていました。' },
    constipation: { p: 0, text: '' }, pmh: { p: 0, text: '痔と言われたことはありません。' },
  },
  exam: { rectal: { p: 1, text: '肛門の{side}側方に、発赤・熱感を伴う3cmの硬い膨隆と強い圧痛。一部に波動を触れる。' }, skin: { p: 1, text: '肛門周囲の皮膚の発赤・腫脹。' } },
  vitals: { T: { to: [37.6, 38.5], k: 0.5 } },
  labs: { WBC: { to: [11000, 15000], k: 0.6 }, CRP: { to: [3, 10], k: 0.6 } },
  tests: {},
  natural: 0.15,
  therapies: [{ id: 'incision', label: '切開排膿（抗菌薬だけでは治らない）', req: { fn: (enc) => !!enc.state.procs?.incision }, effect: -1.2, lagH: 0, required: true, deadlineH: [12, 6, 4] }],
  dynamics: (enc) => (enc.state.procs?.incision && enc.t >= enc.state.procs.incision ? -1.0 : 0),
  useful: ['cbc', 'crp', 'bs_poct', 'chem'], key: [],
  dispo: (enc) => (enc.patient.sev === 2 ? { ok: ['admit', 'home'], best: 'admit', why: '発熱の強い肛門周囲膿瘍：入院で排膿と抗菌薬（糖尿病では壊死性筋膜炎に注意）' } : { ok: ['home', 'admit'], best: 'home', why: '切開排膿して帰宅（座浴、後日の痔瘻の手術を外科外来で相談）' }),
  teaching: [
    '肛門のそばの持続する痛み・腫れ・発熱は肛門周囲膿瘍。肛門腺の感染で、排便時だけの痛み（裂肛）とは違う。',
    '治療は切開排膿。抗菌薬だけでは治らない。治った後に痔瘻になることが多い。',
    '糖尿病・免疫不全で急速に広がる場合はフルニエ壊疽（会陰部の壊死性筋膜炎）を疑う。',
    '繰り返す痔瘻・若年者ではクローン病も考える。',
  ],
  sources: ['肛門疾患（痔核・痔瘻・裂肛）・直腸脱診療ガイドライン2020年版（日本大腸肛門病学会）'],
  ideal: () => [{ a: 'test', ids: ['cbc', 'crp'] }, { a: 'proc', id: 'incision' }],
});
