// 乳がん
// 出典: 日本乳癌学会『乳癌診療ガイドライン2022年版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'breast_ca', name: '乳がん', dept: '乳腺外科', weight: 3, minLevel: 2,
  demo: { age: [40, 70], ageMode: 'uniform', male: 0 },
  noPregnancy: true,
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '乳房のしこりに気づいた', ccKey: 'breast',
  history: {
    onset: { p: 1, text: '1か月前、お風呂で{side}乳房にしこりがあるのに気づきました。' },
    character: { p: 1, text: '痛みはありません。少し大きくなった気がします。' },
    fever: { p: 0, text: '熱はありません。' },
    pmh: { p: 1, text: '授乳はしていません。乳がん検診は5年以上受けていません。' },
    family: { p: 1, text: '母が50歳で乳がんになりました。' },
    lmp: { p: 1, text: '閉経は2年前です。' },
    meds: { p: 1, text: 'ホルモン補充療法を3年間受けていました。' },
    chills: { p: 0, text: '' },
  },
  exam: { breast: { p: 1, text: '{side}乳房の外側上部に2cmの硬く境界不明瞭で可動性の乏しい無痛性の腫瘤。皮膚のくぼみ（えくぼ徴候）。' }, neck_ln: { p: 0.4, text: '{side}腋窩に硬いリンパ節を触れる。' } },
  tests: { breast_us: [{ p: 1, persist: true, text: '{side}乳房に約2cmの境界不整な低エコー腫瘤（縦横比が大きく、後方エコーの減弱）。悪性を疑う。' }] },
  natural: -0.002,
  therapies: [{ id: 'surg', label: '乳腺外科へ紹介：マンモグラフィ・針生検で診断、病期・サブタイプに応じた治療', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'surgery') }, effect: -0.2, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  consult: { surgery: '乳腺外科：画像から乳がんを強く疑います。マンモグラフィと針生検で確定し、ホルモン受容体・HER2を調べて手術・薬物療法・放射線を計画します。' },
  useful: ['breast_us', 'cbc', 'chem'], key: [['breast_us']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '乳がんの疑い：乳腺外科外来で速やかに精査' }),
  teaching: [
    '硬く・境界不明瞭で・動きにくい無痛性のしこり、皮膚のくぼみ・乳頭の陥凹・血性の乳頭分泌・腋窩リンパ節腫大は乳がんを疑う。',
    'リスク：家族歴・未産・初産が遅い・閉経後の肥満・ホルモン補充療法・飲酒。',
    '診断はマンモグラフィ・エコー・針生検。治療はサブタイプ（ホルモン受容体・HER2）と病期で決まる。',
    '40歳以上は2年に1回のマンモグラフィ検診が推奨される。',
  ],
  sources: ['乳癌診療ガイドライン2022年版（日本乳癌学会）'],
  ideal: () => [{ a: 'test', ids: ['breast_us'] }, { a: 'consult', dept: 'surgery', delayMin: 1 }, { a: 'wait', min: 70 }],
});
