// 急性腸間膜虚血（上腸間膜動脈塞栓症）
// 出典: 日本腹部救急医学会『急性腹症診療ガイドライン2015』, ESVS 2017 Guidelines on the Management of the Diseases of Mesenteric Arteries and Veins
export default {
  id: 'mesenteric', name: '急性腸間膜虚血（上腸間膜動脈塞栓症）', dept: '消化器外科',
  weight: 2, season: {}, minLevel: 3,
  demo: { age: [65, 92], ageMode: 'old', male: 0.5 },
  sev: { p: [0.3, 0.45, 0.25], burden: [[38, 48], [48, 58], [60, 70]] },
  refractoryP: [0, 0.05, 0.15],
  comorb: { extra: { htn: 0.7, af: 1, chf: 0.3 } },
  organisms: [],
  vars: (rng) => ({ hrs: rng.int(3, 10) }),
  cc: () => '激しい腹痛', ccKey: 'abd_pain',
  arrival: () => 'ambulance',
  initVolume: [[500, 900], [900, 1500], [1500, 2300]],
  history: {
    onset: { p: 1, text: '{hrs}時間前、急にお腹の真ん中が激しく痛くなりました。' },
    character: { p: 1, text: 'これまでにない、ものすごい痛みです。' },
    location: { p: 1, text: 'おへその周りです。' },
    severity: { p: 1, text: '10です。' },
    nausea: { p: 0.8, text: '何度も吐きました。' },
    diarrhea: { p: 0.5, text: '一度下痢をしました。' },
    bloodystool: { p: [0.1, 0.3, 0.6], text: '赤黒い便が出ました。' },
    pmh: { p: 1, text: '心房細動と高血圧があります。' },
    fever: { p: 0, text: '' }, migration: { p: 0, text: '' }, alcohol: { p: 0, text: '' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['痛みでのたうち回っている。', '苦しそうで冷汗。', 'ぐったりして、ショック状態。'] },
    abd_palp: { p: 1, text: '腹部は軟らかく、痛みの強さに比べて圧痛は軽い。' },
    abd_rebound: { p: [0, 0.3, 0.8], text: '腹部全体に反跳痛（腸管壊死の疑い）。' },
    heart_ausc: { p: 1, text: '脈が不規則（心房細動）。' },
  },
  vitals: { HR: { to: [110, 130], k: 1 }, SBP: { to: [80, 95], k: 2 } },
  labs: { LAC: { to: [3, 8], k: 1.3 }, WBC: { to: [14000, 25000], k: 1 }, DDIMER: { to: [5, 20], k: 1 }, CK: { add: [100, 800], k: 1.5 } },
  tests: {
    abd_ct_contrast: [{ p: 1, persist: true, text: '上腸間膜動脈の起始部から約3cmで造影欠損（塞栓）。小腸壁の造影効果が低下。' }],
    abd_ct_plain: [{ p: 0.3, text: '小腸の軽度拡張。明らかな遊離ガスはない。' }],
  },
  natural: 0.7,
  curedBy: 'revasc',
  therapies: [
    { id: 'hep', label: 'ヘパリン静注', req: { anyTag: ['anticoag_bolus', 'anticoag'] }, required: true, deadlineH: [3, 2, 1] },
    { id: 'fluid', label: '細胞外液の補液', req: { fluidTotal: 1000 }, required: true, deadlineH: [3, 2, 1] },
    { id: 'revasc', label: '外科・IVRコンサルト→血行再建（血栓除去・カテーテル治療）と壊死腸管の切除', req: { procDone: 'revasc' }, required: true, deadlineH: [8, 6, 5] },
  ],
  procedures: [{
    id: 'revasc', depts: ['surgery', 'cvs'], label: '緊急手術（血栓除去・腸切除）', delay: 60, duration: 150, after: 'icu',
    decide: (enc) => {
      const ct = enc.tests.some((t) => t.id === 'abd_ct_contrast' && t.done);
      if (!ct) return { accept: false, text: '痛みが強いのに腹部所見が軽いですね。腸間膜虚血を疑うので、造影CT（動脈相を含む）をお願いします。腎機能を待たずに撮ってください。' };
      return { accept: true, reveal: true, text: '上腸間膜動脈塞栓症です。緊急で血栓除去術を行い、壊死腸管があれば切除します（約60分後）。ヘパリンを開始してください。' };
    },
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 30); },
    doneText: '外科：上腸間膜動脈の血栓を除去し、壊死していた小腸を約50cm切除しました。ICUで管理します。',
  }],
  extrasOk: (enc, ctx) => (ctx.initVit.SBP < 90 ? ['septic_shock'] : []),
  dispo: () => ({ ok: ['icu'], best: 'icu', why: '急性腸間膜虚血：緊急手術・ICU' }),
  useful: ['abd_ct_contrast', 'abd_ct_plain', 'cbc', 'chem', 'coag', 'vbg', 'lab_LAC', 'ecg', 'lab_DDIMER', 'axr'],
  key: [['abd_ct_contrast'], ['vbg', 'lab_LAC']],
  teaching: [
    '心房細動の高齢者の「痛みの強さに比べて腹部所見が軽い」激しい腹痛は、急性腸間膜虚血を疑う。',
    '乳酸の上昇・代謝性アシドーシスは腸管壊死を示唆（早期は正常のことも）。',
    '診断は造影CT（動脈相）。腎機能の結果を待って造影を遅らせない。',
    '治療はヘパリン、外科・IVRでの血行再建と壊死腸管の切除。死亡率が高く、時間との勝負。',
  ],
  sources: ['急性腹症診療ガイドライン2015', 'ESVS 2017 Guidelines on the Management of the Diseases of Mesenteric Arteries and Veins'],
  ideal: (p) => [
    { a: 'test', ids: ['cbc', 'chem', 'coag', 'vbg', 'ecg', 'abd_ct_contrast'] },
    { a: 'fluid', fluidId: 'lr', mode: 'bolus', volume: 1000 },
    { a: 'rx', drugId: 'heparin_bolus', route: 'iv', dose: 5000, freq: 'once', days: 1 },
    { a: 'rx', drugId: 'morphine', route: 'iv', dose: 3, freq: 'once', days: 1 },
    { a: 'consult', dept: 'surgery', delayMin: 60 },
  ],
};
