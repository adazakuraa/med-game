// 原発性アルドステロン症
// 出典: 日本内分泌学会『わが国の原発性アルドステロン症の診療に関するコンセンサス・ステートメント2021』, 高血圧治療ガイドライン2019
import { outpatient } from './common.js';
export default outpatient({
  id: 'primary_aldo', name: '原発性アルドステロン症', dept: '内分泌代謝内科', weight: 3,
  demo: { age: [35, 60], ageMode: 'uniform', male: 0.5 },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '血圧が下がらない', ccKey: 'bp_high',
  history: {
    onset: { p: 1, text: '3年前から血圧が高く、薬を3種類飲んでいますが150〜160台です。' },
    character: { p: 1, text: '特に症状はありませんが、最近足がつりやすく、だるいです。' },
    weakness: { p: 0.5, text: '時々、手足に力が入りにくいです。' },
    meds: { p: 1, text: 'アムロジピン、利尿薬、ARBを飲んでいます。きちんと飲んでいます。' },
    adherence: { p: 1, text: '毎日きちんと飲んでいます。' },
    snore: { p: 0, text: 'いびきは言われません。' },
    alcohol: { p: 1, text: 'お酒は少しです。' },
    family: { p: 0, text: '' }, diet: { p: 1, text: '減塩は心がけています。' },
    headache: { p: 0, text: '' }, palpitation: { p: 0, text: '' }, sweating: { p: 0, text: '' },
  },
  exam: {},
  vitals: { SBP: { to: [158, 168], k: 0 } },
  labs: { K: { add: [-0.9, -0.5], k: 0 }, HCO3: { add: [2, 4], k: 0 }, NA: { add: [1, 3], k: 0 } },
  tests: { renin_aldo: [{ p: 1, persist: true, text: '血漿アルドステロン濃度 250 pg/mL、レニン活性 0.2 ng/mL/時（ARR 1250：スクリーニング陽性）。' }], abd_ct_contrast: [{ p: 0.6, persist: true, text: '左副腎に1.5cmの腺腫。' }] },
  natural: -0.002,
  therapies: [{ id: 'tx', label: '内分泌内科で確認検査・副腎静脈サンプリング（片側性なら手術、両側性ならミネラルコルチコイド受容体拮抗薬）', req: { fn: (enc, eff) => (eff.tags.mra || 0) > 0 || enc.consults.some((c) => c.dept === 'endo') }, effect: -0.3, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  useful: ['chem', 'renin_aldo', 'vbg', 'ecg', 'ua', 'abd_ct_contrast', 'thyroid'], key: [['chem'], ['renin_aldo']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '原発性アルドステロン症の疑い：内分泌内科外来で精査' }),
  teaching: [
    '原発性アルドステロン症は二次性高血圧で最も多く、高血圧の5〜10%。治療抵抗性高血圧・低K血症・若年発症・副腎腫瘍では必ずスクリーニング（アルドステロン/レニン比）。',
    '低K血症は半数以下にしか見られない（Kが正常でも否定できない）。',
    '片側性（腺腫）なら腹腔鏡下副腎摘出術で治る可能性がある。両側性ならミネラルコルチコイド受容体拮抗薬。',
    'ほかの二次性高血圧：睡眠時無呼吸、腎血管性、褐色細胞腫、クッシング症候群、甲状腺疾患、薬剤（NSAIDs・甘草）。',
  ],
  sources: ['わが国の原発性アルドステロン症の診療に関するコンセンサス・ステートメント2021（日本内分泌学会）'],
  ideal: () => [{ a: 'test', ids: ['chem', 'renin_aldo', 'ecg'] }, { a: 'consult', dept: 'endo', delayMin: 1 }, { a: 'wait', min: 70 }],
});
