// 唾石症（顎下腺）
// 出典: 日本口腔外科学会・日本耳鼻咽喉科頭頸部外科学会 資料
import { outpatient } from './common.js';
export default outpatient({
  id: 'sialolith', name: '唾石症', dept: '耳鼻咽喉科', weight: 2.5,
  demo: { age: [30, 60], ageMode: 'uniform', male: 0.55 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '食事のたびにあごの下が腫れて痛い', ccKey: 'oral',
  history: {
    onset: { p: 1, text: '1か月前から、食事のたびに{side}あごの下が腫れて痛くなります。' },
    character: { p: 1, text: '食べ始めると急に腫れてきて、食後1〜2時間でしぼみます。酸っぱいものを食べると特にひどいです。' },
    trigger: { p: 1, text: '食事や梅干しを食べたときです。' },
    fever: { p: 0, text: '熱はありません。' }, dyspnea: { p: 0, text: '' }, pmh: { p: 0, text: '' },
  },
  exam: { neck_ln: { p: 1, text: '{side}顎下腺の腫大と軽い圧痛。リンパ節ではない。' }, oral_mucosa: { p: 1, text: '{side}口底に硬い小さな塊を触れ、顎下腺管の開口部からの唾液の流出が少ない。膿は出ない。歯に異常なし。' } },
  tests: { neck_us: [{ p: 1, persist: true, text: '{side}顎下腺管内に音響陰影を伴う5mmの結石と、管の拡張・顎下腺の腫大。' }] },
  natural: -0.005,
  therapies: [{ id: 'ent', label: '耳鼻咽喉科/口腔外科へ紹介：口からの唾石摘出（腺内の結石は顎下腺摘出）、水分摂取', req: { fn: (enc) => enc.consults.some((c) => ['ent', 'dental'].includes(c.dept)) }, effect: -0.3, lagH: 6, required: true, deadlineH: [72, 72, 72] }],
  consult: { ent: '耳鼻咽喉科：顎下腺管の唾石です。口の中から触れる位置にあるので、局所麻酔で口内から摘出します（外来手術）。感染を起こして腫れ・発熱・膿が出たら抗菌薬が必要なので、早めに受診してください。' },
  useful: ['neck_us', 'cbc', 'crp'], key: [['neck_us']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '唾石症：耳鼻咽喉科/口腔外科で唾石摘出' }),
  teaching: [
    '食事のたびに顎の下が腫れて痛み、食後しばらくでしぼむ（唾仙痛）は唾石症。多くは顎下腺。',
    'エコー・CTで結石を確認。口底で触れることもある。発熱・膿の流出があれば化膿性唾液腺炎（抗菌薬）。',
    '口内から摘出、腺内の結石は顎下腺摘出。食事に関係なく腫れが続く場合は腫瘍・シェーグレン症候群も考える。',
  ],
  sources: ['日本耳鼻咽喉科頭頸部外科学会「唾石症」'],
  ideal: () => [{ a: 'test', ids: ['neck_us'] }, { a: 'consult', dept: 'ent', delayMin: 1 }, { a: 'wait', min: 70 }],
});
