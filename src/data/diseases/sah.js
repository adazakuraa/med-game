// くも膜下出血（脳動脈瘤破裂）
// 出典: 日本脳卒中学会『脳卒中治療ガイドライン2021（改訂2023）』, 各薬剤添付文書
export default {
  id: 'sah', name: 'くも膜下出血（脳動脈瘤破裂）', dept: '脳神経外科',
  weight: 2, season: { winter: 1.2 }, minLevel: 3,
  demo: { age: [35, 80], ageMode: 'uniform', male: 0.4 },
  sev: { p: [0.35, 0.4, 0.25], burden: [[25, 35], [40, 52], [58, 70]] },
  refractoryP: [0, 0.03, 0.15],
  comorb: { extra: { htn: 0.5, dyslip: 0.2 } },
  smokeP: 0.35,
  organisms: [],
  vars: (rng) => {
    const loc = rng.pick(['前交通動脈', '右内頸動脈-後交通動脈分岐部', '左中大脳動脈分岐部']);
    return { loc, size: rng.int(5, 9), onsetH: rng.int(1, 6), cn3: loc.includes('後交通') };
  },
  cc: () => '突然の激しい頭痛',
  ccKey: 'headache',
  arrival: (sev) => (sev === 0 ? 'walk' : 'ambulance'),
  history: {
    onset: { p: 1, text: '{onsetH}時間ほど前、急にバットで殴られたような頭痛がしました。' },
    lastnormal: { p: 1, text: '頭痛が始まる直前までは何ともありませんでした。' },
    course: { p: 1, text: '痛みは一瞬で最高になり、少しも良くなりません。' },
    character: { p: 1, text: '今までに経験したことのない、最悪の頭痛です。' },
    location: { p: 1, text: '頭全体と首の後ろです。' },
    severity: { p: 1, text: '10です。人生で一番の痛みです。' },
    headache: { p: 1, text: '突然、ものすごい頭痛がしました。' },
    nausea: { p: 0.75, text: '何度も吐きました。' },
    photophobia: { p: 0.4, text: '光がまぶしいです。' },
    seizure: { p: 0.1, text: '（家族）一瞬けいれんしたように見えました。' },
    trigger: { p: 0.3, text: '数日前にも少し頭痛がありました（警告頭痛）。' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['頭を抱えて苦しそう。', '嘔吐を繰り返し、ぐったりしている。', '呼びかけへの反応が鈍い。'] },
    neck_stiff: { p: [0.3, 0.6, 0.8], text: '項部硬直あり。' },
    jolt: { p: 0.5, text: 'jolt accentuation 陽性。' },
    pupils: { p: 0.7, ifVar: 'cn3', text: '右瞳孔の散大（動眼神経麻痺）。対光反射は右で消失。' },
  },
  vitals: { SBP: { to: [175, 205], k: 0.3 }, HR: { to: [85, 100], k: 1 } },
  labs: { GLU: { add: [20, 60], k: 1 }, WBC: { to: [10000, 14000], k: 1 }, NA: { add: [-4, 0], k: 1 } },
  tests: {
    head_ct: [{ p: [0.95, 0.98, 0.99], persist: true, text: '脳底槽からシルビウス裂にかけて高吸収域（くも膜下出血）。' }],
    head_mri: [{ p: 0.9, persist: true, text: 'FLAIR像で脳溝に高信号。MRAで{loc}に動脈瘤（約{size}mm）。' }],
    lp: [{ p: 1, text: '初圧 28cmH2O。血性髄液（3本目まで均一に血性）。遠心後の上清はキサントクロミー陽性。' }],
  },
  ecg: [{ p: 0.3, text: '広範な陰性T波とQT延長（くも膜下出血に伴う変化）。' }],
  natural: 0.2,
  curedBy: 'aneurysm',
  therapies: [
    { id: 'bp', label: '降圧（収縮期血圧160mmHg未満）・鎮痛・安静', req: { anyTag: ['bp_lower', 'betablocker'] }, when: (c) => c.vit.SBP > 160, required: true, deadlineH: [1, 1, 1], startFromNeed: true, effect: -0.2, lagH: 0 },
    { id: 'aneurysm', label: '脳神経外科コンサルト→動脈瘤の処置（クリッピング・コイル塞栓）', req: { procDone: 'aneurysm' }, required: true, deadlineH: [24, 24, 12] },
  ],
  dynamics: (enc, eff) => {
    let d = 0;
    const vit = enc.lastVitals?.v;
    if (!eff.tags.bp_lower && !eff.tags.betablocker && (vit?.SBP ?? 160) > 160) d += 0.4; // 再出血のリスク
    if (eff.tags.antiplatelet || eff.tags.anticoag || eff.tags.anticoag_bolus || eff.tags.thrombolytic) d += 3;
    return d;
  },
  procedures: [{
    id: 'aneurysm', depts: ['nsurg', 'neuro'], label: '動脈瘤の処置', delay: 120, duration: 180, after: 'icu',
    decide: (enc) => {
      const ct = enc.tests.some((t) => ['head_ct', 'head_mri', 'lp'].includes(t.id) && t.done && t.result.abnormal);
      if (!ct) return { accept: false, text: '突然の頭痛ならまず頭部CTを。CTが正常でも疑いが強ければ腰椎穿刺を検討してください。' };
      return { accept: true, reveal: true, text: 'くも膜下出血です。再出血予防のため、脳血管撮影のうえ{loc}動脈瘤の処置（コイル塞栓術またはクリッピング）を行います。それまで降圧・鎮痛・安静をお願いします。' };
    },
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 30); },
    doneText: '脳神経外科：{loc}動脈瘤の処置を終えました。脳血管攣縮に注意しながらICUで管理します。',
  }],
  harmTags: { antiplatelet: 'くも膜下出血に抗血小板薬（再出血のリスク）', anticoag: 'くも膜下出血に抗凝固薬（再出血のリスク）', anticoag_bolus: 'くも膜下出血に抗凝固薬（再出血のリスク）' },
  residualAbove: 18,
  residualText: '意識障害・麻痺などの後遺症が残りました。',
  dispo: () => ({ ok: ['icu'], best: 'icu', why: 'くも膜下出血：ICU（SCU）で再出血予防と管理' }),
  useful: ['head_ct', 'head_mri', 'lp', 'cbc', 'chem', 'coag', 'ecg', 'bs_poct', 'lab_GLU', 'vbg', 'cxr'],
  key: [['head_ct', 'head_mri', 'lp']],
  extrasOk: () => [],
  teaching: [
    '「突然の」「人生最悪の」頭痛はくも膜下出血を疑う。発症の瞬間を言える頭痛（雷鳴頭痛）は要注意。',
    '頭部CTは発症6時間以内ならほぼ見つかるが、時間がたつと見逃しが増える。疑いが強くCTが正常なら腰椎穿刺（キサントクロミー）。',
    '最大の危険は再出血。安静・鎮痛・降圧（収縮期160mmHg未満を目安）を行い、早期に脳神経外科で動脈瘤を処置する。',
    '動眼神経麻痺（瞳孔散大）は内頸動脈-後交通動脈分岐部の動脈瘤を示唆する。',
    '抗血小板薬・抗凝固薬・血栓溶解薬は再出血を招くので禁忌。',
  ],
  sources: ['脳卒中治療ガイドライン2021〔改訂2023〕（日本脳卒中学会）', '各薬剤 添付文書'],
  ideal: (p) => [
    { a: 'test', ids: ['head_ct', 'cbc', 'chem', 'coag', 'ecg'] },
    { a: 'rx', drugId: 'morphine', route: 'iv', dose: 3, freq: 'once', days: 1 },
    { a: 'rx', drugId: 'nicardipine', route: 'iv', dose: 2, freq: 'cont', days: 3, when: 'sbp>160' },
    { a: 'consult', dept: 'nsurg', delayMin: 25 },
  ],
};
