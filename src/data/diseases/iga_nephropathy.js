// IgA腎症
// 出典: 日本腎臓学会『エビデンスに基づくIgA腎症診療ガイドライン2020』
import { outpatient } from './common.js';
export default outpatient({
  id: 'iga_nephropathy', name: 'IgA腎症', dept: '腎臓内科', weight: 3,
  demo: { age: [18, 45], ageMode: 'young', male: 0.55 },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => 'かぜの後に赤い尿が出た', ccKey: 'hematuria',
  history: {
    onset: { p: 1, text: '2日前から喉が痛く、昨日コーラのような赤い尿が出ました。' },
    hematuria: { p: 1, text: '尿が赤茶色でした。今は少し薄くなりました。' },
    character: { p: 1, text: '尿の色が変わっただけで、痛みはありません。' },
    flankpain: { p: 0, text: '腰やわき腹の痛みはありません。' },
    dysuria: { p: 0, text: '排尿時の痛みはありません。' },
    sorethroat: { p: 1, text: '喉が痛いです（かぜ）。' },
    pmh: { p: 1, text: '学校の健診で尿潜血を指摘されたことがあります。' },
    smoking: { p: 0, text: 'たばこは吸いません。' },
    fever: { p: 0.3, text: '微熱があります。' }, edema: { p: 0, text: '' }, meds: { p: 0, text: '' },
  },
  exam: { cva: { p: 1, text: 'CVA叩打痛なし。' }, leg_edema: { p: 0, text: '' }, pharynx: { p: 0.8, text: '咽頭の発赤。' } },
  labs: { U_BLD: { to: [3, 3], k: 0 }, U_PRO: { to: [1, 2], k: 0 }, U_RBC: { to: [30, 100], k: 0 } },
  tests: { upcr: [{ p: 1, persist: true, text: '尿蛋白 0.8 g/gCr。沈渣で変形赤血球（糸球体性）と赤血球円柱。' }], abd_us: [{ p: 1, text: '腎臓の大きさ・形は正常。結石・腫瘍・水腎症はない。' }] },
  natural: -0.002,
  therapies: [{ id: 'nephro', label: '腎臓内科へ紹介：腎生検、ARB/ACE阻害薬（蛋白尿）、扁桃摘出＋ステロイドパルスの検討', req: { fn: (enc, eff) => enc.consults.some((c) => c.dept === 'nephro') || (eff.tags.arb || 0) > 0 }, effect: -0.2, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  consult: { nephro: '腎臓内科：上気道炎と同時に起こる肉眼的血尿（同期性）と、糸球体性の血尿・蛋白尿から、IgA腎症を疑います。腎生検で確定し、蛋白尿に応じてARB・扁桃摘出＋ステロイドパルスを検討します。' },
  useful: ['ua', 'upcr', 'chem', 'cbc', 'abd_us', 'urine_cyto', 'strep_ag'], key: [['ua', 'upcr'], ['chem']],
  dispo: () => ({ ok: ['home'], best: 'home', why: 'IgA腎症の疑い：腎臓内科外来で腎生検を検討' }),
  teaching: [
    'かぜ（上気道炎）と同時（1〜2日以内）の肉眼的血尿はIgA腎症に典型的。溶連菌感染後の急性糸球体腎炎は1〜3週後。',
    '血尿が糸球体からか（変形赤血球・赤血球円柱・蛋白尿）を尿沈渣で確認する。糸球体性でなければ結石・腫瘍・感染。',
    '診断は腎生検。治療はARB/ACE阻害薬、扁桃摘出＋ステロイドパルスなど。長期的に腎不全に進むことがある。',
  ],
  sources: ['エビデンスに基づくIgA腎症診療ガイドライン2020（日本腎臓学会）'],
  ideal: () => [{ a: 'test', ids: ['ua', 'upcr', 'chem', 'abd_us'] }, { a: 'consult', dept: 'nephro', delayMin: 1 }, { a: 'wait', min: 70 }],
});
