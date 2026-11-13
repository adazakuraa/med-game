// 陰嚢水腫（精巣水瘤）
// 出典: 日本泌尿器科学会 資料
import { outpatient } from './common.js';
export default outpatient({
  id: 'hydrocele', name: '陰嚢水腫', dept: '泌尿器科', weight: 2.5,
  demo: { age: [40, 80], ageMode: 'uniform', male: 1 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '陰嚢が腫れてきた', ccKey: 'scrotal',
  history: {
    onset: { p: 1, text: '半年くらい前から、{side}の陰嚢がゆっくり大きくなってきました。' },
    character: { p: 1, text: '痛みはありません。重たい感じがするだけです。横になっても小さくなりません。' },
    location: { p: 1, text: '{side}の陰嚢です。足の付け根は腫れていません。' },
    nausea: { p: 0, text: '吐き気はありません。' }, fever: { p: 0, text: '熱はありません。' }, dysuria: { p: 0, text: '排尿時の痛みはありません。' }, trigger: { p: 0, text: 'けがはしていません。' },
  },
  exam: { scrotum: { p: 1, text: '{side}陰嚢の鶏卵大の柔らかい無痛性の腫大、表面平滑で波動あり。ペンライトを当てると透けて光る（透光性陽性）。精巣は腫大の奥に触れにくい。' }, inguinal: { p: 0, text: '鼠径部に膨隆なし。咳で大きさは変わらない。' }, abd_palp: { p: 0, text: '腹部に異常なし。' } },
  tests: { scrotal_us: [{ p: 1, persist: true, text: '{side}精巣を取り囲む無エコーの液体貯留（陰嚢水腫）。精巣・精巣上体に腫瘤なし、血流正常。' }], ua: [{ p: 1, text: '異常なし。', normal: true }] },
  natural: -0.002,
  therapies: [{ id: 'uro', label: '精巣腫瘍・ヘルニアを除外し、泌尿器科で経過観察（大きく不快なら手術）', req: { fn: (enc) => enc.tests.some((t) => t.id === 'scrotal_us' && t.done) }, effect: -0.3, lagH: 1, required: true, deadlineH: [72, 72, 72] }],
  useful: ['scrotal_us', 'ua'], key: [['scrotal_us']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '陰嚢水腫：経過観察（大きく生活に支障があれば泌尿器科で手術）' }),
  teaching: [
    'ゆっくり大きくなる痛みのない陰嚢の腫れで、波動があり光を当てると透ける（透光性陽性）→ 陰嚢水腫。',
    '精巣腫瘍（硬い・透光性なし）を見逃さないため、陰嚢エコーで精巣を確認する。鼠径ヘルニア（咳で膨らむ・臥位で戻る）とも区別する。',
    '症状がなければ経過観察、大きく不快なら手術。急な痛みを伴う腫れは精巣捻転・精巣上体炎。',
  ],
  sources: ['日本泌尿器科学会「陰嚢水腫」'],
  ideal: () => [{ a: 'test', ids: ['scrotal_us', 'ua'] }, { a: 'wait', min: 30 }],
});
