// 過活動膀胱
// 出典: 日本排尿機能学会『過活動膀胱診療ガイドライン第3版（2022）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'oab', name: '過活動膀胱', dept: '泌尿器科', weight: 5,
  demo: { age: [55, 85], ageMode: 'old', male: 0.35 },
  comorb: { extra: { htn: 0.4 } },
  vars: () => ({}),
  cc: () => 'トイレが近く、間に合わない', ccKey: 'urinary_sx',
  history: {
    onset: { p: 1, text: '1年くらい前から、急におしっこがしたくなって我慢できず、漏れてしまうことがあります。' },
    frequency: { p: 1, text: '昼間は1〜2時間ごと、夜も2回トイレに起きます。' },
    character: { p: 1, text: '急に強い尿意が来て、トイレまで間に合わないことがあります。' },
    dysuria: { p: 0, text: '排尿時の痛みはありません。' },
    hematuria: { p: 0, text: '血尿はありません。' },
    retention: { p: 0, text: 'おしっこは勢いよく出て、残った感じはありません。' },
    fever: { p: 0, text: '' }, flankpain: { p: 0, text: '' },
    meds: { p: 1, text: '血圧の薬だけです。利尿薬は飲んでいません。' },
  },
  exam: { abd_palp: { p: 0.2, text: '下腹部に膨隆・圧痛なし。' } },
  tests: {},
  natural: -0.003,
  therapies: [{ id: 'tx', label: '行動療法（膀胱訓練・骨盤底筋訓練・水分調整）とβ3作動薬', req: { tag: 'beta3' }, effect: -0.3, lagH: 12, required: true, deadlineH: [24, 24, 24] }],
  harmTags: {},
  useful: ['ua', 'pvr', 'chem', 'bs_poct', 'psa'], key: [['ua'], ['pvr']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '過活動膀胱：外来で行動療法とβ3作動薬' }),
  teaching: [
    '急に起こる我慢しにくい尿意（尿意切迫感）に頻尿・夜間頻尿・切迫性尿失禁を伴うのが過活動膀胱。',
    '尿検査（感染・血尿）と残尿測定で、膀胱炎・膀胱がん・前立腺肥大症・神経因性膀胱（残尿が多い）を除外する。',
    '治療は行動療法とβ3作動薬（ミラベグロン・ビベグロン）。抗コリン薬は高齢者で認知機能低下・便秘・尿閉・緑内障の悪化に注意。',
  ],
  sources: ['過活動膀胱診療ガイドライン第3版（日本排尿機能学会）'],
  ideal: () => [{ a: 'test', ids: ['ua', 'pvr'] }, { a: 'rx', drugId: 'mirabegron', route: 'po', dose: 50, freq: 'q24h', days: 28 }],
});
