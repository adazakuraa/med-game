// 偽痛風（CPPD結晶沈着症）
// 出典: EULAR recommendations for calcium pyrophosphate deposition (2011)
import { outpatient } from './common.js';
export default outpatient({
  id: 'pseudogout', name: '偽痛風', dept: '整形外科', weight: 3,
  demo: { age: [70, 92], ageMode: 'old', male: 0.45 },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '膝の腫れと痛み', ccKey: 'joint_pain',
  history: {
    onset: { p: 1, text: '昨日から急に{side}の膝が腫れて痛くなりました。' },
    character: { p: 1, text: '膝が熱を持って、腫れて、曲げると痛いです。' },
    joint: { p: 1, text: '{side}の膝だけが腫れて痛いです。' },
    fever: { p: 0.5, text: '37度台後半の熱があります。' },
    trigger: { p: 0.3, text: '先週、肺炎で入院していました。' },
  },
  exam: { joint: { p: 1, text: '{side}膝関節の腫脹・熱感・発赤・関節液貯留（膝蓋跳動陽性）。' } },
  vitals: { T: { to: [37.4, 38.2], k: 1 } },
  labs: { CRP: { to: [5, 15], k: 0.6 }, WBC: { to: [10000, 13000], k: 1 } },
  tests: { joint_tap: [{ p: 1, persist: true, text: '関節液は黄色やや混濁。白血球 15000/μL。偏光顕微鏡でピロリン酸カルシウム結晶（弱い正の複屈折）。グラム染色で菌を認めない。' }] },
  natural: -0.1,
  therapies: [{ id: 'nsaid', label: 'NSAIDs（またはコルヒチン・関節内/全身ステロイド）', req: { anyTag: ['nsaid', 'colchicine', 'steroid_sys', 'analgesic'] }, effect: -0.8, lagH: 1, required: true, deadlineH: [12, 12, 12] }],
  useful: ['joint_tap', 'cbc', 'crp', 'chem', 'bcx'], key: [['joint_tap']],
  teaching: [
    '高齢者の膝・手関節の急性単関節炎は偽痛風が多い。手術・入院・感染症の後に起こりやすい。',
    '発熱を伴う単関節炎では化膿性関節炎を除外するため関節穿刺（細胞数・グラム染色・培養・結晶）を行う。',
    '治療はNSAIDs（高齢者は腎機能・潰瘍に注意）・コルヒチン・ステロイド。',
  ],
  sources: ['EULAR recommendations for calcium pyrophosphate deposition (2011)'],
  ideal: () => [{ a: 'test', ids: ['joint_tap', 'cbc', 'crp', 'chem'] }, { a: 'rx', drugId: 'prednisolone', route: 'po', dose: 20, freq: 'q24h', days: 5 }],
});
