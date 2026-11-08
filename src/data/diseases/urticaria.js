// 急性じんましん
// 出典: 日本皮膚科学会『蕁麻疹診療ガイドライン2018』
import { outpatient } from './common.js';
export default outpatient({
  id: 'urticaria', name: '急性じんましん', dept: '皮膚科', weight: 5,
  demo: { age: [16, 70], ageMode: 'uniform', male: 0.45 },
  cc: () => '全身のかゆい発疹', ccKey: 'rash_dyspnea',
  history: {
    onset: { p: 1, text: '今朝から体にかゆいブツブツが出ては消えてを繰り返しています。' },
    character: { p: 1, text: '盛り上がった赤いブツブツで、とてもかゆいです。数時間で消えて、別の場所に出ます。' },
    rash: { p: 1, text: '体や腕に赤く盛り上がった、かゆい発疹が出たり消えたりします。' },
    dyspnea: { p: 0, text: '' }, dizziness: { p: 0, text: '' }, abdpain: { p: 0, text: '' }, sorethroat: { p: 0, text: '' },
    trigger: { p: 0.5, text: '昨日、かぜ気味で市販薬を飲みました。食べ物は普段通りです。' },
  },
  exam: { skin: { p: 1, text: '体幹・四肢に地図状の膨疹（境界明瞭な盛り上がった紅斑）。粘膜の腫脹なし。' }, lung_ausc: { p: 0, text: '' }, pharynx: { p: 0, text: '' } },
  natural: -0.15,
  therapies: [{ id: 'antihistamine', label: '第2世代抗ヒスタミン薬', req: { tag: 'antihistamine' }, effect: -0.8, lagH: 1, required: true, deadlineH: [6, 6, 6] }],
  useful: [], key: [],
  teaching: [
    'じんましんは数時間〜1日以内に跡を残さず消える膨疹が特徴。',
    '息苦しさ・声のかすれ・血圧低下・腹痛・嘔吐を伴えばアナフィラキシー（アドレナリン）。必ず確認する。',
    '治療は第2世代抗ヒスタミン薬。原因（感染・薬剤・食物）が分からないことも多い。',
  ],
  sources: ['蕁麻疹診療ガイドライン2018（日本皮膚科学会）'],
  ideal: () => [{ a: 'rx', drugId: 'fexofenadine', route: 'po', dose: 60, freq: 'q12h', days: 7 }],
});
