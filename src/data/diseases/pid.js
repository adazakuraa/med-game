// 骨盤内炎症性疾患（PID）
// 出典: 日本性感染症学会『性感染症 診断・治療ガイドライン2020』, CDC STI Treatment Guidelines 2021
import { T } from './common.js'; // eslint-disable-line no-unused-vars
export default {
  id: 'pid', name: '骨盤内炎症性疾患', dept: '産婦人科',
  weight: 3, season: {}, minLevel: 2,
  demo: { age: [18, 40], ageMode: 'young', male: 0 },
  noPregnancy: true,
  sev: { p: [0.5, 0.4, 0.1], burden: [[22, 32], [35, 48], [52, 64]] },
  refractoryP: [0, 0, 0.05],
  comorb: { extra: {} },
  organisms: ['chlamydia'],
  minAbxDays: 10,
  vars: (rng) => ({ days: rng.int(2, 5) }),
  cc: () => '下腹部痛と発熱',
  ccKey: 'lower_abd_f',
  arrival: () => 'walk',
  history: {
    onset: { p: 1, text: '{days}日前から下腹部が痛く、昨日から熱が出ました。' },
    character: { p: 1, text: '下腹部全体が鈍く痛みます。' },
    location: { p: 1, text: '下腹部の両側です。' },
    fever: { p: [0.5, 0.8, 0.95], text: '38度台の熱があります。' },
    vagbleed: { p: 0.75, text: '黄色っぽいおりものが増えています。' },
    dysuria: { p: 0.25, text: 'おしっこの時に少ししみます。' },
    abdpain: { p: 1, text: '下腹部が痛いです。' },
    lmp: { p: 1, text: '最終月経は1週間前に終わりました。妊娠の可能性はないと思います。' },
    trigger: { p: 0.6, text: '最近、新しいパートナーができました。' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['やや痛そう。', '熱っぽく痛そう。', 'ぐったりしている。'] },
    abd_palp: { p: 1, text: '両側下腹部に圧痛。' },
    pelvic: { p: 0.95, text: '子宮頸部の移動痛あり。両側付属器に圧痛。膿性の帯下。' },
    abd_rebound: { p: [0, 0.2, 0.6], text: '下腹部に反跳痛。' },
    murphy: { p: 0.1, text: '右季肋部に圧痛（肝周囲炎：Fitz-Hugh-Curtis症候群を疑う）。' },
  },
  vitals: { T: { to: [38.2, 39.2], k: 0.6 }, HR: { to: [100, 118], k: 1 } },
  labs: { WBC: { to: [11000, 17000], k: 0.8 }, CRP: { to: [5, 18], k: 0.8 }, U_LEU: { ord: [1, 2], p: 0.3 } },
  tests: {
    tvus: [{ p: 0.6, text: '両側卵管の腫大・壁肥厚。ダグラス窩に少量の液体。' }, { p: [0, 0, 0.8], text: '{abscess}' }],
    abd_ct_contrast: [{ p: 0.6, text: '骨盤内の脂肪織濃度上昇、卵管の腫大。虫垂は正常。' }],
  },
  postVars: (v) => { v.abscess = '右付属器に卵管卵巣膿瘍（径4cm）。'; },
  natural: 0.4,
  therapies: [
    { id: 'gc', label: '淋菌をカバーする抗菌薬（セフトリアキソン 1g）', req: { fn: (enc) => enc.orders.some((o) => o.drugId === 'ctrx' && enc.t >= o.start) }, effect: -0.6, lagH: 6, required: true, deadlineH: [12, 8, 4] },
    { id: 'chlam', label: 'クラミジアをカバーする抗菌薬（ドキシサイクリンなど）', req: { coverage: ['chlamydia'] }, effect: -0.6, lagH: 6, required: true, deadlineH: [24, 12, 8] },
  ],
  dispo: dispoBySevLocal(),
  useful: ['uhcg', 'tvus', 'cbc', 'crp', 'chem', 'ua', 'used', 'abd_ct_contrast', 'abd_us', 'bcx'],
  key: [['uhcg'], ['cbc', 'crp']],
  extrasOk: () => [],
  teaching: [
    '性的に活動的な女性の下腹部痛・発熱・膿性帯下、内診での子宮頸部移動痛・付属器圧痛は骨盤内炎症性疾患を疑う。',
    '原因は淋菌・クラミジアなど。セフトリアキソン＋ドキシサイクリン（嫌気性菌をカバーするメトロニダゾールを加えることも）。',
    '妊娠反応で異所性妊娠を、虫垂炎・卵巣捻転を除外する。卵管卵巣膿瘍があれば入院。',
    'パートナーの治療と、ほかの性感染症（HIV・梅毒）の検査も重要。',
  ],
  sources: ['性感染症 診断・治療ガイドライン2020（日本性感染症学会）', 'CDC STI Treatment Guidelines 2021'],
  ideal: (p) => [
    { a: 'test', ids: ['uhcg', 'cbc', 'crp', 'tvus'] },
    { a: 'rx', drugId: 'ctrx', route: 'iv', dose: 1000, freq: 'q24h', days: 3 },
    { a: 'rx', drugId: 'doxy', route: 'po', dose: 100, freq: 'q12h', days: 14 },
  ],
};
function dispoBySevLocal() {
  return (enc) => (enc.patient.sev === 0 ? { ok: ['home', 'admit'], best: 'home', why: '軽症：外来で抗菌薬（セフトリアキソン筋注/静注＋ドキシサイクリン内服）' } : { ok: ['admit'], best: 'admit', why: '発熱・腹膜刺激徴候・膿瘍：入院で点滴抗菌薬' });
}
