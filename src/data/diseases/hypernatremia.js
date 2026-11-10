// 高ナトリウム血症（寝たきり高齢者の水分摂取不足）
// 出典: Adrogué HJ, Madias NE. Hypernatremia. N Engl J Med 2000, 日本老年医学会資料
export default {
  id: 'hypernatremia', name: '高ナトリウム血症', dept: '内科',
  weight: 2, season: { summer: 1.5 }, minLevel: 3,
  demo: { age: [80, 98], ageMode: 'old', male: 0.4 },
  sev: { p: [0.35, 0.45, 0.2], burden: [[30, 40], [40, 52], [54, 64]] },
  refractoryP: [0, 0, 0.03],
  comorb: { extra: { dementia: 0.9, old_stroke: 0.4 } },
  organisms: [],
  untreatedFatal: false,
  noPregnancy: true,
  vars: (rng, sev) => ({ naRise: [12, 18, 25][sev] + rng.range(0, 3) }),
  cc: () => '施設で元気がなく、反応が鈍い', ccKey: 'elderly_decline',
  arrival: () => 'ambulance',
  initVolume: [[800, 1200], [1200, 1700], [1600, 2200]],
  history: {
    onset: { p: 1, text: '（施設職員）数日前から元気がなく、今日は呼びかけへの反応が鈍いです。' },
    lastnormal: { p: 1, text: '（施設職員）1週間前までは、声をかけると返事をしていました。' },
    anorexia: { p: 1, text: '（施設職員）最近、食事も水分もあまりとれていませんでした。自分で水を飲むことはできません。' },
    fever: { p: 0.4, text: '（施設職員）先週、少し熱が出ました。' },
    adl: { p: 1, text: '（施設職員）寝たきりで、食事は介助です。' },
    polyuria: { p: 0.3, text: '（施設職員）おむつの尿量は少ないです。' },
    meds: { p: 1, text: '（施設職員）認知症の薬と便秘の薬です。利尿薬はありません。' },
    cough: { p: 0, text: '' }, dysuria: { p: 0, text: '' },
  },
  exam: { gen_consc: { p: 1, bySev: ['ぼんやりしている（JCS 3）。', '呼びかけでかろうじて開眼（JCS 10）。', '痛み刺激で開眼（JCS 20）。'] }, oral_mucosa: { p: 1, text: '舌・口腔粘膜が著明に乾燥。' }, skin_turgor: { p: 0.8, text: '皮膚ツルゴールの低下。' } },
  vitals: { HR: { to: [100, 115], k: 1 }, T: { to: [37.2, 37.8], k: 1 } },
  labs: { BUN: { add: [20, 50], k: 0.8 }, CR: { add: [0.3, 1.2], k: 1 }, CL: { add: [8, 15], k: 1 } },
  labHook: (enc, id, v) => (id === 'NA' ? v + enc.patient.vars.naRise + (enc.state.naShift || 0) : v),
  natural: 0.1,
  dynamics: (enc, eff) => {
    const st = enc.state, p = enc.patient;
    if (st.naShift == null) { st.naShift = 0; st.naStartT = enc.t; }
    const tbw = p.weight * 0.45;
    const na = 141 + p.vars.naRise + st.naShift;
    const liters = (eff.ivRateTotal || 0) / 1000;
    const dNa = liters > 0 ? (((eff.naRate || 0) / liters - na) / (tbw + 1)) * liters : 0;
    st.naShift += dNa / 6;
    if (enc.thStart?.water != null) st.naShift -= 0.25 / 6; // 経管・経口での水分補給の再開
    if (enc.t - st.naStartT <= 1440 && st.naShift < -12) st.comp.cerebral_edema ??= enc.t;
    const target = Math.max(0, (141 + p.vars.naRise + st.naShift - 145) * 2.4);
    return (target - st.burden) * 0.4;
  },
  therapies: [{ id: 'water', label: '自由水の補充（5%ブドウ糖液など、Naは1日10mEq/L以内でゆっくり下げる）', req: { fn: (enc, eff) => eff.dextroseGph >= 3 || enc.orders.some((o) => o.fluidId === 'd5w') }, required: true, deadlineH: [6, 4, 3] }],
  dispo: (enc) => ({ ok: ['admit', 'icu'], best: 'admit', why: '高ナトリウム血症：入院で自由水をゆっくり補充し、原因（感染症など）を治療' }),
  useful: ['chem', 'lab_NA', 'vbg', 'cbc', 'ua', 'bs_poct', 'crp', 'cxr', 'head_ct'],
  key: [['chem', 'lab_NA', 'vbg']],
  extrasOk: () => ['dehydration', 'aki'],
  teaching: [
    '高Na血症は「水が足りない」状態。自分で水を飲めない寝たきり・認知症の高齢者が、発熱や暑さで水分を失うと起こる。',
    '意識障害・けいれんを起こしうる。脱水（BUN/Cr上昇）・感染症の合併を確認する。',
    '治療は自由水（5%ブドウ糖液など）の補充。急に下げると脳浮腫を起こすので、1日10mEq/L以内でゆっくり下げる。',
    '循環不全があれば最初に細胞外液で循環を立て直す。尿崩症・高血糖（浸透圧利尿）も鑑別。',
  ],
  sources: ['Adrogué HJ, Madias NE. Hypernatremia. N Engl J Med 2000'],
  ideal: () => [{ a: 'test', ids: ['chem', 'vbg', 'cbc', 'bs_poct', 'ua'] }, { a: 'fluid', fluidId: 'd5w', mode: 'cont', rate: 100 }],
};
