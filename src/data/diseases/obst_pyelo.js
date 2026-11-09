// 閉塞性腎盂腎炎（尿管結石嵌頓に伴う）
// 出典: 日本泌尿器科学会ほか『尿路結石症診療ガイドライン2023年版』, JAID/JSC感染症治療ガイド2023
import { T, sepsisExtras } from './common.js';
export default {
  id: 'obst_pyelo', name: '閉塞性腎盂腎炎（結石性）', dept: '泌尿器科',
  weight: 3, season: { summer: 1.2 }, minLevel: 2,
  demo: { age: [40, 85], ageMode: 'uniform', male: 0.4 },
  sev: { p: [0.25, 0.45, 0.3], burden: [[36, 46], [48, 58], [60, 70]] },
  refractoryP: [0, 0.03, 0.1],
  comorb: { extra: { dm2: 0.35, htn: 0.4 } },
  organisms: ['ecoli'], minAbxDays: 10,
  vars: (rng) => ({ side: rng.pick(['右', '左']), d: rng.int(1, 3), mm: rng.int(6, 10) }),
  cc: () => '発熱と腰の痛み', ccKey: 'fever_flank',
  arrival: (sev) => (sev === 0 ? 'walk' : 'ambulance'),
  history: {
    onset: { p: 1, text: '{d}日前に{side}の腰が急に痛くなり、昨日から高い熱が出ました。' },
    character: { p: 1, text: '{side}の腰が重く痛みます。最初は波のある激痛でした。' },
    location: { p: 1, text: '{side}の腰から脇腹です。' },
    chills: { p: 0.9, text: 'ガタガタ震えるほどの寒気がありました。' },
    fever: { p: 1, text: '39度台の熱です。' },
    nausea: { p: 0.6, text: '吐き気があります。' },
    hematuria: { p: 0.5, text: '最初の日に、おしっこが赤かったです。' },
    pmh: { p: 0.7, text: '以前に尿管結石をしたことがあります。' },
    dysuria: { p: 0.3, text: '少し排尿時に痛みます。' },
    frequency: { p: 0.3, text: '少し近いです。' },
    lmp: { p: 0, text: '' }, allergy: { p: 0, text: '' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['熱っぽく、つらそう。', 'ぐったりしている。', '顔色不良、悪寒戦慄、冷汗。'] },
    cva: { p: 1, text: '{side}CVA叩打痛が著明。' },
    abd_palp: { p: 0.4, text: '{side}側腹部に圧痛。' },
  },
  vitals: { T: { to: [38.8, 40], k: 0.5 }, HR: { to: [110, 130], k: 1 }, SBP: { to: [75, 90], k: 2 } },
  labs: { WBC: { to: [14000, 25000], k: 0.7 }, CRP: { to: [10, 30], k: 0.8 }, CR: { add: [0.3, 1.5], k: 1.2 }, PLT: { mul: [0.4, 0.8], k: 1.5 }, PCT: { to: [2, 30], k: 1 }, U_LEU: { to: [2, 3], k: 0 }, U_NIT: { to: [1, 1], k: 0 }, U_WBC: { to: [50, 100], k: 0 }, U_RBC: { to: [20, 50], k: 0 } },
  tests: {
    abd_us: [{ p: 0.95, persist: true, unlessProc: 'stent', text: '{side}腎盂・尿管の拡張（中等度の水腎症）。' }],
    abd_ct_plain: [{ p: 1, persist: true, text: '{side}尿管下部に約{mm}mmの結石と、口側の尿管・腎盂の拡張。腎周囲の脂肪織混濁。' }],
    ucx: [{ p: 0.9, text: 'Escherichia coli 10^5 CFU/mL以上（感受性良好）。' }],
    bcx: [{ p: 0.6, text: '2セット中2セットからEscherichia coli。' }],
  },
  natural: 0.6,
  curedBy: 'stent',
  therapies: [
    T.abx(['ecoli'], '抗菌薬（セフトリアキソンなど、重症は広域に）', [3, 2, 1], -0.3, 6),
    T.fluid(1000),
    T.proc('stent', '泌尿器科コンサルト→緊急ドレナージ（尿管ステント・腎瘻）', [12, 8, 6]),
  ],
  procedures: [{
    id: 'stent', depts: ['uro'], label: '尿管ステント留置', delay: 60, duration: 45, after: 'ward',
    decide: (enc) => {
      const img = enc.tests.some((t) => ['abd_us', 'abd_ct_plain', 'abd_ct_contrast'].includes(t.id) && t.done && t.result.abnormal);
      if (!img) return { accept: false, text: '発熱を伴う腰痛で、結石による閉塞があれば緊急ドレナージが必要です。エコーかCTで水腎症と結石を確認してください。' };
      return { accept: true, reveal: true, text: '{side}尿管結石による閉塞性腎盂腎炎です。抗菌薬だけでは治らないので、緊急で尿管ステントを留置します（約60分後）。' };
    },
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 35); },
    doneText: '泌尿器科：{side}尿管ステントを留置し、膿性の尿が流出しました。抗菌薬を継続してください。結石は後日治療します。',
  }],
  dispo: (enc, ctx) => (ctx.initVit.SBP < 90 ? { ok: ['icu'], best: 'icu', why: '敗血症性ショック：ICU' } : { ok: ['admit', 'icu'], best: 'admit', why: '閉塞性腎盂腎炎：入院・緊急ドレナージ' }),
  useful: ['ua', 'ucx', 'bcx', 'cbc', 'chem', 'crp', 'pct', 'abd_us', 'abd_ct_plain', 'abd_ct_contrast', 'vbg', 'lab_LAC', 'coag', 'uhcg', 'urine_gram'],
  key: [['ua'], ['ucx'], ['bcx'], ['abd_us', 'abd_ct_plain', 'abd_ct_contrast']],
  extrasOk: (enc, ctx) => ['pyelo', 'ureteral', ...sepsisExtras(enc, ctx)],
  teaching: [
    '発熱を伴う尿管結石（閉塞性腎盂腎炎）は急速に敗血症性ショックになる泌尿器科の緊急疾患。',
    '腎盂腎炎ではエコーで水腎症を必ず確認する。結石・水腎症があれば泌尿器科に緊急ドレナージ（尿管ステント・腎瘻）を依頼する。',
    '抗菌薬だけでは閉塞した尿は排出されず治らない（膿瘍のドレナージと同じ考え方）。',
    '血液・尿培養の後、速やかに抗菌薬。ショックには輸液・昇圧薬。',
  ],
  sources: ['尿路結石症診療ガイドライン2023年版（日本泌尿器科学会ほか）', 'JAID/JSC感染症治療ガイド2023'],
  ideal: () => [
    { a: 'test', ids: ['ua', 'ucx', 'bcx', 'cbc', 'chem', 'crp', 'abd_us'] },
    { a: 'fluid', fluidId: 'lr', mode: 'bolus', volume: 1000 },
    { a: 'rx', drugId: 'ctrx', route: 'iv', dose: 2000, freq: 'q24h', days: 10 },
    { a: 'consult', dept: 'uro', delayMin: 30 },
  ],
};
