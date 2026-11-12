// クローン病
// 出典: 厚生労働省 難治性炎症性腸管障害に関する調査研究班『潰瘍性大腸炎・クローン病 診断基準・治療指針（令和5年度改訂版）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'crohn', name: 'クローン病', dept: '消化器内科', weight: 2,
  demo: { age: [16, 30], ageMode: 'young', male: 0.7 },
  sev: { p: [0.5, 0.4, 0.1], burden: [[22, 30], [30, 38], [38, 46]] },
  comorb: { extra: {} },
  vars: (rng) => ({ mo: rng.int(3, 8), kg: rng.int(4, 9) }),
  cc: () => '下痢と腹痛が続き、やせてきた', ccKey: 'bowel',
  history: {
    onset: { p: 1, text: '{mo}か月前から、1日4〜5回の下痢と、右下腹部の痛みが続いています。' },
    character: { p: 1, text: '水っぽい下痢で、食べると右下腹部が痛くなります。' },
    diarrhea: { p: 1, text: '1日4〜5回の下痢です。血はあまり混じりません。' },
    weightloss: { p: 1, text: 'この半年で{kg}kgやせました。' },
    fever: { p: 0.5, text: '夕方に37度台の熱が出ます。' },
    abdpain: { p: 1, text: '右下腹部が痛みます。' },
    bloodystool: { p: 0.2, text: '時々、少し血が混じります。' },
    constipation: { p: 0, text: '便秘はありません。' },
    pmh: { p: 1, text: '去年、痔ろうの手術を受けました。口内炎がよくできます。' },
    family: { p: 0, text: '' }, travel: { p: 0, text: '海外には行っていません。' }, meds: { p: 0, text: '' },
  },
  exam: { abd_palp: { p: 1, text: '右下腹部に圧痛と、軽い腫瘤感。腹膜刺激徴候なし。' }, rectal: { p: 0.6, text: '肛門周囲に痔瘻の手術痕と、新しい皮垂（スキンタグ）。' }, oral_mucosa: { p: 0.5, text: 'アフタ性口内炎。' }, conjunctiva: { p: 0.5, text: '眼瞼結膜はやや蒼白。' } },
  labs: { CRP: { to: [2, 6], k: 0 }, ALB: { add: [-1.2, -0.6], k: 0 }, HB: { add: [-2.5, -1.2], k: 0 }, PLT: { mul: [1.3, 1.6], k: 0 }, ESR: { to: [35, 60], k: 0 } },
  tests: { abd_ct_contrast: [{ p: 1, persist: true, text: '回腸末端の全周性の壁肥厚と狭窄、周囲の脂肪織の濃度上昇（クローン病を疑う）。膿瘍なし。' }], stool_cx: [{ p: 1, text: '病原菌は検出されない。' }], fobt: [{ p: 1, text: '便潜血陽性。' }], cdiff: [{ p: 1, text: 'CDトキシン陰性。' }] },
  natural: -0.005,
  therapies: [{ id: 'gi', label: '消化器内科へ紹介：大腸内視鏡（回腸末端）と生検で確定し、栄養療法・5-ASA・生物学的製剤などで治療', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'gi') }, effect: -0.2, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  consult: { gi: '消化器内科：若年者の慢性下痢・右下腹部痛・体重減少・痔瘻の既往、CTで回腸末端の壁肥厚から、クローン病を強く疑います。大腸内視鏡で回腸末端の縦走潰瘍・敷石像を確認し、生検します。治療は栄養療法と、重症度に応じて生物学的製剤を検討します。禁煙も大切です。' },
  useful: ['cbc', 'chem', 'crp', 'esr', 'abd_ct_contrast', 'stool_cx', 'fobt', 'cdiff', 'abd_us', 'ferritin'], key: [['cbc', 'chem', 'crp'], ['abd_ct_contrast', 'abd_us']],
  dispo: () => ({ ok: ['home', 'admit'], best: 'home', why: '狭窄・膿瘍のないクローン病：消化器内科外来で内視鏡と治療開始' }),
  teaching: [
    '10〜20代の慢性の下痢・右下腹部痛・体重減少・発熱、痔瘻・肛門病変・口内炎があればクローン病を疑う。',
    '口から肛門まで消化管のどこにでも飛び飛びに起こる全層性の炎症（回盲部に多い）。狭窄・瘻孔・膿瘍を作る。',
    '大腸内視鏡（縦走潰瘍・敷石像）と生検（非乾酪性肉芽腫）で診断。感染性腸炎・腸結核を除外する。',
    '治療は栄養療法、5-ASA、ステロイド、免疫調節薬、生物学的製剤。喫煙は悪化因子。',
  ],
  sources: ['潰瘍性大腸炎・クローン病 診断基準・治療指針（令和5年度改訂版）'],
  ideal: () => [{ a: 'test', ids: ['cbc', 'chem', 'crp', 'stool_cx', 'abd_ct_contrast'] }, { a: 'consult', dept: 'gi', delayMin: 1 }, { a: 'wait', min: 70 }],
});
