// 常染色体顕性多発性嚢胞腎
// 出典: 厚生労働省 難治性腎障害に関する調査研究班『エビデンスに基づく多発性嚢胞腎（PKD）診療ガイドライン2020』
import { outpatient } from './common.js';
export default outpatient({
  id: 'pkd', name: '多発性嚢胞腎', dept: '腎臓内科', weight: 1.5,
  demo: { age: [30, 55], ageMode: 'uniform', male: 0.5 },
  comorb: { forced: ['htn'], extra: {} },
  vars: () => ({}),
  cc: () => '尿が赤くなった', ccKey: 'hematuria',
  history: {
    onset: { p: 1, text: '昨日、重い荷物を運んだ後から、尿が赤くなりました。' },
    hematuria: { p: 1, text: '真っ赤ではなく、ワインのような色です。血の塊は出ていません。' },
    character: { p: 1, text: '最近、お腹が張る感じがします。' },
    flankpain: { p: 0.6, text: '両方の脇腹が少し重い感じがします。' },
    dysuria: { p: 0, text: '排尿時の痛みはありません。' }, fever: { p: 0, text: '熱はありません。' }, sorethroat: { p: 0, text: 'のどの痛みはありません。' },
    smoking: { p: 0, text: 'たばこは吸いません。' }, occupation: { p: 0, text: '' }, meds: { p: 1, text: '30代から血圧の薬を飲んでいます。' },
    pmh: { p: 1, text: '母が50代で透析になり、くも膜下出血で亡くなりました。' },
  },
  exam: { abd_palp: { p: 1, text: '両側の側腹部に大きな凹凸のある腎臓を触れる。肝臓も腫大。' }, cva: { p: 0, text: 'CVA叩打痛なし。' }, leg_edema: { p: 0, text: '下腿浮腫なし。' } },
  vitals: { SBP: { to: [148, 162], k: 0 } },
  labs: { CR: { add: [0.4, 0.9], k: 0 }, U_BLD: { ord: [2, 3] }, U_RBC: { to: [50, 100], k: 0 }, U_PRO: { ord: [1, 1] } },
  tests: { abd_us: [{ p: 1, persist: true, text: '両側腎臓に大小無数の嚢胞があり、腎臓は著明に腫大（多発性嚢胞腎）。肝臓にも多数の嚢胞。結石なし。' }], abd_ct_plain: [{ p: 1, persist: true, text: '両腎・肝に多数の嚢胞、一部の嚢胞内に出血（高吸収）。腫瘍・結石なし。' }], urine_cyto: [{ p: 1, text: '陰性（Class II）。', normal: true }] },
  natural: -0.02,
  therapies: [{ id: 'nephro', label: '安静・水分摂取（嚢胞出血は自然に止まることが多い）、降圧（ARB）、腎臓内科でトルバプタンの適応と脳動脈瘤のスクリーニング', req: { fn: (enc, eff) => enc.consults.some((c) => c.dept === 'nephro') || (eff.tags.arb || 0) > 0 }, effect: -0.2, lagH: 6, required: true, deadlineH: [48, 48, 48] }],
  consult: { nephro: '腎臓内科：両腎・肝の多発嚢胞と家族歴から、常染色体顕性多発性嚢胞腎で、今回は嚢胞出血による血尿です。安静と十分な水分で多くは止まります。血圧はARBで130/80未満を目標にし、腎容積を測ってトルバプタンの適応を考えます。家族歴があるので頭部MRAで脳動脈瘤も調べましょう。' },
  useful: ['ua', 'chem', 'cbc', 'abd_us', 'abd_ct_plain', 'urine_cyto', 'upcr', 'head_mri'], key: [['ua'], ['abd_us', 'abd_ct_plain']],
  dispo: () => ({ ok: ['home', 'admit'], best: 'home', why: '多発性嚢胞腎の嚢胞出血：安静・水分で外来（出血が続く・発熱は入院）、腎臓内科でフォロー' }),
  teaching: [
    '若い頃からの高血圧、家族歴（透析・くも膜下出血）、両側の大きな腎臓・肝嚢胞 → 常染色体顕性多発性嚢胞腎。血尿（嚢胞出血）・腰背部痛・嚢胞感染・結石で受診する。',
    'エコー・CTで両腎の多数の嚢胞。脳動脈瘤の合併が多く、家族歴があればMRAでスクリーニング。',
    '治療は降圧（ARB）、水分摂取、トルバプタン（腎容積が大きく進行が速い場合）。末期腎不全では透析・移植。',
  ],
  sources: ['エビデンスに基づく多発性嚢胞腎（PKD）診療ガイドライン2020'],
  ideal: () => [{ a: 'test', ids: ['ua', 'chem', 'cbc', 'abd_us'] }, { a: 'consult', dept: 'nephro', delayMin: 1 }, { a: 'wait', min: 70 }],
});
