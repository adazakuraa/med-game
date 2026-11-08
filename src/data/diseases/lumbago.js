// 急性腰痛症（ぎっくり腰）
// 出典: 日本整形外科学会・日本腰痛学会『腰痛診療ガイドライン2019』
import { outpatient } from './common.js';
export default outpatient({
  id: 'lumbago', name: '急性腰痛症（非特異的腰痛）', dept: '整形外科', weight: 7,
  demo: { age: [25, 65], ageMode: 'uniform', male: 0.6 },
  cc: () => '腰の痛み', ccKey: 'back_pain',
  history: {
    onset: { p: 1, text: '昨日、重い段ボールを持ち上げた瞬間に腰に激痛が走りました。' },
    character: { p: 1, text: '動くと腰がズキッと痛みます。じっとしていれば楽です。' },
    location: { p: 1, text: '腰の下のほう、真ん中から少し右です。' },
    aggravating: { p: 1, text: '前かがみや寝返りで痛みます。' },
    radiation: { p: 0, text: '' }, weakness: { p: 0, text: '' }, retention: { p: 0, text: '' }, fever: { p: 0, text: '' }, weightloss: { p: 0, text: '' },
  },
  exam: { spine: { p: 0.3, text: '腰部の傍脊柱筋に圧痛と筋緊張。棘突起の叩打痛はない。' }, slr: { p: 0, text: '' } },
  natural: -0.12,
  therapies: [{ id: 'analgesic', label: '鎮痛薬（NSAIDs・アセトアミノフェン）と、安静にしすぎず動ける範囲で活動', req: { anyTag: ['analgesic'] }, effect: -0.6, lagH: 0.5, required: true, deadlineH: [6, 6, 6] }],
  useful: [], key: [],
  teaching: [
    '急性腰痛の多くは原因を特定できない非特異的腰痛で、数週間で自然に改善する。',
    '危険な腰痛のサイン（発熱・がんの既往・体重減少・外傷・高齢・下肢の麻痺や排尿障害・安静時痛）がなければ、画像検査は不要。',
    '鎮痛薬を使い、安静にしすぎず動ける範囲で日常生活を続けるほうが回復が早い。',
    '下肢へ放散する痛み・しびれ・SLRテスト陽性は椎間板ヘルニアを考える。',
  ],
  sources: ['腰痛診療ガイドライン2019（日本整形外科学会・日本腰痛学会）'],
  ideal: (p) => [{ a: 'rx', drugId: p.comorb.includes('pud') || p.allergies.includes('nsaid') || p.comorb.includes('asthma_nsaid') ? 'apap_po' : 'loxo', route: 'po', dose: p.comorb.includes('pud') || p.allergies.includes('nsaid') || p.comorb.includes('asthma_nsaid') ? 500 : 60, freq: 'q8h', days: 5 }],
});
