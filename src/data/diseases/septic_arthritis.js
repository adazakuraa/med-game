// 化膿性関節炎
// 出典: JAID/JSC感染症治療ガイド2023, BSR/BOA guideline for management of the hot swollen joint
import { T, sepsisExtras } from './common.js';
export default {
  id: 'septic_arthritis', name: '化膿性関節炎', dept: '整形外科',
  weight: 1.5, season: {}, minLevel: 2,
  demo: { age: [50, 88], ageMode: 'old', male: 0.55 },
  sev: { p: [0.35, 0.45, 0.2], burden: [[30, 40], [42, 54], [58, 68]] },
  refractoryP: [0, 0.02, 0.06], comorb: { extra: { dm2: 0.4, ckd: 0.2 } },
  organisms: ['gpc'], minAbxDays: 14,
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '膝の腫れと痛み・発熱', ccKey: 'joint_pain',
  arrival: () => 'walk',
  history: {
    onset: { p: 1, text: '2日前から{side}の膝が腫れて痛く、昨日から高い熱が出ています。' },
    character: { p: 1, text: '膝が腫れて熱を持ち、少しでも動かすと激痛です。' },
    joint: { p: 1, text: '{side}の膝が腫れて全く曲げられません。' },
    fever: { p: 0.9, text: '38度台後半の熱があります。' },
    chills: { p: 0.5, text: '寒気がしました。' },
    pmh: { p: 0.5, text: '糖尿病があります。最近、膝に注射を受けました。' },
  },
  exam: { joint: { p: 1, text: '{side}膝関節の著明な腫脹・熱感・発赤。わずかな他動運動でも激痛。' } },
  vitals: { T: { to: [38.5, 39.5], k: 0.5 }, HR: { to: [105, 120], k: 1 }, SBP: { to: [75, 88], k: 2.5 } },
  labs: { WBC: { to: [14000, 22000], k: 0.6 }, CRP: { to: [10, 25], k: 0.6 } },
  tests: { joint_tap: [{ p: 1, persist: true, text: '関節液は黄白色混濁（膿性）。白血球 85000/μL（好中球95%）。グラム染色でグラム陽性球菌（ブドウ状）。結晶なし。' }], bcx: [{ p: 0.4, text: '2セット中2セットからStaphylococcus aureus（MSSA）。' }] },
  natural: 0.5,
  curedBy: 'washout',
  therapies: [T.abx(['gpc'], '抗菌薬（MRSAリスクがあればバンコマイシン）', [6, 4, 2], -0.5, 6), T.proc('washout', '整形外科コンサルト→関節洗浄・ドレナージ', [24, 12, 8])],
  procedures: [{
    id: 'washout', depts: ['ortho'], label: '関節洗浄', delay: 120, duration: 90, after: 'ward',
    decide: (enc) => {
      const tap = enc.tests.some((t) => t.id === 'joint_tap' && t.done);
      if (!tap) return { accept: false, text: 'まず関節穿刺で関節液を調べてください（細胞数・グラム染色・培養・結晶）。' };
      return { accept: true, reveal: true, text: '化膿性関節炎です。関節洗浄とドレナージを行います（約2時間後）。抗菌薬を開始してください。' };
    },
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 25); },
    doneText: '整形外科：関節鏡下に関節内を洗浄し、ドレーンを留置しました。',
  }],
  residualAbove: 18, residualText: '関節の破壊が進み、可動域制限が残りました。',
  dispo: () => ({ ok: ['admit', 'icu'], best: 'admit', why: '化膿性関節炎：入院で関節洗浄と点滴抗菌薬' }),
  useful: ['joint_tap', 'bcx', 'cbc', 'crp', 'chem', 'esr'], key: [['joint_tap'], ['bcx']],
  extrasOk: sepsisExtras,
  teaching: [
    '発熱を伴う急性単関節炎は化膿性関節炎を考え、すぐに関節穿刺（関節液の白血球数・グラム染色・培養・結晶）。',
    '黄色ブドウ球菌が多い。血液培養のあとに抗菌薬を開始し、整形外科で関節洗浄・ドレナージ。',
    '治療の遅れは関節破壊につながる。痛風・偽痛風と合併することもある。',
  ],
  sources: ['JAID/JSC感染症治療ガイド2023', 'BSR/BOA guideline for management of the hot swollen joint in adults'],
  ideal: (p) => [{ a: 'test', ids: ['joint_tap', 'bcx', 'cbc', 'crp', 'chem'] }, { a: 'wait', min: 30 }, { a: 'rx', drugId: 'cez', route: 'iv', dose: 2000, freq: 'q8h', days: 14 }, { a: 'rx', drugId: 'vcm', route: 'iv', dose: Math.round(p.weight * 15 / 50) * 50, freq: 'q12h', days: 3 }, { a: 'consult', dept: 'ortho', delayMin: 5 }],
};
