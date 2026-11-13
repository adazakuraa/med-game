// 裂肛（切れ痔）
// 出典: 日本大腸肛門病学会『肛門疾患（痔核・痔瘻・裂肛）・直腸脱診療ガイドライン2020年版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'anal_fissure', name: '裂肛（切れ痔）', dept: '消化器外科', weight: 4,
  demo: { age: [20, 50], ageMode: 'young', male: 0.3 },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '排便のときにお尻が切れるように痛い', ccKey: 'anal_pain',
  history: {
    onset: { p: 1, text: '2週間前、硬い便を出したときから、排便のたびに肛門が切れるように痛みます。' },
    character: { p: 1, text: '便を出すときと、その後しばらくヒリヒリ痛みます。トイレが怖いです。' },
    location: { p: 1, text: '肛門です。' },
    bloodystool: { p: 1, text: 'トイレットペーパーに少し真っ赤な血が付きます。' },
    constipation: { p: 1, text: '便秘がちで、便が硬いです。' },
    fever: { p: 0, text: '熱はありません。' }, weightloss: { p: 0, text: '体重は変わりません。' }, diarrhea: { p: 0, text: '' }, pmh: { p: 0, text: '' },
  },
  exam: { rectal: { p: 1, text: '肛門後方（6時方向）に縦に裂けた浅い潰瘍。痛みが強く指診は困難。腫れや膿はない。' }, skin: { p: 0, text: '肛門周囲の発赤・腫脹なし。' } },
  natural: -0.03,
  therapies: [{ id: 'tx', label: '便通の調整（酸化マグネシウム・食物繊維）と外用薬（坐剤・軟膏）', req: { anyTag: ['laxative', 'hemorrhoid_topical'] }, effect: -0.3, lagH: 6, required: true, deadlineH: [24, 24, 24] }],
  useful: ['cbc', 'fobt'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '裂肛：便通の調整と外用薬で外来治療（慢性化すれば手術）' }),
  teaching: [
    '硬い便の後の、排便時の切れるような痛みと少量の鮮血は裂肛。多くは肛門の後方（6時）にできる。',
    '治療は便を軟らかくすること（酸化マグネシウム・食物繊維・水分）と外用薬。慢性化して潰瘍・見張りいぼができれば手術。',
    '側方の裂肛・多発する裂肛・痔瘻を伴う場合はクローン病・性感染症・がんを考える。',
  ],
  sources: ['肛門疾患（痔核・痔瘻・裂肛）・直腸脱診療ガイドライン2020年版（日本大腸肛門病学会）'],
  ideal: () => [{ a: 'rx', drugId: 'mgo_rx', route: 'po', dose: 330, freq: 'q8h', days: 14 }, { a: 'rx', drugId: 'hemorrhoid_oint', route: 'top', dose: 2, freq: 'q12h', days: 14 }],
});
