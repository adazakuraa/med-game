// 勃起障害
// 出典: 日本性機能学会/日本泌尿器科学会『ED診療ガイドライン第3版』
import { outpatient } from './common.js';
export default outpatient({
  id: 'ed', name: '勃起障害（ED）', dept: '泌尿器科', weight: 3,
  demo: { age: [45, 70], ageMode: 'uniform', male: 1 },
  comorb: { forced: ['dm2'], extra: { htn: 0.5, dyslip: 0.5 } },
  vars: () => ({}),
  cc: () => '勃起しにくくなった', ccKey: 'urinary_sx',
  history: {
    onset: { p: 1, text: '1年ほど前から、性交渉のときに十分に勃起しなかったり、続かなかったりします。' },
    character: { p: 1, text: '朝立ちも減りました。性欲はあります。' },
    pmh: { p: 1, text: '糖尿病と高血圧で治療中です。' },
    meds: { p: 1, text: '糖尿病と血圧の薬を飲んでいます。狭心症の薬（ニトログリセリン）は使っていません。' },
    dysuria: { p: 0, text: '排尿時の痛みはありません。' }, frequency: { p: 0, text: '' }, retention: { p: 0, text: '' }, incontinence: { p: 0, text: '' }, hematuria: { p: 0, text: '' }, fever: { p: 0, text: '' }, flankpain: { p: 0, text: '' },
    chestpain: { p: 0, text: '階段を上っても胸の痛みはありません。' }, smoking: { p: 1, text: '1日20本吸っています。' }, mood: { p: 0, text: '気分の落ち込みはありません。' },
  },
  exam: { abd_palp: { p: 0, text: '腹部に異常なし。' }, rectal: { p: 0, text: '前立腺の腫大・硬結なし。' } },
  tests: {},
  labs: { HBA1C: { add: [1, 2], k: 0 }, LDL: { add: [20, 50], k: 0 } },
  natural: -0.001,
  dynamics: (enc, eff) => { if (eff.tags.pde5i) enc.state.tx ??= enc.t; return enc.state.tx != null ? -0.4 : 0; },
  therapies: [{ id: 'tx', label: '危険因子（糖尿病・喫煙・脂質）の管理と、PDE5阻害薬（硝酸薬を使っていないことを確認）', req: { tag: 'pde5i' }, effect: 0, lagH: 0, required: true, deadlineH: [72, 72, 72] }],
  useful: ['hba1c', 'lipid', 'ecg', 'chem', 'ua', 'hormone', 'psa'], key: [['hba1c', 'lipid']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '勃起障害：危険因子の管理とPDE5阻害薬で外来' }),
  teaching: [
    '中高年男性の勃起障害の多くは血管性で、糖尿病・高血圧・脂質異常症・喫煙が危険因子。冠動脈疾患の前ぶれになることがあるので、心血管リスクを評価する。',
    '薬剤（降圧薬の一部・抗うつ薬）、うつ・ストレス、テストステロン低下も原因になる。',
    '治療はPDE5阻害薬（シルデナフィル・タダラフィル）。硝酸薬（ニトログリセリン）との併用は禁忌（重い低血圧）。',
  ],
  sources: ['ED診療ガイドライン第3版（日本性機能学会/日本泌尿器科学会）'],
  ideal: () => [{ a: 'test', ids: ['hba1c', 'lipid', 'ecg'] }, { a: 'rx', drugId: 'tadalafil', route: 'po', dose: 10, freq: 'once', days: 1 }],
});
