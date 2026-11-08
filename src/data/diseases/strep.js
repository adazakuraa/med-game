// A群溶連菌性咽頭炎
// 出典: 抗微生物薬適正使用の手引き 第三版（2023）, JAID/JSC感染症治療ガイド2023
import { outpatient } from './common.js';
export default outpatient({
  id: 'strep', name: 'A群溶連菌性咽頭炎', weight: 5, season: { winter: 1.3 },
  demo: { age: [16, 45], ageMode: 'young', male: 0.5 },
  organisms: ['gpc'], minAbxDays: 9,
  vars: (rng) => ({ days: rng.int(1, 3) }),
  cc: () => '喉の痛みと発熱', ccKey: 'sore_throat',
  history: {
    onset: { p: 1, text: '{days}日前から急に喉が痛くなって、熱が出ました。' },
    character: { p: 1, text: '喉がとても痛くて、つばを飲み込むのもつらいです。' },
    sorethroat: { p: 1, text: '喉がとても痛いです。鼻水はほとんどありません。' },
    fever: { p: 0.95, text: '38度台の熱です。' },
    cough: { p: 0, text: '' },
    headache: { p: 0.4, text: '少し頭痛があります。' },
    sickcontact: { p: 0.5, text: '子どもが溶連菌と言われていました。' },
  },
  exam: { pharynx: { p: 1, text: '咽頭・扁桃の著明な発赤と腫大、白苔の付着。口蓋に点状出血。' }, neck_ln: { p: 0.85, text: '前頸部リンパ節の腫脹と圧痛。' } },
  vitals: { T: { to: [38.4, 39.2], k: 0.4 }, HR: { to: [95, 110], k: 1 } },
  labs: { WBC: { to: [11000, 16000], k: 1 }, CRP: { to: [3, 10], k: 1 } },
  tests: { strep_ag: { p: [0.85, 0.88, 0.9] } },
  natural: 0.05,
  therapies: [{ id: 'abx', label: 'アモキシシリン 10日間', req: { coverage: ['gpc'] }, effect: -0.9, lagH: 12, required: true, deadlineH: [24, 24, 12] }],
  useful: ['strep_ag', 'cbc', 'crp'], key: [['strep_ag']],
  teaching: [
    'Centor基準（発熱・咳がない・前頸部リンパ節の圧痛・扁桃の白苔/腫脹、年齢）で溶連菌の可能性を見積もり、高ければ迅速抗原検査。',
    '溶連菌性咽頭炎はアモキシシリン10日間（リウマチ熱などの予防）。ペニシリンアレルギーならセファレキシンなど。',
    '伝染性単核球症（後頸部リンパ節・肝脾腫）にアモキシシリンを使うと発疹が出やすい。',
    '唾も飲めない・口が開かない・声がこもる・片側の扁桃周囲の腫れは扁桃周囲膿瘍、喉の痛みが強いのに咽頭所見が乏しければ急性喉頭蓋炎を疑う（気道緊急）。',
  ],
  sources: ['抗微生物薬適正使用の手引き 第三版（厚生労働省 2023）', 'JAID/JSC感染症治療ガイド2023'],
  ideal: () => [{ a: 'test', ids: ['strep_ag'] }, { a: 'wait', min: 12 }, { a: 'rx', drugId: 'ampc', route: 'po', dose: 500, freq: 'q8h', days: 10 }],
});
