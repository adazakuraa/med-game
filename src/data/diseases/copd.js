// COPD増悪
// 出典: 日本呼吸器学会『COPD（慢性閉塞性肺疾患）診断と治療のためのガイドライン 第6版（2022）』, GOLD 2024
export default {
  id: 'copd', name: 'COPD増悪', dept: '呼吸器内科',
  weight: 5, season: { winter: 1.5, summer: 0.7 }, minLevel: 2,
  demo: { age: [60, 90], ageMode: 'old', male: 0.85 },
  sev: { p: [0.35, 0.45, 0.2], burden: [[25, 35], [40, 55], [60, 72]] },
  refractoryP: [0, 0.02, 0.08],
  comorb: { forced: ['copd'], extra: { htn: 0.4, chf: 0.1, dm2: 0.15 } },
  smokeP: 0.45,
  organisms: [],
  vars: (rng) => ({ days: rng.int(2, 5), purulent: rng.chance(0.6) }),
  cc: () => '息苦しさ',
  ccKey: 'dyspnea',
  arrival: (sev) => (sev >= 1 ? 'ambulance' : 'walk'),
  history: {
    onset: { p: 1, text: '{days}日前に風邪をひいてから、息切れがひどくなりました。' },
    course: { p: 1, bySev: ['いつもより息切れが強いです。', '少し動くだけで息が切れて、ゼーゼーします。', 'じっとしていても苦しくて、話すのもつらいです。'] },
    character: { p: 1, text: '息を吐ききれない感じで、ゼーゼーします。' },
    dyspnea: { p: 1, bySev: ['いつもより息切れがします。', '家の中を歩くだけで息が切れます。', '安静にしていても苦しいです。'] },
    cough: { p: 0.9, text: '咳が増えました。' },
    sputum: { p: 0.85, text: '{sputumText}' },
    fever: { p: 0.4, text: '37度台の微熱があります。' },
    sorethroat: { p: 0.5, text: '数日前に喉が痛くて鼻水が出ていました。' },
    orthopnea: { p: 0.3, text: '横になると少し苦しいです。' },
    edema: { p: 0.1, text: '足が少しむくんでいます。' },
    smoking: { p: 0.6, text: '40年間、1日1箱吸っていました。今もやめられていません。' },
    trigger: { p: 0.6, text: '風邪をひいたのがきっかけです。' },
  },
  postVars: (v) => { v.sputumText = v.purulent ? '黄色い痰が増えました。' : '白い痰が増えました。'; },
  exam: {
    gen_appear: { p: 1, bySev: ['口すぼめ呼吸をしている。', '起座位で口すぼめ呼吸。会話は短文。', '呼吸補助筋を使い、会話が困難。'] },
    chest_insp: { p: 1, text: '樽状胸郭。呼吸補助筋（胸鎖乳突筋）の使用。呼気の延長。' },
    lung_ausc: { p: 0.9, text: '両側で呼吸音が減弱し、呼気性wheezesを聴取。' },
    chest_perc: { p: 0.5, text: '両側で過共鳴（鼓音傾向）。' },
    heart_ausc: { p: 0.2, text: '心音は遠い。' },
  },
  vitals: { HR: { to: [105, 125], k: 1 }, RR: { to: [28, 36], k: 1 }, SpO2: { drop: [14, 22], k: 1.1 }, T: { to: [37.2, 37.8], k: 1 } },
  labs: { WBC: { to: [9000, 14000], k: 1 }, CRP: { to: [2, 8], k: 1 }, HB: { add: [0.5, 1.5], k: 0, p: 0.5 } },
  hco3Fn: () => 31,
  labHook: (enc, id, v) => {
    if (id !== 'PCO2') return v;
    const art = 52 + enc.state.burden * 0.35 + (enc.state.co2x || 0);
    return art + 6;
  },
  tests: {
    cxr: [{ p: 0.95, persist: true, text: '肺の過膨張（横隔膜の平低化）と肺野の透過性亢進（肺気腫）。明らかな浸潤影なし。' }],
    chest_ct: [{ p: 1, persist: true, text: '両肺に広範な低吸収域（気腫性変化）。明らかな浸潤影なし。' }],
    sputum_gram: [{ p: 0.5, ifVar: 'purulent', text: 'グラム陰性短桿菌（インフルエンザ菌を疑う）を認める。' }],
  },
  ecg: [{ p: 0.4, text: '右軸偏位、肺性P波。' }],
  natural: 0.4,
  therapies: [
    { id: 'saba', label: '短時間作用性β2刺激薬（サルブタモール吸入）', req: { tag: 'bronchodilator' }, effect: -1.0, lagH: 0.2, required: true, deadlineH: [1, 1, 0.5] },
    { id: 'steroid', label: '全身性ステロイド（プレドニゾロン30〜40mg 5日間）', req: { anyTag: ['steroid_sys', 'steroid'] }, effect: -0.6, lagH: 4, required: true, deadlineH: [6, 4, 2] },
    { id: 'o2', label: '酸素投与（目標SpO2 88〜92%：高濃度は避ける）', req: { o2: true }, when: (c) => c.rawSpO2 < 88, required: true, deadlineH: [0.5, 0.5, 0.25] },
    { id: 'nppv', label: '高二酸化炭素血症性アシドーシスにNPPV', req: { fn: (enc, eff) => eff.nppv }, required: (enc) => enc.patient.sev === 2, deadlineH: [99, 99, 2] },
  ],
  dynamics: (enc, eff) => {
    const st = enc.state;
    // 過剰な酸素でCO2ナルコーシス
    const excess = (eff.o2Device === 'nc' && eff.o2Flow >= 4) || eff.o2Device === 'mask' || eff.o2Device === 'reservoir';
    if (eff.nppv) st.co2x = Math.max(0, (st.co2x || 0) - 2.5);
    else if (excess && enc.patient.sev >= 1) st.co2x = Math.min(40, (st.co2x || 0) + 0.9);
    else st.co2x = Math.max(0, (st.co2x || 0) - 1.2);
    let d = st.co2x > 12 ? 1.5 : 0;
    if (eff.nppv) d -= 1.5;
    if (eff.tags.betablocker) d += 2;
    return d;
  },
  harmTags: { betablocker: 'COPD増悪中のβ遮断薬（気管支攣縮の悪化）' },
  dispo: (enc) => (enc.patient.sev === 2 ? { ok: ['icu'], best: 'icu', why: '高二酸化炭素血症・アシドーシス：ICUでNPPV' } : enc.patient.sev === 1 ? { ok: ['admit'], best: 'admit', why: '中等症：入院' } : { ok: ['home', 'admit'], best: 'home', why: '軽症で治療に反応すれば外来' }),
  useful: ['vbg', 'cbc', 'chem', 'crp', 'cxr', 'chest_ct', 'ecg', 'bnp', 'sputum_gram', 'sputum_cx', 'flu_ag', 'covid_ag'],
  key: [['vbg'], ['cxr']],
  extrasOk: () => [],
  teaching: [
    'COPD増悪は「息切れ・咳・痰の増加」。きっかけは気道感染が多い。',
    '酸素は目標SpO2 88〜92%。高濃度の酸素はCO2ナルコーシス（意識障害・呼吸停止）を招く。',
    '血液ガスでpCO2とpHを必ず確認。呼吸性アシドーシス（pH<7.35かつpCO2上昇）ではNPPVを考える。',
    '治療はABC：抗菌薬（膿性痰）・気管支拡張薬（サルブタモール吸入）・ステロイド（プレドニゾロン30〜40mg 5日間）。',
    '心不全・肺炎・気胸・肺塞栓症も同じように息切れが増えるので鑑別する。',
  ],
  sources: ['COPD（慢性閉塞性肺疾患）診断と治療のためのガイドライン 第6版（日本呼吸器学会 2022）', 'GOLD 2024 Report'],
  ideal: (p) => [
    { a: 'o2', device: 'nc', flow: 1, when: 'spo2<88' },
    { a: 'test', ids: ['vbg', 'cxr', 'cbc', 'chem'] },
    { a: 'rx', drugId: 'salbutamol', route: 'inh', dose: 2.5, freq: 'q4h', days: 3 },
    { a: 'rx', drugId: 'prednisolone', route: 'po', dose: 30, freq: 'q24h', days: 5 },
    { a: 'o2', device: 'nppv', flow: 0, when: 'sev2' },
  ],
};
