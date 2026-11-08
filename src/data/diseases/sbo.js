// 癒着性小腸閉塞（絞扼性を含む）
// 出典: 急性腹症診療ガイドライン2015, WSES Bologna guidelines for adhesive small bowel obstruction (2017)
export default {
  id: 'sbo', name: '癒着性小腸閉塞', dept: '外科',
  weight: 4, season: {}, minLevel: 2,
  demo: { age: [40, 88], ageMode: 'old', male: 0.5 },
  sev: { p: [0.4, 0.4, 0.2], burden: [[25, 35], [38, 50], [55, 68]] },
  refractoryP: [0, 0.02, 0.06],
  comorb: { extra: { htn: 0.35, dm2: 0.15, constip: 0.2 } },
  organisms: [],
  vars: (rng, sev) => ({ forceSurgery: rng.pick(['開腹での虫垂切除術', '胃がんの開腹手術', '開腹での子宮筋腫の手術']), hours: rng.int(12, 48), strang: sev === 2 }),
  cc: () => '腹痛と嘔吐',
  ccKey: 'abd_pain',
  arrival: (sev) => (sev === 2 ? 'ambulance' : 'walk'),
  initVolume: [[600, 1200], [1200, 2200], [2000, 3200]],
  history: {
    onset: { p: 1, text: '{hours}時間ほど前からお腹が張って痛くなりました。' },
    course: { p: 1, bySev: ['痛みが波のように来ます。', '何度も吐いて、お腹がパンパンです。', 'ずっと強く痛むようになりました。'] },
    character: { p: 1, text: '{charText}' },
    location: { p: 1, text: 'お腹全体です。' },
    abdpain: { p: 1, text: 'お腹全体が痛くて張っています。' },
    nausea: { p: 0.95, text: '何度も吐きました。緑色っぽいものを吐きました。' },
    diarrhea: { p: 1, text: 'きのうからおならも便も出ていません。' },
    anorexia: { p: 0.9, text: '何も食べられません。' },
    surgery: { p: 1, text: '昔、{forceSurgery}を受けました。' },
  },
  postVars: (v) => { v.charText = v.strang ? '最初は波がありましたが、今はずっと強く痛みます。' : 'ギューっと痛くなっては少し楽になる、波のある痛みです。'; },
  exam: {
    gen_appear: { p: 1, bySev: ['お腹を押さえてつらそう。', '何度も嘔吐し、ぐったりしている。', '苦悶様で冷汗がある。'] },
    abd_insp: { p: 1, text: '腹部は膨隆。正中に古い手術痕あり。' },
    abd_ausc: [{ p: [0.9, 0.85, 0], text: '腸蠕動音は亢進し、金属音（高調な音）を聴取。' }, { p: [0, 0, 1], text: '腸蠕動音は減弱。' }],
    abd_perc: { p: 0.9, text: '全体に鼓音。' },
    abd_palp: { p: 1, text: '腹部全体に圧痛。' },
    abd_rebound: { p: [0, 0.05, 0.85], text: '反跳痛陽性。' },
    abd_guard: { p: [0, 0.05, 0.8], text: '筋性防御あり。' },
    oral_mucosa: { p: 0.8, text: '口腔粘膜は乾燥。' },
  },
  vitals: { HR: { to: [105, 125], k: 0.9 }, T: { to: [37.3, 38.3], k: 1.2 }, SBP: { to: [75, 88], k: 2.8 } },
  labs: { WBC: { to: [11000, 18000], k: 0.8 }, CRP: { to: [2, 15], k: 1.5 }, K: { add: [-1.0, -0.4], k: 1 }, CL: { add: [-8, -3], k: 1 }, HCO3: { add: [2, 5], k: 1 }, LAC: { to: [2, 6], k: 2.5 }, CK: { add: [0, 600], k: 2 } },
  tests: {
    axr: [{ p: 0.85, persist: true, text: '小腸の拡張と多数の鏡面像（ニボー）。大腸ガスは少ない。' }],
    abd_ct_contrast: [{ p: 0.95, persist: true, text: '小腸の拡張と下腹部での口径変化（癒着による閉塞）。' }, { p: [0, 0, 0.9], text: '拡張した腸管の壁の造影不良と腸間膜の浮腫、腹水（絞扼を疑う）。' }],
    abd_ct_plain: [{ p: 0.9, persist: true, text: '小腸の拡張と口径変化。' }],
    abd_us: [{ p: 0.7, text: '拡張した小腸と、腸内容物の行ったり来たり（to and fro）。' }],
  },
  natural: 0.25,
  curedBy: 'sbo_op',
  therapies: [
    { id: 'fluid', label: '輸液（脱水・電解質の補正）', req: { fluidTotal: 1000 }, required: true, deadlineH: [4, 3, 2] },
    { id: 'npo', label: '絶飲食', req: { fn: (enc, eff) => eff.npo }, required: true, deadlineH: [2, 2, 1] },
    { id: 'ng', label: '胃管（イレウス管）による減圧', req: { fn: (enc) => !!enc.state.procs?.ng }, required: (enc) => enc.patient.sev >= 1, deadlineH: [6, 4, 2] },
    { id: 'op', label: '絞扼性：外科コンサルト→緊急手術', req: { procDone: 'sbo_op' }, required: (enc) => enc.patient.vars.strang, deadlineH: [99, 99, 4] },
  ],
  dynamics: (enc, eff) => {
    const st = enc.state, v = enc.patient.vars;
    if (v.strang) return 0.6;
    let d = 0;
    if (eff.npo) d -= 0.4;
    if (st.procs?.ng) d -= 0.5;
    return d;
  },
  fluidLoss: (b, eff, enc) => (enc.state.procs?.ng ? 30 : 60),
  canDrink: () => false,
  procedures: [{
    id: 'sbo_op', depts: ['surgery'], label: '緊急手術', delay: 120, duration: 150, after: 'ward',
    decide: (enc, vit) => {
      const ct = enc.tests.some((t) => ['abd_ct_contrast', 'abd_ct_plain', 'axr', 'abd_us'].includes(t.id) && t.done && t.result.abnormal);
      if (!ct) return { accept: false, text: '腸閉塞を疑うなら、まず画像（造影CTが望ましい）で確認してください。' };
      if (enc.patient.vars.strang) return { accept: true, reveal: true, text: '絞扼性腸閉塞が疑われます。緊急手術を行います（約2時間後に手術室へ）。' };
      return { accept: false, reveal: true, text: '絞扼の所見はなく、癒着性の単純性腸閉塞です。絶飲食・輸液・減圧（胃管/イレウス管）で保存的に治療し、改善がなければ再相談してください。' };
    },
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 30); },
    doneText: '外科：癒着による絞扼を解除しました。腸管の血流は回復し、切除は不要でした。術後管理をお願いします。',
  }],
  dispo: () => ({ ok: ['admit', 'icu'], best: 'admit', why: '腸閉塞：入院（絞扼なら緊急手術）' }),
  useful: ['cbc', 'chem', 'crp', 'vbg', 'axr', 'abd_ct_contrast', 'abd_ct_plain', 'abd_us', 'coag', 'lab_LAC', 'lab_K', 'ecg'],
  key: [['axr', 'abd_ct_contrast', 'abd_ct_plain', 'abd_us'], ['chem', 'vbg']],
  extrasOk: () => ['dehydration'],
  teaching: [
    '腹部手術歴＋腹痛・嘔吐・腹部膨満・排便排ガスの停止は癒着性腸閉塞を考える。',
    '腹部X線で小腸の拡張とニボー、造影CTで閉塞部位と絞扼の有無を評価する。',
    '単純性は絶飲食・輸液・胃管（イレウス管）での減圧で多くが改善する。',
    '持続痛・腹膜刺激徴候・発熱・乳酸上昇・CTでの造影不良は絞扼のサイン → 緊急手術。',
    '腸閉塞には蠕動を促すメトクロプラミドや、抗コリン薬（ブチルスコポラミン）は使わない。',
  ],
  sources: ['急性腹症診療ガイドライン2015', 'WSES Bologna guidelines for diagnosis and management of adhesive small bowel obstruction (2017)'],
  ideal: (p) => [
    { a: 'test', ids: ['cbc', 'chem', 'vbg', 'axr', 'abd_ct_contrast'] },
    { a: 'npo' },
    { a: 'fluid', fluidId: 'lr', mode: 'bolus', volume: 1000 },
    { a: 'fluid', fluidId: 'lr', mode: 'cont', rate: 120 },
    { a: 'proc', id: 'ng' },
    { a: 'consult', dept: 'surgery', delayMin: 50, when: 'sev2' },
  ],
};
