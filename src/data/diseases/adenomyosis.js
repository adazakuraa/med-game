// 子宮腺筋症
// 出典: 日本産科婦人科学会『産婦人科診療ガイドライン 婦人科外来編2023』
import { outpatient } from './common.js';
export default outpatient({
  id: 'adenomyosis', name: '子宮腺筋症', dept: '産婦人科', weight: 3,
  demo: { age: [35, 50], ageMode: 'uniform', male: 0 },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '生理痛がひどく、量が多い', ccKey: 'lower_abd_f',
  history: {
    onset: { p: 1, text: 'ここ数年、生理痛がどんどんひどくなり、量も増えてきました。' },
    character: { p: 1, text: '生理のたびに下腹部が強く痛み、鎮痛薬を飲んでも寝込みます。レバーのような塊が出ます。' },
    menses: { p: 1, text: '周期は28日で順調ですが、量が多くて夜用ナプキンが1時間でいっぱいになります。' },
    lmp: { p: 1, text: '最終月経は2週間前です。' },
    vagbleed: { p: 0, text: '生理以外の出血はありません。' }, fever: { p: 0, text: '熱はありません。' }, nausea: { p: 0, text: '' },
    pmh: { p: 1, text: '子どもが2人います。最近、立ちくらみがします。' }, dizziness: { p: 0.5, text: '立ちくらみがします。' },
  },
  exam: { abd_palp: { p: 0.3, text: '下腹部に軽い圧痛。' }, pelvic: { p: 1, text: '子宮は手拳大で全体に均一に腫大し、硬く圧痛がある。付属器に腫瘤なし。' }, conjunctiva: { p: 1, text: '眼瞼結膜は蒼白。' } },
  labs: { HB: { add: [-3.5, -2], k: 0 }, MCV: { add: [-14, -8], k: 0 }, CA125: { to: [60, 150], k: 0 } },
  tests: { tvus: [{ p: 1, persist: true, text: '子宮はびまん性に腫大し、後壁の筋層が肥厚、境界不明瞭（子宮腺筋症）。筋腫の結節なし。卵巣に嚢胞なし。' }], uhcg: [{ p: 1, text: '陰性。', normal: true }], ferritin: [{ p: 1, text: 'フェリチン 5 ng/mL（低値）。' }] },
  natural: -0.01,
  therapies: [{ id: 'tx', label: 'ホルモン療法（ジエノゲスト・低用量ピルなど）と鉄剤、鎮痛', req: { anyTag: ['gyn_hormone', 'iron'] }, effect: -0.3, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  useful: ['tvus', 'uhcg', 'cbc', 'ferritin', 'ca125', 'abd_us'], key: [['tvus'], ['cbc']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '子宮腺筋症：外来でホルモン療法と鉄剤' }),
  teaching: [
    '30〜40代の経産婦の、年々強くなる月経痛と過多月経、均一に腫大して硬い子宮 → 子宮腺筋症。子宮内膜症・子宮筋腫を合併しやすい。',
    '経腟エコー・MRIで筋層のびまん性の肥厚。子宮筋腫（境界明瞭な結節）と区別する。過多月経で鉄欠乏性貧血が多い。',
    '治療はジエノゲスト・低用量ピル・GnRHアンタゴニストなどのホルモン療法、鉄剤、鎮痛。根治は子宮全摘。',
  ],
  sources: ['産婦人科診療ガイドライン 婦人科外来編2023（日本産科婦人科学会）'],
  ideal: () => [{ a: 'test', ids: ['uhcg', 'tvus', 'cbc'] }, { a: 'rx', drugId: 'dienogest', route: 'po', dose: 1, freq: 'q12h', days: 28 }, { a: 'rx', drugId: 'ferrous', route: 'po', dose: 100, freq: 'q24h', days: 28 }],
});
