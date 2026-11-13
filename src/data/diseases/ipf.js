// 特発性肺線維症（慢性期）
// 出典: 日本呼吸器学会『特発性間質性肺炎 診断と治療の手引き2022（改訂第4版）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'ipf', name: '特発性肺線維症', dept: '呼吸器内科', weight: 2,
  demo: { age: [60, 85], ageMode: 'old', male: 0.8 },
  comorb: { extra: { htn: 0.3 } },
  vars: () => ({}),
  cc: () => '乾いた咳と、坂道で息切れが続く', ccKey: 'chronic_cough',
  history: {
    onset: { p: 1, text: '1年ほど前から乾いた咳が続き、最近は坂道や階段で息が切れます。' },
    cough: { p: 1, text: '痰の出ない乾いた咳が続きます。' },
    sputum: { p: 0, text: '痰はほとんど出ません。' },
    dyspnea: { p: 1, text: '坂道や階段で息が切れ、だんだんひどくなっています。' },
    character: { p: 1, text: '少しずつ悪くなっています。' },
    smoking: { p: 1, text: '20歳から60歳まで1日20本吸っていました。' },
    fever: { p: 0, text: '熱はありません。' }, weightloss: { p: 0.3, text: '少しやせました。' }, nightsweat: { p: 0, text: '寝汗はありません。' }, heartburn: { p: 0, text: '' },
    meds: { p: 0, text: '血圧の薬などは飲んでいません。' }, pmh: { p: 0, text: '関節リウマチなどの膠原病は言われていません。' }, sickcontact: { p: 0, text: '' },
  },
  exam: { lung_ausc: { p: 1, text: '両側下肺野背側に吸気終末の捻髪音（fine crackles、ベルクロラ音）。' }, periph: { p: 1, text: 'ばち指。' }, pharynx: { p: 0, text: '咽頭に異常なし。' } },
  vitals: { SpO2: { drop: [2, 4], k: 0 } },
  labs: { KL6: { to: [1000, 2000], k: 0 }, LDH: { add: [20, 80], k: 0 } },
  tests: { cxr: [{ p: 1, persist: true, text: '両下肺野優位の網状影と肺の容積減少。' }], chest_ct: [{ p: 1, persist: true, text: '両下葉の胸膜直下優位の網状影と蜂巣肺、牽引性気管支拡張（UIPパターン）。すりガラス影は乏しい。' }], ana: [{ p: 1, text: '抗核抗体・RF・抗CCP抗体・抗ARS抗体 陰性。', normal: true }], spirometry: [{ p: 1, text: '%肺活量 68%（拘束性障害）、1秒率は正常。拡散能低下。' }] },
  natural: 0.002,
  therapies: [{ id: 'resp', label: '呼吸器内科へ紹介：抗線維化薬（ニンテダニブ・ピルフェニドン）、禁煙・ワクチン、在宅酸素の評価', req: { fn: (enc) => enc.consults.some((c) => c.dept === 'resp') }, effect: -0.2, lagH: 12, required: true, deadlineH: [72, 72, 72] }],
  consult: { resp: '呼吸器内科：両下葉の蜂巣肺を伴うUIPパターンで、膠原病・薬剤・粉じん曝露を示す所見がなく、特発性肺線維症です。抗線維化薬（ニンテダニブ）で進行を遅らせます。かぜをきっかけに急性増悪を起こすと危険なので、ワクチン接種と、急な息切れの悪化があればすぐ受診してください。' },
  useful: ['cxr', 'chest_ct', 'kl6', 'ana', 'spirometry', 'vbg', 'cbc', 'chem', 'rf_ccp', 'bnp'], key: [['chest_ct'], ['kl6', 'spirometry']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '特発性肺線維症（安定期）：呼吸器内科外来で抗線維化薬' }),
  teaching: [
    '高齢の喫煙男性の、ゆっくり進む労作時呼吸困難と乾いた咳、両下肺背側の捻髪音（ベルクロラ音）、ばち指 → 特発性肺線維症。',
    'CTで胸膜直下・下葉優位の蜂巣肺（UIPパターン）、KL-6上昇、拘束性換気障害。膠原病（RA・強皮症・筋炎）・薬剤・粉じん・過敏性肺炎を除外する。',
    '抗線維化薬で進行を遅らせる。かぜなどをきっかけに急性増悪を起こすと致死的（ステロイドパルス）。肺がんの合併も多い。',
  ],
  sources: ['特発性間質性肺炎 診断と治療の手引き2022（日本呼吸器学会）'],
  ideal: () => [{ a: 'test', ids: ['cxr', 'chest_ct', 'kl6', 'ana', 'spirometry'] }, { a: 'consult', dept: 'resp', delayMin: 1 }, { a: 'wait', min: 70 }],
});
