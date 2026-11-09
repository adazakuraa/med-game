// 関節リウマチ
// 出典: 日本リウマチ学会『関節リウマチ診療ガイドライン2024』, 2010 ACR/EULAR分類基準
import { outpatient } from './common.js';
export default outpatient({
  id: 'ra', name: '関節リウマチ', dept: '膠原病内科', weight: 4,
  demo: { age: [35, 70], ageMode: 'uniform', male: 0.25 },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '手の指の関節が腫れて痛い', ccKey: 'joint_pain',
  history: {
    onset: { p: 1, text: '2か月前から両手の指の付け根と手首が腫れて痛みます。' },
    character: { p: 1, text: '両手の同じところが痛く、腫れています。' },
    location: { p: 1, text: '両手の指の付け根（MCP関節）・指の第2関節（PIP関節）・手首です。' },
    joint: { p: 1, text: '両手の小さな関節が左右対称に腫れています。' },
    stiffness: { p: 1, text: '朝起きると手がこわばって、1時間以上動かしにくいです。' },
    fever: { p: 0.2, text: '微熱があります。' },
    fatigue: { p: 0.6, text: 'だるいです。' },
    trigger: { p: 0, text: '' }, alcohol: { p: 0, text: '' },
    pmh: { p: 1, text: '持病はありません。' },
    meds: { p: 1, text: '市販の痛み止めを飲んでいます。' },
  },
  exam: { joint: { p: 1, text: '両側の第2・3 MCP関節、PIP関節、手関節に圧痛と腫脹（滑膜炎）。DIP関節は正常。' }, skin: { p: 0.2, text: '肘の伸側に皮下結節。' } },
  labs: { CRP: { to: [1.5, 4], k: 0 }, ESR: { to: [40, 70], k: 0 } },
  tests: { rf_ccp: [{ p: 1, persist: true, text: 'RF 陽性（85 IU/mL）、抗CCP抗体 強陽性（>100 U/mL）。' }], joint_xr: [{ p: 0.5, persist: true, text: '手のMCP関節周囲の骨粗鬆化と小さな骨びらん。' }] },
  natural: -0.002,
  therapies: [{ id: 'tx', label: 'メトトレキサートを中心とした早期の抗リウマチ薬治療（膠原病内科と連携）', req: { fn: (enc, eff) => (eff.tags.dmard || 0) > 0 || enc.consults.some((c) => c.dept === 'rheum') }, effect: -0.3, lagH: 12, required: true, deadlineH: [48, 24, 24] }],
  useful: ['rf_ccp', 'crp', 'esr', 'cbc', 'chem', 'joint_xr', 'ua', 'ana', 'cxr', 'hep_virus'], key: [['rf_ccp'], ['crp', 'esr']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '関節リウマチ：膠原病内科外来で早期にメトトレキサートを開始（関節破壊を防ぐ）' }),
  teaching: [
    '手の小関節（MCP・PIP・手関節）の左右対称の腫れ・痛みと、1時間以上続く朝のこわばりは関節リウマチ。中年女性に多い。',
    '抗CCP抗体・RF、CRP・赤沈。発症早期の治療で関節破壊を防げる（window of opportunity）。',
    'DIP関節の変形は変形性関節症（ヘバーデン結節）が多い。',
    '治療の中心はメトトレキサート（開始前に肝炎ウイルス・結核・胸部X線・腎機能を確認）。効果不十分なら生物学的製剤など。',
  ],
  sources: ['関節リウマチ診療ガイドライン2024（日本リウマチ学会）'],
  ideal: () => [{ a: 'test', ids: ['rf_ccp', 'crp', 'esr', 'cbc', 'chem', 'cxr', 'hep_virus'] }, { a: 'consult', dept: 'rheum', delayMin: 1 }, { a: 'wait', min: 70 }],
});
