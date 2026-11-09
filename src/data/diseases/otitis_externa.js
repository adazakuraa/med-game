// 急性外耳炎
// 出典: AAO-HNS Clinical Practice Guideline: Acute Otitis Externa (2014)
import { outpatient } from './common.js';
export default outpatient({
  id: 'otitis_externa', name: '急性外耳炎', dept: '耳鼻咽喉科', weight: 4,
  demo: { age: [18, 70], ageMode: 'uniform', male: 0.5 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '耳が痛い', ccKey: 'hearing',
  history: {
    onset: { p: 1, text: '3日前から{side}耳が痛く、耳だれが出ます。' },
    character: { p: 1, text: '耳を引っ張ったり、耳の前を押すと痛いです。かゆみもあります。' },
    hearing: { p: 0.5, text: '少しこもって聞こえます。' },
    trigger: { p: 1, text: '毎晩綿棒で耳掃除をしています。プールにも通っています。' },
    fever: { p: 0, text: '熱はありません。' },
    course: { p: 1, text: 'かぜはひいていません。' },
    vertigo: { p: 0, text: '' }, weakness: { p: 0, text: '' }, headache: { p: 0, text: '' },
  },
  exam: { ear: { p: 1, text: '{side}耳介牽引痛・耳珠圧痛。外耳道の発赤・腫脹と白色の耳漏。鼓膜は一部見える範囲で正常。' } },
  natural: -0.02,
  therapies: [{ id: 'tx', label: '外耳道の清掃と抗菌点耳薬、耳掃除を控える指導', req: { fn: (enc, eff) => (eff.tags.ear_abx || 0) > 0 }, effect: -0.5, lagH: 6, required: true, deadlineH: [24, 24, 24] }],
  useful: [], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '急性外耳炎：点耳薬で外来治療（耳掃除・耳を濡らすのを控える）' }),
  teaching: [
    '耳介を引っ張る・耳珠を押すと痛く、外耳道が腫れて耳漏があれば外耳炎。綿棒での耳掃除・水泳が誘因。',
    '中耳炎はかぜの後・鼓膜の発赤と膨隆・発熱。',
    '治療は外耳道の清掃と抗菌点耳薬。内服の抗菌薬は通常不要。',
    '糖尿病・高齢者で強い痛み・肉芽・顔面神経麻痺があれば悪性外耳道炎（緑膿菌、骨髄炎）を疑う。',
  ],
  sources: ['AAO-HNS Clinical Practice Guideline: Acute Otitis Externa (2014)'],
  ideal: () => [{ a: 'proc', id: 'ear_clean' }, { a: 'rx', drugId: 'ear_drop', route: 'top', dose: 6, freq: 'q12h', days: 7 }],
});
