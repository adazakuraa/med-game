// 突発性難聴
// 出典: 日本聴覚医学会『急性感音難聴診療の手引き2018年版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'ssnhl', name: '突発性難聴', dept: '耳鼻咽喉科', weight: 3,
  demo: { age: [40, 70], ageMode: 'uniform', male: 0.5 },
  comorb: { extra: { htn: 0.3, dm2: 0.15 } },
  vars: (rng) => ({ side: rng.pick(['右', '左']), d: rng.int(1, 3) }),
  cc: () => '片方の耳が急に聞こえなくなった', ccKey: 'hearing',
  history: {
    onset: { p: 1, text: '{d}日前の朝、起きたら{side}耳が急に聞こえにくくなっていました。' },
    hearing: { p: 1, text: '{side}耳が詰まった感じで、ほとんど聞こえません。キーンという耳鳴りもします。' },
    vertigo: { p: 0.3, text: '最初に少しふわっとしためまいがありました。' },
    character: { p: 1, text: '耳の痛みや耳だれはありません。' },
    course: { p: 1, text: '初めてです。繰り返したことはありません。' },
    fever: { p: 0, text: '' }, headache: { p: 0, text: '' }, weakness: { p: 0, text: '' }, speechq: { p: 0, text: '' },
    trigger: { p: 0.5, text: '最近、仕事が忙しくて寝不足でした。' },
  },
  exam: { ear: { p: 1, text: '鼓膜は正常（耳垢・中耳炎なし）。Weber試験で健側（{side}の反対側）に偏る、Rinne試験は両側陽性（{side}の感音難聴）。' }, nystagmus: { p: 0.2, text: '軽い水平性眼振。' }, facial: { p: 0, text: '' } },
  tests: { audiometry: [{ p: 1, persist: true, text: '{side}耳に高度の感音難聴（平均聴力レベル 70dB）。反対側は正常。' }] },
  natural: -0.01,
  therapies: [{ id: 'steroid', label: '早期（発症1〜2週以内）のステロイド全身投与、耳鼻咽喉科へ', req: { tag: 'steroid_sys' }, effect: -0.3, lagH: 12, required: true, deadlineH: [24, 24, 24] }],
  residualAbove: 20, residualText: '聴力が十分に回復せず、難聴と耳鳴りが残りました。',
  useful: ['audiometry', 'head_mri', 'bs_poct', 'hba1c'], key: [['audiometry']],
  dispo: () => ({ ok: ['home', 'admit'], best: 'home', why: '突発性難聴：早期にステロイドを開始して耳鼻咽喉科で聴力の経過をみる（高度難聴・糖尿病では入院も）' }),
  teaching: [
    'ある日突然起こる片側の感音難聴（耳閉感・耳鳴りを伴う）は突発性難聴。耳垢や中耳炎（伝音難聴）と音叉・耳鏡で区別する。',
    '発症から治療開始までの時間が予後に関わるので、早期（できれば1週以内）にステロイドを開始して耳鼻咽喉科へ。',
    'めまい・神経症状を伴えば前下小脳動脈領域の脳梗塞、繰り返せばメニエール病、片側の進行性難聴は聴神経腫瘍（MRI）を考える。',
  ],
  sources: ['急性感音難聴診療の手引き2018年版（日本聴覚医学会）'],
  ideal: () => [{ a: 'test', ids: ['audiometry', 'bs_poct'] }, { a: 'rx', drugId: 'prednisolone', route: 'po', dose: 60, freq: 'q24h', days: 7 }],
});
