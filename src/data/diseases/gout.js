// 痛風発作
// 出典: 日本痛風・尿酸核酸学会『高尿酸血症・痛風の治療ガイドライン 第3版（2019）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'gout', name: '痛風発作', weight: 6, season: { summer: 1.2 },
  demo: { age: [30, 75], ageMode: 'uniform', male: 0.95 },
  comorb: { extra: { htn: 0.4, dyslip: 0.4, ckd: 0.1 } },
  vars: (rng, sev, pt) => ({ side: rng.pick(['右', '左']), uric: rng.range(6.5, 9.5) }),
  cc: () => '足の親指の付け根の激痛', ccKey: 'joint_pain',
  history: {
    onset: { p: 1, text: '昨晩、寝ていたら急に{side}足の親指の付け根が痛くなりました。' },
    character: { p: 1, text: '赤く腫れて、風が当たっても痛いくらいです。' },
    location: { p: 1, text: '{side}足の親指の付け根です。' },
    joint: { p: 1, text: '{side}足の親指の付け根が赤く腫れて、ものすごく痛いです。' },
    severity: { p: 1, text: '9くらいです。歩けません。' },
    trigger: { p: 0.8, text: '昨日の夜、ビールをたくさん飲みました。' },
    pmh: { p: 0.6, text: '健診で尿酸値が高いと言われていました。' },
    fever: { p: 0.2, text: '少し熱っぽいです。' },
    alcohol: { p: 1, text: 'ビールが好きで、毎晩飲みます。' },
  },
  exam: { joint: { p: 1, text: '{side}第1中足趾節関節（親指の付け根）の著明な腫脹・発赤・熱感・圧痛。' } },
  vitals: { T: { to: [37.2, 37.8], k: 1 } },
  labs: { CRP: { to: [2, 8], k: 1 }, WBC: { to: [9000, 12000], k: 1 } },
  labHook: (enc, id, v) => (id === 'URIC' ? enc.patient.vars.uric : v),
  natural: -0.15,
  therapies: [{ id: 'nsaid', label: 'NSAIDs（またはコルヒチン・ステロイド）', req: { anyTag: ['nsaid', 'colchicine', 'steroid_sys'] }, effect: -1.5, lagH: 1, required: true, deadlineH: [6, 6, 6] }],
  useful: ['cbc', 'chem', 'crp'], key: [],
  teaching: [
    '中年男性の第1中足趾節関節（足の親指の付け根）に夜間突然起こる激痛・発赤・腫脹は痛風発作が典型。飲酒・肉食・脱水が誘因。',
    '発作中は血清尿酸値が正常のこともある。確定は関節液中の尿酸結晶。',
    '発作の治療はNSAIDs（腎機能・潰瘍に注意）、コルヒチン、ステロイド。発作中に尿酸降下薬を新たに始めない。',
    '発熱を伴う単関節炎では化膿性関節炎を必ず考える（関節穿刺）。',
  ],
  sources: ['高尿酸血症・痛風の治療ガイドライン 第3版（日本痛風・尿酸核酸学会 2019）'],
  ideal: (p) => [{ a: 'test', ids: ['chem'] }, { a: 'rx', drugId: p.comorb.includes('pud') || p.allergies.includes('nsaid') || p.comorb.includes('asthma_nsaid') ? 'prednisolone' : 'loxo', route: 'po', dose: p.comorb.includes('pud') || p.allergies.includes('nsaid') || p.comorb.includes('asthma_nsaid') ? 30 : 60, freq: p.comorb.includes('pud') || p.allergies.includes('nsaid') || p.comorb.includes('asthma_nsaid') ? 'q24h' : 'q8h', days: 5 }],
});
