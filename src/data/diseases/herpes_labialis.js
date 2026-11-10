// 口唇ヘルペス（単純ヘルペス再発）
// 出典: 日本皮膚科学会 資料, JAID/JSC感染症治療ガイド
import { outpatient } from './common.js';
export default outpatient({
  id: 'herpes_labialis', name: '口唇ヘルペス', dept: '皮膚科', weight: 3,
  demo: { age: [18, 60], ageMode: 'uniform', male: 0.45 },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '唇に水ぶくれができた', ccKey: 'itch_rash',
  history: {
    onset: { p: 1, text: '昨日、唇の端がピリピリして、今日小さな水ぶくれがたくさんできました。' },
    character: { p: 1, text: 'ヒリヒリと痛がゆいです。' },
    location: { p: 1, text: '上唇の右端です。' },
    itch: { p: 1, text: '少しかゆく、ピリピリします。' },
    pmh: { p: 1, text: '疲れたときに同じところに何度かできたことがあります。' },
    trigger: { p: 1, text: '最近、仕事で徹夜が続き、日焼けもしました。' },
    fever: { p: 0, text: '' }, sickcontact: { p: 0, text: '' }, meds: { p: 0, text: '' },
  },
  exam: { skin: { p: 1, text: '右上口唇の皮膚粘膜移行部に、紅斑の上に小水疱が集簇している。' } },
  natural: -0.05,
  therapies: [{ id: 'tx', label: '早期の抗ヘルペスウイルス薬（バラシクロビルなど）', req: { tag: 'antiviral_hsv' }, effect: -0.4, lagH: 6, required: false, deadlineH: [24, 24, 24] }],
  harmTags: { topical_steroid: 'ヘルペスにステロイド外用（悪化させる）' },
  useful: [], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '口唇ヘルペス：外来で抗ウイルス薬（感染予防：水疱に触れない・タオル共有を避ける）' }),
  teaching: [
    '同じ部位に繰り返す、ピリピリした前駆症状の後の集簇する小水疱は単純ヘルペス（口唇ヘルペス）。疲労・発熱・紫外線・月経で再発。',
    '早期（前駆症状〜発症1日以内）の抗ウイルス薬が有効。ステロイド外用は悪化させる。',
    'アトピー性皮膚炎の人では広範囲に広がる（カポジ水痘様発疹症）。',
    '片側の神経支配に沿って帯状に広がり痛みが強ければ帯状疱疹。',
  ],
  sources: ['日本皮膚科学会 資料'],
  ideal: () => [{ a: 'rx', drugId: 'valacyclovir', route: 'po', dose: 500, freq: 'q12h', days: 5 }],
});
