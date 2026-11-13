// 口腔カンジダ症
// 出典: 日本口腔内科学会 資料, 日本医真菌学会『深在性真菌症の診断・治療ガイドライン』
import { outpatient } from './common.js';
export default outpatient({
  id: 'oral_candida', name: '口腔カンジダ症', dept: '歯科口腔外科', weight: 3,
  demo: { age: [65, 92], ageMode: 'old', male: 0.5 },
  comorb: { extra: { copd: 0.4, dm2: 0.3 } },
  vars: () => ({}),
  cc: () => '口の中がヒリヒリして、白いものが付く', ccKey: 'oral',
  history: {
    onset: { p: 1, text: '2週間前から口の中がヒリヒリして、味がよくわかりません。' },
    character: { p: 1, text: '舌や頬の内側に白いものが付いて、ぬぐうと取れて赤くなります。' },
    trigger: { p: 1, text: 'COPDでステロイドの吸入薬を使っています。吸入後のうがいはあまりしていません。入れ歯です。' },
    fever: { p: 0, text: '熱はありません。' }, dyspnea: { p: 0, text: '' },
    pmh: { p: 1, text: 'COPDと糖尿病があります。' },
  },
  exam: { oral_mucosa: { p: 1, text: '舌背・頬粘膜・口蓋に、ぬぐうと剥がれる白い偽膜と、その下の発赤。義歯の下の粘膜も赤い。' }, neck_ln: { p: 0, text: 'リンパ節腫脹なし。' } },
  tests: { koh: [{ p: 1, persist: true, text: '仮性菌糸と分芽胞子（カンジダ）を認める。' }] },
  natural: -0.01,
  therapies: [{ id: 'tx', label: '抗真菌薬（ミコナゾール口腔用ゲル・アムホテリシンBシロップ）、吸入後のうがい・義歯の清掃', req: { tag: 'oral_antifungal' }, effect: -0.3, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  useful: ['koh', 'bs_poct', 'hba1c', 'hiv', 'cbc'], key: [['koh']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '口腔カンジダ症：抗真菌薬と口腔ケアで外来' }),
  teaching: [
    '高齢者・吸入ステロイド・糖尿病・義歯・抗菌薬・免疫不全の人の、ぬぐうと剥がれる白苔と口腔のヒリヒリ感・味覚異常は口腔カンジダ症。',
    'KOH鏡検で仮性菌糸。若年者で原因がなければHIV感染も考える。',
    '治療はミコナゾール口腔用ゲル（ワルファリン併用禁忌）・アムホテリシンB。吸入後のうがい、義歯の清掃。',
  ],
  sources: ['日本口腔内科学会「口腔カンジダ症」'],
  ideal: () => [{ a: 'test', ids: ['koh'] }, { a: 'rx', drugId: 'miconazole_gel', route: 'top', dose: 2.5, freq: 'q6h', days: 7 }],
});
