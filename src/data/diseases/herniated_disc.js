// 腰椎椎間板ヘルニア
// 出典: 日本整形外科学会『腰椎椎間板ヘルニア診療ガイドライン2021（改訂第3版）』
import { outpatient } from './common.js';
export default outpatient({
  id: 'herniated_disc', name: '腰椎椎間板ヘルニア', dept: '整形外科', weight: 5,
  demo: { age: [25, 55], ageMode: 'uniform', male: 0.65 },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '腰と足の痛み・しびれ', ccKey: 'back_pain',
  history: {
    onset: { p: 1, text: '1週間前、重い物を持ったときから腰が痛く、数日前から{side}足に痛みとしびれが走ります。' },
    character: { p: 1, text: '腰からお尻、{side}足の外側にかけて電気が走るように痛みます。' },
    radiation: { p: 1, text: '{side}のお尻から太ももの裏、すねの外側まで響きます。' },
    aggravating: { p: 1, text: '前かがみや、咳・くしゃみで痛みが強くなります。' },
    weakness: { p: 0.2, text: '{side}足に少し力が入りにくい気がします。' },
    retention: { p: 0, text: '' }, fever: { p: 0, text: '' }, weightloss: { p: 0, text: '' },
  },
  exam: { slr: { p: 0.95, text: '{side}SLRテスト陽性（40度で下肢への放散痛）。{side}母趾背屈の軽度筋力低下と下腿外側の感覚低下（L5神経根）。' }, spine: { p: 0.3, text: '腰部に圧痛。' } },
  natural: -0.06,
  therapies: [{ id: 'analgesic', label: '鎮痛薬（NSAIDs・アセトアミノフェン）と経過観察', req: { anyTag: ['analgesic'] }, effect: -0.3, lagH: 0.5, required: true, deadlineH: [6, 6, 6] }],
  useful: ['spine_xr'], key: [],
  teaching: [
    '腰痛に加えて、坐骨神経に沿って下肢へ放散する痛み・しびれがあり、SLRテスト陽性なら腰椎椎間板ヘルニア。',
    '多くは数週間〜数か月で自然に改善する。鎮痛薬と、できる範囲での活動で経過をみる。',
    '排尿・排便障害、会陰部のしびれ（馬尾症候群）、進行する筋力低下は緊急MRIと手術の検討が必要。',
  ],
  sources: ['腰椎椎間板ヘルニア診療ガイドライン2021（改訂第3版）（日本整形外科学会）'],
  ideal: (p) => [{ a: 'rx', drugId: p.comorb.includes('pud') || p.allergies.includes('nsaid') || p.comorb.includes('asthma_nsaid') ? 'apap_po' : 'loxo', route: 'po', dose: p.comorb.includes('pud') || p.allergies.includes('nsaid') || p.comorb.includes('asthma_nsaid') ? 500 : 60, freq: 'q8h', days: 7 }],
});
