// 熱中症（III度：熱射病）
// 出典: 日本救急医学会『熱中症診療ガイドライン2015』『熱中症診療ガイドライン2024』
export default {
  id: 'heatstroke', name: '熱中症（重症）', dept: '救急科',
  weight: 5, season: { summer: 4, other: 0.15, winter: 0 }, minLevel: 1,
  demo: { age: [20, 92], ageMode: 'old', male: 0.55 },
  sev: { p: [0.4, 0.4, 0.2], burden: [[25, 35], [40, 55], [60, 72]] },
  refractoryP: [0, 0.02, 0.1],
  comorb: { extra: { htn: 0.4, dm2: 0.2, ckd: 0.1 } },
  organisms: [],
  vars: (rng, sev, pt) => ({ ctx: pt.age >= 65 ? '（家族）エアコンをつけずに部屋にいて、ぐったりしているのを見つけました。' : '炎天下で屋外の作業をしていて、気分が悪くなって倒れました。' }),
  cc: () => '暑い中で倒れた',
  ccKey: 'altered_mental',
  arrival: () => 'ambulance',
  initVolume: [[1500, 2500], [2500, 3500], [3000, 4500]],
  history: {
    onset: { p: 1, text: '{ctx}' },
    lastnormal: { p: 1, text: '今日の昼ごろまでは普段通りでした。' },
    character: { p: 1, text: '{ctx}' },
    trigger: { p: 1, text: '今日は猛暑日でした。水分はあまりとっていません。' },
    nausea: { p: 0.6, text: '吐き気があって、1回吐きました。' },
    headache: { p: 0.6, text: '頭がガンガンします。' },
    dizziness: { p: 0.8, text: 'めまいがしてふらふらします。' },
    myalgia: { p: 0.5, text: '足がつりました。' },
    sweating: { p: 0.3, text: '最初は汗をたくさんかいていましたが、今は出ていません。' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['ぐったりしている。皮膚は熱い。', '意識がもうろうとしている。皮膚は熱く乾燥。', '呼びかけへの反応が乏しい。全身が非常に熱い。'] },
    skin: { p: 1, text: '皮膚は熱く、乾燥している。' },
    oral_mucosa: { p: 1, text: '口腔粘膜は乾燥。' },
  },
  vitals: { T: { to: [40.5, 41.8], k: 0.25 }, HR: { to: [125, 145], k: 0.8 }, RR: { to: [24, 32], k: 1 }, SBP: { to: [70, 85], k: 2.5 } },
  labs: { CK: { add: [400, 5000], k: 1.2 }, CR: { add: [0.4, 1.5], k: 1.2 }, AST: { add: [30, 300], k: 1.5 }, ALT: { add: [20, 200], k: 1.5 }, LAC: { to: [3, 6], k: 2 }, PLT: { mul: [0.4, 0.8], k: 2 }, NA: { add: [2, 8], k: 1 }, DDIMER: { to: [3, 15], k: 1.5 } },
  tests: { head_ct: [] },
  natural: 0.6,
  therapies: [
    { id: 'cooling', label: '積極的な冷却（深部体温39℃以下を早く）', req: { fn: (enc) => !!enc.state.procs?.cooling }, required: true, deadlineH: [0.5, 0.5, 0.25] },
    { id: 'fluid', label: '細胞外液の補液', req: { fluidTotal: 1000 }, required: true, deadlineH: [1, 1, 1] },
  ],
  dynamics: (enc) => {
    const cooled = enc.state.procs?.cooling && enc.t >= enc.state.procs.cooling;
    return cooled ? -3.5 : 0;
  },
  harmTags: {},
  dispo: (enc) => (enc.patient.sev === 0 ? { ok: ['admit', 'home'], best: 'admit', why: 'II〜III度の熱中症：入院で補液と臓器障害の確認' } : { ok: ['icu', 'admit'], best: 'icu', why: 'III度（熱射病）：ICUで冷却と臓器障害の管理' }),
  useful: ['bs_poct', 'vbg', 'chem', 'cbc', 'coag', 'ua', 'ecg', 'head_ct', 'lab_CK', 'lab_CR'],
  key: [['chem', 'vbg'], ['cbc']],
  extrasOk: () => ['dehydration', 'aki'],
  teaching: [
    '高温環境での意識障害・高体温（深部体温40℃以上）は熱射病（III度熱中症）。死亡率が高い緊急疾患。',
    '最優先は積極的な冷却（冷水を噴霧して送風、氷嚢、冷却輸液など）。早く39℃以下に下げるほど予後がよい。',
    '解熱薬（アセトアミノフェン・NSAIDs）は熱中症の高体温には効かない。',
    '細胞外液で補液し、横紋筋融解（CK上昇）・急性腎障害・肝障害・DIC（血小板低下）を評価する。',
    '高齢者の屋内発症（エアコン不使用）が多い。予防指導（エアコン・水分と塩分）も重要。',
  ],
  sources: ['熱中症診療ガイドライン2024（日本救急医学会）'],
  ideal: (p) => [
    { a: 'proc', id: 'cooling' },
    { a: 'fluid', fluidId: 'lr', mode: 'bolus', volume: 1000 },
    { a: 'test', ids: ['bs_poct', 'vbg', 'chem', 'cbc', 'coag'] },
    { a: 'fluid', fluidId: 'lr', mode: 'cont', rate: 150 },
  ],
};
