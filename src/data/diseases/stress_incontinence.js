// 腹圧性尿失禁
// 出典: 日本排尿機能学会/日本泌尿器科学会『女性下部尿路症状診療ガイドライン第2版（2019）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'stress_incontinence', name: '腹圧性尿失禁', dept: '泌尿器科', weight: 4,
  demo: { age: [40, 75], ageMode: 'uniform', male: 0 },
  noPregnancy: true,
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '咳やくしゃみで尿が漏れる', ccKey: 'urinary_sx',
  history: {
    onset: { p: 1, text: '数年前から、咳・くしゃみ・重い物を持ったときに尿が漏れます。' },
    incontinence: { p: 1, text: 'お腹に力が入ったときに少量漏れます。急にトイレに行きたくなって漏れることはありません。' },
    character: { p: 1, text: '尿意とは関係なく、力んだ瞬間に漏れます。' },
    frequency: { p: 0.2, text: 'トイレは普通の回数です。' },
    dysuria: { p: 0, text: '排尿時の痛みはありません。' },
    hematuria: { p: 0, text: '' }, fever: { p: 0, text: '' }, retention: { p: 0, text: 'おしっこは勢いよく出ます。' },
    pmh: { p: 1, text: '子どもを2人、経腟分娩で産みました。' },
    meds: { p: 1, text: '特に飲んでいません。' },
  },
  exam: { abd_palp: { p: 1, text: '下腹部に膨隆・圧痛なし。' }, speculum: { p: 0.6, text: '咳をさせると外尿道口から尿が漏れる（ストレステスト陽性）。高度の子宮下垂はない。' } },
  natural: -0.003,
  therapies: [{ id: 'tx', label: '骨盤底筋訓練・減量・便秘の改善、改善しなければ手術（TVT/TOT）を泌尿器科・婦人科で相談', req: { fn: (enc) => enc.tests.some((t) => t.id === 'ua') }, effect: -0.3, lagH: 6, required: true, deadlineH: [48, 48, 48] }],
  harmTags: {},
  useful: ['ua', 'pvr'], key: [['ua']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '腹圧性尿失禁：骨盤底筋訓練から開始（3か月続ける）' }),
  teaching: [
    '咳・くしゃみ・運動など腹圧がかかったときに漏れるのが腹圧性尿失禁。出産・加齢・肥満で骨盤底が弱ることが原因。',
    '急な尿意で間に合わないのは切迫性尿失禁（過活動膀胱）、残尿が多く少しずつ漏れるのは溢流性尿失禁（前立腺肥大・神経因性膀胱）で治療が違う。',
    '尿検査で感染・血尿を除外。治療は骨盤底筋訓練（3か月以上）、減量、改善しなければ中部尿道スリング手術。',
  ],
  sources: ['女性下部尿路症状診療ガイドライン第2版（日本排尿機能学会/日本泌尿器科学会）'],
  ideal: () => [{ a: 'test', ids: ['ua', 'pvr'] }],
});
