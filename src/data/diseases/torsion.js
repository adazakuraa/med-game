// 卵巣茎捻転
// 出典: 産婦人科診療ガイドライン 婦人科外来編2023, 急性腹症診療ガイドライン2015
import { T } from './common.js';
export default {
  id: 'ovarian_torsion', name: '卵巣茎捻転', dept: '産婦人科',
  weight: 2, season: {}, minLevel: 2,
  demo: { age: [15, 45], ageMode: 'young', male: 0 },
  noPregnancy: true,
  sev: { p: [0.4, 0.45, 0.15], burden: [[25, 35], [38, 50], [52, 62]] },
  refractoryP: [0, 0, 0],
  comorb: { extra: {} },
  organisms: [],
  untreatedFatal: false,
  vars: (rng) => ({ side: rng.pick(['右', '左']), size: rng.int(5, 9), hours: rng.int(2, 10) }),
  cc: () => '下腹部痛',
  ccKey: 'lower_abd_f',
  arrival: () => 'walk',
  history: {
    onset: { p: 1, text: '{hours}時間ほど前、体をひねったときに急に{side}の下腹部が痛くなりました。' },
    course: { p: 1, text: '痛みが強くなったり少し弱くなったりしながら続いています。' },
    character: { p: 1, text: '{side}の下腹部が締め付けられるように激しく痛みます。' },
    location: { p: 1, text: '{side}の下腹部です。' },
    severity: { p: 1, bySev: ['7くらいです。', '8くらいです。', '10です。'] },
    nausea: { p: 0.75, text: '吐き気があり、何度か吐きました。' },
    abdpain: { p: 1, text: '{side}の下腹部が痛いです。' },
    pmh: { p: 0.5, text: '以前、健診で卵巣に腫れがあると言われたことがあります。' },
    vagbleed: { p: 0, text: '' },
  },
  exam: {
    gen_appear: { p: 1, text: '痛みで体を丸めている。冷汗あり。' },
    abd_palp: { p: 1, text: '{side}下腹部に強い圧痛。' },
    abd_rebound: { p: [0.1, 0.3, 0.7], text: '{side}下腹部に反跳痛。' },
    pelvic: { p: 0.9, text: '{side}付属器に圧痛を伴う腫瘤を触れる。' },
  },
  vitals: { HR: { to: [100, 115], k: 1 }, T: { to: [37.2, 37.9], k: 1 } },
  labs: { WBC: { to: [10000, 14000], k: 1 }, CRP: { to: [0.5, 4], k: 1.5 } },
  tests: {
    tvus: [{ p: 0.92, persist: true, text: '{side}卵巣は径{size}cmに腫大し、嚢腫を伴う。カラードプラで卵巣内の血流低下。ねじれた茎（whirlpool sign）。' }],
    abd_us: [{ p: 0.7, persist: true, text: '{side}付属器領域に径{size}cmの嚢胞性腫瘤。少量の腹水。' }],
    abd_ct_contrast: [{ p: 0.85, persist: true, text: '{side}付属器に腫大した卵巣（嚢腫）と、ねじれた茎を思わせる構造。虫垂は正常。' }],
  },
  natural: 0.5,
  dynamics: (enc) => (enc.state.burden >= 58 ? -0.5 : 0), // 卵巣が壊死すると痛みのピークは越える
  curedBy: 'detorsion',
  therapies: [T.pain([2, 1, 1]), T.proc('detorsion', '産婦人科コンサルト→緊急手術（捻転の解除）', [8, 6, 4])],
  procedures: [{
    id: 'detorsion', depts: ['obgyn'], label: '緊急手術', delay: 60, duration: 90, after: 'ward',
    decide: (enc) => {
      const hcg = enc.tests.some((t) => t.id === 'uhcg' && t.done);
      const img = enc.tests.some((t) => ['tvus', 'abd_us', 'abd_ct_contrast'].includes(t.id) && t.done && t.result.abnormal);
      if (!hcg) return { accept: false, text: 'まず妊娠反応を確認してください。' };
      if (!img) return { accept: false, text: '経腟超音波（または腹部エコー）で卵巣を確認してください。' };
      return { accept: true, reveal: true, text: '卵巣嚢腫の茎捻転を疑います。卵巣を温存するため緊急で腹腔鏡下手術を行います（約60分後）。' };
    },
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 18); },
    doneText: '産婦人科：{side}卵巣嚢腫が捻転していました。捻転を解除し、卵巣は温存できました。',
  }],
  residualAbove: 50,
  residualText: '診断・手術が遅れ、卵巣が壊死して摘出が必要になりました。',
  dispo: () => ({ ok: ['admit'], best: 'admit', why: '卵巣茎捻転：緊急手術・入院' }),
  useful: ['uhcg', 'tvus', 'abd_us', 'abd_ct_contrast', 'cbc', 'crp', 'chem', 'ua'],
  key: [['uhcg'], ['tvus', 'abd_us', 'abd_ct_contrast']],
  extrasOk: () => [],
  teaching: [
    '若い女性の突然の片側下腹部痛と嘔吐では卵巣茎捻転を考える。卵巣嚢腫があるとねじれやすい。',
    '経腟超音波で腫大した卵巣・血流低下・whirlpool signを確認する。',
    '時間がたつと卵巣が壊死する。疑ったら早く産婦人科へ（手術で捻転を解除）。',
  ],
  sources: ['産婦人科診療ガイドライン 婦人科外来編2023', '急性腹症診療ガイドライン2015'],
  ideal: () => [
    { a: 'test', ids: ['uhcg', 'cbc', 'tvus'] },
    { a: 'rx', drugId: 'apap_iv', route: 'iv', dose: 1000, freq: 'q6h', days: 1 },
    { a: 'wait', min: 25 },
    { a: 'consult', dept: 'obgyn', delayMin: 5 },
  ],
};
