// 高カリウム血症（慢性腎臓病・薬剤性）
// 出典: 日本腎臓学会『エビデンスに基づくCKD診療ガイドライン2023』, KDIGO, UK Kidney Association Clinical Practice Guideline: Treatment of Acute Hyperkalaemia in Adults (2023)
export default {
  id: 'hyperk', name: '高カリウム血症', dept: '腎臓内科',
  weight: 3, season: {}, minLevel: 2,
  demo: { age: [55, 90], ageMode: 'old', male: 0.6 },
  sev: { p: [0.35, 0.4, 0.25], burden: [[25, 35], [40, 55], [60, 72]] },
  refractoryP: [0, 0, 0.05],
  comorb: { forced: ['ckd', 'htn'], extra: { dm2: 0.5, chf: 0.15 } },
  organisms: [],
  vars: (rng, sev, pt) => {
    pt.homeMeds.push('enalapril');
    const banana = rng.chance(0.5);
    return { banana };
  },
  cc: () => '手足に力が入らない',
  ccKey: 'weakness',
  arrival: (sev) => (sev === 0 ? 'walk' : 'ambulance'),
  history: {
    onset: { p: 1, text: '昨日から手足に力が入りにくくなりました。' },
    course: { p: 1, text: 'だんだん強くなっています。' },
    character: { p: 1, text: '手足がだるくて、力が入りません。しびれる感じもします。' },
    weakness: { p: 1, text: '両手両足に力が入りません。' },
    palpitation: { p: 0.4, text: '時々、脈が飛ぶ感じがします。' },
    nausea: { p: 0.3, text: '少し吐き気があります。' },
    diet: { p: 1, text: '{dietText}' },
    pmh: { p: 1, text: '腎臓が悪いと言われています。高血圧の薬も飲んでいます。' },
    adherence: { p: 1, text: '薬はきちんと飲んでいます。最近、血圧の薬が増えました。' },
    polyuria: { p: 0.4, text: '最近、おしっこの量が減っています。' },
  },
  postVars: (v) => { v.dietText = v.banana ? '体にいいと思って、毎日バナナとトマトジュースをたくさんとっていました。' : '夏バテで食欲がなく、水分もあまりとれていませんでした。'; },
  exam: {
    gen_appear: { p: 1, bySev: ['だるそうにしている。', 'ぐったりしている。', 'ぐったりして反応が鈍い。'] },
    motor: { p: 0.7, text: '両側上下肢の筋力低下（徒手筋力 4/5）。左右差なし。' },
    leg_edema: { p: 0.4, text: '両側下腿に軽度の浮腫。' },
  },
  vitals: { HR: { to: [42, 50], k: 1.5 }, SBP: { to: [80, 95], k: 3 } },
  labs: { K: { add: [2.2, 3.6], k: 0.8, p: 1 }, BUN: { add: [10, 30], k: 1 }, CR: { add: [0.5, 1.5], k: 1 }, HCO3: { add: [-6, -3], k: 1 }, CL: { add: [1, 4], k: 1 } },
  tests: {},
  natural: 0,
  curedBy: 'hd',
  therapies: [
    { id: 'calcium', label: '心電図変化があればカルシウム静注（心筋保護）', req: { tag: 'calcium' }, when: (c) => c.lab('K') >= 6.5, required: true, deadlineH: [0.5, 0.5, 0.25], startFromNeed: true },
    { id: 'shift', label: 'インスリン＋ブドウ糖（Kを細胞内へ）', req: { tag: 'k_shift' }, effect: -3.0, lagH: 0.3, required: true, deadlineH: [1, 1, 0.5] },
    { id: 'glucose', label: 'インスリンと一緒にブドウ糖（低血糖予防）', req: { anyTag: ['dextrose_bolus'], orFluidK: false }, when: (c) => c.eff.tags.k_shift > 0, required: true, deadlineH: [0.5, 0.5, 0.5], startFromNeed: true },
    { id: 'excrete', label: 'Kの体外への排泄（K吸着薬・利尿薬・透析）と原因薬（ACE阻害薬）の中止', req: { anyTag: ['k_binder', 'diuretic'] }, required: (enc) => enc.patient.sev < 2, deadlineH: [12, 12, 6] },
    { id: 'hd', label: '重症・腎不全：腎臓内科コンサルト→緊急透析', req: { procDone: 'hd' }, required: (enc) => enc.patient.sev === 2, deadlineH: [99, 99, 4] },
  ],
  dynamics: (enc, eff) => {
    let d = [-0.1, 0.1, 0.3][enc.patient.sev];
    if (eff.tags.k_binder) d -= 0.8;
    if (eff.tags.bronchodilator) d -= 0.8;
    if (eff.tags.diuretic) d -= 0.5;
    if (eff.tags.bicarbonate) d -= 0.5;
    if (eff.tags.potassium) d += 3;
    return d;
  },
  procedures: [{
    id: 'hd', depts: ['nephro'], label: '緊急透析', delay: 60, duration: 240, after: 'icu',
    decide: (enc) => {
      const k = enc.tests.some((t) => t.done && t.result.items?.some((i) => i.id === 'K' && i.v >= 6.0));
      if (!k) return { accept: false, text: 'カリウムの値を教えてください（血液ガスなら数分でわかります）。' };
      return { accept: true, reveal: true, text: '慢性腎臓病に伴う高カリウム血症です。カルシウム・インスリン＋ブドウ糖で時間を稼ぎつつ、緊急透析を行います（約60分後に開始）。' };
    },
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 15); },
    doneText: '腎臓内科：緊急透析でKは正常化しました。ACE阻害薬は中止し、K制限の食事指導を行います。',
  }],
  harmTags: { potassium: '高K血症の患者へのK補充（致死的不整脈）' },
  dispo: (enc) => (enc.patient.sev === 0 ? { ok: ['admit'], best: 'admit', why: '高K血症：入院でモニター管理と原因の是正' } : { ok: ['icu', 'admit'], best: 'icu', why: '心電図変化を伴う高K血症：ICUでモニター管理' }),
  useful: ['vbg', 'chem', 'lab_K', 'ecg', 'cbc', 'ua', 'bs_poct', 'lab_GLU', 'lab_CR'],
  key: [['ecg'], ['vbg', 'chem', 'lab_K']],
  extrasOk: () => ['aki'],
  teaching: [
    '慢性腎臓病・ACE阻害薬/ARB・K保持性利尿薬・K摂取過多は高K血症のリスク。脱力・不整脈・徐脈で来ることがある。',
    '心電図：テント状T波 → P波消失・QRS幅拡大 → 心室細動・心停止へ進む。K値と心電図をすぐに確認する（血液ガスが早い）。',
    '治療の順番：①カルシウム静注（心筋保護、数分で効く）②インスリン10単位＋ブドウ糖（Kを細胞内へ）③β2刺激薬吸入 ④体外への排泄（利尿薬・透析）。',
    'インスリンを使うときは必ずブドウ糖を一緒に（低血糖の予防）。血糖を頻回に確認。',
    '原因薬（ACE阻害薬など）の中止と食事指導を忘れない。',
  ],
  sources: ['エビデンスに基づくCKD診療ガイドライン2023（日本腎臓学会）', 'UK Kidney Association: Treatment of Acute Hyperkalaemia in Adults (2023)'],
  ideal: (p) => [
    { a: 'test', ids: ['vbg', 'ecg', 'chem'] },
    { a: 'rx', drugId: 'calcium', route: 'iv', dose: 10, freq: 'once', days: 1 },
    { a: 'rx', drugId: 'glucose50', route: 'iv', dose: 50, freq: 'once', days: 1 },
    { a: 'rx', drugId: 'insulin_bolus', route: 'iv', dose: 10, freq: 'once', days: 1 },
    { a: 'rx', drugId: 'salbutamol', route: 'inh', dose: 5, freq: 'once', days: 1 },
    { a: 'rx', drugId: 'szc', route: 'po', dose: 10, freq: 'q8h', days: 3 },
    { a: 'consult', dept: 'nephro', delayMin: 10, when: 'sev2' },
  ],
};
