// 食道がん
// 出典: 日本食道学会『食道癌診療ガイドライン2022年版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'esophageal_ca', name: '食道がん', dept: '消化器内科', weight: 2,
  demo: { age: [55, 85], ageMode: 'old', male: 0.85 },
  comorb: { extra: { htn: 0.3, copd: 0.2 } },
  vars: (rng) => ({ mo: rng.int(2, 4), kg: rng.int(4, 8) }),
  cc: () => '食べ物がつかえる', ccKey: 'dysphagia',
  history: {
    onset: { p: 1, text: '{mo}か月前から、ご飯や肉を飲み込むと胸のあたりでつかえるようになりました。' },
    dysphagia: { p: 1, text: '最初は固いものだけでしたが、最近はおかゆでもつかえます。水は通ります。' },
    course: { p: 1, text: 'だんだん悪くなっています。' },
    weightloss: { p: 1, text: 'この{mo}か月で{kg}kgやせました。' },
    alcohol: { p: 1, text: '毎日日本酒を3合、40年飲んでいます。若いころは少しで顔が赤くなりました。' },
    smoking: { p: 1, text: '1日20本吸っています。' },
    chestpain: { p: 0.3, text: '飲み込むと胸の奥がしみる感じがします。' },
    heartburn: { p: 0, text: '胸やけはあまりありません。' },
  },
  exam: { neck_ln: { p: 0.3, text: '左鎖骨上窩に小豆大の硬いリンパ節を触れる。' }, gen_appear: { p: 1, text: 'やせ型。' } },
  labs: { HB: { add: [-2.5, -1], k: 1 }, ALB: { add: [-1.0, -0.5], k: 1 } },
  tests: { chest_ct: [{ p: 1, persist: true, text: '胸部中部食道に全周性の壁肥厚（食道がんを疑う）。縦隔リンパ節の腫大。' }], cxr: [{ p: 0.3, text: '縦隔の軽度拡大。' }] },
  natural: -0.001,
  therapies: [{ id: 'gi', label: '消化器内科へ紹介：上部消化管内視鏡と生検、病期診断（CT・PET）、治療方針（手術・化学放射線療法）', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'gi') }, effect: -0.2, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  consult: { gi: '消化器内科：進行する嚥下障害と体重減少、大量飲酒・喫煙歴で食道がんを強く疑います。早めに上部消化管内視鏡と生検を行い、CTで病期を評価して、外科・放射線科と治療方針を決めます。栄養状態にも注意してください。' },
  useful: ['cbc', 'chem', 'chest_ct', 'cxr', 'fobt'], key: [],
  dispo: () => ({ ok: ['home', 'admit'], best: 'home', why: '食道がん疑い（水分・食事は通る）：早急に消化器内科で内視鏡と生検。通過障害が強く食べられなければ入院' }),
  teaching: [
    '固形物から始まり、だんだん柔らかい物もつかえる進行性の嚥下障害と体重減少は食道がんを疑う。大量飲酒（特に飲むと顔が赤くなる人）と喫煙がリスク。',
    '診断は上部消化管内視鏡と生検。CT・PETで病期を評価する。',
    '固形も液体も最初からつかえる・胸のつかえが長年続く → 食道アカラシア（運動障害）。',
    '治療は内視鏡切除（早期）、手術、化学放射線療法。栄養管理も重要。',
  ],
  sources: ['食道癌診療ガイドライン2022年版（日本食道学会）'],
  ideal: () => [{ a: 'test', ids: ['cbc', 'chem', 'chest_ct'] }, { a: 'consult', dept: 'gi', delayMin: 1 }, { a: 'wait', min: 70 }],
});
