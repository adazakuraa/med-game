// 肺結核
// 出典: 日本結核・非結核性抗酸菌症学会『結核診療ガイド（改訂第4版）』, 感染症法（結核の届出・入院勧告）
export default {
  id: 'tb', name: '肺結核', dept: '呼吸器内科',
  weight: 2, season: {}, minLevel: 3,
  demo: { age: [25, 90], ageMode: 'old', male: 0.65 },
  sev: { p: [0.45, 0.45, 0.1], burden: [[22, 30], [30, 40], [42, 52]] },
  refractoryP: [0, 0, 0],
  comorb: { extra: { dm2: 0.3, ckd: 0.1 } },
  smokeP: 0.45,
  organisms: [],
  untreatedFatal: false,
  vars: (rng) => ({ wk: rng.int(3, 8), kg: rng.int(3, 7), side: rng.pick(['右', '左']), work: rng.pick(['介護施設の職員', '建設現場の作業員', '飲食店の店員']) }),
  cc: () => '咳と微熱が続く',
  ccKey: 'fever_cough',
  arrival: () => 'walk',
  history: {
    onset: { p: 1, text: '{wk}週間前から咳が続いています。かぜ薬を飲んでも治りません。' },
    course: { p: 1, text: '咳がだんだん増えて、夕方になると微熱が出ます。' },
    cough: { p: 1, text: '痰の絡む咳が続きます。時々、痰に血が混じります。' },
    sputum: { p: 1, text: '黄色い痰で、ときどき血が混じります。' },
    fever: { p: 0.9, text: '夕方に37度台後半の熱が出ます。' },
    weightloss: { p: 1, text: 'この2か月で{kg}kgやせました。' },
    nightsweat: { p: 0.8, text: '寝汗がひどくて、シーツが濡れるほどです。' },
    fatigue: { p: 0.8, text: 'だるいです。' },
    sickcontact: { p: 0.4, text: '祖父が昔、結核で入院していたと聞きました。' },
    pmh: { p: 0.3, text: '糖尿病で治療中です。' },
    occupation: { p: 1, text: '{work}です。' },
    chills: { p: 0.1, text: '寒気はあまりありません。' },
    myalgia: { p: 0, text: '' }, sorethroat: { p: 0, text: '' }, dyspnea: { p: [0, 0.3, 0.7], text: '少し息切れします。' },
  },
  exam: { gen_appear: { p: 1, text: 'やせていて、咳をしている。' }, lung_ausc: { p: 0.5, text: '{side}上肺野で軽度のcoarse crackles。' } },
  vitals: { T: { to: [37.4, 38.0], k: 1 } },
  labs: { CRP: { to: [2, 6], k: 1 }, ALB: { add: [-0.8, -0.3], k: 1 }, HB: { add: [-1.5, -0.5], k: 1 } },
  tests: {
    cxr: [{ p: 0.95, persist: true, text: '{side}上肺野（S1/S2）に空洞を伴う浸潤影と、周囲の散布性の粒状影。' }],
    chest_ct: [{ p: 1, persist: true, text: '{side}上葉に壁の厚い空洞と、周囲の小葉中心性粒状影（tree-in-bud）。' }],
    afb: [{ p: 1, persist: true, text: '抗酸菌塗抹陽性（2+）。結核菌PCR陽性。' }],
    igra: { p: 0.9 },
    sputum_gram: [{ p: 1, text: '有意な一般細菌を認めない。' }],
  },
  natural: 0.01,
  therapies: [
    { id: 'iso', label: '空気感染対策（N95マスク・陰圧個室）→呼吸器内科コンサルト・保健所への届出・結核病床への入院', req: { procDone: 'iso' }, required: true, deadlineH: [8, 8, 8] },
  ],
  procedures: [{
    id: 'iso', depts: ['resp'], label: '結核病床への入院', delay: 60, duration: 60, after: 'ward',
    decide: (enc) => {
      const afb = enc.tests.some((t) => t.id === 'afb' && t.done && t.result.abnormal);
      const img = enc.tests.some((t) => ['cxr', 'chest_ct'].includes(t.id) && t.done && t.result.abnormal);
      if (!img) return { accept: false, text: '胸部X線を撮りましたか？ まず画像をお願いします。' };
      if (!afb) return { accept: false, reveal: true, text: '上葉の空洞影で、肺結核を強く疑います。すぐにN95マスク・陰圧個室で隔離し、喀痰の抗酸菌検査（塗抹・PCR・培養）を3回お願いします。' };
      return { accept: true, reveal: true, text: '喀痰塗抹陽性の肺結核です。結核病床へ入院とし、保健所へ届け出ます。4剤（イソニアジド・リファンピシン・ピラジナミド・エタンブトール）で治療を開始し、接触者健診も行います。' };
    },
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 20); },
    doneText: '呼吸器内科：結核病床に入院し、4剤併用療法を開始しました。保健所に届け出ました。',
  }],
  curedBy: 'iso',
  minHoursToCure: 72,
  harmTags: { fq: '結核を否定せずにキノロン系抗菌薬（一時的に改善して診断が遅れ、耐性化を招く）' },
  dispo: () => ({ ok: ['admit'], best: 'admit', why: '喀痰塗抹陽性の肺結核：感染症法に基づき結核病床へ入院（陰圧個室）' }),
  useful: ['cxr', 'chest_ct', 'afb', 'igra', 'cbc', 'chem', 'crp', 'hba1c', 'sputum_gram', 'sputum_cx'],
  key: [['cxr'], ['afb']],
  extrasOk: () => [],
  teaching: [
    '2週間以上続く咳・痰（血痰）・微熱・寝汗・体重減少は肺結核を疑う。高齢者・糖尿病・免疫抑制・透析・結核の多い国の出身がリスク。',
    '疑ったら、検査の前からN95マスク（医療者）・サージカルマスク（患者）・陰圧個室で空気感染対策を。',
    '胸部X線で上肺野の空洞・散布影。喀痰の抗酸菌検査（塗抹・PCR・培養）を3回。IGRAは感染の有無を示すが活動性の判断はできない。',
    'キノロン系抗菌薬は結核にも効くため、安易に使うと一時的に良くなって診断が遅れ、耐性も招く。',
    '結核は感染症法の2類感染症：診断したら直ちに保健所へ届出。塗抹陽性なら結核病床へ入院し、4剤併用療法と接触者健診。',
  ],
  sources: ['結核診療ガイド 改訂第4版（日本結核・非結核性抗酸菌症学会）', '感染症法（2類感染症の届出）'],
  ideal: () => [
    { a: 'test', ids: ['cxr', 'afb', 'cbc', 'chem', 'crp'] },
    { a: 'wait', min: 120 },
    { a: 'consult', dept: 'resp', delayMin: 5 },
  ],
};
