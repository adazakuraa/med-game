// 一過性全健忘
// 出典: 日本神経学会 資料, Hodges JR, Warlow CP. J Neurol Neurosurg Psychiatry 1990（診断基準）
import { outpatient } from './common.js';
export default outpatient({
  id: 'tga', name: '一過性全健忘', dept: '脳神経内科', weight: 2,
  demo: { age: [55, 75], ageMode: 'uniform', male: 0.5 },
  comorb: { extra: { htn: 0.3 } },
  vars: (rng) => ({ ev: rng.pick(['冷たいプールに入った後', '重い荷物を運んだ後', '親戚と激しい口論をした後']) }),
  cc: () => '急に同じことを何度も聞く', ccKey: 'memory',
  arrival: () => 'walk',
  history: {
    onset: { p: 1, text: '（妻）2時間前、{ev}から急に「今日は何日？」「ここはどこ？」と同じことを何度も聞くようになりました。' },
    course: { p: 1, text: '（妻）少しずつ落ち着いてきました。自分の名前や家族のことは分かっています。' },
    memory: { p: 1, text: '（本人）ここに来るまでのことが思い出せません。さっき聞いたことも、すぐ忘れてしまいます。' },
    trigger: { p: 1, text: '（妻）{ev}でした。' },
    headache: { p: 0, text: '頭痛はありません。' }, weakness: { p: 0, text: '手足の力は普段どおりです。' }, speechq: { p: 0, text: 'ろれつは回ります。' },
    seizure: { p: 0, text: '（妻）けいれんはありませんでした。' }, alcohol: { p: 0, text: 'お酒はたまに飲む程度です。' },
    meds: { p: 0, text: '睡眠薬は飲んでいません。' }, adl: { p: 1, text: '（妻）普段は仕事も家事も問題なくしています。' }, pmh: { p: 0, text: '物忘れを指摘されたことはありません。' },
  },
  exam: { gen_consc: { p: 1, text: '意識清明。名前・生年月日は言える。今日の日付と、ここ数時間のことが思い出せない。新しく覚えたことを数分で忘れる。' }, motor: { p: 1, text: '麻痺なし。' }, speech: { p: 1, text: '構音障害・失語なし。' }, facial: { p: 0, text: '顔面の左右差なし。' } },
  tests: { head_ct: [{ p: 1, text: '頭蓋内に出血・梗塞を認めない。', normal: true }], head_mri: [{ p: 0.3, text: '海馬に数mmの点状のDWI高信号（一過性全健忘に特徴的、梗塞ではない）。' }], eeg: [{ p: 1, text: 'てんかん性放電なし。', normal: true }] },
  natural: -0.6,
  therapies: [{ id: 'eval', label: '脳卒中・低血糖・てんかんの除外（神経所見・血糖・頭部画像）と、24時間以内に治ることの説明', req: { fn: (enc) => enc.tests.some((t) => ['bs_poct', 'chem'].includes(t.id) && t.done) && enc.tests.some((t) => ['head_ct', 'head_mri'].includes(t.id) && t.done) }, effect: -0.3, lagH: 0.3, required: true, deadlineH: [4, 4, 4] }],
  useful: ['bs_poct', 'head_ct', 'head_mri', 'ecg', 'chem', 'cbc', 'eeg'], key: [['bs_poct', 'chem'], ['head_ct', 'head_mri']],
  dispo: () => ({ ok: ['home', 'admit'], best: 'home', why: '一過性全健忘：危険な疾患を除外し、記憶が戻るまで家族と過ごせば帰宅可（再発はまれ）' }),
  teaching: [
    '中高年が急に新しいことを覚えられなくなり同じ質問を繰り返すが、自分が誰かは分かり、ほかの神経症状がない → 一過性全健忘。冷水・力仕事・強い感情がきっかけになる。',
    '24時間以内（多くは数時間）に治り、発作中の記憶は戻らない。再発はまれで予後は良い。',
    '脳卒中（後大脳動脈領域）・低血糖・てんかん（一過性てんかん性健忘）・薬物を除外する。',
  ],
  sources: ['Hodges JR, Warlow CP. Syndromes of transient amnesia. J Neurol Neurosurg Psychiatry 1990'],
  ideal: () => [{ a: 'test', ids: ['bs_poct', 'head_ct', 'ecg'] }, { a: 'wait', min: 120 }],
});
