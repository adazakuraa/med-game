// 多発性骨髄腫
// 出典: 日本血液学会『造血器腫瘍診療ガイドライン2023年版』, IMWG診断基準
import { outpatient } from './common.js';
export default outpatient({
  id: 'myeloma', name: '多発性骨髄腫', dept: '血液内科', weight: 2, minLevel: 3,
  demo: { age: [60, 85], ageMode: 'old', male: 0.55 },
  comorb: { extra: { htn: 0.4 } },
  vars: () => ({}),
  cc: () => '腰の痛みとだるさが続く', ccKey: 'back_pain',
  history: {
    onset: { p: 1, text: '2か月前から腰と背中が痛く、だんだん強くなっています。' },
    character: { p: 1, text: '動くと痛く、夜も痛みます。' },
    aggravating: { p: 1, text: '寝返りでも痛いです。' },
    fatigue: { p: 1, text: 'だるくて、息切れがします。' },
    weightloss: { p: 0.6, text: '少しやせました。' },
    fever: { p: 0, text: '熱はありません。' },
    weakness: { p: 0, text: '足の力は大丈夫です。' }, retention: { p: 0, text: '' }, rash: { p: 0, text: '' }, radiation: { p: 0, text: '' },
    pmh: { p: 1, text: '最近、肺炎を2回繰り返しました。' },
    meds: { p: 1, text: '痛み止めを飲んでいます。' },
  },
  exam: { spine: { p: 1, text: '腰椎に叩打痛。' }, conjunctiva: { p: 1, text: '眼瞼結膜が蒼白。' }, slr: { p: 0, text: '' } },
  labs: { HB: { add: [-5, -3], k: 0 }, TP: { add: [2, 3.5], k: 0 }, ALB: { add: [-1, -0.5], k: 0 }, CA: { add: [0.8, 2], k: 0 }, CR: { add: [0.5, 1.5], k: 0 } },
  tests: { spep: [{ p: 1, persist: true, text: 'γグロブリン分画にM蛋白（IgGκ型）。免疫固定法で単クローン性。' }], spine_xr: [{ p: 1, persist: true, text: '腰椎の圧迫骨折と、骨盤・頭蓋骨に打ち抜き像（溶骨性病変）。' }] },
  natural: -0.002,
  therapies: [{ id: 'hema', label: '血液内科コンサルト→骨髄検査と治療（高Ca血症・腎障害・骨病変の管理）', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'hema') }, effect: -0.2, lagH: 6, required: true, deadlineH: [48, 24, 24] }],
  consult: { hema: '血液内科：M蛋白・貧血・高Ca血症・腎障害・溶骨性病変（CRAB）から多発性骨髄腫を疑います。骨髄検査で確定し、治療（プロテアソーム阻害薬・免疫調節薬・抗体薬など）を始めます。' },
  harmTags: { nsaid: '腎障害を伴う骨髄腫にNSAIDs（腎機能の悪化）' },
  useful: ['cbc', 'chem', 'spep', 'spine_xr', 'ua', 'upcr', 'spine_mri'], key: [['cbc'], ['chem'], ['spep']],
  dispo: () => ({ ok: ['home', 'admit'], best: 'home', why: '多発性骨髄腫の疑い：高度の高Ca血症・腎不全・脊髄圧迫がなければ血液内科外来で精査' }),
  teaching: [
    '高齢者の腰背部痛＋貧血＋腎障害＋高Ca血症（CRAB）・総蛋白高値（アルブミンとの差が大きい）・感染の繰り返しは多発性骨髄腫を疑う。',
    '血清蛋白電気泳動でM蛋白、X線で溶骨性病変（打ち抜き像）、骨髄検査で確定。',
    'NSAIDs・造影剤は腎障害を悪化させうる。脊髄圧迫（麻痺）に注意。',
  ],
  sources: ['造血器腫瘍診療ガイドライン2023年版（日本血液学会）'],
  ideal: () => [{ a: 'test', ids: ['cbc', 'chem', 'spep', 'spine_xr', 'ua'] }, { a: 'consult', dept: 'hema', delayMin: 1 }, { a: 'wait', min: 70 }],
});
