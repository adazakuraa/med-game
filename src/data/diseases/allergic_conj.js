// アレルギー性結膜炎（季節性）
// 出典: 日本眼科アレルギー学会『アレルギー性結膜疾患診療ガイドライン（第3版）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'allergic_conj', name: 'アレルギー性結膜炎', dept: '眼科', weight: 5, season: { spring: 3, autumn: 1.3, summer: 0.5, winter: 0.4 },
  demo: { age: [15, 60], ageMode: 'young', male: 0.45 },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '目がかゆい', ccKey: 'red_eye',
  history: {
    onset: { p: 1, text: '2週間前から両目がかゆく、充血しています。毎年この時期になります。' },
    character: { p: 1, text: '目がかゆくてこすってしまいます。涙が出ます。' },
    itch: { p: 1, text: 'とてもかゆいです。' },
    vision: { p: 0, text: '見え方は普段どおりです。' },
    sickcontact: { p: 0, text: '' },
    allergy: { p: 1, text: 'スギ花粉症があります。くしゃみと鼻水も出ています。' },
    headache: { p: 0, text: '' }, nausea: { p: 0, text: '' }, sorethroat: { p: 0, text: '' },
  },
  exam: { eye: { p: 1, text: '両眼の結膜充血と結膜浮腫、水様の眼脂。瞼結膜に乳頭増殖。角膜は透明で瞳孔は正常。' }, neck_ln: { p: 0, text: '' } },
  natural: -0.005,
  therapies: [{ id: 'tx', label: '抗アレルギー点眼薬と抗原の回避（眼鏡・洗顔）', req: { tag: 'eye_antiallergy' }, effect: -0.5, lagH: 2, required: true, deadlineH: [24, 24, 24] }],
  useful: [], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: 'アレルギー性結膜炎：抗アレルギー点眼薬で外来治療（花粉の飛ぶ前から始めるとよい）' }),
  teaching: [
    '両眼の強いかゆみ・充血・流涙で、季節性・花粉症を伴うのはアレルギー性結膜炎。',
    '治療は抗アレルギー点眼薬。重症は免疫抑制点眼薬、ステロイド点眼は眼圧上昇に注意（眼科で）。',
    'かゆみが乏しく片眼から両眼へ・耳前リンパ節腫脹があればウイルス性（流行性角結膜炎）、膿性眼脂なら細菌性。',
  ],
  sources: ['アレルギー性結膜疾患診療ガイドライン（第3版）（日本眼科アレルギー学会）'],
  ideal: () => [{ a: 'rx', drugId: 'eye_antiallergy', route: 'top', dose: 1, freq: 'q6h', days: 14 }],
});
