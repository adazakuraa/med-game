// 多嚢胞性卵巣症候群
// 出典: 日本産科婦人科学会『多嚢胞性卵巣症候群の診断基準2024』
import { outpatient } from './common.js';
export default outpatient({
  id: 'pcos', name: '多嚢胞性卵巣症候群', dept: '産婦人科', weight: 3,
  demo: { age: [18, 35], ageMode: 'young', male: 0 },
  noPregnancy: true,
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '生理が不規則で来ない', ccKey: 'menstrual',
  history: {
    onset: { p: 1, text: '高校生のころから生理が不規則で、2〜3か月に1回しか来ません。' },
    menses: { p: 1, text: '最近は3か月来ていません。' },
    character: { p: 1, text: 'ニキビが多く、口の周りの毛が濃いのが気になります。' },
    weightgain: { p: 1, text: 'この2年で8kg太りました。' },
    lmp: { p: 1, text: '最終月経は3か月前です。' },
    heatcold: { p: 0, text: '暑がり・寒がりはありません。' },
    weightloss: { p: 0, text: '' }, mood: { p: 0, text: '' }, meds: { p: 0, text: '' },
    pmh: { p: 1, text: '持病はありません。結婚して、将来妊娠を希望しています。' },
  },
  exam: { skin: { p: 1, text: '顔のざ瘡と、口周り・下腹部の多毛。首の後ろの黒ずみ（黒色表皮腫）。' } },
  labs: { GLU: { add: [5, 15], k: 0 } },
  tests: { tvus: [{ p: 1, persist: true, text: '両側卵巣に小さな卵胞が多数（ネックレスサイン）、卵巣は腫大。子宮内に胎嚢なし。' }], hormone: [{ p: 1, persist: true, text: 'LH高値（LH>FSH）、テストステロン軽度高値、プロラクチン正常。' }] },
  natural: -0.002,
  therapies: [{ id: 'gyn', label: '産婦人科へ紹介：妊娠希望に応じた治療（排卵誘発・月経調整）と減量・耐糖能の評価', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'obgyn') }, effect: -0.2, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  consult: { obgyn: '産婦人科：月経異常・多嚢胞性卵巣・LH高値から多嚢胞性卵巣症候群です。妊娠を希望されているので、減量と排卵誘発を検討します。糖尿病・脂質異常症・子宮内膜増殖症のリスクにも注意します。' },
  useful: ['uhcg', 'tvus', 'hormone', 'thyroid', 'hba1c', 'lipid'], key: [['uhcg'], ['hormone']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '多嚢胞性卵巣症候群：婦人科外来で治療' }),
  teaching: [
    '月経不順（稀発月経・無月経）・多毛・ニキビ・肥満で、エコーで多数の小卵胞があれば多嚢胞性卵巣症候群。不妊の原因として多い。',
    '無月経では必ず妊娠反応から。甲状腺疾患・高プロラクチン血症・やせ（摂食障害）・早発卵巣不全も鑑別。',
    'インスリン抵抗性（糖尿病・脂質異常症）や子宮内膜増殖症のリスクがあるので長期的に管理する。',
  ],
  sources: ['多嚢胞性卵巣症候群の診断基準2024（日本産科婦人科学会）'],
  ideal: () => [{ a: 'test', ids: ['uhcg', 'tvus', 'hormone', 'thyroid'] }, { a: 'consult', dept: 'obgyn', delayMin: 1 }, { a: 'wait', min: 70 }],
});
