// 不眠症（高齢者が睡眠薬を希望）
// 出典: 日本睡眠学会ほか『睡眠薬の適正な使用と休薬のための診療ガイドライン』, 日本老年医学会『高齢者の安全な薬物療法ガイドライン2015』
import { outpatient } from './common.js';
export default outpatient({
  id: 'insomnia', name: '不眠症（高齢者）', dept: '内科', weight: 4,
  demo: { age: [68, 90], ageMode: 'old', male: 0.4 },
  comorb: { extra: { htn: 0.5, bph: 0.3 } },
  cc: () => '眠れないので睡眠薬が欲しい', ccKey: 'fatigue',
  history: {
    onset: { p: 1, text: '数か月前から夜なかなか眠れません。よく効く睡眠薬が欲しいです。' },
    character: { p: 1, text: '夜9時には布団に入りますが、眠れず、夜中に何度も目が覚めます。' },
    sleep: { p: 1, text: '昼間にテレビを見ながら2時間くらい昼寝をします。夕方にコーヒーも飲みます。夜中に2回トイレに起きます。' },
    fatigue: { p: 0.5, text: '昼間は少しぼんやりします。' },
    dizziness: { p: 0.3, text: '夜中にトイレに行くとき、ふらつくことがあります。' },
    weightloss: { p: 0, text: '' }, fever: { p: 0, text: '' },
    trigger: { p: 0.6, text: '去年、夫（妻）を亡くしてから眠れなくなりました。' },
  },
  exam: {},
  natural: -0.03,
  therapies: [{ id: 'hygiene', label: '睡眠衛生指導（昼寝・カフェイン・就床時刻の調整）と原因の評価。薬を使うならベンゾジアゼピン系を避ける', req: { fn: () => true }, required: false, deadlineH: [99, 99, 99] }],
  dynamics: (enc, eff) => (eff.tags.hypnotic ? -0.2 : 0),
  useful: ['chem', 'cbc', 'thyroid'], key: [],
  teaching: [
    '高齢者の不眠では、まず生活習慣（長い昼寝・早すぎる就床・夕方のカフェインやアルコール）、夜間頻尿・痛み・うつ・睡眠時無呼吸などの原因を探す。',
    '睡眠衛生指導（眠くなってから床に就く、昼寝は短く、起床時刻を一定に）が基本。',
    'ベンゾジアゼピン系睡眠薬は転倒・骨折・せん妄・依存の原因になるため高齢者では避ける。必要ならオレキシン受容体拮抗薬などを少量で。',
    '死別などによる抑うつがないかも確認する。',
  ],
  sources: ['睡眠薬の適正な使用と休薬のための診療ガイドライン', '高齢者の安全な薬物療法ガイドライン2015（日本老年医学会）'],
  ideal: () => [{ a: 'rx', drugId: 'lemborexant', route: 'po', dose: 2.5, freq: 'q24h', days: 14 }],
});
