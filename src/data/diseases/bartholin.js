// バルトリン腺膿瘍
// 出典: 日本産科婦人科学会『産婦人科診療ガイドライン 婦人科外来編2023』
import { outpatient } from './common.js';
export default outpatient({
  id: 'bartholin', name: 'バルトリン腺膿瘍', dept: '産婦人科', weight: 3,
  demo: { age: [20, 50], ageMode: 'uniform', male: 0 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '陰部が腫れて痛い', ccKey: 'vaginal',
  history: {
    onset: { p: 1, text: '3日前から陰部の{side}側が腫れて、どんどん痛くなっています。' },
    character: { p: 1, text: '歩いたり座ったりすると痛いです。ピンポン玉くらいに腫れています。' },
    fever: { p: 0.4, text: '少し熱っぽいです。' },
    itch: { p: 0, text: 'かゆみはありません。' }, dysuria: { p: 0, text: '' }, vagbleed: { p: 0, text: '不正出血はありません。' },
    lmp: { p: 1, text: '最終月経は2週間前です。' }, abdpain: { p: 0, text: 'お腹は痛くありません。' },
  },
  exam: { speculum: { p: 1, text: '{side}大陰唇の下1/3に3cmの発赤・熱感を伴う有痛性の腫瘤、波動あり（バルトリン腺膿瘍）。腟内の帯下に異常なし。' }, pelvic: { p: 0, text: '子宮・付属器に圧痛なし。' } },
  tests: { sti_pcr: [{ p: 0.2, text: '淋菌 陽性。' }], uhcg: [{ p: 1, text: '陰性。', normal: true }] },
  natural: 0.1,
  therapies: [{ id: 'incision', label: '切開排膿（または穿刺・造袋術）', req: { fn: (enc) => !!enc.state.procs?.incision }, effect: -1.0, lagH: 0, required: true, deadlineH: [12, 8, 6] }],
  dynamics: (enc) => (enc.state.procs?.incision && enc.t >= enc.state.procs.incision ? -1.0 : 0),
  useful: ['cbc', 'crp', 'sti_pcr', 'uhcg'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: 'バルトリン腺膿瘍：切開排膿して帰宅（再発を繰り返せば造袋術）' }),
  teaching: [
    '大陰唇の下1/3（腟の入口の4時・8時方向）の有痛性の腫れはバルトリン腺膿瘍。',
    '治療は切開排膿。再発を繰り返すときは造袋術。性感染症（淋菌・クラミジア）の検査も。',
    '40歳以上の新たな腫瘤・硬い腫瘤はまれにバルトリン腺がんがあり、生検を考える。',
  ],
  sources: ['産婦人科診療ガイドライン 婦人科外来編2023（日本産科婦人科学会）'],
  ideal: () => [{ a: 'test', ids: ['uhcg'] }, { a: 'proc', id: 'incision' }],
});
