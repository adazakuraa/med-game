// 後部硝子体剥離（飛蚊症）
// 出典: 日本眼科学会 資料「飛蚊症」
import { outpatient } from './common.js';
export default outpatient({
  id: 'pvd', name: '後部硝子体剥離（飛蚊症）', dept: '眼科', weight: 4,
  demo: { age: [50, 70], ageMode: 'uniform', male: 0.45 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '黒い虫のようなものが見える', ccKey: 'vision',
  history: {
    onset: { p: 1, text: '3日前から、{side}目で黒い糸くずや虫のようなものが見えます。' },
    character: { p: 1, text: '目を動かすとふわふわ一緒に動きます。白い壁や空を見ると目立ちます。' },
    vision: { p: 1, text: '視力は落ちていません。カーテンがかかったように見えない部分はありません。' },
    trigger: { p: 0, text: '目をぶつけたりはしていません。' }, headache: { p: 0, text: '頭痛はありません。' }, jaw: { p: 0, text: '' }, weakness: { p: 0, text: '' }, speechq: { p: 0, text: '' },
    pmh: { p: 0, text: '強い近視はありません。目の手術も受けていません。' }, meds: { p: 0, text: '' },
  },
  exam: { eye: { p: 0, text: '結膜充血なし。' }, pupils: { p: 0, text: '瞳孔・対光反射は正常。' } },
  tests: { fundus: [{ p: 1, persist: true, text: '{side}眼に後部硝子体剥離（Weiss ring）。網膜裂孔・網膜剥離・硝子体出血なし。' }], acuity: [{ p: 1, text: '両眼 1.0（正常）。', normal: true }] },
  natural: -0.02,
  therapies: [{ id: 'eye', label: '散瞳眼底検査で網膜裂孔・剥離を除外し、症状が急に増えた・視野が欠けたらすぐ受診するよう説明', req: { fn: (enc) => enc.tests.some((t) => t.id === 'fundus' && t.done) || enc.consults.some((c) => c.dept === 'eye') }, effect: -0.3, lagH: 1, required: true, deadlineH: [48, 48, 48] }],
  useful: ['fundus', 'acuity', 'slit', 'oct'], key: [['fundus']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '後部硝子体剥離（裂孔なし）：経過観察（飛蚊症の急増・視野欠損があればすぐ受診）' }),
  teaching: [
    '中高年の急な飛蚊症（目を動かすと一緒に動く黒い点・糸くず）は多くが加齢による後部硝子体剥離で、それ自体は治療不要。',
    'ただし網膜裂孔・網膜剥離・硝子体出血を伴うことがあるので、散瞳して眼底を確認する。',
    '飛蚊症の急な増加・光視症・カーテンがかかったような視野欠損は網膜剥離のサインで、すぐ受診するよう説明する。',
  ],
  sources: ['日本眼科学会「飛蚊症」'],
  ideal: () => [{ a: 'test', ids: ['acuity', 'fundus'] }, { a: 'wait', min: 30 }],
});
