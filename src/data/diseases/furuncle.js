// せつ（癤）・毛包炎
// 出典: 日本皮膚科学会 資料, JAID/JSC感染症治療ガイド2023（皮膚・軟部組織感染症）
import { outpatient } from './common.js';
export default outpatient({
  id: 'furuncle', name: 'せつ（おでき）', dept: '皮膚科', weight: 4,
  demo: { age: [15, 60], ageMode: 'young', male: 0.65 },
  comorb: { extra: { dm2: 0.15 } }, organisms: ['gpc'],
  vars: (rng) => ({ site: rng.pick(['うなじ', 'お尻', '太もも', 'わきの下']) }),
  cc: (v) => `${v.site}にできものができて痛い`, ccKey: 'skin_lesion',
  history: {
    onset: { p: 1, text: '4日前から{site}に赤いできものができ、だんだん大きく痛くなりました。' },
    character: { p: 1, text: '真ん中に黄色い膿のようなものが見えて、ズキズキします。' },
    location: { p: 1, text: '{site}です。' },
    itch: { p: 0, text: 'かゆみはありません。' }, fever: { p: 0, text: '熱はありません。' },
    trigger: { p: 0.5, text: 'ひげそりや汗をかくことが多いです。' }, meds: { p: 0, text: '' }, pmh: { p: 0, text: '以前からあったしこりではありません。' }, family: { p: 0, text: '' },
  },
  exam: { skin: { p: 1, text: '{site}に毛包を中心とした2cmの発赤・腫脹・圧痛のある結節、中央に膿栓。波動を触れる。周囲の発赤の広がりは小さい。' } },
  tests: {},
  natural: -0.05,
  therapies: [{ id: 'tx', label: '切開排膿（波動があれば）、必要に応じて抗菌薬（セファレキシンなど）', req: { fn: (enc, eff) => !!enc.state.procs?.incision || (eff.covers.gpc || 0) > 0 }, effect: -0.5, lagH: 1, required: true, deadlineH: [24, 24, 24] }],
  dynamics: (enc) => (enc.state.procs?.incision && enc.t >= enc.state.procs.incision ? -0.6 : 0),
  useful: ['cbc', 'crp', 'bs_poct', 'hba1c'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: 'せつ：切開排膿・抗菌薬で外来治療' }),
  teaching: [
    '毛包を中心とした痛い赤いしこりで中央に膿栓があればせつ（おでき）。黄色ブドウ球菌が原因。複数が融合したものはよう（癰）。',
    '波動があれば切開排膿。広がる発赤・発熱があれば抗菌薬。繰り返す場合は糖尿病・MRSA保菌を考える。',
    '以前からあったしこりが急に腫れたものは感染性粉瘤（中央の黒点）。',
  ],
  sources: ['JAID/JSC感染症治療ガイド2023'],
  ideal: () => [{ a: 'proc', id: 'incision' }],
});
