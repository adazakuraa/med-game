// 急性心不全（慢性心不全の急性増悪）
// 出典: 日本循環器学会/日本心不全学会『2021年 JCS/JHFS ガイドライン フォーカスアップデート版 急性・慢性心不全診療』, 各薬剤添付文書
export default {
  id: 'adhf', name: '急性心不全（慢性心不全の急性増悪）', dept: '循環器内科',
  weight: 7, season: { winter: 1.4, summer: 0.8 }, minLevel: 2,
  demo: { age: [62, 93], ageMode: 'old', male: 0.5 },
  sev: { p: [0.35, 0.45, 0.2], burden: [[25, 38], [42, 58], [64, 78]] },
  refractoryP: [0, 0.02, 0.1],
  comorb: { forced: ['chf'], extra: { htn: 0.8, af: 0.4, ckd: 0.35, dm2: 0.3, dyslip: 0.3, ed: 0.15, bph: 0.2 } },
  organisms: [],
  vars: (rng, sev, pt) => {
    const cs1 = rng.chance(0.6);
    const hfref = rng.chance(0.6);
    const trigger = pt.comorb.includes('af') && rng.chance(0.3) ? 'af' : rng.pick(['salt', 'nonadherence', 'salt']);
    const T = {
      salt: ['親戚の集まりで、しょっぱいものをたくさん食べました。', 'はい、薬はきちんと飲んでいます。', '最近は漬物やラーメンなど塩辛いものが多く、水分も多めにとっていました。'],
      nonadherence: ['薬が切れてしまって、1週間ほど飲んでいませんでした。', '実は、利尿薬を含めて1週間ほど薬を飲んでいません。', '普段通りです。'],
      af: ['数日前から脈が乱れている感じがしました。', 'はい、薬はきちんと飲んでいます。', '普段通りです。'],
    }[trigger];
    return {
      cs1, hfref, trigger, triggerText: T[0], adherenceText: T[1], dietText: T[2], days: rng.int(3, 7), wg: rng.int(2, 5),
      ef: hfref ? rng.int(20, 38) : rng.int(52, 64), ctr: rng.int(56, 66), ivc: rng.int(20, 25),
      wall: hfref ? '左室はびまん性に壁運動低下' : '左室壁運動は保たれ、左室肥大と拡張障害パターン',
    };
  },
  cc: () => '息苦しさ',
  arrival: (sev) => (sev >= 1 ? 'ambulance' : 'walk'),
  initVolume: [[-2200, -1500], [-3200, -2200], [-4500, -3200]],
  history: {
    onset: { p: 1, text: '{days}日前から、少し動くと息が切れるようになりました。' },
    course: { p: 1, bySev: ['だんだん息切れがひどくなってきました。', '昨晩から横になると苦しくて、座って寝ていました。', '夜中に急に息ができなくなって、救急車を呼びました。'] },
    character: { p: 1, text: '空気が足りない感じで、ゼーゼーします。' },
    dyspnea: { p: 1, bySev: ['坂道や階段で息が切れます。', '家の中を歩くだけで息が切れます。', 'じっとしていても苦しいです。'] },
    orthopnea: { p: [0.6, 0.85, 0.97], text: '横になると苦しくなるので、枕を高くしたり座ったりしています。' },
    pnd: { p: [0.35, 0.6, 0.75], text: '夜中に息苦しくて目が覚めることがあります。' },
    edema: { p: 0.8, text: '両足がむくんで、靴がきつくなりました。' },
    weightgain: { p: 0.75, text: 'この{days}日で{wg}kgくらい増えました。' },
    cough: { p: 0.5, text: '夜になると咳が出ます。' },
    sputum: { p: [0.2, 0.3, 0.6], bySev: ['白い泡のような痰が少し出ます。', '白い泡のような痰が出ます。', 'ピンク色の泡のような痰が出ます。'] },
    chestpain: { p: 0.1, text: '胸が少し圧迫される感じがあります。' },
    palpitation: { p: 0.3, text: '時々ドキドキします。' },
    trigger: { p: 0.7, text: '{triggerText}' },
    adherence: { p: 1, text: '{adherenceText}' },
    diet: { p: 0.8, text: '{dietText}' },
    fever: { p: 0, text: '' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['軽度の息切れあり。会話は可能。', '起座呼吸。会話は短文で途切れる。', '起座呼吸で苦悶様。冷汗あり。'] },
    jvd: { p: [0.7, 0.85, 0.95], text: '頸静脈怒張あり（座位45°で胸骨角から5cm以上）。' },
    lung_ausc: [{ p: [0.8, 0.92, 0.98], text: '両側下肺野優位にfine crackles（捻髪音）を聴取。' }, { p: 0.3, text: '呼気性wheezesも聴取（心臓喘息）。' }],
    heart_ausc: { p: 0.6, text: 'III音（奔馬調律）を聴取。心尖部に収縮期雑音（Levine 2/6）。' },
    leg_edema: { p: 0.85, text: '両側下腿に圧痕性浮腫（pitting edema）。' },
    chest_insp: { p: [0.4, 0.8, 1], text: '頻呼吸。呼吸補助筋の使用あり。' },
    chest_perc: { p: 0.4, text: '両側下肺野で濁音（胸水を疑う）。' },
    periph: { p: [0, 0.2, 0.6], text: '四肢末梢の冷感あり。CRT 3秒。' },
  },
  vitals: { HR: { to: [105, 125], k: 0.8 }, RR: { to: [30, 38], k: 1 }, SpO2: { drop: [18, 24], k: 1.2 }, SBP: { to: [0, 0], k: 0.35, custom: true } },
  labs: {
    BNP: { to: [900, 3200], k: 0.7 }, TNT: { add: [0.01, 0.04], k: 1 }, CR: { add: [0.2, 0.7], k: 1.5 }, BUN: { add: [6, 18], k: 1.4 },
    NA: { add: [-5, -2], k: 1.2 }, LAC: { to: [2.5, 4.5], k: 2.5 }, AST: { add: [5, 40], k: 2, p: 0.4 }, DDIMER: { to: [1.0, 2.5], k: 1.5 },
    HB: { add: [-1.5, -0.5], k: 0.2, p: 0.4 },
  },
  tests: {
    cxr: [
      { p: 0.95, text: 'CTR 約{ctr}%の心拡大。' },
      { p: [0.8, 0.9, 0.97], text: '両側肺門部優位の肺うっ血（肺血管影の増強、Kerley B線）。' },
      { p: 0.55, text: '両側肋骨横隔膜角の鈍化（両側胸水）。' },
      { p: [0, 0.3, 0.7], text: '両側肺門から広がる蝶形陰影（バタフライシャドウ）。' },
    ],
    chest_ct: [{ p: 1, text: '心拡大。両側に小葉間隔壁肥厚とすりガラス影（肺水腫）。両側胸水。明らかな浸潤影なし。' }],
    echo: [{ p: 1, text: 'LVEF 約{ef}%。{wall}。下大静脈径 {ivc}mm で呼吸性変動消失。中等度の機能性僧帽弁逆流。' }],
  },
  ecg: [{ p: 0.5, text: '左室肥大所見（ストレイン型ST-T変化）。' }, { p: 0.3, text: '陳旧性心筋梗塞を示唆する異常Q波（V1-3）。' }],
  natural: 0.3,
  fluidLoss: () => 0,
  canDrink: () => true,
  therapies: [
    { id: 'diuretic', label: 'ループ利尿薬の静注', req: { tag: 'diuretic', min: 0.6 }, required: true, deadlineH: [6, 2, 1] },
    { id: 'vasodilator', label: '血管拡張薬（収縮期血圧>140のCS1）', req: { anyTag: ['nitrate', 'vasodilator'] }, when: (c) => c.enc.patient.vars.cs1 && c.vit.SBP > 110, required: true, deadlineH: [3, 1, 0.5], startFromNeed: true },
    { id: 'o2', label: '酸素投与（SpO2<90%）', req: { o2: true }, when: (c) => c.rawSpO2 < 90, required: true, deadlineH: [0.5, 0.5, 0.25] },
  ],
  dynamics: (enc, eff) => {
    const v = enc.patient.vars;
    let d = 0;
    d -= eff.diuresis * 0.009;
    if (eff.tags.nitrate) d -= v.cs1 ? 3.0 : 1.0;
    if (eff.tags.vasodilator) d -= v.cs1 ? 1.5 : 0.8;
    if (eff.nppv) d -= 1.2;
    d += eff.ivVolRate * 0.006;
    if (enc.state.volume > -400 && enc.state.diuresed > 500) d -= 1.2; // 利尿でうっ血が解除されると改善が加速
    return d;
  },
  customVitals: (enc, f) => {
    // CS1: 高血圧型、CS2: 血圧正常
    const v = enc.patient.vars;
    const base = v.cs1 ? 150 + 45 * Math.pow(f, 0.35) : 128 - 10 * f;
    return { SBP: base };
  },
  harmTags: {
    nsaid: 'NSAIDsは心不全を増悪させる（水・Na貯留）',
    antispasmodic: 'ブチルスコポラミンは重篤な心疾患に禁忌',
  },
  harmFluid: { maxBolus: 250, msg: '心不全患者への大量輸液でうっ血が悪化' },
  dispo: (enc, ctx) => {
    if (enc.patient.sev === 2 || ctx.initVit.SpO2 < 88) return { ok: ['icu'], best: 'icu', why: '呼吸不全を伴う急性心不全：CCU/ICU管理（NPPV考慮）' };
    return { ok: ['admit', 'icu'], best: 'admit', why: '急性心不全：入院加療' };
  },
  useful: ['cbc', 'chem', 'crp', 'bnp', 'tnt', 'vbg', 'cxr', 'chest_ct', 'echo', 'ecg', 'coag', 'ua', 'lab_K', 'lab_CR', 'lab_NA', 'lab_LAC'],
  key: [['cxr'], ['ecg'], ['bnp', 'echo'], ['chem', 'lab_K', 'lab_CR']],
  extrasOk: (enc, ctx) => {
    const out = [];
    if (enc.patient.comorb.includes('af')) out.push('af_rvr');
    if (ctx.initLab('CR') >= enc.patient.crBase * 1.5) out.push('aki');
    return out;
  },
  consult: { cardio: '循環器内科：心エコーでLVEF 約{ef}%、下大静脈拡張あり。うっ血性心不全の急性増悪です。利尿薬の静注と、血圧が高ければ血管拡張薬を。呼吸状態によりNPPVを検討してください。' },
  teaching: [
    '急性心不全ではクリニカルシナリオ（CS）で初期治療を考える。CS1（収縮期血圧>140）は血管拡張薬（硝酸薬）が中心、うっ血には利尿薬を使う。',
    '起座呼吸・頸静脈怒張・III音・両側crackles・下腿浮腫はうっ血の所見。BNP・胸部X線・心エコーで裏付ける。',
    '心不全増悪の誘因（塩分・水分過多、服薬アドヒアランス不良、不整脈、感染、虚血）を必ず探す。',
    'PDE5阻害薬（シルデナフィル等）を使用中の患者に硝酸薬は禁忌（重篤な低血圧）。',
    '心不全患者へのNSAIDsや大量輸液は増悪因子となる。',
  ],
  sources: ['日本循環器学会/日本心不全学会 2021年JCS/JHFSガイドライン フォーカスアップデート版 急性・慢性心不全診療', '各薬剤 添付文書'],
  ideal: (p) => [
    { a: 'test', ids: ['cbc', 'chem', 'bnp', 'tnt', 'cxr', 'ecg', 'echo'] },
    { a: 'o2', device: p.sev === 2 ? 'nppv' : 'nc', flow: 3, when: 'spo2<92' },
    { a: 'rx', drugId: 'furosemide_iv', route: 'iv', dose: 40, freq: 'q12h', days: 3 },
    { a: 'rx', drugId: 'ntg', route: 'iv', dose: 1, freq: 'cont', days: 1, when: 'cs1_nopde5' },
  ],
};
