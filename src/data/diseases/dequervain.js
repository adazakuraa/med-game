// ドケルバン病（狭窄性腱鞘炎）
// 出典: 日本整形外科学会 症状・病気をしらべる「ドケルバン病」
import { outpatient } from './common.js';
export default outpatient({
  id: 'dequervain', name: 'ドケルバン病', dept: '整形外科', weight: 3,
  demo: { age: [25, 60], ageMode: 'uniform', male: 0.15 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']), cause: rng.pick(['赤ちゃんを抱っこする', 'スマートフォンを片手で長時間操作する', 'パソコン作業や手芸をする']) }),
  cc: () => '手首の親指側が痛い', ccKey: 'joint_pain',
  history: {
    onset: { p: 1, text: '1か月前から{side}手首の親指側が痛くなりました。' },
    character: { p: 1, text: '親指を動かしたり、物をつかんだりすると手首の親指側に痛みが走ります。' },
    location: { p: 1, text: '{side}手首の親指側です。' },
    joint: { p: 1, text: '{side}手首だけです。' },
    trigger: { p: 1, text: '毎日{cause}ことが多いです。' },
    stiffness: { p: 0, text: '朝のこわばりはありません。' }, fever: { p: 0, text: '熱はありません。' }, pmh: { p: 0, text: '' }, alcohol: { p: 0, text: '' }, meds: { p: 0, text: '' },
  },
  exam: { joint: { p: 1, text: '{side}橈骨茎状突起部（第1区画）の腫脹と圧痛。親指を握り込んで手首を小指側に曲げると激痛（Finkelsteinテスト陽性）。解剖学的嗅ぎタバコ窩の圧痛なし。' } },
  tests: { joint_xr: [{ p: 1, text: '骨折・関節症変化なし。', normal: true }] },
  natural: -0.02,
  therapies: [{ id: 'tx', label: '手の安静（装具）・NSAIDs、改善しなければ腱鞘内ステロイド注射', req: { anyTag: ['nsaid', 'analgesic'] }, effect: -0.3, lagH: 6, required: true, deadlineH: [48, 48, 48] }],
  useful: ['joint_xr'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: 'ドケルバン病：手の安静とNSAIDs、腱鞘内注射で外来' }),
  teaching: [
    '手首の親指側の痛みで、Finkelsteinテスト陽性ならドケルバン病（短母指伸筋腱・長母指外転筋腱の腱鞘炎）。',
    '育児中・妊娠出産期・更年期の女性、手の使いすぎ（スマートフォン・パソコン）に多い。',
    '転倒後の同じ部位の痛みは舟状骨骨折（嗅ぎタバコ窩の圧痛）を除外する。',
  ],
  sources: ['日本整形外科学会 症状・病気をしらべる「ドケルバン病」'],
  ideal: () => [{ a: 'rx', drugId: 'loxo', route: 'po', dose: 60, freq: 'q8h', days: 7 }],
});
