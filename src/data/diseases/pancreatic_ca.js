// 膵頭部がん（無痛性黄疸）
// 出典: 日本膵臓学会『膵癌診療ガイドライン2022年版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'pancreatic_ca', name: '膵がん（膵頭部）', dept: '消化器内科', weight: 2, minLevel: 2,
  demo: { age: [60, 85], ageMode: 'old', male: 0.55 },
  smokeP: 0.45,
  comorb: { extra: { dm2: 0.4 } },
  vars: () => ({}),
  cc: () => '体が黄色くなり、かゆい', ccKey: 'jaundice',
  history: {
    onset: { p: 1, text: '2週間前から目や皮膚が黄色くなり、全身がかゆいです。' },
    course: { p: 1, text: 'だんだん黄色くなっています。' },
    character: { p: 1, text: '尿が濃く、便が白っぽいです。お腹はあまり痛くありません。' },
    weightloss: { p: 1, text: '2か月で6kgやせました。' },
    abdpain: { p: 0.3, text: '背中が少し重い感じがします。' },
    fever: { p: 0, text: '熱はありません。' }, chills: { p: 0, text: '' }, nausea: { p: 0, text: '' }, travel: { p: 0, text: '' },
    pmh: { p: 1, text: '最近、糖尿病が急に悪くなったと言われました。' },
    alcohol: { p: 1, text: 'お酒は少しです。' }, meds: { p: 1, text: '糖尿病の薬だけです。' },
  },
  exam: { conjunctiva: { p: 1, text: '眼球結膜の黄染。' }, skin: { p: 1, text: '皮膚の黄染と掻き傷。' }, abd_palp: { p: 0.6, text: '右季肋部に腫大した無痛性の胆嚢を触れる（Courvoisier徴候）。' }, murphy: { p: 1, text: 'Murphy徴候は陰性。' } },
  labs: { TBIL: { add: [6, 12], k: 0 }, GGT: { add: [300, 800], k: 0 }, ALT: { add: [60, 150], k: 0 }, AST: { add: [40, 120], k: 0 }, GLU: { add: [40, 100], k: 0 } },
  tests: { abd_us: [{ p: 1, persist: true, text: '胆嚢腫大と総胆管・肝内胆管の拡張、主膵管の拡張。膵頭部は観察しにくい。結石はない。' }], abd_ct_contrast: [{ p: 1, persist: true, text: '膵頭部に約3cmの境界不明瞭な乏血性腫瘤。その上流の総胆管・主膵管の拡張（double duct sign）。' }] },
  natural: -0.002,
  therapies: [{ id: 'gi', label: '消化器内科へ：造影CT・超音波内視鏡で診断、黄疸には胆道ドレナージ、手術の可否の判断', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'gi') }, effect: -0.2, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  consult: { gi: '消化器内科：膵頭部がんによる閉塞性黄疸を強く疑います。超音波内視鏡下の生検で診断し、ERCPで胆管ステントを留置して黄疸を改善させてから、手術または化学療法を判断します。' },
  useful: ['chem', 'cbc', 'abd_us', 'abd_ct_contrast', 'hba1c', 'coag'], key: [['chem'], ['abd_us', 'abd_ct_contrast']],
  dispo: () => ({ ok: ['home', 'admit'], best: 'admit', why: '閉塞性黄疸を伴う膵がんの疑い：入院で胆道ドレナージと精査' }),
  teaching: [
    '痛みのない黄疸（無痛性黄疸）・体重減少・かゆみ・糖尿病の急な悪化は膵頭部がんを疑う。',
    '腫大した無痛性の胆嚢（Courvoisier徴候）。造影CTで膵頭部の乏血性腫瘤と胆管・膵管の拡張（double duct sign）。',
    '総胆管結石は痛みを伴うことが多い。発熱・悪寒があれば胆管炎として緊急ドレナージ。',
  ],
  sources: ['膵癌診療ガイドライン2022年版（日本膵臓学会）'],
  ideal: () => [{ a: 'test', ids: ['chem', 'cbc', 'abd_us', 'abd_ct_contrast'] }, { a: 'consult', dept: 'gi', delayMin: 1 }, { a: 'wait', min: 70 }],
});
