// 麦粒腫（ものもらい）
// 出典: 日本眼科学会 資料
import { outpatient } from './common.js';
export default outpatient({
  id: 'stye', name: '麦粒腫（ものもらい）', dept: '眼科', weight: 3,
  demo: { age: [15, 60], ageMode: 'young', male: 0.5 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']), lid: rng.pick(['上', '下']) }),
  cc: () => 'まぶたが腫れて痛い', ccKey: 'red_eye',
  history: {
    onset: { p: 1, text: '2日前から{side}の{lid}まぶたが赤く腫れて痛いです。' },
    character: { p: 1, text: 'まばたきすると痛く、押すと痛いところがあります。' },
    vision: { p: 0, text: '見え方は普段どおりです。' },
    itch: { p: 0.2, text: '少しかゆいです。' },
    sickcontact: { p: 0, text: '' }, headache: { p: 0, text: '' }, nausea: { p: 0, text: '' }, fever: { p: 0, text: '' },
  },
  exam: { eye: { p: 1, text: '{side}{lid}眼瞼の縁に限局した発赤・腫脹・圧痛、中心に黄色い膿点。結膜・角膜・眼球運動は正常。' } },
  natural: -0.1,
  therapies: [{ id: 'tx', label: '抗菌点眼薬（・眼軟膏）と温罨法、膿点があれば切開', req: { tag: 'eye_abx' }, effect: -0.4, lagH: 6, required: true, deadlineH: [24, 24, 24] }],
  useful: [], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '麦粒腫：抗菌点眼で外来治療（腫れが広がる・発熱・眼球運動痛があれば眼窩蜂窩織炎を考えて再診）' }),
  teaching: [
    'まぶたの縁の限局した発赤・腫脹・圧痛は麦粒腫（ものもらい）。まつげの毛根や瞼板腺の細菌（主に黄色ブドウ球菌）感染。',
    '痛みのないしこりは霰粒腫（感染ではない）。',
    'まぶた全体の腫れ・発熱・眼球運動の痛み・視力低下・眼球突出は眼窩蜂窩織炎として緊急に対応する。',
  ],
  sources: ['日本眼科学会 資料'],
  ideal: () => [{ a: 'rx', drugId: 'eye_abx', route: 'top', dose: 1, freq: 'q8h', days: 7 }],
});
