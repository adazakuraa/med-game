// 手根管症候群
// 出典: 日本整形外科学会/日本手外科学会『手根管症候群診療ガイドライン』, AAOS Clinical Practice Guideline (2016)
import { outpatient } from './common.js';
export default outpatient({
  id: 'carpal_tunnel', name: '手根管症候群', dept: '整形外科', weight: 4,
  demo: { age: [40, 75], ageMode: 'uniform', male: 0.25 },
  comorb: { extra: { dm2: 0.2 } },
  vars: (rng) => ({ side: rng.pick(['右', '右', '左']), mo: rng.int(2, 8) }),
  cc: () => '手がしびれる', ccKey: 'numbness',
  history: {
    onset: { p: 1, text: '{mo}か月前から、{side}手の指がしびれます。' },
    numbness: { p: 1, text: '親指・人差し指・中指がしびれます。小指はしびれません。' },
    character: { p: 1, text: '明け方にしびれで目が覚めて、手を振ると楽になります。' },
    aggravating: { p: 1, text: '自転車に乗ったり、スマホを持っているとしびれます。' },
    weakness: { p: 0.4, text: 'ボタンをかけたり、細かい作業がしにくいです。' },
    pmh: { p: 0.6, text: '仕事でパソコンをよく使います。' },
    heatcold: { p: 1, text: '寒がり・むくみはありません。' },
    location: { p: 1, text: '{side}手の親指から中指です。首の痛みはありません。' },
    meds: { p: 1, text: '特に飲んでいません。' },
  },
  exam: { phalen: { p: 1, text: '{side}でPhalenテスト陽性（1分以内にしびれが誘発）、手根管部のTinel徴候陽性。軽い母指球筋の萎縮。' }, motor: { p: 0.3, text: '母指の対立運動がやや弱い。上肢の腱反射は正常。' } },
  natural: -0.003,
  therapies: [{ id: 'tx', label: '夜間の手関節装具・ビタミンB12・手の安静、改善しなければ注射や手根管開放術', req: { fn: (enc, eff) => !!enc.state.procs?.splint || (eff.tags.b12 || 0) > 0 || (eff.tags.nsaid || 0) > 0 }, effect: -0.3, lagH: 6, required: true, deadlineH: [24, 24, 24] }],
  useful: ['hba1c', 'thyroid', 'chem', 'bs_poct'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '手根管症候群：装具などで外来治療。筋萎縮が進めば整形外科で手術を相談' }),
  teaching: [
    '母指〜環指橈側のしびれ（正中神経領域）が夜間・明け方に強く、手を振ると楽になるのは手根管症候群。中年女性・妊娠・透析・糖尿病・甲状腺機能低下症に多い。',
    'Phalenテスト・Tinel徴候。母指球筋の萎縮があれば進行している。診断の確定は神経伝導検査。',
    '首の痛みを伴う・腱反射の異常は頸椎症性神経根症、手袋靴下型のしびれは糖尿病性神経障害を考える。',
    '治療は夜間装具・手の安静・ステロイド注射、改善しなければ手根管開放術。',
  ],
  sources: ['AAOS Management of Carpal Tunnel Syndrome Evidence-Based Clinical Practice Guideline (2016)'],
  ideal: () => [{ a: 'proc', id: 'splint' }, { a: 'test', ids: ['hba1c', 'thyroid'] }],
});
