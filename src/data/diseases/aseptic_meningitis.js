// 無菌性髄膜炎（ウイルス性）
// 出典: 日本神経学会ほか『細菌性髄膜炎診療ガイドライン2014』（鑑別）, 日本神経感染症学会資料
import { outpatient } from './common.js';
export default outpatient({
  id: 'aseptic_meningitis', name: '無菌性髄膜炎（ウイルス性）', dept: '脳神経内科', weight: 3,
  demo: { age: [18, 40], ageMode: 'young', male: 0.55 },
  sev: { p: [0.5, 0.45, 0.05], burden: [[26, 34], [34, 42], [42, 50]] },
  season: { summer: 1.6 },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '熱と強い頭痛', ccKey: 'fever_headache',
  history: {
    onset: { p: 1, text: '2日前から38度台の熱と、だんだん強くなる頭痛があります。' },
    headache: { p: 1, text: '頭全体がガンガン痛みます。' },
    fever: { p: 1, text: '38度台です。' },
    nausea: { p: 0.8, text: '吐き気があり、2回吐きました。' },
    photophobia: { p: 0.8, text: '光がまぶしいです。' },
    character: { p: 1, text: 'ぼんやりはしていません。普通に話せます。' },
    sickcontact: { p: 0.6, text: '子どもが少し前に手足口病でした。' },
    seizure: { p: 0, text: 'けいれんはありません。' },
    myalgia: { p: 0.3, text: '少しだるいです。' }, sorethroat: { p: 0.3, text: '少し喉が痛いです。' },
  },
  exam: { gen_consc: { p: 1, text: '意識清明、見当識も保たれている。' }, neck_stiff: { p: 0.7, text: '軽度の項部硬直。' }, jolt: { p: 0.9, text: 'jolt accentuation 陽性。' }, speech: { p: 0, text: '' } },
  vitals: { T: { to: [38, 38.8], k: 0.5 } },
  labs: { WBC: { to: [7000, 10000], k: 0 }, CRP: { to: [0.3, 1.5], k: 0 } },
  tests: { lp: [{ p: 1, persist: true, text: '初圧 18cmH2O。無色透明。細胞数 180/μL（単核球優位）、蛋白 65mg/dL、糖 正常（髄液/血糖比 0.6）。グラム染色で菌なし。' }] },
  natural: -0.08,
  therapies: [{ id: 'sx', label: '細菌性髄膜炎・ヘルペス脳炎の除外（髄液検査）、対症療法（鎮痛・補液）', req: { fn: (enc) => enc.tests.some((t) => t.id === 'lp') }, effect: -0.2, lagH: 2, required: true, deadlineH: [6, 6, 4] }],
  useful: ['lp', 'cbc', 'chem', 'crp', 'bcx', 'head_ct', 'hiv'], key: [['lp'], ['cbc']],
  dispo: () => ({ ok: ['admit', 'home'], best: 'admit', why: '無菌性髄膜炎：細菌性が否定できるまで入院で経過観察（多くは1〜2週で自然に治る）' }),
  teaching: [
    '発熱・頭痛・項部硬直で意識が清明なら、ウイルス性（無菌性）髄膜炎が多い。夏のエンテロウイルスなど。',
    '髄液で単核球優位の細胞増加・糖が正常なら無菌性。多核球優位・糖低下なら細菌性（すぐ抗菌薬）。',
    '意識障害・けいれん・人格変化があれば脳炎（アシクロビル）。迷ったら細菌性として抗菌薬を開始してから検査結果を待つ。',
    '急性HIV感染症・梅毒・結核性髄膜炎も鑑別に。',
  ],
  sources: ['細菌性髄膜炎診療ガイドライン2014（日本神経学会ほか）'],
  ideal: () => [{ a: 'test', ids: ['cbc', 'chem', 'crp', 'bcx', 'lp'] }, { a: 'rx', drugId: 'apap_po', route: 'po', dose: 500, freq: 'q6h', days: 5 }, { a: 'fluid', fluidId: 'lr', mode: 'bolus', volume: 500 }],
});
