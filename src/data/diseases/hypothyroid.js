// 甲状腺機能低下症（橋本病）
// 出典: 日本甲状腺学会『甲状腺疾患診断ガイドライン2024』
import { outpatient } from './common.js';
export default outpatient({
  id: 'hypothyroid', name: '甲状腺機能低下症（橋本病）', weight: 4,
  demo: { age: [35, 80], ageMode: 'uniform', male: 0.15 },
  sev: { p: [0.5, 0.4, 0.1], burden: [[20, 28], [28, 36], [36, 44]] },
  cc: () => 'だるさとむくみ', ccKey: 'fatigue',
  history: {
    onset: { p: 1, text: '半年くらい前から、なんとなくだるくて元気が出ません。' },
    character: { p: 1, text: '疲れやすく、寒がりになって、顔や足がむくみます。' },
    fatigue: { p: 1, text: 'とにかくだるいです。' },
    heatcold: { p: 0.9, text: '以前より寒がりになって、汗をかかなくなりました。' },
    weightgain: { p: 0.7, text: '食べる量は変わらないのに3kgほど増えました。' },
    edema: { p: 0.6, text: 'まぶたや足がむくみます。' },
    constipation: { p: 0.6, text: '便秘がちになりました。' },
    family: { p: 0.4, text: '母が甲状腺の病気で薬を飲んでいます。' },
  },
  exam: { thyroid_palp: { p: 0.8, text: '甲状腺はびまん性に腫大し、硬め。圧痛なし。' }, skin: { p: 0.5, text: '皮膚は乾燥。' }, tremor: { p: 0.5, text: 'アキレス腱反射の弛緩相の遅れ。' }, leg_edema: { p: 0.4, text: '下腿に圧痕を残さない浮腫。' } },
  vitals: { HR: { to: [52, 58], k: 1 } },
  labs: { TSH: { to: [25, 80], k: 0.3 }, FT4: { to: [0.3, 0.6], k: 0.3 }, CK: { add: [100, 400], k: 1 }, NA: { add: [-4, -1], k: 1 } },
  natural: 0,
  therapies: [{ id: 'thyroxine', label: '甲状腺ホルモンの補充（少量から開始）', req: { tag: 'thyroxine' }, effect: -0.12, lagH: 24, required: true, deadlineH: [72, 72, 48] }],
  useful: ['thyroid', 'cbc', 'chem', 'ecg'], key: [['thyroid']],
  teaching: [
    'だるさ・寒がり・体重増加・むくみ・便秘・徐脈は甲状腺機能低下症を考える。中年女性の橋本病が多い。',
    'TSH高値・FT4低値で診断。CK・コレステロール上昇、低Na血症を伴うことがある。',
    '治療はレボチロキシン。高齢者・心疾患では少量（12.5〜25μg）から始めて、TSHを見ながら増量する。',
    'うつ病・認知症と思われていた症状の原因が甲状腺のことがある。',
  ],
  sources: ['甲状腺疾患診断ガイドライン2024（日本甲状腺学会）'],
  ideal: () => [{ a: 'test', ids: ['thyroid', 'cbc', 'chem'] }, { a: 'wait', min: 70 }, { a: 'rx', drugId: 'levothyroxine', route: 'po', dose: 25, freq: 'q24h', days: 14 }],
});
