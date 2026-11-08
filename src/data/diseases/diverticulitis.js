// 大腸憩室炎
// 出典: 日本消化管学会『大腸憩室症（憩室出血・憩室炎）ガイドライン2017』
import { T } from './common.js';
export default {
  id: 'diverticulitis', name: '大腸憩室炎', dept: '消化器内科',
  weight: 5, season: {}, minLevel: 1,
  demo: { age: [35, 85], ageMode: 'uniform', male: 0.55 },
  sev: { p: [0.55, 0.35, 0.1], burden: [[20, 30], [32, 45], [50, 62]] },
  refractoryP: [0, 0, 0.05],
  comorb: { extra: { htn: 0.3, dyslip: 0.25, constip: 0.3 } },
  organisms: ['ecoli', 'anaerobe'], minAbxDays: 5,
  vars: (rng, sev, pt) => {
    const right = pt.age < 55 ? rng.chance(0.7) : rng.chance(0.25);
    return { right, loc: right ? '右下腹部' : '左下腹部', seg: right ? '上行結腸' : 'S状結腸', days: rng.int(1, 3) };
  },
  cc: () => '腹痛', ccKey: 'abd_pain',
  arrival: () => 'walk',
  history: {
    onset: { p: 1, text: '{days}日前から{loc}が痛みます。' },
    character: { p: 1, text: '{loc}がずっと鈍く痛みます。' },
    location: { p: 1, text: '{loc}です。' },
    migration: { p: 1, text: '最初からずっと{loc}です。' },
    fever: { p: [0.5, 0.8, 0.95], text: '37度台後半の熱があります。' },
    abdpain: { p: 1, text: '{loc}が痛いです。' },
    anorexia: { p: 0.4, text: '食欲は少し落ちています。' },
    nausea: { p: 0.3, text: '少し吐き気があります。' },
    diarrhea: { p: 0.3, text: '便が少しゆるいです。' },
    pmh: { p: 0.4, text: '以前、大腸カメラで憩室があると言われました。' },
  },
  exam: {
    gen_appear: { p: 1, text: '痛そうだが歩ける。' },
    abd_palp: { p: 1, text: '{loc}に限局した圧痛。' },
    abd_rebound: { p: [0.2, 0.4, 0.8], text: '{loc}に反跳痛。' },
    mcburney: { p: 1, ifVar: 'right', text: 'McBurney点よりやや頭側に圧痛。' },
  },
  vitals: { T: { to: [37.8, 38.8], k: 0.7 }, HR: { to: [95, 110], k: 1 } },
  labs: { WBC: { to: [11000, 16000], k: 0.7 }, CRP: { to: [5, 18], k: 0.9 } },
  tests: {
    abd_ct_contrast: [{ p: 0.95, persist: true, text: '{seg}に憩室が多発し、周囲の脂肪織濃度上昇と腸管壁肥厚（憩室炎）。膿瘍・遊離ガスなし。虫垂は正常。' }],
    abd_ct_plain: [{ p: 0.85, persist: true, text: '{seg}の憩室と周囲脂肪織濃度上昇。' }],
    abd_us: [{ p: 0.6, text: '{loc}に憩室と周囲の高エコー（炎症）。虫垂は正常。' }],
  },
  natural: 0.25,
  therapies: [T.abx(['ecoli', 'anaerobe'], '抗菌薬（腸内細菌＋嫌気性菌）', [12, 8, 3], -0.9, 6)],
  dispo: (enc) => (enc.patient.sev === 0 ? { ok: ['home', 'admit'], best: 'home', why: '軽症・経口摂取可能：外来で経口抗菌薬（またはなしで経過観察）' } : { ok: ['admit'], best: 'admit', why: '発熱・腹膜刺激徴候・経口摂取困難：入院' }),
  useful: ['cbc', 'crp', 'chem', 'abd_ct_contrast', 'abd_ct_plain', 'abd_us', 'ua', 'uhcg'],
  key: [['abd_ct_contrast', 'abd_ct_plain', 'abd_us'], ['cbc', 'crp']],
  extrasOk: () => [],
  teaching: [
    '日本人は右側（上行結腸）の憩室炎も多く、虫垂炎と間違えやすい。痛みの移動がなく、最初から右下腹部が痛む。高齢者は左側（S状結腸）が多い。',
    '診断は造影CT（憩室と周囲の炎症、膿瘍・穿孔の有無）。',
    '軽症は外来で経口抗菌薬（アモキシシリン・クラブラン酸など）や絶食なしで経過観察も選択肢。膿瘍・穿孔があれば入院・ドレナージ・手術。',
    '治った後に大腸内視鏡で大腸がんを除外する。',
  ],
  sources: ['大腸憩室症（憩室出血・憩室炎）ガイドライン2017（日本消化管学会）'],
  ideal: (p) => [
    { a: 'test', ids: ['cbc', 'crp', 'abd_ct_contrast'] },
    { a: 'rx', drugId: p.sev === 0 ? 'amox_clav' : 'cmz', route: p.sev === 0 ? 'po' : 'iv', dose: p.sev === 0 ? 375 : 1000, freq: 'q8h', days: 7 },
  ],
};
