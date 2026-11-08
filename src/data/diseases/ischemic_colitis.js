// 虚血性大腸炎
// 出典: 日本消化器病学会ほか（消化器病診療 第2版）, ACG Clinical Guideline: Colon Ischemia (2015)
import { outpatient } from './common.js';
export default outpatient({
  id: 'ischemic_colitis', name: '虚血性大腸炎', dept: '消化器内科', weight: 4,
  demo: { age: [55, 88], ageMode: 'old', male: 0.25 },
  comorb: { forced: ['constip'], extra: { htn: 0.6, dm2: 0.25, dyslip: 0.4 } },
  sev: { p: [0.5, 0.4, 0.1], burden: [[22, 30], [30, 40], [40, 50]] },
  cc: () => '腹痛と血便', ccKey: 'abd_pain',
  history: {
    onset: { p: 1, text: '昨日、便秘気味で強くいきんだ後に、急に左下腹部が痛くなりました。' },
    course: { p: 1, text: 'その後、何度か下痢をして、血が混じるようになりました。' },
    character: { p: 1, text: '左のお腹が差し込むように痛みます。' },
    location: { p: 1, text: '左の下腹部です。' },
    abdpain: { p: 1, text: '左下腹部が痛いです。' },
    diarrhea: { p: 1, text: '下痢を何回かしました。' },
    bloodystool: { p: 1, text: '鮮やかな赤い血が混じった下痢です。' },
    fever: { p: 0.2, text: '37度台の微熱です。' },
    constipation: { p: 1, text: '普段から便秘がちです。' },
  },
  exam: { abd_palp: { p: 1, text: '左下腹部に圧痛。腹膜刺激徴候なし。' }, rectal: { p: 0.8, text: '直腸診で指に血液が付着。' } },
  vitals: { HR: { to: [90, 100], k: 1 } },
  labs: { WBC: { to: [10000, 14000], k: 1 }, CRP: { to: [1, 6], k: 1 } },
  tests: { abd_ct_contrast: [{ p: 0.85, persist: true, text: '下行結腸〜S状結腸の壁肥厚（区域性）。腸管の造影は保たれている。遊離ガスなし。' }], abd_ct_plain: [{ p: 0.7, persist: true, text: '下行結腸の壁肥厚。' }] },
  natural: -0.25,
  therapies: [{ id: 'rest', label: '腸管安静（絶食または低残渣食）と補液', req: { fn: (enc, eff) => eff.npo || eff.ivRateTotal > 0 }, required: false, deadlineH: [99, 99, 99] }],
  dispo: (enc) => (enc.patient.sev === 0 ? { ok: ['home', 'admit'], best: 'admit', why: '軽症でも腹痛・血便が強ければ入院で腸管安静（軽症は外来も可）' } : { ok: ['admit'], best: 'admit', why: '虚血性大腸炎：入院で腸管安静・補液' }),
  useful: ['cbc', 'crp', 'chem', 'abd_ct_contrast', 'abd_ct_plain', 'coag', 'lab_LAC', 'vbg', 'stool_cx'], key: [['abd_ct_contrast', 'abd_ct_plain'], ['cbc']],
  harmTags: { abx: '軽症の虚血性大腸炎に抗菌薬は通常不要' },
  teaching: [
    '便秘の高齢女性が、いきんだ後に突然の左下腹部痛→下痢→血便となるのは虚血性大腸炎の典型。',
    '多くは腸管安静と補液で数日で改善する。CTで区域性の壁肥厚、確定は大腸内視鏡。',
    '強い腹痛に比べて所見が乏しい・乳酸上昇・心房細動があれば、致死的な腸間膜動脈閉塞症（腸間膜虚血）を疑い造影CTを急ぐ。',
  ],
  sources: ['ACG Clinical Guideline: Epidemiology, Risk Factors, Patterns of Presentation, Diagnosis, and Management of Colon Ischemia (2015)'],
  ideal: () => [{ a: 'test', ids: ['cbc', 'crp', 'chem', 'abd_ct_contrast'] }, { a: 'npo' }, { a: 'fluid', fluidId: 'sol3', mode: 'cont', rate: 80 }],
});
