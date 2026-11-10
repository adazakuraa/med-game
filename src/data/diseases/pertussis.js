// 百日咳（成人）
// 出典: 日本呼吸器学会『咳嗽・喀痰の診療ガイドライン2019』, 国立感染症研究所 百日咳
import { outpatient } from './common.js';
export default outpatient({
  id: 'pertussis', name: '百日咳', dept: '内科', weight: 2,
  demo: { age: [18, 60], ageMode: 'young', male: 0.45 },
  organisms: ['bordetella'], minAbxDays: 0, untreatedFatal: false,
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '激しい咳き込みが続く', ccKey: 'chronic_cough',
  history: {
    onset: { p: 1, text: '3週間前に軽いかぜをひいてから、咳がひどくなってきました。' },
    cough: { p: 1, text: '一度咳き込むと止まらず、連続して咳が出て、最後に「ヒューッ」と息を吸い込みます。' },
    character: { p: 1, text: '咳き込んだ後に吐いてしまうことがあります。咳がないときは平気です。' },
    sputum: { p: 0.2, text: '痰はあまり出ません。' },
    fever: { p: 0, text: '熱はありません。' },
    sickcontact: { p: 1, text: '子どもも同じような咳をしています。' },
    smoking: { p: 0, text: '' }, meds: { p: 0, text: '' }, pmh: { p: 0, text: '' },
    weightloss: { p: 0, text: '' }, nightsweat: { p: 0, text: '' }, heartburn: { p: 0, text: '' },
  },
  exam: { pharynx: { p: 0.3, text: '咽頭に軽い発赤。' } },
  labs: { WBC: { to: [10000, 15000], k: 0 } },
  tests: { pertussis: { p: 0.85 } },
  natural: -0.06,
  therapies: [{ id: 'abx', label: 'マクロライド系抗菌薬（周囲への感染予防）', req: { coverage: ['bordetella'] }, effect: -0.2, lagH: 12, required: true, deadlineH: [24, 24, 24] }],
  useful: ['cxr', 'pertussis', 'cbc'], key: [['cxr']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '百日咳：外来でマクロライド（咳は数週続くが、周囲への感染を防ぐ）。乳児との接触を避ける' }),
  teaching: [
    '発作性の連続する咳（スタッカート）・吸気時の笛声（whoop）・咳き込んだ後の嘔吐、発熱がないのは百日咳。成人は典型的な症状が乏しいことも。',
    '成人・家族から、ワクチン未接種の乳児にうつすと命に関わる。',
    '抗菌薬（マクロライド）は咳を短くする効果は小さいが、周囲への感染を防ぐ。5類感染症（全数届出）。',
  ],
  sources: ['咳嗽・喀痰の診療ガイドライン2019（日本呼吸器学会）', '国立感染症研究所 百日咳'],
  ideal: () => [{ a: 'test', ids: ['cxr', 'pertussis'] }, { a: 'rx', drugId: 'azm', route: 'po', dose: 500, freq: 'q24h', days: 3 }],
});
