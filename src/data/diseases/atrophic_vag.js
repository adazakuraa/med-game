// 萎縮性腟炎（閉経関連泌尿生殖器症候群）
// 出典: 日本産科婦人科学会『産婦人科診療ガイドライン 婦人科外来編2023』
import { outpatient } from './common.js';
export default outpatient({
  id: 'atrophic_vag', name: '萎縮性腟炎', dept: '産婦人科', weight: 4,
  demo: { age: [58, 85], ageMode: 'old', male: 0 },
  comorb: { extra: { htn: 0.3 } },
  vars: () => ({}),
  cc: () => '陰部がヒリヒリして、少し出血した', ccKey: 'vaginal',
  history: {
    onset: { p: 1, text: '数か月前から陰部がヒリヒリして乾いた感じがします。2日前、下着に少し血が付きました。' },
    character: { p: 1, text: '乾燥してヒリヒリします。おりものは少し黄色っぽいです。' },
    vagbleed: { p: 1, text: '下着に少し茶色い血が付く程度です。' },
    itch: { p: 0.5, text: '少しかゆいです。' }, dysuria: { p: 0.4, text: 'おしっこがしみることがあります。' }, frequency: { p: 0.4, text: 'トイレが近いです。' },
    lmp: { p: 1, text: '閉経は50歳でした。' }, fever: { p: 0, text: '熱はありません。' }, abdpain: { p: 0, text: 'お腹は痛くありません。' },
    weightloss: { p: 0, text: '体重は変わりません。' },
  },
  exam: { speculum: { p: 1, text: '腟壁は薄く蒼白で、ひだが消失し、点状出血が散在。少量の黄色い帯下。子宮頸部に腫瘤なし。' }, pelvic: { p: 0, text: '子宮は萎縮、付属器に腫瘤・圧痛なし。' } },
  tests: { tvus: [{ p: 1, text: '子宮内膜は2mmと薄い。子宮・卵巣に腫瘤なし。', normal: true }], pap: [{ p: 1, text: 'NILM（陰性）。萎縮性変化あり。', normal: true }], ua: [{ p: 0.3, text: '白血球（±）。' }], koh: [{ p: 1, text: '真菌を認めない。', normal: true }] },
  natural: -0.01,
  therapies: [{ id: 'tx', label: '内膜の病気（子宮体がん）を除外したうえで、エストリオール腟錠と保湿', req: { fn: (enc, eff) => (eff.tags.estrogen_vag || 0) > 0 && enc.tests.some((t) => t.id === 'tvus' && t.done) }, effect: -0.3, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  useful: ['tvus', 'pap', 'ua', 'koh', 'cbc'], key: [['tvus']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '萎縮性腟炎：エストリオール腟錠で外来治療' }),
  teaching: [
    '閉経後の腟の乾燥・ヒリヒリ感・性交痛・少量の出血・頻尿は、エストロゲン低下による萎縮性腟炎（閉経関連泌尿生殖器症候群）。',
    '閉経後の出血では、まず子宮体がん（経腟エコーで内膜の厚さ・内膜細胞診）と子宮頸がんを除外する。',
    '治療はエストリオール腟錠と保湿剤。尿路感染を繰り返す高齢女性の予防にもなる。',
  ],
  sources: ['産婦人科診療ガイドライン 婦人科外来編2023（日本産科婦人科学会）'],
  ideal: () => [{ a: 'test', ids: ['tvus', 'pap', 'ua'] }, { a: 'rx', drugId: 'estriol_vag', route: 'top', dose: 0.5, freq: 'q24h', days: 14 }],
});
