// メニエール病
// 出典: 日本めまい平衡医学会『メニエール病・遅発性内リンパ水腫診療ガイドライン2020年版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'meniere', name: 'メニエール病', dept: '耳鼻咽喉科', weight: 4,
  demo: { age: [30, 65], ageMode: 'uniform', male: 0.4 },
  vars: (rng) => ({ side: rng.pick(['右', '左']), hrs: rng.int(1, 4) }),
  cc: () => 'めまいと耳鳴り', ccKey: 'dizziness',
  history: {
    onset: { p: 1, text: '{hrs}時間ほど前から、ぐるぐる回るめまいがしています。' },
    course: { p: 1, text: '少しずつ治まってきました。これまでにも何回か同じことがあり、半日くらいで治りました。' },
    character: { p: 1, text: '周りがぐるぐる回ります。頭を動かさなくても続いていました。' },
    vertigo: { p: 1, text: 'はい、ぐるぐる回ります。' },
    hearing: { p: 1, text: '{side}の耳が聞こえにくく、ゴーッという耳鳴りと、耳が詰まった感じがあります。' },
    nausea: { p: 0.9, text: '気持ち悪くて2回吐きました。' },
    positional: { p: 0.1, text: '頭を動かすと少し強くなりますが、じっとしていても回ります。' },
    trigger: { p: 0.6, text: '最近仕事が忙しく、寝不足でストレスがたまっていました。' },
    headache: { p: 0, text: '' }, weakness: { p: 0, text: '' }, speechq: { p: 0, text: '' }, sorethroat: { p: 0, text: '' },
  },
  exam: {
    nystagmus: { p: 0.8, text: '水平性の眼振（一方向性）。注視方向で向きは変わらない。' },
    dix_hallpike: { p: 0.1, text: 'Dix-Hallpike試験で回旋性眼振は誘発されない。' },
  },
  natural: -0.15,
  therapies: [{ id: 'sx', label: '対症療法（制吐薬・抗めまい薬）と生活指導・耳鼻科での聴力検査', req: { anyTag: ['antiemetic', 'antivertigo'] }, effect: -0.3, lagH: 1, required: true, deadlineH: [6, 6, 6] }],
  useful: ['bs_poct', 'ecg'], key: [],
  teaching: [
    'メニエール病：難聴・耳鳴り・耳閉感を伴う、数十分〜数時間の回転性めまいを繰り返す（内リンパ水腫）。',
    '頭位で数十秒のめまいならBPPV、1日以上続き難聴がなければ前庭神経炎、神経症状・体幹失調があれば小脳梗塞を考える。',
    '発作時は安静・制吐薬・抗めまい薬。耳鼻咽喉科で聴力検査を行い、ストレス・睡眠不足を避ける生活指導、浸透圧利尿薬などを検討する。',
    '突然の難聴だけなら突発性難聴（早期のステロイド）も鑑別。',
  ],
  sources: ['メニエール病・遅発性内リンパ水腫診療ガイドライン2020年版（日本めまい平衡医学会）'],
  ideal: () => [{ a: 'rx', drugId: 'mcp', route: 'iv', dose: 10, freq: 'once', days: 1 }, { a: 'rx', drugId: 'betahistine', route: 'po', dose: 12, freq: 'q8h', days: 7 }],
});
