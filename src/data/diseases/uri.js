// かぜ症候群（急性上気道炎）
// 出典: 厚生労働省『抗微生物薬適正使用の手引き 第三版』（2023）
import { outpatient } from './common.js';
export default outpatient({
  id: 'uri', name: 'かぜ症候群（急性上気道炎）', weight: 12, season: { winter: 1.6, summer: 0.7 },
  demo: { age: [16, 80], ageMode: 'young', male: 0.5 },
  vars: (rng) => ({ days: rng.int(1, 4) }),
  cc: () => '喉の痛みと鼻水', ccKey: 'sore_throat',
  history: {
    onset: { p: 1, text: '{days}日前から喉が痛くて、鼻水と咳が出ます。' },
    character: { p: 1, text: '喉のイガイガと鼻水・鼻づまり、少し咳が出ます。' },
    sorethroat: { p: 1, text: '喉が痛くて、鼻水と鼻づまりもあります。' },
    cough: { p: 0.7, text: '乾いた咳が少し出ます。' },
    fever: { p: 0.4, text: '37度台の微熱です。' },
    myalgia: { p: 0.3, text: '少しだるいです。' },
    sickcontact: { p: 0.5, text: '家族も同じようなかぜをひいています。' },
    trigger: { p: 0.4, text: '仕事を休めないので、抗生物質をもらって早く治したいです。' },
  },
  exam: { pharynx: { p: 0.7, text: '咽頭の軽度発赤。扁桃腫大・白苔なし。' }, neck_ln: { p: 0.2, text: '小さな頸部リンパ節を触れる（圧痛なし）。' } },
  vitals: { T: { to: [37.2, 37.8], k: 0.6 } },
  natural: -0.25,
  therapies: [{ id: 'symptom', label: '対症療法（解熱鎮痛薬など）と説明', req: { anyTag: ['analgesic', 'antipyretic'] }, required: false, deadlineH: [6, 6, 6] }],
  harmTags: { abx: 'かぜ症候群（ウイルス感染）に抗菌薬は無効（耐性菌・副作用・下痢のリスク）' },
  useful: [], key: [],
  teaching: [
    '鼻症状・咽頭症状・咳が同時にある急性の上気道症状は、ほとんどがウイルスによるかぜ症候群。',
    'かぜに抗菌薬は効かない。患者が希望しても、効果がないことと副作用（下痢・アレルギー・耐性菌）を説明する（抗微生物薬適正使用の手引き）。',
    '危険なサイン（高熱が続く・呼吸困難・強い咽頭痛で唾も飲めない・片側の扁桃周囲の腫れ）があれば再受診するよう伝える。',
    '検査はほとんど不要。対症療法（アセトアミノフェンなど）と休養・水分補給。',
  ],
  sources: ['抗微生物薬適正使用の手引き 第三版（厚生労働省 2023）'],
  ideal: () => [{ a: 'rx', drugId: 'apap_po', route: 'po', dose: 500, freq: 'prn', days: 3 }],
});
