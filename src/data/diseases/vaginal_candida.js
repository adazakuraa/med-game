// 外陰腟カンジダ症
// 出典: 日本性感染症学会『性感染症 診断・治療ガイドライン2020』, 産婦人科診療ガイドライン 婦人科外来編2023
import { outpatient } from './common.js';
export default outpatient({
  id: 'vaginal_candida', name: '外陰腟カンジダ症', dept: '産婦人科', weight: 5,
  demo: { age: [20, 55], ageMode: 'uniform', male: 0 },
  comorb: { extra: { dm2: 0.15 } },
  vars: (rng) => ({ d: rng.int(3, 7), why: rng.pick(['膀胱炎で抗菌薬を1週間飲んだ後', '疲れがたまっていた時期', '暑くて蒸れることが多かった時期']) }),
  cc: () => '陰部のかゆみとおりもの', ccKey: 'vaginal',
  history: {
    onset: { p: 1, text: '{d}日前、{why}から陰部がかゆくなりました。' },
    character: { p: 1, text: '外陰部が強くかゆく、ヒリヒリします。' },
    vagbleed: { p: 1, text: '白くてポロポロした、酒かすのようなおりものが増えました。においはあまりありません。' },
    itch: { p: 1, text: '外陰部がとてもかゆいです。' },
    dysuria: { p: 0.3, text: 'おしっこのときに外側がしみます。' },
    fever: { p: 0, text: '' }, abdpain: { p: 0, text: '' }, lmp: { p: 1, text: '最終月経は2週間前で、順調です。' },
    trigger: { p: 0.4, text: '新しいパートナーはいません。' },
  },
  exam: { speculum: { p: 1, text: '外陰・腟壁の発赤と、白色の酒かす状〜ヨーグルト状の帯下。' }, pelvic: { p: 0.2, text: '子宮頸部の移動痛なし。付属器の圧痛なし。' } },
  tests: { koh: [{ p: 0.9, persist: true, text: '腟分泌物に仮性菌糸と分芽胞子（カンジダ）。' }] },
  natural: -0.05,
  therapies: [{ id: 'tx', label: '抗真菌薬（クロトリマゾール腟錠・外用クリーム）', req: { tag: 'antifungal_vag' }, effect: -0.6, lagH: 6, required: true, deadlineH: [24, 24, 24] }],
  useful: ['koh', 'uhcg', 'ua'], key: [['koh']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '外陰腟カンジダ症：腟錠と外用薬で外来治療（性交渉で移る病気ではないことも説明）' }),
  teaching: [
    '外陰部の強いかゆみと白い酒かす状・ヨーグルト状の帯下は外陰腟カンジダ症。抗菌薬使用後・妊娠・糖尿病・ステロイド・免疫低下がきっかけ。',
    '鏡検（KOH）で仮性菌糸を確認。においの強い灰色の帯下は細菌性腟症、黄緑色で泡状ならトリコモナス、膿性で子宮頸部の圧痛があればクラミジア・淋菌（骨盤内炎症性疾患）を考える。',
    '治療は腟錠（クロトリマゾールなど）と外用クリーム。繰り返す場合は糖尿病を調べる。',
  ],
  sources: ['性感染症 診断・治療ガイドライン2020（日本性感染症学会）'],
  ideal: () => [{ a: 'test', ids: ['koh'] }, { a: 'rx', drugId: 'clotrimazole_vag', route: 'top', dose: 100, freq: 'q24h', days: 6 }],
});
