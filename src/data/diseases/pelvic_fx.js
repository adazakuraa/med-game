// 骨盤骨折（高齢者の恥骨・坐骨骨折、脆弱性骨折）
// 出典: 日本整形外科学会 資料, 骨粗鬆症の予防と治療ガイドライン2015
export default {
  id: 'pelvic_fx', name: '恥骨・坐骨骨折（高齢者の骨盤骨折）', dept: '整形外科',
  weight: 2.5, season: { winter: 1.2 }, minLevel: 1,
  demo: { age: [72, 95], ageMode: 'old', male: 0.2 },
  sev: { p: [0.5, 0.4, 0.1], burden: [[22, 30], [30, 38], [38, 46]] },
  refractoryP: [0, 0, 0], comorb: { extra: { htn: 0.5, dementia: 0.2 } }, organisms: [], untreatedFatal: false,
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '転んでから足の付け根が痛くて歩けない', ccKey: 'fall',
  arrival: () => 'ambulance',
  history: {
    onset: { p: 1, text: '昨日、家の中でしりもちをついてから、{side}の足の付け根が痛くなりました。' },
    character: { p: 1, text: '歩こうとすると痛くて、つかまり歩きがやっとです。' },
    location: { p: 1, text: '{side}の足の付け根から内ももです。' },
    trigger: { p: 1, text: 'スリッパで滑って、しりもちをつきました。頭は打っていません。' },
    dizziness: { p: 0, text: 'めまいや気を失ったことはありません。' },
    lastnormal: { p: 1, text: '転ぶ前は杖なしで歩けていました。' }, adl: { p: 1, text: '一人暮らしで、身の回りのことは自分でしていました。' },
    pmh: { p: 1, text: '骨粗鬆症と言われたことがあります。' }, meds: { p: 1, text: '血圧の薬を飲んでいます。' },
  },
  exam: { hip: { p: 1, text: '{side}恥骨部の圧痛。下肢の短縮・外旋はない。股関節の他動運動で軽い痛みはあるが動かせる。踵の叩打で鼠径部痛は軽度。' }, motor: { p: 1, text: '麻痺はない。' }, gen_consc: { p: 1, text: '意識清明。' }, skin: { p: 1, text: '殿部に皮下出血。' } },
  vitals: {},
  labs: {},
  tests: { hip_xr: [{ p: 1, persist: true, text: '{side}恥骨上枝・坐骨枝の骨折（転位はわずか）。大腿骨頸部・転子部に骨折なし。' }] },
  natural: 0,
  therapies: [
    T_pain(),
    { id: 'ortho', label: '整形外科コンサルト（保存療法：鎮痛と早期からの荷重・リハビリ）', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'ortho') }, effect: -0.4, lagH: 2, required: true, deadlineH: [12, 12, 12] },
  ],
  consult: { ortho: '整形外科：転位の少ない恥骨・坐骨骨折で、手術は不要です。痛みに応じて早くから荷重・歩行訓練を進めます。一人暮らしで歩けないので入院でリハビリを行い、骨粗鬆症の治療も始めましょう。' },
  dispo: () => ({ ok: ['admit', 'home'], best: 'admit', why: '高齢者の骨盤骨折で歩けない：入院で鎮痛とリハビリ（自宅で生活できる状態なら外来も可）' }),
  useful: ['hip_xr', 'cbc', 'chem', 'ecg', 'bs_poct', 'dexa'],
  key: [['hip_xr']],
  extrasOk: () => ['osteoporosis'],
  teaching: [
    '高齢者が転んで足の付け根が痛く歩けないとき、大腿骨近位部骨折がなくても恥骨・坐骨骨折（骨盤の脆弱性骨折）がある。',
    '下肢の短縮・外旋がなく、股関節は動かせることが多い。X線で恥骨枝を確認し、見えなければCT/MRIで不顕性骨折を探す。',
    '多くは保存療法で、鎮痛して早期に荷重・歩行訓練。寝たきり・肺炎・血栓症の予防が大切。骨粗鬆症の治療も。',
  ],
  sources: ['骨粗鬆症の予防と治療ガイドライン2015年版'],
  ideal: () => [{ a: 'test', ids: ['hip_xr', 'cbc', 'chem'] }, { a: 'rx', drugId: 'apap_po', route: 'po', dose: 500, freq: 'q6h', days: 7 }, { a: 'consult', dept: 'ortho', delayMin: 20 }],
};
function T_pain() { return { id: 'pain', label: '鎮痛（アセトアミノフェンなど）', req: { anyTag: ['analgesic', 'opioid'] }, required: true, deadlineH: [2, 2, 2] }; }
