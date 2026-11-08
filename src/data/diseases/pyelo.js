// 急性腎盂腎炎（大腸菌）
// 出典: JAID/JSC感染症治療ガイド2023, 日本感染症学会・日本化学療法学会 尿路感染症ガイドライン, 各薬剤添付文書
import { sepsisExtras } from './common.js';

export default {
  id: 'pyelo', name: '急性腎盂腎炎', dept: '内科',
  weight: 8, season: { summer: 1.2 }, minLevel: 1,
  demo: { age: [18, 85], ageMode: 'uniform', male: 0.15 },
  sev: { p: [0.45, 0.4, 0.15], burden: [[22, 38], [42, 58], [64, 78]] },
  refractoryP: [0, 0.02, 0.06],
  comorb: { extra: { htn: 0.25, dm2: 0.2, ckd: 0.08, constip: 0.2, dyslip: 0.15 } },
  organisms: ['ecoli'],
  minAbxDays: 7,
  vars: (rng) => {
    const esbl = rng.chance(0.13);
    const fqR = esbl ? rng.chance(0.8) : rng.chance(0.3);
    const sbtR = esbl ? true : rng.chance(0.35);
    const s = (r) => (r ? 'R' : 'S');
    return {
      side: rng.pick(['右', '左']), days: rng.int(1, 3),
      res: { esbl, fqR, sbtR },
      organism: esbl ? 'Escherichia coli（ESBL産生）' : 'Escherichia coli',
      susc: `感受性: ABPC R, ABPC/SBT ${s(sbtR)}, CEZ ${s(esbl)}, CTRX ${s(esbl)}, CMZ S, MEPM S, LVFX ${s(fqR)}`,
    };
  },
  cc: () => '発熱と腰の痛み',
  ccKey: 'fever_flank',
  arrival: (sev) => (sev === 2 ? 'ambulance' : 'walk'),
  history: {
    onset: { p: 1, text: '{days}日前からおしっこの時に少ししみて、昨日から熱が出てきました。' },
    course: { p: 1, bySev: ['熱が下がらず、腰も痛くなってきました。', '熱が高くて、吐き気も出てきました。', '今朝からふらふらで、起き上がれなくなりました。'] },
    character: { p: 1, text: '{side}の腰から背中にかけて、重く鈍い痛みがあります。' },
    location: { p: 1, text: '{side}の腰のあたりです。' },
    flankpain: { p: 0.9, text: '{side}の腰が痛いです。' },
    severity: { p: 1, bySev: ['5くらいです。', '6くらいです。', '8くらいです。'] },
    fever: { p: 0.95, texts: ['39度近い熱があります。', '38度台後半です。'] },
    chills: { p: 0.7, text: 'ガタガタ震えるような寒気がありました。' },
    dysuria: { p: 0.55, text: '数日前から、おしっこの時にしみる感じがあります。' },
    frequency: { p: 0.5, text: 'トイレが近くて、出た後もすっきりしません。' },
    hematuria: { p: 0.15, text: '少し濁っていた気がします。' },
    nausea: { p: [0.3, 0.45, 0.6], text: '吐き気があります。1回吐きました。' },
    anorexia: { p: 0.6, text: '食欲はあまりありません。' },
    myalgia: { p: 0.3, text: '全身がだるいです。' },
    trigger: { p: 0.3, text: '忙しくてトイレを我慢することが多かったです。' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['発熱でややつらそうだが会話は可能。', 'ぐったりしている。', '顔色不良でぐったりしている。'] },
    cva: { p: 0.88, text: '{side}CVA叩打痛陽性。' },
    abd_palp: { p: 0.3, text: '恥骨上部に軽度の圧痛。腹膜刺激徴候なし。' },
  },
  vitals: { T: { to: [39.0, 40.2], k: 0.4 }, HR: { to: [115, 135], k: 0.8 }, RR: { to: [24, 30], k: 1.2 }, SBP: { to: [68, 82], k: 2.2 }, SpO2: { drop: [3, 6], k: 2 } },
  labs: {
    WBC: { to: [16000, 25000], k: 0.6 }, NEUT: { to: [84, 92], k: 0.5 }, CRP: { to: [20, 32], k: 0.55 }, PCT: { to: [3, 30], k: 1.8 },
    CR: { add: [0.3, 1.1], k: 2 }, BUN: { add: [6, 18], k: 1.6 }, PLT: { mul: [0.45, 0.7], k: 2 }, LAC: { to: [3.5, 6.5], k: 2.5 },
    NA: { add: [-4, -1], k: 1.5 }, TBIL: { add: [0.3, 1.2], k: 2, p: 0.4 },
    U_LEU: { ord: [3, 4], p: 0.95 }, U_NIT: { ord: [1, 1], p: 0.55 }, U_BLD: { ord: [2, 3], p: 0.45 }, U_PRO: { ord: [2, 2], p: 0.5 },
    U_WBC: { to: [50, 100], k: 0.2, p: 0.95 }, U_BACT: { ord: [2, 3], p: 0.9 }, U_RBC: { to: [5, 20], k: 0.3, p: 0.4 },
  },
  tests: {
    urine_gram: [{ p: 0.9, text: 'グラム陰性桿菌を多数認める。白血球多数、貪食像あり。' }],
    ucx: [{ p: 0.93, text: '{organism} ≧10^5 CFU/mL。{susc}' }],
    bcx: [{ p: [0.2, 0.3, 0.45], text: '2セット中2セットからグラム陰性桿菌。同定: {organism}。{susc}' }],
    abd_us: [{ p: 0.3, text: '{side}腎はやや腫大。水腎症なし。結石は指摘できない。' }],
    abd_ct_contrast: [{ p: 0.8, text: '{side}腎に楔状の造影不良域と腎周囲脂肪織濃度上昇。膿瘍・水腎症なし。' }],
    abd_ct_plain: [{ p: 0.5, text: '{side}腎周囲脂肪織濃度上昇。水腎症・結石なし。' }],
  },
  natural: 0.5,
  therapies: [
    { id: 'abx', label: '原因菌（大腸菌）に有効な抗菌薬', req: { coverage: ['ecoli'] }, effect: -1.4, lagH: 4, required: true, deadlineH: [8, 4, 1] },
    { id: 'fluid', label: '初期輸液（敗血症性低血圧/高乳酸）', req: { fluidTotal: 1000 }, when: (c) => c.vit.SBP < 90 || c.lab('LAC') >= 4, required: true, deadlineH: [3, 3, 3], startFromNeed: true },
  ],
  dispo: (enc, ctx) => {
    const v = ctx.initVit;
    if (v.SBP < 90 || ctx.initLab('LAC') >= 4) return { ok: ['icu'], best: 'icu', why: '敗血症性ショック：ICU管理' };
    if (enc.patient.pregnant) return { ok: ['admit'], best: 'admit', why: '妊婦の腎盂腎炎：入院治療' };
    if (enc.patient.sev === 0) return { ok: ['home', 'admit'], best: 'home', why: '軽症で経口摂取可能：外来治療可' };
    return { ok: ['admit', 'icu'], best: 'admit', why: '嘔気・全身状態不良：入院治療' };
  },
  useful: ['cbc', 'chem', 'crp', 'pct', 'vbg', 'ua', 'used', 'urine_gram', 'ucx', 'bcx', 'abd_us', 'abd_ct_contrast', 'abd_ct_plain', 'uhcg', 'lab_LAC', 'coag'],
  key: [['ua', 'used'], ['ucx'], ['cbc'], ['chem']],
  extrasOk: sepsisExtras,
  consult: { uro: '泌尿器科：画像上、水腎症・結石はなく閉塞起点はなさそうです。ドレナージ不要、抗菌薬治療を継続し、培養結果で狭域化を検討してください。' },
  teaching: [
    '発熱＋CVA叩打痛＋膿尿で腎盂腎炎を疑い、治療開始前に尿培養（敗血症疑いでは血液培養も）を採取する。',
    '国内の大腸菌はキノロン耐性やESBL産生株が増えている。培養の感受性結果を確認し、無効なら速やかに変更する。',
    'ESBL産生菌にはセフメタゾールやカルバペネムが有効。治療反応が乏しいときは耐性菌や閉塞（水腎症・結石）を疑う。',
    '妊娠可能年齢の女性では妊娠反応を確認する（レボフロキサシンは妊婦禁忌、CTの被ばくにも配慮）。',
  ],
  sources: ['JAID/JSC感染症治療ガイド2023', '日本版敗血症診療ガイドライン2024（J-SSCG2024）', '各薬剤 添付文書'],
  ideal: (p) => [
    { a: 'test', ids: ['cbc', 'chem', 'crp', 'ua', 'used', 'urine_gram', 'ucx', 'bcx', 'abd_us'].concat(p.sex === 'F' && p.age < 50 ? ['uhcg'] : []) },
    { a: 'fluid', fluidId: 'lr', mode: 'bolus', volume: 1000, when: 'sev2' },
    { a: 'rx', drugId: p.vars.res.esbl ? 'cmz' : 'ctrx', route: 'iv', dose: p.vars.res.esbl ? 1000 : 2000, freq: p.vars.res.esbl ? 'q8h' : 'q24h', days: 10 },
    { a: 'rx', drugId: 'norad', route: 'iv', dose: 0.1, freq: 'cont', days: 3, when: 'sbp<90' },
  ],
};
