// 智歯周囲炎（親知らずの炎症）
// 出典: 日本口腔外科学会 資料, JAID/JSC感染症治療ガイド（歯性感染症）
import { outpatient } from './common.js';
export default outpatient({
  id: 'pericoronitis', name: '智歯周囲炎', dept: '歯科口腔外科', weight: 3,
  demo: { age: [18, 35], ageMode: 'young', male: 0.5 },
  organisms: ['gpc', 'anaerobe'], minAbxDays: 3, untreatedFatal: false,
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '奥歯の歯ぐきが腫れて痛い', ccKey: 'oral',
  history: {
    onset: { p: 1, text: '3日前から{side}下の一番奥の歯ぐきが腫れて痛みます。' },
    character: { p: 1, text: '口を開けにくく、飲み込むと少し痛いです。' },
    fever: { p: 0.5, text: '37.5度くらいの微熱があります。' },
    trigger: { p: 1, text: '疲れていました。以前にも同じところが腫れたことがあります。' },
    dyspnea: { p: 0, text: '息苦しさはありません。' },
  },
  exam: { oral_mucosa: { p: 1, text: '{side}下顎の半埋伏智歯の周囲の歯肉が発赤・腫脹し、圧迫で排膿。軽度の開口障害（2横指）。口腔底・頬の腫脹はない。' }, neck_ln: { p: 0.7, text: '{side}顎下リンパ節の腫脹・圧痛。' } },
  natural: 0.02,
  therapies: [{ id: 'abx', label: '抗菌薬（アモキシシリンなど）と鎮痛、局所の洗浄、炎症が治まってから抜歯', req: { coverage: ['gpc', 'anaerobe'] }, effect: -0.5, lagH: 6, required: true, deadlineH: [24, 24, 24] }],
  useful: ['cbc', 'crp'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '智歯周囲炎：抗菌薬で外来治療、歯科口腔外科で抜歯を相談' }),
  teaching: [
    '親知らず（特に下顎の半埋伏智歯）の周囲の歯肉の腫れ・痛み・排膿・開口障害は智歯周囲炎。',
    '口腔底の腫れ・嚥下困難・呼吸困難・頸部の腫脹があれば、深頸部感染（口底蜂窩織炎・Ludwig angina）として緊急対応。',
    '治療は抗菌薬（アモキシシリン、嫌気性菌も考える）・鎮痛・洗浄。繰り返すなら抜歯。',
  ],
  sources: ['日本口腔外科学会 資料', 'JAID/JSC感染症治療ガイド'],
  ideal: () => [{ a: 'rx', drugId: 'amox_clav', route: 'po', dose: 375, freq: 'q8h', days: 5 }, { a: 'rx', drugId: 'loxo', route: 'po', dose: 60, freq: 'q8h', days: 5 }],
});
