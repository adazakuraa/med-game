// 自然気胸（緊張性気胸を含む）
// 出典: 日本気胸・嚢胞性肺疾患学会『気胸・嚢胞性肺疾患 規約・用語・ガイドライン（2009年版）』, BTS Pleural Disease Guideline 2023
export default {
  id: 'ptx', name: '自然気胸', dept: '呼吸器外科',
  weight: 4, season: {}, minLevel: 1,
  demo: { age: [16, 34], ageMode: 'young', male: 0.85 },
  sev: { p: [0.45, 0.4, 0.15], burden: [[15, 25], [35, 48], [62, 72]] },
  refractoryP: [0, 0, 0],
  comorb: { extra: {} },
  smokeP: 0.55,
  weightAdj: -9,
  organisms: [],
  vars: (rng, sev) => {
    const side = rng.pick(['右', '左']);
    return {
      side, otherSide: side === '右' ? '左' : '右', onsetH: rng.int(2, 24),
      degText: ['肺尖が鎖骨より上（I度：軽度）', '肺尖が鎖骨より下（II度：中等度）', 'ほぼ完全に虚脱（III度）'][sev],
      prev: rng.chance(0.2),
    };
  },
  cc: () => '胸痛と息苦しさ',
  ccKey: 'chest_pain',
  arrival: (sev) => (sev === 2 ? 'ambulance' : 'walk'),
  history: {
    onset: { p: 1, text: '{onsetH}時間ほど前、座っていたら急に{side}の胸が痛くなりました。' },
    course: { p: 1, bySev: ['痛みは少し落ち着きましたが、息苦しさが残っています。', '息苦しさが続いています。', 'どんどん息が苦しくなっています！'] },
    character: { p: 1, text: '{side}胸がチクッと刺すように痛くて、息が吸いにくいです。' },
    location: { p: 1, text: '{side}の胸です。' },
    chestpain: { p: 1, text: '{side}の胸が痛いです。' },
    dyspnea: { p: 1, bySev: ['少し息苦しいです。', '動くと息が苦しいです。', '息ができません！'] },
    aggravating: { p: 0.7, text: '深呼吸すると痛みが強くなります。' },
    cough: { p: 0.3, text: '乾いた咳が少し出ます。' },
    trigger: { p: 0.5, text: '特に何もしていないときに急に痛くなりました。' },
    pmh: { p: 1, ifVar: 'prev', text: '高校生のときにも、同じように肺に穴があいたことがあります。' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['やや息苦しそうだが会話は可能。', '息苦しそうにしている。', '呼吸促迫で苦悶様。チアノーゼあり。'] },
    lung_ausc: [{ p: [0.7, 0.95, 1], unlessDrain: true, text: '{side}の呼吸音が減弱。' }],
    chest_perc: [{ p: [0.5, 0.85, 1], unlessDrain: true, text: '{side}胸部で鼓音（打診でよく響く）。' }],
    chest_palp: [{ p: 0.6, unlessDrain: true, text: '{side}の声音振盪が減弱。' }],
    chest_insp: [{ p: [0.2, 0.6, 1], unlessDrain: true, bySev: ['{side}胸郭の動きがやや弱い。', '{side}胸郭の動きが弱く、頻呼吸。', '{side}胸郭の膨隆と呼吸運動の低下。著明な頻呼吸。'] }],
    trachea: [{ p: [0, 0, 1], unlessDrain: true, text: '気管が{otherSide}に偏位している。' }],
    jvd: [{ p: [0, 0, 0.9], unlessDrain: true, text: '頸静脈怒張あり。' }],
    periph: [{ p: [0, 0, 0.8], unlessDrain: true, text: '四肢冷感。' }],
  },
  vitals: { HR: { to: [118, 140], k: 1 }, RR: { to: [28, 38], k: 1 }, SpO2: { drop: [22, 32], k: 1.3 }, SBP: { to: [55, 75], k: 4 } },
  labs: {},
  tests: {
    cxr: [
      { p: 1, unlessDrain: true, text: '{side}肺の虚脱（{degText}）。臓側胸膜線を認め、その外側に肺紋理なし。' },
      { p: [0, 0, 1], unlessDrain: true, text: '縦隔が{otherSide}に偏位（緊張性気胸）。' },
      { p: 1, ifDrain: true, persist: true, text: '{side}胸腔ドレーン挿入後。{side}肺は再膨張している。' },
    ],
    chest_ct: [{ p: 1, unlessDrain: true, text: '{side}気胸。{side}肺尖部に小さなブラ（嚢胞）を認める。' }, { p: 1, ifDrain: true, persist: true, text: '{side}胸腔ドレーン挿入後。肺は再膨張。肺尖部にブラ。' }],
    chest_cta: [{ p: 1, unlessDrain: true, text: '{side}気胸。大動脈・肺動脈に異常なし。' }],
  },
  ecg: [],
  natural: 0,
  therapies: [
    { id: 'drain', label: '患側の胸腔ドレナージ（中等度以上・緊張性気胸）', req: { fn: (enc) => !!enc.state.drains?.[enc.patient.vars.side] }, required: (enc) => enc.patient.sev >= 1, deadlineH: [99, 6, 0.25] },
    { id: 'o2', label: '酸素投与（SpO2<90%）', req: { o2: true }, when: (c) => c.rawSpO2 < 90, required: true, deadlineH: [0.5, 0.5, 0.25] },
  ],
  dynamics: (enc, eff) => {
    const st = enc.state, p = enc.patient;
    const drained = st.drains?.[p.vars.side] != null && enc.t >= st.drains[p.vars.side];
    if (drained) return -4;
    if (p.sev === 2) return 2.2; // 緊張性気胸は急速に悪化
    if (p.sev === 1) return 0.05;
    return eff.o2Device ? -0.5 : -0.25; // 軽度は自然吸収（酸素で促進）
  },
  dispo: (enc) => (enc.patient.sev === 0 ? { ok: ['home', 'admit'], best: 'home', why: '軽度（I度）：安静・外来で経過観察' } : enc.patient.sev === 2 ? { ok: ['admit', 'icu'], best: 'admit', why: '緊張性気胸：緊急脱気・ドレナージ後に入院' } : { ok: ['admit'], best: 'admit', why: '中等度以上：胸腔ドレナージのうえ入院' }),
  useful: ['cxr', 'chest_ct', 'vbg', 'ecg', 'cbc', 'chem'],
  key: [['cxr', 'chest_ct']],
  extrasOk: () => [],
  teaching: [
    '若くて背が高くやせた男性（喫煙者）の突然の胸痛と息苦しさは自然気胸を疑う。患側の呼吸音減弱・鼓音が手がかり。',
    '胸部X線で臓側胸膜線と肺虚脱の程度（I〜III度）を評価する。',
    '軽度（I度）は安静・経過観察、中等度以上は胸腔ドレナージ（または穿刺脱気）。',
    '緊張性気胸（気管偏位・頸静脈怒張・低血圧）は画像を待たずに直ちに脱気・ドレナージする臨床診断。',
    'ドレナージは必ず患側に。反対側に入れると新たな気胸を作ってしまう。',
  ],
  sources: ['気胸・嚢胞性肺疾患 規約・用語・ガイドライン（日本気胸・嚢胞性肺疾患学会）', 'BTS Guideline for Pleural Disease (2023)'],
  ideal: (p) => [
    { a: 'o2', device: p.sev === 2 ? 'reservoir' : 'nc', flow: p.sev === 2 ? 12 : 3, when: 'spo2<92' },
    { a: 'proc', id: p.vars.side === '右' ? 'drain_R' : 'drain_L', when: 'sev>=1' },
    { a: 'test', ids: ['cxr'] },
  ],
};
