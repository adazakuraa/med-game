// 原発性副甲状腺機能亢進症
// 出典: 日本内分泌外科学会/日本甲状腺外科学会 資料, 日本内分泌学会「原発性副甲状腺機能亢進症」
import { outpatient } from './common.js';
export default outpatient({
  id: 'hyperpara', name: '原発性副甲状腺機能亢進症', dept: '内分泌代謝内科', weight: 2,
  demo: { age: [50, 75], ageMode: 'uniform', male: 0.25 },
  comorb: { extra: { htn: 0.4 } },
  vars: () => ({}),
  cc: () => '健診でカルシウムが高いと言われた', ccKey: 'checkup',
  history: {
    onset: { p: 1, text: '健診でカルシウムが高いと言われました。去年も少し高めでした。' },
    character: { p: 1, text: '最近、疲れやすく、のどが渇いて、おしっこが多い気がします。' },
    pmh: { p: 1, text: '3年前に尿管結石をしました。骨粗鬆症も指摘されています。' },
    meds: { p: 0, text: 'ビタミンDやカルシウムのサプリ、利尿薬は飲んでいません。' },
    weightgain: { p: 0, text: '' }, alcohol: { p: 0, text: '' }, smoking: { p: 0, text: '' }, diet: { p: 0, text: '' }, family: { p: 0, text: '家族に同じ病気の人はいません。' },
  },
  exam: { gen_appear: { p: 0, text: '全身状態良好。' }, neck_ln: { p: 0, text: '頸部に腫瘤を触れない。' } },
  labs: { CA: { add: [1.0, 1.8], k: 0 }, PHOS: { add: [-1.0, -0.5], k: 0 }, ALP: { add: [20, 80], k: 0 } },
  tests: { pth: [{ p: 1, persist: true, text: 'intact PTH 180 pg/mL（高値）。' }], neck_us: [{ p: 1, persist: true, text: '甲状腺左葉の下極の背側に1.5cmの低エコー結節（副甲状腺腺腫を疑う）。' }], dexa: [{ p: 1, text: '橈骨遠位端で骨密度低下（YAM 65%）。' }], abd_us: [{ p: 0.5, text: '右腎に5mmの結石。' }], ua: [{ p: 0.3, text: '潜血（±）。' }] },
  natural: -0.002,
  therapies: [{ id: 'endo', label: '内分泌内科/外科へ紹介：腺腫の局在診断（エコー・シンチ）と副甲状腺摘出術、水分摂取・骨粗鬆症の評価', req: { fn: (enc) => enc.consults.some((c) => ['endo', 'surgery'].includes(c.dept)) }, effect: -0.2, lagH: 12, required: true, deadlineH: [72, 72, 72] }],
  consult: { endo: '内分泌内科：高Ca血症・低リン血症とPTH高値で、原発性副甲状腺機能亢進症です。尿路結石と骨粗鬆症があり手術の適応なので、シンチで腺腫の場所を確認して、副甲状腺摘出術を外科に依頼します。脱水を避けて水分をとってください。' },
  useful: ['chem', 'pth', 'neck_us', 'dexa', 'abd_us', 'ua', 'ecg', 'cbc'], key: [['chem'], ['pth']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '原発性副甲状腺機能亢進症：外来で精査し、副甲状腺摘出術を予定' }),
  teaching: [
    '健診などで偶然見つかる高Ca血症の外来患者で最も多い原因。中高年女性に多い。「骨（骨粗鬆症）・石（尿路結石）・腹部症状・精神症状」。',
    '高Ca血症ではPTHを測る。PTH高値なら副甲状腺機能亢進症、PTH低値ならがん（PTHrP・骨転移）・ビタミンD・薬剤を考える。',
    '根治は腺腫の摘出術。結石・骨粗鬆症・腎障害・Ca高値があれば手術の適応。',
  ],
  sources: ['日本内分泌学会「原発性副甲状腺機能亢進症」'],
  ideal: () => [{ a: 'test', ids: ['chem', 'pth', 'neck_us', 'ecg'] }, { a: 'consult', dept: 'endo', delayMin: 1 }, { a: 'wait', min: 70 }],
});
