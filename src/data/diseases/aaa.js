// 腹部大動脈瘤破裂
// 出典: 日本循環器学会ほか『2020年改訂版 大動脈瘤・大動脈解離診療ガイドライン』
export default {
  id: 'aaa', name: '腹部大動脈瘤破裂', dept: '心臓血管外科',
  weight: 2, season: { winter: 1.2 }, minLevel: 3,
  demo: { age: [65, 90], ageMode: 'old', male: 0.85 },
  sev: { p: [0.3, 0.45, 0.25], burden: [[40, 50], [52, 62], [64, 74]] },
  refractoryP: [0, 0.05, 0.15],
  comorb: { extra: { htn: 0.8, dyslip: 0.4, copd: 0.2 } },
  smokeP: 0.7,
  organisms: [],
  vars: (rng, sev) => ({ size: rng.int(6, 9), hb0: [1, 2.5, 4.5][sev] + rng.range(0, 0.5) }),
  initHbLoss: (p) => p.vars.hb0,
  cc: () => '突然の腹痛と腰痛', ccKey: 'flank_pain',
  arrival: () => 'ambulance',
  initVolume: [[600, 1000], [1200, 1800], [2000, 2800]],
  history: {
    onset: { p: 1, text: '1時間ほど前、急にお腹と腰が激しく痛くなりました。' },
    character: { p: 1, text: '引き裂かれるような、ずっと続く痛みです。' },
    location: { p: 1, text: 'お腹の真ん中と、左の腰から背中です。' },
    radiation: { p: 0.6, text: '左の太ももの付け根のほうにも響きます。' },
    dizziness: { p: [0.4, 0.8, 1], text: '立とうとしたら気が遠くなりました。' },
    pmh: { p: 1, text: '高血圧で治療中です。健診でお腹の血管がふくれていると言われたことがありますが、そのままにしていました。' },
    hematuria: { p: 0, text: '' }, fever: { p: 0, text: '' }, relieving: { p: 1, text: '姿勢を変えても楽になりません。' },
    nausea: { p: 0.4, text: '少し吐き気がします。' },
    lmp: { p: 0, text: '' }, allergy: { p: 0, text: '' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['顔色が悪く、冷汗。', '顔面蒼白、冷汗、ぐったり。', '意識がもうろうとし、ショック状態。'] },
    abd_palp: { p: 0.8, text: '臍周囲に拍動性の腫瘤を触れ、圧痛が強い。' },
    periph: { p: [0.5, 0.9, 1], text: '四肢冷感・湿潤。' },
    cva: { p: 0.3, text: '左CVA部に叩打痛。' },
  },
  vitals: { HR: { to: [115, 135], k: 1 }, SBP: { to: [60, 80], k: 1.6 } },
  labs: {},
  tests: {
    abd_us: [{ p: 1, persist: true, text: '腹部大動脈が最大径約{size}cmに拡張（腹部大動脈瘤）。周囲に低エコー域（血腫の疑い）。' }],
    abd_ct_contrast: [{ p: 1, persist: true, text: '腎動脈下の腹部大動脈瘤（最大径{size}cm）と、左後腹膜に広がる血腫（破裂）。造影剤の血管外漏出あり。' }],
    abd_ct_plain: [{ p: 1, persist: true, text: '腹部大動脈瘤（最大径{size}cm）と、左後腹膜の高吸収な血腫（破裂）。' }],
  },
  natural: 0,
  curedBy: 'evar',
  therapies: [
    { id: 'rbc', label: '輸血（大量出血）', req: { fn: (enc) => (enc.state.rbcIn || 0) >= 280 }, required: true, deadlineH: [2, 1, 1] },
    { id: 'evar', label: '心臓血管外科コンサルト→緊急手術（ステントグラフト内挿術・人工血管置換術）', req: { procDone: 'evar' }, required: true, deadlineH: [6, 5, 4] },
  ],
  dynamics: (enc, eff) => {
    const st = enc.state, sev = enc.patient.sev;
    const done = st.procDone?.evar != null;
    const rate = done ? 0 : [0.12, 0.25, 0.45][sev] * (eff.ivVolRate > 500 ? 1.4 : 1); // 過剰な輸液は出血を増やす
    st.hbLoss += rate / 6;
    st.volume += (rate * 150) / 6;
    const hb = 13 - st.hbLoss + ((st.rbcIn || 0) / 280) * 1.5 * (60 / enc.patient.weight);
    let d = done ? -1.5 : 0.6;
    if (hb < 7) d += 1;
    return d;
  },
  procedures: [{
    id: 'evar', depts: ['cvs'], label: '緊急手術', delay: 30, duration: 120, after: 'icu',
    decide: (enc) => {
      const img = enc.tests.some((t) => ['abd_us', 'abd_ct_contrast', 'abd_ct_plain'].includes(t.id) && t.done && t.result.abnormal);
      if (!img) return { accept: false, text: 'ベッドサイドの腹部エコーで大動脈径を確認してください。破裂が疑われればすぐ手術室に向かいます。' };
      return { accept: true, reveal: true, text: '腹部大動脈瘤破裂です。すぐに手術室（ハイブリッド手術室）でステントグラフト内挿術を行います（約30分後に入室）。輸血を急ぎ、血圧は無理に上げすぎないでください（収縮期80〜90を目安）。' };
    },
    onDone: () => {},
    doneText: '心臓血管外科：ステントグラフト内挿術で破裂部からの出血をコントロールしました。ICUで管理します。',
  }],
  harmTags: { antiplatelet: '大量出血に抗血小板薬', anticoag: '大量出血に抗凝固薬', anticoag_bolus: '大量出血に抗凝固薬', thrombolytic: '大量出血に血栓溶解薬' },
  dispo: () => ({ ok: ['icu'], best: 'icu', why: '腹部大動脈瘤破裂：緊急手術・ICU' }),
  useful: ['abd_us', 'abd_ct_contrast', 'abd_ct_plain', 'cbc', 'chem', 'coag', 'vbg', 'ecg', 'lab_HB', 'ua', 'tnt'],
  key: [['abd_us', 'abd_ct_contrast', 'abd_ct_plain'], ['cbc', 'lab_HB'], ['coag']],
  extrasOk: () => [],
  teaching: [
    '高齢男性・喫煙・高血圧の突然の腹痛・腰背部痛・ショックは腹部大動脈瘤破裂を疑う。尿管結石と間違えやすい（高齢者の初発の「結石」は要注意）。',
    'ベッドサイドの腹部エコーで大動脈径（3cm以上で瘤）をすぐ確認する。',
    '輸血を急ぐが、血圧は上げすぎない（permissive hypotension：収縮期80〜90mmHg程度）。大量の輸液は出血を増やす。',
    '心臓血管外科で緊急手術（ステントグラフト内挿術・人工血管置換術）。手術までの時間が生死を分ける。',
  ],
  sources: ['2020年改訂版 大動脈瘤・大動脈解離診療ガイドライン（日本循環器学会ほか）'],
  ideal: () => [
    { a: 'test', ids: ['abd_us', 'cbc', 'chem', 'coag', 'vbg', 'ecg'] },
    { a: 'fluid', fluidId: 'rbc', mode: 'bolus', volume: 560 },
    { a: 'consult', dept: 'cvs', delayMin: 10 },
    { a: 'fluid', fluidId: 'rbc', mode: 'bolus', volume: 560, when: 'hb<7' },
  ],
};
