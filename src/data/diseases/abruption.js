// 常位胎盤早期剥離
// 出典: 日本産科婦人科学会『産婦人科診療ガイドライン 産科編2023』
export default {
  id: 'abruption', name: '常位胎盤早期剥離', dept: '産婦人科',
  weight: 1, season: {}, minLevel: 3,
  demo: { age: [22, 42], ageMode: 'uniform', male: 0 },
  forcePregnant: true,
  sev: { p: [0.3, 0.45, 0.25], burden: [[36, 46], [48, 58], [60, 70]] },
  refractoryP: [0, 0.03, 0.08],
  comorb: { extra: {} },
  organisms: [],
  vars: (rng, sev) => ({ wk: rng.int(30, 37), hb0: [1, 2.5, 4][sev] + rng.range(0, 0.5) }),
  initHbLoss: (p) => p.vars.hb0,
  cc: () => '妊娠中の急な腹痛と出血', ccKey: 'lower_abd_f',
  arrival: () => 'ambulance',
  initVolume: [[500, 900], [900, 1500], [1500, 2200]],
  history: {
    onset: { p: 1, text: '妊娠{wk}週です。1時間前から急にお腹が強く痛くなり、出血しました。' },
    character: { p: 1, text: 'お腹がずっと板のように硬く張って痛みます。陣痛のように治まる時間がありません。' },
    location: { p: 1, text: 'お腹全体です。' },
    vagbleed: { p: 1, text: '暗い赤色の出血が少しあります。' },
    lmp: { p: 1, text: '妊娠{wk}週です。' },
    pmh: { p: 1, text: '妊娠高血圧症候群と言われていました。' },
    trigger: { p: 0.3, text: '転んでお腹を打ってはいません。' },
    dizziness: { p: [0.2, 0.6, 1], text: 'ふらふらします。' },
    fever: { p: 0, text: '' }, dysuria: { p: 0, text: '' }, radiation: { p: 0, text: '' }, nausea: { p: 0.3, text: '少し気持ち悪いです。' },
  },
  exam: { abd_palp: { p: 1, text: '子宮は板状に硬く（子宮硬直）、全体に圧痛。' }, gen_appear: { p: 1, bySev: ['痛みで苦しそう。', '顔色不良、冷汗。', '顔面蒼白、ショック状態。'] }, pelvic: { p: 0, text: '' } },
  vitals: { SBP: { to: [80, 95], k: 1.5 }, HR: { to: [110, 130], k: 1 } },
  labs: { PLT: { mul: [0.4, 0.7], k: 1 }, PT_INR: { add: [0.2, 0.8], k: 1.2 }, DDIMER: { to: [20, 60], k: 0.8 } },
  tests: { tvus: [{ p: 0.6, persist: true, text: '胎盤後血腫（胎盤の肥厚と後方の低エコー域）。胎児心拍は徐脈傾向（約100/分）。' }], abd_us: [{ p: 0.6, persist: true, text: '胎盤後血腫の疑い。胎児心拍の低下。' }] },
  natural: 0.6,
  curedBy: 'cs',
  therapies: [
    { id: 'fluid', label: '細胞外液・輸血（DICに注意して新鮮凍結血漿も）', req: { fluidTotal: 1000 }, required: true, deadlineH: [1, 1, 0.5] },
    { id: 'cs', label: '産婦人科コンサルト→緊急帝王切開', req: { procDone: 'cs' }, required: true, deadlineH: [3, 2, 2] },
  ],
  dynamics: (enc) => {
    const st = enc.state, sev = enc.patient.sev;
    if (st.procDone?.cs) return 0;
    st.hbLoss += [0.05, 0.12, 0.25][sev] / 6;
    return 0;
  },
  procedures: [{
    id: 'cs', depts: ['obgyn'], label: '緊急帝王切開', delay: 20, duration: 60, after: 'icu',
    decide: () => ({ accept: true, reveal: true, text: '常位胎盤早期剥離です。胎児機能不全もあり、直ちに帝王切開を行います（約20分後に手術室へ）。DICに備えて輸血と新鮮凍結血漿の準備をお願いします。' }),
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 30); },
    doneText: '産婦人科：緊急帝王切開で児を娩出しました（NICUへ）。胎盤は約50%剥離していました。DICの治療を続けます。',
  }],
  dispo: () => ({ ok: ['icu', 'admit'], best: 'icu', why: '常位胎盤早期剥離：緊急帝王切開・DICの管理' }),
  useful: ['cbc', 'coag', 'chem', 'tvus', 'abd_us', 'ua', 'vbg'],
  key: [['cbc'], ['coag']],
  extrasOk: () => ['preeclampsia'],
  teaching: [
    '妊娠後半の突然の持続的な腹痛・子宮の板状硬・性器出血（外出血は少ないことも）・胎児心拍の異常は常位胎盤早期剥離。妊娠高血圧症候群・外傷・喫煙がリスク。',
    'DIC（播種性血管内凝固）・出血性ショックを起こしやすい。凝固検査を必ず。',
    '治療は急速な輸液・輸血（新鮮凍結血漿）と、ほとんどの場合緊急帝王切開。',
    '前置胎盤（痛みのない出血）との区別に、内診の前に超音波で胎盤の位置を確認する。',
  ],
  sources: ['産婦人科診療ガイドライン 産科編2023（日本産科婦人科学会）'],
  ideal: () => [{ a: 'consult', dept: 'obgyn', delayMin: 1 }, { a: 'test', ids: ['cbc', 'coag', 'chem', 'tvus'] }, { a: 'fluid', fluidId: 'lr', mode: 'bolus', volume: 1000 }],
};
