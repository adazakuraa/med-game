// サルコイドーシス
// 出典: 日本サルコイドーシス/肉芽腫性疾患学会『サルコイドーシスの診断基準と診断の手引き2015』
import { outpatient } from './common.js';
export default outpatient({
  id: 'sarcoid', name: 'サルコイドーシス', dept: '呼吸器内科', weight: 2, minLevel: 2,
  demo: { age: [25, 65], ageMode: 'uniform', male: 0.4 },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '咳が続き、目がかすむ', ccKey: 'chronic_cough',
  history: {
    onset: { p: 1, text: '2か月前から乾いた咳が続き、最近目がかすんで、まぶしく感じます。' },
    cough: { p: 1, text: '乾いた咳です。' },
    character: { p: 1, text: '健診の胸部X線で異常を指摘されたことがあります。' },
    sputum: { p: 0, text: '痰はほとんど出ません。' },
    fever: { p: 0, text: '熱はありません。' },
    weightloss: { p: 0, text: '体重は変わりません。' },
    nightsweat: { p: 0, text: '寝汗はありません。' },
    smoking: { p: 0, text: 'たばこは吸いません。' },
    dyspnea: { p: 0.3, text: '少し息切れがします。' },
    sickcontact: { p: 0, text: '' }, meds: { p: 0, text: '' }, heartburn: { p: 0, text: '' }, pmh: { p: 0, text: '' },
  },
  exam: { lung_ausc: { p: 0.2, text: '呼吸音はほぼ正常。' }, eye: { p: 0.7, text: '両眼の軽い毛様充血（ぶどう膜炎）。' }, skin: { p: 0.3, text: '下腿に有痛性の紅斑（結節性紅斑）。' } },
  labs: { ACE: { to: [28, 40], k: 0 }, CA: { add: [0.3, 1], k: 0 } },
  tests: { cxr: [{ p: 1, persist: true, text: '両側肺門リンパ節腫脹（BHL）。肺野に淡い粒状影。' }], chest_ct: [{ p: 1, persist: true, text: '両側肺門・縦隔リンパ節腫大と、リンパ路に沿った小粒状影。' }] },
  natural: -0.002,
  therapies: [{ id: 'resp', label: '呼吸器内科へ紹介：気管支鏡で組織診断、眼科・心臓の評価（心サルコイドーシス）', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'resp' || c.dept === 'eye') }, effect: -0.2, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  consult: { resp: '呼吸器内科：両側肺門リンパ節腫脹・ぶどう膜炎・ACE高値からサルコイドーシスを疑います。気管支鏡で肉芽腫を確認し、結核・リンパ腫を除外します。心電図・心エコーで心病変（突然死の原因）も評価してください。', eye: '眼科：両眼の肉芽腫性ぶどう膜炎です。サルコイドーシスを疑います。' },
  useful: ['cxr', 'chest_ct', 'ace_kl', 'chem', 'afb', 'igra', 'ecg', 'echo', 'slit'], key: [['cxr'], ['ace_kl'], ['ecg']],
  dispo: () => ({ ok: ['home'], best: 'home', why: 'サルコイドーシス：呼吸器内科外来で精査（多くは自然軽快、臓器障害があれば治療）' }),
  teaching: [
    '両側肺門リンパ節腫脹（BHL）・ぶどう膜炎・皮膚病変・高Ca血症・血清ACE上昇はサルコイドーシス。全身に非乾酪性肉芽腫ができる。',
    '結核・悪性リンパ腫・肺がんを除外するため、気管支鏡などで組織を確認する。',
    '心サルコイドーシス（房室ブロック・心室頻拍）は突然死の原因になるので、心電図・心エコーで評価する。',
  ],
  sources: ['サルコイドーシスの診断基準と診断の手引き2015'],
  ideal: () => [{ a: 'test', ids: ['cxr', 'ace_kl', 'chem', 'ecg', 'afb'] }, { a: 'consult', dept: 'resp', delayMin: 1 }, { a: 'wait', min: 70 }],
});
