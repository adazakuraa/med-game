// 食道静脈瘤破裂
// 出典: 日本消化器病学会/日本肝臓学会『肝硬変診療ガイドライン2020（改訂第3版）』, Baveno VII
export default {
  id: 'variceal', name: '食道静脈瘤破裂', dept: '消化器内科',
  weight: 2, season: {}, minLevel: 3,
  demo: { age: [45, 80], ageMode: 'uniform', male: 0.75 },
  sev: { p: [0.3, 0.45, 0.25], burden: [[32, 42], [44, 56], [58, 70]] },
  refractoryP: [0, 0.05, 0.12],
  comorb: { extra: { cirrhosis: 1, dm2: 0.2 } },
  organisms: [],
  prophylaxis: ['ecoli'],
  noPregnancy: true,
  vars: (rng, sev) => ({ hb0: [2.5, 4, 5.5][sev] + rng.range(-0.3, 0.5), forceAlcohol: true }),
  initHbLoss: (p) => p.vars.hb0,
  cc: () => '大量の吐血', ccKey: 'hematemesis',
  arrival: () => 'ambulance',
  initVolume: [[600, 1000], [1200, 1800], [1900, 2600]],
  history: {
    onset: { p: 1, text: '1時間前、急に真っ赤な血を洗面器いっぱいくらい吐きました。' },
    course: { p: 1, text: 'その後も2回吐きました。' },
    character: { p: 1, text: '鮮やかな赤い血の塊です。お腹は痛くありません。' },
    bloodystool: { p: 0.6, text: '黒い便も出ました。' },
    nausea: { p: 1, text: '気持ち悪いです。' },
    dizziness: { p: [0.6, 0.9, 1], text: '立つとふらふらして、目の前が暗くなります。' },
    alcohol: { p: 1, text: '20年以上、毎日日本酒を4〜5合飲んでいます。' },
    pmh: { p: 1, text: '肝硬変と言われています。お腹に水がたまったことがあります。' },
    meds: { p: 1, text: '利尿薬を処方されていますが、あまり飲んでいません。' },
    abdpain: { p: 0, text: '' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['顔色が悪い。', '顔面蒼白、冷汗。', '意識がもうろう、ショック状態。'] },
    skin: { p: 0.9, text: '眼球結膜の黄染、くも状血管腫、手掌紅斑。' },
    abd_insp: { p: 0.8, text: '腹部膨隆（腹水）と腹壁静脈の怒張。' },
    oral_mucosa: { p: 0.9, text: '眼瞼結膜は蒼白。口腔内に血液。' },
    periph: { p: [0.3, 0.8, 1], text: '四肢冷感。' },
  },
  vitals: { HR: { to: [110, 130], k: 1 } },
  labs: { PLT: { mul: [0.3, 0.5], k: 0 }, ALB: { add: [-1.4, -0.9], k: 0 }, TBIL: { add: [1, 3], k: 0 }, PT_INR: { add: [0.3, 0.8], k: 0 }, BUN: { add: [15, 35], k: 0.8 }, NH3: { add: [30, 80], k: 1 } },
  tests: { abd_us: [{ p: 1, persist: true, text: '肝臓は萎縮し表面が凹凸（肝硬変）。脾腫と腹水あり。' }], abd_ct_contrast: [{ p: 1, persist: true, text: '肝硬変・脾腫・腹水。食道〜胃噴門部に著明な静脈瘤。' }] },
  natural: 0,
  curedBy: null,
  therapies: [
    { id: 'rbc', label: '輸血（Hb 7g/dL未満を目安、過剰な輸血・輸液は避ける）', req: { fn: (enc) => (enc.state.rbcIn || 0) >= 140 }, when: (c) => c.lab('HB') < 7, required: true, deadlineH: [2, 1, 1], startFromNeed: true },
    { id: 'abx', label: '予防的抗菌薬（セフトリアキソン）', req: { coverage: ['ecoli'] }, required: true, deadlineH: [12, 8, 6] },
    { id: 'evl', label: '消化器内科コンサルト→緊急内視鏡（内視鏡的静脈瘤結紮術）', req: { procDone: 'evl' }, required: true, deadlineH: [12, 8, 6] },
  ],
  dynamics: (enc, eff) => {
    const st = enc.state, sev = enc.patient.sev;
    const stopped = st.procDone?.evl != null;
    const rate = stopped ? 0 : (0.15 + sev * 0.12) * (eff.tags.portal ? 0.6 : 1) * (eff.ivVolRate > 500 ? 1.3 : 1);
    st.hbLoss += rate / 6;
    st.volume += (rate * 150) / 6;
    const hb = 14 - st.hbLoss + ((st.rbcIn || 0) / 280) * 1.5 * (60 / enc.patient.weight);
    let d = stopped ? -1.2 : 0.2;
    if (hb < 7) d += 0.8;
    if (!stopped && !(eff.covers?.ecoli > 0) && enc.t > 12 * 60) d += 0.2; // 細菌感染の合併
    return d;
  },
  procedures: [{
    id: 'evl', depts: ['gi'], label: '緊急内視鏡（静脈瘤結紮術）', delay: 60, duration: 60, after: 'icu',
    decide: (enc, vit) => {
      if (vit.SBP < 80) return { accept: false, reveal: true, text: '肝硬変があり、静脈瘤破裂を考えます。まず輸血で循環を安定させてください（Hb 7〜8を目標、入れすぎない）。安定したらすぐ内視鏡を行います。' };
      return { accept: true, reveal: true, text: '食道静脈瘤破裂を考えます。緊急内視鏡で静脈瘤結紮術を行います（約60分後）。予防的抗菌薬（セフトリアキソン）もお願いします。' };
    },
    onDone: () => {},
    doneText: '消化器内科：食道下部の静脈瘤からの噴出性出血を、内視鏡的静脈瘤結紮術（EVL）で止血しました。',
  }],
  harmTags: { antiplatelet: '活動性の消化管出血に抗血小板薬', anticoag: '活動性の消化管出血に抗凝固薬', anticoag_bolus: '活動性の消化管出血に抗凝固薬', nsaid: '肝硬変・消化管出血にNSAIDs', benzo: '肝硬変（肝性脳症のリスク）にベンゾジアゼピン' },
  dispo: () => ({ ok: ['icu'], best: 'icu', why: '食道静脈瘤破裂：ICU（再出血・肝性脳症・感染症に注意）' }),
  useful: ['cbc', 'chem', 'coag', 'vbg', 'lab_HB', 'nh3', 'abd_us', 'abd_ct_contrast', 'ecg', 'bcx'],
  key: [['cbc', 'lab_HB'], ['coag'], ['chem']],
  extrasOk: () => ['hepatic_enc'],
  teaching: [
    '肝硬変・大量飲酒の人の大量の鮮血吐血は食道静脈瘤破裂を考える。くも状血管腫・手掌紅斑・腹水・脾腫・血小板減少が手がかり。',
    '輸血はHb 7〜8g/dLを目標に控えめに（過剰な輸血・輸液は門脈圧を上げて再出血を招く）。',
    '予防的抗菌薬（セフトリアキソン）で感染と再出血を減らし生存率が改善する。',
    '緊急内視鏡で静脈瘤結紮術（EVL）。止血困難ならバルーンタンポナーデ・TIPS。肝性脳症にも注意。',
  ],
  sources: ['肝硬変診療ガイドライン2020（日本消化器病学会/日本肝臓学会）', 'Baveno VII Consensus (2022)'],
  ideal: () => [
    { a: 'test', ids: ['cbc', 'chem', 'coag', 'vbg'] },
    { a: 'fluid', fluidId: 'rbc', mode: 'bolus', volume: 560 },
    { a: 'rx', drugId: 'ctrx', route: 'iv', dose: 1000, freq: 'q24h', days: 5 },
    { a: 'rx', drugId: 'ppi', route: 'iv', dose: 20, freq: 'q12h', days: 3 },
    { a: 'wait', min: 30 },
    { a: 'fluid', fluidId: 'rbc', mode: 'bolus', volume: 280, when: 'hb<7' },
    { a: 'consult', dept: 'gi', delayMin: 15 },
  ],
};
