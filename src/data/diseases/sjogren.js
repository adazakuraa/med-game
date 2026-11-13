// シェーグレン症候群
// 出典: 厚生労働省 自己免疫疾患に関する調査研究班『シェーグレン症候群診療ガイドライン2017年版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'sjogren', name: 'シェーグレン症候群', dept: '膠原病内科', weight: 2.5,
  demo: { age: [40, 65], ageMode: 'uniform', male: 0.07 },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '口と目が乾く', ccKey: 'oral',
  history: {
    onset: { p: 1, text: '1年前から口が乾いて、クラッカーなど乾いたものを水なしで飲み込めません。' },
    character: { p: 1, text: '目もゴロゴロして乾きます。虫歯が急に増えました。' },
    trigger: { p: 0, text: '口が乾く薬（抗うつ薬・抗コリン薬）は飲んでいません。' },
    fever: { p: 0, text: '熱はありません。' }, dyspnea: { p: 0, text: '' },
    pmh: { p: 1, text: '時々、両方の耳の下（耳下腺）が腫れます。関節も少し痛みます。' },
  },
  exam: { oral_mucosa: { p: 1, text: '口腔粘膜と舌が乾燥し、舌乳頭が萎縮。多数の齲歯。' }, neck_ln: { p: 0.3, text: '両側耳下腺の軽い腫脹。' }, eye: { p: 1, text: '結膜の乾燥、Schirmer試験 3mm/5分（低下）。' } },
  tests: { ssab: [{ p: 1, persist: true, text: '抗SS-A抗体 陽性、抗SS-B抗体 陽性。' }], ana: [{ p: 1, persist: true, text: '抗核抗体 640倍（斑紋型）。' }], rf_ccp: [{ p: 0.6, text: 'RF 陽性、抗CCP抗体 陰性。' }], hba1c: [{ p: 1, text: '5.5%（正常）。', normal: true }] },
  natural: -0.002,
  therapies: [{ id: 'tx', label: '口腔乾燥に唾液分泌促進薬（セビメリン）、目に人工涙液、口腔ケア、膠原病内科で腺外症状の評価', req: { anyTag: ['secretagogue'] }, effect: -0.2, lagH: 12, required: true, deadlineH: [72, 72, 72] }],
  useful: ['ssab', 'ana', 'rf_ccp', 'cbc', 'chem', 'hba1c', 'thyroid', 'esr'], key: [['ssab']],
  dispo: () => ({ ok: ['home'], best: 'home', why: 'シェーグレン症候群：外来で乾燥症状の治療と腺外症状の経過観察' }),
  teaching: [
    '中年女性の口の乾燥（乾いた食べ物が飲み込めない、虫歯の増加）と目の乾燥、耳下腺の腫れ → シェーグレン症候群。',
    '抗SS-A/SS-B抗体、Schirmer試験、口唇生検で診断。薬剤（抗コリン薬・抗うつ薬）・糖尿病・脱水による口渇を除外。',
    '乾燥症状にはセビメリン・人工涙液・口腔ケア。間質性肺炎・腎病変・悪性リンパ腫（耳下腺の持続性腫大）の合併に注意。',
  ],
  sources: ['シェーグレン症候群診療ガイドライン2017年版'],
  ideal: () => [{ a: 'test', ids: ['ssab', 'ana', 'cbc', 'hba1c'] }, { a: 'rx', drugId: 'cevimeline', route: 'po', dose: 30, freq: 'q8h', days: 28 }],
});
