// 子宮体がん（閉経後出血）
// 出典: 日本婦人科腫瘍学会『子宮体がん治療ガイドライン2023年版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'endometrial_ca', name: '子宮体がん', dept: '産婦人科', weight: 3, minLevel: 2,
  demo: { age: [55, 75], ageMode: 'uniform', male: 0 },
  noPregnancy: true,
  comorb: { extra: { htn: 0.5, dm2: 0.35 } },
  vars: (rng) => ({ y: rng.int(3, 10) }),
  cc: () => '閉経後に出血した', ccKey: 'vaginal',
  history: {
    onset: { p: 1, text: '{y}年前に閉経しましたが、この1か月で何回か性器出血がありました。' },
    character: { p: 1, text: '下着に茶色〜赤い血が付きます。痛みはありません。' },
    vagbleed: { p: 1, text: '少量の出血と、茶色いおりものがあります。' },
    lmp: { p: 1, text: '閉経は{y}年前です。' },
    pmh: { p: 1, text: '子どもは産んでいません。糖尿病と高血圧があります。' },
    meds: { p: 1, text: 'ホルモン剤は使っていません。' },
    weightgain: { p: 0.6, text: '太っています。' },
    itch: { p: 0, text: '' }, fever: { p: 0, text: '' }, abdpain: { p: 0.2, text: '下腹部が少し重い感じがします。' }, retention: { p: 0, text: '' },
  },
  exam: { speculum: { p: 1, text: '子宮口から少量の出血。腟・子宮頸部に明らかな病変はない。' }, pelvic: { p: 0.5, text: '子宮はやや大きい。付属器に腫瘤なし。' } },
  tests: { tvus: [{ p: 1, persist: true, text: '子宮内膜が約15mmに肥厚し、不整（閉経後で4mm以上は異常）。' }] },
  natural: -0.002,
  therapies: [{ id: 'gyn', label: '産婦人科コンサルト→子宮内膜の細胞診・組織診', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'obgyn') }, required: true, deadlineH: [48, 24, 24], effect: -0.2, lagH: 6 }],
  consult: { obgyn: '産婦人科：閉経後出血と子宮内膜の肥厚から子宮体がんを疑います。子宮内膜の組織診を行い、MRI・CTで病期を評価して手術を相談します。' },
  useful: ['tvus', 'cbc', 'uhcg', 'chem', 'abd_ct_contrast'], key: [['tvus']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '閉経後出血：婦人科外来で速やかに子宮内膜の組織診' }),
  teaching: [
    '閉経後の性器出血は、量が少なくても子宮体がんを否定するまで精査する。',
    'リスク：肥満・糖尿病・高血圧・未産・エストロゲン単独のホルモン補充・乳がんのタモキシフェン。',
    '経腟超音波で内膜の肥厚（閉経後4〜5mm以上）を確認し、内膜の細胞診・組織診で診断。',
    '萎縮性腟炎・子宮頸がん・ポリープも閉経後出血の原因になる。',
  ],
  sources: ['子宮体がん治療ガイドライン2023年版（日本婦人科腫瘍学会）'],
  ideal: () => [{ a: 'test', ids: ['tvus', 'cbc'] }, { a: 'consult', dept: 'obgyn', delayMin: 1 }, { a: 'wait', min: 70 }],
});
