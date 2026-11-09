// 月経困難症（子宮内膜症）
// 出典: 日本産科婦人科学会『子宮内膜症取扱い規約 第2部 診療編 第3版』, 『産婦人科診療ガイドライン 婦人科外来編2023』
import { outpatient } from './common.js';
export default outpatient({
  id: 'endometriosis', name: '月経困難症（子宮内膜症）', dept: '産婦人科', weight: 5,
  demo: { age: [20, 45], ageMode: 'uniform', male: 0 },
  noPregnancy: true,
  comorb: { extra: {} },
  vars: (rng) => ({ day: rng.int(1, 2), side: rng.pick(['右', '左']) }),
  cc: () => '生理痛がひどい', ccKey: 'lower_abd_f',
  history: {
    onset: { p: 1, text: '昨日から生理が始まって、下腹部が強く痛みます。' },
    course: { p: 1, text: 'ここ数年、生理のたびに痛みがひどくなってきて、市販の痛み止めが効かなくなりました。' },
    character: { p: 1, text: '下腹部が重く締め付けられるように痛み、腰も痛いです。' },
    location: { p: 1, text: '下腹部の真ん中と腰です。' },
    lmp: { p: 1, text: '今、生理の{day}日目です。周期は順調です。' },
    menses: { p: 1, text: '生理痛が年々ひどくなり、寝込んで仕事を休むこともあります。性交時や排便時にも痛みがあります。' },
    vagbleed: { p: 1, text: '今は生理中です（いつもの量）。' },
    fever: { p: 0, text: '' }, dizziness: { p: 0, text: '' }, dysuria: { p: 0, text: '' }, radiation: { p: 0, text: '' },
    nausea: { p: 0.4, text: '痛いと気持ち悪くなります。' },
    pmh: { p: 0.4, text: '結婚して2年、妊娠を希望していますが、まだできません。' },
  },
  exam: {
    abd_palp: { p: 0.8, text: '下腹部正中に軽い圧痛。腹膜刺激徴候なし。' },
    pelvic: { p: 0.8, text: '子宮の可動性がやや不良で、ダグラス窩に圧痛を伴う硬結。{side}付属器に腫瘤を触れる。' },
  },
  tests: { tvus: [{ p: 0.85, persist: true, text: '子宮内に胎嚢なし。{side}卵巣に約5cmの内部均一なすりガラス状エコーの嚢胞（チョコレート嚢胞）。腹腔内出血なし。' }] },
  natural: -0.1,
  therapies: [
    { id: 'pain', label: '鎮痛（NSAIDs）', req: { anyTag: ['nsaid', 'analgesic'] }, effect: -1, lagH: 0.5, required: true, deadlineH: [3, 3, 2] },
    { id: 'hormone', label: '婦人科でのホルモン療法（低用量エストロゲン・プロゲスチン配合薬、ジエノゲスト）', req: { tag: 'gyn_hormone' }, required: false, deadlineH: [168, 168, 168] },
  ],
  useful: ['uhcg', 'tvus', 'cbc', 'crp', 'ua'], key: [['uhcg']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '月経困難症：鎮痛して帰宅。子宮内膜症（チョコレート嚢胞）の精査・ホルモン療法のため婦人科外来へ' }),
  teaching: [
    '月経のたびに強くなる下腹部痛（月経困難症）。年々悪化する・鎮痛薬が効かない・性交痛・排便痛・不妊は子宮内膜症を疑う。',
    '若い女性の下腹部痛では、まず妊娠反応（異所性妊娠の除外）。発熱・帯下の異常があれば骨盤内炎症性疾患を考える。',
    '経腟超音波で卵巣のチョコレート嚢胞（子宮内膜症性嚢胞）を確認する。破裂・捻転・まれにがん化に注意。',
    '治療はNSAIDs、低用量エストロゲン・プロゲスチン配合薬（LEP）やジエノゲストなどのホルモン療法。妊娠希望も考慮して婦人科で方針を決める。',
  ],
  sources: ['子宮内膜症取扱い規約 第2部 診療編 第3版（日本産科婦人科学会）', '産婦人科診療ガイドライン 婦人科外来編2023'],
  ideal: () => [{ a: 'test', ids: ['uhcg', 'tvus'] }, { a: 'rx', drugId: 'loxo', route: 'po', dose: 60, freq: 'q8h', days: 5 }],
});
