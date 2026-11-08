// 急性胃腸炎（ノロウイルス）
// 出典: JAID/JSC感染症治療ガイド2023（腸管感染症）, 厚生労働省 ノロウイルスに関するQ&A, 各薬剤添付文書
import { sepsisExtras } from './common.js';

export default {
  id: 'gastro', name: '急性胃腸炎（ウイルス性）', dept: '内科',
  weight: 10, season: { winter: 2.0, summer: 0.6 }, minLevel: 1,
  demo: { age: [16, 88], ageMode: 'uniform', male: 0.5 },
  sev: { p: [0.5, 0.35, 0.15], burden: [[30, 40], [40, 50], [50, 60]] },
  refractoryP: [0, 0, 0.02],
  comorb: { extra: { htn: 0.25, dm2: 0.12, ckd: 0.1, dyslip: 0.15 } },
  organisms: [],
  vars: (rng) => ({
    hours: rng.int(10, 30), vomits: rng.int(4, 10), stools: rng.int(5, 12),
    food: rng.pick(['2日前に牡蠣を生で', '一昨日の会食で刺身や生ものを', '特別なものは食べていませんが、家族と同じ食事を']),
    familySick: rng.chance(0.5),
  }),
  cc: () => '嘔吐と下痢',
  ccKey: 'vomit_diarrhea',
  arrival: (sev) => (sev === 2 ? 'ambulance' : 'walk'),
  initVolume: [[700, 1300], [1500, 2400], [2600, 3800]],
  history: {
    onset: { p: 1, text: '{hours}時間ほど前に急に吐き始めて、そのあと下痢になりました。' },
    course: { p: 1, bySev: ['吐くのは少し落ち着いてきましたが、下痢が続いています。', '吐き気と下痢が止まらず、水分もとれません。', '水も吐いてしまって、立つとふらふらします。'] },
    character: { p: 1, text: '何度も吐いて、水のような下痢です。お腹がギューッと痛くなる波があります。' },
    location: { p: 1, text: 'お腹全体がなんとなく痛いです。' },
    nausea: { p: 0.97, text: '何度も吐いています（{vomits}回くらい）。' },
    diarrhea: { p: 0.92, text: '水のような下痢が{stools}回くらいです。' },
    abdpain: { p: 0.75, text: 'お腹全体がしくしく痛みます。波があります。' },
    fever: { p: 0.5, text: '37度台の微熱です。' },
    chills: { p: 0.2, text: '少し寒気がしました。' },
    anorexia: { p: 0.9, text: '食欲は全くありません。' },
    myalgia: { p: 0.35, text: '体がだるいです。' },
    dizziness: { p: [0.2, 0.55, 0.9], text: '立ち上がるとふらつきます。' },
    headache: { p: 0.2, text: '少し頭が痛いです。' },
    polyuria: { p: 0.4, text: '喉が渇きます。おしっこはあまり出ていません。' },
    food: { p: 0.85, text: '{food}食べました。' },
    sickcontact: { p: 0.5, text: '家族も昨日から同じように吐いたり下したりしています。' },
    relieving: { p: 0.3, text: '吐いた後は少し楽になります。' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['やや疲れた様子。', 'ぐったりしている。', '顔色不良でぐったりしている。'] },
    abd_palp: { p: 0.65, text: '腹部全体に軽度の圧痛。限局した圧痛や腫瘤なし。' },
    abd_ausc: { p: 0.75, text: '腸蠕動音は亢進。' },
  },
  vitals: { T: { to: [37.6, 38.4], k: 0.6 }, HR: { to: [88, 98], k: 1 }, RR: { to: [18, 22], k: 1 } },
  labs: {
    WBC: { to: [10500, 14000], k: 0.8 }, NEUT: { to: [75, 85], k: 0.6 }, CRP: { to: [1.5, 4.5], k: 1 },
    K: { add: [-1.1, -0.6], k: 1 }, CL: { add: [2, 5], k: 1 }, HCO3: { add: [-6, -3], k: 1 }, AMY: { add: [0, 30], k: 1, p: 0.3 },
    U_KET: { ord: [2, 3], p: 0.7 }, U_PRO: { ord: [1, 2], p: 0.3 },
  },
  tests: {
    abd_us: [{ p: 0.6, text: '小腸〜大腸に液体貯留と蠕動亢進。虫垂の腫大なし。腹水なし。' }],
    abd_ct_plain: [{ p: 0.55, text: '小腸〜大腸に液体貯留、軽度の壁肥厚。虫垂は正常径。遊離ガスなし。' }],
    abd_ct_contrast: [{ p: 0.6, text: '小腸〜大腸に液体貯留と軽度の壁肥厚・粘膜濃染。虫垂は正常。遊離ガスなし。' }],
    axr: [{ p: 0.4, text: '小腸〜大腸にガス像散見。明らかなニボーなし。' }],
  },
  natural: -0.6,
  fluidLoss: (b) => 60 * (b / 45),
  canDrink: (b, eff) => b < (eff.tags.antiemetic ? 60 : 50),
  therapies: [
    { id: 'fluid', label: '補液（脱水の補正）', req: { fluidTotal: 1000 }, when: (c) => c.state.volume > 1500, required: true, deadlineH: [3, 2, 1], startFromNeed: true },
  ],
  dispo: (enc, ctx) => {
    const p = enc.patient;
    if (p.sev === 2 || (p.age >= 75 && p.sev >= 1)) return { ok: ['admit'], best: 'admit', why: '高度脱水・経口摂取不能（または高齢）：入院で補液' };
    if (p.sev === 1) return { ok: ['home', 'admit'], best: 'home', why: '点滴で改善し経口摂取可能なら外来' };
    return { ok: ['home'], best: 'home', why: '軽症：経口補水で外来' };
  },
  useful: ['cbc', 'chem', 'crp', 'vbg', 'ua', 'abd_us', 'uhcg', 'lab_K', 'lab_NA', 'lab_CR', 'lab_BUN', 'ecg'],
  key: [['chem', 'vbg', 'lab_CR', 'lab_BUN']],
  extrasOk: (enc, ctx) => ['dehydration'].concat(sepsisExtras(enc, ctx).filter((x) => x === 'aki')),
  harmTags: { abx: '抗菌薬はウイルス性胃腸炎に無効（耐性菌・副作用のリスク）' },
  consult: { gi: '消化器内科：腹膜刺激徴候はなく、ウイルス性胃腸炎として矛盾しません。補液・対症療法で、抗菌薬は不要です。' },
  teaching: [
    'ウイルス性胃腸炎の治療の中心は脱水の補正。経口補水が可能なら経口、困難なら点滴で補液する。',
    '抗菌薬は無効であり、不要な投与は耐性菌や副作用のリスクとなる。',
    '高齢者・血便・高熱・強い腹痛・腹膜刺激徴候があれば、細菌性腸炎や虫垂炎など他疾患の鑑別を行う。',
    '嘔吐・下痢の後に脱水があるときはNSAIDsで急性腎障害を起こしやすい。',
  ],
  sources: ['JAID/JSC感染症治療ガイド2023', '厚生労働省 ノロウイルスに関するQ&A', '各薬剤 添付文書'],
  ideal: (p) => [
    { a: 'test', ids: ['chem', 'cbc'] },
    { a: 'fluid', fluidId: 'lr', mode: 'bolus', volume: 1000, when: 'vol>1500' },
    { a: 'rx', drugId: 'mcp', route: 'iv', dose: 10, freq: 'once', days: 1 },
    { a: 'fluid', fluidId: 'sol3', mode: 'cont', rate: 80, when: 'sev>=1' },
  ],
};
