// 骨髄異形成症候群
// 出典: 日本血液学会『造血器腫瘍診療ガイドライン2023年版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'mds', name: '骨髄異形成症候群', dept: '血液内科', weight: 1.5,
  demo: { age: [68, 90], ageMode: 'old', male: 0.65 },
  sev: { p: [0.5, 0.4, 0.1], burden: [[22, 30], [30, 38], [38, 46]] },
  comorb: { extra: { htn: 0.4 } },
  vars: () => ({}),
  cc: () => '息切れとだるさが続く', ccKey: 'fatigue',
  history: {
    onset: { p: 1, text: '半年前から体がだるく、階段で息切れがします。' },
    character: { p: 1, text: 'だんだんひどくなっています。最近、あざができやすく、かぜをひきやすいです。' },
    fatigue: { p: 1, text: '一日中だるいです。' },
    bloodystool: { p: 0, text: '黒い便や血便はありません。' }, weightloss: { p: 0, text: '体重は変わりません。' }, menses: { p: 0, text: '' },
    mood: { p: 0, text: '気分は落ち込んでいません。' }, sleep: { p: 0, text: 'よく眠れています。' }, snore: { p: 0, text: '' }, weightgain: { p: 0, text: '' }, heatcold: { p: 0, text: '' }, palpitation: { p: 0.4, text: '動くと動悸がします。' },
    pmh: { p: 0, text: '胃の手術はしていません。' }, meds: { p: 0, text: '' }, alcohol: { p: 0, text: 'お酒はほとんど飲みません。' },
  },
  exam: { conjunctiva: { p: 1, text: '眼瞼結膜は蒼白。黄疸なし。' }, skin: { p: 0.5, text: '四肢に小さな皮下出血。' }, abd_palp: { p: 0, text: '肝脾腫なし。' }, neck_ln: { p: 0, text: 'リンパ節腫脹なし。' }, thyroid_palp: { p: 0, text: '甲状腺腫なし。' } },
  labs: { HB: { add: [-6, -4], k: 0 }, MCV: { add: [8, 15], k: 0 }, WBC: { to: [2200, 3000], k: 0 }, NEUT: { to: [800, 1200], k: 0 }, PLT: { mul: [0.35, 0.55], k: 0 } },
  tests: { smear: [{ p: 1, persist: true, text: '大球性貧血、好中球の低分葉（偽Pelger核）・顆粒の減少、芽球 1%。網赤血球は低値。' }], b12: [{ p: 1, text: 'ビタミンB12・葉酸 正常。', normal: true }], ferritin: [{ p: 1, text: 'フェリチン 350 ng/mL（正常〜やや高値）。', normal: true }], bmb: [{ p: 1, persist: true, text: '骨髄は過形成、3系統に異形成、芽球 4%、環状鉄芽球なし。染色体：del(5q)なし、+8。' }], coombs: [{ p: 1, text: '直接クームス試験 陰性。', normal: true }] },
  natural: 0.005,
  therapies: [{ id: 'hema', label: '血液内科へ紹介：骨髄検査で確定・リスク評価、輸血・薬物療法（低リスクは支持療法）', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'hema') }, effect: -0.2, lagH: 12, required: true, deadlineH: [48, 48, 24] }],
  consult: { hema: '血液内科：高齢者の3系統の血球減少と大球性貧血、末梢血の異形成から骨髄異形成症候群を疑います。骨髄検査で確定し、芽球の割合と染色体でリスクを評価します。低リスクなら輸血と造血を促す薬、高リスクならアザシチジンを検討します。発熱したらすぐ受診してください。' },
  useful: ['cbc', 'smear', 'b12', 'ferritin', 'chem', 'bmb', 'coombs', 'thyroid', 'hep_virus'], key: [['cbc'], ['smear', 'b12']],
  dispo: () => ({ ok: ['home', 'admit'], best: 'home', why: '骨髄異形成症候群（感染・出血なし）：血液内科外来で骨髄検査と輸血' }),
  teaching: [
    '高齢者の大球性貧血（ビタミンB12・葉酸が正常）や2〜3系統の血球減少では骨髄異形成症候群を考える。白血病に移行することがある。',
    '末梢血の異形成（偽Pelger核・脱顆粒）、骨髄検査（異形成・芽球・染色体）で診断し、IPSS-Rでリスクを分ける。',
    '低リスクは輸血・造血刺激薬、高リスクはアザシチジン・造血幹細胞移植。好中球減少では感染に注意。',
  ],
  sources: ['造血器腫瘍診療ガイドライン2023年版（日本血液学会）'],
  ideal: () => [{ a: 'test', ids: ['cbc', 'smear', 'b12', 'ferritin', 'chem'] }, { a: 'consult', dept: 'hema', delayMin: 1 }, { a: 'wait', min: 70 }],
});
