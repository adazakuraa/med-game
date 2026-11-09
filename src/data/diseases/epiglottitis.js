// 急性喉頭蓋炎
// 出典: 日本耳鼻咽喉科頭頸部外科学会, JAID/JSC感染症治療ガイド2023
import { T } from './common.js';
export default {
  id: 'epiglottitis', name: '急性喉頭蓋炎', dept: '耳鼻咽喉科',
  weight: 1.5, season: { winter: 1.2 }, minLevel: 3,
  demo: { age: [25, 70], ageMode: 'uniform', male: 0.65 },
  sev: { p: [0.35, 0.45, 0.2], burden: [[30, 40], [42, 55], [60, 70]] },
  refractoryP: [0, 0, 0.05], comorb: { extra: { dm2: 0.15, htn: 0.25 } },
  organisms: ['hinf', 'gpc'], minAbxDays: 7,
  cc: () => '喉の激しい痛み', ccKey: 'sore_throat',
  arrival: () => 'walk',
  history: {
    onset: { p: 1, text: '今朝から急に喉が痛くなって、どんどんひどくなっています。' },
    character: { p: 1, text: '喉がものすごく痛くて、唾も飲み込めません。声がこもります。' },
    sorethroat: { p: 1, text: '喉の奥がものすごく痛いです。鼻水はありません。' },
    fever: { p: 0.8, text: '38度台の熱があります。' },
    dyspnea: { p: [0.2, 0.5, 0.9], text: '息を吸うときに少し苦しいです。' },
    anorexia: { p: 1, text: '痛くて何も飲み込めません。よだれが出てしまいます。' },
    cough: { p: 0, text: '' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['前かがみに座り、唾を飲み込めずにいる。含み声。', '前かがみで、よだれを垂らしている。吸気時に喘鳴。', '起座位でよだれを垂らし、吸気性喘鳴（stridor）と呼吸困難。'] },
    pharynx: { p: 1, text: '咽頭・扁桃の所見は軽度（強い咽頭痛に比べて所見が乏しい）。※舌圧子で強く押さないこと。' },
    neck_ln: { p: 0.8, text: '前頸部（舌骨のあたり）に強い圧痛。' },
  },
  vitals: { T: { to: [38.2, 39.4], k: 0.5 }, HR: { to: [105, 125], k: 1 }, RR: { to: [24, 30], k: 1.2 }, SpO2: { drop: [4, 10], k: 2.5 } },
  labs: { WBC: { to: [13000, 20000], k: 0.7 }, CRP: { to: [5, 18], k: 0.8 } },
  tests: {},
  natural: 0.8,
  curedBy: 'airway',
  therapies: [
    T.proc('airway', '耳鼻咽喉科コンサルト（喉頭ファイバー）→気道の確保・ICU', [3, 1.5, 1.2]),
    T.abx(['hinf', 'gpc'], '抗菌薬（セフトリアキソンなど）', [3, 2, 1], -0.6, 4),
    { id: 'steroid', label: 'ステロイド（浮腫の軽減）', req: { anyTag: ['steroid', 'steroid_sys'] }, required: false, deadlineH: [6, 6, 6], effect: -0.3, lagH: 2 },
  ],
  procedures: [{
    id: 'airway', depts: ['ent', 'icu'], label: '喉頭ファイバー・気道確保', delay: 20, duration: 40, after: 'icu',
    decide: () => ({ accept: true, reveal: true, text: '喉頭ファイバーで喉頭蓋が著明に腫れています。急性喉頭蓋炎です。気道閉塞に備えてICUで管理し、必要なら気管挿管・外科的気道確保を行います（約20分後）。' }),
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 30); },
    doneText: '耳鼻咽喉科・集中治療科：気道を確保し、ICUで管理しています。抗菌薬とステロイドを続けてください。',
  }],
  dispo: () => ({ ok: ['icu'], best: 'icu', why: '急性喉頭蓋炎：気道閉塞の危険があるためICU' }),
  useful: ['cbc', 'crp', 'chem', 'bcx'], key: [],
  extrasOk: () => [],
  teaching: [
    '強い咽頭痛・嚥下痛なのに咽頭所見が乏しい、含み声・流涎・前かがみの姿勢・吸気性喘鳴は急性喉頭蓋炎を疑う（"killer sore throat"）。',
    '急速に気道閉塞を起こしうる。仰臥位にしない・舌圧子で強く押さない・不用意に刺激しない。すぐに耳鼻咽喉科（喉頭ファイバー）と気道確保の準備。',
    '治療は気道管理と抗菌薬（セフトリアキソンなど）。ステロイドを併用することが多い。',
  ],
  sources: ['JAID/JSC感染症治療ガイド2023'],
  ideal: () => [{ a: 'consult', dept: 'ent', delayMin: 1 }, { a: 'rx', drugId: 'ctrx', route: 'iv', dose: 2000, freq: 'q24h', days: 7 }, { a: 'rx', drugId: 'dexa', route: 'iv', dose: 6.6, freq: 'q24h', days: 2 }, { a: 'o2', device: 'mask', flow: 6, when: 'spo2<92' }],
};
