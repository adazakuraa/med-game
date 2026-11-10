// S状結腸軸捻転
// 出典: 日本腹部救急医学会『急性腹症診療ガイドライン2015』, ASCRS Clinical Practice Guidelines for the Management of Colonic Volvulus (2021)
export default {
  id: 'volvulus', name: 'S状結腸軸捻転', dept: '消化器内科',
  weight: 2, season: {}, minLevel: 2,
  demo: { age: [70, 95], ageMode: 'old', male: 0.6 },
  sev: { p: [0.4, 0.45, 0.15], burden: [[26, 36], [38, 50], [56, 66]] },
  refractoryP: [0, 0.02, 0.08],
  comorb: { extra: { dementia: 0.6, constip: 0.8, old_stroke: 0.3 } },
  organisms: [],
  noPregnancy: true,
  vars: (rng) => ({ d: rng.int(1, 3) }),
  cc: () => 'お腹がパンパンに張っている', ccKey: 'abd_pain',
  arrival: (sev) => (sev === 0 ? 'walk' : 'ambulance'),
  history: {
    onset: { p: 1, text: '（施設職員）{d}日前からお腹が張ってきて、今日はパンパンです。' },
    character: { p: 1, text: '（施設職員）お腹を触ると痛がります。' },
    constipation: { p: 1, text: '（施設職員）もともとひどい便秘で、下剤を使っています。{d}日間、便もおならも出ていません。' },
    nausea: { p: 0.6, text: '（施設職員）1回吐きました。' },
    pmh: { p: 1, text: '（施設職員）以前にも同じようにお腹が張って、内視鏡で戻してもらったことがあります。' },
    adl: { p: 1, text: '（施設職員）認知症があり、ほぼ車いすの生活です。' },
    surgery: { p: 1, text: '（施設職員）お腹の手術歴はありません。' },
    fever: { p: [0, 0.2, 0.6], text: '（施設職員）微熱があります。' },
    diarrhea: { p: 0, text: '' }, migration: { p: 0, text: '' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['腹部膨満が著明だが、穏やか。', 'お腹を痛がり、苦しそう。', 'ぐったりして冷汗。'] },
    abd_insp: { p: 1, text: '著明な腹部膨満（太鼓腹）。' },
    abd_perc: { p: 1, text: '腹部全体に鼓音。' },
    abd_palp: { p: 0.8, text: '腹部全体に軽い圧痛。' },
    abd_rebound: { p: [0, 0.1, 0.7], text: '反跳痛あり（腸管壊死・穿孔の疑い）。' },
  },
  vitals: { HR: { to: [100, 120], k: 1 } },
  labs: { WBC: { to: [10000, 17000], k: 1.2 }, LAC: { to: [2.5, 5], k: 2 } },
  tests: {
    axr: [{ p: 0.85, persist: true, text: '著明に拡張したS状結腸が逆U字状（coffee bean sign）に骨盤から右上腹部へ伸びる。' }],
    abd_ct_plain: [{ p: 1, persist: true, text: 'S状結腸の著明な拡張と、腸間膜の渦巻き状のねじれ（whirl sign）。遊離ガスなし。' }],
    abd_ct_contrast: [{ p: 1, persist: true, text: 'S状結腸の著明な拡張とwhirl sign。腸管壁の造影効果は保たれている。遊離ガスなし。' }],
  },
  natural: 0.45,
  curedBy: 'decomp',
  therapies: [
    { id: 'fluid', label: '輸液', req: { fluidTotal: 500 }, required: true, deadlineH: [6, 4, 2] },
    { id: 'decomp', label: '消化器内科コンサルト→内視鏡的整復・減圧（壊死・穿孔があれば手術）', req: { procDone: 'decomp' }, required: true, deadlineH: [12, 8, 6] },
  ],
  procedures: [{
    id: 'decomp', depts: ['gi', 'surgery'], label: '内視鏡的整復', delay: 60, duration: 45, after: 'ward',
    decide: (enc) => {
      const img = enc.tests.some((t) => ['axr', 'abd_ct_plain', 'abd_ct_contrast'].includes(t.id) && t.done && t.result.abnormal);
      if (!img) return { accept: false, text: '腹部X線かCTで捻転を確認してください。' };
      return { accept: true, reveal: true, text: 'S状結腸軸捻転です。腸管壊死・穿孔の所見はないので、大腸内視鏡で整復・減圧します（約60分後）。再発が多いので、落ち着いたら待機的手術も相談します。' };
    },
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 22); },
    doneText: '消化器内科：大腸内視鏡でS状結腸の捻転を解除し、大量のガスと便が排出されました。粘膜に壊死はありません。',
  }],
  dispo: () => ({ ok: ['admit', 'icu'], best: 'admit', why: 'S状結腸軸捻転：入院（整復後の経過観察・再発予防の検討）' }),
  useful: ['cbc', 'crp', 'chem', 'axr', 'abd_ct_plain', 'abd_ct_contrast', 'vbg', 'lab_LAC', 'ecg'],
  key: [['axr', 'abd_ct_plain', 'abd_ct_contrast'], ['cbc', 'chem']],
  extrasOk: () => ['impaction'],
  teaching: [
    '慢性便秘・寝たきり・認知症の高齢者に著明な腹部膨満と排ガス停止があれば、S状結腸軸捻転を考える。',
    '腹部X線で拡張したS状結腸の逆U字像（coffee bean sign）、CTで腸間膜のねじれ（whirl sign）。',
    '壊死・穿孔がなければ内視鏡で整復・減圧。再発が多いので待機的にS状結腸切除を検討。',
    '腹膜刺激徴候・乳酸上昇・造影不良は腸管壊死を示唆し、緊急手術。',
  ],
  sources: ['急性腹症診療ガイドライン2015', 'ASCRS Clinical Practice Guidelines for the Management of Colonic Volvulus (2021)'],
  ideal: () => [
    { a: 'test', ids: ['cbc', 'crp', 'chem', 'axr', 'abd_ct_plain'] },
    { a: 'fluid', fluidId: 'lr', mode: 'bolus', volume: 500 },
    { a: 'npo' },
    { a: 'consult', dept: 'gi', delayMin: 45 },
  ],
};
