// 重症筋無力症（全身型）
// 出典: 日本神経学会『重症筋無力症/ランバート・イートン筋無力症候群診療ガイドライン2022』
import { outpatient } from './common.js';
export default outpatient({
  id: 'mg', name: '重症筋無力症', dept: '脳神経内科', weight: 2,
  demo: { age: [25, 75], ageMode: 'uniform', male: 0.35 },
  comorb: { extra: {} },
  vars: (rng) => ({ mo: rng.int(1, 3) }),
  cc: () => 'まぶたが下がり、物が二重に見える', ccKey: 'vision',
  history: {
    onset: { p: 1, text: '{mo}か月前から、夕方になるとまぶたが下がって、物が二重に見えます。' },
    course: { p: 1, text: '朝は調子がいいのに、夕方や疲れると悪くなります。休むと少し良くなります。' },
    vision: { p: 1, text: '横に並んで二重に見えます。片目をつぶると一つに見えます。' },
    weakness: { p: 0.7, text: '最近、腕を上げ続けると疲れて、髪を乾かすのがつらいです。' },
    speechq: { p: 0.4, text: '長く話していると鼻声になり、食事の後半で飲み込みにくくなります。' },
    dyspnea: { p: 0, text: '息苦しさはありません。' }, headache: { p: 0, text: '頭痛はありません。' },
    pmh: { p: 0, text: '持病はありません。' }, meds: { p: 0, text: '薬は飲んでいません。' },
  },
  exam: { eye: { p: 1, text: '両側の眼瞼下垂（上方を1分見続けると増悪）と眼球運動制限による複視。瞳孔は正常。アイスパックで眼瞼下垂が改善。' }, motor: { p: 1, text: '上肢挙上を続けると数十秒で落ちてくる（易疲労性）。腱反射は正常。' }, pupils: { p: 1, text: '瞳孔は正常で対光反射も正常。' }, facial: { p: 0.3, text: '口の周りの筋力が軽く低下。' } },
  tests: { achr: [{ p: 1, persist: true, text: '抗AChR抗体 陽性（12 nmol/L）。' }], chest_ct: [{ p: 0.3, persist: true, text: '前縦隔に3cmの腫瘤（胸腺腫）。' }], head_mri: [{ p: 1, text: '脳幹・眼窩に異常なし。', normal: true }], ncs: [{ p: 1, text: '反復刺激試験で振幅の漸減（waning）を認める。' }] },
  natural: -0.01,
  therapies: [
    { id: 'tx', label: 'コリンエステラーゼ阻害薬（ピリドスチグミン）で症状緩和', req: { tag: 'ache_inh' }, effect: -0.2, lagH: 2, required: true, deadlineH: [48, 48, 48] },
    { id: 'neuro', label: '脳神経内科へ紹介（免疫治療・胸腺腫の評価、クリーゼの説明）', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'neuro') }, effect: -0.1, lagH: 12, required: true, deadlineH: [48, 48, 48] },
  ],
  consult: { neuro: '脳神経内科：日内変動・易疲労性のある眼瞼下垂と複視で、全身型の重症筋無力症を疑います。抗AChR抗体と反復刺激試験で確認し、胸部CTで胸腺腫を評価します。ステロイドなどの免疫治療を検討します。息苦しさ・飲み込めない場合はクリーゼなのですぐ受診してください。' },
  useful: ['achr', 'chest_ct', 'head_mri', 'ncs', 'thyroid', 'cbc', 'chem'], key: [['achr']],
  dispo: () => ({ ok: ['home', 'admit'], best: 'home', why: '呼吸・嚥下障害のない重症筋無力症：外来で治療開始（脳神経内科）' }),
  teaching: [
    '夕方に悪化し休むと良くなる（日内変動・易疲労性）眼瞼下垂・複視は重症筋無力症。瞳孔は正常。',
    '抗AChR抗体、反復刺激試験（waning）、アイスパックテストで診断。胸部CTで胸腺腫を探す。',
    '呼吸困難・嚥下障害はクリーゼ（ICUで呼吸管理）。アミノグリコシド・マクロライド・ニューキノロン・マグネシウムなど悪化させる薬に注意。',
    '瞳孔散大を伴う眼瞼下垂・複視は動眼神経麻痺（脳動脈瘤）で、別の緊急疾患。',
  ],
  sources: ['重症筋無力症/ランバート・イートン筋無力症候群診療ガイドライン2022（日本神経学会）'],
  ideal: () => [{ a: 'test', ids: ['achr', 'chest_ct', 'thyroid'] }, { a: 'rx', drugId: 'pyridostigmine', route: 'po', dose: 60, freq: 'q8h', days: 14 }, { a: 'consult', dept: 'neuro', delayMin: 1 }, { a: 'wait', min: 70 }],
});
