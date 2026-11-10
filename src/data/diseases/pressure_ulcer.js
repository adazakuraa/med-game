// 褥瘡（感染を伴う）
// 出典: 日本褥瘡学会『褥瘡予防・管理ガイドライン第5版』
import { T } from './common.js';
export default {
  id: 'pressure_ulcer', name: '褥瘡（感染）', dept: '皮膚科',
  weight: 3, season: {}, minLevel: 2,
  demo: { age: [75, 95], ageMode: 'old', male: 0.45 },
  sev: { p: [0.4, 0.45, 0.15], burden: [[26, 34], [34, 44], [46, 56]] },
  refractoryP: [0, 0.02, 0.05], comorb: { extra: { dementia: 0.6, old_stroke: 0.5, dm2: 0.3 } }, organisms: ['gpc', 'ecoli', 'anaerobe'], minAbxDays: 7,
  vars: () => ({}),
  cc: () => 'お尻の傷がくさく、熱がある（寝たきり）', ccKey: 'skin_lesion',
  arrival: (sev) => (sev === 2 ? 'ambulance' : 'walk'),
  history: {
    onset: { p: 1, text: '（施設職員）1か月前から仙骨部に床ずれがあり、3日前から赤く腫れて膿とにおいが出て、昨日から熱があります。' },
    character: { p: 1, text: '（施設職員）傷が深くなり、黒い部分が増えています。' },
    location: { p: 1, text: '（施設職員）お尻の真ん中（仙骨部）です。' },
    fever: { p: [0.4, 0.8, 1], text: '（施設職員）38度の熱があります。' },
    itch: { p: 0, text: '' }, trigger: { p: 1, text: '（施設職員）寝たきりで、体位変換は1日数回です。食事量が減っています。' },
    meds: { p: 1, text: '（施設職員）塗り薬を使っています。' }, pmh: { p: 1, text: '（施設職員）脳梗塞の後遺症で寝たきりです。' }, family: { p: 0, text: '' },
  },
  exam: { skin: { p: 1, text: '仙骨部に6×5cmの深い潰瘍、黒色壊死組織と膿・悪臭、周囲の発赤・熱感・腫脹（感染した褥瘡、DESIGN-R重度）。' }, gen_appear: { p: 1, text: 'やせて、栄養状態が悪い。' } },
  vitals: { T: { to: [37.8, 38.8], k: 0.5 }, HR: { to: [95, 115], k: 1 } },
  labs: { WBC: { to: [11000, 18000], k: 0.7 }, CRP: { to: [5, 15], k: 0.7 }, ALB: { add: [-1.5, -0.8], k: 0 }, HB: { add: [-2, -1], k: 0 } },
  tests: { bcx: [{ p: 0.3, text: '2セット中1セットからProteus mirabilis。' }] },
  natural: 0.3,
  therapies: [
    T.abx(['gpc', 'ecoli', 'anaerobe'], '抗菌薬（周囲の蜂窩織炎・発熱があるとき）', [24, 12, 6], -0.3, 8),
    { id: 'debride', label: '壊死組織の除去（デブリードマン）と創処置', req: { fn: (enc) => !!enc.state.procs?.wound_care || !!enc.state.procs?.incision }, required: true, deadlineH: [48, 24, 24], effect: -0.4, lagH: 2 },
    { id: 'care', label: '除圧（体位変換・マットレス）と栄養の改善', req: { fn: () => true }, required: false, deadlineH: [72, 72, 72] },
  ],
  dispo: (enc) => (enc.patient.sev >= 1 ? { ok: ['admit'], best: 'admit', why: '感染した褥瘡：入院で抗菌薬・デブリードマン・栄養管理' } : { ok: ['home', 'admit'], best: 'home', why: '軽い褥瘡：施設で除圧と創処置（往診・訪問看護）' }),
  useful: ['cbc', 'crp', 'chem', 'bcx', 'joint_xr', 'bs_poct'],
  key: [['cbc', 'crp'], ['chem']],
  extrasOk: () => ['cellulitis'],
  teaching: [
    '寝たきり・低栄養・失禁・知覚障害の人の骨突出部（仙骨・踵・大転子）に褥瘡ができる。',
    '発赤・腫脹・熱感・膿・悪臭・発熱は感染のサイン。深い褥瘡は骨髄炎も考える。',
    '治療：壊死組織の除去・洗浄・適切な外用、感染があれば抗菌薬。何より除圧（体位変換・エアマットレス）と栄養。',
  ],
  sources: ['褥瘡予防・管理ガイドライン第5版（日本褥瘡学会）'],
  ideal: (p) => [{ a: 'test', ids: ['cbc', 'crp', 'chem', 'bcx'] }, { a: 'proc', id: 'wound_care' }, { a: 'rx', drugId: 'abpc_sbt', route: 'iv', dose: 3000, freq: 'q6h', days: 7, when: 'sev>=1' }, { a: 'rx', drugId: 'amox_clav', route: 'po', dose: 375, freq: 'q8h', days: 7, when: 'sev0' }],
};
