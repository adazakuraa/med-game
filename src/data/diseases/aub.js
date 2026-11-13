// 無排卵性の異常子宮出血（機能性出血）
// 出典: 日本産科婦人科学会『産婦人科診療ガイドライン 婦人科外来編2023』（FIGO PALM-COEIN分類）
import { outpatient } from './common.js';
export default outpatient({
  id: 'aub', name: '無排卵性の異常子宮出血', dept: '産婦人科', weight: 3,
  demo: { age: [42, 52], ageMode: 'uniform', male: 0 },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '生理がだらだら続いて止まらない', ccKey: 'menstrual',
  history: {
    onset: { p: 1, text: 'この半年、生理が来たり来なかったりして、今回は3週間だらだら出血が続いています。' },
    menses: { p: 1, text: '周期が40〜60日とバラバラになってきました。今回は量も多めです。' },
    lmp: { p: 1, text: '3週間前から出血が続いています。妊娠の可能性はないと思います。' },
    character: { p: 1, text: '痛みはあまりなく、だらだら出血が続きます。' },
    heatcold: { p: 0.4, text: '時々、急に顔がほてります。' },
    weightgain: { p: 0, text: '' }, weightloss: { p: 0, text: '体重は変わりません。' }, mood: { p: 0, text: '' },
    meds: { p: 0, text: '血をサラサラにする薬は飲んでいません。' }, pmh: { p: 0, text: '' },
  },
  exam: { conjunctiva: { p: 0.5, text: '眼瞼結膜はやや蒼白。' }, skin: { p: 0, text: '皮下出血・多毛なし。' }, thyroid_palp: { p: 0, text: '甲状腺腫なし。' } },
  labs: { HB: { add: [-2.5, -1], k: 0 } },
  tests: { tvus: [{ p: 1, persist: true, text: '子宮内膜は12mmで均一。筋腫・ポリープ・腺筋症を認めない。卵巣に腫瘤なし。', normal: true }], uhcg: [{ p: 1, text: '陰性。', normal: true }], pap: [{ p: 1, text: 'NILM（陰性）。', normal: true }], thyroid: [{ p: 1, text: 'TSH・FT4 正常。', normal: true }], coag: [{ p: 1, text: 'PT・APTT 正常。', normal: true }], hormone: [{ p: 1, text: 'FSH軽度高値、エストラジオールは保たれる、プロラクチン正常（更年期移行期）。' }] },
  natural: -0.01,
  therapies: [{ id: 'tx', label: '器質的疾患・妊娠・がんを除外し、黄体ホルモン療法（または低用量ピル）で止血・周期の調整', req: { fn: (enc, eff) => ((eff.tags.progestin || 0) + (eff.tags.ocp || 0)) > 0 && enc.tests.some((t) => t.id === 'uhcg' && t.done) }, effect: -0.3, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  useful: ['uhcg', 'tvus', 'pap', 'cbc', 'thyroid', 'coag', 'hormone', 'ferritin'], key: [['uhcg'], ['tvus']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '無排卵性の異常子宮出血：ホルモン療法で外来（内膜が厚い・40歳以上で続くなら内膜細胞診）' }),
  teaching: [
    '思春期と更年期移行期には排卵が不規則になり、周期の乱れ・長引く出血（無排卵性出血）が起こりやすい。',
    'まず妊娠、器質的疾患（ポリープ・腺筋症・筋腫・悪性腫瘍＝PALM）、凝固異常・甲状腺疾患・薬剤（COEIN）を除外する。40歳以上や肥満では内膜細胞診で子宮体がんを除外。',
    '治療は黄体ホルモン療法・低用量ピルで止血し周期を整える。貧血があれば鉄剤。',
  ],
  sources: ['産婦人科診療ガイドライン 婦人科外来編2023（日本産科婦人科学会）'],
  ideal: () => [{ a: 'test', ids: ['uhcg', 'tvus', 'cbc', 'pap'] }, { a: 'rx', drugId: 'mpa', route: 'po', dose: 10, freq: 'q24h', days: 10 }],
});
