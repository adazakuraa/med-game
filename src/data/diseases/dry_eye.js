// ドライアイ
// 出典: ドライアイ研究会『ドライアイ診療ガイドライン2019』
import { outpatient } from './common.js';
export default outpatient({
  id: 'dry_eye', name: 'ドライアイ', dept: '眼科', weight: 5,
  demo: { age: [30, 75], ageMode: 'uniform', male: 0.35 },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '目が乾いてゴロゴロする', ccKey: 'red_eye',
  history: {
    onset: { p: 1, text: '数か月前から両目が乾いてゴロゴロし、疲れやすいです。' },
    character: { p: 1, text: '夕方やパソコン作業の後に悪くなり、目がしょぼしょぼします。時々涙が出ます。' },
    trigger: { p: 1, text: '1日10時間パソコンを見ています。エアコンの効いた部屋にいます。コンタクトレンズを使っています。' },
    vision: { p: 0.4, text: '時々かすみますが、まばたきすると戻ります。' },
    itch: { p: 0, text: 'かゆみはあまりありません。' }, sickcontact: { p: 0, text: '周りに目の病気の人はいません。' },
    headache: { p: 0, text: '頭痛や吐き気はありません。' }, nausea: { p: 0, text: '' }, sorethroat: { p: 0, text: '' }, allergy: { p: 0, text: '' },
  },
  exam: { eye: { p: 1, text: '両眼の軽い結膜充血。眼脂なし。フルオレセイン染色で角膜下方に点状の傷、涙液層破壊時間（BUT）3秒と短縮。' }, pupils: { p: 0, text: '瞳孔は正常。' } },
  tests: { slit: [{ p: 1, persist: true, text: '角膜下方の点状表層角膜症、BUT短縮（3秒）。前房は清明。' }], acuity: [{ p: 1, text: '両眼 1.0。', normal: true }] },
  natural: -0.005,
  therapies: [{ id: 'tx', label: '点眼（ジクアホソル・ヒアルロン酸）と、画面作業の休憩・まばたき・加湿の指導', req: { tag: 'dry_eye_drop' }, effect: -0.3, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  useful: ['slit', 'acuity', 'ssab'], key: [['slit']],
  dispo: () => ({ ok: ['home'], best: 'home', why: 'ドライアイ：点眼と生活指導で外来' }),
  teaching: [
    'パソコン作業・コンタクトレンズ・エアコン・加齢で、目の乾き・ゴロゴロ感・疲れ・かすみ（まばたきで戻る）があればドライアイ。涙液層破壊時間（BUT）短縮。',
    '口の乾き・関節痛を伴う場合はシェーグレン症候群を考える。',
    '治療は点眼（ジクアホソル・レバミピド・ヒアルロン酸）と、画面作業の休憩・意識的なまばたき・加湿。',
  ],
  sources: ['ドライアイ診療ガイドライン2019（ドライアイ研究会）'],
  ideal: () => [{ a: 'test', ids: ['slit', 'acuity'] }, { a: 'rx', drugId: 'diquafosol', route: 'top', dose: 1, freq: 'q6h', days: 28 }],
});
