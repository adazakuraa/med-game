// 心室頻拍（持続性・単形性）
// 出典: 日本循環器学会/日本不整脈心電学会『2020年改訂版 不整脈薬物治療ガイドライン』, JRC蘇生ガイドライン2020
export default {
  id: 'vt', name: '心室頻拍', dept: '循環器内科',
  weight: 2, season: {}, minLevel: 3,
  demo: { age: [55, 85], ageMode: 'old', male: 0.75 },
  sev: { p: [0.45, 0.35, 0.2], burden: [[34, 44], [46, 56], [58, 68]] },
  refractoryP: [0, 0.03, 0.1],
  comorb: { extra: { htn: 0.6, dyslip: 0.5, dm2: 0.3, chf: 0.4 } },
  organisms: [],
  vars: (rng) => ({ hr: rng.int(160, 190), mi: rng.int(3, 10) }),
  cc: () => '動悸とふらつき', ccKey: 'palpitation',
  arrival: (sev) => (sev === 0 ? 'walk' : 'ambulance'),
  history: {
    onset: { p: 1, text: '1時間ほど前から、急に動悸がしてふらふらします。' },
    character: { p: 1, text: '脈がものすごく速いです。' },
    palpitation: { p: 1, text: '速い動悸が続いています。' },
    dizziness: { p: [0.6, 0.9, 1], text: '目の前が暗くなりそうです。' },
    chestpain: { p: 0.4, text: '胸が少し苦しいです。' },
    dyspnea: { p: [0.2, 0.5, 0.9], text: '息苦しいです。' },
    pmh: { p: 1, text: '{mi}年前に心筋梗塞でカテーテル治療を受けました。心臓の動きが弱いと言われています。' },
    trigger: { p: 0.2, text: '特に思い当たりません。' },
    weightloss: { p: 0, text: '' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['顔色がやや悪い。', '顔色不良で冷汗。', '意識がもうろうとして、冷汗。'] },
    heart_ausc: { p: 1, unlessProc: 'term', text: '規則正しい頻脈（約{hr}/分）。' },
    periph: { p: [0.2, 0.7, 1], unlessProc: 'term', text: '四肢冷感。' },
  },
  vitals: {},
  vitalHook: (enc, v) => (enc.state.procDone?.term ? v : { HR: enc.patient.vars.hr, SBP: v.SBP - [15, 35, 55][enc.patient.sev] }),
  labs: { K: { add: [-0.6, -0.2], k: 1 }, TNT: { to: [0.02, 0.06], k: 1 }, BNP: { to: [200, 800], k: 1 } },
  tests: { echo: [{ p: 1, persist: true, text: 'LVEF 約30%。前壁〜心尖部の壁運動消失（陳旧性心筋梗塞）。' }] },
  ecgRhythm: (enc, vit) => (enc.state.procDone?.term ? '洞調律。陳旧性前壁梗塞（V1〜V4で異常Q波）。' : `QRS幅の広い（約160ms）規則正しい頻拍（約${vit.HR}/分）。房室解離あり（心室頻拍）。`),
  natural: 0.5,
  curedBy: 'term',
  therapies: [{ id: 'term', label: '頻拍の停止（不安定なら同期電気ショック、安定ならアミオダロン静注）', req: { fn: (enc) => !!enc.state.procDone?.term }, required: true, deadlineH: [3, 2.5, 2] }],
  dynamics: (enc, eff) => {
    const st = enc.state;
    if (!st.procDone?.term && eff.tags.antiarrhythmic && enc.patient.sev === 0 && enc.patient.seed % 3 !== 0) { st.procDone = { ...(st.procDone || {}), term: enc.t }; st.burden = Math.min(st.burden, 18); }
    return 0;
  },
  procedures: [{
    id: 'term', depts: ['cardio', 'icu'], label: '同期電気ショック', delay: 15, duration: 15, after: 'icu',
    decide: (enc, vit) => {
      const ecg = enc.tests.some((t) => t.id === 'ecg' && t.done);
      if (!ecg) return { accept: false, text: 'すぐに12誘導心電図をお願いします。' };
      return { accept: true, reveal: true, text: '陳旧性心筋梗塞に伴う心室頻拍です。鎮静下に同期電気ショックを行います（約15分後）。その後CCUで原因（虚血・電解質）を評価し、植込み型除細動器（ICD）を検討します。' };
    },
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 18); },
    doneText: '循環器内科：同期電気ショックで洞調律に戻りました。CCUで管理します。',
  }],
  harmTags: { rate_ccb: '心室頻拍（wide QRS頻拍）にCa拮抗薬（血圧低下・心停止の危険）', svt_terminate: 'wide QRS頻拍にATP（効果がなく、悪化させることがある）' },
  dispo: () => ({ ok: ['icu'], best: 'icu', why: '持続性心室頻拍：CCU/ICUで管理（原因検索・ICDの検討）' }),
  useful: ['ecg', 'chem', 'cbc', 'vbg', 'tnt', 'echo', 'bnp', 'cxr', 'coag', 'lab_K'],
  key: [['ecg'], ['chem', 'vbg', 'lab_K']],
  extrasOk: () => ['acs', 'adhf'],
  teaching: [
    'QRS幅の広い（0.12秒以上）規則正しい頻拍は、まず心室頻拍として扱う。特に心筋梗塞の既往・心機能低下があればほぼ心室頻拍。',
    '脈がなければ心停止として心肺蘇生と除細動。血圧低下・意識障害・胸痛・心不全など不安定なら同期電気ショック。',
    '安定していればアミオダロン静注も選択肢。Ca拮抗薬（ベラパミル・ジルチアゼム）は禁忌。',
    '原因（虚血・低K・低Mg・QT延長薬）を検索し、再発予防に植込み型除細動器（ICD）を検討する。',
  ],
  sources: ['2020年改訂版 不整脈薬物治療ガイドライン（日本循環器学会/日本不整脈心電学会）', 'JRC蘇生ガイドライン2020'],
  ideal: () => [
    { a: 'test', ids: ['ecg', 'chem', 'vbg', 'cbc', 'tnt'] },
    { a: 'rx', drugId: 'amiodarone', route: 'iv', dose: 125, freq: 'once', days: 1, when: 'sev0' },
    { a: 'consult', dept: 'cardio', delayMin: 5 },
  ],
};
