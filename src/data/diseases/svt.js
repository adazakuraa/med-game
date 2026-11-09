// 発作性上室頻拍（PSVT）
// 出典: 日本循環器学会/日本不整脈心電学会『2020年改訂版 不整脈薬物治療ガイドライン』, 2019 ESC Guidelines for the management of supraventricular tachycardia, REVERT trial (Lancet 2015)
export default {
  id: 'svt', name: '発作性上室頻拍', dept: '循環器内科',
  weight: 3, season: {}, minLevel: 2,
  demo: { age: [20, 65], ageMode: 'uniform', male: 0.4 },
  sev: { p: [0.55, 0.4, 0.05], burden: [[20, 28], [28, 38], [45, 55]] },
  refractoryP: [0, 0, 0],
  comorb: { extra: {} },
  organisms: [],
  untreatedFatal: false,
  vars: (rng) => ({ mins: rng.pick([30, 60, 90, 120]), hr: rng.int(170, 200) }),
  cc: () => '突然の動悸',
  ccKey: 'palpitation',
  arrival: () => 'walk',
  history: {
    onset: { p: 1, text: '{mins}分ほど前、かがんだときに急に胸がドキドキし始めました。' },
    course: { p: 1, text: 'スイッチが入ったように急に始まって、ずっと続いています。' },
    character: { p: 1, text: '脈がものすごく速く、でも規則正しく打っています。' },
    palpitation: { p: 1, text: '脈がとても速いです。リズムは一定です。' },
    pmh: { p: 0.6, text: '以前にも何度か同じように急に始まって、急に止まる動悸がありました。' },
    dizziness: { p: [0.1, 0.3, 0.8], text: '少しふらっとします。' },
    dyspnea: { p: [0.1, 0.3, 0.7], text: '少し息苦しいです。' },
    chestpain: { p: 0.15, text: '胸が少し圧迫される感じがします。' },
    trigger: { p: 0.5, text: 'コーヒーをたくさん飲みました。' },
    weightloss: { p: 0, text: '' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['動悸を気にしているが、全身状態は良好。', 'やや不安そうで、胸を押さえている。', '顔色不良で冷汗。'] },
    heart_ausc: { p: 1, unlessProc: 'term', text: '規則正しい頻脈（約{hr}/分）。雑音なし。' },
  },
  vitals: {},
  vitalHook: (enc, v) => (enc.state.procDone?.term ? v : { HR: enc.patient.vars.hr, SBP: v.SBP - [5, 12, 40][enc.patient.sev] }),
  labs: {},
  tests: {},
  ecgRhythm: (enc, vit) => (enc.state.procDone?.term ? null : `QRS幅の狭い規則正しい頻拍（約${vit.HR}/分）。P波ははっきりしない（発作性上室頻拍）。`),
  natural: 0.05,
  curedBy: 'term',
  therapies: [
    { id: 'term', label: '頻拍の停止（迷走神経刺激→ATP急速静注。不安定なら電気的除細動）', req: { fn: (enc) => !!enc.state.procDone?.term }, required: true, deadlineH: [2, 2, 1] },
  ],
  dynamics: (enc, eff) => {
    const st = enc.state;
    if (!st.procDone?.term && (eff.tags.svt_terminate || eff.tags.rate_ccb)) {
      st.procDone = { ...(st.procDone || {}), term: enc.t };
      st.burden = Math.min(st.burden, 4);
    }
    return 0;
  },
  procedures: [{
    id: 'dcv', depts: ['cardio', 'icu'], label: '電気的除細動', delay: 20, duration: 20, after: 'er',
    decide: (enc, vit) => {
      const ecg = enc.tests.some((t) => t.id === 'ecg' && t.done);
      if (!ecg) return { accept: false, text: 'まず12誘導心電図を見せてください。' };
      if (vit.SBP < 90) return { accept: true, reveal: true, text: '血行動態が不安定な発作性上室頻拍です。鎮静下に同期電気ショックを行います（約20分後）。' };
      return { accept: false, reveal: true, text: '発作性上室頻拍ですね。血圧は保たれているので、まず修正Valsalva法、だめならATP 10mgを急速静注してください。止まらなければベラパミル・ジルチアゼムも選択肢です。' };
    },
    onDone: (enc) => { enc.state.procDone.term = enc.t; enc.state.burden = Math.min(enc.state.burden, 4); },
    doneText: '循環器内科：同期電気ショックで洞調律に戻りました。',
  }],
  dispo: () => ({ ok: ['home'], best: 'home', why: '発作性上室頻拍：停止して症状がなければ帰宅。繰り返すなら循環器内科でカテーテルアブレーションを相談' }),
  useful: ['ecg', 'chem', 'cbc', 'thyroid', 'tnt', 'echo'],
  key: [['ecg']],
  extrasOk: () => [],
  teaching: [
    '突然始まり突然止まる、規則正しい速い動悸は発作性上室頻拍（PSVT）を考える。12誘導心電図でQRS幅の狭い規則正しい頻拍（150〜250/分）、P波が見えにくい。',
    '血行動態が安定していれば、まず迷走神経刺激（修正Valsalva法：息こらえの直後に仰向けで足を挙げる）。',
    '止まらなければATP（アデノシン）10mgを急速静注（効かなければ20mg）。一瞬の胸部不快感や心停止感があることを先に説明する。喘息には禁忌。',
    '血圧低下・意識障害などがあれば同期電気ショック。繰り返す例はカテーテルアブレーションで根治できる。',
  ],
  sources: ['2020年改訂版 不整脈薬物治療ガイドライン（日本循環器学会/日本不整脈心電学会）', '2019 ESC Guidelines for the management of patients with supraventricular tachycardia', 'Appelboam A, et al. REVERT trial. Lancet 2015'],
  ideal: () => [
    { a: 'test', ids: ['ecg', 'chem'] },
    { a: 'proc', id: 'vagal' },
    { a: 'rx', drugId: 'atp', route: 'iv', dose: 10, freq: 'once', days: 1 },
  ],
};
