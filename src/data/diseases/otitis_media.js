// 急性中耳炎（成人）
// 出典: 日本耳科学会ほか『小児急性中耳炎診療ガイドライン2018』（成人にも準用）
import { outpatient } from './common.js';
export default outpatient({
  id: 'otitis_media', name: '急性中耳炎', dept: '耳鼻咽喉科', weight: 3,
  demo: { age: [18, 60], ageMode: 'young', male: 0.5 },
  organisms: ['spn', 'hinf'], minAbxDays: 5, untreatedFatal: false,
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '耳が痛くて聞こえにくい', ccKey: 'hearing',
  history: {
    onset: { p: 1, text: '3日前からかぜで鼻水が出ていて、昨日から{side}耳が痛くなりました。' },
    hearing: { p: 1, text: '{side}耳が詰まった感じで、聞こえにくいです。' },
    character: { p: 1, text: '{side}耳がズキズキ痛みます。' },
    fever: { p: 0.7, text: '38度の熱があります。' },
    course: { p: 1, text: '耳だれはまだ出ていません。' },
    vertigo: { p: 0, text: '' }, weakness: { p: 0, text: '' }, headache: { p: 0.3, text: '少し頭が痛いです。' },
    trigger: { p: 1, text: 'かぜをひいてからです。' },
  },
  exam: { ear: { p: 1, text: '{side}鼓膜の発赤と膨隆。光錐の消失。音叉で{side}伝音難聴（Weberは{side}に偏る）。' }, pharynx: { p: 0.5, text: '咽頭に軽い発赤。' }, facial: { p: 0, text: '' } },
  vitals: { T: { to: [37.6, 38.6], k: 1 } },
  natural: -0.05,
  therapies: [{ id: 'abx', label: '鎮痛、中等症以上はアモキシシリン', req: { coverage: ['spn', 'hinf'] }, effect: -0.4, lagH: 6, required: true, deadlineH: [24, 24, 24] }],
  useful: ['audiometry'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '急性中耳炎：外来で鎮痛・抗菌薬（改善しなければ耳鼻咽喉科で鼓膜切開）' }),
  teaching: [
    'かぜの後の耳痛・耳閉感・発熱、鼓膜の発赤と膨隆は急性中耳炎。音叉で伝音難聴。',
    '軽症は鎮痛で経過をみてもよい。中等症以上はアモキシシリン。',
    '耳の後ろの腫れ・顔面神経麻痺・めまい・強い頭痛は合併症（乳様突起炎・内耳炎・髄膜炎）を考える。',
    '成人で片側の滲出性中耳炎が続く場合は上咽頭がんを除外する。',
  ],
  sources: ['小児急性中耳炎診療ガイドライン2018（日本耳科学会ほか）'],
  ideal: () => [{ a: 'rx', drugId: 'ampc', route: 'po', dose: 500, freq: 'q8h', days: 5 }, { a: 'rx', drugId: 'apap_po', route: 'po', dose: 500, freq: 'q6h', days: 3 }],
});
