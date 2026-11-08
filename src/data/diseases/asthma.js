// 気管支喘息発作
// 出典: 日本アレルギー学会『喘息予防・管理ガイドライン2021』, GINA 2024
export default {
  id: 'asthma', name: '気管支喘息発作', dept: '呼吸器内科',
  weight: 5, season: { winter: 1.2, other: 1.2 }, minLevel: 1,
  demo: { age: [16, 55], ageMode: 'young', male: 0.45 },
  sev: { p: [0.45, 0.4, 0.15], burden: [[22, 32], [38, 52], [60, 72]] },
  refractoryP: [0, 0, 0.05],
  comorb: { forced: ['asthma'], extra: {} },
  organisms: [],
  vars: (rng) => ({ trig: rng.pick(['風邪をひいてから', '季節の変わり目で寒暖差が大きくて', '猫のいる友人の家に行ってから']), hours: rng.int(3, 24), nonAdh: rng.chance(0.5) }),
  cc: () => '息苦しさ',
  ccKey: 'dyspnea',
  arrival: (sev) => (sev === 2 ? 'ambulance' : 'walk'),
  history: {
    onset: { p: 1, text: '{hours}時間ほど前から、ゼーゼーして息苦しくなりました。' },
    course: { p: 1, bySev: ['吸入を使っても少ししか良くなりません。', '吸入を何回使っても良くならず、横になれません。', '話すのもやっとです……'] },
    character: { p: 1, text: 'ヒューヒュー、ゼーゼーして、息が吐きにくいです。' },
    dyspnea: { p: 1, bySev: ['動くと苦しいです。', '座っていても苦しいです。', '……苦しい……（単語でしか話せない）'] },
    cough: { p: 0.8, text: '夜中に咳がひどいです。' },
    trigger: { p: 0.9, text: '{trig}です。' },
    adherence: { p: 1, text: '{adhText}' },
    pmh: { p: 1, text: '小さい頃から喘息があります。今回みたいにひどいのは久しぶりです。' },
    fever: { p: 0.2, text: '少し熱っぽいです。' },
    chestpain: { p: 0.2, text: '胸が締め付けられる感じがします。' },
  },
  postVars: (v) => { v.adhText = v.nonAdh ? '調子が良かったので、毎日の吸入をやめていました。' : '毎日の吸入は続けています。'; },
  exam: {
    gen_appear: { p: 1, bySev: ['息苦しそうだが、文章で話せる。', '起座呼吸で、句読点ごとに区切って話す。', '単語しか話せない。チアノーゼあり。'] },
    chest_insp: { p: 1, bySev: ['呼気の延長。', '呼吸補助筋の使用と呼気延長。', '著明な呼吸補助筋の使用。胸郭の動きは小さい。'] },
    lung_ausc: [{ p: [1, 1, 0.4], text: '両側で呼気性wheezes（笛のような音）。呼気の延長。' }, { p: [0, 0, 0.6], text: '呼吸音が非常に弱く、wheezesもほとんど聞こえない（silent chest：危険）。' }],
  },
  vitals: { HR: { to: [110, 130], k: 1 }, RR: { to: [28, 36], k: 1 }, SpO2: { drop: [12, 20], k: 1.3 } },
  labs: { WBC: { to: [9000, 12000], k: 1, p: 0.5 } },
  hco3Fn: () => 23,
  labHook: (enc, id, v) => {
    if (id !== 'PCO2') return v;
    const b = enc.state.burden;
    return (b > 60 ? 38 + (b - 60) * 1.2 : 34) + 6; // 重症化すると呼吸筋疲労でpCO2が上昇
  },
  tests: { cxr: [{ p: 0.6, text: '肺の過膨張。明らかな浸潤影・気胸なし。' }] },
  natural: 0.35,
  therapies: [
    { id: 'saba', label: '短時間作用性β2刺激薬（サルブタモール吸入を反復）', req: { tag: 'bronchodilator' }, effect: -1.6, lagH: 0.2, required: true, deadlineH: [0.5, 0.5, 0.25] },
    { id: 'steroid', label: '全身性ステロイド', req: { anyTag: ['steroid_sys', 'steroid'] }, effect: -0.8, lagH: 4, required: true, deadlineH: [2, 1, 1] },
    { id: 'o2', label: '酸素投与（SpO2 93〜95%目標）', req: { o2: true }, when: (c) => c.rawSpO2 < 92, required: true, deadlineH: [0.5, 0.5, 0.25] },
    { id: 'adrenaline', label: '重篤発作：アドレナリン筋注を考慮', req: { tag: 'epinephrine' }, required: false, deadlineH: [1, 1, 1] },
  ],
  dynamics: (enc, eff) => {
    let d = enc.patient.sev === 0 ? -0.3 : 0;
    if (eff.tags.epinephrine) d -= 3;
    if (eff.tags.betablocker) d += 4;
    if (eff.tags.nsaid && enc.patient.comorb.includes('asthma_nsaid')) d += 3;
    return d;
  },
  harmTags: { betablocker: '喘息発作にβ遮断薬（致死的な気管支攣縮）' },
  dispo: (enc) => (enc.patient.sev === 2 ? { ok: ['icu'], best: 'icu', why: '重篤発作：ICU' } : enc.patient.sev === 1 ? { ok: ['admit', 'home'], best: 'admit', why: '中等度発作：治療反応が不十分なら入院' } : { ok: ['home'], best: 'home', why: '軽症で治療に反応：ステロイド内服5日間と吸入指導で帰宅' }),
  useful: ['vbg', 'cxr', 'cbc', 'chem', 'ecg', 'flu_ag', 'covid_ag'],
  key: [],
  extrasOk: () => [],
  teaching: [
    '喘息発作の重症度は「話し方」で分かる：文章で話せる（軽症）→句で区切る（中等症）→単語のみ（重症）。',
    'wheezesが聞こえない「silent chest」は空気がほとんど動いていない危険な状態。',
    '治療の柱はサルブタモール吸入の反復（20分ごと）と全身性ステロイド。重篤ならアドレナリン筋注も。',
    '発作中にpCO2が正常〜上昇してきたら呼吸筋疲労のサイン（通常は過換気でpCO2は低い）。',
    'β遮断薬は喘息に禁忌。アスピリン喘息ではNSAIDsで発作が誘発される。',
    '再発予防：吸入ステロイドの継続（アドヒアランス）と吸入手技の指導が最も重要。',
  ],
  sources: ['喘息予防・管理ガイドライン2021（日本アレルギー学会）', 'GINA 2024'],
  ideal: (p) => [
    { a: 'o2', device: 'nc', flow: 3, when: 'spo2<92' },
    { a: 'rx', drugId: 'salbutamol', route: 'inh', dose: 2.5, freq: 'q4h', days: 2 },
    { a: 'rx', drugId: p.sev === 2 ? 'mpsl' : 'prednisolone', route: p.sev === 2 ? 'iv' : 'po', dose: p.sev === 2 ? 80 : 40, freq: 'q24h', days: 5 },
    { a: 'rx', drugId: 'adrenaline', route: 'im', dose: 0.3, freq: 'once', days: 1, when: 'sev2' },
    { a: 'test', ids: ['vbg'] },
  ],
};
