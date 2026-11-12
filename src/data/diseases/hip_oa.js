// 変形性股関節症
// 出典: 日本整形外科学会『変形性股関節症診療ガイドライン2024（改訂第3版）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'hip_oa', name: '変形性股関節症', dept: '整形外科', weight: 4,
  demo: { age: [50, 80], ageMode: 'uniform', male: 0.15 },
  comorb: { extra: { htn: 0.3 } },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '足の付け根が痛くて歩きにくい', ccKey: 'joint_pain',
  history: {
    onset: { p: 1, text: '数年前から{side}の足の付け根が痛く、最近は長く歩けなくなってきました。' },
    character: { p: 1, text: '歩き始めや長く歩いたときに痛みます。靴下をはく・足の爪を切るのが難しいです。' },
    location: { p: 1, text: '{side}の足の付け根（鼠径部）からお尻、太ももの前です。' },
    joint: { p: 1, text: '{side}の股関節です。' },
    trigger: { p: 0, text: 'けがはしていません。' }, fever: { p: 0, text: '熱はありません。' }, stiffness: { p: 0, text: '朝のこわばりは数分です。' },
    pmh: { p: 1, text: '赤ちゃんのとき、股関節が外れやすいと言われたそうです（先天性股関節脱臼）。' }, meds: { p: 0, text: '' }, alcohol: { p: 0, text: 'お酒はほとんど飲みません。' },
  },
  exam: { joint: { p: 1, text: '{side}股関節の可動域制限（特に屈曲・内旋・外転）と動作時痛、Patrick テストで鼠径部痛。跛行あり。腫脹・熱感なし。' }, hip: { p: 1, text: '{side}鼠径部の圧痛。下肢の短縮は軽度。' } },
  tests: { hip_xr: [{ p: 1, persist: true, text: '{side}股関節の関節裂隙の狭小化、骨棘、臼蓋の形成不全と骨頭の変形（変形性股関節症）。骨折なし。' }], joint_xr: [{ p: 1, persist: true, text: '{side}股関節の関節裂隙の狭小化と骨棘、臼蓋形成不全。' }] },
  natural: -0.01,
  therapies: [{ id: 'tx', label: '鎮痛（アセトアミノフェン・NSAIDs）、運動療法・減量・杖、整形外科で手術（人工股関節）の相談', req: { anyTag: ['analgesic', 'nsaid'] }, effect: -0.3, lagH: 2, required: true, deadlineH: [24, 24, 24] }],
  useful: ['hip_xr', 'joint_xr', 'crp', 'cbc'], key: [['hip_xr', 'joint_xr']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '変形性股関節症：鎮痛と運動療法で外来（日常生活が困難なら人工股関節置換術）' }),
  teaching: [
    '中高年女性の歩き始め・長く歩いた後の鼠径部痛、靴下がはけない（屈曲・内旋の制限）は変形性股関節症。日本では臼蓋形成不全（先天性股関節脱臼の既往）が原因として多い。',
    '鼠径部痛は腰椎疾患（L3・L4）・大腿骨頭壊死（ステロイド・飲酒）・骨折とも区別する。',
    '治療は鎮痛、運動療法（筋力訓練）、減量、杖。進行例は人工股関節置換術で痛みが大きく改善する。',
  ],
  sources: ['変形性股関節症診療ガイドライン2024（日本整形外科学会）'],
  ideal: () => [{ a: 'test', ids: ['hip_xr'] }, { a: 'rx', drugId: 'apap_po', route: 'po', dose: 500, freq: 'q6h', days: 14 }],
});
