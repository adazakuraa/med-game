// 本態性高血圧症（健診で指摘）
// 出典: 日本高血圧学会『高血圧治療ガイドライン2019（JSH2019）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'htn', name: '本態性高血圧症', weight: 6,
  demo: { age: [40, 75], ageMode: 'uniform', male: 0.55 },
  comorb: { extra: { dyslip: 0.4 } },
  sev: { p: [0.6, 0.35, 0.05], burden: [[15, 20], [20, 26], [26, 32]] },
  vars: (rng, sev) => ({ sbp: [150, 165, 182][sev] + rng.int(0, 8) }),
  cc: () => '健診で血圧が高いと言われた', ccKey: 'bp_high',
  history: {
    onset: { p: 1, text: '会社の健診で血圧が高いと言われ、受診するよう言われました。' },
    character: { p: 1, text: '特に症状はありません。' },
    headache: { p: 0.2, text: '時々、朝に頭が重いことがあります。' },
    family: { p: 0.8, text: '父も母も高血圧です。' },
    diet: { p: 1, text: '味の濃いものが好きで、ラーメンのスープは全部飲みます。' },
    alcohol: { p: 0.6, text: '毎晩ビールを2缶飲みます。' },
    weightgain: { p: 0.5, text: 'この10年で10kg太りました。' },
    chestpain: { p: 0, text: '' }, dyspnea: { p: 0, text: '' }, weakness: { p: 0, text: '' },
  },
  exam: {},
  vitals: { SBP: { to: [0, 0], custom: true } },
  customVitals: (enc) => ({ SBP: enc.patient.vars.sbp - (enc.orders.some((o) => o.drugId === 'amlodipine_rx') ? 0 : 0) }),
  natural: 0,
  therapies: [{ id: 'lifestyle', label: '生活習慣の修正（減塩6g未満・減量・節酒・運動）と、必要なら降圧薬', req: { anyTag: ['antihtn'] }, effect: -1, lagH: 24, required: (enc) => enc.patient.sev >= 1, deadlineH: [99, 168, 24] }],
  dynamics: (enc) => (enc.patient.sev === 0 ? -0.08 : 0),
  useful: ['ecg', 'chem', 'ua', 'cbc', 'hba1c', 'cxr', 'echo'], key: [['ecg'], ['chem'], ['ua']],
  teaching: [
    '高血圧は自覚症状がないことがほとんど。診察室血圧140/90以上（家庭血圧135/85以上）で診断。家庭血圧の測定を勧める。',
    '初診時は臓器障害（心電図・尿蛋白・腎機能・眼底）と、ほかのリスク（糖尿病・脂質異常・喫煙）を評価する。',
    '若年発症・急な悪化・低K血症などがあれば二次性高血圧（原発性アルドステロン症・腎血管性・睡眠時無呼吸など）を考える。',
    'まず生活習慣の修正（減塩6g/日未満・減量・節酒・運動）。リスクが高い・160/100以上なら降圧薬（Ca拮抗薬・ARB/ACE阻害薬・利尿薬）。',
    '頭痛・胸痛・神経症状・視力障害を伴う著明な高血圧は高血圧緊急症。',
  ],
  sources: ['高血圧治療ガイドライン2019（日本高血圧学会）'],
  ideal: (p) => [{ a: 'test', ids: ['ecg', 'chem', 'ua'] }, { a: 'rx', drugId: 'amlodipine_rx', route: 'po', dose: 5, freq: 'q24h', days: 14, when: 'sev>=1' }],
});
