// 妊娠高血圧腎症（重症）
// 出典: 日本妊娠高血圧学会『妊娠高血圧症候群 新定義・臨床分類』, 日本産科婦人科学会『産婦人科診療ガイドライン 産科編2023』
export default {
  id: 'preeclampsia', name: '妊娠高血圧腎症（重症）', dept: '産婦人科',
  weight: 2, season: {}, minLevel: 3,
  demo: { age: [22, 42], ageMode: 'uniform', male: 0 },
  forcePregnant: true,
  sev: { p: [0.3, 0.5, 0.2], burden: [[30, 40], [42, 54], [56, 66]] },
  refractoryP: [0, 0, 0.03],
  comorb: { extra: {} },
  organisms: [],
  vars: (rng) => ({ wk: rng.int(32, 37) }),
  cc: () => '妊娠中の頭痛とむくみ', ccKey: 'bp_high',
  arrival: (sev) => (sev === 0 ? 'walk' : 'ambulance'),
  history: {
    onset: { p: 1, text: '妊娠{wk}週です。昨日から頭が痛く、顔や手足のむくみがひどくなりました。' },
    headache: { p: 1, text: '頭全体がズキズキします。' },
    vision: { p: [0.2, 0.5, 0.8], text: '目の前がチカチカします（閃輝暗点）。' },
    abdpain: { p: [0.1, 0.3, 0.7], text: 'みぞおちから右上腹部が痛みます。' },
    edema: { p: 1, text: '1週間で体重が2kg増えて、指輪がはまりません。' },
    pmh: { p: 1, text: '初めての妊娠です。妊婦健診で血圧が少し高いと言われていました。' },
    nausea: { p: 0.4, text: '少し吐き気があります。' },
    lmp: { p: 1, text: '妊娠{wk}週です。' },
    seizure: { p: 0, text: '' }, chestpain: { p: 0, text: '' }, dyspnea: { p: [0, 0.2, 0.5], text: '少し息苦しいです。' },
  },
  exam: { leg_edema: { p: 1, text: '両下腿・手指・顔面の浮腫。' }, tremor: { p: 0.6, text: '腱反射の亢進。' }, abd_palp: { p: [0.1, 0.3, 0.7], text: '心窩部〜右季肋部に圧痛。' } },
  vitals: { SBP: { to: [165, 185], k: 0.3 } },
  labs: { U_PRO: { to: [2, 3], k: 0.5 }, PLT: { mul: [0.4, 0.8], k: 1.5 }, AST: { add: [10, 150], k: 1.5 }, ALT: { add: [10, 150], k: 1.5 }, CR: { add: [0.1, 0.5], k: 1 }, URIC: { add: [1.5, 3], k: 1 } },
  tests: { tvus: [{ p: 1, text: '子宮内に生存胎児（推定体重はやや小さい）。胎盤の剥離所見はない。' }] },
  natural: 0.35,
  curedBy: 'delivery',
  therapies: [
    { id: 'bp', label: '降圧（ニカルジピン静注、収縮期160未満を目標・下げすぎない）', req: { anyTag: ['bp_lower'] }, when: (c) => c.vit.SBP >= 160, required: true, deadlineH: [1, 1, 0.5], startFromNeed: true, effect: -0.3, lagH: 0 },
    { id: 'mg', label: '子癇予防の硫酸マグネシウム', req: { tag: 'mgso4' }, required: true, deadlineH: [2, 1, 1], effect: -0.2, lagH: 0 },
    { id: 'delivery', label: '産婦人科コンサルト→母体搬送・妊娠の終結（分娩）の判断', req: { procDone: 'delivery' }, required: true, deadlineH: [12, 8, 6] },
  ],
  dynamics: (enc, eff) => {
    const st = enc.state;
    if (!eff.tags.mgso4 && !st.comp.eclampsia && st.burden > 60 && enc.patient.seed % 4 === 0) { st.comp.eclampsia = enc.t; st.burden += 10; }
    return 0;
  },
  procedures: [{
    id: 'delivery', depts: ['obgyn'], label: '妊娠の終結（帝王切開）', delay: 60, duration: 90, after: 'ward',
    decide: (enc) => ({ accept: true, reveal: true, text: '重症の妊娠高血圧腎症です（HELLP症候群に注意）。降圧と硫酸マグネシウムを続けてください。母体の安全のため、ステロイド（胎児の肺成熟）を投与のうえ帝王切開で分娩とします（約60分後）。' }),
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 25); },
    doneText: '産婦人科：帝王切開で分娩しました。児はNICUで管理します。母体は産後も血圧と子癇に注意して管理します。',
  }],
  harmTags: { arb: '妊婦にARB（胎児毒性）' },
  dispo: () => ({ ok: ['icu', 'admit'], best: 'admit', why: '重症妊娠高血圧腎症：入院（周産期センター）で母体・胎児の管理と分娩' }),
  useful: ['ua', 'cbc', 'chem', 'coag', 'tvus', 'uhcg', 'lab_PLT'],
  key: [['ua'], ['cbc'], ['chem']],
  extrasOk: () => [],
  teaching: [
    '妊娠20週以降の高血圧（140/90以上）に蛋白尿や臓器障害（肝・腎・血小板減少・神経症状）を伴うのが妊娠高血圧腎症。',
    '頭痛・視覚異常（閃輝暗点）・心窩部痛・腱反射亢進は子癇（けいれん）やHELLP症候群（溶血・肝酵素上昇・血小板減少）の前触れ。',
    '治療：降圧（ニカルジピン・ヒドララジンなど、収縮期160以上は急いで、下げすぎない）、硫酸マグネシウムで子癇予防、根本治療は分娩。',
    'ACE阻害薬・ARBは妊娠中禁忌。',
  ],
  sources: ['産婦人科診療ガイドライン 産科編2023（日本産科婦人科学会）', '妊娠高血圧症候群の診療指針2021（日本妊娠高血圧学会）'],
  ideal: (p) => [
    { a: 'test', ids: ['ua', 'cbc', 'chem', 'coag'] },
    { a: 'rx', drugId: 'nicardipine', route: 'iv', dose: 1, freq: 'cont', days: 2, when: 'sbp>160' },
    { a: 'rx', drugId: 'mgso4', route: 'iv', dose: 1, freq: 'cont', days: 2 },
    { a: 'consult', dept: 'obgyn', delayMin: 5 },
  ],
};
