// 加齢黄斑変性（滲出型）
// 出典: 日本眼科学会『年齢別黄斑変性の治療指針（第2版）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'amd', name: '加齢黄斑変性', dept: '眼科', weight: 3,
  demo: { age: [65, 88], ageMode: 'old', male: 0.7 },
  comorb: { extra: { htn: 0.4 } },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '物がゆがんで見える', ccKey: 'vision',
  history: {
    onset: { p: 1, text: '1か月前から、{side}目で見ると、真ん中がゆがんで見えます。' },
    character: { p: 1, text: '障子の桟や電柱が曲がって見え、見たい所の真ん中が暗くぼやけます。' },
    vision: { p: 1, text: '{side}目の真ん中が見えにくいです。周りは見えます。' },
    headache: { p: 0, text: '頭痛はありません。' }, jaw: { p: 0, text: '' }, weakness: { p: 0, text: '' }, speechq: { p: 0, text: '' },
    pmh: { p: 0, text: '目の病気は言われていません。' }, meds: { p: 0, text: '' }, trigger: { p: 0, text: '' },
    smoking: { p: 1, text: '40年間、1日20本吸っていました。' },
  },
  exam: { eye: { p: 1, text: 'アムスラーチャートで{side}眼の中心部の歪みと暗点。前眼部に異常なし。' }, pupils: { p: 0, text: '瞳孔・対光反射は正常。' }, motor: { p: 0, text: '' } },
  tests: { acuity: [{ p: 1, persist: true, text: '{side}0.3（矯正不能）、反対側 0.9。' }], fundus: [{ p: 1, persist: true, text: '{side}黄斑部に網膜下出血と灰白色の隆起（脈絡膜新生血管）。網膜剥離なし。' }], oct: [{ p: 1, persist: true, text: '{side}黄斑部に網膜下液と網膜色素上皮下の新生血管（滲出型加齢黄斑変性）。' }] },
  natural: 0.01,
  therapies: [{ id: 'eye', label: '眼科へ早めに紹介：抗VEGF薬の硝子体内注射（視力の維持）、禁煙', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'eye') }, effect: -0.3, lagH: 6, required: true, deadlineH: [72, 48, 24] }],
  consult: { eye: '眼科：OCTで黄斑部の網膜下液と脈絡膜新生血管を認め、滲出型加齢黄斑変性です。放置すると中心の視力を失うので、抗VEGF薬の硝子体内注射を始めます。禁煙をお願いします。アムスラーチャートで反対の目も毎日確認してください。' },
  useful: ['acuity', 'fundus', 'oct', 'slit'], key: [['fundus', 'oct']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '加齢黄斑変性：眼科で早期に抗VEGF療法' }),
  teaching: [
    '高齢者の片眼の「物がゆがんで見える（変視症）」「中心が暗い（中心暗点）」は加齢黄斑変性。喫煙が最大の危険因子。',
    'アムスラーチャートで歪みを確認。眼底検査・OCTで黄斑部の出血・網膜下液・新生血管。',
    '滲出型は抗VEGF薬の硝子体内注射で視力を維持できるので早期に眼科へ。日本の失明原因の上位。',
  ],
  sources: ['年齢別黄斑変性の治療指針（第2版）（日本眼科学会）'],
  ideal: () => [{ a: 'test', ids: ['acuity', 'fundus', 'oct'] }, { a: 'consult', dept: 'eye', delayMin: 1 }, { a: 'wait', min: 70 }],
});
