// 表在性血栓性静脈炎
// 出典: 日本循環器学会『肺血栓塞栓症および深部静脈血栓症の診断、治療、予防に関するガイドライン（2017年改訂版）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'sup_thrombophlebitis', name: '表在性血栓性静脈炎', dept: '循環器内科', weight: 3,
  demo: { age: [40, 75], ageMode: 'uniform', male: 0.35 },
  comorb: { extra: { htn: 0.3 } },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => 'すねの静脈が赤く腫れて痛い', ccKey: 'leg_red',
  history: {
    onset: { p: 1, text: '3日前から、{side}すねの内側の静脈に沿って赤く腫れて痛みます。' },
    course: { p: 1, text: '広がってはいません。' },
    character: { p: 1, text: '静脈がひも状に硬くなって、押すと痛いです。' },
    pmh: { p: 1, text: '以前から{side}足に静脈瘤があります。' },
    fever: { p: 0, text: '熱はありません。' }, chills: { p: 0, text: '' }, trigger: { p: 0, text: 'けがや虫刺されはありません。' },
    immobility: { p: 0, text: '最近、長時間の移動や手術はありません。' }, occupation: { p: 1, text: '立ち仕事です。' }, meds: { p: 0, text: 'ピルは飲んでいません。' }, allergy: { p: 0, text: '' },
  },
  exam: { skin: { p: 1, text: '{side}下腿内側の大伏在静脈の分枝に沿った索状の発赤・硬結・圧痛。周囲の発赤は限局し、広がりはない。静脈瘤あり。' }, calf: { p: 0, text: 'ふくらはぎの圧痛・腫脹なし。' }, leg_edema: { p: 0, text: '下腿の浮腫・左右差なし。' }, leg_pulse: { p: 0, text: '足背動脈は良好に触知。' } },
  labs: { DDIMER: { to: [1.0, 2.0], k: 0 } },
  tests: { leg_us: [{ p: 1, persist: true, text: '{side}大伏在静脈の分枝に血栓（表在静脈）。大伏在静脈本幹・深部静脈への進展はなく、深部静脈血栓なし。' }] },
  natural: -0.05,
  therapies: [{ id: 'tx', label: 'エコーで深部静脈血栓を除外し、NSAIDs・温湿布・弾性ストッキング（大伏在静脈の本幹に近い・長い血栓は抗凝固）', req: { fn: (enc, eff) => enc.tests.some((t) => t.id === 'leg_us' && t.done) && ((eff.tags.nsaid || 0) + (eff.tags.analgesic || 0)) > 0 }, effect: -0.3, lagH: 2, required: true, deadlineH: [24, 24, 24] }],
  useful: ['leg_us', 'cbc', 'crp', 'lab_DDIMER'], key: [['leg_us']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '表在性血栓性静脈炎（深部静脈血栓なし）：NSAIDs・弾性ストッキングで外来' }),
  teaching: [
    '静脈瘤のある人の、表在静脈に沿った索状の発赤・硬結・圧痛は表在性血栓性静脈炎。発熱・広がる発赤（蜂窩織炎）とは違う。',
    '深部静脈血栓を合併することがあるので、下肢静脈エコーで確認する。',
    'NSAIDs・温湿布・弾性ストッキング。大伏在静脈本幹に沿って長い・深部静脈に近い血栓は抗凝固療法。',
  ],
  sources: ['肺血栓塞栓症および深部静脈血栓症の診断、治療、予防に関するガイドライン（2017年改訂版）'],
  ideal: () => [{ a: 'test', ids: ['leg_us', 'cbc', 'crp'] }, { a: 'rx', drugId: 'loxo', route: 'po', dose: 60, freq: 'q8h', days: 7 }],
});
