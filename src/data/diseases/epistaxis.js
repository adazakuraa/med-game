// 鼻出血（前方・キーゼルバッハ部位）
// 出典: 日本耳鼻咽喉科頭頸部外科学会 資料, AAO-HNS Clinical Practice Guideline: Nosebleed (Epistaxis) 2020
export default {
  id: 'epistaxis', name: '鼻出血', dept: '耳鼻咽喉科',
  weight: 4, season: { winter: 1.4 }, minLevel: 1,
  demo: { age: [50, 90], ageMode: 'old', male: 0.6 },
  sev: { p: [0.6, 0.35, 0.05], burden: [[16, 24], [24, 34], [36, 46]] },
  refractoryP: [0, 0, 0],
  comorb: { extra: { htn: 0.8, af: 0.25 } },
  organisms: [],
  untreatedFatal: false,
  vars: (rng, sev, pt) => ({ side: rng.pick(['右', '左']), mins: rng.int(30, 90) }),
  initHbLoss: (p) => [0, 0.5, 1.5][p.sev],
  cc: () => '鼻血が止まらない', ccKey: 'epistaxis',
  arrival: () => 'walk',
  history: {
    onset: { p: 1, text: '{mins}分前から{side}の鼻から血が出て止まりません。' },
    character: { p: 1, text: 'ティッシュを詰めても、すぐに染みてきます。' },
    trigger: { p: 0.6, text: '鼻をかんだ後からです。空気が乾燥していました。' },
    pmh: { p: 1, text: '高血圧で治療中です。' },
    meds: { p: 1, text: '血圧の薬を飲んでいます。' },
    dizziness: { p: [0, 0.3, 0.8], text: '少しふらっとします。' },
    nausea: { p: 0.3, text: '血を飲み込んで気持ち悪いです。' },
    bloodystool: { p: 0, text: '' },
  },
  exam: { nose: { p: 1, text: '{side}鼻中隔前方（キーゼルバッハ部位）から持続的な出血。' }, gen_appear: { p: 1, text: '鼻を押さえ、不安そう。' } },
  vitals: { SBP: { to: [170, 195], k: 0.3 } },
  labs: {},
  tests: {},
  natural: 0.05,
  therapies: [{ id: 'pack', label: '鼻翼の圧迫（10〜15分）→止まらなければガーゼタンポン', req: { fn: (enc) => !!enc.state.procs?.nasal_pack }, required: true, deadlineH: [1, 1, 0.5] }],
  dynamics: (enc) => {
    const st = enc.state;
    if (st.procs?.nasal_pack && enc.t >= st.procs.nasal_pack) return -3;
    if (enc.t > [3, 6, 10][enc.patient.sev] * 60) return -0.4; // 多くは自然に止まる
    st.hbLoss += [0.05, 0.12, 0.3][enc.patient.sev] / 6;
    return 0.1;
  },
  dispo: (enc) => (enc.patient.sev === 2 ? { ok: ['admit', 'home'], best: 'admit', why: '出血量が多い鼻出血：入院で観察・耳鼻咽喉科での止血' } : { ok: ['home'], best: 'home', why: '止血できれば帰宅（鼻をいじらない・強くかまない、再出血時の圧迫を指導）' }),
  useful: ['cbc', 'coag'],
  key: [],
  extrasOk: () => [],
  teaching: [
    '鼻出血の9割は鼻中隔前方のキーゼルバッハ部位から。まず座って前かがみにし、小鼻（鼻翼）を10〜15分しっかりつまんで圧迫する（上を向くと血を飲み込む）。',
    '止まらなければ血管収縮薬を浸したガーゼを詰める・焼灼。後方からの出血（高齢・高血圧・動脈硬化）は耳鼻咽喉科でバルーンや手術が必要なこともある。',
    '出血量が多い・抗凝固薬内服・繰り返す場合は血算・凝固を確認。高血圧は不安や痛みで上がっていることが多く、まず止血を優先する。',
  ],
  sources: ['AAO-HNS Clinical Practice Guideline: Nosebleed (Epistaxis) 2020'],
  ideal: (p) => [{ a: 'proc', id: 'nasal_pack' }, ...(p.sev >= 1 ? [{ a: 'test', ids: ['cbc', 'coag'] }] : [])],
};
