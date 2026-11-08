// 胃潰瘍（外来：NSAIDs・ピロリ菌）
// 出典: 日本消化器病学会『消化性潰瘍診療ガイドライン2020』
import { outpatient } from './common.js';
export default outpatient({
  id: 'pud', name: '胃潰瘍', dept: '消化器内科', weight: 5,
  demo: { age: [35, 80], ageMode: 'uniform', male: 0.6 },
  vars: (rng, sev, pt) => { const ns = rng.chance(0.5); if (ns) pt.homeMeds.push('nsaid_home'); return { ns }; },
  cc: () => 'みぞおちの痛み', ccKey: 'epigastric',
  history: {
    onset: { p: 1, text: '2週間ほど前から、みぞおちが痛みます。' },
    character: { p: 1, text: 'みぞおちがシクシク、焼けるように痛みます。' },
    location: { p: 1, text: 'みぞおちです。' },
    aggravating: { p: 0.7, text: '食後に痛くなることが多いです。' },
    heartburn: { p: 0.3, text: '少し胸やけもあります。' },
    bloodystool: { p: 0, text: '' }, weightloss: { p: 0, text: '' },
    meds: { p: 1, ifVar: 'ns', text: '腰痛でロキソニンを毎日飲んでいます。' },
    pmh: { p: 0.5, text: '健診でピロリ菌がいるかもしれないと言われたことがあります。' },
  },
  exam: { abd_palp: { p: 0.9, text: '心窩部に圧痛。腹膜刺激徴候なし。' }, conjunctiva: { p: 0, text: '' } },
  tests: { hp: { p: [0.6, 0.6, 0.6] } },
  natural: -0.02,
  therapies: [{ id: 'ppi', label: '酸分泌抑制薬（ボノプラザン・PPI）、NSAIDsの中止、ピロリ菌の検査と除菌', req: { tag: 'ppi' }, effect: -0.3, lagH: 12, required: true, deadlineH: [24, 24, 24] }],
  harmTags: { nsaid: '胃潰瘍にNSAIDs（悪化・出血）' },
  useful: ['ecg', 'cbc', 'hp', 'chem', 'fobt'], key: [['ecg', 'cbc']],
  teaching: [
    '心窩部痛（食後・空腹時）は消化性潰瘍・機能性ディスペプシア・逆流性食道炎などが多いが、心筋梗塞（心電図）や膵炎・胆道疾患も考える。',
    '消化性潰瘍の2大原因はピロリ菌とNSAIDs。NSAIDsを中止し、ピロリ菌を検査して陽性なら除菌する。',
    '吐血・黒色便・貧血・体重減少・嚥下困難などの警告症状があれば早めに内視鏡（胃がんの除外も）。',
  ],
  sources: ['消化性潰瘍診療ガイドライン2020（日本消化器病学会）'],
  ideal: () => [{ a: 'test', ids: ['ecg', 'cbc', 'hp'] }, { a: 'rx', drugId: 'vonoprazan', route: 'po', dose: 20, freq: 'q24h', days: 14 }],
});
