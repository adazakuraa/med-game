// 下肢静脈瘤
// 出典: 日本静脈学会『下肢静脈瘤に対する血管内焼灼術のガイドライン2019』
import { outpatient } from './common.js';
export default outpatient({
  id: 'varicose', name: '下肢静脈瘤', dept: '心臓血管外科', weight: 4,
  demo: { age: [45, 80], ageMode: 'uniform', male: 0.3 },
  comorb: { extra: { htn: 0.3 } },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '足の血管がこぶのように浮き出て、だるい', ccKey: 'leg_red',
  history: {
    onset: { p: 1, text: '数年前から{side}ふくらはぎの血管がボコボコと浮き出てきました。' },
    character: { p: 1, text: '夕方になると足がだるく重く、むくみます。夜中に足がつります。' },
    course: { p: 1, text: 'ゆっくり目立ってきました。急に腫れたことはありません。' },
    occupation: { p: 1, text: '美容師で、一日中立ち仕事です。' },
    pmh: { p: 1, text: '子どもを2人産んでいます。母も足の血管が浮き出ていました。' },
    fever: { p: 0, text: '' }, immobility: { p: 0, text: '' }, trigger: { p: 0, text: '' }, chills: { p: 0, text: '' },
  },
  exam: { skin: { p: 1, text: '{side}下腿内側に蛇行して拡張した静脈（伏在静脈瘤）。くるぶし周囲に軽い色素沈着。潰瘍はない。' }, calf: { p: 1, text: 'ふくらはぎの圧痛・腫脹はない。' }, leg_pulse: { p: 1, text: '足背動脈は良好に触知する。' }, leg_edema: { p: 0.6, text: '夕方の軽い浮腫。' } },
  tests: { leg_us: [{ p: 1, persist: true, text: '{side}大伏在静脈の逆流（弁不全）と拡張。深部静脈に血栓はない。' }] },
  natural: -0.002,
  therapies: [{ id: 'tx', label: '弾性ストッキング・生活指導、症状が強ければ血管外科で血管内焼灼術など', req: { fn: (enc) => enc.tests.some((t) => t.id === 'leg_us') || enc.consults.some((c) => c.dept === 'cvs') }, effect: -0.3, lagH: 6, required: true, deadlineH: [48, 48, 48] }],
  useful: ['leg_us', 'cbc', 'lab_DDIMER'], key: [['leg_us']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '下肢静脈瘤：弾性ストッキングで経過をみて、症状が強ければ血管外科で治療' }),
  teaching: [
    '立ち仕事・妊娠・家族歴がリスク。足の静脈の弁が壊れて血液が逆流し、血管がこぶ状に浮き出る。だるさ・むくみ・こむら返り・色素沈着・潰瘍を起こす。',
    'エコーで逆流と深部静脈血栓の有無を確認する。急に片足が腫れて痛ければ深部静脈血栓症を考える。',
    '治療は弾性ストッキング、症状が強ければ血管内焼灼術・硬化療法・ストリッピング手術。',
  ],
  sources: ['下肢静脈瘤に対する血管内焼灼術のガイドライン2019（日本静脈学会）'],
  ideal: () => [{ a: 'test', ids: ['leg_us'] }],
});
