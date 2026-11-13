// 外傷性血気胸（肋骨骨折に伴う）
// 出典: 外傷初期診療ガイドライン JATEC（日本外傷学会）
export default {
  id: 'hemothorax', name: '外傷性血気胸', dept: '呼吸器外科',
  weight: 1.5, season: {}, minLevel: 2,
  demo: { age: [30, 85], ageMode: 'uniform', male: 0.75 },
  sev: { p: [0.35, 0.45, 0.2], burden: [[28, 36], [40, 50], [58, 68]] },
  refractoryP: [0, 0, 0], comorb: { extra: {} }, organisms: [], noPregnancy: true,
  vars: (rng) => ({ side: rng.pick(['右', '左']), how: rng.pick(['脚立から落ちて', 'バイクで転倒して', '階段から転げ落ちて']) }),
  cc: (v) => `${v.how}胸を打ち、息が苦しい`, ccKey: 'injury',
  arrival: () => 'ambulance',
  history: {
    onset: { p: 1, text: '1時間前、{how}{side}胸を強く打ちました。' },
    character: { p: 1, text: '息を吸うと{side}胸が痛くて、だんだん息苦しくなってきました。' },
    location: { p: 1, text: '{side}の胸の横です。' },
    aggravating: { p: 1, text: '深呼吸や咳で強く痛みます。' },
    trigger: { p: 1, text: '{how}、{side}胸を打ちました。頭は打っていません。' },
    syncope: { p: 0, text: '気は失っていません。' }, pmh: { p: 0, text: '特にありません。' }, meds: { p: 0, text: '飲んでいません。' },
  },
  exam: { chest_palp: { p: 1, text: '{side}側胸部の肋骨に強い圧痛と轢音、皮下気腫を触れる。' }, lung_ausc: { p: 1, text: '{side}の呼吸音が減弱。' }, chest_perc: { p: 1, text: '{side}下肺野で濁音。' }, chest_insp: { p: 1, text: '{side}胸郭の動きが小さい。動揺胸郭はない。' }, trachea: { p: 0.4, text: '気管の偏位は明らかでない。' } },
  vitals: { HR: { to: [110, 130], k: 1 }, SBP: { to: [82, 98], k: 1.5 }, RR: { to: [24, 32], k: 1 }, SpO2: { drop: [5, 12], k: 1.5 } },
  labs: { HB: { add: [-3, -1], k: 1 }, LAC: { to: [2, 4], k: 2 } },
  tests: {
    cxr: [{ p: 1, persist: true, unlessDrain: true, text: '{side}第6〜8肋骨骨折、{side}肺の虚脱（気胸）と肋骨横隔膜角の鈍化・下肺野の透過性低下（血胸）。' }],
    chest_ct: [{ p: 1, persist: true, unlessDrain: true, text: '{side}多発肋骨骨折、{side}血気胸（中等量の血胸と気胸）。' }],
    abd_us: [{ p: 1, text: 'FAST：{side}胸腔に液体貯留。腹腔内・心嚢に液体なし。' }],
  },
  ecg: [],
  natural: 0,
  therapies: [
    { id: 'drain', label: '患側の胸腔ドレナージ（太めのチューブ）', req: { fn: (enc) => !!enc.state.drains?.[enc.patient.vars.side] }, required: true, deadlineH: [6, 2, 0.5] },
    { id: 'o2', label: '酸素投与（SpO2<90%）', req: { o2: true }, when: (c) => c.rawSpO2 < 90, required: true, deadlineH: [0.5, 0.5, 0.25] },
    { id: 'pain', label: '鎮痛（肋骨骨折の痛みで呼吸が浅くなる）', req: { anyTag: ['analgesic', 'opioid'] }, required: true, deadlineH: [2, 2, 1] },
  ],
  dynamics: (enc) => {
    const st = enc.state, p = enc.patient;
    const drained = st.drains?.[p.vars.side] != null && enc.t >= st.drains[p.vars.side];
    if (drained) return -2.5;
    return [0.15, 0.5, 1.6][p.sev];
  },
  dispo: (enc) => (enc.patient.sev === 2 ? { ok: ['icu'], best: 'icu', why: '出血の多い血気胸：ICUで排液量を監視（多ければ開胸止血）' } : { ok: ['admit', 'icu'], best: 'admit', why: '血気胸：ドレーン管理で入院' }),
  useful: ['cxr', 'chest_ct', 'abd_us', 'cbc', 'chem', 'coag', 'vbg', 'ecg'],
  key: [['cxr', 'chest_ct']],
  extrasOk: () => ['rib_fx', 'ptx'],
  teaching: [
    '胸部打撲後の呼吸困難・呼吸音減弱・濁音・皮下気腫 → 血気胸。肋骨骨折の数と部位、動揺胸郭も確認。',
    'X線・FASTで診断し、太めのチューブで胸腔ドレナージ。緊張性気胸なら画像を待たずに脱気。',
    'ドレナージ直後に1000mL以上、または毎時200mL以上の出血が続けば開胸止血。',
    '高齢者の多発肋骨骨折は痛みで呼吸が浅くなり肺炎を起こしやすい。十分な鎮痛を。',
  ],
  sources: ['外傷初期診療ガイドライン JATEC（日本外傷学会）'],
  ideal: (p) => [{ a: 'test', ids: ['cxr', 'abd_us', 'cbc', 'chem', 'coag'] }, { a: 'o2', device: 'mask', flow: 6, when: 'spo2<92' }, { a: 'proc', id: p.vars.side === '右' ? 'drain_R' : 'drain_L' }, { a: 'rx', drugId: 'apap_iv', route: 'iv', dose: 1000, freq: 'q6h', days: 5 }],
};
