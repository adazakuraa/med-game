// 頻脈性心房細動
// 出典: 日本循環器学会/日本不整脈心電学会『2020年改訂版 不整脈薬物治療ガイドライン』『2024年 JCS/JHRS ガイドライン フォーカスアップデート版 不整脈治療』
export default {
  id: 'af_rvr', name: '頻脈性心房細動', dept: '循環器内科',
  weight: 5, season: {}, minLevel: 2,
  demo: { age: [55, 90], ageMode: 'old', male: 0.55 },
  sev: { p: [0.45, 0.4, 0.15], burden: [[22, 32], [35, 48], [55, 66]] },
  refractoryP: [0, 0, 0.05],
  comorb: { extra: { htn: 0.65, dm2: 0.25, dyslip: 0.3, ckd: 0.12, chf: 0.12 } },
  organisms: [],
  untreatedFatal: false,
  vars: (rng) => ({ hours: rng.int(2, 24), trig: rng.pick(['昨晩、忘年会でたくさんお酒を飲みました。', '最近仕事が忙しく、寝不足が続いていました。', '特に思い当たりません。']) }),
  cc: () => '動悸',
  ccKey: 'palpitation',
  arrival: (sev) => (sev === 2 ? 'ambulance' : 'walk'),
  history: {
    onset: { p: 1, text: '{hours}時間ほど前から、急に胸がドキドキし始めました。' },
    course: { p: 1, text: 'ずっと続いていて、治まりません。' },
    character: { p: 1, text: '脈がバラバラに速く打っている感じです。' },
    palpitation: { p: 1, text: '脈が速くて、リズムもバラバラです。' },
    dyspnea: { p: [0.3, 0.6, 0.9], text: '少し息が切れます。' },
    dizziness: { p: [0.1, 0.3, 0.8], text: '少しふらつきます。' },
    chestpain: { p: 0.15, text: '胸が少し重い感じがします。' },
    trigger: { p: 1, text: '{trig}' },
    weightloss: { p: 0.05, text: 'いいえ。' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['動悸を気にしているが、全身状態は良好。', 'やや息苦しそう。', '顔色不良で冷汗あり。'] },
    lung_ausc: { p: [0, 0.2, 0.7], text: '両側下肺野でfine crackles。' },
    periph: { p: [0, 0.1, 0.8], text: '四肢冷感。' },
  },
  vitals: { HR: { to: [150, 175], k: 0.5 }, SBP: { to: [70, 85], k: 3 }, RR: { to: [20, 28], k: 1 }, SpO2: { drop: [2, 10], k: 2 } },
  labs: { BNP: { to: [150, 600], k: 1 } },
  tests: {
    echo: [{ p: 1, persist: true, text: 'LVEF 約55%。左房拡大（左房径 45mm）。明らかな弁膜症なし。' }],
    cxr: [{ p: [0, 0.2, 0.6], text: '軽度の肺うっ血。' }],
  },
  ecg: [],
  natural: 0.1,
  curedBy: 'dcv',
  therapies: [
    { id: 'rate', label: '心拍数調節（β遮断薬・ジルチアゼムなど）', req: { anyTag: ['betablocker', 'rate_ccb'] }, effect: -2.0, lagH: 0.2, required: (enc) => enc.initVit.SBP >= 90, deadlineH: [3, 2, 1] },
    { id: 'anticoag', label: '抗凝固療法（CHA2DS2-VAScスコアに応じて）', req: { anyTag: ['anticoag'] }, required: (enc) => enc.patient.age >= 65 || enc.patient.comorb.some((c) => ['htn', 'dm2', 'chf'].includes(c)), deadlineH: [48, 48, 48] },
    { id: 'dcv', label: '血行動態が不安定：循環器内科コンサルト→電気的除細動', req: { procDone: 'dcv' }, required: (enc) => enc.initVit.SBP < 90, deadlineH: [2, 2, 1] },
  ],
  procedures: [{
    id: 'dcv', depts: ['cardio', 'icu'], label: '電気的除細動', delay: 20, duration: 20, after: 'icu',
    decide: (enc, vit) => {
      const ecg = enc.tests.some((t) => t.id === 'ecg' && t.done);
      if (!ecg) return { accept: false, text: 'まず12誘導心電図を見せてください。' };
      if (vit.SBP < 90) return { accept: true, reveal: true, text: '血行動態が不安定な頻脈性心房細動です。鎮静下に電気的除細動を行います（約20分後）。' };
      return { accept: false, reveal: true, text: '頻脈性心房細動ですが血圧は保たれています。β遮断薬などで心拍数を調節し、CHA2DS2-VAScスコアに応じて抗凝固薬を開始してください。発症48時間以上（不明）なら除細動の前に抗凝固が必要です。' };
    },
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 15); },
    doneText: '循環器内科：電気的除細動で洞調律に戻りました。抗凝固療法を開始してください。',
  }],
  dispo: (enc, ctx) => (ctx.initVit.SBP < 90 ? { ok: ['icu'], best: 'icu', why: '血行動態不安定：ICU（CCU）' } : enc.patient.sev === 0 ? { ok: ['home', 'admit'], best: 'home', why: '心拍数が調節でき症状が改善すれば外来（抗凝固と内服の心拍数調節）' } : { ok: ['admit'], best: 'admit', why: '心不全徴候・症状が強い：入院' }),
  useful: ['ecg', 'cbc', 'chem', 'bnp', 'tnt', 'echo', 'cxr', 'coag', 'vbg'],
  key: [['ecg'], ['chem']],
  extrasOk: (enc) => (enc.patient.sev === 2 ? ['adhf'] : []),
  teaching: [
    '動悸では12誘導心電図が最重要。RR間隔が不規則でP波がなければ心房細動。',
    '血圧低下・意識障害・心不全など不安定なら電気的除細動。安定していれば心拍数調節（β遮断薬、心機能が保たれていればジルチアゼムなど）。',
    'CHA2DS2-VAScスコア（心不全・高血圧・年齢・糖尿病・脳梗塞既往・血管疾患・性別）で脳梗塞のリスクを評価し、抗凝固薬（DOAC）を検討する。',
    '発症48時間以上（または不明）の心房細動を除細動すると、左房の血栓が飛んで脳梗塞を起こしうる（事前に抗凝固）。',
    '誘因（飲酒・感染・甲状腺機能亢進症・心不全・脱水）を探す。',
  ],
  sources: ['2020年改訂版 不整脈薬物治療ガイドライン（日本循環器学会/日本不整脈心電学会）', '各薬剤 添付文書'],
  ideal: (p) => [
    { a: 'test', ids: ['ecg', 'cbc', 'chem', 'echo'] },
    { a: 'rx', drugId: 'landiolol', route: 'iv', dose: 3, freq: 'cont', days: 2, when: 'sbp>=100' },
    { a: 'rx', drugId: 'apixaban', route: 'po', dose: 5, freq: 'q12h', days: 14 },
    { a: 'rx', drugId: 'bisoprolol', route: 'po', dose: 2.5, freq: 'q24h', days: 14, when: 'sbp>=100' },
    { a: 'consult', dept: 'cardio', delayMin: 10, when: 'shock' },
  ],
};
