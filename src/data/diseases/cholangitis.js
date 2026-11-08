// 急性胆管炎（総胆管結石）
// 出典: 急性胆管炎・胆嚢炎診療ガイドライン2018（Tokyo Guidelines 2018）
import { T, sepsisExtras } from './common.js';
export default {
  id: 'cholangitis', name: '急性胆管炎（総胆管結石）', dept: '消化器内科',
  weight: 4, season: {}, minLevel: 2,
  demo: { age: [60, 92], ageMode: 'old', male: 0.5 },
  sev: { p: [0.35, 0.4, 0.25], burden: [[28, 38], [42, 55], [60, 72]] },
  refractoryP: [0, 0.03, 0.1],
  comorb: { extra: { htn: 0.5, dm2: 0.25, dementia: 0.15, ckd: 0.15 } },
  organisms: ['ecoli', 'anaerobe'], minAbxDays: 4,
  vars: (rng) => ({ cbd: rng.int(10, 15) }),
  cc: () => '発熱と腹痛', ccKey: 'abd_pain',
  arrival: (sev) => (sev === 0 ? 'walk' : 'ambulance'),
  initVolume: [[400, 900], [800, 1500], [1500, 2500]],
  history: {
    onset: { p: 1, text: '昨日の夜から右上のお腹が痛くなり、今朝からガタガタ震えて熱が出ました。' },
    character: { p: 1, text: '右上のお腹が重く痛みます。' },
    location: { p: 1, text: 'みぞおちから右上のお腹です。' },
    fever: { p: 0.95, text: '39度近い熱があります。' },
    chills: { p: 0.85, text: 'ガタガタ震えるほどの寒気がありました。' },
    abdpain: { p: 1, text: '右上のお腹が痛いです。' },
    hematuria: { p: 0.6, text: '尿が紅茶のように濃い色です。' },
    nausea: { p: 0.5, text: '吐き気があります。' },
    pmh: { p: 0.5, text: '胆石があると言われたことがあります。' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['熱っぽく痛そう。', 'ぐったりしている。', '意識がもうろうとしている。'] },
    skin: { p: 0.75, text: '眼球結膜と皮膚の黄染（黄疸）。' },
    conjunctiva: { p: 0.75, text: '眼球結膜の黄染。' },
    abd_palp: { p: 1, text: '右季肋部〜心窩部に圧痛。' },
    murphy: { p: 0.3, text: 'Murphy徴候は弱陽性。' },
  },
  vitals: { T: { to: [38.8, 40], k: 0.4 }, HR: { to: [110, 130], k: 0.8 }, SBP: { to: [68, 82], k: 2.2 }, RR: { to: [22, 28], k: 1 } },
  labs: { WBC: { to: [14000, 22000], k: 0.6 }, CRP: { to: [8, 25], k: 0.8 }, TBIL: { add: [2, 6], k: 0.6 }, AST: { add: [80, 300], k: 0.6 }, ALT: { add: [80, 300], k: 0.6 }, PLT: { mul: [0.4, 0.75], k: 2 }, CR: { add: [0.3, 1.2], k: 2 }, LAC: { to: [3, 6], k: 2.5 }, PCT: { to: [2, 20], k: 1.5 } },
  tests: {
    abd_us: [{ p: 0.8, persist: true, text: '総胆管の拡張（径{cbd}mm）と肝内胆管の拡張。胆嚢結石あり。総胆管下部の結石は描出不良。' }],
    abd_ct_contrast: [{ p: 0.9, persist: true, text: '総胆管の拡張（径{cbd}mm）と下部に結石。肝内胆管の拡張。' }],
    bcx: [{ p: [0.3, 0.45, 0.6], text: '2セット中2セットからEscherichia coli（CMZ S, CTRX S）。' }],
  },
  natural: 0.6,
  curedBy: 'ercp',
  therapies: [
    T.abx(['ecoli', 'anaerobe'], '抗菌薬（腸内細菌＋嫌気性菌）', [6, 3, 1], -0.5, 4),
    T.fluid(1000),
    T.proc('ercp', '消化器内科コンサルト→内視鏡的胆道ドレナージ（ERCP）', [48, 24, 12]),
  ],
  procedures: [{
    id: 'ercp', depts: ['gi', 'surgery'], label: '内視鏡的胆道ドレナージ', delay: 90, duration: 60, after: 'ward',
    decide: (enc) => {
      const img = enc.tests.some((t) => ['abd_us', 'abd_ct_contrast', 'abd_ct_plain'].includes(t.id) && t.done && t.result.abnormal);
      if (!img) return { accept: false, text: '胆管の拡張や結石を画像（エコー・CT）で確認してください。' };
      return { accept: true, reveal: true, text: '総胆管結石による急性胆管炎です。内視鏡的胆道ドレナージ（ERCP）を行います（約90分後）。抗菌薬と補液を続けてください。' };
    },
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 25); },
    doneText: '消化器内科：ERCPで総胆管結石を確認し、胆道ステントを留置しました。膿性の胆汁が流出しました。',
  }],
  dispo: (enc, ctx) => (ctx.initVit.SBP < 90 || enc.patient.sev === 2 ? { ok: ['icu'], best: 'icu', why: '重症胆管炎：ICU・緊急ドレナージ' } : { ok: ['admit', 'icu'], best: 'admit', why: '急性胆管炎：入院・抗菌薬・胆道ドレナージ' }),
  useful: ['cbc', 'chem', 'crp', 'coag', 'abd_us', 'abd_ct_contrast', 'abd_ct_plain', 'bcx', 'vbg', 'pct', 'ua'],
  key: [['abd_us', 'abd_ct_contrast'], ['chem'], ['bcx']],
  extrasOk: sepsisExtras,
  teaching: [
    '発熱（悪寒戦慄）・腹痛（右季肋部）・黄疸はCharcotの3徴で急性胆管炎。高齢者では症状がそろわないことも多い。',
    '胆道系酵素・ビリルビンの上昇と、画像での胆管拡張・結石で診断（Tokyo Guidelines 2018）。',
    '治療は抗菌薬と胆道ドレナージ（ERCP）。重症（臓器障害）では緊急ドレナージ。',
    '血液培養の陽性率が高い。ショック・意識障害を伴えば（Reynoldsの5徴）一刻を争う。',
  ],
  sources: ['急性胆管炎・胆嚢炎診療ガイドライン2018（Tokyo Guidelines 2018）'],
  ideal: () => [
    { a: 'test', ids: ['cbc', 'chem', 'crp', 'bcx', 'abd_us'] },
    { a: 'fluid', fluidId: 'lr', mode: 'bolus', volume: 1000 },
    { a: 'rx', drugId: 'cmz', route: 'iv', dose: 1000, freq: 'q8h', days: 5 },
    { a: 'rx', drugId: 'norad', route: 'iv', dose: 0.1, freq: 'cont', days: 2, when: 'sbp<90' },
    { a: 'consult', dept: 'gi', delayMin: 30 },
  ],
};
