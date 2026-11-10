// 悪性リンパ腫（びまん性大細胞型B細胞リンパ腫）
// 出典: 日本血液学会『造血器腫瘍診療ガイドライン2023年版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'lymphoma', name: '悪性リンパ腫', dept: '血液内科', weight: 2, minLevel: 3,
  demo: { age: [45, 80], ageMode: 'uniform', male: 0.55 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '首のしこりが大きくなってきた', ccKey: 'lymph',
  history: {
    onset: { p: 1, text: '1か月前に{side}の首にしこりがあるのに気づき、だんだん大きくなっています。' },
    character: { p: 1, text: 'しこりは痛くありません。' },
    fever: { p: 0.6, text: '夕方に37度台後半の熱が出ます。' },
    nightsweat: { p: 0.8, text: '寝汗をかきます。' },
    weightloss: { p: 0.8, text: '2か月で5kgやせました。' },
    sorethroat: { p: 0, text: '喉の痛みはありません。' },
    sickcontact: { p: 0, text: '' }, cough: { p: 0, text: '' }, pmh: { p: 0, text: '' },
  },
  exam: { neck_ln: { p: 1, text: '{side}頸部〜鎖骨上に2〜3cmの弾性硬で可動性のある無痛性のリンパ節が複数。' }, abd_palp: { p: 0.4, text: '脾臓を触れる。' }, pharynx: { p: 1, text: '咽頭・扁桃に異常なし。' } },
  labs: { LDH: { add: [150, 500], k: 0 }, CRP: { to: [1, 4], k: 0 } },
  tests: { neck_us: [{ p: 1, persist: true, text: '{side}頸部に内部が均一な低エコーで類円形の腫大リンパ節が多数（リンパ門が消失）。' }], chest_ct: [{ p: 1, persist: true, text: '縦隔・腹部大動脈周囲にもリンパ節腫大。' }] },
  natural: -0.002,
  therapies: [{ id: 'hema', label: '血液内科コンサルト→リンパ節生検で診断・病期診断', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'hema') }, effect: -0.2, lagH: 6, required: true, deadlineH: [48, 24, 24] }],
  consult: { hema: '血液内科：無痛性の多発リンパ節腫大・B症状・LDH高値から悪性リンパ腫を疑います。リンパ節生検で病型を確定し、PET-CTで病期を評価して化学療法（R-CHOPなど）を行います。' },
  useful: ['cbc', 'chem', 'neck_us', 'chest_ct', 'crp', 'afb', 'igra'], key: [['cbc'], ['chem']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '悪性リンパ腫の疑い：血液内科外来で速やかに生検' }),
  teaching: [
    '痛みのない、弾性硬のリンパ節腫大が数週以上続いて大きくなる・複数の部位にある・B症状（発熱・寝汗・体重減少）があれば悪性リンパ腫を疑う。',
    '痛みのある小さなリンパ節で、かぜ症状があれば反応性（感染）が多い。伝染性単核球症・結核・がんの転移・サルコイドーシスも鑑別。',
    '診断はリンパ節の生検（摘出）。LDH・可溶性IL-2受容体が上昇。',
  ],
  sources: ['造血器腫瘍診療ガイドライン2023年版（日本血液学会）'],
  ideal: () => [{ a: 'test', ids: ['cbc', 'chem', 'neck_us'] }, { a: 'consult', dept: 'hema', delayMin: 1 }, { a: 'wait', min: 70 }],
});
