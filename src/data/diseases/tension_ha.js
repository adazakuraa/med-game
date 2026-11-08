// 緊張型頭痛
// 出典: 頭痛の診療ガイドライン2021（日本頭痛学会ほか）
import { outpatient } from './common.js';
export default outpatient({
  id: 'tension_ha', name: '緊張型頭痛', dept: '脳神経内科', weight: 7,
  demo: { age: [20, 65], ageMode: 'uniform', male: 0.4 },
  vars: (rng) => ({ weeks: rng.int(1, 4) }),
  cc: () => '頭痛', ccKey: 'headache',
  history: {
    onset: { p: 1, text: '{weeks}週間ほど前から、毎日のように頭が重いです。' },
    course: { p: 1, text: '夕方になると強くなります。急に始まったわけではありません。' },
    character: { p: 1, text: '頭全体が締め付けられるような、重い感じの痛みです。' },
    location: { p: 1, text: '後頭部から首、頭全体です。' },
    severity: { p: 1, text: '4くらいです。仕事はなんとかできます。' },
    headache: { p: 1, text: '頭全体が締め付けられるように痛みます。' },
    nausea: { p: 0, text: '' },
    photophobia: { p: 0.1, text: '少しまぶしく感じることはあります。' },
    aggravating: { p: 0.6, text: '体を動かしても悪化しません。肩こりがひどいです。' },
    trigger: { p: 0.8, text: '最近デスクワークが忙しく、パソコン作業が長いです。' },
  },
  exam: { neck_ln: { p: 0.6, text: '後頸部〜肩の筋肉に圧痛と緊張。' } },
  natural: -0.08,
  therapies: [{ id: 'analgesic', label: '鎮痛薬（アセトアミノフェン・NSAIDs）と生活指導', req: { anyTag: ['analgesic'] }, effect: -0.8, lagH: 0.5, required: true, deadlineH: [6, 6, 6] }],
  useful: [], key: [],
  teaching: [
    '両側性の締め付けられるような頭痛で、動いても悪化せず、吐き気がないのは緊張型頭痛。肩こり・長時間のデスクワーク・ストレスが誘因。',
    '危険なサイン（突然発症・最悪の頭痛・発熱・神経症状・50歳以降の初発・増悪傾向）がなければ画像は不要。',
    '鎮痛薬の使いすぎ（月10〜15日以上）は薬剤の使用過多による頭痛を起こす。ストレッチ・姿勢・運動の指導を。',
  ],
  sources: ['頭痛の診療ガイドライン2021（日本頭痛学会ほか）'],
  ideal: () => [{ a: 'rx', drugId: 'apap_po', route: 'po', dose: 500, freq: 'prn', days: 5 }],
});
