// 子宮頸がん
// 出典: 日本婦人科腫瘍学会『子宮頸癌治療ガイドライン2022年版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'cervical_ca', name: '子宮頸がん', dept: '産婦人科', weight: 2, minLevel: 2,
  demo: { age: [30, 55], ageMode: 'uniform', male: 0 },
  noPregnancy: true,
  smokeP: 0.4,
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '性行為の後に出血する', ccKey: 'vaginal',
  history: {
    onset: { p: 1, text: '数か月前から、性行為の後に少量の出血があります。' },
    vagbleed: { p: 1, text: '性交後に少量の出血があり、茶色いおりものも増えました。' },
    character: { p: 1, text: '痛みはありません。' },
    lmp: { p: 1, text: '生理は順調で、最終月経は2週間前です。' },
    pmh: { p: 1, text: '子宮がん検診は10年以上受けていません。HPVワクチンは打っていません。' },
    itch: { p: 0, text: 'かゆみはありません。' },
    fever: { p: 0, text: '' }, abdpain: { p: 0, text: '' }, retention: { p: 0, text: '' }, trigger: { p: 0, text: '' }, meds: { p: 0, text: '' },
  },
  exam: { speculum: { p: 1, text: '子宮頸部に易出血性のびらん状の不整な病変（接触出血）。' }, pelvic: { p: 0.5, text: '子宮頸部はやや硬い。付属器に腫瘤なし。' } },
  tests: { pap: [{ p: 1, persist: true, text: 'HSIL〜SCC（扁平上皮がんを疑う）、ハイリスクHPV（16型）陽性。' }] },
  natural: -0.002,
  therapies: [{ id: 'gyn', label: '産婦人科へ紹介：コルポスコピー・組織診、病期に応じた手術・放射線治療', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'obgyn') }, effect: -0.2, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  consult: { obgyn: '産婦人科：細胞診とHPVの結果から子宮頸がんを疑います。コルポスコピー下の組織診で確定し、MRI・CTで病期を評価して手術または同時化学放射線療法を行います。' },
  useful: ['pap', 'uhcg', 'cbc', 'sti_pcr', 'koh'], key: [['pap'], ['uhcg']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '子宮頸がんの疑い：産婦人科外来で精査' }),
  teaching: [
    '性交後出血・不正出血・帯下の増加は子宮頸がんのサイン。ハイリスクHPVの持続感染が原因。',
    '20歳以上は2年に1回の子宮頸がん検診（細胞診・HPV）、HPVワクチンで予防できる。',
    '妊娠反応・性感染症（クラミジア子宮頸管炎）も確認する。',
  ],
  sources: ['子宮頸癌治療ガイドライン2022年版（日本婦人科腫瘍学会）'],
  ideal: () => [{ a: 'test', ids: ['pap', 'uhcg'] }, { a: 'consult', dept: 'obgyn', delayMin: 1 }, { a: 'wait', min: 70 }],
});
