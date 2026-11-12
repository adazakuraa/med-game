// 足底腱膜炎
// 出典: 日本整形外科学会 症状・病気をしらべる「足底腱膜炎」
import { outpatient } from './common.js';
export default outpatient({
  id: 'plantar_fasciitis', name: '足底腱膜炎', dept: '整形外科', weight: 4,
  demo: { age: [35, 65], ageMode: 'uniform', male: 0.4 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']), cause: rng.pick(['マラソンの練習を増やして', '立ち仕事の職場に変わって', '体重が増えて']) }),
  cc: () => '朝起きて最初の一歩でかかとが痛い', ccKey: 'joint_pain',
  history: {
    onset: { p: 1, text: '2か月前から、{side}足のかかとが痛みます。{cause}からです。' },
    character: { p: 1, text: '朝起きて最初の一歩が一番痛く、歩いているうちに少し楽になります。長く立っているとまた痛くなります。' },
    location: { p: 1, text: '{side}足のかかとの内側、土踏まずの手前です。' },
    joint: { p: 0, text: 'ほかの関節は痛くありません。' },
    trigger: { p: 1, text: '{cause}からです。' },
    stiffness: { p: 1, text: '朝起きたときにかかとがこわばります。' },
    fever: { p: 0, text: '熱はありません。' }, pmh: { p: 0, text: '' }, alcohol: { p: 0, text: '' }, meds: { p: 0, text: '' },
  },
  exam: { joint: { p: 1, text: '{side}踵骨内側結節（足底腱膜の付着部）に限局した圧痛。足趾を背屈させると痛みが強くなる。腫脹・熱感なし。アキレス腱に圧痛なし。' } },
  tests: { joint_xr: [{ p: 0.5, text: '踵骨の足底側に小さな骨棘。骨折なし。', normal: true }] },
  natural: -0.01,
  therapies: [{ id: 'tx', label: 'ストレッチ（足底腱膜・アキレス腱）、靴の中敷き、NSAIDs', req: { anyTag: ['nsaid', 'analgesic'] }, effect: -0.3, lagH: 6, required: true, deadlineH: [48, 48, 48] }],
  useful: ['joint_xr'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '足底腱膜炎：ストレッチ・中敷き・NSAIDsで外来（多くは数か月で改善）' }),
  teaching: [
    '朝起きて最初の一歩でかかとの内側が痛み、歩くうちに楽になる → 足底腱膜炎。ランナー・立ち仕事・肥満に多い。',
    '踵骨内側結節の圧痛で診断。X線の骨棘は原因とは限らない。',
    '治療はストレッチ、中敷き、NSAIDs、体重管理。難治例は体外衝撃波治療。',
  ],
  sources: ['日本整形外科学会 症状・病気をしらべる「足底腱膜炎」'],
  ideal: () => [{ a: 'rx', drugId: 'loxo', route: 'po', dose: 60, freq: 'q8h', days: 7 }],
});
