// 大腸憩室出血（下部消化管出血）
// 出典: 日本消化管学会『大腸憩室症（憩室出血・憩室炎）ガイドライン2017』, 日本消化器病学会/日本消化器内視鏡学会ほか『大腸憩室出血の診療ガイドライン』
export default {
  id: 'lgib', name: '大腸憩室出血', dept: '消化器内科',
  weight: 4, season: {}, minLevel: 2,
  demo: { age: [60, 90], ageMode: 'old', male: 0.6 },
  sev: { p: [0.45, 0.4, 0.15], burden: [[20, 30], [34, 48], [55, 66]] },
  refractoryP: [0, 0.02, 0.05],
  comorb: { extra: { htn: 0.6, dyslip: 0.35, ckd: 0.15, af: 0.15 } },
  organisms: [],
  untreatedFatal: false,
  vars: (rng, sev, pt) => {
    const apt = rng.chance(0.5);
    if (apt) pt.homeMeds.push('aspirin_home');
    return { apt, ext: rng.chance(0.6), noext: false, times: [2, 4, 6][sev] + rng.int(0, 2), hb0: [1, 2.5, 4.5][sev] + rng.range(-0.3, 0.5), loc: rng.pick(['上行結腸', 'S状結腸', '横行結腸']) };
  },
  postVars: (v) => { v.noext = !v.ext; },
  initHbLoss: (p) => p.vars.hb0,
  cc: () => '血便（真っ赤な血が出た）',
  ccKey: 'hematochezia',
  arrival: (sev) => (sev === 0 ? 'walk' : 'ambulance'),
  initVolume: [[200, 500], [700, 1200], [1400, 2200]],
  history: {
    onset: { p: 1, text: '今朝から、真っ赤な血の混じった便が{times}回出ました。' },
    character: { p: 1, text: '暗い赤〜鮮やかな赤い血が、便器が真っ赤になるくらい出ました。' },
    bloodystool: { p: 1, text: '赤い血の塊が出ます。黒い便ではありません。' },
    abdpain: { p: 0.1, text: 'お腹は痛くありません。' },
    dizziness: { p: [0.2, 0.6, 1], text: '立つとふらふらします。' },
    nausea: { p: 0, text: '' },
    meds: { p: 1, ifVar: 'apt', text: '心臓の検査で言われて、バイアスピリンを飲んでいます。' },
    pmh: { p: 0.6, text: '以前の大腸カメラで、憩室がたくさんあると言われました。' },
    fever: { p: 0, text: '' },
    weightloss: { p: 0, text: '' },
    constipation: { p: 0.3, text: '便秘気味です。' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['顔色はやや悪いが、会話はしっかりしている。', '顔色不良でぐったりしている。', '顔面蒼白、冷汗。'] },
    abd_palp: { p: 0.15, text: '腹部は平坦・軟で、圧痛はほとんどない。' },
    rectal: { p: 1, text: '直腸診で暗赤色の血液が付着。腫瘤は触れない。' },
    oral_mucosa: { p: [0.2, 0.6, 0.9], text: '眼瞼結膜は蒼白。' },
    periph: { p: [0, 0.3, 0.9], text: '四肢冷感。' },
  },
  vitals: { HR: { to: [105, 125], k: 1 } },
  labs: { BUN: { add: [2, 8], k: 1 } },
  tests: {
    abd_ct_contrast: [{ p: 1, ifVar: 'ext', text: '{loc}の憩室から造影剤の血管外漏出（活動性出血）。多発する大腸憩室。腫瘍性病変なし。' }, { p: 1, ifVar: 'noext', text: '多発する大腸憩室。腸管壁の肥厚や腫瘍性病変なし。' }],
    abd_ct_plain: [{ p: 0.8, text: '多発する大腸憩室。' }],
  },
  natural: 0,
  therapies: [
    { id: 'fluid', label: '細胞外液でショックの是正', req: { fluidTotal: 1000 }, when: (c) => c.vit.SBP < 90 || c.vit.HR > 110, required: true, deadlineH: [1, 1, 0.5], startFromNeed: true },
    { id: 'rbc', label: '輸血（Hb 7g/dL未満を目安）', req: { fn: (enc) => (enc.state.rbcIn || 0) >= 140 }, when: (c) => c.lab('HB') < 7, required: true, deadlineH: [2, 2, 1], startFromNeed: true },
    { id: 'cfs', label: '消化器内科コンサルト→造影CT・大腸内視鏡での止血', req: { procDone: 'cfs' }, required: (enc) => enc.patient.sev >= 1, deadlineH: [48, 24, 12] },
  ],
  dynamics: (enc, eff) => {
    const st = enc.state, sev = enc.patient.sev;
    const stopped = st.procDone?.cfs != null || (sev === 0 && enc.t > 6 * 60);
    const rate = stopped ? 0 : (0.06 + sev * 0.1) * (eff.tags.antiplatelet || eff.tags.anticoag || eff.tags.anticoag_bolus ? 2 : 1) * (enc.t > 12 * 60 ? 0.3 : 1);
    st.hbLoss += rate / 6;
    st.volume += (rate * 150) / 6;
    const hb = 14 - st.hbLoss + ((st.rbcIn || 0) / 280) * 1.5 * (60 / enc.patient.weight);
    let d = stopped ? -1.2 : 0.1;
    if (hb < 7) d += 0.8;
    return d;
  },
  procedures: [{
    id: 'cfs', depts: ['gi'], label: '大腸内視鏡（止血）', delay: 120, duration: 60, after: 'ward',
    decide: (enc, vit) => {
      if (vit.SBP < 80) return { accept: false, reveal: true, text: '下部消化管出血のようです。まず輸液・輸血で循環を安定させてください。' };
      const ct = enc.tests.some((t) => t.id === 'abd_ct_contrast' && t.done) || enc.patient.allergies.includes('contrast');
      if (!ct) return { accept: false, reveal: true, text: '血便で、BUNの上昇が軽ければ下部消化管出血を考えます。出血源の確認に、まず造影CTをお願いします（腎機能に注意）。' };
      return { accept: true, reveal: true, text: '大腸憩室出血と考えます。前処置のうえ大腸内視鏡で出血源を探し、止血します（約2時間後）。抗血小板薬は一時休薬してください。' };
    },
    onDone: () => {},
    doneText: '消化器内科：{loc}の憩室に露出血管があり、クリップ（または結紮）で止血しました。',
  }],
  harmTags: { antiplatelet: '活動性の消化管出血に抗血小板薬', anticoag: '活動性の消化管出血に抗凝固薬', anticoag_bolus: '活動性の消化管出血に抗凝固薬' },
  dispo: (enc, ctx) => (ctx.initVit.SBP < 90 ? { ok: ['icu', 'admit'], best: 'icu', why: 'ショックを伴う下部消化管出血：ICU' } : { ok: ['admit'], best: 'admit', why: '憩室出血：入院（絶食・安静・Hbの推移の観察、必要なら内視鏡止血）' }),
  useful: ['cbc', 'chem', 'coag', 'lab_HB', 'abd_ct_contrast', 'abd_ct_plain', 'ecg', 'vbg'],
  key: [['cbc', 'lab_HB'], ['coag'], ['abd_ct_contrast']],
  extrasOk: () => [],
  teaching: [
    '高齢者の腹痛を伴わない大量の鮮血〜暗赤色の血便は、大腸憩室出血が多い。抗血小板薬・抗凝固薬・NSAIDsがリスク。',
    '血便でもショックやBUNの著明な上昇があれば、上部消化管出血（大量出血）も考える。',
    'まず循環の評価と蘇生（輸液・Hb 7未満で輸血）。造影CTで活動性出血（造影剤の血管外漏出）と出血部位を確認し、大腸内視鏡で止血する。',
    '多くは自然に止まるが再出血しやすい。腹痛を伴う血便は虚血性大腸炎、下痢・発熱を伴えば感染性腸炎、体重減少や貧血の進行は大腸がんを考える。',
  ],
  sources: ['大腸憩室症（憩室出血・憩室炎）ガイドライン2017（日本消化管学会）'],
  ideal: (p) => [
    { a: 'test', ids: ['cbc', 'chem', 'coag', 'abd_ct_contrast'] },
    { a: 'fluid', fluidId: 'lr', mode: 'bolus', volume: 1000, when: 'sev>=1' },
    { a: 'wait', min: 30 },
    { a: 'fluid', fluidId: 'rbc', mode: 'bolus', volume: 560, when: 'hb<7' },
    { a: 'consult', dept: 'gi', delayMin: 10, when: 'sev>=1' },
  ],
};
