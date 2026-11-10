// 腱板断裂
// 出典: 日本整形外科学会 症状・病気をしらべる「腱板断裂」, 日本肩関節学会
import { outpatient } from './common.js';
export default outpatient({
  id: 'rotator_cuff', name: '腱板断裂', dept: '整形外科', weight: 3,
  demo: { age: [50, 80], ageMode: 'old', male: 0.6 },
  comorb: { extra: { htn: 0.3 } },
  vars: (rng) => ({ side: rng.pick(['右', '右', '左']), how: rng.pick(['転んで肩から手をついてから', '重い荷物を持ち上げてから', '特にきっかけなく']) }),
  cc: () => '肩が痛くて腕が上がらない', ccKey: 'joint_pain',
  history: {
    onset: { p: 1, text: '3週間前、{how}{side}肩が痛くなりました。' },
    character: { p: 1, text: '自分で腕を横から上げようとすると、途中で痛くて力が入らず、上がりません。反対の手で持ち上げてもらえば上がります。' },
    location: { p: 1, text: '{side}肩の外側です。' },
    joint: { p: 1, text: '{side}肩だけです。ほかの関節は痛くありません。' },
    aggravating: { p: 1, text: '腕を上げるときと、夜その肩を下にして寝るとき。' },
    trigger: { p: 1, text: '{how}です。' },
    fever: { p: 0, text: '' }, stiffness: { p: 0, text: '' }, chestpain: { p: 0, text: '' },
  },
  exam: { joint: { p: 1, text: '{side}肩：自動挙上は90度で痛みのため不能だが、他動では挙上可能（可動域は保たれる）。棘上筋テスト陽性、drop arm sign陽性。腫脹・熱感なし。' } },
  tests: { joint_xr: [{ p: 0.6, text: '{side}肩：骨折・脱臼なし。肩峰骨頭間距離の軽度狭小化。' }] },
  natural: -0.02,
  therapies: [
    { id: 'pain', label: '鎮痛（NSAIDs）・安静', req: { anyTag: ['analgesic', 'nsaid'] }, effect: -0.2, lagH: 1, required: true, deadlineH: [24, 24, 24] },
    { id: 'ortho', label: '整形外科へ紹介：MRI・超音波で断裂を評価し、リハビリまたは手術（腱板修復術）', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'ortho') }, effect: -0.2, lagH: 12, required: true, deadlineH: [48, 48, 48] },
  ],
  consult: { ortho: '整形外科：自動挙上できず他動では上がり、drop arm sign陽性で、腱板断裂を疑います。外来でMRIを撮り、保存療法（リハビリ・注射）か、若い方や外傷性の大きな断裂なら腱板修復術を検討します。' },
  useful: ['joint_xr', 'ecg'], key: [['joint_xr']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '腱板断裂：鎮痛と整形外科外来（MRIで評価し、リハビリか手術）' }),
  teaching: [
    '肩の痛みで「自分では上げられないが、他人が持ち上げると上がる」（自動挙上不能・他動可動域は保たれる）は腱板断裂。drop arm sign・棘上筋テスト。',
    '肩関節周囲炎（五十肩）は自動・他動ともに動かない。この違いが鑑別の鍵。',
    'X線では骨折・脱臼・石灰沈着を除外し、断裂はMRI・超音波で確認する。',
    '高齢者の変性断裂はリハビリ中心、若年者・外傷性の大きな断裂は手術を検討。',
  ],
  sources: ['日本整形外科学会 症状・病気をしらべる「腱板断裂」'],
  ideal: () => [{ a: 'test', ids: ['joint_xr'] }, { a: 'rx', drugId: 'loxo', route: 'po', dose: 60, freq: 'q8h', days: 14 }, { a: 'consult', dept: 'ortho', delayMin: 1 }, { a: 'wait', min: 70 }],
});
