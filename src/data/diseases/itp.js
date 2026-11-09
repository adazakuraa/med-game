// 免疫性血小板減少症（ITP）
// 出典: 日本血液学会『成人特発性血小板減少性紫斑病治療の参照ガイド2019改訂版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'itp', name: '免疫性血小板減少症（ITP）', dept: '血液内科', weight: 2, minLevel: 2,
  demo: { age: [20, 75], ageMode: 'uniform', male: 0.4 },
  sev: { p: [0.5, 0.4, 0.1], burden: [[22, 30], [30, 40], [40, 50]] },
  comorb: { extra: {} },
  vars: (rng, sev) => ({ plt: [2.5, 1.2, 0.5][sev] }),
  cc: () => 'あざができやすく、歯ぐきから血が出る', ccKey: 'bleeding',
  history: {
    onset: { p: 1, text: '1週間前から、ぶつけた覚えがないのに手足にあざができ、歯みがきで歯ぐきから血が出ます。' },
    character: { p: 1, text: 'すねや腕に赤い点々と、青あざがあります。' },
    fever: { p: 0, text: '熱はありません。' },
    weightloss: { p: 0, text: '体重は減っていません。' },
    meds: { p: 1, text: '新しく始めた薬はありません。' },
    alcohol: { p: 1, text: 'お酒はほとんど飲みません。' },
    pmh: { p: 1, text: '持病はありません。2週間前にかぜをひきました。' },
    fatigue: { p: 0, text: '' }, bloodystool: { p: 0, text: '' }, family: { p: 0, text: '' },
  },
  exam: { skin: { p: 1, text: '下腿・前腕に点状出血と紫斑。口腔内に血腫。' }, neck_ln: { p: 1, text: 'リンパ節腫脹はない。' }, abd_palp: { p: 1, text: '肝脾腫はない。' } },
  labs: { PLT: { mul: [0.02, 0.05], k: 0 } },
  tests: { smear: [{ p: 1, persist: true, text: '血小板が著明に少ない（大型血小板あり）。白血球・赤血球の形態は正常で、芽球・破砕赤血球はない。血小板の凝集はない。' }] },
  natural: -0.06,
  therapies: [{ id: 'tx', label: '血液内科と連携：ピロリ菌の検査・除菌、出血症状があればステロイド（プレドニゾロン）', req: { anyTag: ['steroid_sys'] }, effect: -0.3, lagH: 24, required: (enc) => enc.patient.sev >= 1, deadlineH: [48, 24, 12] }],
  harmTags: { antiplatelet: '血小板減少症に抗血小板薬', nsaid: '血小板減少症にNSAIDs（出血の助長）', anticoag: '血小板減少症に抗凝固薬', anticoag_bolus: '血小板減少症に抗凝固薬' },
  useful: ['cbc', 'smear', 'coag', 'chem', 'hp'], key: [['cbc'], ['smear'], ['coag']],
  dispo: (enc) => (enc.patient.sev === 2 ? { ok: ['admit'], best: 'admit', why: '血小板1万未満・粘膜出血：入院でステロイド（重い出血には免疫グロブリン・血小板輸血）' } : { ok: ['home', 'admit'], best: 'home', why: 'ITP：重い出血がなければ血液内科外来で治療' }),
  teaching: [
    '点状出血・紫斑・歯肉出血などの皮膚粘膜出血と、血小板だけが減っている（貧血・白血球異常・脾腫がない）のはITP。かぜの後に起こることも。',
    '偽性血小板減少（EDTA凝集）、薬剤性、肝硬変、白血病・骨髄異形成症候群、TTP（破砕赤血球・腎障害・精神症状）、DICを除外する。血液像は必ず確認。',
    'ピロリ菌陽性なら除菌で改善することがある。出血症状・血小板2〜3万未満ではステロイド。重い出血・手術前は免疫グロブリン大量療法・血小板輸血。',
    'NSAIDs・抗血小板薬は避ける。',
  ],
  sources: ['成人特発性血小板減少性紫斑病治療の参照ガイド2019改訂版（日本血液学会）'],
  ideal: (p) => [{ a: 'test', ids: ['cbc', 'smear', 'coag', 'chem', 'hp'] }, ...(p.sev >= 1 ? [{ a: 'rx', drugId: 'prednisolone', route: 'po', dose: 40, freq: 'q24h', days: 14 }] : [])],
});
