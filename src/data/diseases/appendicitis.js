// 急性虫垂炎
// 出典: 日本腹部救急医学会ほか『急性腹症診療ガイドライン2015』, WSES Jerusalem guidelines (2020), CODA trial (NEJM 2020), JAID/JSC感染症治療ガイド2023
export default {
  id: 'appendicitis', name: '急性虫垂炎', dept: '外科',
  weight: 7, season: {}, minLevel: 1,
  demo: { age: [16, 65], ageMode: 'young', male: 0.5 },
  sev: { p: [0.45, 0.4, 0.15], burden: [[22, 34], [40, 55], [60, 72]] },
  refractoryP: [0, 0, 0.02],
  comorb: { extra: { htn: 0.1, dyslip: 0.1, asthma_nsaid: 0.03, constip: 0.1 } },
  organisms: ['ecoli', 'anaerobe'],
  minAbxDays: 7,
  vars: (rng, sev) => ({
    hours: [rng.int(10, 20), rng.int(18, 36), rng.int(30, 60)][sev],
    migrated: rng.chance(0.6), diam: rng.int(8, 13), fecalith: rng.chance(0.3),
  }),
  postVars: (v) => {
    v.charText = v.migrated ? 'はじめはみぞおちのあたりが重苦しい感じでしたが、今は右下腹部がズキズキ痛みます。' : '右下腹部がずっとズキズキ痛みます。';
    v.migText = v.migrated ? 'はい、最初はみぞおちのあたりでした。今は右の下腹です。' : 'ずっと右の下腹です。';
  },
  cc: () => '腹痛',
  arrival: () => 'walk',
  initVolume: [[300, 700], [600, 1200], [1000, 1800]],
  history: {
    onset: { p: 1, text: '{hours}時間ほど前からお腹が痛くなりました。' },
    course: { p: 1, bySev: ['だんだん痛みが強くなってきました。', '痛みがどんどん強くなり、歩くのもつらいです。', '痛みがお腹全体に広がってきて、熱も上がってきました。'] },
    character: { p: 1, text: '{charText}' },
    location: { p: 1, text: '右の下腹部です。' },
    migration: { p: 1, text: '{migText}' },
    severity: { p: 1, bySev: ['5くらいです。', '7くらいです。', '9くらいです。'] },
    aggravating: { p: 0.75, text: '歩くとお腹に響きます。車の振動でも痛みました。' },
    relieving: { p: 0.4, text: 'じっとして体を丸めていると少し楽です。' },
    abdpain: { p: 1, text: '右の下腹部が痛いです。' },
    anorexia: { p: 0.85, text: '食欲はありません。' },
    nausea: { p: 0.6, text: '痛くなってから少し吐き気があり、1回吐きました。' },
    fever: { p: [0.3, 0.45, 0.8], text: '37度台の熱があります。' },
    diarrhea: { p: 0.1, text: '少しゆるい便が1回ありました。' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['痛みで顔をしかめている。', '痛みが強く、体を丸めている。', '苦悶様。体動で痛みが増強する。'] },
    abd_palp: { p: 1, text: '右下腹部に限局した圧痛。' },
    mcburney: { p: 0.9, text: 'McBurney点に圧痛あり。' },
    abd_rebound: { p: [0.45, 0.65, 0.9], text: '右下腹部で反跳痛陽性（Blumberg徴候）。' },
    abd_guard: [{ p: [0.2, 0.45, 0.85], text: '右下腹部に筋性防御。' }, { p: 1, minBurden: 75, text: '腹部全体に板状硬（汎発性腹膜炎を疑う）。' }],
    rovsing: { p: 0.4, text: 'Rovsing徴候陽性（左下腹部圧迫で右下腹部に痛み）。' },
    psoas: { p: 0.3, text: '右腸腰筋徴候陽性。' },
    abd_ausc: { p: 0.4, text: '腸蠕動音は減弱。' },
    abd_perc: { p: 0.5, text: '右下腹部に打診痛あり。' },
  },
  vitals: { T: { to: [37.6, 38.6], k: 0.8 }, HR: { to: [100, 118], k: 0.9 }, RR: { to: [20, 24], k: 1 }, SBP: { to: [85, 100], k: 3 } },
  labs: {
    WBC: { to: [12000, 18000], k: 0.5 }, NEUT: { to: [80, 88], k: 0.5 }, CRP: { to: [4, 18], k: 1.6 },
    U_LEU: { ord: [2, 2], p: 0.15 }, U_WBC: { to: [5, 15], k: 0.3, p: 0.15 }, U_BLD: { ord: [1, 2], p: 0.1 }, U_KET: { ord: [1, 2], p: 0.4 },
  },
  tests: {
    abd_us: [{ p: 0.8, text: '右下腹部に径{diam}mmの腫大した虫垂を認め、圧迫で変形しない。周囲脂肪織のエコー輝度上昇。' }, { p: 1, fecalith: true, text: '虫垂内に音響陰影を伴う高エコー（糞石）。' }],
    abd_ct_contrast: [{ p: 0.96, text: '虫垂は径{diam}mmに腫大し、壁の造影増強と周囲脂肪織濃度上昇を伴う。' }, { p: 1, fecalith: true, text: '虫垂根部に糞石あり。' }, { p: 1, minBurden: 75, text: '虫垂周囲に液体貯留と少量の遊離ガス（穿孔を疑う）。' }],
    abd_ct_plain: [{ p: 0.88, text: '虫垂の腫大（径{diam}mm）と周囲脂肪織濃度上昇。' }, { p: 1, fecalith: true, text: '虫垂内に糞石。' }, { p: 1, minBurden: 75, text: '虫垂周囲に液体貯留と少量の遊離ガス（穿孔を疑う）。' }],
    axr: [{ p: 0.1, fecalith: true, text: '右下腹部に小石灰化（糞石の可能性）。' }],
  },
  natural: 0.6,
  therapies: [
    { id: 'abx', label: '腹腔内感染をカバーする抗菌薬（腸内細菌＋嫌気性菌）', req: { coverage: ['ecoli', 'anaerobe'] }, effect: -0.45, lagH: 4, required: true, deadlineH: [12, 6, 3] },
    { id: 'surgery', label: '外科コンサルト→虫垂切除術', req: { surgery: true }, required: (enc) => enc.patient.vars.fecalith || enc.patient.sev >= 1 || enc.state.perforated, deadlineH: [24, 12, 6] },
  ],
  dynamics: (enc, eff) => {
    const st = enc.state, v = enc.patient.vars;
    const covered = (eff.covers.ecoli || 0) >= 0.5 && (eff.covers.anaerobe || 0) >= 0.5;
    // 合併症のない虫垂炎は抗菌薬単独でも多くが軽快する
    return covered && !v.fecalith && !st.perforated && st.burden < 50 ? -0.55 : 0;
  },
  nonOperative: true, // 合併症のない虫垂炎は抗菌薬単独治療も選択肢（再発リスクあり）
  perforateAt: 75,
  dispo: (enc, ctx) => (ctx.initVit.SBP < 90 ? { ok: ['icu'], best: 'icu', why: '穿孔性腹膜炎・敗血症性ショック：ICU' } : { ok: ['admit'], best: 'admit', why: '急性虫垂炎：入院（手術または抗菌薬治療）' }),
  useful: ['cbc', 'chem', 'crp', 'ua', 'uhcg', 'abd_us', 'abd_ct_contrast', 'abd_ct_plain', 'coag', 'ecg', 'cxr', 'vbg'],
  key: [['abd_us', 'abd_ct_contrast', 'abd_ct_plain'], ['cbc']],
  keyIfFemale: [['uhcg']],
  extrasOk: (enc, ctx) => (ctx.initVit.SBP < 90 ? ['sepsis', 'septic_shock', 'perforation'] : enc.state.perforated ? ['perforation'] : []),
  surgeon: true,
  teaching: [
    '心窩部→右下腹部への痛みの移動、食欲不振、McBurney点圧痛、反跳痛は虫垂炎を強く示唆する（Alvarado scoreなど）。',
    '診断には腹部超音波や造影CTが有用。妊娠可能年齢の女性では妊娠反応を確認し、異所性妊娠や卵巣疾患を鑑別する。',
    '糞石・穿孔・膿瘍などを伴う複雑性虫垂炎は手術（虫垂切除）が原則。合併症のない虫垂炎では抗菌薬単独治療も選択肢だが、再発リスクがある。',
    '鎮痛薬で診断が不正確になるという根拠は乏しく、適切な鎮痛を行ってよい。',
    '尿中に少量の白血球が出ることがあり（炎症の波及）、尿路感染症と誤診しないよう注意する。',
  ],
  sources: ['急性腹症診療ガイドライン2015', 'WSES Jerusalem guidelines on diagnosis and treatment of acute appendicitis (2020)', 'CODA Collaborative. N Engl J Med 2020;383:1907-19', 'JAID/JSC感染症治療ガイド2023'],
  ideal: (p) => [
    { a: 'test', ids: ['cbc', 'chem', 'crp', 'ua', 'abd_ct_contrast'].concat(p.sex === 'F' ? ['uhcg'] : []) },
    { a: 'rx', drugId: 'cmz', route: 'iv', dose: 1000, freq: 'q8h', days: 3 },
    { a: 'npo' },
    { a: 'fluid', fluidId: 'sol3', mode: 'cont', rate: 80 },
    { a: 'consult', dept: 'surgery', delayMin: 70 },
  ],
};
