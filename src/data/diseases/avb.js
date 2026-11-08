// 完全房室ブロック（高齢者の失神）
// 出典: 日本循環器学会ほか『2021年 JCS/JHRS ガイドライン フォーカスアップデート版 不整脈非薬物治療』, ESC Guidelines on cardiac pacing (2021)
import { T } from './common.js';
export default {
  id: 'avb', name: '完全房室ブロック', dept: '循環器内科',
  weight: 3, season: {}, minLevel: 2,
  demo: { age: [70, 95], ageMode: 'old', male: 0.5 },
  sev: { p: [0.35, 0.45, 0.2], burden: [[25, 35], [38, 50], [55, 68]] },
  refractoryP: [0, 0, 0.05],
  comorb: { extra: { htn: 0.6, dm2: 0.25, ckd: 0.2, dyslip: 0.3 } },
  organisms: [],
  vars: (rng) => ({ days: rng.int(2, 7) }),
  cc: () => '失神',
  ccKey: 'syncope',
  arrival: () => 'ambulance',
  history: {
    onset: { p: 1, text: '{days}日前から体がだるく、今日、台所で急に意識を失って倒れました。' },
    syncope: { p: 1, text: '前触れなく、急にふっと意識がなくなりました。気がついたら床に倒れていました。' },
    character: { p: 1, text: '最近、少し動くだけで息切れして、ふらふらします。' },
    dizziness: { p: 0.9, text: '立ちくらみのようなふらつきが何度もありました。' },
    dyspnea: { p: [0.3, 0.5, 0.8], text: '少し動くと息が切れます。' },
    palpitation: { p: 0.1, text: '脈がゆっくりな気がします。' },
    meds: { p: 0.3, text: '血圧の薬を飲んでいます。' },
  },
  exam: {
    gen_appear: { p: 1, bySev: ['だるそうにしている。', 'ぐったりしている。', '顔色不良でぼんやりしている。'] },
    heart_ausc: { p: 0.8, text: '徐脈（約{hr}/分）。I音の強さが拍ごとに変化する。' },
    periph: { p: [0, 0.3, 0.8], text: '四肢冷感。' },
  },
  postVars: (v) => { v.hr = 36; },
  vitals: { HR: { to: [26, 34], k: 0.25 }, SBP: { to: [70, 85], k: 2.5 } },
  labs: { BNP: { to: [200, 800], k: 1 } },
  tests: { echo: [{ p: 1, persist: true, text: 'LVEF 約55%。壁運動異常なし。軽度の大動脈弁硬化。' }] },
  ecg: [{ p: 1, unlessProc: 'pacing', text: '完全房室ブロック（P波とQRS波が無関係に出現、心室拍数 約35/分、補充調律）。' }, { p: 1, ifProc: 'pacing', text: 'ペーシング調律（60/分）。' }],
  natural: 0.35,
  curedBy: 'pacing',
  therapies: [
    T.proc('pacing', '循環器内科コンサルト→一時的ペーシング・ペースメーカー', [6, 4, 2]),
    T.tag('atropine', '症候性徐脈にアトロピン（効果は限定的）', 'atropine', [1, 1, 1], 0, 0, false),
  ],
  procedures: [{
    id: 'pacing', depts: ['cardio'], label: '一時的ペーシング', delay: 30, duration: 60, after: 'icu',
    decide: (enc) => {
      const ecg = enc.tests.some((t) => t.id === 'ecg' && t.done);
      if (!ecg) return { accept: false, text: 'まず12誘導心電図をお願いします。' };
      return { accept: true, reveal: true, text: '完全房室ブロックによる失神（Adams-Stokes発作）です。一時的ペーシングを行い、後日恒久的ペースメーカーを植え込みます（約30分後に開始）。' };
    },
    onDone: (enc) => { enc.state.burden = Math.min(enc.state.burden, 18); },
    doneText: '循環器内科：一時的ペーシングを留置しました（心拍数60/分）。恒久的ペースメーカーの植え込みを予定します。',
  }],
  dynamics: (enc, eff) => (eff.tags.atropine ? -0.5 : 0),
  harmTags: { betablocker: '完全房室ブロックにβ遮断薬（徐脈の悪化・心停止）', rate_ccb: '完全房室ブロックにCa拮抗薬（徐脈の悪化）' },
  dispo: () => ({ ok: ['icu', 'admit'], best: 'icu', why: '完全房室ブロック：CCU（ICU）でペーシング管理' }),
  useful: ['ecg', 'cbc', 'chem', 'lab_K', 'tnt', 'echo', 'cxr', 'bnp', 'bs_poct', 'vbg'],
  key: [['ecg'], ['chem', 'lab_K', 'vbg']],
  extrasOk: () => [],
  teaching: [
    '前兆のない突然の失神は心原性（不整脈）を疑う。高齢者の徐脈＋失神ではまず12誘導心電図。',
    '完全房室ブロック：P波とQRS波がバラバラに出る。補充調律で心拍数が非常に遅い（Adams-Stokes発作）。',
    '原因として高K血症・薬剤（β遮断薬・Ca拮抗薬・ジギタリス）・心筋梗塞（下壁）を確認する。',
    'アトロピンは効かないことが多い。一時的ペーシング→恒久的ペースメーカー。',
  ],
  sources: ['2021年 JCS/JHRS ガイドライン フォーカスアップデート版 不整脈非薬物治療', 'ESC Guidelines on cardiac pacing and cardiac resynchronization therapy (2021)'],
  ideal: () => [{ a: 'test', ids: ['ecg', 'vbg', 'chem', 'cbc', 'tnt'] }, { a: 'consult', dept: 'cardio', delayMin: 10 }],
};
