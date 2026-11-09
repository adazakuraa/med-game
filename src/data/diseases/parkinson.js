// パーキンソン病
// 出典: 日本神経学会『パーキンソン病診療ガイドライン2018』, MDS Clinical Diagnostic Criteria (2015)
import { outpatient } from './common.js';
export default outpatient({
  id: 'parkinson', name: 'パーキンソン病', dept: '脳神経内科', weight: 4,
  demo: { age: [60, 85], ageMode: 'uniform', male: 0.5 },
  comorb: { extra: { htn: 0.3, constip: 0.6 } },
  vars: (rng) => ({ side: rng.pick(['右', '左']), y: rng.int(1, 2) }),
  cc: () => '手が震えて動作が遅くなった', ccKey: 'tremor',
  history: {
    onset: { p: 1, text: '{y}年くらい前から、{side}手が震えるようになりました。' },
    character: { p: 1, text: 'じっとしているときに震えて、何かをしようとすると止まります。字が小さくなり、ボタンを留めるのに時間がかかります。' },
    course: { p: 1, text: 'ゆっくり進んでいます。最近は歩くのも遅くなり、つまずきやすいです。' },
    constipation: { p: 0.8, text: '何年も前からひどい便秘です。' },
    sleep: { p: 0.6, text: '（家族）寝ているときに大声で寝言を言ったり、手足を動かしたりします。' },
    meds: { p: 1, text: '吐き気止めや胃薬（スルピリド）は飲んでいません。' },
    family: { p: 1, text: '家族に同じ病気の人はいません。' },
    heatcold: { p: 0, text: '' }, weightloss: { p: 0, text: '' }, alcohol: { p: 0.3, text: 'お酒を飲むと震えが良くなることはありません。' },
  },
  exam: {
    tremor: { p: 1, text: '{side}手に安静時振戦（丸薬を丸めるような動き、4〜6Hz）。動作時には軽減。' },
    rigidity: { p: 1, text: '{side}上肢に歯車様の筋強剛。小刻み歩行で腕の振りが少なく、前傾姿勢。' },
    facial: { p: 0.6, text: '表情が乏しい（仮面様顔貌）。' },
    gen_appear: { p: 1, text: '動作がゆっくりで、声が小さい。' },
  },
  tests: {},
  natural: -0.005,
  therapies: [{ id: 'tx', label: '脳神経内科でのドパミン補充療法（レボドパなど）とリハビリ', req: { fn: (enc, eff) => (eff.tags.levodopa || 0) > 0 || enc.consults.some((c) => c.dept === 'neuro') }, effect: -0.3, lagH: 6, required: true, deadlineH: [24, 24, 24] }],
  harmTags: { antiemetic: 'パーキンソン病にメトクロプラミド（ドパミン遮断で悪化）' },
  useful: ['head_mri', 'thyroid', 'chem', 'cbc'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: 'パーキンソン病：脳神経内科外来で薬物療法とリハビリ' }),
  teaching: [
    '片側から始まる安静時振戦・動作緩慢・筋強剛・姿勢反射障害はパーキンソン病。便秘・嗅覚低下・レム睡眠行動異常（寝言・手足の動き）が先行することが多い。',
    '薬剤性パーキンソニズム（スルピリド・メトクロプラミド・抗精神病薬）を必ず除外する。',
    '本態性振戦は動作時・姿勢時の両手の震え（飲酒で軽くなる）で、筋強剛・動作緩慢はない。',
    '治療はレボドパやドパミンアゴニスト。メトクロプラミドなどドパミン遮断薬は悪化させる。急な中止は悪性症候群の危険。',
  ],
  sources: ['パーキンソン病診療ガイドライン2018（日本神経学会）', 'MDS Clinical Diagnostic Criteria for Parkinson’s Disease (2015)'],
  ideal: () => [{ a: 'test', ids: ['thyroid'] }, { a: 'rx', drugId: 'levodopa', route: 'po', dose: 100, freq: 'q8h', days: 28 }],
});
