// 破傷風
// 出典: 国立感染症研究所 IDWR「破傷風」, JAID/JSC感染症治療ガイド2023
export default {
  id: 'tetanus_dz', name: '破傷風', dept: '救急科',
  weight: 0.8, season: { summer: 1.3, autumn: 1.3 }, minLevel: 3,
  demo: { age: [60, 88], ageMode: 'old', male: 0.6 },
  sev: { p: [0.3, 0.45, 0.25], burden: [[34, 42], [44, 54], [58, 68]] },
  refractoryP: [0, 0.05, 0.1], comorb: { extra: {} }, organisms: ['anaerobe'], minAbxDays: 7,
  vars: (rng) => ({ wound: rng.pick(['畑仕事中に錆びたくぎを踏み抜いた', '庭木の剪定中にとげが刺さった', '土の上で転んで膝をすりむいた']) }),
  cc: () => '口が開きにくく、しゃべりにくい', ccKey: 'oral',
  arrival: () => 'walk',
  history: {
    onset: { p: 1, text: '2日前から口が開けにくくなり、今日はご飯が食べにくいです。首や背中もこわばります。' },
    character: { p: 1, text: '顎がこわばって指1本くらいしか口が開きません。痛みはあまりありません。' },
    location: { p: 1, text: '顎と首、背中です。' },
    trigger: { p: 1, text: '10日前に{wound}けれど、たいしたことないと思って放っておきました。' },
    pmh: { p: 0, text: '破傷風の予防接種を受けた覚えはありません。' },
    fever: { p: 0, text: '熱はありません。' }, sorethroat: { p: 0, text: '喉の痛みはありません。' },
    dysphagia: { p: 0.6, text: '飲み込みにくいです。' }, meds: { p: 0, text: '薬は飲んでいません（吐き気止めや精神科の薬も）。' },
  },
  exam: { oral_mucosa: { p: 1, text: '開口障害（開口は1横指）。歯・歯肉に炎症なし。' }, facial: { p: 1, text: '額にしわを寄せ、口角が横に引かれる痙笑。' }, neck_stiff: { p: 1, text: '頸部・背部の筋の硬直（項部硬直様）。' }, skin: { p: 1, text: '足底（下肢）に小さな刺創、軽い発赤のみ。' }, gen_consc: { p: 1, text: '意識清明。' } },
  vitals: { HR: { to: [100, 125], k: 1.5 }, SBP: { to: [150, 175], k: 1.5 }, T: { to: [37.4, 38.2], k: 2 } },
  labs: { CK: { add: [100, 800], k: 1 } },
  tests: { head_ct: [{ p: 1, text: '頭蓋内に異常なし。', normal: true }], lp: [{ p: 1, text: '髄液に異常なし。', normal: true }] },
  natural: 0.4,
  therapies: [
    { id: 'tig', label: '抗破傷風人免疫グロブリン（毒素の中和）', req: { tag: 'tig' }, effect: -0.6, lagH: 6, required: true, deadlineH: [12, 6, 4] },
    T_abx(),
    { id: 'benzo', label: '鎮静（ジアゼパムなど）で筋けいれんを抑え、刺激を避けた個室・ICUで管理', req: { tag: 'benzo' }, effect: -0.2, lagH: 0.5, required: true, deadlineH: [12, 6, 2] },
  ],
  dispo: (enc) => (enc.patient.sev === 0 ? { ok: ['admit', 'icu'], best: 'admit', why: '破傷風：入院（けいれん・呼吸障害・自律神経障害が数日で出現しうる）' } : { ok: ['icu'], best: 'icu', why: '全身型破傷風：ICUで鎮静・気道管理' }),
  useful: ['cbc', 'chem', 'crp', 'head_ct', 'vbg', 'ecg', 'lp'],
  key: [['chem', 'cbc']],
  extrasOk: () => [],
  teaching: [
    '高齢者の開口障害（牙関緊閉）・痙笑・項部や背部の硬直で、数日〜数週前の小さな傷（土・錆びたくぎ）があれば破傷風。傷が治っていることも多い。',
    '意識は保たれ、刺激でけいれん（後弓反張）・喉頭けいれんが起こる。自律神経障害（頻脈・高血圧の変動）も危険。',
    '治療は抗破傷風人免疫グロブリン、創の処置、メトロニダゾール、鎮静と刺激の遮断、呼吸管理。発症しても免疫はできないのでトキソイドも接種する。',
    '高齢者は予防接種を受けていないことが多い。汚染創ではトキソイド（±免疫グロブリン）で予防する。',
  ],
  sources: ['国立感染症研究所「破傷風とは」', 'JAID/JSC感染症治療ガイド2023'],
  ideal: () => [{ a: 'test', ids: ['cbc', 'chem', 'crp', 'vbg', 'ecg'] }, { a: 'rx', drugId: 'tig', route: 'iv', dose: 3000, freq: 'once', days: 1 }, { a: 'rx', drugId: 'mnz_iv', route: 'iv', dose: 500, freq: 'q8h', days: 7 }, { a: 'rx', drugId: 'diazepam', route: 'po', dose: 5, freq: 'q8h', days: 5 }, { a: 'rx', drugId: 'tetanus', route: 'im', dose: 0.5, freq: 'once', days: 1 }],
};
function T_abx() { return { id: 'abx', label: '抗菌薬（メトロニダゾール）と創の処置', req: { coverage: ['anaerobe'] }, effect: -0.2, lagH: 6, required: true, deadlineH: [24, 12, 6] }; }
