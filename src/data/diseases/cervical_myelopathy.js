// 頸椎症性脊髄症
// 出典: 日本整形外科学会『頚椎症性脊髄症診療ガイドライン2020（改訂第3版）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'cervical_myelopathy', name: '頸椎症性脊髄症', dept: '整形外科', weight: 3,
  demo: { age: [55, 85], ageMode: 'old', male: 0.7 },
  comorb: { extra: { htn: 0.4, dm2: 0.2 } },
  vars: (rng) => ({ mo: rng.int(4, 12) }),
  cc: () => '両手がしびれて、箸がうまく使えない', ccKey: 'numbness',
  history: {
    onset: { p: 1, text: '{mo}か月前から、両手の指がしびれ、だんだんボタンをはめたり箸を使ったりするのが難しくなりました。' },
    numbness: { p: 1, text: '両手の指全体がジンジンしびれます。' },
    character: { p: 1, text: '字が下手になり、物をよく落とします。最近は足がもつれて、階段で手すりが必要です。' },
    location: { p: 1, text: '両手全体と、両足です。' },
    weakness: { p: 1, text: '手に力が入りにくく、足がつっぱって歩きにくいです。' },
    aggravating: { p: 0.5, text: '上を向くと手のしびれが強くなります。' },
    retention: { p: 0.3, text: 'おしっこの出が少し悪くなりました。' },
    speechq: { p: 0, text: 'ろれつは回ります。' }, pmh: { p: 0, text: '糖尿病は言われていません。' }, alcohol: { p: 0, text: '' }, meds: { p: 0, text: '' },
  },
  exam: { motor: { p: 1, text: '両手の巧緻運動障害（10秒テストで握って開くが15回）、手内筋の萎縮、上下肢の腱反射亢進、Hoffmann反射・Babinski反射陽性、痙性歩行。' }, phalen: { p: 0, text: 'Phalenテスト陰性。' }, facial: { p: 0, text: '顔面の左右差なし。' }, speech: { p: 0, text: '構音障害なし。' }, spine: { p: 0.5, text: '頸部の後屈で両手のしびれが増強。' } },
  tests: { spine_xr: [{ p: 1, text: '頸椎の骨棘・椎間板腔の狭小化、脊柱管の前後径が狭い。' }], spine_mri: [{ p: 1, persist: true, text: 'C4/5・C5/6で骨棘と椎間板膨隆による脊髄の圧迫と、脊髄内のT2高信号（頸椎症性脊髄症）。' }], hba1c: [{ p: 1, text: '5.6%（正常）。', normal: true }], b12: [{ p: 1, text: '正常。', normal: true }], ncs: [{ p: 1, text: '末梢神経伝導速度は正常（手根管症候群・末梢神経障害はない）。', normal: true }] },
  natural: 0.01,
  therapies: [{ id: 'ortho', label: '整形外科へ紹介：MRIで評価し、進行する脊髄症は手術（除圧術）。転倒・首の過伸展を避ける', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'ortho' || c.dept === 'nsurg') }, effect: -0.2, lagH: 12, required: true, deadlineH: [72, 72, 48] }],
  consult: { ortho: '整形外科：両手の巧緻運動障害・痙性歩行・病的反射とMRIの脊髄圧迫で、頸椎症性脊髄症です。進行しており、手術（椎弓形成術）を勧めます。転倒や首を強く反らすと急に悪くなる（頸髄損傷）ので注意してください。' },
  useful: ['spine_mri', 'spine_xr', 'hba1c', 'b12', 'ncs', 'thyroid'], key: [['spine_mri']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '頸椎症性脊髄症：整形外科で手術を検討（膀胱障害・急な悪化があれば早急に）' }),
  teaching: [
    '中高年の両手のしびれ・巧緻運動障害（箸・ボタン）・歩行障害（痙性歩行）・腱反射亢進・病的反射は頸椎症性脊髄症。',
    '手根管症候群（親指〜中指、Phalen陽性、反射正常）、末梢神経障害（手袋靴下型、反射低下）、ALSと区別する。',
    'MRIで脊髄の圧迫とT2高信号。進行する場合は手術。転倒で中心性頸髄損傷を起こしやすい。',
  ],
  sources: ['頚椎症性脊髄症診療ガイドライン2020（日本整形外科学会）'],
  ideal: () => [{ a: 'test', ids: ['spine_mri', 'hba1c', 'b12'] }, { a: 'consult', dept: 'ortho', delayMin: 1 }, { a: 'wait', min: 70 }],
});
