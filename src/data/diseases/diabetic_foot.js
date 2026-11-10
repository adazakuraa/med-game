// 糖尿病足感染症（足潰瘍と蜂窩織炎・骨髄炎）
// 出典: 日本皮膚科学会『創傷・褥瘡・熱傷ガイドライン2023 糖尿病性潰瘍・壊疽』, IWGDF/IDSA Guidelines (2023)
import { T, sepsisExtras } from './common.js';
export default {
  id: 'diabetic_foot', name: '糖尿病足感染症', dept: '皮膚科',
  weight: 2, season: {}, minLevel: 3,
  demo: { age: [50, 85], ageMode: 'old', male: 0.7 },
  sev: { p: [0.35, 0.45, 0.2], burden: [[28, 38], [40, 52], [56, 66]] },
  refractoryP: [0, 0.03, 0.08],
  comorb: { extra: { dm2: 1, ckd: 0.4, htn: 0.6 } },
  organisms: ['gpc', 'ecoli', 'anaerobe'], minAbxDays: 10,
  vars: (rng) => ({ side: rng.pick(['右', '左']), wk: rng.int(2, 6) }),
  cc: () => '足の傷が治らず、赤く腫れてきた', ccKey: 'leg_red',
  arrival: (sev) => (sev === 2 ? 'ambulance' : 'walk'),
  history: {
    onset: { p: 1, text: '{wk}週間前に{side}足の親指の付け根に靴ずれができて、治らないうちに赤く腫れてきました。' },
    course: { p: 1, text: 'ここ数日で赤みが足の甲まで広がり、膿が出ます。' },
    character: { p: 1, text: '足先の感覚が鈍いので、あまり痛くありません。' },
    fever: { p: [0.2, 0.6, 0.9], text: '熱があります。' },
    pmh: { p: 1, text: '糖尿病で20年治療していますが、最近は血糖が高いと言われています。' },
    trigger: { p: 1, text: '新しい靴を履いてから傷ができました。' },
    chills: { p: [0, 0.3, 0.7], text: '寒気がします。' },
    immobility: { p: 0, text: '' }, meds: { p: 1, text: 'インスリンを使っています。' },
  },
  exam: {
    skin: { p: 1, text: '{side}母趾MTP関節の足底に約2cmの潰瘍（骨に届く深さ：probe-to-bone陽性）、周囲の発赤・腫脹・熱感が足背まで広がり、膿性の排液。' },
    leg_pulse: { p: 0.6, text: '{side}足背動脈の拍動が弱い。' },
    calf: { p: 0.3, text: '下腿の腫脹はない。' },
    gen_appear: { p: 1, bySev: ['元気そう。', 'だるそう。', 'ぐったりしている。'] },
  },
  vitals: { T: { to: [37.8, 39], k: 0.7 }, HR: { to: [95, 120], k: 1 }, SBP: { to: [80, 95], k: 2.5 } },
  labs: { WBC: { to: [12000, 22000], k: 0.7 }, CRP: { to: [5, 20], k: 0.7 }, GLU: { add: [120, 250], k: 0.5 }, HBA1C: { add: [2, 4], k: 0 } },
  tests: { joint_xr: [{ p: 0.7, persist: true, text: '{side}第1中足骨頭の骨皮質の破壊と骨膜反応（骨髄炎）。軟部組織内にガス像はない。' }] },
  natural: 0.4,
  curedBy: 'debride',
  therapies: [
    T.abx(['gpc', 'ecoli', 'anaerobe'], '抗菌薬（ブドウ球菌・腸内細菌・嫌気性菌をカバー）', [12, 6, 3], -0.4, 6),
    T.proc('debride', '外科（皮膚科・整形外科）コンサルト→デブリードマン・感染骨の切除', [48, 24, 12]),
  ],
  procedures: [{
    id: 'debride', depts: ['ortho', 'surgery'], label: 'デブリードマン', delay: 120, duration: 60, after: 'ward',
    decide: (enc) => {
      const xr = enc.tests.some((t) => t.id === 'joint_xr' && t.done);
      if (!xr) return { accept: false, reveal: true, text: '糖尿病足の感染ですね。骨髄炎の評価に足のX線をお願いします。血流も確認しましょう。' };
      return { accept: true, reveal: true, text: '骨髄炎を伴う糖尿病足感染症です。壊死組織と感染した骨を切除し（デブリードマン）、膿の培養を出します（約2時間後）。血流が悪ければ血行再建も相談します。' };
    },
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 30); },
    doneText: '整形外科：壊死組織と感染した第1中足骨頭を切除し、開放創としました。',
  }],
  residualAbove: 25, residualText: '足趾の切断が必要になりました。',
  dispo: (enc, ctx) => (ctx.initVit.SBP < 90 ? { ok: ['icu'], best: 'icu', why: '敗血症性ショック：ICU' } : { ok: ['admit', 'icu'], best: 'admit', why: '骨髄炎を伴う糖尿病足感染症：入院で抗菌薬・デブリードマン・血糖管理' }),
  useful: ['joint_xr', 'cbc', 'chem', 'crp', 'bcx', 'hba1c', 'bs_poct', 'vbg', 'leg_cta', 'coag'],
  key: [['joint_xr'], ['cbc', 'crp'], ['bs_poct', 'chem']],
  extrasOk: (enc, ctx) => ['cellulitis', 'hhs', ...sepsisExtras(enc, ctx)],
  teaching: [
    '糖尿病では神経障害で痛みを感じにくく、血流障害もあるため、小さな傷から重い感染・骨髄炎・壊疽になる。',
    '潰瘍の底に骨が触れる（probe-to-bone陽性）・X線で骨破壊があれば骨髄炎。ガス像は壊死性軟部組織感染症を疑う。',
    '治療：抗菌薬（ブドウ球菌・腸内細菌・嫌気性菌）、外科的デブリードマン、血流評価と血行再建、血糖管理、免荷（足に体重をかけない）。',
    '予防が最も大切：毎日の足の観察、適切な靴、爪・胼胝の処置。',
  ],
  sources: ['IWGDF/IDSA Guidelines on the Diagnosis and Treatment of Diabetes-related Foot Infections (2023)', '創傷・褥瘡・熱傷ガイドライン2023（日本皮膚科学会）'],
  ideal: (p) => [
    { a: 'test', ids: ['joint_xr', 'cbc', 'chem', 'crp', 'bcx', 'bs_poct'] },
    { a: 'rx', drugId: 'abpc_sbt', route: 'iv', dose: 3000, freq: 'q6h', days: 14 },
    { a: 'fluid', fluidId: 'lr', mode: 'bolus', volume: 1000, when: 'sev>=1' },
    { a: 'wait', min: 30 },
    { a: 'consult', dept: 'ortho', delayMin: 1 },
  ],
};
