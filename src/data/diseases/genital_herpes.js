// 性器ヘルペス（初感染）
// 出典: 日本性感染症学会『性感染症 診断・治療ガイドライン2020』
import { outpatient } from './common.js';
export default outpatient({
  id: 'genital_herpes', name: '性器ヘルペス', dept: '産婦人科', weight: 3,
  demo: { age: [18, 40], ageMode: 'young', male: 0 },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '陰部に水ぶくれができて、ひどく痛い', ccKey: 'vaginal',
  history: {
    onset: { p: 1, text: '3日前から陰部がピリピリして、昨日から水ぶくれとただれができ、ひどく痛みます。' },
    character: { p: 1, text: '小さい水ぶくれがたくさんあって、ただれて、おしっこがしみて激痛です。' },
    dysuria: { p: 1, text: 'おしっこがしみて、トイレに行くのがつらいです。' },
    fever: { p: 0.7, text: '37.8度の熱とだるさがあります。' },
    itch: { p: 0.4, text: '最初は少しかゆかったです。' },
    lmp: { p: 1, text: '最終月経は2週間前です。1週間前に新しいパートナーと性交渉がありました。' },
    retention: { p: 0.3, text: '痛くておしっこが出しにくいです。' }, vagbleed: { p: 0, text: '' }, abdpain: { p: 0, text: '' },
  },
  exam: { speculum: { p: 1, text: '大陰唇・小陰唇に多発する小水疱と浅い有痛性潰瘍（左右両側）。子宮頸部にも潰瘍。' }, pelvic: { p: 0, text: '付属器に圧痛なし。' } },
  tests: { syphilis: [{ p: 1, text: 'RPR・TPHA 陰性。', normal: true }], sti_pcr: [{ p: 1, text: 'クラミジア・淋菌 陰性。', normal: true }], hiv: [{ p: 1, text: '陰性。', normal: true }], uhcg: [{ p: 1, text: '陰性。', normal: true }] },
  natural: -0.05,
  therapies: [{ id: 'av', label: '抗ヘルペスウイルス薬（バラシクロビル）と鎮痛、性感染症の検査', req: { tag: 'antiviral_hsv' }, effect: -0.5, lagH: 12, required: true, deadlineH: [24, 24, 24] }],
  useful: ['syphilis', 'sti_pcr', 'hiv', 'uhcg', 'ua'], key: [['syphilis']],
  dispo: () => ({ ok: ['home', 'admit'], best: 'home', why: '性器ヘルペス：抗ウイルス薬で外来治療（尿閉・髄膜炎があれば入院）' }),
  teaching: [
    '陰部の多発する小水疱と浅い有痛性潰瘍、排尿時痛、発熱・リンパ節腫脹は性器ヘルペス（初感染は症状が強い）。',
    '治療はバラシクロビルなど。再発を繰り返す場合は抑制療法。排尿困難・尿閉や無菌性髄膜炎を合併することがある。',
    '梅毒（痛みの少ない硬い潰瘍）・HIV・クラミジア・淋菌も検査する。パートナーにも受診を勧める。',
  ],
  sources: ['性感染症 診断・治療ガイドライン2020（日本性感染症学会）'],
  ideal: () => [{ a: 'test', ids: ['syphilis', 'sti_pcr', 'hiv', 'uhcg'] }, { a: 'rx', drugId: 'valacyclovir', route: 'po', dose: 1000, freq: 'q12h', days: 7 }, { a: 'rx', drugId: 'apap_po', route: 'po', dose: 500, freq: 'q6h', days: 5 }],
});
