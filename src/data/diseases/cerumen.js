// 耳垢栓塞
// 出典: AAO-HNS Clinical Practice Guideline: Earwax (Cerumen Impaction) (2017)
import { outpatient } from './common.js';
export default outpatient({
  id: 'cerumen', name: '耳垢栓塞', dept: '耳鼻咽喉科', weight: 4,
  demo: { age: [60, 90], ageMode: 'old', male: 0.55 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '耳が詰まって聞こえにくい', ccKey: 'hearing',
  history: {
    onset: { p: 1, text: '数日前から{side}耳が詰まった感じで聞こえにくいです。' },
    hearing: { p: 1, text: '{side}耳がこもって聞こえます。' },
    character: { p: 1, text: '痛みはありません。お風呂の後から悪化しました。' },
    course: { p: 1, text: '急に聞こえなくなったわけではありません。' },
    fever: { p: 0, text: '' }, vertigo: { p: 0, text: '' }, weakness: { p: 0, text: '' }, headache: { p: 0, text: '' },
    trigger: { p: 1, text: '耳掃除はしばらくしていません。補聴器を使っています。' },
  },
  exam: { ear: { p: 1, text: '{side}外耳道が硬い耳垢で完全にふさがり、鼓膜が見えない。Weber試験は{side}に偏る（伝音難聴）。' } },
  natural: -0.005,
  therapies: [{ id: 'tx', label: '耳垢除去（耳垢水で軟化→洗浄・鉗子）', req: { fn: (enc) => !!enc.state.procs?.ear_clean }, effect: -3, lagH: 0.2, required: true, deadlineH: [6, 6, 6] }],
  useful: ['audiometry'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '耳垢栓塞：除去して帰宅' }),
  teaching: [
    '耳閉感・難聴（伝音難聴）で、耳鏡で外耳道が耳垢でふさがっていれば耳垢栓塞。高齢者・補聴器・綿棒の使用が誘因。',
    '耳垢水で軟化してから洗浄・鉗子で除去する。鼓膜穿孔の既往があれば洗浄しない。',
    '除去しても改善しない・片側の急な難聴なら突発性難聴などを考える（音叉・聴力検査）。',
  ],
  sources: ['AAO-HNS Clinical Practice Guideline: Earwax (Cerumen Impaction) (2017)'],
  ideal: () => [{ a: 'proc', id: 'ear_clean' }],
});
