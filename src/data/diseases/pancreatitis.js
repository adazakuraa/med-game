// 急性膵炎
// 出典: 急性膵炎診療ガイドライン2021（日本膵臓学会ほか）
export default {
  id: 'pancreatitis', name: '急性膵炎', dept: '消化器内科',
  weight: 4, season: {}, minLevel: 2,
  demo: { age: [30, 80], ageMode: 'uniform', male: 0.65 },
  sev: { p: [0.45, 0.35, 0.2], burden: [[25, 35], [40, 52], [56, 67]] },
  refractoryP: [0, 0.03, 0.06],
  comorb: { extra: { htn: 0.3, dyslip: 0.3, dm2: 0.15 } },
  organisms: [],
  vars: (rng, sev, pt) => {
    const alcohol = pt.sex === 'M' ? rng.chance(0.7) : rng.chance(0.25);
    return { alcohol, forceAlcohol: alcohol, hours: rng.int(6, 24), grade: [1, 2, 3][sev] };
  },
  cc: () => '上腹部の激しい痛み',
  ccKey: 'abd_pain',
  arrival: (sev) => (sev === 0 ? 'walk' : 'ambulance'),
  initVolume: [[800, 1500], [1500, 2500], [2500, 3800]],
  history: {
    onset: { p: 1, text: '{hours}時間ほど前から、みぞおちが痛くなりました。' },
    course: { p: 1, text: '痛みがどんどん強くなって、ずっと続いています。' },
    character: { p: 1, text: 'みぞおちから背中に突き抜けるような、ずっと続く強い痛みです。' },
    location: { p: 1, text: 'みぞおちです。' },
    radiation: { p: 0.75, text: '背中まで痛みが突き抜けます。' },
    severity: { p: 1, bySev: ['7くらいです。', '8くらいです。', '10です。'] },
    relieving: { p: 0.6, text: '体を丸めて前かがみになると少し楽です。' },
    abdpain: { p: 1, text: 'みぞおちが痛いです。' },
    nausea: { p: 0.85, text: '何度も吐きました。' },
    fever: { p: 0.4, text: '37度台の熱があります。' },
    trigger: { p: 1, text: '{trigText}' },
    alcohol: { p: 1, ifVar: 'alcohol', text: '毎日、焼酎を3〜4合飲みます。昨日もたくさん飲みました。' },
    pmh: { p: 0.4, text: '胆石があると言われたことがあります。' },
  },
  postVars: (v) => { v.trigText = v.alcohol ? '昨晩、いつもよりたくさんお酒を飲みました。' : '昨晩、脂っこい食事をしました。'; },
  exam: {
    gen_appear: { p: 1, bySev: ['前かがみになって痛がっている。', '痛みが強く、ぐったりしている。', '顔色不良で呼吸が速い。'] },
    abd_palp: { p: 1, text: '心窩部〜上腹部に強い圧痛。' },
    abd_guard: { p: [0.1, 0.3, 0.6], text: '上腹部に軽度の筋性防御。' },
    abd_ausc: { p: 0.6, text: '腸蠕動音の減弱。' },
    skin: { p: [0, 0, 0.3], text: '側腹部に皮下出血斑（Grey-Turner徴候）。' },
    oral_mucosa: { p: 0.7, text: '口腔粘膜は乾燥。' },
  },
  vitals: { HR: { to: [110, 130], k: 0.8 }, RR: { to: [22, 30], k: 1.2 }, T: { to: [37.6, 38.6], k: 0.8 }, SBP: { to: [72, 85], k: 2.5 }, SpO2: { drop: [3, 10], k: 2 } },
  labs: {
    AMY: { to: [600, 2500], k: 0.3 }, LIP: { to: [900, 4000], k: 0.3 }, WBC: { to: [13000, 20000], k: 0.7 }, CRP: { to: [5, 25], k: 1.2 },
    GLU: { add: [30, 90], k: 1 }, LAC: { to: [2.5, 5], k: 2.5 }, CR: { add: [0.2, 1.2], k: 1.8 }, TBIL: { add: [0.3, 2], k: 1, p: 0.35 }, ALT: { add: [20, 150], k: 1, p: 0.35 },
    HB: { add: [0.5, 1.5], k: 1 },
  },
  tests: {
    abd_ct_contrast: [{ p: 0.95, persist: true, text: '膵のびまん性腫大と膵周囲の液体貯留・脂肪織濃度上昇（造影CT Grade {grade}）。' }, { p: [0, 0.2, 0.7], text: '膵実質の一部に造影不良域（膵壊死）。' }],
    abd_ct_plain: [{ p: 0.85, persist: true, text: '膵腫大と膵周囲の液体貯留。' }],
    abd_us: [{ p: 0.5, text: '膵は腫大して見える（腸管ガスで観察不良）。' }],
    cxr: [{ p: [0, 0.2, 0.5], text: '左胸水。' }],
  },
  natural: 0,
  therapies: [
    { id: 'fluid', label: '十分な初期輸液（細胞外液）', req: { fluidTotal: 1500 }, required: true, deadlineH: [4, 3, 3] },
    { id: 'pain', label: '十分な鎮痛（アセトアミノフェン・オピオイドなど）', req: { anyTag: ['analgesic', 'opioid'] }, required: true, deadlineH: [2, 1, 1] },
  ],
  fluidLoss: (b) => 40 * (b / 40),
  canDrink: () => false,
  dynamics: (enc, eff) => {
    const st = enc.state;
    let d = st.volume > 1800 ? 0.6 : -0.6;
    if (enc.patient.sev === 2 && st.volume > 1500) d += 0.4;
    if (eff.tags.analgesic || eff.tags.opioid) d -= 0.1;
    return d;
  },
  harmTags: { abx: '軽症〜中等症の急性膵炎に予防的抗菌薬は推奨されない' },
  dispo: (enc) => (enc.patient.sev === 2 ? { ok: ['icu'], best: 'icu', why: '重症急性膵炎：ICU（重症度判定・造影CT Grade）' } : { ok: ['admit', 'icu'], best: 'admit', why: '急性膵炎：入院（十分な輸液と鎮痛）' }),
  useful: ['cbc', 'chem', 'crp', 'vbg', 'coag', 'abd_ct_contrast', 'abd_ct_plain', 'abd_us', 'cxr', 'ecg', 'lab_AMY', 'ua', 'tnt'],
  key: [['chem'], ['abd_ct_contrast', 'abd_ct_plain', 'abd_us']],
  extrasOk: (enc, ctx) => (ctx.initVit.SBP < 90 ? ['sepsis'] : []),
  teaching: [
    '上腹部の持続痛（背部に放散、前かがみで軽快）＋膵酵素（リパーゼ・アミラーゼ）が基準の3倍以上＋画像所見の2つ以上で急性膵炎と診断する。',
    '原因はアルコールと胆石が2大原因。飲酒歴と胆石の有無を確認する。',
    '治療の柱は十分な輸液と鎮痛。脱水・腎障害を防ぐため初期に積極的に輸液する（過剰輸液にも注意）。',
    '重症度は厚生労働省の重症度判定基準と造影CT Gradeで評価。重症はICU管理。',
    '軽症〜中等症への予防的抗菌薬は推奨されない。胆石性で胆管炎を合併すれば内視鏡的な胆道ドレナージ。',
  ],
  sources: ['急性膵炎診療ガイドライン2021（日本膵臓学会ほか）'],
  ideal: (p) => [
    { a: 'test', ids: ['cbc', 'chem', 'crp', 'vbg', 'abd_ct_contrast'] },
    { a: 'fluid', fluidId: 'lr', mode: 'bolus', volume: 1000 },
    { a: 'fluid', fluidId: 'lr', mode: 'cont', rate: 200 },
    { a: 'rx', drugId: 'apap_iv', route: 'iv', dose: p.weight >= 50 ? 1000 : 600, freq: 'q6h', days: 3 },
    { a: 'npo' },
  ],
};
