// 急性肺血栓塞栓症
// 出典: 日本循環器学会ほか『肺血栓塞栓症および深部静脈血栓症の診断、治療、予防に関するガイドライン（2017年改訂版）』, 各薬剤添付文書
export default {
  id: 'pe', name: '急性肺血栓塞栓症', dept: '循環器内科',
  weight: 3, season: {}, minLevel: 2,
  demo: { age: [25, 85], ageMode: 'uniform', male: 0.4 },
  sev: { p: [0.35, 0.45, 0.2], burden: [[25, 35], [40, 55], [62, 74]] },
  refractoryP: [0, 0.02, 0.1],
  comorb: { extra: { htn: 0.3, dyslip: 0.2, cancer: 0.15, dm2: 0.1 } },
  organisms: [],
  vars: (rng, sev, pt) => {
    let risk = rng.pick(['postop', 'flight', 'bedrest']);
    if (pt.comorb.includes('cancer')) risk = 'cancer';
    else if (pt.sex === 'F' && pt.age < 50 && rng.chance(0.6)) risk = 'ocp';
    if (risk === 'ocp') pt.homeMeds.push('ocp');
    const riskText = {
      postop: '2週間前に膝の手術を受けて、あまり歩いていませんでした。',
      flight: '3日前に海外から12時間の飛行機で帰ってきたばかりです。',
      bedrest: '腰を痛めて、この1週間ほとんど寝たきりでした。',
      cancer: '大腸がんで抗がん剤の治療中です。最近は家で横になっていることが多いです。',
      ocp: '特に手術はしていません。避妊のためにピルを飲んでいます。',
    }[risk];
    const dvt = rng.chance(0.55);
    const legSide = rng.pick(['右', '左']);
    const ecgText = '洞性頻脈。' + (rng.chance(0.25) ? 'SⅠQⅢTⅢパターン。' : '') + (sev >= 1 && rng.chance(0.5) ? 'V1〜V3で陰性T波（右室負荷）。' : '');
    return { risk, riskText, dvt, legSide, ecgText, onsetH: rng.int(2, 12) };
  },
  cc: () => '胸痛と息苦しさ',
  ccKey: 'chest_pain',
  arrival: (sev) => (sev === 2 ? 'ambulance' : 'walk'),
  history: {
    onset: { p: 1, text: '{onsetH}時間ほど前、急に息が苦しくなりました。' },
    course: { p: 1, bySev: ['息苦しさが続いています。', '息苦しさがだんだん強くなっています。', '息ができなくて、一瞬気を失いかけました。'] },
    character: { p: 1, text: '息が吸いにくい感じがして、深呼吸すると胸が痛みます。' },
    location: { p: 1, text: '右の胸の下のほうです。' },
    chestpain: { p: 0.65, text: '息を吸うと右の胸がズキッと痛みます。' },
    aggravating: { p: 0.6, text: '深呼吸や咳をすると胸の痛みが強くなります。' },
    dyspnea: { p: 1, bySev: ['少し動くと息が切れます。', 'じっとしていても息苦しいです。', '息ができません。'] },
    palpitation: { p: 0.5, text: '動悸がします。' },
    dizziness: { p: [0.05, 0.3, 0.8], text: '一瞬気が遠くなりました。' },
    sputum: { p: 0.1, text: '少し血の混じった痰が出ました。' },
    cough: { p: 0.25, text: '少し咳が出ます。' },
    edema: { p: 1, ifVar: 'dvt', text: '{legSide}足だけ腫れて、ふくらはぎが痛いです。' },
    immobility: { p: 1, text: '{riskText}' },
    trigger: { p: 0.6, text: '{riskText}' },
    fever: { p: 0.1, text: '37度台の微熱があります。' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['息苦しそう。', '呼吸が速く、不安そうな表情。', '顔色不良で呼吸促迫。'] },
    chest_insp: { p: [0.5, 0.8, 1], text: '頻呼吸。' },
    calf: { p: 0.9, ifVar: 'dvt', text: '{legSide}下腿の腫脹と圧痛（ふくらはぎの周径差 2cm以上）。' },
    leg_edema: { p: 0.8, ifVar: 'dvt', text: '{legSide}下腿のみ浮腫。' },
    heart_ausc: { p: [0.1, 0.3, 0.6], text: 'II音の肺動脈成分の亢進。' },
    jvd: { p: [0, 0.3, 0.85], text: '頸静脈怒張あり。' },
    periph: { p: [0, 0.1, 0.7], text: '四肢冷感。CRT 3秒以上。' },
  },
  vitals: { HR: { to: [112, 132], k: 0.8 }, RR: { to: [26, 34], k: 1 }, SpO2: { drop: [12, 20], k: 1.1 }, SBP: { to: [66, 80], k: 3 }, T: { to: [37.2, 37.8], k: 1 } },
  labs: {
    DDIMER: { to: [4, 25], k: 0.25 }, TNT: { add: [0.01, 0.08], k: 1.8 }, BNP: { to: [100, 900], k: 1.6 }, LAC: { to: [3, 6], k: 3 },
    WBC: { to: [9000, 12000], k: 1, p: 0.5 },
  },
  tests: {
    chest_cta: [{ p: 0.97, text: '両側肺動脈（右主肺動脈〜両下葉枝）に造影欠損（血栓）を認める。' }, { p: [0, 0.4, 0.95], text: '右室拡大（右室/左室径比 >1）。' }],
    cxr: [{ p: 0.2, text: '右肋骨横隔膜角のわずかな鈍化。肺野に明らかな浸潤影なし。' }],
    echo: [{ p: [0.15, 0.5, 0.95], text: '右室の拡大と心室中隔の扁平化（D-shape）。左室の動きは良好。' }],
    leg_us: [{ p: 0.9, ifVar: 'dvt', persist: true, text: '{legSide}膝窩静脈〜大腿静脈に血栓。圧迫しても潰れない。' }],
  },
  ecg: [{ p: 1, text: '{ecgText}' }],
  natural: 0.45,
  curedBy: null,
  therapies: [
    { id: 'anticoag', label: '抗凝固療法（ヘパリン静注→持続静注）', req: { tag: 'anticoag', min: 0.5 }, effect: -1.3, lagH: 1, required: true, deadlineH: [4, 2, 1] },
    { id: 'o2', label: '酸素投与（SpO2<90%）', req: { o2: true }, when: (c) => c.rawSpO2 < 90, required: true, deadlineH: [0.5, 0.5, 0.25] },
    { id: 'lysis', label: 'ショックを伴う広範型：血栓溶解療法（循環器内科/集中治療科）', req: { procDone: 'lysis' }, required: (enc) => enc.initVit.SBP < 90, deadlineH: [2, 2, 2] },
  ],
  procedures: [{
    id: 'lysis', depts: ['cardio', 'icu'], label: '血栓溶解療法', delay: 20, duration: 60, after: 'icu',
    decide: (enc, vit) => {
      const img = enc.tests.some((t) => ['chest_cta', 'echo'].includes(t.id) && t.done && t.result.abnormal);
      if (!img) return { accept: false, text: '肺塞栓症を疑うなら造影CT（不安定なら心エコー）で確認してください。疑いが強ければヘパリンを先に開始してください。' };
      if (vit.SBP < 90) return { accept: true, reveal: true, text: 'ショックを伴う広範型肺塞栓症です。血栓溶解療法を行い、ICUで管理します（約20分後に開始）。' };
      return { accept: false, reveal: true, text: '血圧は保たれているので、血栓溶解療法の適応はありません。ヘパリンによる抗凝固療法を続けてください。' };
    },
    onDone: (enc) => { enc.state.burden = Math.max(15, enc.state.burden - 30); },
    doneText: '循環器内科：血栓溶解療法を行い、血圧と酸素化が改善してきました。ヘパリンを継続してください。',
  }],
  dispo: (enc, ctx) => (ctx.initVit.SBP < 90 || enc.patient.sev === 2 ? { ok: ['icu'], best: 'icu', why: 'ショックを伴う広範型：ICU' } : enc.patient.sev === 1 ? { ok: ['icu', 'admit'], best: 'admit', why: '右心負荷を伴う亜広範型：入院（状態によりICU）' } : { ok: ['admit'], best: 'admit', why: '非広範型：入院して抗凝固療法' }),
  useful: ['ecg', 'tnt', 'lab_TNT', 'bnp', 'cbc', 'chem', 'coag', 'lab_DDIMER', 'cxr', 'chest_cta', 'echo', 'leg_us', 'vbg', 'uhcg'],
  key: [['chest_cta'], ['coag', 'lab_DDIMER'], ['ecg']],
  extrasOk: () => [],
  teaching: [
    '突然の呼吸困難・胸膜痛・頻脈・低酸素で、肺の聴診や胸部X線がほぼ正常なら肺塞栓症を疑う。',
    'リスク因子（手術後・長時間の移動・長期臥床・がん・経口避妊薬）と片側の下腿腫脹（深部静脈血栓）を必ず確認する。',
    '可能性が低ければDダイマー陰性で除外、高ければ造影CTで確定する。',
    '治療の基本はヘパリンによる抗凝固（80単位/kg静注→18単位/kg/時）。ショックを伴う広範型では血栓溶解療法を考える。',
  ],
  sources: ['肺血栓塞栓症および深部静脈血栓症の診断、治療、予防に関するガイドライン（2017年改訂版）', '各薬剤 添付文書'],
  ideal: (p) => [
    { a: 'test', ids: ['ecg', 'cbc', 'chem', 'coag', 'cxr', 'chest_cta'] },
    { a: 'o2', device: 'mask', flow: 6, when: 'spo2<92' },
    { a: 'rx', drugId: 'heparin_bolus', route: 'iv', dose: Math.round(p.weight * 80 / 100) * 100, freq: 'once', days: 1 },
    { a: 'rx', drugId: 'heparin', route: 'iv', dose: Math.round(p.weight * 18 / 10) * 10, freq: 'cont', days: 5 },
    { a: 'consult', dept: 'cardio', delayMin: 50, when: 'shock' },
  ],
};
