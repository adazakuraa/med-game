// 低血糖（薬剤性：スルホニル尿素薬・インスリン）
// 出典: 日本糖尿病学会『糖尿病診療ガイドライン2024』『糖尿病治療ガイド2024』, 各薬剤添付文書
export default {
  id: 'hypoglycemia', name: '低血糖（薬剤性）', dept: '内科',
  weight: 4, season: {}, minLevel: 1,
  demo: { age: [60, 92], ageMode: 'old', male: 0.5 },
  sev: { p: [0.3, 0.45, 0.25], burden: [[25, 35], [40, 55], [60, 72]] },
  refractoryP: [0, 0, 0],
  comorb: { forced: ['dm2'], extra: { htn: 0.6, ckd: 0.45, dyslip: 0.3 } },
  organisms: [],
  vars: (rng, sev, pt) => {
    const su = rng.chance(0.65);
    pt.homeMeds.push(su ? 'glimepiride' : 'glargine');
    const mimic = rng.chance(0.12);
    return { su, mimic, side: rng.pick(['右', '左']) };
  },
  cc: () => '意識がおかしい',
  ccKey: 'altered_mental',
  arrival: (sev) => (sev === 0 ? 'walk' : 'ambulance'),
  initVolume: [[0, 400], [200, 800], [400, 1200]],
  initGlu: [[45, 55], [30, 44], [18, 29]],
  history: {
    lastnormal: { p: 1, text: '（家族）昨晩は普段通りでした。今朝なかなか起きてこないので見に行ったら、様子がおかしくて。' },
    onset: { p: 1, text: '（家族）今朝起きてからです。' },
    character: { p: 1, text: '（家族）話しかけてもぼんやりしていて、変なことを言います。汗をびっしょりかいていました。' },
    sweating: { p: 0.85, text: '（家族）汗をびっしょりかいていました。' },
    anorexia: { p: 0.8, text: '（家族）ここ数日、風邪気味で食欲がなく、あまり食べていませんでした。' },
    trigger: { p: 0.8, text: '（家族）食事をあまりとっていないのに、いつも通り糖尿病の薬を飲んでいました。' },
    adherence: { p: 1, text: '（家族）食べていなくても、薬はいつも通り使っていました。' },
    weakness: { p: 1, ifVar: 'mimic', text: '（家族）{side}の手足が動かしにくそうです。' },
    seizure: { p: 0.1, text: '（家族）一度、手足がけいれんしたように見えました。' },
    palpitation: { p: 0.3, text: '（家族）ドキドキすると言っていました。' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['ぼんやりしている。冷汗あり。', '発汗著明で、会話がかみ合わない。', '呼びかけにかろうじて反応。全身に冷汗。'] },
    skin: { p: 0.85, text: '全身に冷汗。' },
    motor: { p: 0.9, ifVar: 'mimic', text: '{side}上下肢の軽い麻痺（Barré徴候陽性）。' },
    pupils: { p: 0, text: '' },
  },
  vitals: { HR: { to: [100, 118], k: 1 }, SBP: { to: [150, 165], k: 1 }, T: { to: [36.0, 36.4], k: 1 } },
  labs: {},
  tests: { head_ct: [], head_mri: [] },
  natural: 0,
  gluSetpointDrift: (enc) => -(enc.patient.vars.su ? 0.06 : 0.03) * enc.state.glu,
  minHoursToCure: 24,
  therapies: [
    { id: 'glucose', label: 'ブドウ糖の静注（50%ブドウ糖 20〜40mL）', req: { anyTag: ['dextrose_bolus'] }, required: true, deadlineH: [0.5, 0.25, 0.25] },
    { id: 'drip', label: 'ブドウ糖の持続点滴（スルホニル尿素薬の遷延性低血糖）', req: { dextrose: true }, when: (c) => c.enc.patient.vars.su && c.enc.thStart.glucose != null, required: (enc) => enc.patient.vars.su, deadlineH: [3, 3, 3], startFromNeed: true },
  ],
  dynamics: (enc) => {
    const g = enc.state.glu;
    if (g < 60) return 0.8 + (60 - g) * 0.06;
    return -6;
  },
  dispo: (enc) => (enc.patient.vars.su || enc.patient.sev >= 1 ? { ok: ['admit'], best: 'admit', why: 'スルホニル尿素薬・高齢・腎機能低下による低血糖は遷延・再発しやすく入院観察' } : { ok: ['home', 'admit'], best: 'admit', why: 'インスリンによる軽症低血糖：原因が明らかで食事がとれれば帰宅も可' }),
  useful: ['bs_poct', 'lab_GLU', 'chem', 'vbg', 'cbc', 'ecg', 'hba1c', 'head_ct', 'ua'],
  key: [['bs_poct', 'lab_GLU', 'chem', 'vbg']],
  extrasOk: (enc, ctx) => (ctx.initLab('CR') >= enc.patient.crBase * 1.5 ? ['aki'] : []),
  harmTags: {},
  teaching: [
    '意識障害を見たら、まず血糖を測る（「意識障害＝まず血糖」）。数分でわかり、治療もすぐできる。',
    '低血糖は片麻痺など脳卒中とそっくりの症状を起こすことがある。脳卒中を疑っても先に血糖を確認する。',
    '治療は50%ブドウ糖20〜40mLの静注。アルコール多飲・低栄養ではビタミンB1を先に（Wernicke脳症の予防）。',
    'スルホニル尿素薬（グリメピリドなど）による低血糖は長引き、再発しやすい。ブドウ糖の持続点滴と入院観察が必要。',
    '高齢・腎機能低下・食事量低下（シックデイ）は低血糖のリスク。退院時に薬の調整とシックデイの指導を。',
  ],
  sources: ['日本糖尿病学会 糖尿病診療ガイドライン2024', '糖尿病治療ガイド2024', '各薬剤 添付文書'],
  ideal: (p) => [
    { a: 'test', ids: ['bs_poct', 'chem', 'cbc'] },
    { a: 'rx', drugId: 'thiamine', route: 'iv', dose: 100, freq: 'once', days: 1, when: 'alcohol' },
    { a: 'rx', drugId: 'glucose50', route: 'iv', dose: 40, freq: 'once', days: 1 },
    { a: 'fluid', fluidId: 'd5w', mode: 'cont', rate: 80, when: 'su' },
  ],
};
