// 上腕骨外側上顆炎（テニス肘）
// 出典: 日本整形外科学会『上腕骨外側上顆炎診療ガイドライン2019（改訂第2版）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'tennis_elbow', name: '上腕骨外側上顆炎（テニス肘）', dept: '整形外科', weight: 4,
  demo: { age: [35, 60], ageMode: 'uniform', male: 0.5 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '右', '左']), cause: rng.pick(['テニスを始めて', '引っ越しで重い荷物を運んで', '大工仕事で金づちを使って']) }),
  cc: () => '肘の外側が痛い', ccKey: 'joint_pain',
  history: {
    onset: { p: 1, text: '{cause}から、1か月ほど{side}肘の外側が痛みます。' },
    character: { p: 1, text: 'タオルをしぼる・ドアノブを回す・やかんを持ち上げるときに肘の外側が痛みます。じっとしていれば痛くありません。' },
    location: { p: 1, text: '{side}肘の外側です。' },
    joint: { p: 1, text: '{side}肘だけです。腫れてはいません。' },
    trigger: { p: 1, text: '{cause}からです。' },
    stiffness: { p: 0, text: '' }, fever: { p: 0, text: '熱はありません。' }, pmh: { p: 0, text: '' }, alcohol: { p: 0, text: '' }, meds: { p: 0, text: '' },
  },
  exam: { joint: { p: 1, text: '{side}上腕骨外側上顆に限局した圧痛。手関節の抵抗下背屈・中指の伸展で肘外側に痛み（Thomsenテスト・中指伸展テスト陽性）。肘関節の腫脹・可動域制限なし。' } },
  tests: { joint_xr: [{ p: 1, text: '骨・関節に異常なし。', normal: true }] },
  natural: -0.02,
  therapies: [{ id: 'tx', label: '使いすぎを避ける・ストレッチ・NSAIDs外用/内服、肘のバンド', req: { anyTag: ['nsaid', 'analgesic'] }, effect: -0.3, lagH: 6, required: true, deadlineH: [48, 48, 48] }],
  useful: ['joint_xr'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: 'テニス肘：安静・ストレッチ・NSAIDsで外来（多くは1年以内に改善）' }),
  teaching: [
    '物をつかんで持ち上げる・タオルをしぼる動作での肘の外側の痛み、外側上顆の圧痛、抵抗下の手首の背屈で痛む → 上腕骨外側上顆炎（テニス肘）。テニスより家事や仕事が原因のことが多い。',
    '治療は使いすぎを避ける、ストレッチ、NSAIDs、バンド。ステロイド注射は短期的には効くが再発しやすい。',
  ],
  sources: ['上腕骨外側上顆炎診療ガイドライン2019（日本整形外科学会）'],
  ideal: () => [{ a: 'rx', drugId: 'loxo', route: 'po', dose: 60, freq: 'q8h', days: 7 }],
});
