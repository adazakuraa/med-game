// 脱水症（高齢者の摂取不良・夏季）
// 出典: 日本救急医学会『熱中症診療ガイドライン2015』, 日本老年医学会『高齢者の安全な薬物療法ガイドライン2015』
export default {
  id: 'dehydration', name: '脱水症', dept: '内科',
  weight: 5, season: { summer: 1.8, winter: 0.8 }, minLevel: 1,
  demo: { age: [70, 95], ageMode: 'old', male: 0.4 },
  sev: { p: [0.4, 0.45, 0.15], burden: [[22, 30], [32, 44], [48, 60]] },
  refractoryP: [0, 0, 0],
  comorb: { extra: { htn: 0.6, dementia: 0.35, ckd: 0.2, dm2: 0.2 } },
  organisms: [],
  untreatedFatal: false,
  noPregnancy: true,
  vars: (rng, sev, pt) => {
    const diur = rng.chance(0.5);
    if (diur) pt.homeMeds.push('thiazide');
    return { diur, days: rng.int(3, 7) };
  },
  cc: () => '数日前から元気がなく食べない',
  ccKey: 'elderly_decline',
  arrival: (sev) => (sev === 2 ? 'ambulance' : 'walk'),
  initVolume: [[900, 1300], [1400, 2000], [2100, 2800]],
  history: {
    onset: { p: 1, text: '（家族）{days}日前から食事も水分もあまりとらなくなりました。' },
    lastnormal: { p: 1, text: '（家族）1週間前までは、いつも通り自分で歩いていました。' },
    course: { p: 1, bySev: ['（家族）少しぼんやりしています。', '（家族）ぐったりして、ほとんど寝ています。', '（家族）呼びかけへの反応が鈍いです。'] },
    character: { p: 1, text: '（家族）暑い部屋でエアコンをつけずに過ごしていたようです。' },
    anorexia: { p: 1, text: '（家族）ほとんど食べていません。水もあまり飲みません。' },
    dizziness: { p: 0.7, text: '立つとふらふらします。' },
    polyuria: { p: 0.8, text: '（家族）おしっこの回数が減って、色が濃いです。' },
    fever: { p: 0.2, text: '（家族）微熱っぽいときがありました。' },
    cough: { p: 0, text: '' },
    dysuria: { p: 0, text: '' },
    meds: { p: 1, ifVar: 'diur', text: '（家族）血圧の薬と、むくみの利尿薬を飲んでいます。' },
    adl: { p: 1, text: '（家族）普段は杖で歩けて、身の回りのことは自分でできます。' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['元気がなく、ぼんやりしている。', 'ぐったりしている。', '傾眠傾向。'] },
    oral_mucosa: { p: 1, text: '口腔粘膜・舌が乾燥している。' },
    skin_turgor: { p: 0.8, text: '皮膚ツルゴールの低下（つまんだ皮膚がなかなか戻らない）。腋窩の乾燥。' },
  },
  vitals: { HR: { to: [100, 115], k: 1 }, T: { to: [37.2, 37.6], k: 1 } },
  labs: { BUN: { add: [20, 50], k: 0.8 }, CR: { add: [0.4, 1.5], k: 1 }, NA: { add: [2, 10], k: 1 }, U_KET: { to: [1, 2], k: 0.5 } },
  tests: { abd_us: [{ p: 0.7, text: '下大静脈は虚脱（径 約6mm、呼吸性変動が大きい）。膀胱内の尿は少量。水腎症なし。' }] },
  fluidLoss: (b) => 15 * (b / 40),
  natural: 0,
  dynamics: (enc) => (enc.state.volume > 1000 ? 0.3 : enc.state.volume > 400 ? -0.6 : -1.5),
  therapies: [
    { id: 'fluid', label: '細胞外液による補液', req: { fluidTotal: 1000 }, when: (c) => c.state.volume > 800, required: true, deadlineH: [6, 3, 2], startFromNeed: true },
  ],
  dispo: (enc) => (enc.patient.sev === 0 ? { ok: ['home', 'admit'], best: 'home', why: '軽い脱水：補液で改善し、水分摂取ができれば帰宅（家族に環境調整・水分摂取を指導）' } : { ok: ['admit'], best: 'admit', why: '中等度以上の脱水・腎機能悪化：入院で補液' }),
  useful: ['cbc', 'chem', 'ua', 'bs_poct', 'crp', 'cxr', 'ecg', 'abd_us', 'vbg'],
  key: [['chem']],
  extrasOk: () => ['aki'],
  teaching: [
    '高齢者は喉の渇きを感じにくく、暑さ・食欲低下・利尿薬で容易に脱水になる。「元気がない」「食べない」の原因として多い。',
    '口腔・腋窩の乾燥、皮膚ツルゴール低下、頻脈、BUN/Cr比の上昇（20以上）、尿比重上昇が手がかり。エコーで下大静脈の虚脱。',
    '治療は細胞外液の補液。高Na血症があれば急激に下げないよう注意する。',
    '脱水の原因（感染症・熱中症・薬剤・嚥下障害・認知症など）を必ず探す。利尿薬の見直しも。',
  ],
  sources: ['熱中症診療ガイドライン2015（日本救急医学会）', '高齢者の安全な薬物療法ガイドライン2015（日本老年医学会）'],
  ideal: () => [
    { a: 'test', ids: ['bs_poct', 'cbc', 'chem', 'ua', 'crp'] },
    { a: 'fluid', fluidId: 'lr', mode: 'bolus', volume: 1000 },
    { a: 'fluid', fluidId: 'lr', mode: 'bolus', volume: 1000, when: 'vol>1500' },
    { a: 'wait', min: 120 },
    { a: 'fluid', fluidId: 'lr', mode: 'bolus', volume: 500, when: 'vol>1500' },
  ],
};
