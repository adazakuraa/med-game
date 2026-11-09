// 機能性ディスペプシア
// 出典: 日本消化器病学会『機能性消化管疾患診療ガイドライン2021 機能性ディスペプシア（FD）（改訂第2版）』, Rome IV
import { outpatient } from './common.js';
export default outpatient({
  id: 'functional_dyspepsia', name: '機能性ディスペプシア', dept: '消化器内科', weight: 6,
  demo: { age: [20, 60], ageMode: 'uniform', male: 0.4 },
  comorb: { extra: {} },
  vars: (rng) => ({ mo: rng.int(3, 12) }),
  cc: () => '胃もたれとみぞおちの痛み', ccKey: 'epigastric',
  history: {
    onset: { p: 1, text: '{mo}か月くらい前から、食後に胃がもたれます。' },
    character: { p: 1, text: '少し食べただけでお腹がいっぱいになって、みぞおちが重く痛みます。' },
    aggravating: { p: 1, text: '食べた後に悪くなります。' },
    trigger: { p: 0.7, text: '仕事のストレスが多い時期にひどくなります。' },
    heartburn: { p: 0.2, text: '胸やけはあまりありません。' },
    weightloss: { p: 0, text: '' }, bloodystool: { p: 0, text: '' }, chestpain: { p: 0, text: '' },
    meds: { p: 1, text: '痛み止めなどは飲んでいません。' },
    pmh: { p: 0.8, text: '去年、胃カメラを受けましたが、異常はないと言われました。ピロリ菌もいないと言われました。' },
  },
  exam: { abd_palp: { p: 0.5, text: '心窩部に軽い不快感。腫瘤・腹膜刺激徴候なし。' } },
  tests: { hp: { p: 0 } },
  natural: -0.02,
  therapies: [{ id: 'tx', label: '酸分泌抑制薬または消化管運動改善薬（アコチアミド）と生活指導', req: { anyTag: ['prokinetic', 'ppi'] }, effect: -0.3, lagH: 12, required: true, deadlineH: [24, 24, 24] }],
  useful: ['ecg', 'hp', 'cbc', 'chem'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '機能性ディスペプシア：警告症状がなければ外来で薬物療法と生活指導' }),
  teaching: [
    '胃もたれ・早期飽満感・心窩部痛が続くのに、内視鏡などで器質的な異常がないのが機能性ディスペプシア。ストレスと関連が強い。',
    '警告症状（体重減少・嚥下困難・吐血/黒色便・貧血・高齢の新規症状）があれば内視鏡で胃がん・潰瘍を除外する。ピロリ菌陽性なら除菌。',
    '治療：酸分泌抑制薬、消化管運動改善薬（アコチアミド）、漢方（六君子湯）。生活指導と、病気の仕組みを説明して安心させることが大切。',
  ],
  sources: ['機能性消化管疾患診療ガイドライン2021 機能性ディスペプシア（日本消化器病学会）', 'Rome IV criteria'],
  ideal: () => [{ a: 'test', ids: ['ecg', 'hp'] }, { a: 'rx', drugId: 'acotiamide', route: 'po', dose: 100, freq: 'q8h', days: 14 }],
});
