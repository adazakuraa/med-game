// Ramsay Hunt症候群（耳性帯状疱疹）
// 出典: 日本顔面神経学会『顔面神経麻痺診療ガイドライン2023年版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'ramsay_hunt', name: 'Ramsay Hunt症候群', dept: '耳鼻咽喉科', weight: 2,
  demo: { age: [40, 80], ageMode: 'uniform', male: 0.5 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '顔のゆがみと耳の痛み', ccKey: 'facial_palsy',
  history: {
    onset: { p: 1, text: '3日前から{side}耳が痛く、今朝{side}の顔が動かなくなりました。' },
    character: { p: 1, text: '水を飲むと口からこぼれ、{side}目が閉じにくいです。' },
    hearing: { p: 1, text: '{side}耳が聞こえにくく、耳鳴りもします。' },
    rash: { p: 1, text: '{side}耳に小さな水ぶくれができています。' },
    weakness: { p: 0, text: '手足の麻痺はありません。' }, speechq: { p: 0, text: '' }, headache: { p: 0.3, text: '{side}の耳の周りが痛いです。' },
    lastnormal: { p: 1, text: '昨日の夜までは顔は普通でした。' },
  },
  exam: { facial: { p: 1, text: '{side}の額のしわ寄せ・閉眼・口角挙上ができない（末梢性顔面神経麻痺）。' }, skin: { p: 1, text: '{side}耳介・外耳道に小水疱と発赤。' }, motor: { p: 0, text: '' }, speech: { p: 0, text: '' } },
  natural: -0.01,
  therapies: [{ id: 'tx', label: '早期の抗ウイルス薬（バラシクロビル）＋ステロイド', req: { fn: (enc, eff) => (eff.tags.antiviral_hsv || 0) > 0 && (eff.tags.steroid_sys || 0) > 0 }, effect: -0.3, lagH: 12, required: true, deadlineH: [24, 24, 24] }],
  residualAbove: 20, residualText: '顔面神経麻痺と難聴の後遺症が残りました。',
  useful: ['bs_poct', 'audiometry', 'head_mri'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: 'Ramsay Hunt症候群：外来で抗ウイルス薬とステロイド（重症は入院で点滴）、耳鼻咽喉科で聴力のフォロー' }),
  teaching: [
    '末梢性顔面神経麻痺＋耳介・外耳道の水疱＋難聴・めまいはRamsay Hunt症候群（顔面神経の帯状疱疹）。ベル麻痺より予後が悪い。',
    '額も動かない片側の顔面麻痺は末梢性。額が動けば中枢性（脳卒中）を考える。',
    '治療は早期の抗ウイルス薬とステロイド。目が閉じにくいので角膜の保護（点眼・眼帯）も。',
  ],
  sources: ['顔面神経麻痺診療ガイドライン2023年版（日本顔面神経学会）'],
  ideal: () => [{ a: 'rx', drugId: 'valacyclovir', route: 'po', dose: 1000, freq: 'q8h', days: 7 }, { a: 'rx', drugId: 'prednisolone', route: 'po', dose: 60, freq: 'q24h', days: 5 }],
});
