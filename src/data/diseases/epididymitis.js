// 急性精巣上体炎
// 出典: 日本泌尿器科学会 資料, JAID/JSC感染症治療ガイド2023（男性性器感染症）
import { outpatient } from './common.js';
export default outpatient({
  id: 'epididymitis', name: '急性精巣上体炎', dept: '泌尿器科', weight: 3,
  demo: { age: [55, 85], ageMode: 'old', male: 1 },
  sev: { p: [0.5, 0.4, 0.1], burden: [[24, 32], [32, 42], [42, 50]] },
  organisms: ['ecoli'], minAbxDays: 7, untreatedFatal: false,
  comorb: { extra: { bph: 0.6, dm2: 0.3 } },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '陰嚢が腫れて痛い・熱がある', ccKey: 'scrotal',
  history: {
    onset: { p: 1, text: '2日前から{side}の陰嚢がだんだん腫れて痛くなり、昨日から熱が出ました。' },
    character: { p: 1, text: '少しずつ痛くなりました。歩くと響きます。' },
    location: { p: 1, text: '{side}の陰嚢の後ろ側です。' },
    fever: { p: 1, text: '38度台の熱があります。' },
    dysuria: { p: 0.7, text: 'おしっこのときに少し痛いです。' },
    nausea: { p: 0, text: '吐き気はありません。' },
    trigger: { p: 0.6, text: '前立腺肥大で、最近尿の出が悪かったです。' },
  },
  exam: { scrotum: { p: 1, text: '{side}精巣上体の腫大・圧痛。精巣の位置は正常で、挙睾筋反射は保たれている。陰嚢を持ち上げると痛みが軽くなる（Prehn徴候陽性）。' }, inguinal: { p: 1, text: '鼠径部に膨隆はない。' } },
  vitals: { T: { to: [38, 38.8], k: 0.5 } },
  labs: { WBC: { to: [11000, 16000], k: 0.7 }, CRP: { to: [4, 12], k: 0.7 }, U_LEU: { to: [2, 3], k: 0 }, U_WBC: { to: [20, 60], k: 0 } },
  tests: { scrotal_us: [{ p: 1, persist: true, text: '{side}精巣上体の腫大と血流の増加。精巣の血流は保たれている（精巣捻転ではない）。' }], ucx: [{ p: 0.8, text: 'Escherichia coli 10^5 CFU/mL以上。' }] },
  natural: 0.05,
  dynamics: (enc) => (enc.state.burden > 45 ? -0.1 : 0),
  fluidLoss: () => 0,
  therapies: [{ id: 'abx', label: '抗菌薬（高齢者は腸内細菌：キノロンなど、若年は淋菌・クラミジアも）と陰嚢の挙上・安静', req: { coverage: ['ecoli'] }, effect: -0.6, lagH: 6, required: true, deadlineH: [24, 12, 8] }],
  useful: ['ua', 'ucx', 'scrotal_us', 'cbc', 'crp', 'sti_pcr', 'pvr'], key: [['ua'], ['scrotal_us']],
  dispo: (enc) => (enc.patient.sev === 2 ? { ok: ['admit', 'home'], best: 'admit', why: '高熱・全身状態不良の精巣上体炎：入院で抗菌薬静注' } : { ok: ['home', 'admit'], best: 'home', why: '急性精巣上体炎：外来で抗菌薬と安静' }),
  teaching: [
    '徐々に始まる陰嚢の痛み・腫れと発熱・排尿症状は精巣上体炎。精巣を持ち上げると痛みが軽くなる。',
    'ドプラエコーで精巣の血流が保たれていることを確認し、精巣捻転（突然の激痛・血流消失）を必ず除外する。',
    '高齢者は前立腺肥大・尿道カテーテルに伴う腸内細菌、若年者は淋菌・クラミジアが多い。',
  ],
  sources: ['JAID/JSC感染症治療ガイド2023（男性性器感染症）'],
  ideal: () => [{ a: 'test', ids: ['ua', 'ucx', 'scrotal_us', 'cbc', 'crp'] }, { a: 'rx', drugId: 'lvfx', route: 'po', dose: 500, freq: 'q24h', days: 10 }],
});
