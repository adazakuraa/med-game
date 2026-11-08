// 低ナトリウム血症（サイアザイド系利尿薬・高齢者）
// 出典: 日本内分泌学会『バソプレシン分泌過剰症（SIADH）の診断と治療の手引き』, European Clinical Practice Guideline on Hyponatraemia (2014)
export default {
  id: 'hyponatremia', name: '低ナトリウム血症', dept: '内科',
  weight: 5, season: { summer: 1.3 }, minLevel: 2,
  demo: { age: [70, 95], ageMode: 'old', male: 0.3 },
  sev: { p: [0.35, 0.45, 0.2], burden: [[25, 35], [40, 52], [60, 72]] },
  refractoryP: [0, 0, 0],
  comorb: { forced: ['htn'], extra: { dementia: 0.2, dyslip: 0.3, ckd: 0.15 } },
  organisms: [],
  untreatedFatal: false,
  vars: (rng, sev, pt) => {
    pt.homeMeds.push('thiazide');
    return { naDrop: -[14, 20, 27][sev] - rng.range(0, 4), days: rng.int(3, 7) };
  },
  cc: () => '食欲がなく、ふらつく',
  ccKey: 'elderly_decline',
  arrival: (sev) => (sev === 2 ? 'ambulance' : 'walk'),
  history: {
    onset: { p: 1, text: '（家族）{days}日前から食欲がなく、ふらふらしています。' },
    character: { p: 1, text: '（家族）なんとなく元気がなくて、ぼーっとしています。' },
    anorexia: { p: 1, text: '（家族）ほとんど食べていません。' },
    nausea: { p: 0.6, text: '（家族）吐き気があるようです。' },
    dizziness: { p: 0.8, text: '（家族）歩くとふらついて、昨日は転びそうになりました。' },
    headache: { p: 0.3, text: '頭が重いです。' },
    seizure: { p: [0, 0, 0.4], text: '（家族）さっき、手足をガクガクさせてけいれんしました。' },
    diet: { p: 1, text: '（家族）暑いので水をたくさん飲むようにしていて、塩分は控えめにしています。' },
    meds: { p: 1, text: '（家族）血圧の薬を2種類飲んでいます。最近、利尿薬が追加になりました。' },
    adl: { p: 1, text: '（家族）普段は一人で身の回りのことができています。' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['やや元気がない。', 'ぼんやりしている。', '傾眠傾向。'] },
    neuro_basic: { p: 0.3, text: '明らかな局所神経症状なし。歩行がふらつく。' },
  },
  vitals: { HR: { to: [80, 92], k: 1 } },
  labs: { CL: { add: [-12, -6], k: 1 }, K: { add: [-0.9, -0.4], k: 1 } },
  labHook: (enc, id, v) => (id === 'NA' ? v + enc.patient.vars.naDrop + (enc.state.naShift || 0) : v),
  tests: { head_ct: [] },
  natural: 0,
  therapies: [
    { id: 'hts', label: 'けいれん・意識障害を伴う重症：3%食塩水（100〜150mL）', req: { fn: (enc) => enc.orders.some((o) => o.fluidId === 'ns3') }, required: (enc) => enc.patient.sev === 2, deadlineH: [99, 99, 1] },
  ],
  dynamics: (enc, eff) => {
    const st = enc.state, p = enc.patient;
    if (st.naShift == null) { st.naShift = 0; st.naStartT = enc.t; }
    const tbw = p.weight * 0.45;
    const na = 141 + p.vars.naDrop + st.naShift;
    // 輸液によるNaの変化（Adrogue-Madias式に準じる）
    const liters = (eff.ivRateTotal || 0) / 1000;
    let dNa = liters > 0 ? (((eff.naRate || 0) / liters - na) / (tbw + 1)) * liters : 0;
    dNa += 0.12; // サイアザイドの中止と食事摂取による緩やかな改善
    st.naShift += dNa / 6;
    if (enc.t - st.naStartT <= 1440 && st.naShift > 12) st.comp.ods ??= enc.t;
    const target = Math.max(0, (133 - (141 + p.vars.naDrop + st.naShift)) * 4);
    return (target - st.burden) * 0.5;
  },
  canDrink: () => true,
  dispo: (enc) => (enc.patient.sev === 2 ? { ok: ['icu', 'admit'], best: 'icu', why: '重症（けいれん・意識障害）：ICUで3%食塩水とNaの頻回測定' } : { ok: ['admit'], best: 'admit', why: '症状のある低Na血症：入院（原因薬の中止とゆっくりした補正）' }),
  useful: ['chem', 'lab_NA', 'vbg', 'cbc', 'ua', 'bs_poct', 'head_ct', 'ecg', 'lab_K'],
  key: [['chem', 'lab_NA', 'vbg']],
  extrasOk: () => [],
  teaching: [
    '高齢者の「食欲低下・ふらつき・ぼんやり」では低Na血症を考える。サイアザイド系利尿薬・水の飲みすぎ・塩分制限が典型的な誘因。',
    'けいれん・意識障害などの重症症状があれば、3%食塩水を少量（100〜150mL）ずつ投与してNaを4〜6mEq/L上げる。',
    '補正は24時間で10mEq/L（高リスクは8）を超えない。急に上げすぎると浸透圧性脱髄症候群（不可逆な神経障害）になる。',
    '原因薬（サイアザイド）の中止、体液量の評価（脱水か・正常か・過剰か）で原因を考える。',
  ],
  sources: ['European Clinical Practice Guideline on diagnosis and treatment of hyponatraemia (2014)', 'バソプレシン分泌過剰症（SIADH）の診断と治療の手引き（日本内分泌学会）'],
  ideal: (p) => [
    { a: 'test', ids: ['chem', 'vbg', 'bs_poct'] },
    { a: 'fluid', fluidId: 'ns3', mode: 'bolus', volume: 150, when: 'sev2' },
  ],
};
