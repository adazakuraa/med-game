// 熱傷（Ⅱ度・小範囲）
// 出典: 日本熱傷学会『熱傷診療ガイドライン（改訂第3版）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'burn', name: '熱傷（Ⅱ度・小範囲）', dept: '形成外科', weight: 4,
  demo: { age: [18, 70], ageMode: 'uniform', male: 0.45 },
  comorb: { extra: {} },
  vars: (rng) => ({ how: rng.pick(['鍋の熱湯をこぼして', '揚げ物の油がはねて', 'やかんのお湯をかぶって']), side: rng.pick(['右', '左']) }),
  cc: () => 'やけどをした', ccKey: 'injury',
  history: {
    onset: { p: 1, text: '1時間前、{how}、{side}の前腕にやけどをしました。' },
    character: { p: 1, text: 'ヒリヒリと強く痛み、水ぶくれができています。' },
    location: { p: 1, text: '{side}の前腕の内側です。顔や手のひら、関節にはかかっていません。' },
    trigger: { p: 1, text: '{how}しまいました。' },
    syncope: { p: 0, text: '' }, aggravating: { p: 0, text: '' },
    pmh: { p: 1, text: '破傷風の予防接種は子どものころに受けたきりです。' },
  },
  exam: { skin: { p: 1, text: '{side}前腕に手のひら2枚分（約2%）の発赤と水疱。水疱底は赤く、圧迫で退色し、痛みが強い（浅達性Ⅱ度熱傷）。' }, joint: { p: 0, text: '' } },
  natural: -0.05,
  therapies: [{ id: 'wound', label: '流水での冷却と創処置（洗浄・軟膏・被覆）', req: { fn: (enc) => !!enc.state.procs?.wound_care }, effect: -0.5, lagH: 1, required: true, deadlineH: [3, 3, 3] }],
  useful: [], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '小範囲の浅達性Ⅱ度熱傷：創処置をして外来で通院（感染徴候があれば再診）' }),
  teaching: [
    '熱傷はまず流水で10〜20分冷却する（氷は使わない）。面積（手のひら＝約1%）と深さを評価する。',
    '浅達性Ⅱ度（赤い水疱底・強い痛み）は2〜3週で治る。深達性Ⅱ度・Ⅲ度（白い・痛みが乏しい）は植皮が必要なことがある。',
    '顔・手・足・陰部・関節の熱傷、広範囲（成人でⅡ度15%以上）、気道熱傷、化学・電撃傷は熱傷専門施設へ。',
    '創を洗浄し、軟膏と被覆材で湿潤環境を保つ。破傷風の予防接種歴も確認。',
  ],
  sources: ['熱傷診療ガイドライン 改訂第3版（日本熱傷学会）'],
  ideal: () => [{ a: 'proc', id: 'wound_care' }, { a: 'rx', drugId: 'tetanus', route: 'im', dose: 0.5, freq: 'once', days: 1 }, { a: 'rx', drugId: 'apap_po', route: 'po', dose: 500, freq: 'q6h', days: 3 }],
});
