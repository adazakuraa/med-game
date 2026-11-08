// 急性心膜炎
// 出典: 日本循環器学会『急性および慢性心膜疾患の診断・治療に関するガイドライン』, ESC Guidelines for the diagnosis and management of pericardial diseases (2015)
import { outpatient } from './common.js';
export default outpatient({
  id: 'pericarditis', name: '急性心膜炎', dept: '循環器内科', weight: 2, minLevel: 2,
  demo: { age: [18, 50], ageMode: 'young', male: 0.7 },
  cc: () => '胸痛', ccKey: 'chest_pain',
  history: {
    onset: { p: 1, text: '1週間前にかぜをひいて、2日前から胸が痛くなりました。' },
    character: { p: 1, text: '胸の真ん中が鋭く痛みます。' },
    location: { p: 1, text: '胸の真ん中から左です。' },
    aggravating: { p: 1, text: '深呼吸や、仰向けに寝ると痛みが強くなります。' },
    relieving: { p: 1, text: '座って前かがみになると楽になります。' },
    radiation: { p: 0.4, text: '左の肩のあたり（僧帽筋のあたり）にも響きます。' },
    fever: { p: 0.5, text: '37度台の微熱があります。' },
    sorethroat: { p: 0.6, text: '先週、喉が痛くて鼻水が出ていました。' },
    sweating: { p: 0, text: '' }, dyspnea: { p: 0.2, text: '少し息苦しいです。' },
  },
  exam: { heart_ausc: { p: 0.6, text: '胸骨左縁で心膜摩擦音を聴取。' } },
  vitals: { HR: { to: [95, 105], k: 1 }, T: { to: [37.4, 38], k: 1 } },
  labs: { CRP: { to: [3, 10], k: 1 }, WBC: { to: [9000, 12000], k: 1 } },
  tests: { echo: [{ p: 0.6, persist: true, text: '少量の心嚢液。壁運動は正常。タンポナーデの所見なし。' }] },
  ecg: [{ p: 0.9, text: '広範な誘導（aVRを除く）で下に凸のST上昇とPR低下。対側性のST低下なし。' }],
  natural: -0.08,
  therapies: [{ id: 'nsaid', label: 'NSAIDs＋コルヒチン', req: { anyTag: ['nsaid', 'colchicine'] }, effect: -0.5, lagH: 2, required: true, deadlineH: [12, 12, 12] }],
  useful: ['ecg', 'echo', 'tnt', 'cbc', 'crp', 'chem', 'cxr'], key: [['ecg'], ['echo'], ['tnt']],
  teaching: [
    'かぜの後の、深呼吸・仰臥位で悪化し前かがみで楽になる鋭い胸痛は急性心膜炎。心膜摩擦音が聞こえることがある。',
    '心電図で広範なST上昇（下に凸）とPR低下。心筋梗塞（限局したST上昇・対側性変化）との区別が重要。トロポニン上昇なら心筋炎の合併を考える。',
    '心エコーで心嚢液とタンポナーデの有無を確認。治療はNSAIDs＋コルヒチン（再発予防）。',
  ],
  sources: ['ESC Guidelines for the diagnosis and management of pericardial diseases (2015)'],
  ideal: (p) => [{ a: 'test', ids: ['ecg', 'tnt', 'echo', 'crp'] }, { a: 'rx', drugId: p.comorb.includes('pud') || p.allergies.includes('nsaid') || p.comorb.includes('asthma_nsaid') ? 'colchicine' : 'loxo', route: 'po', dose: p.comorb.includes('pud') || p.allergies.includes('nsaid') || p.comorb.includes('asthma_nsaid') ? 0.5 : 60, freq: p.comorb.includes('pud') || p.allergies.includes('nsaid') || p.comorb.includes('asthma_nsaid') ? 'q12h' : 'q8h', days: 7 }],
});
