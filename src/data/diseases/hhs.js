// 高浸透圧高血糖状態（HHS）
// 出典: 日本糖尿病学会『糖尿病診療ガイドライン2024』, ADA Hyperglycemic Crises in Adults with Diabetes (Consensus Report 2024)
export default {
  id: 'hhs', name: '高浸透圧高血糖状態', dept: '内科',
  weight: 2, season: { summer: 1.4 }, minLevel: 3,
  demo: { age: [65, 92], ageMode: 'old', male: 0.5 },
  sev: { p: [0.3, 0.45, 0.25], burden: [[30, 40], [45, 58], [62, 74]] },
  refractoryP: [0, 0.03, 0.06],
  comorb: { forced: ['dm2'], extra: { htn: 0.6, ckd: 0.25, chf: 0.08 } },
  organisms: [],
  vars: (rng) => ({ days: rng.int(3, 7), trig: rng.pick(['風邪をひいて', '暑さで食欲が落ちて', '尿の感染症で']) }),
  cc: () => '意識がおかしい',
  ccKey: 'altered_mental',
  arrival: () => 'ambulance',
  initVolume: [[5000, 6500], [6000, 8000], [7000, 9000]],
  initGlu: [[600, 800], [750, 1000], [900, 1200]],
  history: {
    lastnormal: { p: 1, text: '（家族）数日前からぼんやりしていて、今日は呼びかけに反応が鈍くなりました。' },
    onset: { p: 1, text: '（家族）{days}日前に{trig}から、だんだん元気がなくなりました。' },
    character: { p: 1, text: '（家族）ぼーっとして、受け答えがおかしいです。' },
    polyuria: { p: 0.9, text: '（家族）ここ数日、水ばかり欲しがって、トイレも頻繁でした。' },
    anorexia: { p: 0.9, text: '（家族）ほとんど食べていません。' },
    trigger: { p: 1, text: '（家族）{trig}から調子が悪くなりました。' },
    adherence: { p: 0.6, text: '（家族）食べないので糖尿病の薬はやめていたようです。' },
    weakness: { p: 0.2, text: '（家族）右手が少し動かしにくそうです。' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['ぼんやりしている。', '傾眠傾向。皮膚は乾燥。', '呼びかけにわずかに反応。'] },
    oral_mucosa: { p: 1, text: '口腔粘膜・舌は著明に乾燥。' },
    skin_turgor: { p: 1, text: 'ツルゴール著明に低下。' },
    gen_breath_odor: { p: 0, text: '' },
    chest_insp: { p: 0, text: '' },
  },
  vitals: { HR: { to: [100, 115], k: 1 }, T: { to: [37.2, 38.0], k: 1 } },
  labs: { NA: { add: [6, 14], k: 1 }, BUN: { add: [20, 50], k: 1 }, CR: { add: [0.6, 1.8], k: 1 }, BHB: { to: [300, 1200], k: 1 }, WBC: { to: [11000, 16000], k: 1 } },
  hco3Fn: () => 21,
  tests: { head_ct: [], ua: [] },
  natural: 0,
  gluSetpointDrift: 10,
  therapies: [
    { id: 'fluid', label: '大量の細胞外液（生理食塩液）による補液', req: { fluidTotal: 1500 }, required: true, deadlineH: [3, 2, 2] },
    { id: 'insulin', label: '補液を先行したうえでインスリン持続静注（0.05〜0.1単位/kg/時）', req: { tag: 'insulin', min: 0.3 }, required: true, deadlineH: [8, 6, 6] },
    { id: 'potassium', label: 'K<5.0でカリウム補充', req: { anyTag: ['potassium'], orFluidK: true }, when: (c) => c.lab('K') < 5.0 && c.eff.tags.insulin > 0, required: true, deadlineH: [3, 3, 3], startFromNeed: true },
  ],
  dynamics: (enc, eff) => {
    const st = enc.state;
    let d = st.volume > 4000 ? 0.4 : st.volume > 2000 ? -1.0 : -2.2;
    if (st.glu > 600) d += 0.3;
    if ((eff.tags.insulin || 0) > 0 && st.volume > 5000) d += 0.5; // 補液不足のままのインスリンは循環虚脱を招く
    return d;
  },
  fluidLoss: (b, eff, enc) => (enc.state.glu > 300 ? 100 : 20),
  canDrink: () => false,
  harmTags: { bicarbonate: 'HHSにアシドーシスはなく、重炭酸は不要' },
  dispo: () => ({ ok: ['icu'], best: 'icu', why: '高浸透圧高血糖状態：ICUで補液・電解質・血糖を頻回に管理' }),
  useful: ['bs_poct', 'vbg', 'chem', 'cbc', 'ua', 'bhb', 'ecg', 'cxr', 'bcx', 'ucx', 'crp', 'head_ct', 'lab_NA', 'lab_K', 'lab_GLU', 'hba1c'],
  key: [['bs_poct', 'chem', 'vbg'], ['ua', 'bhb']],
  extrasOk: () => ['dehydration', 'aki'],
  teaching: [
    '高齢の2型糖尿病患者が感染・脱水をきっかけに、著明な高血糖（600mg/dL以上）・高浸透圧・高度の脱水と意識障害を起こす。',
    'DKAと違い、ケトアシドーシスはほとんどない（pH・HCO3はほぼ正常）。',
    '治療の中心は大量の補液（不足は8〜10L以上のことも）。インスリンは補液を先行してから少量で開始する。',
    '血糖や血清Naを急に下げすぎない（脳浮腫の予防）。Kは補液とインスリンで低下するので補充する。',
    '誘因（感染症・脱水・薬剤）を探し、血栓症の合併にも注意する。',
  ],
  sources: ['日本糖尿病学会 糖尿病診療ガイドライン2024', 'ADA Hyperglycemic Crises in Adults with Diabetes: A Consensus Report (2024)'],
  ideal: (p) => [
    { a: 'test', ids: ['bs_poct', 'vbg', 'chem', 'cbc', 'ua'] },
    { a: 'fluid', fluidId: 'ns', mode: 'bolus', volume: 1000 },
    { a: 'fluid', fluidId: 'ns', mode: 'cont', rate: 400 },
    { a: 'wait', min: 120 },
    { a: 'rx', drugId: 'insulin_r', route: 'iv', dose: Math.round(p.weight * 0.05 * 10) / 10, freq: 'cont', days: 2 },
    { a: 'rx', drugId: 'kcl', route: 'iv', dose: 10, freq: 'cont', days: 2, when: 'k<5' },
    { a: 'fluid', fluidId: 'd5w', mode: 'cont', rate: 100, when: 'glu<250' },
  ],
};
