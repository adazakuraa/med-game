// アセトアミノフェン中毒（過量服薬）
// 出典: 日本中毒学会 資料, Rumack-Matthewノモグラム, Chiew AL, et al. Med J Aust 2020
export default {
  id: 'apap_od', name: 'アセトアミノフェン中毒', dept: '救急科',
  weight: 2, season: {}, minLevel: 3,
  demo: { age: [16, 40], ageMode: 'young', male: 0.3 },
  sev: { p: [0.35, 0.45, 0.2], burden: [[22, 30], [30, 40], [40, 50]] },
  refractoryP: [0, 0, 0],
  comorb: { extra: {} },
  organisms: [],
  vars: (rng, sev) => ({ hrs: rng.int(2, 5), tabs: [30, 50, 80][sev] }),
  cc: () => '市販の頭痛薬をたくさん飲んだ', ccKey: 'altered_mental',
  arrival: () => 'ambulance',
  history: {
    onset: { p: 1, text: '{hrs}時間前に、市販の頭痛薬（アセトアミノフェン）を{tabs}錠くらい飲みました。' },
    character: { p: 1, text: '今は少し気持ち悪いだけです。' },
    trigger: { p: 1, text: '仕事のことで落ち込んで、死にたいと思って飲みました。' },
    nausea: { p: 0.6, text: '少し吐き気があります。' },
    meds: { p: 1, text: 'ほかの薬やお酒は飲んでいません。' },
    mood: { p: 1, text: '最近ずっと気分が落ち込んでいました。' },
    pmh: { p: 0.4, text: '以前、心療内科に通っていました。' },
    lastnormal: { p: 1, text: '飲む前までは普通でした。' },
    alcohol: { p: 1, text: '今日はお酒を飲んでいません。' },
    fever: { p: 0, text: '' }, seizure: { p: 0, text: '' },
  },
  exam: { gen_consc: { p: 1, text: '意識清明。受け答えはしっかりしている。' }, gen_appear: { p: 1, text: '元気はないが、全身状態は良好に見える。' }, abd_palp: { p: 0.2, text: '右季肋部に軽い圧痛。' } },
  vitals: {},
  labs: { APAP: { to: [120, 300], k: 0 } },
  labHook: (enc, id, v) => {
    if (id === 'AST' || id === 'ALT') {
      const t = enc.patient.vars.hrs * 60 + enc.t;
      const nac = enc.thStart?.nac;
      const late = nac == null ? 1 : Math.max(0, Math.min(1, (nac + enc.patient.vars.hrs * 60 - 8 * 60) / (16 * 60)));
      const peak = [800, 3000, 8000][enc.patient.sev] * late;
      return v + (t > 24 * 60 ? peak * Math.min(1, (t - 24 * 60) / (24 * 60)) : 0);
    }
    return v;
  },
  tests: {},
  natural: 0.35,
  dynamics: (enc) => (enc.thStart?.nac != null && enc.t - enc.thStart.nac > 12 * 60 ? -0.8 : 0),
  therapies: [
    { id: 'nac', label: 'アセチルシステイン（NAC）：服用後8時間以内に開始', req: { tag: 'nac' }, required: true, deadlineH: [4, 3, 3], effect: -1.0, lagH: 1 },
    { id: 'psych', label: '自殺企図の評価：精神科へコンサルト', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'psych') }, required: true, deadlineH: [48, 48, 48] },
  ],
  consult: { psych: '精神科：うつ病エピソード中の自殺企図です。身体的な治療が終わるまで見守りを続け、その後の精神科での治療を調整します。' },
  dispo: () => ({ ok: ['admit', 'icu'], best: 'admit', why: 'アセトアミノフェン中毒：入院でNAC投与・肝機能の推移と精神科的評価' }),
  useful: ['apap', 'chem', 'coag', 'cbc', 'vbg', 'tox', 'bs_poct', 'uhcg', 'ecg'],
  key: [['apap'], ['chem'], ['coag']],
  extrasOk: () => ['intox', 'depression'],
  teaching: [
    'アセトアミノフェンの過量服薬（150mg/kg以上や7.5g以上）は、最初は症状が乏しくても1〜3日後に重い肝障害（劇症肝炎）を起こす。',
    '服用後4時間以降の血中濃度をノモグラムに当てはめて治療を判断。服用量が多い・時間不明なら濃度を待たずに開始。',
    '解毒薬はアセチルシステイン（NAC）。服用後8時間以内に始めれば肝障害をほぼ防げる（遅れても投与する）。',
    '自殺企図として精神科と連携し、安全を確保する。市販薬の複合剤も多いので成分を確認。',
  ],
  sources: ['日本中毒学会 資料', 'Chiew AL, et al. Updated guidelines for the management of paracetamol poisoning in Australia and New Zealand. Med J Aust 2020'],
  ideal: (p) => [
    { a: 'test', ids: ['apap', 'chem', 'coag', 'cbc', 'vbg', 'tox'] },
    { a: 'rx', drugId: 'nac', route: 'po', dose: 140, freq: 'once', days: 1 },
    { a: 'rx', drugId: 'nac', route: 'po', dose: 70, freq: 'q4h', days: 3 },
    { a: 'consult', dept: 'psych', delayMin: 30 },
  ],
};
