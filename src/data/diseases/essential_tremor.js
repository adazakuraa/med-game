// 本態性振戦
// 出典: 日本神経学会 資料, Consensus statement on the classification of tremors (MDS 2018)
import { outpatient } from './common.js';
export default outpatient({
  id: 'essential_tremor', name: '本態性振戦', dept: '脳神経内科', weight: 3,
  demo: { age: [40, 80], ageMode: 'uniform', male: 0.5 },
  comorb: { extra: {} },
  vars: (rng) => ({ y: rng.int(3, 10) }),
  cc: () => '手が震える', ccKey: 'tremor',
  history: {
    onset: { p: 1, text: '{y}年前から両手が震えます。' },
    character: { p: 1, text: '字を書くときやお茶を飲むとき、コップを持つと震えます。じっとしているときは平気です。' },
    course: { p: 1, text: '少しずつ強くなっていますが、ほかに困ることはありません。' },
    family: { p: 1, text: '父も手が震えていました。' },
    alcohol: { p: 1, text: 'お酒を飲むと震えが軽くなります。' },
    heatcold: { p: 1, text: '暑がりになったり、汗が増えたりはしていません。' },
    weightloss: { p: 0, text: '' }, constipation: { p: 0, text: '' }, sleep: { p: 0, text: '' },
    meds: { p: 1, text: '喘息の吸入薬やほかの薬は使っていません。' },
  },
  exam: { tremor: { p: 1, text: '両手の姿勢時・動作時振戦（腕を前に伸ばすと震える、6〜10Hz）。安静時はほぼ止まる。頭部も軽く揺れる。' }, rigidity: { p: 0, text: '' } },
  natural: -0.005,
  therapies: [{ id: 'tx', label: '生活に支障があればβ遮断薬（プロプラノロール・アロチノロール）', req: { tag: 'betablocker' }, effect: -0.3, lagH: 6, required: false, deadlineH: [24, 24, 24] }],
  useful: ['thyroid', 'chem'], key: [['thyroid']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '本態性振戦：甲状腺機能などを確認し、生活に支障があれば薬物療法' }),
  teaching: [
    'コップを持つ・字を書くときに出る両手の震え（姿勢時・動作時振戦）で、家族歴があり飲酒で軽くなるのは本態性振戦。',
    '甲状腺機能亢進症・薬剤（気管支拡張薬・バルプロ酸など）・アルコール離脱・カフェインによる震えを除外する。',
    '安静時振戦・筋強剛・動作緩慢があればパーキンソン病。',
    '治療は生活に支障があればβ遮断薬（喘息には禁忌）・プリミドン。',
  ],
  sources: ['Consensus statement on the classification of tremors (MDS 2018)'],
  ideal: () => [{ a: 'test', ids: ['thyroid', 'chem'] }, { a: 'rx', drugId: 'bisoprolol', route: 'po', dose: 2.5, freq: 'q24h', days: 28 }],
});
