// 慢性硬膜下血腫
// 出典: 日本脳神経外科学会『脳神経外科疾患情報』, 脳卒中治療ガイドライン2021（改訂2023）参考
export default {
  id: 'csdh', name: '慢性硬膜下血腫', dept: '脳神経外科',
  weight: 3, season: {}, minLevel: 2,
  demo: { age: [65, 92], ageMode: 'old', male: 0.7 },
  sev: { p: [0.4, 0.45, 0.15], burden: [[24, 32], [34, 46], [52, 64]] },
  refractoryP: [0, 0, 0.03],
  comorb: { extra: { htn: 0.5, af: 0.2 } },
  organisms: [],
  vars: (rng, sev, pt) => {
    const apt = rng.chance(0.4);
    if (apt) pt.homeMeds.push('aspirin_home');
    const leftSide = rng.chance(0.5);
    return { apt, wk: rng.int(3, 8), side: leftSide ? '左' : '右', paresis: leftSide ? '右' : '左' };
  },
  cc: () => '最近ぼんやりして歩き方がおかしい', ccKey: 'elderly_decline',
  arrival: () => 'walk',
  history: {
    onset: { p: 1, text: '（家族）2週間くらい前から、ぼんやりして物忘れが増え、歩き方がおかしくなりました。' },
    lastnormal: { p: 1, text: '（家族）1か月前までは普段通りでした。' },
    course: { p: 1, text: '（家族）だんだん悪くなっています。' },
    trigger: { p: 1, text: '（家族）{wk}週間くらい前に、酔って転んで頭をぶつけました。そのときは何ともありませんでした。' },
    weakness: { p: 0.8, text: '{paresis}の手足に力が入りにくいです。' },
    headache: { p: 0.6, text: '頭が重い感じがします。' },
    alcohol: { p: 0.6, text: '毎晩日本酒を2合ほど飲みます。' },
    meds: { p: 1, ifVar: 'apt', text: '（家族）心臓のためにバイアスピリンを飲んでいます。' },
    adl: { p: 1, text: '（家族）以前は一人で散歩していました。' },
    anorexia: { p: 0.3, text: '（家族）少し食欲が落ちました。' },
    fever: { p: 0, text: '' }, cough: { p: 0, text: '' }, dysuria: { p: 0, text: '' },
  },
  exam: {
    gen_consc: { p: [0.5, 0.9, 1], bySev: ['少しぼんやりしている（JCS 1）。', '見当識障害あり（JCS 2〜3）。', '呼びかけで開眼（JCS 10）。'] },
    motor: { p: 0.85, text: '{paresis}上下肢の軽い麻痺（Barré徴候陽性）。' },
    gen_appear: { p: 1, text: '歩行がふらつき、{paresis}足を引きずる。' },
  },
  vitals: {},
  labs: {},
  tests: {
    head_ct: [{ p: 1, persist: true, text: '{side}前頭〜頭頂部に三日月状の等〜高吸収域（慢性硬膜下血腫、厚さ約20mm）。正中偏位あり。' }],
    head_mri: [{ p: 1, persist: true, text: '{side}大脳半球表面に三日月状の血腫（慢性硬膜下血腫）。急性期脳梗塞はない。' }],
  },
  natural: 0.15,
  curedBy: 'burr',
  therapies: [{ id: 'burr', label: '脳神経外科コンサルト→穿頭血腫ドレナージ術', req: { procDone: 'burr' }, required: true, deadlineH: [48, 24, 12] }],
  procedures: [{
    id: 'burr', depts: ['nsurg', 'neuro'], label: '穿頭血腫ドレナージ術', delay: 120, duration: 60, after: 'ward',
    decide: (enc) => {
      const img = enc.tests.some((t) => ['head_ct', 'head_mri'].includes(t.id) && t.done);
      if (!img) return { accept: false, text: '頭部CTをお願いします。' };
      return { accept: true, reveal: true, text: '{side}の慢性硬膜下血腫で、症状と正中偏位があるので穿頭血腫ドレナージ術を行います（局所麻酔、約2時間後）。抗血小板薬は中止してください。' };
    },
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 15); },
    doneText: '脳神経外科：穿頭術で血腫を洗浄・ドレナージしました。術後、麻痺と意識は改善傾向です。',
  }],
  harmTags: { antiplatelet: '頭蓋内出血に抗血小板薬', anticoag: '頭蓋内出血に抗凝固薬', anticoag_bolus: '頭蓋内出血に抗凝固薬', thrombolytic: '頭蓋内出血に血栓溶解薬' },
  dispo: () => ({ ok: ['admit', 'icu'], best: 'admit', why: '症候性の慢性硬膜下血腫：入院・穿頭術' }),
  useful: ['head_ct', 'head_mri', 'bs_poct', 'cbc', 'chem', 'coag', 'ecg', 'thyroid', 'nh3'],
  key: [['head_ct', 'head_mri'], ['coag']],
  extrasOk: () => [],
  teaching: [
    '高齢者の数週間かけて進む物忘れ・歩行障害・片麻痺・頭痛は慢性硬膜下血腫を考える。軽い頭部打撲（本人が覚えていないことも）から1〜2か月後に発症。',
    '飲酒・抗血小板薬/抗凝固薬・脳萎縮がリスク。「認知症が急に進んだ」の中に隠れている（治る認知症）。',
    '頭部CTで三日月状の血腫。',
    '症状があれば穿頭血腫ドレナージ術（局所麻酔で可能）。劇的に改善することが多い。',
  ],
  sources: ['日本脳神経外科学会 脳神経外科疾患情報「慢性硬膜下血腫」'],
  ideal: () => [{ a: 'test', ids: ['bs_poct', 'head_ct', 'cbc', 'chem', 'coag'] }, { a: 'consult', dept: 'nsurg', delayMin: 30 }],
};
