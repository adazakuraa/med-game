// 群発頭痛
// 出典: 日本神経学会/日本頭痛学会『頭痛の診療ガイドライン2021』, 国際頭痛分類第3版（ICHD-3）
import { outpatient } from './common.js';
export default outpatient({
  id: 'cluster', name: '群発頭痛', dept: '脳神経内科', weight: 2,
  demo: { age: [20, 50], ageMode: 'young', male: 0.85 },
  smokeP: 0.6,
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '目の奥の激しい頭痛', ccKey: 'headache',
  history: {
    onset: { p: 1, text: '1時間ほど前、夜中に{side}目の奥の激しい痛みで目が覚めました。' },
    course: { p: 1, text: 'この2週間、毎晩ほぼ同じ時間に起きて、1〜2時間続きます。' },
    character: { p: 1, text: '{side}目の奥をえぐられるような痛みで、じっとしていられません。' },
    location: { p: 1, text: '{side}目の奥からこめかみです。いつも同じ側です。' },
    severity: { p: 1, text: '10です。' },
    trigger: { p: 0.7, text: 'お酒を飲むと起きやすいです。' },
    pmh: { p: 0.7, text: '2年前の春にも、1か月くらい同じ頭痛が毎晩続いた時期がありました。' },
    nausea: { p: 0.2, text: '少しむかむかします。' },
    photophobia: { p: 0.3, text: '少しまぶしいです。' },
    aggravating: { p: 1, text: '痛くて歩き回ってしまいます。' },
    fever: { p: 0, text: '' }, seizure: { p: 0, text: '' }, family: { p: 0, text: '' },
  },
  exam: {
    gen_appear: { p: 1, text: '痛みで落ち着かず、部屋の中を歩き回っている。' },
    pupils: { p: 0.6, text: '{side}の縮瞳と眼瞼下垂（部分的Horner徴候）。{side}眼の結膜充血・流涙・鼻汁。' },
  },
  natural: -0.3,
  therapies: [{ id: 'abort', label: '発作の頓挫（純酸素吸入 7〜15L/分 15分間、またはスマトリプタン皮下注）', req: { fn: (enc, eff) => (eff.tags.triptan || 0) > 0 || (eff.o2Device === 'reservoir' || (eff.o2Device === 'mask' && (eff.o2Flow || 0) >= 7)) }, effect: -3, lagH: 0.25, required: true, deadlineH: [2, 2, 2] }],
  useful: ['bs_poct', 'head_ct', 'head_mri'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '群発頭痛：発作が頓挫すれば帰宅。群発期の予防（ベラパミルなど）と禁酒を指導し、頭痛外来へ' }),
  teaching: [
    '群発頭痛：若い男性に多く、片側の目の奥の激痛が15分〜3時間、毎日同じ時間帯（夜間）に起こり、数週〜数か月続く（群発期）。',
    '痛む側の流涙・結膜充血・鼻汁・縮瞳/眼瞼下垂（自律神経症状）を伴い、じっとしていられない（片頭痛は動くと悪化して静かにしていたい）。',
    '発作の治療は純酸素吸入（リザーバーマスクで7〜15L/分、15分間）またはスマトリプタン皮下注。',
    '群発期は飲酒で発作が誘発されるので禁酒。初発で非典型的なら二次性頭痛の除外にMRIを。',
  ],
  sources: ['頭痛の診療ガイドライン2021（日本神経学会/日本頭痛学会）', '国際頭痛分類 第3版（ICHD-3）'],
  ideal: () => [{ a: 'o2', device: 'reservoir', flow: 10 }],
});
