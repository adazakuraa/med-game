// 上部消化管出血（出血性胃・十二指腸潰瘍）
// 出典: 日本消化器病学会『消化性潰瘍診療ガイドライン2020』, 日本消化器内視鏡学会『非静脈瘤性上部消化管出血における内視鏡診療ガイドライン』
export default {
  id: 'ugib', name: '上部消化管出血（出血性胃潰瘍）', dept: '消化器内科',
  weight: 5, season: {}, minLevel: 2,
  demo: { age: [40, 88], ageMode: 'old', male: 0.65 },
  sev: { p: [0.35, 0.45, 0.2], burden: [[22, 32], [38, 52], [58, 70]] },
  refractoryP: [0, 0.02, 0.06],
  comorb: { extra: { htn: 0.4, af: 0.12, dyslip: 0.25, ckd: 0.1 } },
  organisms: [],
  vars: (rng, sev, pt) => {
    const nsaid = rng.chance(0.55);
    if (nsaid) pt.homeMeds.push('nsaid_home');
    return { nsaid, days: rng.int(1, 3), loc: rng.pick(['胃角部小彎', '十二指腸球部前壁', '胃体下部後壁']), hb0: [2.5, 4.5, 6.5][sev] + rng.range(-0.5, 0.5) };
  },
  cc: (v, sev) => (sev === 0 ? '黒い便とふらつき' : '吐血'),
  ccKey: 'hematemesis',
  arrival: (sev) => (sev === 0 ? 'walk' : 'ambulance'),
  initVolume: [[300, 700], [900, 1500], [1600, 2500]],
  history: {
    onset: { p: 1, text: '{days}日前から便が真っ黒になりました。' },
    course: { p: 1, bySev: ['ふらつきが少しあります。', '今朝、コーヒーのかすのようなものを吐きました。', '真っ赤な血をたくさん吐いて、立てなくなりました。'] },
    character: { p: 1, text: '黒い（タールのような）便が出て、ふらふらします。' },
    bloodystool: { p: 1, text: '真っ黒でベタベタした便です。' },
    nausea: { p: [0.3, 0.9, 1], bySev: ['少し吐き気があります。', 'コーヒーのかすのようなものを吐きました。', '赤い血を何度も吐きました。'] },
    abdpain: { p: 0.5, text: '最近、空腹時にみぞおちが痛むことがありました。' },
    dizziness: { p: [0.6, 0.85, 1], text: '立ち上がるとふらっとします。' },
    meds: { p: 1, ifVar: 'nsaid', text: '腰痛でロキソニンを毎日飲んでいます。' },
    alcohol: { p: 0.3, text: '毎晩ビールを2〜3缶飲みます。' },
    pmh: { p: 0.3, text: '以前、ピロリ菌がいると言われたことがあります（除菌はしていません）。' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['顔色がやや悪い。', '顔色不良でぐったりしている。', '顔面蒼白、冷汗、意識がもうろう。'] },
    oral_mucosa: { p: 0.8, text: '眼瞼結膜は蒼白（貧血）。' },
    abd_palp: { p: 0.5, text: '心窩部に軽い圧痛。腹膜刺激徴候なし。' },
    periph: { p: [0, 0.4, 0.95], text: '四肢冷感・湿潤。' },
  },
  vitals: { HR: { to: [105, 125], k: 1 } },
  labs: { BUN: { add: [20, 45], k: 0.8 } },
  initHbLoss: (p) => p.vars.hb0,
  tests: {
    cxr: [],
    abd_ct_contrast: [{ p: 0.5, text: '胃内に高吸収の内容物（血液）。造影剤の血管外漏出あり。遊離ガスなし。' }],
  },
  natural: 0,
  curedBy: null,
  therapies: [
    { id: 'fluid', label: '細胞外液でショックの是正', req: { fluidTotal: 1000 }, when: (c) => c.vit.SBP < 90 || c.vit.HR > 110, required: true, deadlineH: [1, 1, 0.5], startFromNeed: true },
    { id: 'rbc', label: '輸血（Hb 7g/dL未満を目安）', req: { fn: (enc) => (enc.state.rbcIn || 0) >= 140 }, when: (c) => c.lab('HB') < 7, required: true, deadlineH: [2, 2, 1], startFromNeed: true },
    { id: 'ppi', label: 'PPI静注', req: { tag: 'ppi' }, required: true, deadlineH: [6, 4, 2] },
    { id: 'egd', label: '消化器内科コンサルト→緊急内視鏡（止血）', req: { procDone: 'egd' }, required: true, deadlineH: [24, 12, 6] },
  ],
  dynamics: (enc, eff) => {
    const st = enc.state, sev = enc.patient.sev;
    const stopped = st.procDone?.egd != null;
    const rate = stopped ? 0 : (0.12 + sev * 0.1) * (eff.tags.antiplatelet || eff.tags.anticoag || eff.tags.nsaid ? 2 : 1) * (eff.tags.ppi ? 0.8 : 1);
    st.hbLoss += rate / 6; // 1ステップ(10分)あたり
    st.volume += (rate * 150) / 6;
    const hb = 14 - st.hbLoss + ((st.rbcIn || 0) / 280) * 1.5 * (60 / enc.patient.weight);
    let d = stopped ? -1.5 : 0.1;
    if (hb < 7) d += 0.8;
    return d;
  },
  procedures: [{
    id: 'egd', depts: ['gi'], label: '緊急上部消化管内視鏡', delay: 60, duration: 60, after: 'ward',
    decide: (enc, vit) => {
      if (vit.SBP < 80) return { accept: false, reveal: true, text: '上部消化管出血のようです。内視鏡の前に、輸液・輸血で循環を安定させてください。安定したらすぐ行います。' };
      return { accept: true, reveal: true, text: '上部消化管出血として緊急内視鏡を行います（約60分後）。PPIの静注と、必要なら輸血をお願いします。' };
    },
    onDone: () => {},
    doneText: '消化器内科：{loc}に露出血管を伴う潰瘍があり、クリップと薬剤局注で止血しました。PPIを継続し、ピロリ菌の検査も行います。',
  }],
  harmTags: { nsaid: '消化管出血にNSAIDs（出血・潰瘍の悪化）', antiplatelet: '活動性の消化管出血に抗血小板薬', anticoag: '活動性の消化管出血に抗凝固薬', anticoag_bolus: '活動性の消化管出血に抗凝固薬' },
  dispo: (enc, ctx) => (ctx.initVit.SBP < 90 ? { ok: ['icu'], best: 'icu', why: 'ショックを伴う上部消化管出血：ICU' } : { ok: ['admit', 'icu'], best: 'admit', why: '上部消化管出血：入院（Glasgow-Blatchfordスコアが高ければ緊急内視鏡）' }),
  useful: ['cbc', 'chem', 'coag', 'vbg', 'ecg', 'lab_HB', 'lab_BUN', 'abd_ct_contrast', 'tnt'],
  key: [['cbc', 'lab_HB'], ['chem', 'lab_BUN'], ['coag']],
  extrasOk: () => ['pud'],
  teaching: [
    '吐血（コーヒー残渣様・鮮血）や黒色便（タール便）は上部消化管出血。BUN/Cr比の上昇（消化管内の血液の吸収）も手がかり。',
    'まず循環の安定：太い静脈路2本、細胞外液、Hb 7g/dL未満を目安に輸血（輸血しすぎは再出血を増やす）。',
    'PPIを静注し、24時間以内（ショックなら安定後すぐ）に内視鏡で止血する。',
    'NSAIDs・抗血小板薬・抗凝固薬の内服歴を必ず確認する。ピロリ菌の検査と除菌も再発予防に重要。',
    '肝硬変・大量飲酒があれば食道静脈瘤破裂を考え、治療が変わる。',
  ],
  sources: ['消化性潰瘍診療ガイドライン2020（日本消化器病学会）', '非静脈瘤性上部消化管出血における内視鏡診療ガイドライン（日本消化器内視鏡学会）'],
  ideal: (p) => [
    { a: 'test', ids: ['cbc', 'chem', 'coag'] },
    { a: 'fluid', fluidId: 'lr', mode: 'bolus', volume: 1000, when: 'sev>=1' },
    { a: 'rx', drugId: 'ppi', route: 'iv', dose: 20, freq: 'q12h', days: 3 },
    { a: 'wait', min: 20 },
    { a: 'fluid', fluidId: 'rbc', mode: 'bolus', volume: 560, when: 'hb<7' },
    { a: 'consult', dept: 'gi', delayMin: 20 },
  ],
};
