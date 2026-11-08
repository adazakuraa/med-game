// 異所性妊娠（卵管妊娠破裂）
// 出典: 日本産科婦人科学会『産婦人科診療ガイドライン 婦人科外来編2023』
import { T } from './common.js';
export default {
  id: 'ectopic', name: '異所性妊娠（卵管妊娠）', dept: '産婦人科',
  weight: 3, season: {}, minLevel: 2,
  demo: { age: [20, 40], ageMode: 'uniform', male: 0 },
  forcePregnant: true,
  sev: { p: [0.35, 0.4, 0.25], burden: [[22, 32], [38, 52], [58, 70]] },
  refractoryP: [0, 0, 0.03],
  comorb: { extra: {} },
  organisms: [],
  vars: (rng, sev) => ({ side: rng.pick(['右', '左']), hb0: [0.5, 2, 4][sev] + rng.range(0, 0.6) }),
  initHbLoss: (p) => p.vars.hb0,
  cc: () => '下腹部痛',
  ccKey: 'lower_abd_f',
  arrival: (sev) => (sev === 2 ? 'ambulance' : 'walk'),
  initVolume: [[200, 500], [600, 1200], [1500, 2500]],
  history: {
    onset: { p: 1, bySev: ['昨日から{side}の下腹部が痛みます。', '今朝、急に{side}の下腹部が強く痛くなりました。', '急に下腹部全体が激しく痛くなって、立っていられなくなりました。'] },
    character: { p: 1, text: '{side}の下腹部がズキズキ痛みます。' },
    location: { p: 1, text: '{side}の下腹部です。' },
    vagbleed: { p: 0.75, text: '数日前から少量の出血があります。生理かと思っていました。' },
    radiation: { p: [0, 0.2, 0.6], text: '右の肩のあたりも痛いです。' },
    dizziness: { p: [0.2, 0.5, 0.95], text: '立ち上がるとふらっとして、目の前が暗くなります。' },
    nausea: { p: 0.4, text: '少し吐き気があります。' },
    abdpain: { p: 1, text: '下腹部が痛いです。' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['痛みで顔をしかめている。', '顔色がやや悪い。', '顔面蒼白で冷汗。'] },
    abd_palp: { p: 1, text: '{side}下腹部に圧痛。' },
    abd_rebound: { p: [0.2, 0.6, 0.95], text: '下腹部に反跳痛（腹腔内出血による腹膜刺激）。' },
    pelvic: { p: 0.85, text: '子宮頸部の移動痛あり。{side}付属器に圧痛。' },
    oral_mucosa: { p: [0, 0.5, 0.9], text: '眼瞼結膜は蒼白。' },
  },
  vitals: { HR: { to: [110, 130], k: 1 } },
  labs: {},
  tests: {
    tvus: [{ p: 0.95, persist: true, text: '子宮内に胎嚢を認めない。{side}付属器に腫瘤像。ダグラス窩に液体貯留（出血を疑う）。' }],
    abd_us: [{ p: [0.2, 0.6, 0.95], text: 'ダグラス窩〜モリソン窩に液体貯留（腹腔内出血）。子宮内に胎嚢は確認できない。' }],
    abd_ct_contrast: [{ p: 0.9, text: '腹腔内に高吸収の液体貯留（血腫）。{side}付属器領域に腫瘤。' }],
  },
  natural: 0,
  therapies: [
    T.fluid(1000, '細胞外液でショックの是正', (c) => c.vit.SBP < 90 || c.vit.HR > 110, [1, 1, 0.5]),
    { id: 'rbc', label: '輸血（Hb 7g/dL未満・ショック）', req: { fn: (enc) => (enc.state.rbcIn || 0) >= 140 }, when: (c) => c.lab('HB') < 7, required: true, deadlineH: [2, 2, 1], startFromNeed: true },
    T.proc('ope', '産婦人科コンサルト→手術（腹腔鏡下卵管切除術など）', [24, 6, 2]),
  ],
  dynamics: (enc, eff) => {
    const st = enc.state, sev = enc.patient.sev;
    const done = st.procDone?.ope != null;
    const rate = done ? 0 : [0.02, 0.1, 0.25][sev];
    st.hbLoss += rate / 6;
    st.volume += (rate * 150) / 6;
    const hb = 13 - st.hbLoss + ((st.rbcIn || 0) / 280) * 1.5 * (60 / enc.patient.weight);
    let d = done ? -1.5 : sev === 0 ? 0.15 : 0.3;
    if (hb < 7) d += 0.8;
    return d;
  },
  procedures: [{
    id: 'ope', depts: ['obgyn'], label: '手術', delay: 60, duration: 90, after: 'ward',
    decide: (enc) => {
      const hcg = enc.tests.some((t) => t.id === 'uhcg' && t.done);
      const img = enc.tests.some((t) => ['tvus', 'abd_us', 'abd_ct_contrast'].includes(t.id) && t.done && t.result.abnormal);
      if (!hcg) return { accept: false, text: '妊娠反応は確認しましたか？ まず尿妊娠反応をお願いします。' };
      if (!img) return { accept: false, reveal: true, text: '妊娠反応が陽性なら、経腟超音波で子宮内の胎嚢と腹腔内出血を確認してください。' };
      return { accept: true, reveal: true, text: '子宮内に胎嚢がなく腹腔内出血を伴う異所性妊娠です。緊急で腹腔鏡下手術を行います（約60分後）。輸液・必要なら輸血をお願いします。' };
    },
    onDone: () => {},
    doneText: '産婦人科：{side}卵管妊娠の破裂で、腹腔鏡下卵管切除術を行い止血しました。',
  }],
  harmTags: { nsaid: '妊娠中（異所性妊娠を含む）のNSAIDsは避ける' },
  dispo: (enc, ctx) => (ctx.initVit.SBP < 90 ? { ok: ['icu', 'admit'], best: 'admit', why: '出血性ショック：緊急手術' } : { ok: ['admit'], best: 'admit', why: '異所性妊娠：入院・手術（または薬物療法）' }),
  useful: ['uhcg', 'tvus', 'abd_us', 'cbc', 'coag', 'chem', 'lab_HB', 'abd_ct_contrast', 'vbg'],
  key: [['uhcg'], ['tvus', 'abd_us'], ['cbc', 'lab_HB']],
  extrasOk: () => [],
  teaching: [
    '妊娠可能年齢の女性の腹痛では、必ず妊娠反応を確認する（本人が否定しても）。',
    '妊娠反応陽性で子宮内に胎嚢がなく、付属器腫瘤や腹腔内出血があれば異所性妊娠を強く疑う。',
    '破裂すると腹腔内出血で急速にショックになる。肩の痛み（横隔膜刺激）や立ちくらみは出血のサイン。',
    '治療は産婦人科での手術（腹腔鏡下卵管切除術など）。ショックなら輸液・輸血で蘇生しながら緊急手術。',
  ],
  sources: ['産婦人科診療ガイドライン 婦人科外来編2023（日本産科婦人科学会）'],
  ideal: (p) => [
    { a: 'test', ids: ['uhcg', 'cbc', 'coag', 'tvus'] },
    { a: 'fluid', fluidId: 'lr', mode: 'bolus', volume: 1000, when: 'sev>=1' },
    { a: 'wait', min: 25 },
    { a: 'fluid', fluidId: 'rbc', mode: 'bolus', volume: 560, when: 'hb<7' },
    { a: 'consult', dept: 'obgyn', delayMin: 5 },
  ],
};
