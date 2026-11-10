// 脂肪肝（MASLD/NAFLD）
// 出典: 日本消化器病学会/日本肝臓学会『NAFLD/NASH診療ガイドライン2020（改訂第2版）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'nafld', name: '脂肪肝（代謝機能障害関連脂肪性肝疾患）', dept: '消化器内科', weight: 5,
  demo: { age: [35, 65], ageMode: 'uniform', male: 0.65 },
  comorb: { extra: { htn: 0.4, dm2: 0.3, dyslip: 0.5 } },
  vars: (rng) => ({ kg: rng.int(8, 15) }),
  cc: () => '健診で肝臓の数値が高いと言われた', ccKey: 'checkup',
  history: {
    onset: { p: 1, text: '健診で、肝臓の数値（AST・ALT）が高いと言われました。' },
    character: { p: 1, text: '特に症状はありません。' },
    weightgain: { p: 1, text: '社会人になってから{kg}kg太りました。運動はほとんどしていません。' },
    alcohol: { p: 1, text: 'お酒は週に1〜2回、ビール1缶くらいです。' },
    meds: { p: 1, text: 'サプリや市販薬は飲んでいません。' },
    pmh: { p: 1, text: '肝炎と言われたことはありません。輸血歴もありません。' },
    diet: { p: 1, text: '夜遅くにラーメンや甘いものを食べることが多いです。' },
    fatigue: { p: 0, text: '' },
  },
  exam: { gen_appear: { p: 1, text: '腹部肥満（腹囲 98cm）。黄疸・くも状血管腫はない。' }, abd_palp: { p: 0.3, text: '肝臓を右季肋下に1横指触れる。圧痛なし。' } },
  labs: { AST: { add: [15, 35], k: 0 }, ALT: { add: [30, 60], k: 0 }, GGT: { add: [20, 60], k: 0 }, TG: { add: [60, 150], k: 0 }, GLU: { add: [5, 20], k: 0 } },
  tests: { abd_us: [{ p: 1, persist: true, text: '肝実質のエコー輝度が上昇し、肝腎コントラスト陽性（脂肪肝）。肝表面は平滑。脾腫なし。' }] },
  natural: -0.003,
  therapies: [{ id: 'tx', label: '生活習慣の改善（7%以上の減量・運動・食事）の指導と、合併する糖尿病・脂質異常症の治療', req: { fn: (enc) => enc.tests.some((t) => t.id === 'abd_us') }, effect: -0.2, lagH: 6, required: true, deadlineH: [24, 24, 24] }],
  useful: ['chem', 'lipid', 'abd_us', 'cbc', 'hba1c', 'coag'], key: [['abd_us'], ['cbc']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '脂肪肝：外来で生活習慣の改善指導。線維化が疑われれば（FIB-4指数が高い・血小板低下）消化器内科へ' }),
  teaching: [
    '肥満・糖尿病・脂質異常症に伴う肝機能異常（ALT優位）は脂肪肝（MASLD）が最も多い。エコーで肝腎コントラスト。',
    'ウイルス肝炎（HBs抗原・HCV抗体）・アルコール・薬剤・自己免疫性肝炎を除外する。',
    'FIB-4指数（年齢・AST・ALT・血小板）で肝線維化を評価し、高ければ専門医へ（肝硬変・肝がんへの進行）。',
    '治療の基本は7%以上の減量・運動・食事改善。合併する糖尿病・脂質異常症を治療する。',
  ],
  sources: ['NAFLD/NASH診療ガイドライン2020（日本消化器病学会/日本肝臓学会）'],
  ideal: () => [{ a: 'test', ids: ['chem', 'lipid', 'cbc', 'abd_us', 'hba1c'] }],
});
