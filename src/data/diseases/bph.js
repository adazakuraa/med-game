// 前立腺肥大症
// 出典: 日本泌尿器科学会『男性下部尿路症状・前立腺肥大症診療ガイドライン2017』
import { outpatient } from './common.js';
export default outpatient({
  id: 'bph', name: '前立腺肥大症', dept: '泌尿器科', weight: 6,
  demo: { age: [55, 88], ageMode: 'old', male: 1 },
  comorb: { extra: { htn: 0.5 } },
  vars: (rng) => ({ n: rng.int(2, 4), y: rng.int(1, 3) }),
  cc: () => 'おしっこが出にくい・夜中に何度もトイレに起きる', ccKey: 'urinary_sx',
  history: {
    onset: { p: 1, text: '{y}年くらい前から、おしっこの勢いが弱くなりました。' },
    frequency: { p: 1, text: '昼間も近いですし、夜中に{n}回トイレに起きます。' },
    retention: { p: 1, text: 'おしっこが出始めるまで時間がかかって、出し切った感じがしません。' },
    dysuria: { p: 0, text: '排尿時の痛みはありません。' },
    hematuria: { p: 0, text: '' }, fever: { p: 0, text: '' }, flankpain: { p: 0, text: '' },
    meds: { p: 1, text: '血圧の薬だけです。かぜ薬は飲んでいません。' },
  },
  exam: { rectal: { p: 1, text: '直腸診で前立腺はくるみ大〜鶏卵大に腫大し、弾性硬で表面平滑。圧痛・硬結なし。' }, bladder: { p: 0.2, text: '下腹部の膨隆はない。' } },
  labs: {},
  tests: { pvr: [{ p: 1, persist: true, text: '排尿後残尿 80mL。' }], abd_us: [{ p: 1, persist: true, text: '前立腺の腫大（推定体積 約45mL）。残尿 80mL。水腎症なし。' }] },
  natural: -0.02,
  therapies: [{ id: 'tx', label: 'α1遮断薬（シロドシン・タムスロシンなど）と生活指導（夜間の水分・飲酒・カフェイン）', req: { tag: 'alpha1' }, effect: -0.3, lagH: 12, required: true, deadlineH: [24, 24, 24] }],
  useful: ['ua', 'pvr', 'abd_us', 'psa', 'chem'], key: [['ua'], ['psa'], ['pvr', 'abd_us']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '前立腺肥大症：外来でα1遮断薬。尿閉・腎機能障害・繰り返す尿路感染があれば泌尿器科で手術を検討' }),
  teaching: [
    '高齢男性の尿勢低下・排尿開始の遅れ・残尿感・頻尿・夜間頻尿は前立腺肥大症が多い（国際前立腺症状スコアIPSSで評価）。',
    '尿検査（感染・血尿）、直腸診、残尿測定、PSA（前立腺がんの除外）、腎機能を確認する。',
    '治療はα1遮断薬（シロドシン・タムスロシン）が第一選択。大きい前立腺には5α還元酵素阻害薬、過活動膀胱症状にはβ3作動薬を追加。',
    '抗コリン薬（かぜ薬・抗ヒスタミン薬など）や飲酒で尿閉を起こすことがあるので注意を促す。',
  ],
  sources: ['男性下部尿路症状・前立腺肥大症診療ガイドライン2017（日本泌尿器科学会）'],
  ideal: () => [{ a: 'test', ids: ['ua', 'pvr', 'psa', 'chem'] }, { a: 'rx', drugId: 'silodosin', route: 'po', dose: 4, freq: 'q12h', days: 28 }],
});
