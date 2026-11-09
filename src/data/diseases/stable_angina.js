// 労作性狭心症（安定狭心症）
// 出典: 日本循環器学会『2022年JCSガイドライン フォーカスアップデート版 安定冠動脈疾患の診断と治療』, 2024 ESC Guidelines for chronic coronary syndromes
import { outpatient } from './common.js';
export default outpatient({
  id: 'stable_angina', name: '労作性狭心症', dept: '循環器内科', weight: 4, minLevel: 2,
  demo: { age: [50, 80], ageMode: 'uniform', male: 0.7 },
  smokeP: 0.45,
  comorb: { extra: { htn: 0.7, dyslip: 0.7, dm2: 0.35 } },
  untreatedFatal: false,
  vars: (rng) => ({ wk: rng.int(1, 6) }),
  cc: () => '歩くと胸が苦しくなる', ccKey: 'chest_pain',
  history: {
    onset: { p: 1, text: '{wk}週間ほど前から、坂道や階段を上ると胸が苦しくなります。' },
    character: { p: 1, text: '胸の真ん中が締め付けられるような、重苦しい感じです。' },
    location: { p: 1, text: '胸の真ん中です。' },
    radiation: { p: 0.5, text: '左の肩や首のほうに広がることがあります。' },
    aggravating: { p: 1, text: '急いで歩いたときや、寒い朝に出かけたときに起こります。' },
    relieving: { p: 1, text: '立ち止まって休むと、3〜5分で治まります。' },
    course: { p: 1, text: '頻度や強さは最近変わっていません。安静にしているときには起きません。' },
    severity: { p: 1, text: '今は痛くありません。起きたときで5くらいです。' },
    sweating: { p: 0.1, text: '冷や汗は出ません。' },
    dyspnea: { p: 0.3, text: '少し息切れも感じます。' },
    migration: { p: 0, text: '' }, immobility: { p: 0, text: '' }, sorethroat: { p: 0, text: '' },
    pmh: { p: 1, text: '高血圧と、コレステロールが高いと言われています。' },
  },
  exam: { gen_appear: { p: 1, text: '診察時は胸痛なく、落ち着いている。' } },
  tests: {
    stress_ecg: [{ p: 0.8, persist: true, text: 'Bruce法ステージ2で前胸部の圧迫感が出現し、V4〜V6で水平型1.5mmのST低下（陽性）。安静で3分後に消失。' }],
    ccta: [{ p: 0.95, persist: true, text: '左前下行枝近位部に約75%の狭窄（石灰化を伴うプラーク）。' }],
    echo: [],
  },
  natural: -0.3,
  therapies: [
    { id: 'ntg', label: '発作時のニトログリセリン舌下（頓用）', req: { fn: (enc) => enc.orders.some((o) => ['ntg_spray', 'ntg'].includes(o.drugId)) }, required: true, deadlineH: [24, 24, 24] },
    { id: 'apt', label: '抗血小板薬（アスピリン）', req: { tag: 'antiplatelet' }, required: true, deadlineH: [24, 24, 24] },
    { id: 'statin', label: 'スタチン（LDLコレステロール低下）', req: { tag: 'statin' }, required: true, deadlineH: [24, 24, 24] },
    { id: 'cardio', label: '循環器内科外来での精査（負荷試験・冠動脈CT・カテーテル）', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'cardio') || enc.tests.some((t) => ['stress_ecg', 'ccta'].includes(t.id)) }, required: true, deadlineH: [24, 24, 24] },
  ],
  useful: ['ecg', 'tnt', 'cbc', 'chem', 'hba1c', 'cxr', 'echo', 'stress_ecg', 'ccta'], key: [['ecg'], ['tnt']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '安定狭心症：安静時の症状がなく心電図・トロポニンが正常なら外来で精査（安静時・増悪する胸痛は不安定狭心症として入院）' }),
  teaching: [
    '一定以上の労作で起こり、安静で数分以内に治まる胸の圧迫感は労作性狭心症。症状のパターンが変わらなければ「安定」。',
    '安静時の胸痛・頻度や強さの増加・20分以上続く痛みは不安定狭心症（急性冠症候群）として緊急対応。まず心電図とトロポニンで除外する。',
    '診断は運動負荷心電図・冠動脈CT・負荷心筋シンチなど、最終的には冠動脈造影。',
    '治療：発作時のニトログリセリン舌下、アスピリン、スタチン、β遮断薬、禁煙・血圧・血糖管理。症状が強い・重症病変ならPCIやバイパス術。',
  ],
  sources: ['2022年JCSガイドライン フォーカスアップデート版 安定冠動脈疾患の診断と治療（日本循環器学会）', '2024 ESC Guidelines for the management of chronic coronary syndromes'],
  ideal: () => [
    { a: 'test', ids: ['ecg', 'tnt', 'chem', 'cbc', 'stress_ecg'] },
    { a: 'rx', drugId: 'ntg_spray', route: 'sl', dose: 0.3, freq: 'prn', days: 30 },
    { a: 'rx', drugId: 'aspirin', route: 'po', dose: 100, freq: 'q24h', days: 30 },
    { a: 'rx', drugId: 'atorvastatin_rx', route: 'po', dose: 10, freq: 'q24h', days: 30 },
  ],
});
