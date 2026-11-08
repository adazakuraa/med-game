// マイコプラズマ肺炎（非定型肺炎）
// 出典: 日本呼吸器学会『成人肺炎診療ガイドライン2024』（細菌性肺炎と非定型肺炎の鑑別）
import { outpatient } from './common.js';
export default outpatient({
  id: 'mycoplasma', name: 'マイコプラズマ肺炎', dept: '呼吸器内科', weight: 4, season: { other: 1.3 },
  demo: { age: [16, 45], ageMode: 'young', male: 0.5 },
  sev: { p: [0.6, 0.35, 0.05], burden: [[22, 30], [30, 38], [40, 48]] },
  organisms: ['atypical'], minAbxDays: 5,
  vars: (rng) => ({ days: rng.int(5, 10) }),
  cc: () => '熱と咳が続く', ccKey: 'fever_cough',
  history: {
    onset: { p: 1, text: '{days}日前から熱と咳が出ています。' },
    course: { p: 1, text: '熱は少し下がりましたが、咳がどんどんひどくなっています。' },
    character: { p: 1, text: '乾いた咳が止まりません。痰はほとんど出ません。' },
    cough: { p: 1, text: 'しつこい乾いた咳で、夜も眠れません。' },
    sputum: { p: 0.2, text: '痰はほとんど出ません。' },
    fever: { p: 0.9, text: '38度前後の熱があります。' },
    sorethroat: { p: 0.5, text: '最初は喉が痛かったです。' },
    headache: { p: 0.5, text: '頭痛もあります。' },
    myalgia: { p: 0.4, text: '体がだるいです。' },
    sickcontact: { p: 0.6, text: '子どもも咳が続いていて、学校でマイコプラズマが流行っています。' },
    chills: { p: 0.1, text: '少し寒気がしました。' },
  },
  exam: { lung_ausc: { p: 0.4, text: '聴診所見に乏しい（右下肺野でわずかなcrackles）。' }, gen_appear: { p: 1, text: '咳き込んでいるが、全身状態は比較的良好。' } },
  vitals: { T: { to: [37.8, 38.6], k: 0.6 }, HR: { to: [90, 105], k: 1 } },
  labs: { WBC: { to: [6000, 9000], k: 1 }, CRP: { to: [2, 7], k: 1 }, AST: { add: [10, 40], k: 1, p: 0.3 } },
  tests: { cxr: [{ p: 0.9, text: '右下肺野にすりガラス影〜淡い浸潤影（聴診所見に比べて画像所見が目立つ）。' }], myco_ag: { p: [0.6, 0.65, 0.7] }, chest_ct: [{ p: 1, text: '右下葉に気管支壁肥厚と小葉中心性粒状影・すりガラス影。' }] },
  natural: -0.02,
  therapies: [{ id: 'abx', label: '非定型病原体に有効な抗菌薬（マクロライド：耐性ならテトラサイクリン・キノロン）', req: { coverage: ['atypical'] }, effect: -0.6, lagH: 12, required: true, deadlineH: [24, 24, 12] }],
  useful: ['cxr', 'myco_ag', 'cbc', 'crp', 'chem', 'covid_ag', 'flu_ag'], key: [['cxr']],
  teaching: [
    '若年者で、乾いた頑固な咳・痰が少ない・聴診所見が乏しいのに胸部X線で陰影がある・白血球が上がらない肺炎は、マイコプラズマなどの非定型肺炎を疑う（細菌性肺炎と非定型肺炎の鑑別表）。',
    'β-ラクタム系（アモキシシリン・セフトリアキソン）は効かない。マクロライド（アジスロマイシン）、耐性ならドキシサイクリン・キノロン。',
    '家族内・学校での流行歴が手がかりになる。',
  ],
  sources: ['成人肺炎診療ガイドライン2024（日本呼吸器学会）'],
  ideal: () => [{ a: 'test', ids: ['cxr', 'cbc', 'crp'] }, { a: 'rx', drugId: 'azm', route: 'po', dose: 500, freq: 'q24h', days: 5 }],
});
