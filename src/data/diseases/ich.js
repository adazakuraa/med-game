// 高血圧性脳出血（被殻出血）
// 出典: 日本脳卒中学会『脳卒中治療ガイドライン2021（改訂2023）』, 2022 AHA/ASA Guideline for the Management of Spontaneous Intracerebral Hemorrhage
export default {
  id: 'ich', name: '脳出血（高血圧性）', dept: '脳神経外科',
  weight: 4, season: { winter: 1.3 }, minLevel: 2,
  demo: { age: [50, 88], ageMode: 'old', male: 0.6 },
  sev: { p: [0.4, 0.4, 0.2], burden: [[22, 32], [36, 50], [56, 68]] },
  refractoryP: [0, 0.03, 0.08],
  comorb: { extra: { htn: 0.95, dm2: 0.2, dyslip: 0.3, ckd: 0.1 } },
  organisms: [],
  untreatedFatal: false,
  vars: (rng, sev, pt) => {
    const leftHemi = rng.chance(0.5);
    const hrs = rng.int(1, 3);
    const noMeds = rng.chance(0.6);
    return { leftHemi, hrs, noMeds, paresis: leftHemi ? '右' : '左', hemi: leftHemi ? '左' : '右', mmt: [4, 2, 1][sev], vol: [8, 18, 35][sev] + rng.int(0, 6) };
  },
  cc: (v) => `急に${v.paresis}半身が動かない・頭痛`,
  ccKey: 'neuro_deficit',
  arrival: () => 'ambulance',
  history: {
    lastnormal: { p: 1, text: '（家族）{hrs}時間ほど前、夕食の後までは普通でした。' },
    onset: { p: 1, text: '（家族）{hrs}時間ほど前、トイレでいきんだ後に急に倒れ込みました。' },
    character: { p: 1, text: '（家族）急に{paresis}の手足が動かなくなって、頭が痛いと言い出しました。' },
    weakness: { p: 1, text: '{paresis}の手と足に力が入りません。' },
    headache: { p: 0.8, text: '頭が痛いです。だんだん強くなっています。' },
    nausea: { p: [0.3, 0.6, 0.9], text: '気持ち悪くて吐きました。' },
    speechq: { p: 0.7, text: 'ろれつが回りにくいです。' },
    pmh: { p: 1, text: '（家族）健診で血圧が高いと言われていましたが、薬は飲んだり飲まなかったりでした。' },
    adherence: { p: 1, ifVar: 'noMeds', text: '（家族）血圧の薬は1年くらい前から飲んでいません。' },
    meds: { p: 1, text: '（家族）血液をサラサラにする薬は飲んでいません。' },
    seizure: { p: 0.05, text: '（家族）一度けいれんしました。' },
    palpitation: { p: 0, text: '' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['頭痛を訴え、{paresis}半身の麻痺がある。', 'ぐったりして、繰り返し嘔吐している。', '呼びかけへの反応が鈍く、いびき様呼吸。'] },
    facial: { p: 0.9, text: '{paresis}の顔面下部の麻痺。' },
    motor: { p: 1, text: '{paresis}上下肢の麻痺（徒手筋力 {mmt}/5）。' },
    speech: { p: 0.7, text: '構音障害（ろれつが回らない）。' },
    pupils: { p: [0.1, 0.4, 0.8], text: '両眼が{hemi}を向いている（共同偏視）。' },
    neck_stiff: { p: 0.1, text: '軽度の項部硬直。' },
  },
  vitals: { SBP: { to: [195, 225], k: 0.2 }, HR: { to: [60, 70], k: 1 } },
  labs: { GLU: { add: [20, 60], k: 1 } },
  tests: {
    head_ct: [{ p: 1, persist: true, text: '{hemi}被殻に約{vol}mLの高吸収域（急性期脳出血）。周囲に軽度の浮腫。脳室穿破なし。' }],
    head_mri: [{ p: 1, persist: true, text: 'T2*強調像で{hemi}被殻に低信号の血腫（脳出血）。拡散強調像で急性期脳梗塞はない。' }],
  },
  natural: 0.15,
  therapies: [
    { id: 'bp', label: '早期の降圧（収縮期血圧140mmHg未満を目標）', req: { anyTag: ['bp_lower'] }, when: (c) => c.vit.SBP > 150, required: true, deadlineH: [2, 1.5, 1], startFromNeed: true, effect: -0.3, lagH: 0 },
    { id: 'nsurg', label: '脳神経外科コンサルト（手術適応の判断・SCUでの管理）', req: { procDone: 'scu' }, required: true, deadlineH: [6, 4, 3] },
  ],
  dynamics: (enc, eff) => {
    const vit = enc.lastVitals?.v;
    let d = enc.t < 24 * 60 ? 0.1 : -0.25;
    if (!eff.tags.bp_lower && (vit?.SBP ?? 180) > 160 && enc.t < 24 * 60) d += 0.5; // 血腫の増大
    if (eff.tags.thrombolytic) d += 8;
    if (eff.tags.antiplatelet || eff.tags.anticoag || eff.tags.anticoag_bolus) d += 2;
    return d;
  },
  procedures: [{
    id: 'scu', depts: ['nsurg', 'neuro'], label: 'SCU入室', delay: 30, duration: 10, after: 'icu',
    decide: (enc) => {
      const img = enc.tests.some((t) => ['head_ct', 'head_mri'].includes(t.id) && t.done);
      if (!img) return { accept: false, text: 'まず頭部CTで出血か梗塞かを確認してください。' };
      return { accept: true, reveal: enc.patient.sev >= 0, text: '{hemi}被殻出血（約{vol}mL）です。現時点では手術適応はなく保存的治療とします。収縮期血圧140mmHg未満を目標に降圧を続けてください。SCUで受け入れます。' };
    },
    onDone: () => {},
    doneText: '脳神経外科：SCUに入室しました。降圧を継続し、血腫の増大と意識レベルを監視します。',
  }],
  harmTags: { thrombolytic: '脳出血に血栓溶解薬（rt-PA）（出血の増大）', antiplatelet: '脳出血に抗血小板薬', anticoag: '脳出血に抗凝固薬', anticoag_bolus: '脳出血に抗凝固薬' },
  residualAbove: 15,
  residualText: '片麻痺・言語障害などの後遺症が残り、リハビリテーションを継続しています。',
  dispo: () => ({ ok: ['icu', 'admit'], best: 'icu', why: '急性期脳出血：脳卒中ケアユニット（SCU/ICU）で降圧と血腫増大・意識の監視' }),
  useful: ['bs_poct', 'lab_GLU', 'head_ct', 'head_mri', 'cbc', 'chem', 'coag', 'ecg', 'cxr'],
  key: [['head_ct', 'head_mri'], ['coag'], ['bs_poct', 'lab_GLU', 'chem']],
  extrasOk: () => [],
  teaching: [
    '急な片麻痺は脳卒中。脳梗塞か脳出血かは症状だけでは区別できないので、まず頭部CTで出血を確認する（rt-PAを考える前に必須）。',
    '頭痛・嘔吐・著明な高血圧・意識障害の進行は脳出血を示唆する。高血圧性脳出血は被殻・視床・小脳・橋に多い。',
    '急性期は早期に降圧（収縮期140mmHg未満が目安、ニカルジピンなど持続静注）して血腫の増大を防ぐ。',
    '抗凝固薬内服中なら中和（ワルファリンにはビタミンK・プロトロンビン複合体など）。血栓溶解薬・抗血小板薬は禁忌。',
    '小脳出血（3cm以上・水頭症）や大きな皮質下出血は手術を検討するため脳神経外科に相談する。',
  ],
  sources: ['脳卒中治療ガイドライン2021〔改訂2023〕（日本脳卒中学会）', '2022 AHA/ASA Guideline for the Management of Patients With Spontaneous Intracerebral Hemorrhage'],
  ideal: (p) => [
    { a: 'test', ids: ['bs_poct', 'head_ct', 'cbc', 'chem', 'coag', 'ecg'] },
    { a: 'rx', drugId: 'nicardipine', route: 'iv', dose: 2, freq: 'cont', days: 2, when: 'sbp>160' },
    { a: 'consult', dept: 'nsurg', delayMin: 20 },
  ],
};
