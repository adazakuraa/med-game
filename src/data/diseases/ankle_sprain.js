// 足関節捻挫（前距腓靱帯損傷）
// 出典: 日本整形外科学会 資料, Ottawa ankle rules (Stiell IG, et al. JAMA 1993)
import { outpatient } from './common.js';
export default outpatient({
  id: 'ankle_sprain', name: '足関節捻挫', dept: '整形外科', weight: 5,
  demo: { age: [16, 55], ageMode: 'young', male: 0.55 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']), how: rng.pick(['バスケットボールの着地で', '階段を踏み外して', 'ランニング中に段差で']) }),
  cc: (v) => `${v.side}足首をひねった`, ccKey: 'injury',
  history: {
    onset: { p: 1, text: '今日、{how}{side}足首を内側にひねりました。' },
    character: { p: 1, text: '足首の外側が腫れて痛いです。' },
    location: { p: 1, text: '{side}足首の外くるぶしの前あたりです。' },
    aggravating: { p: 1, text: '体重をかけると痛いですが、なんとか4歩以上は歩けます。' },
    trigger: { p: 1, text: '内側にグキッとひねりました。' },
    syncope: { p: 0, text: '' }, dizziness: { p: 0, text: '' },
  },
  exam: { joint: { p: 1, text: '{side}外果の前下方（前距腓靱帯）に腫脹・圧痛・皮下出血。外果の後縁・先端や第5中足骨基部に圧痛はない（Ottawa ankle rules陰性）。' } },
  tests: {},
  natural: -0.05,
  therapies: [{ id: 'rice', label: 'RICE（安静・冷却・圧迫・挙上）と固定（シーネ・サポーター）、鎮痛', req: { fn: (enc, eff) => !!enc.state.procs?.splint || (eff.tags.nsaid || 0) > 0 }, effect: -0.5, lagH: 1, required: true, deadlineH: [3, 3, 3] }],
  useful: ['joint_xr'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '足関節捻挫：固定・RICE・鎮痛で帰宅。数日たっても歩けなければ整形外科を再診' }),
  teaching: [
    '足関節の内がえし捻挫では前距腓靱帯の損傷が多い。',
    'Ottawa ankle rules：外果・内果の後縁や先端の圧痛、舟状骨・第5中足骨基部の圧痛、受傷直後と診察時に4歩歩けない、のいずれもなければ骨折は否定的でX線は不要。',
    '治療はRICE（安静・冷却・圧迫・挙上）、固定、鎮痛。早期から可動域・筋力訓練。重度の靱帯損傷は整形外科で評価。',
  ],
  sources: ['Stiell IG, et al. Implementation of the Ottawa ankle rules. JAMA 1994'],
  ideal: () => [{ a: 'proc', id: 'splint' }, { a: 'rx', drugId: 'loxo', route: 'po', dose: 60, freq: 'q8h', days: 5 }],
});
