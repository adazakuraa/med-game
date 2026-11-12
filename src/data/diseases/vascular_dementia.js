// 血管性認知症
// 出典: 日本神経学会『認知症疾患診療ガイドライン2017』
import { outpatient } from './common.js';
export default outpatient({
  id: 'vascular_dementia', name: '血管性認知症', dept: '脳神経内科', weight: 3,
  demo: { age: [70, 90], ageMode: 'old', male: 0.65 },
  comorb: { forced: ['htn'], extra: { dm2: 0.4, dyslip: 0.4, af: 0.2 } },
  vars: () => ({}),
  cc: () => '脳梗塞のあとから物忘れと意欲の低下', ccKey: 'memory',
  history: {
    onset: { p: 1, text: '（娘）2年前に脳梗塞をしてから、物忘れが出て、何をするにも意欲がなくなりました。' },
    course: { p: 1, text: '（娘）良くなったり悪くなったりしながら、段階的に悪くなっている感じです。半年前にも小さい脳梗塞と言われ、そのときにまた悪くなりました。' },
    memory: { p: 1, text: '（娘）物忘れはありますが、ヒントを出すと思い出せます。' },
    character: { p: 1, text: '（娘）動作が遅く、すぐ泣いたり怒ったりします（感情失禁）。むせることが増えました。' },
    mood: { p: 0.6, text: '（娘）意欲がなく、一日中ぼーっとしています。' },
    adl: { p: 1, text: '（娘）歩くのが遅く、小刻みです。おしっこを失敗することがあります。' },
    meds: { p: 1, text: '（娘）血圧の薬と、脳梗塞の再発予防の薬を飲んでいますが、飲み忘れが多いです。' },
    trigger: { p: 0, text: '' }, alcohol: { p: 0, text: 'お酒は飲みません。' }, hallucination: { p: 0, text: '幻覚はありません。' },
  },
  exam: { gen_consc: { p: 1, text: '意識清明、反応が遅い。' }, motor: { p: 1, text: '右上下肢に軽い麻痺の残存、腱反射亢進、小刻み歩行。' }, speech: { p: 0.5, text: '軽い構音障害。' }, rigidity: { p: 0, text: '固縮は目立たない。' } },
  vitals: { SBP: { to: [150, 170], k: 0 } },
  tests: { hdsr: [{ p: 1, persist: true, text: 'HDS-R 18点。注意・遂行機能・処理速度の低下が目立ち、記憶はヒントで改善する。' }], head_mri: [{ p: 1, persist: true, text: '左放線冠・基底核に多発するラクナ梗塞と、深部白質の広範な虚血性変化。海馬の萎縮は軽度。' }], head_ct: [{ p: 1, persist: true, text: '多発する陳旧性ラクナ梗塞と白質の低吸収。出血なし。' }] },
  natural: -0.005,
  therapies: [{ id: 'tx', label: '脳卒中の再発予防（抗血小板薬・血圧管理・服薬支援）とリハビリ・介護サービス', req: { anyTag: ['antiplatelet', 'arb', 'antihtn'] }, effect: -0.2, lagH: 24, required: true, deadlineH: [48, 48, 48] }],
  useful: ['hdsr', 'head_mri', 'head_ct', 'thyroid', 'b12', 'chem', 'cbc', 'hba1c', 'lipid', 'ecg'], key: [['hdsr'], ['head_ct', 'head_mri']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '血管性認知症：外来で再発予防と介護サービスの導入' }),
  teaching: [
    '脳卒中の後から段階的に進む認知機能低下、意欲低下・動作緩慢・感情失禁・小刻み歩行・嚥下障害・尿失禁は血管性認知症。',
    'MRIで多発性の梗塞・白質病変。アルツハイマー型と合併することも多い。',
    '治療の中心は脳卒中の再発予防（血圧・糖尿病・脂質・心房細動の管理、抗血栓薬）と服薬支援・リハビリ。',
  ],
  sources: ['認知症疾患診療ガイドライン2017（日本神経学会）'],
  ideal: () => [{ a: 'test', ids: ['hdsr', 'head_mri', 'thyroid', 'b12', 'ecg'] }, { a: 'rx', drugId: 'clopidogrel', route: 'po', dose: 75, freq: 'q24h', days: 28 }],
});
