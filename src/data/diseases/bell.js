// ベル麻痺（特発性末梢性顔面神経麻痺）
// 出典: 日本顔面神経学会『顔面神経麻痺診療ガイドライン2023』
import { outpatient } from './common.js';
export default outpatient({
  id: 'bell', name: 'ベル麻痺', dept: '耳鼻咽喉科', weight: 4,
  demo: { age: [20, 75], ageMode: 'uniform', male: 0.5 },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '顔がゆがむ', ccKey: 'facial_palsy',
  history: {
    onset: { p: 1, text: '今朝起きたら、{side}の顔が動かしにくくなっていました。' },
    character: { p: 1, text: '{side}の口から水がこぼれて、目が閉じにくいです。' },
    lastnormal: { p: 1, text: '昨晩寝る前は普通でした。' },
    weakness: { p: 0, text: '' },
    speechq: { p: 0.3, text: '口が動かしにくいだけで、言葉は普通に出ます。' },
    hearing: { p: 0.2, text: '{side}耳が音に敏感な感じがします。' },
    rash: { p: 0, text: '' },
    headache: { p: 0.2, text: '{side}耳の後ろが少し痛みました。' },
  },
  exam: { facial: { p: 1, text: '{side}の額のしわ寄せができず、閉眼も不完全。口角下垂（末梢性顔面神経麻痺：額も動かない）。' }, motor: { p: 0, text: '' }, speech: { p: 0, text: '' } },
  natural: -0.1,
  therapies: [{ id: 'steroid', label: 'ステロイド（プレドニゾロン）の早期投与', req: { anyTag: ['steroid_sys'] }, effect: -0.2, lagH: 24, required: true, deadlineH: [72, 72, 72] }],
  useful: ['bs_poct'], key: [],
  teaching: [
    '急に片側の顔が動かなくなったら、まず脳卒中との区別：額のしわ寄せもできなければ末梢性（ベル麻痺など）、額が動けば中枢性（脳卒中）を疑う。',
    '耳の痛み・耳介の水疱・難聴・めまいがあればRamsay Hunt症候群（帯状疱疹ウイルス）で抗ウイルス薬も使う。',
    'ベル麻痺は発症72時間以内のステロイド（プレドニゾロン）で回復率が上がる。閉眼できない目の保護（点眼・眼帯）も大切。',
  ],
  sources: ['顔面神経麻痺診療ガイドライン2023（日本顔面神経学会）'],
  ideal: () => [{ a: 'rx', drugId: 'prednisolone', route: 'po', dose: 60, freq: 'q24h', days: 5 }],
});
