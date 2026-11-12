// 細菌性腟症
// 出典: 日本性感染症学会『性感染症 診断・治療ガイドライン2020』, 産婦人科診療ガイドライン 婦人科外来編2023
import { outpatient } from './common.js';
export default outpatient({
  id: 'bv', name: '細菌性腟症', dept: '産婦人科', weight: 4,
  demo: { age: [20, 50], ageMode: 'uniform', male: 0 },
  comorb: { extra: {} }, organisms: ['anaerobe'],
  vars: () => ({}),
  cc: () => 'おりものが魚のようなにおいがする', ccKey: 'vaginal',
  history: {
    onset: { p: 1, text: '2週間前から、おりものが増えて、においが気になります。' },
    character: { p: 1, text: '灰色っぽくサラサラしたおりもので、魚のような生臭いにおいがします。性交の後に特に強くなります。' },
    itch: { p: 0, text: 'かゆみはほとんどありません。' }, dysuria: { p: 0, text: '排尿時の痛みはありません。' },
    fever: { p: 0, text: '熱はありません。' }, abdpain: { p: 0, text: 'お腹は痛くありません。' },
    vagbleed: { p: 0, text: '不正出血はありません。' }, lmp: { p: 1, text: '最終月経は2週間前で、順調です。妊娠の可能性はないと思います。' },
    meds: { p: 0, text: '最近、抗菌薬は飲んでいません。' },
  },
  exam: { speculum: { p: 1, text: '灰白色・均一で泡沫状の帯下が腟壁に付着、腟壁の発赤は乏しい。子宮頸部に異常なし。アミン臭（KOH添加で魚臭）。' }, pelvic: { p: 0, text: '子宮・付属器に圧痛なし。子宮頸部の移動痛なし。' } },
  tests: { koh: [{ p: 1, persist: true, text: '酵母様真菌なし。KOH添加で魚臭（whiff test陽性）。鏡検でclue cell（上皮細胞に細菌が付着）多数、乳酸桿菌は減少。' }], sti_pcr: [{ p: 1, text: 'クラミジア・淋菌 陰性。' }], uhcg: [{ p: 1, text: '陰性。' }] },
  natural: -0.02,
  therapies: [{ id: 'abx', label: 'メトロニダゾール（内服または腟錠）', req: { coverage: ['anaerobe'] }, effect: -0.4, lagH: 24, required: true, deadlineH: [24, 24, 24] }],
  useful: ['koh', 'sti_pcr', 'uhcg', 'ua'], key: [['koh']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '細菌性腟症：メトロニダゾールで外来治療（パートナーの治療は不要）' }),
  teaching: [
    '魚のような生臭いにおい（性交後に強い）の灰色で均一な帯下、かゆみは乏しい → 細菌性腟症。腟内の乳酸桿菌が減り嫌気性菌が増えた状態。',
    '鏡検でclue cell、KOHを加えると魚臭（whiff test）、腟内pH>4.5（Amselの基準）。',
    '治療はメトロニダゾール。妊婦では早産の危険因子になる。カンジダ（白い酒かす状・強いかゆみ）・トリコモナス（黄緑色の泡状・かゆみ）と区別する。',
  ],
  sources: ['性感染症 診断・治療ガイドライン2020（日本性感染症学会）'],
  ideal: () => [{ a: 'test', ids: ['koh', 'uhcg'] }, { a: 'rx', drugId: 'mnz_po', route: 'po', dose: 500, freq: 'q12h', days: 7 }],
});
