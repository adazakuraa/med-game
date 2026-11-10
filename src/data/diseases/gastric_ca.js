// 胃がん
// 出典: 日本胃癌学会『胃癌治療ガイドライン医師用2021年7月改訂（第6版）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'gastric_ca', name: '胃がん', dept: '消化器内科', weight: 3, minLevel: 2,
  demo: { age: [55, 85], ageMode: 'old', male: 0.65 },
  smokeP: 0.45,
  comorb: { extra: {} },
  vars: (rng) => ({ kg: rng.int(4, 8) }),
  cc: () => '胃の不快感と食欲低下、体重が減った', ccKey: 'epigastric',
  history: {
    onset: { p: 1, text: '3か月くらい前から、みぞおちが重苦しく、食欲がありません。' },
    character: { p: 1, text: '少し食べるとお腹がいっぱいになります。' },
    weightloss: { p: 1, text: '3か月で{kg}kgやせました。' },
    bloodystool: { p: 0.5, text: '最近、便が黒っぽいことがあります。' },
    heartburn: { p: 0.2, text: '胸やけは少しです。' },
    pmh: { p: 1, text: '昔、ピロリ菌がいると言われましたが、除菌はしていません。胃カメラは10年以上受けていません。' },
    family: { p: 0.5, text: '父が胃がんでした。' },
    meds: { p: 1, text: '市販の胃薬を飲んでいますが、良くなりません。' },
    chestpain: { p: 0, text: '' }, aggravating: { p: 0, text: '' }, trigger: { p: 0, text: '' }, food: { p: 0, text: '' },
  },
  exam: { conjunctiva: { p: 0.9, text: '眼瞼結膜が蒼白。' }, abd_palp: { p: 0.4, text: '心窩部に硬い腫瘤を触れる。' }, neck_ln: { p: 0.2, text: '左鎖骨上窩に硬いリンパ節（Virchow転移）。' } },
  labs: { HB: { add: [-4, -2], k: 0 }, MCV: { add: [-14, -8], k: 0 }, FER: { mul: [0.05, 0.2], k: 0 }, ALB: { add: [-0.8, -0.3], k: 0 } },
  tests: { hp: { p: 0.85 }, abd_ct_contrast: [{ p: 0.8, persist: true, text: '胃体部〜前庭部の壁が不整に肥厚し、胃周囲のリンパ節が腫大。肝転移ははっきりしない。' }] },
  natural: -0.002,
  therapies: [{ id: 'gi', label: '消化器内科コンサルト→上部内視鏡と生検、病期診断', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'gi') }, required: true, deadlineH: [48, 24, 24], effect: -0.2, lagH: 6 }],
  consult: { gi: '消化器内科：警告症状（体重減少・貧血・黒色便）があり、胃がんを強く疑います。上部内視鏡で生検し、CTで病期を評価して治療（内視鏡治療・手術・化学療法）を決めます。' },
  useful: ['cbc', 'ferritin', 'chem', 'hp', 'abd_ct_contrast', 'ecg', 'fobt'], key: [['cbc']],
  dispo: () => ({ ok: ['home', 'admit'], best: 'home', why: '胃がんの疑い：高度の貧血・出血がなければ外来で速やかに上部内視鏡' }),
  teaching: [
    '心窩部不快感・食欲低下に、警告症状（体重減少・貧血・黒色便・嚥下困難・嘔吐・腫瘤）があれば胃がんを疑い上部内視鏡を。',
    'ピロリ菌感染が最大のリスク。除菌は胃がんの予防になる。',
    '左鎖骨上窩リンパ節転移（Virchow）・腹膜播種などは進行のサイン。',
    '早期なら内視鏡治療、進行していれば手術・化学療法。',
  ],
  sources: ['胃癌治療ガイドライン医師用 第6版（日本胃癌学会）'],
  ideal: () => [{ a: 'test', ids: ['cbc', 'ferritin', 'chem', 'ecg'] }, { a: 'consult', dept: 'gi', delayMin: 1 }, { a: 'wait', min: 70 }],
});
