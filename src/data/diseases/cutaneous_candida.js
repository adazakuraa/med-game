// 皮膚カンジダ症（間擦疹型）
// 出典: 日本皮膚科学会『皮膚真菌症診療ガイドライン2019』
import { outpatient } from './common.js';
export default outpatient({
  id: 'cutaneous_candida', name: '皮膚カンジダ症', dept: '皮膚科', weight: 3,
  demo: { age: [65, 92], ageMode: 'old', male: 0.4 },
  season: { summer: 1.8 },
  comorb: { extra: { dm2: 0.5, dementia: 0.3 } },
  vars: (rng) => ({ site: rng.pick(['陰部とおむつの当たる部分', '乳房の下', '足の付け根']) }),
  cc: () => '赤くただれてかゆい', ccKey: 'itch_rash',
  history: {
    onset: { p: 1, text: '（施設職員）1週間前から{site}が赤くただれて、かゆがっています。' },
    character: { p: 1, text: '（施設職員）赤くて、じゅくじゅくしています。周りに小さなぶつぶつがあります。' },
    location: { p: 1, text: '（施設職員）{site}です。' },
    itch: { p: 1, text: '（施設職員）かゆがってかいています。' },
    trigger: { p: 1, text: '（施設職員）おむつを使っていて、汗をよくかきます。最近、抗菌薬を飲んでいました。' },
    pmh: { p: 1, text: '（施設職員）糖尿病があります。' },
    sickcontact: { p: 0, text: '（施設職員）ほかの入所者に同じ症状の人はいません。' }, meds: { p: 0, text: '' }, fever: { p: 0, text: '熱はありません。' }, family: { p: 0, text: '' }, dyspnea: { p: 0, text: '' },
  },
  exam: { skin: { p: 1, text: '{site}に境界明瞭な湿潤性の紅斑とびらん、辺縁に薄い鱗屑と、周囲に散在する小膿疱（衛星病変）。指間に疥癬トンネルなし。' } },
  tests: { koh: [{ p: 1, persist: true, text: '仮性菌糸と分芽胞子（カンジダ）を認める。' }] },
  natural: -0.01,
  therapies: [{ id: 'tx', label: '抗真菌薬の外用と、乾燥・清潔の保持（ステロイドは悪化させる）', req: { tag: 'topical_antifungal' }, effect: -0.3, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  harmTags: { topical_steroid: '皮膚カンジダ症にステロイド外用（悪化させる）' },
  useful: ['koh', 'bs_poct', 'hba1c'], key: [['koh']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '皮膚カンジダ症：抗真菌薬外用と乾燥・清潔で外来' }),
  teaching: [
    'おむつ部・乳房の下・陰部などの湿った皺の部分に、境界明瞭な赤いびらんと周囲の小膿疱（衛星病変）は皮膚カンジダ症。高齢者・糖尿病・抗菌薬・ステロイドがリスク。',
    'KOH鏡検で仮性菌糸。湿疹と誤ってステロイドを塗ると悪化する。',
    '治療は抗真菌薬の外用と、乾燥・清潔の保持（おむつの頻回交換）。',
  ],
  sources: ['皮膚真菌症診療ガイドライン2019（日本皮膚科学会）'],
  ideal: () => [{ a: 'test', ids: ['koh'] }, { a: 'rx', drugId: 'ketoconazole_cream', route: 'top', dose: 1, freq: 'q24h', days: 14 }],
});
