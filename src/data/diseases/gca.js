// 巨細胞性動脈炎（側頭動脈炎）
// 出典: 日本循環器学会ほか『血管炎症候群の診療ガイドライン（2017年改訂版）』, ACR/Vasculitis Foundation Guideline (2021)
import { outpatient } from './common.js';
export default outpatient({
  id: 'gca', name: '巨細胞性動脈炎', dept: '膠原病内科', weight: 1.5, minLevel: 2,
  demo: { age: [60, 88], ageMode: 'old', male: 0.35 },
  sev: { p: [0.5, 0.4, 0.1], burden: [[28, 36], [36, 46], [46, 56]] },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '頭痛', ccKey: 'headache',
  history: {
    onset: { p: 1, text: '1か月ほど前から、{side}のこめかみのあたりが痛みます。今まで頭痛持ちではありません。' },
    character: { p: 1, text: '{side}のこめかみがズキズキして、髪をとかすと痛いです。' },
    location: { p: 1, text: '{side}のこめかみです。' },
    jaw: { p: 0.6, text: '食べ物を噛んでいると、あごが疲れて痛くなります。' },
    vision: { p: [0.1, 0.3, 0.6], text: '昨日、{side}目が一瞬見えにくくなりました。' },
    fever: { p: 0.5, text: '微熱が続いています。' },
    fatigue: { p: 0.7, text: 'だるくて、食欲も落ち、体重が減りました。' },
    stiffness: { p: 0.4, text: '朝、肩や腰がこわばって、起き上がるのがつらいです。' },
  },
  exam: { temporal: { p: 0.8, text: '{side}側頭動脈の圧痛・索状の肥厚、拍動の低下。' } },
  vitals: { T: { to: [37.3, 37.9], k: 1 } },
  labs: { ESR: { to: [70, 110], k: 0.2 }, CRP: { to: [4, 12], k: 0.5 }, PLT: { mul: [1.3, 1.6], k: 0.5 }, HB: { add: [-2, -1], k: 0.5 } },
  natural: 0.05,
  therapies: [{ id: 'steroid', label: '高用量ステロイド（プレドニゾロン）を直ちに（生検を待たない）', req: { anyTag: ['steroid_sys'] }, effect: -0.4, lagH: 12, required: true, deadlineH: [24, 24, 6] }],
  residualAbove: 40, residualText: '治療開始が遅れ、片目の視力を失いました。',
  dispo: (enc) => (enc.patient.sev === 2 ? { ok: ['admit'], best: 'admit', why: '視力障害を伴う：入院で高用量ステロイド' } : { ok: ['home', 'admit'], best: 'home', why: 'ステロイドを開始して早期に専門外来（側頭動脈生検・眼科）' }),
  useful: ['esr', 'crp', 'cbc', 'chem', 'head_ct'], key: [['esr', 'crp']],
  teaching: [
    '50歳以上の新しい頭痛・側頭部の痛み・顎跛行・視力障害・発熱・赤沈の著明な亢進は巨細胞性動脈炎を疑う。',
    '失明の危険があるため、疑ったら側頭動脈生検を待たずにプレドニゾロンを開始する。',
    'リウマチ性多発筋痛症（肩・腰のこわばり）を合併することが多い。',
  ],
  sources: ['血管炎症候群の診療ガイドライン（2017年改訂版）', '2021 ACR/Vasculitis Foundation Guideline for the Management of Giant Cell Arteritis'],
  ideal: () => [{ a: 'test', ids: ['esr', 'crp', 'cbc'] }, { a: 'rx', drugId: 'prednisolone', route: 'po', dose: 60, freq: 'q24h', days: 14 }],
});
