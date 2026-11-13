// 帯状疱疹後神経痛
// 出典: 日本ペインクリニック学会『神経障害性疼痛薬物療法ガイドライン改訂第2版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'phn', name: '帯状疱疹後神経痛', dept: '皮膚科', weight: 3,
  demo: { age: [65, 88], ageMode: 'old', male: 0.45 },
  comorb: { extra: { htn: 0.4, dm2: 0.2 } },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '帯状疱疹が治ったのに、痛みが続く', ccKey: 'numbness',
  history: {
    onset: { p: 1, text: '4か月前に{side}胸から背中に帯状疱疹が出ました。発疹は治りましたが、痛みがずっと続いています。' },
    character: { p: 1, text: '焼けるような、ピリピリした痛みです。服が触れるだけで痛いです。夜も眠れません。' },
    location: { p: 1, text: '{side}の胸から背中にかけて、帯状にです。' },
    numbness: { p: 1, text: '痛い所の皮膚の感覚が鈍い感じもします。' },
    aggravating: { p: 1, text: '服がこすれたり、風が当たると痛みます。' },
    weakness: { p: 0, text: '力が入らないことはありません。' }, speechq: { p: 0, text: '' },
    pmh: { p: 1, text: '帯状疱疹の時、抗ウイルス薬を飲むのが遅れました。' }, meds: { p: 1, text: '痛み止め（ロキソプロフェン）を飲んでいますが、あまり効きません。' }, alcohol: { p: 0, text: '' },
  },
  exam: { skin: { p: 1, text: '{side}胸背部（Th5〜6領域）に帯状の色素沈着と瘢痕。同部位に軽く触れるだけで痛み（アロディニア）、感覚の低下が混在。' }, motor: { p: 0, text: '麻痺なし。' }, phalen: { p: 0, text: 'Phalenテスト陰性。' } },
  tests: {},
  natural: -0.005,
  therapies: [{ id: 'tx', label: '神経障害性疼痛の薬（ミロガバリン・プレガバリン、またはアミトリプチリン）。NSAIDsは効きにくい', req: { tag: 'neuropathic' }, effect: -0.3, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  useful: ['hba1c', 'chem'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '帯状疱疹後神経痛：外来で神経障害性疼痛の治療（難治ならペインクリニックで神経ブロック）' }),
  teaching: [
    '帯状疱疹の皮疹が治った後も3か月以上続く、焼けるような・電気が走るような痛み、触れるだけで痛い（アロディニア）は帯状疱疹後神経痛。高齢者・皮疹が重い人・治療が遅れた人に多い。',
    'NSAIDsは効きにくい。プレガバリン・ミロガバリン、三環系抗うつ薬、難治例は神経ブロック。高齢者は眠気・ふらつき（転倒）に注意。',
    '50歳以上は帯状疱疹ワクチンで発症と神経痛を予防できる。',
  ],
  sources: ['神経障害性疼痛薬物療法ガイドライン改訂第2版（日本ペインクリニック学会）'],
  ideal: () => [{ a: 'rx', drugId: 'mirogabalin', route: 'po', dose: 5, freq: 'q12h', days: 28 }],
});
