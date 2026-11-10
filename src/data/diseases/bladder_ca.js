// 膀胱がん
// 出典: 日本泌尿器科学会『膀胱癌診療ガイドライン2019年版』, 血尿診断ガイドライン2023
import { outpatient } from './common.js';
export default outpatient({
  id: 'bladder_ca', name: '膀胱がん', dept: '泌尿器科', weight: 3, minLevel: 2,
  demo: { age: [60, 85], ageMode: 'old', male: 0.75 },
  smokeP: 0.7,
  comorb: { extra: { htn: 0.4 } },
  vars: () => ({}),
  cc: () => '痛みのない赤い尿が出た', ccKey: 'hematuria',
  history: {
    onset: { p: 1, text: '3日前、痛みもないのに真っ赤な尿が出ました。その後は治まりました。' },
    hematuria: { p: 1, text: '真っ赤な尿で、小さな血の塊も出ました。' },
    character: { p: 1, text: '痛みはまったくありません。' },
    flankpain: { p: 0, text: '腰の痛みはありません。' },
    dysuria: { p: 0, text: '排尿時の痛みはありません。' },
    fever: { p: 0, text: '熱はありません。' },
    smoking: { p: 1, text: '1日20本を45年吸っています。' },
    occupation: { p: 0.5, text: '若いころ、染料工場で働いていました。' },
    sorethroat: { p: 0, text: '' }, edema: { p: 0, text: '' }, pmh: { p: 0, text: '' }, meds: { p: 1, text: '血液をサラサラにする薬は飲んでいません。' },
  },
  exam: { cva: { p: 1, text: 'CVA叩打痛なし。' }, abd_palp: { p: 1, text: '下腹部に腫瘤・圧痛なし。' } },
  labs: { U_BLD: { to: [2, 3], k: 0 }, U_RBC: { to: [20, 50], k: 0 } },
  tests: { abd_us: [{ p: 0.8, persist: true, text: '膀胱の右側壁に約2cmの乳頭状の隆起性病変。水腎症なし。' }], urine_cyto: [{ p: 0.7, persist: true, text: '陽性（Class V）：尿路上皮がんを疑う異型細胞。' }], upcr: [{ p: 1, persist: true, text: '尿蛋白は軽微。沈渣の赤血球は均一（非糸球体性）。' }] },
  natural: -0.001,
  therapies: [{ id: 'uro', label: '泌尿器科へ紹介：膀胱鏡・CT尿路造影、経尿道的膀胱腫瘍切除術（TURBT）', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'uro') }, effect: -0.2, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  consult: { uro: '泌尿器科：喫煙歴のある高齢男性の無症候性肉眼的血尿で、エコーで膀胱腫瘍があり膀胱がんを疑います。膀胱鏡で確認し、経尿道的膀胱腫瘍切除術（TURBT）で診断と治療を行います。上部尿路もCTで評価します。禁煙も大切です。' },
  useful: ['ua', 'upcr', 'urine_cyto', 'abd_us', 'abd_ct_contrast', 'chem', 'cbc', 'coag'], key: [['ua'], ['abd_us', 'abd_ct_contrast']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '膀胱がんの疑い：泌尿器科外来で膀胱鏡（血尿が多く貧血・尿閉があれば入院）' }),
  teaching: [
    '痛みのない肉眼的血尿（無症候性肉眼的血尿）は、特に喫煙歴のある高齢者では膀胱がんなど尿路のがんを第一に考える。抗凝固薬を飲んでいても精査する。',
    '尿沈渣で非糸球体性（赤血球が均一）なら、エコー・尿細胞診・CT・膀胱鏡で尿路を調べる。',
    '最大の危険因子は喫煙。染料・化学物質への職業曝露も。',
  ],
  sources: ['膀胱癌診療ガイドライン2019年版（日本泌尿器科学会）', '血尿診断ガイドライン2023'],
  ideal: () => [{ a: 'test', ids: ['ua', 'upcr', 'abd_us', 'urine_cyto'] }, { a: 'consult', dept: 'uro', delayMin: 1 }, { a: 'wait', min: 70 }],
});
