// 前庭神経炎
// 出典: 日本めまい平衡医学会『めまいの診断基準化のための資料』, 前庭神経炎の診断基準（2017）
import { outpatient } from './common.js';
export default outpatient({
  id: 'vestibular', name: '前庭神経炎', dept: '耳鼻咽喉科', weight: 3,
  demo: { age: [30, 65], ageMode: 'uniform', male: 0.5 },
  sev: { p: [0.4, 0.45, 0.15], burden: [[25, 32], [32, 40], [40, 48]] },
  vars: (rng) => ({ side: rng.pick(['右', '左']), other: '' }),
  postVars: (v) => { v.other = v.side === '右' ? '左' : '右'; },
  cc: () => 'めまい', ccKey: 'dizziness',
  history: {
    onset: { p: 1, text: '昨日の朝から急にぐるぐる回るめまいが起きて、ずっと続いています。' },
    course: { p: 1, text: '丸一日続いていて、少しずつ良くなっている気がします。' },
    character: { p: 1, text: '周りがぐるぐる回って、吐き気がします。' },
    vertigo: { p: 1, text: 'はい、ずっと回っています。' },
    positional: { p: 0.3, text: '動くと悪化しますが、じっとしていても回っています。' },
    hearing: { p: 0, text: '' },
    nausea: { p: 1, text: '何度か吐きました。' },
    sorethroat: { p: 0.5, text: '1週間前にかぜをひきました。' },
    headache: { p: 0, text: '' }, weakness: { p: 0, text: '' }, speechq: { p: 0, text: '' },
  },
  exam: { nystagmus: { p: 1, text: '{other}向きの一方向性の水平回旋混合性眼振（どこを見ても向きが変わらない：末梢性）。' }, ataxia: { p: 1, text: '指鼻試験は正常。支えれば何とか歩ける（{side}へ傾く）。' }, dix_hallpike: { p: 0, text: '' } },
  natural: -0.12,
  therapies: [{ id: 'antiemetic', label: '制吐薬と安静、早期からの離床（前庭リハビリ）', req: { anyTag: ['antiemetic'] }, effect: -0.3, lagH: 0.5, required: false, deadlineH: [6, 6, 6] }],
  dispo: (enc) => (enc.patient.sev >= 1 ? { ok: ['admit', 'home'], best: 'admit', why: '嘔吐で経口摂取ができない：入院で補液' } : { ok: ['home', 'admit'], best: 'home', why: '歩けて経口摂取できれば外来' }),
  useful: ['bs_poct', 'head_mri'], key: [],
  teaching: [
    'かぜの後などに、難聴を伴わない回転性めまいが1日以上持続し、一方向性の眼振があれば前庭神経炎。',
    '小脳梗塞との区別が重要：方向が変わる眼振・立てない（体幹失調）・神経症状・頭部インパルス試験が正常なら中枢性を疑いMRI。',
    '治療は制吐薬と、早めに体を動かす前庭リハビリ（ステロイドは症例による）。',
  ],
  sources: ['前庭神経炎の診断基準（日本めまい平衡医学会 2017）'],
  ideal: () => [{ a: 'test', ids: ['bs_poct'] }, { a: 'rx', drugId: 'mcp', route: 'iv', dose: 10, freq: 'q12h', days: 2 }],
});
