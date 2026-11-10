// 一過性脳虚血発作（TIA）
// 出典: 日本脳卒中学会『脳卒中治療ガイドライン2021（改訂2023）』, AHA/ASA 2021 Secondary Stroke Prevention Guideline
export default {
  id: 'tia', name: '一過性脳虚血発作（TIA）', dept: '脳神経内科',
  weight: 4, season: {}, minLevel: 2,
  demo: { age: [55, 88], ageMode: 'old', male: 0.6 },
  sev: { p: [0.4, 0.45, 0.15], burden: [[14, 20], [20, 26], [26, 32]] },
  refractoryP: [0, 0, 0],
  comorb: { extra: { htn: 0.8, dm2: 0.35, dyslip: 0.5 } },
  smokeP: 0.35,
  organisms: [],
  untreatedFatal: false,
  vars: (rng) => { const leftHemi = rng.chance(0.55); return { leftHemi, paresis: leftHemi ? '右' : '左', mins: rng.pick([10, 20, 30, 45]), hrs: rng.int(2, 6) }; },
  cc: (v) => `${v.paresis}手のしびれと脱力（今は治った）`, ccKey: 'neuro_deficit',
  arrival: () => 'walk',
  history: {
    lastnormal: { p: 1, text: '{hrs}時間前、朝食のときまでは普通でした。' },
    onset: { p: 1, text: '{hrs}時間前、急に{paresis}手に力が入らなくなって、箸を落としました。' },
    course: { p: 1, text: '{mins}分くらいで元に戻りました。今は何ともありません。' },
    character: { p: 1, text: '{paresis}の手と顔がしびれて、力が入りませんでした。' },
    weakness: { p: 1, text: 'そのときは{paresis}手に力が入りませんでしたが、今は大丈夫です。' },
    speechq: { p: 0.5, text: 'そのとき、少しろれつが回りませんでした。' },
    pmh: { p: 1, text: '高血圧で薬を飲んでいます。' },
    palpitation: { p: 0.15, text: '脈が乱れると言われたことはありません。' },
    headache: { p: 0, text: '' }, seizure: { p: 0, text: '' }, nausea: { p: 0, text: '' },
  },
  exam: {},
  vitals: { SBP: { to: [150, 170], k: 1 } },
  labs: {},
  tests: {
    head_mri: [{ p: 0.3, persist: true, text: '拡散強調像で{paresis}半身を支配する領域に小さな高信号（ごく小さな梗塞）。MRAで頸部〜頭蓋内の動脈に軽度の狭窄。' }],
  },
  natural: -0.05,
  therapies: [
    { id: 'apt', label: '早期の抗血小板療法（高リスクではアスピリン＋クロピドグレル）', req: { tag: 'antiplatelet' }, required: true, deadlineH: [24, 24, 24] },
  ],
  dynamics: (enc, eff) => {
    // 発症早期は脳梗塞のリスクが高い
    const st = enc.state;
    if (!st.comp.stroke && !eff.tags.antiplatelet && enc.t > 6 * 60 && enc.t < 72 * 60 && enc.patient.sev >= 1 && (enc.patient.seed % 7 === 0)) { st.comp.stroke = enc.t; st.burden = Math.max(st.burden, 45); }
    return 0;
  },
  residualAbove: 30, residualText: '入院後に脳梗塞を発症し、軽い麻痺が残りました。',
  dispo: (enc) => (enc.patient.sev === 0 ? { ok: ['admit', 'home'], best: 'admit', why: 'TIA：発症早期は脳梗塞のリスクが高いので入院で原因精査（低リスクで数日以内に精査できるなら外来も）' } : { ok: ['admit'], best: 'admit', why: 'TIA（ABCD2スコア高値）：入院で原因精査と再発予防' }),
  useful: ['bs_poct', 'head_ct', 'head_mri', 'ecg', 'cbc', 'chem', 'coag', 'hba1c', 'echo'],
  key: [['bs_poct', 'lab_GLU', 'chem'], ['head_ct', 'head_mri'], ['ecg']],
  extrasOk: () => ['stroke'],
  teaching: [
    '一過性の片麻痺・しびれ・言語障害などが24時間以内（多くは1時間以内）に完全に消えるのがTIA。症状が消えても脳梗塞の前触れとして緊急に対応する。',
    '発症後48時間以内の脳梗塞リスクが高い。ABCD2スコア（年齢・血圧・症状・持続時間・糖尿病）で評価。',
    '血糖・心電図（心房細動）・頭部MRI（拡散強調像）・頸動脈エコーで原因を調べる。',
    '治療：早期の抗血小板療法（高リスクではアスピリン＋クロピドグレルを短期間）、心房細動なら抗凝固薬、頸動脈狭窄なら内膜剥離術などを検討。',
  ],
  sources: ['脳卒中治療ガイドライン2021〔改訂2023〕（日本脳卒中学会）', 'AHA/ASA 2021 Guideline for the Prevention of Stroke in Patients With Stroke and TIA'],
  ideal: () => [
    { a: 'test', ids: ['bs_poct', 'head_ct', 'ecg', 'cbc', 'chem', 'coag', 'head_mri'] },
    { a: 'wait', min: 60 },
    { a: 'rx', drugId: 'aspirin', route: 'po', dose: 160, freq: 'once', days: 1 },
    { a: 'rx', drugId: 'clopidogrel', route: 'po', dose: 300, freq: 'once', days: 1 },
  ],
};
