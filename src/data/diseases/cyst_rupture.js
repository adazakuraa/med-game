// 卵巣出血（黄体出血）
// 出典: 日本産科婦人科学会『産婦人科診療ガイドライン 婦人科外来編2023』, 日本産科婦人科内視鏡学会『産婦人科内視鏡手術ガイドライン』
import { T } from './common.js';
export default {
  id: 'cyst_rupture', name: '卵巣出血（黄体出血）', dept: '産婦人科',
  weight: 3, season: {}, minLevel: 2,
  demo: { age: [18, 42], ageMode: 'young', male: 0 },
  noPregnancy: true,
  sev: { p: [0.6, 0.3, 0.1], burden: [[18, 26], [28, 40], [52, 64]] },
  refractoryP: [0, 0, 0],
  comorb: { extra: {} },
  organisms: [],
  untreatedFatal: false,
  vars: (rng, sev) => ({ side: rng.pick(['右', '右', '左']), hb0: [0.3, 1.2, 3.5][sev] + rng.range(0, 0.5), lmpDays: rng.int(19, 26), coitus: rng.chance(0.6) }),
  initHbLoss: (p) => p.vars.hb0,
  cc: () => '急な下腹部痛',
  ccKey: 'lower_abd_f',
  arrival: (sev) => (sev === 2 ? 'ambulance' : 'walk'),
  initVolume: [[100, 300], [400, 800], [1300, 2000]],
  history: {
    onset: { p: 1, text: '数時間前、急に{side}の下腹部が痛くなりました。' },
    character: { p: 1, text: '{side}の下腹部がズーンと痛みます。' },
    location: { p: 1, text: '{side}の下腹部です。' },
    lmp: { p: 1, text: '最後の生理は{lmpDays}日前に始まりました。周期は28日で順調です。' },
    trigger: { p: 1, ifVar: 'coitus', text: '昨晩、性交渉がありました。' },
    vagbleed: { p: 0.1, text: '出血はありません。' },
    dizziness: { p: [0.1, 0.4, 0.95], text: '立つとふらっとします。' },
    radiation: { p: [0, 0.1, 0.5], text: '肩のあたりも痛いです。' },
    nausea: { p: 0.3, text: '少し吐き気があります。' },
    fever: { p: 0, text: '' }, dysuria: { p: 0, text: '' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['痛みで顔をしかめているが、顔色は良い。', '痛みが強く、顔色がやや悪い。', '顔面蒼白で冷汗。'] },
    abd_palp: { p: 1, text: '{side}下腹部に圧痛。' },
    abd_rebound: { p: [0.1, 0.5, 0.9], text: '下腹部に反跳痛。' },
    pelvic: { p: 0.7, text: '{side}付属器に圧痛。子宮頸部の移動痛は軽度。帯下の異常なし。' },
    oral_mucosa: { p: [0, 0.2, 0.9], text: '眼瞼結膜は蒼白。' },
  },
  vitals: { HR: { to: [105, 125], k: 1.2 } },
  labs: {},
  tests: {
    tvus: [{ p: 0.95, persist: true, text: '子宮内に胎嚢なし。{side}卵巣に壁の厚い嚢胞（黄体）と周囲の血腫様エコー。ダグラス窩に液体貯留。' }],
    abd_us: [{ p: [0.3, 0.6, 0.95], text: 'ダグラス窩に液体貯留。' }],
    abd_ct_contrast: [{ p: 0.9, text: '{side}卵巣に黄体嚢胞と周囲の血腫、骨盤内に高吸収の液体貯留（出血）。虫垂は正常。' }],
  },
  natural: -0.2,
  therapies: [
    T.pain([3, 2, 1]),
    T.fluid(1000, '細胞外液でショックの是正', (c) => c.vit.SBP < 90 || c.vit.HR > 115, [1, 1, 0.5]),
    { id: 'rbc', label: '輸血（Hb 7g/dL未満・ショック）', req: { fn: (enc) => (enc.state.rbcIn || 0) >= 140 }, when: (c) => c.lab('HB') < 7, required: true, deadlineH: [2, 2, 1], startFromNeed: true },
    { ...T.proc('ope', '産婦人科コンサルト→腹腔鏡下止血術（出血が多い場合）', [24, 12, 2]), required: (enc) => enc.patient.sev === 2 },
  ],
  dynamics: (enc) => {
    const st = enc.state, sev = enc.patient.sev;
    const done = st.procDone?.ope != null;
    const rate = done ? 0 : [0.005, 0.03, 0.22][sev] * (enc.t > 360 && sev < 2 ? 0.2 : 1);
    st.hbLoss += rate / 6;
    st.volume += (rate * 150) / 6;
    const hb = 13 - st.hbLoss + ((st.rbcIn || 0) / 280) * 1.5 * (60 / enc.patient.weight);
    let d = done ? -1.5 : sev === 2 ? 0.5 : 0;
    if (hb < 7) d += 0.8;
    return d;
  },
  procedures: [{
    id: 'ope', depts: ['obgyn'], label: '腹腔鏡下止血術', delay: 60, duration: 90, after: 'ward',
    decide: (enc, vit) => {
      const hcg = enc.tests.some((t) => t.id === 'uhcg' && t.done);
      const img = enc.tests.some((t) => ['tvus', 'abd_us', 'abd_ct_contrast'].includes(t.id) && t.done && t.result.abnormal);
      if (!hcg) return { accept: false, text: 'まず尿妊娠反応をお願いします（異所性妊娠の除外）。' };
      if (!img) return { accept: false, text: '経腟超音波で付属器と腹腔内の出血を確認してください。' };
      if (enc.patient.sev < 2 && vit.SBP >= 90) return { accept: false, reveal: true, text: '妊娠反応陰性で、黄体出血（卵巣出血）と思われます。循環が安定していれば、入院して安静・鎮痛で経過をみましょう（多くは自然に止血します）。Hbの低下や血圧低下があれば手術を考えます。' };
      return { accept: true, reveal: true, text: '腹腔内出血の多い卵巣出血です。緊急で腹腔鏡下に止血します（約60分後）。輸液・必要なら輸血をお願いします。' };
    },
    onDone: () => {},
    doneText: '産婦人科：{side}卵巣の黄体からの出血を腹腔鏡下に止血しました。',
  }],
  dispo: (enc, ctx) => (ctx.initVit.SBP < 90 ? { ok: ['admit', 'icu'], best: 'admit', why: '出血性ショック：緊急手術・入院' } : enc.patient.sev === 0 ? { ok: ['home', 'admit'], best: 'admit', why: '卵巣出血：少量でも入院で安静・Hbの推移を観察するのが安全（ごく少量なら外来経過観察も）' } : { ok: ['admit'], best: 'admit', why: '卵巣出血：入院で安静・Hbの推移を観察' }),
  useful: ['uhcg', 'tvus', 'abd_us', 'cbc', 'coag', 'chem', 'crp', 'ua', 'lab_HB', 'abd_ct_contrast'],
  key: [['uhcg'], ['tvus', 'abd_us'], ['cbc', 'lab_HB']],
  extrasOk: () => [],
  teaching: [
    '月経周期の後半（黄体期）や性交後に突然起こる片側の下腹部痛は卵巣出血（黄体出血）を考える。右側に多い。',
    '必ず妊娠反応を確認する。陽性なら異所性妊娠、陰性で付属器周囲の血腫・ダグラス窩の液体があれば卵巣出血。',
    '多くは安静・鎮痛で自然に止血するが、腹腔内出血が多くショックなら輸液・輸血と腹腔鏡下止血術。',
    '虫垂炎・卵巣茎捻転・骨盤内炎症性疾患との区別に、超音波・CTが役立つ。',
  ],
  sources: ['産婦人科診療ガイドライン 婦人科外来編2023（日本産科婦人科学会）'],
  ideal: (p) => [
    { a: 'test', ids: ['uhcg', 'cbc', 'coag', 'tvus'] },
    { a: 'rx', drugId: 'apap_iv', route: 'iv', dose: 1000, freq: 'q6h', days: 2 },
    { a: 'fluid', fluidId: 'lr', mode: 'bolus', volume: 1000, when: 'sev>=1' },
    { a: 'wait', min: 25 },
    { a: 'fluid', fluidId: 'rbc', mode: 'bolus', volume: 560, when: 'hb<7' },
    { a: 'consult', dept: 'obgyn', delayMin: 5, when: 'sev2' },
  ],
};
