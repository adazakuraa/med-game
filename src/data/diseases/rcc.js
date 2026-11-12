// 腎細胞がん
// 出典: 日本泌尿器科学会『腎癌診療ガイドライン2017年版（2020年アップデート）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'rcc', name: '腎細胞がん', dept: '泌尿器科', weight: 1.5,
  demo: { age: [55, 80], ageMode: 'uniform', male: 0.7 },
  comorb: { extra: { htn: 0.5, ckd: 0.2 } },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '痛みのない真っ赤な尿が出た', ccKey: 'hematuria',
  history: {
    onset: { p: 1, text: '昨日、痛みもなく真っ赤な尿が出ました。今日は少し薄くなりました。' },
    hematuria: { p: 1, text: '最初から最後まで赤い尿でした。' },
    character: { p: 1, text: '痛みはありません。最近、体重が少し減り、微熱があります。' },
    flankpain: { p: 0.3, text: '{side}の脇腹が少し重い感じがします。' },
    dysuria: { p: 0, text: '排尿時の痛みはありません。' }, fever: { p: 0.3, text: '37度台の微熱があります。' }, sorethroat: { p: 0, text: '最近かぜはひいていません。' },
    smoking: { p: 1, text: '40年間、1日20本吸っています。' }, occupation: { p: 0, text: '' }, meds: { p: 0, text: '血をサラサラにする薬は飲んでいません。' }, pmh: { p: 1, text: '高血圧があります。透析はしていません。' },
  },
  exam: { cva: { p: 0, text: 'CVA叩打痛なし。' }, abd_palp: { p: 0.3, text: '{side}側腹部に腫瘤を触れる。' }, leg_edema: { p: 0, text: '下腿浮腫なし。' } },
  labs: { U_BLD: { ord: [3, 3] }, U_RBC: { to: [100, 200], k: 0 }, HB: { add: [-2, -0.5], k: 0 }, CRP: { to: [0.5, 2], k: 0 } },
  tests: { abd_us: [{ p: 1, persist: true, text: '{side}腎臓の上極に5cmの充実性腫瘤（腎細胞がんを疑う）。水腎症なし。結石なし。' }], abd_ct_contrast: [{ p: 1, persist: true, text: '{side}腎に早期に強く造影されて後期に抜ける5cmの腫瘤（淡明細胞型腎細胞がんを疑う）。腎静脈に腫瘍血栓なし、転移なし。' }], urine_cyto: [{ p: 1, text: '陰性（Class II）。', normal: true }], upcr: [{ p: 1, text: '尿蛋白 0.1 g/gCr。変形赤血球なし。', normal: true }] },
  natural: -0.001,
  therapies: [{ id: 'uro', label: '泌尿器科へ紹介：造影CTで病期を評価し、腎部分切除・腎摘除術', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'uro') }, effect: -0.2, lagH: 12, required: true, deadlineH: [72, 72, 72] }],
  consult: { uro: '泌尿器科：造影CTで{side}腎に5cmの腎細胞がんを疑う腫瘤があり、転移はありません。手術（腹腔鏡下腎部分切除術または腎摘除術）を予定します。' },
  useful: ['ua', 'abd_us', 'abd_ct_contrast', 'urine_cyto', 'chem', 'cbc', 'upcr'], key: [['ua'], ['abd_us', 'abd_ct_contrast']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '腎細胞がん疑い：泌尿器科外来で病期診断と手術' }),
  teaching: [
    '中高年の痛みのない肉眼的血尿は、膀胱がん・腎盂尿管がん・腎細胞がんを必ず精査する（尿細胞診・エコー・造影CT・膀胱鏡）。',
    '腎細胞がんは無症状で偶然見つかることが多い。古典的3徴（血尿・側腹部痛・腫瘤）がそろうのはまれ。喫煙・肥満・透析が危険因子。',
    '治療は手術（腎部分切除・腎摘除）。転移があれば分子標的薬・免疫チェックポイント阻害薬。',
  ],
  sources: ['腎癌診療ガイドライン2017年版（日本泌尿器科学会）'],
  ideal: () => [{ a: 'test', ids: ['ua', 'abd_us', 'abd_ct_contrast', 'urine_cyto', 'chem', 'cbc'] }, { a: 'consult', dept: 'uro', delayMin: 1 }, { a: 'wait', min: 70 }],
});
