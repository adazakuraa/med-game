// 急性歯髄炎（むし歯）
// 出典: 日本歯科保存学会『う蝕治療ガイドライン第2版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'pulpitis', name: '急性歯髄炎（むし歯）', dept: '歯科口腔外科', weight: 4,
  demo: { age: [18, 65], ageMode: 'uniform', male: 0.5 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']), jaw: rng.pick(['上', '下']) }),
  cc: () => '歯がズキズキ痛くて眠れない', ccKey: 'oral',
  history: {
    onset: { p: 1, text: '2日前から{side}{jaw}の奥歯がズキズキ痛み、昨夜は眠れませんでした。' },
    character: { p: 1, text: '冷たいもの・熱いものがしみて、しみた後もしばらくズキズキします。横になると痛みが強くなります。' },
    trigger: { p: 1, text: '前から黒い穴があいていたのに、歯医者に行っていませんでした。' },
    fever: { p: 0, text: '熱はありません。' }, dyspnea: { p: 0, text: '' }, pmh: { p: 0, text: '' },
  },
  exam: { oral_mucosa: { p: 1, text: '{side}{jaw}顎第一大臼歯に大きな齲窩、冷水刺激で強い痛みが持続。歯肉の腫れ・膿・顔の腫れはない。' }, neck_ln: { p: 0, text: '顎下リンパ節の腫脹なし。' } },
  tests: {},
  natural: -0.01,
  therapies: [{ id: 'tx', label: '鎮痛（NSAIDs）と歯科への早めの受診（抜髄などの根管治療）。抗菌薬は不要', req: { anyTag: ['nsaid', 'analgesic'] }, effect: -0.3, lagH: 1, required: true, deadlineH: [12, 12, 12] }],
  useful: [], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '急性歯髄炎：鎮痛して歯科へ（根管治療）' }),
  teaching: [
    '冷温水でしみて、刺激がなくなった後もズキズキ続く・夜間や横になると悪化する歯の痛みは急性歯髄炎（深いむし歯）。',
    '抗菌薬は効かない（細菌感染が歯の中にとどまる）。鎮痛して歯科で抜髄などの根管治療。',
    '歯肉や顔の腫れ・発熱・開口障害・飲み込みにくさは歯性感染症（蜂窩織炎）で、抗菌薬・切開が必要。',
  ],
  sources: ['う蝕治療ガイドライン第2版（日本歯科保存学会）'],
  ideal: () => [{ a: 'rx', drugId: 'loxo', route: 'po', dose: 60, freq: 'q8h', days: 3 }],
});
