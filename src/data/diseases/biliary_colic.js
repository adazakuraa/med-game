// 胆石発作（胆石疝痛）
// 出典: 日本消化器病学会『胆石症診療ガイドライン2021（改訂第3版）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'biliary_colic', name: '胆石発作（胆石疝痛）', dept: '消化器内科', weight: 5,
  demo: { age: [30, 75], ageMode: 'uniform', male: 0.4 },
  comorb: { extra: { dyslip: 0.3, dm2: 0.15 } },
  vars: (rng) => ({ hrs: rng.int(1, 4) }),
  cc: () => 'みぞおちから右上腹部の痛み', ccKey: 'abd_pain',
  history: {
    onset: { p: 1, text: '昨晩、焼肉を食べた2時間後から、みぞおちから右の上腹部が痛くなりました。' },
    course: { p: 1, text: '{hrs}時間くらい強く痛みましたが、今はだいぶ治まってきました。' },
    character: { p: 1, text: 'ギューッと締め付けられるような強い痛みでした。' },
    location: { p: 1, text: 'みぞおちから右のあばらの下あたりです。' },
    radiation: { p: 0.6, text: '右の肩や背中のほうにも響きました。' },
    trigger: { p: 1, text: '脂っこいものを食べた後です。以前にも何回か同じようなことがありました。' },
    nausea: { p: 0.7, text: '吐き気がして1回吐きました。' },
    fever: { p: 0, text: '' }, chills: { p: 0, text: '' }, diarrhea: { p: 0, text: '' }, migration: { p: 0, text: '' },
  },
  exam: { abd_palp: { p: 0.6, text: '右季肋部に軽い圧痛。腹膜刺激徴候なし。' }, murphy: { p: 0.1, text: 'Murphy徴候ははっきりしない。' } },
  labs: {},
  tests: { abd_us: [{ p: 0.95, persist: true, text: '胆嚢内に音響陰影を伴う結石（約1.5cm）が多数。胆嚢壁の肥厚なし、胆嚢腫大なし、胆管拡張なし。' }], abd_ct_plain: [{ p: 0.6, persist: true, text: '胆嚢内に石灰化した結石。胆嚢周囲の炎症所見なし。' }] },
  natural: -0.4,
  therapies: [{ id: 'pain', label: '鎮痛（NSAIDs・ブチルスコポラミン）', req: { anyTag: ['analgesic', 'antispasmodic'] }, effect: -1.5, lagH: 0.3, required: true, deadlineH: [2, 2, 1] }],
  useful: ['abd_us', 'cbc', 'chem', 'crp', 'ua', 'uhcg', 'ecg', 'lab_AMY', 'abd_ct_plain'], key: [['abd_us'], ['cbc', 'crp']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '胆石発作：痛みが治まり発熱・炎症反応がなければ帰宅。脂肪の多い食事を控え、繰り返すなら外科で待機的胆嚢摘出術を相談' }),
  teaching: [
    '脂っこい食事の後のみぞおち〜右季肋部の締め付けられる痛みで、数時間で治まるのは胆石発作（胆石疝痛）。',
    '発熱・Murphy徴候・白血球/CRP上昇・胆嚢壁肥厚があれば急性胆嚢炎、黄疸・肝胆道系酵素上昇・胆管拡張があれば総胆管結石・胆管炎を考える。',
    '腹部超音波が第一選択（結石・胆嚢壁・胆管径）。心窩部痛では心筋梗塞（心電図）も除外する。',
    '治療は鎮痛（NSAIDs）。繰り返す有症状の胆石は待機的に腹腔鏡下胆嚢摘出術を検討する。',
  ],
  sources: ['胆石症診療ガイドライン2021（日本消化器病学会）'],
  ideal: () => [{ a: 'test', ids: ['abd_us', 'cbc', 'crp', 'chem'] }, { a: 'rx', drugId: 'loxo', route: 'po', dose: 60, freq: 'prn', days: 3 }],
});
