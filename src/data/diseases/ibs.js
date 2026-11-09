// 過敏性腸症候群
// 出典: 日本消化器病学会『機能性消化管疾患診療ガイドライン2020—過敏性腸症候群（IBS）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'ibs', name: '過敏性腸症候群', dept: '消化器内科', weight: 5,
  demo: { age: [18, 45], ageMode: 'young', male: 0.45 },
  cc: () => '腹痛と下痢を繰り返す', ccKey: 'vomit_diarrhea',
  history: {
    onset: { p: 1, text: '半年くらい前から、お腹が痛くなって下痢をすることを繰り返しています。' },
    course: { p: 1, text: '週に何度か、特に朝の通勤電車の中で急にお腹が痛くなります。' },
    character: { p: 1, text: 'お腹がキリキリ痛んで、トイレに行って便を出すと楽になります。' },
    diarrhea: { p: 1, text: 'ゆるい便が出ます。便秘と下痢を繰り返すこともあります。' },
    relieving: { p: 1, text: '排便すると痛みが楽になります。' },
    trigger: { p: 1, text: '仕事のストレスが強いときにひどくなります。' },
    bloodystool: { p: 0, text: '' }, weightloss: { p: 0, text: '' }, fever: { p: 0, text: '' }, nausea: { p: 0, text: '' },
    family: { p: 1, text: '家族に大腸がんや炎症性腸疾患の人はいません。' },
  },
  exam: { abd_palp: { p: 0.4, text: '下腹部に軽い圧痛。腫瘤なし。' } },
  natural: -0.02,
  therapies: [{ id: 'ibs', label: '生活指導と腸の動きを整える薬', req: { anyTag: ['ibs'] }, effect: -0.2, lagH: 12, required: false, deadlineH: [99, 99, 99] }],
  harmTags: { abx: '過敏性腸症候群に抗菌薬は不要' },
  useful: ['cbc', 'crp', 'fobt', 'chem', 'thyroid'], key: [],
  teaching: [
    '繰り返す腹痛が排便で軽快し、便の回数や形の変化を伴うのは過敏性腸症候群（Rome IV基準）。ストレスで悪化しやすい。',
    '警告症状（50歳以上の発症・血便・体重減少・発熱・夜間の症状・大腸がんの家族歴・貧血）があれば大腸内視鏡などで器質的疾患を除外する。',
    '治療は病態の説明と生活習慣の改善が基本。必要に応じて消化管運動調整薬などを使う。',
  ],
  sources: ['機能性消化管疾患診療ガイドライン2020—過敏性腸症候群（IBS）（日本消化器病学会）'],
  ideal: () => [{ a: 'test', ids: ['cbc', 'crp'] }, { a: 'rx', drugId: 'trimebutine', route: 'po', dose: 100, freq: 'q8h', days: 14 }],
});
