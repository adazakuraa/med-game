// アキレス腱断裂
// 出典: 日本整形外科学会『アキレス腱断裂診療ガイドライン2019（改訂第2版）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'achilles', name: 'アキレス腱断裂', dept: '整形外科', weight: 2,
  demo: { age: [30, 55], ageMode: 'uniform', male: 0.7 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']), how: rng.pick(['バドミントンで踏み込んだ瞬間', '子どもの運動会のリレーで走り出した瞬間', 'テニスでダッシュした瞬間']) }),
  cc: (v) => `${v.side}足のかかとの上を痛めた`, ccKey: 'injury',
  history: {
    onset: { p: 1, text: '今日、{how}、{side}足のかかとの上を後ろから蹴られたような衝撃がありました。' },
    character: { p: 1, text: '「バチッ」という音がしました。痛みはそれほど強くないのですが、つま先立ちができず、うまく歩けません。' },
    location: { p: 1, text: '{side}足首の後ろ、かかとの少し上です。' },
    aggravating: { p: 1, text: '足で地面を蹴ろうとすると力が入りません。' },
    trigger: { p: 1, text: '振り返っても誰もいませんでした。ひねってはいません。' },
    syncope: { p: 0, text: '' }, dizziness: { p: 0, text: '' },
  },
  exam: { joint: { p: 1, text: '{side}アキレス腱の踵骨付着部より約4cm近位に陥凹を触れる。腹臥位でふくらはぎをつかんでも足関節が底屈しない（Thompsonテスト陽性）。片脚つま先立ち不能。外果・内果の圧痛なし。' } },
  tests: { joint_xr: [{ p: 1, persist: true, text: '{side}足関節：骨折なし（踵骨の剥離骨折もなし）。Kager脂肪体の不明瞭化。' }] },
  natural: -0.01,
  therapies: [
    { id: 'splint', label: '足関節底屈位でのシーネ固定・松葉杖（荷重させない）', req: { fn: (enc) => !!enc.state.procs?.splint }, effect: -0.2, lagH: 1, required: true, deadlineH: [6, 6, 6] },
    { id: 'ortho', label: '整形外科へ紹介：保存療法（装具）か手術（腱縫合術）を相談', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'ortho') }, effect: -0.3, lagH: 6, required: true, deadlineH: [24, 24, 24] },
  ],
  consult: { ortho: '整形外科：Thompsonテスト陽性のアキレス腱断裂です。底屈位で固定し、松葉杖で帰宅してください。明日の整形外科外来で、装具による保存療法か腱縫合術かを相談します。' },
  useful: ['joint_xr'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: 'アキレス腱断裂：底屈位固定・免荷で帰宅し、整形外科外来で保存療法か手術かを決める' }),
  teaching: [
    'スポーツで踏み込んだ瞬間に「後ろから蹴られた」感じ・断裂音があり、つま先立ちができなければアキレス腱断裂。痛みが軽く歩けてしまうため、捻挫と誤診されやすい。',
    'Thompsonテスト（ふくらはぎをつかんでも足が底屈しない）と腱の陥凹で診断できる。X線は骨折の除外に。',
    '足関節底屈位で固定し免荷。保存療法（装具）と手術（腱縫合術）は再断裂率・復帰時期を考えて選ぶ。',
  ],
  sources: ['アキレス腱断裂診療ガイドライン2019（日本整形外科学会）'],
  ideal: () => [{ a: 'test', ids: ['joint_xr'] }, { a: 'proc', id: 'splint' }, { a: 'consult', dept: 'ortho', delayMin: 1 }, { a: 'wait', min: 70 }],
});
