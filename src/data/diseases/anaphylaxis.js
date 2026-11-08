// アナフィラキシー
// 出典: 日本アレルギー学会『アナフィラキシーガイドライン2022』, 各薬剤添付文書
export default {
  id: 'anaphylaxis', name: 'アナフィラキシー', dept: '内科',
  weight: 3, season: { summer: 1.3 }, minLevel: 1,
  demo: { age: [16, 75], ageMode: 'uniform', male: 0.5 },
  sev: { p: [0.35, 0.45, 0.2], burden: [[25, 35], [40, 52], [58, 70]] },
  refractoryP: [0, 0, 0.05],
  comorb: { extra: { asthma: 0.15, htn: 0.15 } },
  organisms: [],
  minHoursToCure: 4,
  vars: (rng) => {
    const trig = rng.pick(['food', 'drug', 'bee']);
    return {
      trig, min: rng.int(10, 40),
      trigText: { food: '昼にえびの入ったパスタを食べて', drug: '近くのクリニックでもらった抗菌薬を飲んで', bee: '庭仕事中にハチに刺されて' }[trig],
    };
  },
  cc: () => '全身のじんましんと息苦しさ',
  ccKey: 'rash_dyspnea',
  arrival: (sev) => (sev >= 1 ? 'ambulance' : 'walk'),
  initVolume: [[0, 300], [700, 1300], [1500, 2500]],
  history: {
    onset: { p: 1, text: '{min}分ほど前、{trigText}しばらくしてからです。' },
    course: { p: 1, bySev: ['かゆみとじんましんが広がってきて、少し息苦しいです。', 'どんどん息苦しくなって、ふらふらします。', '……息が……苦しい……（会話困難）'] },
    character: { p: 1, text: '全身がかゆくて、喉が詰まるような感じがします。' },
    trigger: { p: 1, text: '{trigText}から症状が出ました。' },
    dyspnea: { p: [0.7, 0.9, 1], text: '喉が締め付けられて息が苦しいです。' },
    nausea: { p: 0.5, text: '吐き気があります。' },
    abdpain: { p: 0.4, text: 'お腹も痛いです。' },
    dizziness: { p: [0.2, 0.6, 0.9], text: '立つとふらふらして、目の前が暗くなります。' },
    sorethroat: { p: 0.4, text: '喉がイガイガして、声が出しにくいです。' },
    pmh: { p: 0.3, text: '以前にも同じものでじんましんが出たことがあります。' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['不安そうにかゆがっている。', '顔面紅潮し、呼吸が苦しそう。', '顔面蒼白でぐったり。呼吸困難が強い。'] },
    skin: { p: 1, unlessProc: '__none', text: '全身に膨疹（じんましん）と紅潮。' },
    pharynx: { p: 0.45, text: '口唇・まぶたの腫れ（血管性浮腫）。咽頭の浮腫。' },
    lung_ausc: { p: [0.4, 0.7, 0.9], text: '両側で呼気性wheezes。' },
    periph: { p: [0, 0.3, 0.9], text: '四肢末梢冷感。CRT 3秒以上。' },
  },
  vitals: { HR: { to: [120, 145], k: 0.8 }, RR: { to: [26, 34], k: 1 }, SpO2: { drop: [8, 16], k: 1.4 }, SBP: { to: [55, 75], k: 1.6 } },
  labs: {},
  tests: {},
  natural: 0,
  therapies: [
    { id: 'adrenaline', label: 'アドレナリン 0.3〜0.5mg 筋注（大腿外側）', req: { tag: 'epinephrine' }, required: true, deadlineH: [0.25, 0.25, 0.25] },
    { id: 'fluid', label: '低血圧には細胞外液の急速投与', req: { fluidTotal: 1000 }, when: (c) => c.vit.SBP < 90, required: true, deadlineH: [1, 1, 1], startFromNeed: true },
    { id: 'o2', label: '酸素投与', req: { o2: true }, when: (c) => c.rawSpO2 < 92, required: true, deadlineH: [0.5, 0.5, 0.25] },
    { id: 'h1', label: '抗ヒスタミン薬（皮膚症状の補助治療）', req: { tag: 'antihistamine' }, required: false, deadlineH: [2, 2, 2] },
  ],
  dynamics: (enc, eff) => {
    const st = enc.state;
    if (eff.tags.epinephrine) st.epiGiven = true;
    let d = st.epiGiven ? -1.5 : 1.2; // 未治療では進行、アドレナリン投与後は軽快に向かう
    if (eff.tags.epinephrine) d -= 10;
    if (eff.tags.antihistamine) d -= 0.3;
    if (eff.tags.steroid_sys || eff.tags.steroid) d -= 0.3;
    if (eff.tags.betablocker) d += 3;
    return d;
  },
  harmTags: { betablocker: 'アナフィラキシーにβ遮断薬（アドレナリンが効きにくくなり悪化）' },
  dispo: (enc) => (enc.patient.sev === 2 ? { ok: ['icu', 'admit'], best: 'icu', why: 'ショックを伴う重症アナフィラキシー：ICUで管理' } : enc.patient.sev === 1 ? { ok: ['admit'], best: 'admit', why: '中等症：二相性反応に備え入院で経過観察' } : { ok: ['home', 'admit'], best: 'home', why: '改善後4〜6時間の経過観察で再燃がなければ帰宅（アドレナリン自己注射薬の処方と指導）' }),
  useful: ['cbc', 'chem', 'vbg', 'ecg'],
  key: [],
  extrasOk: () => ['urticaria', 'angioedema'],
  teaching: [
    'アレルゲン曝露後、急速に皮膚症状＋呼吸器症状・血圧低下・消化器症状が出ればアナフィラキシー。',
    '第一選択はアドレナリン0.01mg/kg（成人0.3〜0.5mg）の大腿外側への筋注。迷ったら打つ。効果不十分なら5〜15分ごとに反復。',
    '抗ヒスタミン薬・ステロイドは補助。アドレナリンの代わりにはならない。',
    '低血圧には細胞外液の急速投与。仰臥位で下肢挙上。',
    '数時間後に再燃する二相性反応があるため、改善後も経過観察する。β遮断薬内服中はアドレナリンが効きにくい。',
    '退院時はアドレナリン自己注射薬（エピペン）の処方と原因の回避を指導する。',
  ],
  sources: ['アナフィラキシーガイドライン2022（日本アレルギー学会）', '各薬剤 添付文書'],
  ideal: (p) => [
    { a: 'rx', drugId: 'adrenaline', route: 'im', dose: 0.5, freq: 'once', days: 1 },
    { a: 'o2', device: 'mask', flow: 6, when: 'spo2<92' },
    { a: 'fluid', fluidId: 'lr', mode: 'bolus', volume: 1000, when: 'sev>=1' },
    { a: 'rx', drugId: 'chlorphen', route: 'iv', dose: 5, freq: 'once', days: 1 },
  ],
};
