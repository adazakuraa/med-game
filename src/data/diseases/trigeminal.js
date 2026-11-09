// 三叉神経痛
// 出典: 日本頭痛学会『頭痛の診療ガイドライン2021』, 国際頭痛分類第3版（ICHD-3）
import { outpatient } from './common.js';
export default outpatient({
  id: 'trigeminal', name: '三叉神経痛', dept: '脳神経内科', weight: 2,
  demo: { age: [50, 80], ageMode: 'uniform', male: 0.4 },
  comorb: { extra: { htn: 0.4 } },
  vars: (rng) => ({ side: rng.pick(['右', '右', '左']) }),
  cc: () => '顔に電気が走るような痛み', ccKey: 'headache',
  history: {
    onset: { p: 1, text: '1か月前から、{side}の頬から下あごにかけて、電気が走るような激痛が起こります。' },
    character: { p: 1, text: '数秒間、ビリッと刺すように痛みます。1日に何十回も起こります。' },
    location: { p: 1, text: '{side}の頬・上唇・下あごです。' },
    trigger: { p: 1, text: '歯みがき・洗顔・食事・ひげそりで起こります。冷たい風でも起こります。' },
    course: { p: 1, text: '発作と発作の間は何ともありません。' },
    severity: { p: 1, text: '発作のときは10です。' },
    aggravating: { p: 1, text: '顔を触ったり、しゃべったりすると起こります。' },
    pmh: { p: 1, text: '歯医者に行きましたが、歯は悪くないと言われました。' },
    nausea: { p: 0, text: '' }, photophobia: { p: 0, text: '' }, fever: { p: 0, text: '' }, seizure: { p: 0, text: '' }, family: { p: 0, text: '' },
    rash: { p: 1, text: '発疹はできていません。' },
  },
  exam: { facial: { p: 1, text: '顔面の感覚・運動は正常（神経脱落症状なし）。{side}鼻翼の横を触ると痛みの発作が誘発される（トリガーゾーン）。' }, skin: { p: 1, text: '顔面に発疹はない。' } },
  tests: { head_mri: [{ p: 0.8, persist: true, text: 'MRI（脳槽撮影）で{side}三叉神経根に上小脳動脈が接触・圧迫。腫瘍・脱髄病変はない。' }] },
  natural: -0.003,
  therapies: [{ id: 'tx', label: 'カルバマゼピン', req: { tag: 'tn_tx' }, effect: -0.6, lagH: 6, required: true, deadlineH: [24, 24, 24] }],
  useful: ['head_mri'], key: [['head_mri']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '三叉神経痛：カルバマゼピンで外来治療。効果不十分なら脳神経外科で微小血管減圧術を相談' }),
  teaching: [
    '顔面の片側に、数秒間の電撃痛が繰り返し起こり、歯みがき・洗顔・食事などで誘発されるのは三叉神経痛。発作の間は無症状。',
    '多くは血管による三叉神経根の圧迫。若年・両側・感覚障害があれば腫瘍や多発性硬化症を疑いMRI。',
    '帯状疱疹（発疹）・歯の病気・副鼻腔炎・顎関節症を区別する。',
    '治療はカルバマゼピン（眠気・ふらつき・重症薬疹・低Na血症に注意）。効かなければ微小血管減圧術など。',
  ],
  sources: ['頭痛の診療ガイドライン2021', '国際頭痛分類 第3版（ICHD-3）'],
  ideal: () => [{ a: 'test', ids: ['head_mri'] }, { a: 'rx', drugId: 'carbamazepine', route: 'po', dose: 100, freq: 'q12h', days: 28 }],
});
