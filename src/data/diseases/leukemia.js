// 急性骨髄性白血病
// 出典: 日本血液学会『造血器腫瘍診療ガイドライン2023年版』
export default {
  id: 'leukemia', name: '急性骨髄性白血病', dept: '血液内科',
  weight: 1.5, season: {}, minLevel: 3,
  demo: { age: [30, 80], ageMode: 'uniform', male: 0.55 },
  sev: { p: [0.35, 0.45, 0.2], burden: [[32, 42], [44, 54], [56, 66]] },
  refractoryP: [0, 0.03, 0.08],
  comorb: { extra: {} },
  organisms: [],
  untreatedFatal: true,
  vars: () => ({}),
  cc: () => 'だるさと熱、あざが増えた', ccKey: 'bleeding',
  arrival: () => 'walk',
  history: {
    onset: { p: 1, text: '2〜3週間前からだるさと息切れがあり、熱が続いて、あざが増えました。' },
    character: { p: 1, text: '階段で息が切れ、体が重いです。' },
    fever: { p: 1, text: '38度前後の熱が続いています。' },
    fatigue: { p: 1, text: 'とてもだるいです。' },
    weightloss: { p: 0.4, text: '少しやせました。' },
    meds: { p: 1, text: '飲んでいる薬はありません。' },
    alcohol: { p: 0, text: '' }, pmh: { p: 1, text: '健診では異常を言われたことはありません。' }, family: { p: 0, text: '' },
  },
  exam: { skin: { p: 1, text: '四肢に紫斑・点状出血。' }, conjunctiva: { p: 1, text: '眼瞼結膜が蒼白。' }, oral_mucosa: { p: 0.6, text: '歯肉の腫脹と出血。' }, abd_palp: { p: 0.4, text: '脾臓を軽度触れる。' }, neck_ln: { p: 0.3, text: '小さなリンパ節を触れる。' } },
  vitals: { T: { to: [37.8, 38.6], k: 1 }, HR: { to: [100, 115], k: 1 } },
  labs: { WBC: { to: [25000, 80000], k: 0 }, HB: { add: [-7, -5], k: 0 }, PLT: { mul: [0.05, 0.15], k: 0 }, LDH: { add: [300, 1200], k: 0 }, URIC: { add: [2, 5], k: 0 }, PT_INR: { add: [0, 0.4], k: 1 } },
  tests: { smear: [{ p: 1, persist: true, text: '白血球の大部分（約70%）が芽球。アウエル小体を認める（急性骨髄性白血病を強く疑う）。' }] },
  natural: 0.2,
  curedBy: 'chemo',
  therapies: [
    { id: 'chemo', label: '血液内科コンサルト→骨髄検査と寛解導入療法（専門施設）', req: { procDone: 'chemo' }, required: true, deadlineH: [48, 24, 12] },
    { id: 'rbc', label: '輸血（貧血・血小板減少）', req: { fn: (enc) => (enc.state.rbcIn || 0) >= 140 }, when: (c) => c.lab('HB') < 7, required: true, deadlineH: [12, 8, 6], startFromNeed: true },
  ],
  procedures: [{
    id: 'chemo', depts: ['hema'], label: '骨髄検査・化学療法の開始', delay: 120, duration: 60, after: 'ward',
    decide: (enc) => {
      const sm = enc.tests.some((t) => t.id === 'smear' && t.done);
      if (!sm) return { accept: false, text: '血算の異常があるなら、末梢血の血液像（塗抹）を見せてください。' };
      return { accept: true, reveal: true, text: '芽球が増えており、急性白血病です。骨髄検査で病型を確定し、寛解導入療法を開始します。腫瘍崩壊症候群とDICに注意して、補液をお願いします。' };
    },
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 30); },
    doneText: '血液内科：骨髄検査で急性骨髄性白血病と確定し、寛解導入療法を開始しました。無菌室で管理します。',
  }],
  dispo: () => ({ ok: ['admit', 'icu'], best: 'admit', why: '急性白血病：血液内科に入院（化学療法・感染対策・輸血）' }),
  useful: ['cbc', 'smear', 'coag', 'chem', 'bcx', 'cxr', 'ua', 'crp'],
  key: [['cbc'], ['smear'], ['coag']],
  extrasOk: () => ['neutropenic_fever'],
  teaching: [
    '貧血（息切れ・倦怠感）・感染（発熱）・出血（紫斑・歯肉出血）の3つがそろえば、骨髄の病気（急性白血病）を疑う。',
    '白血球が多くても少なくても、血液像で芽球を確認する。DIC（凝固異常）・腫瘍崩壊症候群（高尿酸・高K・腎障害）に注意。',
    '診断は骨髄検査。専門施設で寛解導入療法を行う。',
  ],
  sources: ['造血器腫瘍診療ガイドライン2023年版（日本血液学会）'],
  ideal: () => [{ a: 'test', ids: ['cbc', 'smear', 'coag', 'chem', 'bcx'] }, { a: 'wait', min: 40 }, { a: 'fluid', fluidId: 'rbc', mode: 'bolus', volume: 560, when: 'hb<7' }, { a: 'fluid', fluidId: 'lr', mode: 'cont', rate: 100 }, { a: 'consult', dept: 'hema', delayMin: 1 }],
};
