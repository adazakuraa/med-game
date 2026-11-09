// 慢性腎臓病（糖尿病性腎臓病）
// 出典: 日本腎臓学会『エビデンスに基づくCKD診療ガイドライン2023』
import { outpatient } from './common.js';
export default outpatient({
  id: 'ckd', name: '慢性腎臓病', dept: '腎臓内科', weight: 5,
  demo: { age: [55, 85], ageMode: 'old', male: 0.6 },
  comorb: { extra: { htn: 0.9, dm2: 0.8, dyslip: 0.5 } },
  vars: (rng) => ({ y: rng.int(2, 5) }),
  cc: () => '健診で腎臓の数値が悪いと言われた', ccKey: 'checkup',
  history: {
    onset: { p: 1, text: '健診で、腎臓の働きが落ちていると言われました。' },
    course: { p: 1, text: '{y}年前から少しずつ悪くなっていると言われました。' },
    character: { p: 1, text: '特に症状はありません。' },
    pmh: { p: 1, text: '糖尿病と高血圧で治療中です。' },
    meds: { p: 1, text: '糖尿病と血圧の薬、膝の痛みでロキソニンを毎日飲んでいます。' },
    edema: { p: 0.4, text: '夕方に足が少しむくみます。' },
    polyuria: { p: 0.4, text: '夜中にトイレに1〜2回起きます。' },
    fatigue: { p: 0, text: '' }, weightloss: { p: 0, text: '' },
  },
  exam: { leg_edema: { p: 0.4, text: '両下腿に軽度の圧痕性浮腫。' } },
  labs: { CR: { add: [0.8, 1.4], k: 0 }, BUN: { add: [10, 20], k: 0 }, U_PRO: { to: [2, 3], k: 0 }, HB: { add: [-2, -1], k: 0 }, HBA1C: { add: [0.5, 1.5], k: 0 } },
  tests: { abd_us: [{ p: 1, persist: true, text: '両腎はやや萎縮し（長径9cm）、皮質が薄く輝度が上昇。水腎症なし。' }] },
  natural: -0.003,
  therapies: [{ id: 'tx', label: '腎保護療法（ARB/ACE阻害薬・SGLT2阻害薬）、NSAIDsの中止、血圧・血糖・食事の管理', req: { anyTag: ['arb', 'sglt2'] }, effect: -0.2, lagH: 12, required: true, deadlineH: [24, 24, 24] }],
  harmTags: { nsaid: '慢性腎臓病にNSAIDs（腎機能の悪化）' },
  useful: ['chem', 'ua', 'cbc', 'abd_us', 'hba1c', 'lipid', 'vbg'], key: [['chem'], ['ua']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '慢性腎臓病：外来で腎保護療法と生活指導（eGFR<30・急速な悪化・蛋白尿が多ければ腎臓内科へ）' }),
  teaching: [
    '慢性腎臓病はeGFR<60または蛋白尿などの腎障害が3か月以上続く状態。原因は糖尿病・高血圧が多く、自覚症状は乏しい。',
    '尿検査（蛋白尿）とeGFRで重症度を評価。急性の悪化（脱水・NSAIDs・造影剤・尿路閉塞）を見逃さない。',
    '治療：血圧管理、ARB/ACE阻害薬・SGLT2阻害薬で腎保護、血糖・脂質の管理、減塩。NSAIDsを避け、腎機能に応じて薬の量を調整する。',
    '貧血・高K血症・代謝性アシドーシス・骨ミネラル代謝異常にも注意。',
  ],
  sources: ['エビデンスに基づくCKD診療ガイドライン2023（日本腎臓学会）'],
  ideal: () => [{ a: 'test', ids: ['chem', 'ua', 'cbc', 'abd_us'] }, { a: 'rx', drugId: 'dapagliflozin', route: 'po', dose: 10, freq: 'q24h', days: 28 }],
});
