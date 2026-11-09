// 化膿性脊椎炎・硬膜外膿瘍
// 出典: IDSA Clinical Practice Guidelines for Native Vertebral Osteomyelitis (2015)
import { T } from './common.js';
export default {
  id: 'epidural', name: '化膿性脊椎炎・硬膜外膿瘍', dept: '整形外科',
  weight: 1.5, season: {}, minLevel: 3,
  demo: { age: [55, 85], ageMode: 'old', male: 0.6 },
  sev: { p: [0.35, 0.45, 0.2], burden: [[28, 38], [40, 52], [55, 66]] },
  refractoryP: [0, 0.03, 0.08], comorb: { forced: ['dm2'], extra: { ckd: 0.2, htn: 0.4 } },
  organisms: ['gpc'], minAbxDays: 14,
  vars: (rng) => ({ level: rng.pick(['第2-3腰椎', '第11-12胸椎']) }),
  cc: () => '腰の痛みと発熱', ccKey: 'back_pain',
  arrival: () => 'walk',
  history: {
    onset: { p: 1, text: '2週間ほど前から腰が痛く、だんだん強くなっています。数日前から熱も出ました。' },
    character: { p: 1, text: '腰がズキズキ痛み、じっとしていても、夜寝ていても痛みます。' },
    aggravating: { p: 1, text: '寝ていても痛みは変わりません。' },
    fever: { p: 0.85, text: '38度前後の熱があります。' },
    chills: { p: 0.4, text: '寒気がありました。' },
    weakness: { p: [0, 0.3, 0.7], text: '両足に力が入りにくくなってきました。' },
    retention: { p: [0, 0.2, 0.5], text: 'おしっこが出にくい気がします。' },
    pmh: { p: 1, text: '糖尿病があります。1か月前に足の傷が化膿しました。' },
  },
  exam: { spine: { p: 1, text: '{level}の棘突起に強い叩打痛。' }, motor: { p: [0, 0.3, 0.7], text: '両下肢の筋力低下（徒手筋力 4/5）。' } },
  vitals: { T: { to: [38, 39], k: 0.5 }, HR: { to: [100, 115], k: 1 } },
  labs: { WBC: { to: [11000, 17000], k: 0.8 }, CRP: { to: [8, 20], k: 0.8 }, ESR: { to: [60, 100], k: 0.3 } },
  tests: {
    spine_mri: [{ p: 0.95, persist: true, text: '{level}の椎間板と隣接椎体に炎症を示す信号変化（化膿性脊椎炎）。硬膜外に膿瘍があり、硬膜嚢を圧排。' }],
    spine_xr: [{ p: 0.2, text: '{level}の椎間板腔の狭小化と終板の不整。' }],
    bcx: [{ p: 0.6, text: '2セット中2セットからStaphylococcus aureus（MSSA）。' }],
  },
  natural: 0.4,
  therapies: [T.abx(['gpc'], '血液培養のあとに抗菌薬（黄色ブドウ球菌をカバー）', [12, 8, 4], -0.6, 6), T.proc('drain', '神経症状があれば整形外科コンサルト→手術（減圧・排膿）', [99, 12, 6], (enc) => enc.patient.sev >= 1)],
  procedures: [{
    id: 'drain', depts: ['ortho', 'nsurg'], label: '手術（減圧・排膿）', delay: 180, duration: 150, after: 'ward',
    decide: (enc) => {
      const mri = enc.tests.some((t) => t.id === 'spine_mri' && t.done);
      if (!mri) return { accept: false, text: '発熱を伴う腰背部痛なら、脊椎MRIで硬膜外膿瘍を確認してください。' };
      return { accept: true, reveal: true, text: '化膿性脊椎炎と硬膜外膿瘍です。神経症状があるため、減圧・排膿術を行います。' };
    },
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 25); },
    doneText: '整形外科：硬膜外膿瘍の排膿と減圧を行いました。長期の抗菌薬治療が必要です。',
  }],
  residualAbove: 18, residualText: '下肢の麻痺・排尿障害が残りました。',
  dispo: () => ({ ok: ['admit'], best: 'admit', why: '化膿性脊椎炎・硬膜外膿瘍：入院で長期の抗菌薬（神経症状があれば手術）' }),
  useful: ['spine_mri', 'bcx', 'cbc', 'crp', 'esr', 'chem', 'spine_xr', 'ua', 'echo'], key: [['spine_mri'], ['bcx']],
  extrasOk: () => [],
  teaching: [
    '発熱を伴う腰背部痛・夜間や安静時の痛み・糖尿病などのリスクがあれば化膿性脊椎炎・硬膜外膿瘍を疑う（危険な腰痛）。',
    '診断はMRI。抗菌薬の前に血液培養（黄色ブドウ球菌が多い。感染性心内膜炎の合併も考える）。',
    '下肢の脱力・しびれ・排尿障害は脊髄・馬尾の圧迫で、緊急の減圧術が必要。',
  ],
  sources: ['IDSA Clinical Practice Guidelines for the Diagnosis and Treatment of Native Vertebral Osteomyelitis in Adults (2015)'],
  ideal: (p) => [{ a: 'test', ids: ['bcx', 'cbc', 'crp', 'chem', 'spine_mri'] }, { a: 'wait', min: 30 }, { a: 'rx', drugId: 'cez', route: 'iv', dose: 2000, freq: 'q8h', days: 14 }, { a: 'rx', drugId: 'vcm', route: 'iv', dose: Math.round(p.weight * 15 / 50) * 50, freq: 'q12h', days: 3 }, { a: 'consult', dept: 'ortho', delayMin: 40, when: 'sev>=1' }],
};
