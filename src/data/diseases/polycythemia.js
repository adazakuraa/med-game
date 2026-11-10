// 真性多血症
// 出典: 日本血液学会『造血器腫瘍診療ガイドライン2023年版』（骨髄増殖性腫瘍）
import { outpatient } from './common.js';
export default outpatient({
  id: 'polycythemia', name: '真性多血症', dept: '血液内科', weight: 1.5, minLevel: 2,
  demo: { age: [50, 80], ageMode: 'uniform', male: 0.6 },
  comorb: { extra: { htn: 0.5 } },
  vars: () => ({}),
  cc: () => '健診で赤血球が多いと言われた', ccKey: 'checkup',
  history: {
    onset: { p: 1, text: '健診で、赤血球とヘモグロビンが高いと言われました。' },
    character: { p: 1, text: 'お風呂上がりに体がかゆくなります。顔が赤いと言われます。' },
    pmh: { p: 1, text: '高血圧があります。' },
    smoking: { p: 1, text: 'たばこは吸いません。' },
    snore: { p: 0, text: '' },
    meds: { p: 1, text: '血圧の薬だけです。利尿薬・男性ホルモンは使っていません。' },
    alcohol: { p: 0, text: '' }, diet: { p: 0, text: '' }, family: { p: 0, text: '' }, weightgain: { p: 0, text: '' },
  },
  exam: { gen_appear: { p: 1, text: '顔面紅潮（赤ら顔）。' }, abd_palp: { p: 0.5, text: '脾臓を触れる。' } },
  labs: { HB: { add: [4, 6], k: 0 }, WBC: { to: [11000, 14000], k: 0 }, PLT: { mul: [1.6, 2.2], k: 0 }, URIC: { add: [1, 2], k: 0 } },
  tests: { smear: [{ p: 1, persist: true, text: '赤血球・白血球・血小板がいずれも増加。芽球はない。（JAK2 V617F変異 陽性）' }] },
  natural: -0.002,
  therapies: [{ id: 'tx', label: '血液内科と連携：瀉血（ヘマトクリット45%未満）と低用量アスピリン、心血管リスクの管理', req: { fn: (enc, eff) => (eff.tags.antiplatelet || 0) > 0 || enc.consults.some((c) => c.dept === 'hema') }, effect: -0.2, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  consult: { hema: '血液内科：3系統の増加・脾腫・JAK2変異から真性多血症です。血栓症予防のため、瀉血でヘマトクリット45%未満を目指し、低用量アスピリンを開始します。高リスクならヒドロキシウレアなどを使います。' },
  useful: ['cbc', 'smear', 'chem', 'vbg', 'abd_us', 'psg'], key: [['cbc'], ['smear']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '真性多血症：血液内科外来で瀉血と抗血小板療法' }),
  teaching: [
    'ヘモグロビン・ヘマトクリット高値では、まず脱水（相対的）と二次性（喫煙・睡眠時無呼吸・慢性肺疾患・高地・腎腫瘍・男性ホルモン）を考える。',
    '赤血球に加えて白血球・血小板も増え、脾腫・入浴後のかゆみ・顔面紅潮があれば真性多血症（JAK2変異）。',
    '最大の合併症は血栓症（脳梗塞・心筋梗塞・門脈血栓）。瀉血と低用量アスピリンで予防する。',
  ],
  sources: ['造血器腫瘍診療ガイドライン2023年版（日本血液学会）'],
  ideal: () => [{ a: 'test', ids: ['cbc', 'smear', 'chem'] }, { a: 'rx', drugId: 'aspirin', route: 'po', dose: 100, freq: 'q24h', days: 28 }, { a: 'consult', dept: 'hema', delayMin: 1 }, { a: 'wait', min: 70 }],
});
