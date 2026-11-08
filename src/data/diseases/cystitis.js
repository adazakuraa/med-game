// 急性単純性膀胱炎
// 出典: JAID/JSC感染症治療ガイド2023（尿路感染症）
import { outpatient } from './common.js';
export default outpatient({
  id: 'cystitis', name: '急性膀胱炎', weight: 8, season: { summer: 1.2 },
  demo: { age: [18, 70], ageMode: 'young', male: 0 },
  organisms: ['ecoli'], minAbxDays: 3,
  vars: (rng) => ({ days: rng.int(1, 3), res: { esbl: false, fqR: rng.chance(0.3), sbtR: rng.chance(0.35) } }),
  cc: () => '排尿時の痛み', ccKey: 'urinary_sx',
  history: {
    onset: { p: 1, text: '{days}日前から、おしっこの最後にしみるように痛みます。' },
    character: { p: 1, text: 'トイレが近くて、出し終わるときにツーンと痛いです。' },
    dysuria: { p: 1, text: '排尿の終わりにしみるように痛みます。' },
    frequency: { p: 1, text: '何度もトイレに行きたくなって、残っている感じがします。' },
    hematuria: { p: 0.4, text: 'おしっこが少し赤っぽいです。' },
    fever: { p: 0, text: '' },
    flankpain: { p: 0, text: '' },
    vagbleed: { p: 0, text: '' },
    lmp: { p: 1, text: '2週間前でした。妊娠の可能性はありません。' },
  },
  exam: { abd_palp: { p: 0.5, text: '恥骨上部に軽い圧痛。' } },
  labs: { U_LEU: { ord: [2, 4], p: 0.95 }, U_NIT: { ord: [1, 1], p: 0.55 }, U_BLD: { ord: [1, 3], p: 0.5 }, U_WBC: { to: [20, 80], k: 0.2, p: 0.95 }, U_BACT: { ord: [2, 3], p: 0.9 } },
  tests: { urine_gram: [{ p: 0.85, text: 'グラム陰性桿菌を多数認める。白血球多数。' }] },
  natural: 0.1,
  therapies: [{ id: 'abx', label: '抗菌薬（セファレキシンなど3〜7日）', req: { coverage: ['ecoli'] }, effect: -0.9, lagH: 8, required: true, deadlineH: [24, 24, 24] }],
  useful: ['ua', 'used', 'urine_gram', 'ucx', 'uhcg'], key: [['ua', 'used']],
  teaching: [
    '女性の排尿時痛・頻尿・残尿感で発熱や腰痛がなければ急性単純性膀胱炎。尿検査で膿尿・細菌尿を確認する。',
    '発熱・CVA叩打痛があれば腎盂腎炎、帯下の異常があれば腟炎・性感染症を考える。妊娠の可能性も確認。',
    '治療はセファレキシンなどの経口抗菌薬（3〜7日）。国内の大腸菌はキノロン耐性が多い点に注意。',
    '男性の尿路感染は単純性ではない（前立腺炎や基礎疾患を考える）。',
  ],
  sources: ['JAID/JSC感染症治療ガイド2023'],
  ideal: (p) => [{ a: 'test', ids: ['ua', 'used'] }, { a: 'rx', drugId: p.allergies.includes('cephem') ? 'ampc' : 'cex', route: 'po', dose: 500, freq: 'q8h', days: 7 }],
});
