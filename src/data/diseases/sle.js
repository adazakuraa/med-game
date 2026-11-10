// 全身性エリテマトーデス（SLE）
// 出典: 日本リウマチ学会ほか『全身性エリテマトーデス診療ガイドライン2019』, 2019 EULAR/ACR分類基準
import { outpatient } from './common.js';
export default outpatient({
  id: 'sle', name: '全身性エリテマトーデス（SLE）', dept: '膠原病内科', weight: 2, minLevel: 2,
  demo: { age: [18, 40], ageMode: 'young', male: 0.1 },
  sev: { p: [0.5, 0.4, 0.1], burden: [[24, 32], [32, 42], [42, 52]] },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '熱と関節の痛み、顔に発疹', ccKey: 'joint_pain',
  history: {
    onset: { p: 1, text: '1か月前から37〜38度の熱と、手や膝の関節の痛みが続いています。' },
    character: { p: 1, text: '日に当たると頬が赤くなり、髪が抜けやすくなりました。口内炎もできます。' },
    joint: { p: 1, text: '手指・手首・膝の関節が痛みますが、あまり腫れていません。' },
    fever: { p: 1, text: '37〜38度の熱が続きます。' },
    stiffness: { p: 0.4, text: '少し朝こわばります。' },
    fatigue: { p: 1, text: 'だるいです。' },
    pmh: { p: 1, text: '持病はありません。' },
    trigger: { p: 1, text: '夏に海に行ってから悪くなりました。' },
    location: { p: 1, text: '両手の指・手首・膝です。' },
    alcohol: { p: 0, text: '' }, meds: { p: 0, text: '' },
  },
  exam: { skin: { p: 1, text: '両頬から鼻背にかけての蝶形紅斑。脱毛。' }, oral_mucosa: { p: 0.8, text: '硬口蓋に無痛性の潰瘍。' }, joint: { p: 1, text: '手指・手関節の圧痛。明らかな腫脹・変形はない。' } },
  vitals: { T: { to: [37.5, 38.3], k: 1 } },
  labs: { WBC: { to: [2500, 3200], k: 0 }, PLT: { mul: [0.5, 0.8], k: 0 }, HB: { add: [-2.5, -1], k: 0 }, CRP: { to: [0.2, 1], k: 0 }, ESR: { to: [50, 90], k: 0 }, U_PRO: { to: [1, 2], k: 0 } },
  tests: { ana: [{ p: 1, persist: true, text: '抗核抗体 1280倍（均質型・斑紋型）、抗dsDNA抗体 高値、抗Sm抗体 陽性。補体（C3・C4・CH50）低下。' }], upcr: [{ p: 0.6, persist: true, text: '尿蛋白 0.8 g/gCr、沈渣で赤血球円柱（ループス腎炎の疑い）。' }] },
  natural: 0.02,
  therapies: [{ id: 'tx', label: '膠原病内科コンサルト→ヒドロキシクロロキンとステロイド（臓器障害の評価・腎生検）', req: { fn: (enc, eff) => (eff.tags.hcq || 0) > 0 || (eff.tags.steroid_sys || 0) > 0 || enc.consults.some((c) => c.dept === 'rheum') }, effect: -0.4, lagH: 12, required: true, deadlineH: [48, 24, 24] }],
  useful: ['ana', 'cbc', 'chem', 'ua', 'upcr', 'crp', 'esr', 'cxr', 'echo', 'uhcg'], key: [['ana'], ['cbc'], ['ua', 'upcr']],
  dispo: (enc) => (enc.patient.sev >= 1 ? { ok: ['admit', 'home'], best: 'admit', why: '腎炎などの臓器障害を伴うSLE：入院で精査・治療' } : { ok: ['home', 'admit'], best: 'home', why: '皮膚・関節中心のSLE：膠原病内科外来で治療' }),
  teaching: [
    '若い女性の発熱・関節痛・蝶形紅斑・光線過敏・口腔潰瘍・脱毛・血球減少（白血球・血小板）はSLEを疑う。',
    '抗核抗体（感度が高い）、抗dsDNA抗体・抗Sm抗体（特異度が高い）、低補体。CRPはあまり上がらない（上がれば感染症を考える）。',
    'ループス腎炎（蛋白尿・赤血球円柱）・中枢神経・血液の重い病変を評価する。',
    '治療はヒドロキシクロロキンが基本。臓器障害にはステロイドと免疫抑制薬。日光を避ける。',
  ],
  sources: ['全身性エリテマトーデス診療ガイドライン2019（日本リウマチ学会ほか）'],
  ideal: () => [{ a: 'test', ids: ['ana', 'cbc', 'chem', 'ua', 'upcr', 'crp'] }, { a: 'consult', dept: 'rheum', delayMin: 1 }, { a: 'wait', min: 70 }],
});
