// 白内障（加齢性）
// 出典: 日本眼科学会 資料, 日本白内障学会
import { outpatient } from './common.js';
export default outpatient({
  id: 'cataract', name: '白内障', dept: '眼科', weight: 4,
  demo: { age: [65, 88], ageMode: 'old', male: 0.45 },
  comorb: { extra: { dm2: 0.3 } },
  vars: () => ({}),
  cc: () => '目がかすんで見えにくい', ccKey: 'vision',
  history: {
    onset: { p: 1, text: '1〜2年前から、両目が少しずつかすんで見えにくくなりました。' },
    character: { p: 1, text: '白っぽくかすみ、まぶしく感じます。夜の運転で対向車のライトがにじみます。' },
    vision: { p: 1, text: 'ゆっくり見えにくくなっています。急に見えなくなったことはありません。' },
    headache: { p: 0, text: '目の痛みや頭痛はありません。' },
    pmh: { p: 0.4, text: '糖尿病があります。' },
    meds: { p: 0.3, text: 'ステロイドは飲んでいません。' },
    weakness: { p: 0, text: '' }, trigger: { p: 0, text: '' },
  },
  exam: { eye: { p: 1, text: '充血なし。瞳孔は正円で対光反射正常。' } },
  tests: { slit: [{ p: 1, persist: true, text: '両眼の水晶体の核と皮質に混濁（白内障）。角膜・前房は正常。' }], acuity: [{ p: 1, persist: true, text: '矯正視力 右0.5・左0.6。' }] },
  natural: -0.002,
  therapies: [{ id: 'eye', label: '眼科へ紹介：生活に支障があれば白内障手術（眼内レンズ挿入）', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'eye') }, effect: -0.3, lagH: 6, required: true, deadlineH: [48, 48, 48] }],
  consult: { eye: '眼科：加齢性白内障です。生活や運転に支障があるので、水晶体再建術（眼内レンズ挿入）を予定します。糖尿病網膜症の有無も確認します。' },
  useful: ['acuity', 'slit', 'fundus', 'bs_poct', 'hba1c'], key: [['acuity']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '白内障：眼科外来で手術を予定' }),
  teaching: [
    '高齢者の、ゆっくり進む両眼のかすみ・まぶしさ・視力低下は白内障が多い。糖尿病・ステロイド・アトピー・外傷でも起こる。',
    '急な視力低下・視野欠損・眼痛・充血があれば、網膜剥離・網膜動脈閉塞・緑内障発作・脳卒中など別の病気を考える。',
    '治療は手術（水晶体再建術・眼内レンズ挿入）。日帰りでもできる。',
  ],
  sources: ['日本眼科学会 資料「白内障」'],
  ideal: () => [{ a: 'test', ids: ['acuity', 'slit'] }, { a: 'consult', dept: 'eye', delayMin: 1 }, { a: 'wait', min: 70 }],
});
