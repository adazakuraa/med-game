// 結膜下出血
// 出典: 日本眼科学会 資料
import { outpatient } from './common.js';
export default outpatient({
  id: 'subconj', name: '結膜下出血', dept: '眼科', weight: 3,
  demo: { age: [40, 80], ageMode: 'uniform', male: 0.5 },
  comorb: { extra: { htn: 0.5 } },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '白目が真っ赤になった', ccKey: 'red_eye',
  history: {
    onset: { p: 1, text: '今朝、鏡を見たら{side}目の白目が真っ赤になっていました。' },
    character: { p: 1, text: '痛みもかゆみもありません。見え方も普段どおりです。' },
    vision: { p: 0, text: '見え方は普段どおりです。' },
    itch: { p: 0, text: '' }, sickcontact: { p: 0, text: '' }, headache: { p: 0, text: '' }, nausea: { p: 0, text: '' },
    trigger: { p: 1, text: '昨日、咳き込んだり、強くいきんだりしました。目はぶつけていません。' },
    allergy: { p: 0, text: '' },
  },
  exam: { eye: { p: 1, text: '{side}眼の白目（結膜下）に境界明瞭なべったりとした鮮紅色の出血。眼脂なし。角膜は透明で瞳孔・視力は正常。' } },
  natural: -0.12,
  therapies: [],
  useful: ['acuity', 'coag', 'cbc'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '結膜下出血：治療不要で1〜2週間で自然に吸収される。繰り返す・ほかにも出血があれば血液検査' }),
  teaching: [
    '痛み・かゆみ・視力低下がなく、白目の一部がべったり赤いのは結膜下出血。咳・いきみ・高血圧・抗凝固薬で起こる。',
    '治療は不要で1〜2週間で自然に消える。',
    '外傷後・視力低下・眼痛がある・繰り返す・ほかの出血傾向があれば精査（眼球破裂・凝固異常）。',
    '結膜炎の充血（血管が網目状に見える）とは見た目が違う。',
  ],
  sources: ['日本眼科学会 資料'],
  ideal: () => [{ a: 'test', ids: ['acuity'] }],
});
