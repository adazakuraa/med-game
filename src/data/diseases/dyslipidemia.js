// 脂質異常症（高LDLコレステロール血症）
// 出典: 日本動脈硬化学会『動脈硬化性疾患予防ガイドライン2022年版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'dyslipidemia', name: '脂質異常症', dept: '内科', weight: 6,
  demo: { age: [45, 75], ageMode: 'uniform', male: 0.5 },
  smokeP: 0.35,
  comorb: { extra: { htn: 0.5, dm2: 0.3 } },
  vars: () => ({}),
  cc: () => '健診でコレステロールが高いと言われた', ccKey: 'checkup',
  history: {
    onset: { p: 1, text: '健診で悪玉コレステロールが高いと言われました。' },
    character: { p: 1, text: '症状は何もありません。' },
    family: { p: 1, text: '父が60歳で心筋梗塞になりました。' },
    diet: { p: 1, text: '揚げ物や肉が好きです。' },
    chestpain: { p: 1, text: '胸が痛くなることはありません。' },
    pmh: { p: 1, text: '高血圧と言われています。' },
    meds: { p: 1, text: '血圧の薬だけです。' },
  },
  exam: { skin: { p: 0.2, text: 'アキレス腱の肥厚・眼瞼黄色腫はない。' } },
  labs: { LDL: { add: [55, 85], k: 0 }, TG: { add: [20, 80], k: 0 } },
  natural: -0.003,
  therapies: [{ id: 'tx', label: 'リスク評価に基づく生活習慣の改善とスタチン', req: { tag: 'statin' }, effect: -0.3, lagH: 12, required: true, deadlineH: [24, 24, 24] }],
  useful: ['lipid', 'chem', 'hba1c', 'thyroid', 'ecg', 'ua'], key: [['lipid'], ['thyroid']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '脂質異常症：外来で生活指導とスタチン' }),
  teaching: [
    '脂質異常症の治療目標は、本人の動脈硬化性疾患のリスク（年齢・性別・喫煙・血圧・糖尿病・家族歴・既往）で決まる。',
    '二次性（甲状腺機能低下症・ネフローゼ症候群・糖尿病・薬剤）を除外する。アキレス腱の肥厚・若年の冠動脈疾患の家族歴があれば家族性高コレステロール血症を疑う。',
    '治療は食事（飽和脂肪酸を減らす）・運動・禁煙、必要ならスタチン。冠動脈疾患の既往があればLDL 70未満を目標にする。',
  ],
  sources: ['動脈硬化性疾患予防ガイドライン2022年版（日本動脈硬化学会）'],
  ideal: () => [{ a: 'test', ids: ['lipid', 'chem', 'hba1c', 'thyroid'] }, { a: 'rx', drugId: 'atorvastatin_rx', route: 'po', dose: 10, freq: 'q24h', days: 28 }],
});
