// 挫創・切創（手指）
// 出典: 日本外傷学会 資料, 日本救急医学会 創傷処置の基本
import { outpatient } from './common.js';
export default outpatient({
  id: 'laceration', name: '切創（手の切り傷）', dept: '形成外科', weight: 5,
  demo: { age: [18, 70], ageMode: 'uniform', male: 0.6 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']), how: rng.pick(['料理中に包丁で', '割れたガラスのコップで', 'カッターナイフで']) }),
  cc: (v) => `${v.side}手を切った`, ccKey: 'injury',
  history: {
    onset: { p: 1, text: '1時間前、{how}{side}手の手のひらを切りました。' },
    character: { p: 1, text: 'タオルで押さえていたら血はほぼ止まりました。傷はぱっくり開いています。' },
    location: { p: 1, text: '{side}手のひらです。' },
    trigger: { p: 1, text: '{how}切りました。' },
    numbness: { p: 0, text: '指先のしびれはありません。指はすべて曲げ伸ばしできます。' },
    pmh: { p: 0, text: '破傷風の予防接種は子どもの頃以来です。' }, meds: { p: 0, text: '血液をサラサラにする薬は飲んでいません。' }, syncope: { p: 0, text: '' }, aggravating: { p: 0, text: '' },
  },
  exam: { skin: { p: 1, text: '{side}手掌に長さ3cm・深さ数mmの直線状の切創、創縁はきれい。異物なし、出血は圧迫で止まる。' }, motor: { p: 0, text: '全指の屈曲・伸展は可能（腱損傷なし）、指先の感覚は正常（神経損傷なし）、指先の色・血流は良好。' }, joint: { p: 0, text: '関節に異常なし。' } },
  tests: { joint_xr: [{ p: 1, text: '骨折・異物（ガラス片）なし。', normal: true }] },
  natural: -0.02,
  therapies: [
    { id: 'suture', label: '十分な洗浄と縫合（神経・腱・血管の損傷がないことを確認）', req: { fn: (enc) => !!enc.state.procs?.suture }, effect: -0.6, lagH: 0, required: true, deadlineH: [8, 8, 8] },
    { id: 'tetanus', label: '破傷風トキソイド（最終接種から10年以上）', req: { tag: 'tetanus' }, effect: 0, lagH: 0, required: true, deadlineH: [24, 24, 24] },
  ],
  useful: ['joint_xr'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '切創：洗浄・縫合して帰宅（5〜10日後に抜糸、赤み・腫れ・発熱があれば再診）' }),
  teaching: [
    '手の切り傷では、縫う前に必ず指の動き（腱）・感覚（神経）・血流を確認する。損傷があれば手外科へ。',
    '水道水や生理食塩水で十分に洗浄し、異物を除去してから縫合（受傷から6〜8時間以内が目安）。ガラスはX線で異物を探す。',
    '破傷風の予防：最終接種から10年以上（汚染創では5年以上）ならトキソイド。咬傷・汚染の強い創は縫合しないこともある。',
  ],
  sources: ['日本救急医学会「創傷処置」'],
  ideal: () => [{ a: 'proc', id: 'suture' }, { a: 'rx', drugId: 'tetanus', route: 'im', dose: 0.5, freq: 'once', days: 1 }],
});
