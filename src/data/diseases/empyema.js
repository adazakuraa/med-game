// 膿胸（肺炎随伴性）
// 出典: 日本呼吸器学会『成人肺炎診療ガイドライン2024』, BTS guideline for pleural disease (2023)
import { T, sepsisExtras } from './common.js';
export default {
  id: 'empyema', name: '膿胸', dept: '呼吸器内科',
  weight: 1.5, season: { winter: 1.2 }, minLevel: 3,
  demo: { age: [50, 85], ageMode: 'old', male: 0.7 },
  sev: { p: [0.35, 0.45, 0.2], burden: [[34, 44], [46, 56], [58, 68]] },
  refractoryP: [0, 0.03, 0.1],
  comorb: { extra: { dm2: 0.35, copd: 0.15 } },
  organisms: ['spn', 'anaerobe'], minAbxDays: 21,
  vars: (rng) => ({ side: rng.pick(['右', '左']), d: rng.int(7, 14) }),
  cc: () => '熱と咳が続き、胸が痛い', ccKey: 'fever_cough',
  arrival: (sev) => (sev === 2 ? 'ambulance' : 'walk'),
  history: {
    onset: { p: 1, text: '{d}日前から熱と咳があり、医院でかぜ薬と抗菌薬をもらいましたが、熱が下がりません。' },
    fever: { p: 1, text: '38度台の熱が続いています。' },
    cough: { p: 1, text: '咳が出ます。' },
    sputum: { p: 0.7, text: '黄色い痰が出ます。' },
    chestpain: { p: 0.8, text: '息を吸うと{side}の胸が痛みます。' },
    dyspnea: { p: [0.3, 0.6, 0.9], text: '息苦しいです。' },
    chills: { p: 0.6, text: '寒気があります。' },
    pmh: { p: 0.6, text: '糖尿病があります。歯の治療はしばらくしていません。' },
    smoking: { p: 1, text: '1日20本吸います。' },
    weightloss: { p: 0.3, text: '少しやせました。' }, sorethroat: { p: 0, text: '' }, myalgia: { p: 0, text: '' }, sickcontact: { p: 0, text: '' },
  },
  exam: { lung_ausc: { p: 1, text: '{side}下肺野の呼吸音が減弱。' }, chest_perc: { p: 1, text: '{side}下肺野で濁音。' }, gen_appear: { p: 1, text: 'つらそうで、熱っぽい。' } },
  vitals: { T: { to: [38.3, 39.3], k: 0.5 }, HR: { to: [105, 125], k: 1 }, SpO2: { drop: [2, 8], k: 2 }, SBP: { to: [80, 95], k: 2.5 } },
  labs: { WBC: { to: [15000, 25000], k: 0.6 }, CRP: { to: [15, 30], k: 0.6 }, ALB: { add: [-1.2, -0.5], k: 1 } },
  tests: {
    cxr: [{ p: 1, persist: true, text: '{side}肋骨横隔膜角の鈍化と中等量の胸水。{side}下肺野に浸潤影。' }],
    chest_ct: [{ p: 1, persist: true, text: '{side}に被包化された胸水（胸膜が肥厚し、split pleura sign）と隣接する肺炎。' }],
    thoracentesis: [{ p: 1, persist: true, text: '膿性・悪臭のある胸水。pH 6.9、糖 15mg/dL、LDH 3500 IU/L。グラム染色でグラム陽性球菌と嫌気性菌様の菌（膿胸）。' }],
    bcx: [{ p: 0.3, text: '2セット中1セットからStreptococcus anginosus。' }],
  },
  natural: 0.45,
  curedBy: 'chest_drain',
  therapies: [
    T.abx(['spn', 'anaerobe'], '抗菌薬（嫌気性菌もカバー：アンピシリン・スルバクタムなど）', [8, 6, 3], -0.3, 6),
    T.proc('chest_drain', '呼吸器内科（外科）コンサルト→胸腔ドレナージ（改善しなければ胸腔鏡手術）', [24, 12, 8]),
  ],
  procedures: [{
    id: 'chest_drain', depts: ['resp', 'surgery'], label: '胸腔ドレナージ', delay: 60, duration: 30, after: 'ward',
    decide: (enc) => {
      const tap = enc.tests.some((t) => t.id === 'thoracentesis' && t.done);
      if (!tap) return { accept: false, reveal: true, text: '肺炎に胸水を伴っていますね。抗菌薬で治らない胸水は膿胸の可能性があります。まず胸水穿刺で性状（膿性か・pH・糖・グラム染色）を確認してください。' };
      return { accept: true, reveal: true, text: '膿胸です。胸腔ドレーンを留置して排膿します（約60分後）。被包化が強ければ線溶療法や胸腔鏡手術も考えます。抗菌薬は嫌気性菌もカバーしてください。' };
    },
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 35); },
    doneText: '呼吸器内科：{side}胸腔ドレーンを留置し、膿性胸水を約800mL排液しました。',
  }],
  dispo: (enc, ctx) => (ctx.initVit.SBP < 90 ? { ok: ['icu'], best: 'icu', why: '敗血症性ショック：ICU' } : { ok: ['admit', 'icu'], best: 'admit', why: '膿胸：入院でドレナージと長期の抗菌薬' }),
  useful: ['cxr', 'chest_ct', 'thoracentesis', 'bcx', 'cbc', 'chem', 'crp', 'sputum_gram', 'sputum_cx', 'vbg'],
  key: [['cxr', 'chest_ct'], ['thoracentesis'], ['bcx']],
  extrasOk: (enc, ctx) => ['cap', ...sepsisExtras(enc, ctx)],
  teaching: [
    '肺炎の治療中に熱が下がらない・胸水が増えるときは膿胸（肺炎随伴性胸水の感染）を考え、胸水穿刺をする。',
    '膿性・pH 7.2未満・糖低値・グラム染色陽性はドレナージが必要。',
    '嫌気性菌・口腔内レンサ球菌（S. anginosus群）が多い。誤嚥・歯周病・糖尿病がリスク。',
    '治療は胸腔ドレナージと長期（3〜6週）の抗菌薬。被包化して排液できなければ胸腔鏡手術。',
  ],
  sources: ['成人肺炎診療ガイドライン2024（日本呼吸器学会）', 'BTS guideline for pleural disease (2023)'],
  ideal: (p) => [
    { a: 'test', ids: ['cxr', 'cbc', 'chem', 'crp', 'bcx', 'thoracentesis'] },
    { a: 'rx', drugId: 'abpc_sbt', route: 'iv', dose: 3000, freq: 'q6h', days: 21 },
    { a: 'fluid', fluidId: 'lr', mode: 'bolus', volume: 1000, when: 'sev>=1' },
    { a: 'wait', min: 50 },
    { a: 'consult', dept: 'resp', delayMin: 1 },
  ],
};
