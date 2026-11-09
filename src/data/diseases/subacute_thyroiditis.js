// 亜急性甲状腺炎
// 出典: 日本甲状腺学会『甲状腺疾患診断ガイドライン2024』
import { outpatient } from './common.js';
export default outpatient({
  id: 'subacute_thyroiditis', name: '亜急性甲状腺炎', dept: '内分泌代謝内科', weight: 3,
  demo: { age: [30, 60], ageMode: 'uniform', male: 0.2 },
  comorb: { extra: {} },
  vars: (rng) => ({ side: rng.pick(['右', '左']) }),
  cc: () => '喉の痛みと熱', ccKey: 'sore_throat',
  history: {
    onset: { p: 1, text: '2週間前にかぜをひき、1週間前から首の前の{side}側が痛く、熱が出ています。' },
    character: { p: 1, text: '喉というより、首の前（のどぼとけの横）が痛みます。痛みが反対側に移ってきました。' },
    sorethroat: { p: 1, text: '飲み込むと首の前が痛みます。' },
    fever: { p: 1, text: '38度の熱があります。' },
    radiation: { p: 1, text: '痛みが耳のほうに響きます。' },
    palpitation: { p: 0.7, text: '動悸と汗っぽさがあります。' },
    cough: { p: 0, text: '咳はありません。' },
    anorexia: { p: 0, text: '' }, sickcontact: { p: 0, text: '' }, allergy: { p: 0, text: '' },
  },
  exam: { thyroid_palp: { p: 1, text: '甲状腺{side}葉に硬く強い圧痛を伴う結節（クリーピング）。' }, pharynx: { p: 1, text: '咽頭・扁桃に発赤・白苔はない。' }, neck_ln: { p: 0.1, text: 'リンパ節腫脹ははっきりしない。' } },
  vitals: { T: { to: [37.8, 38.5], k: 0 }, HR: { to: [100, 110], k: 0 } },
  labs: { TSH: { to: [0.01, 0.05], k: 0 }, FT4: { to: [2.5, 4], k: 0 }, CRP: { to: [4, 10], k: 0 }, ESR: { to: [60, 100], k: 0 } },
  tests: { neck_us: [{ p: 1, persist: true, text: '甲状腺{side}葉に圧痛部位と一致する境界不明瞭な低エコー域。血流は乏しい（バセドウ病では血流が増える）。' }] },
  natural: -0.05,
  therapies: [{ id: 'tx', label: '鎮痛（NSAIDs）、強い場合はステロイド。動悸にはβ遮断薬（抗甲状腺薬は不要）', req: { anyTag: ['nsaid', 'steroid_sys'] }, effect: -0.5, lagH: 6, required: true, deadlineH: [24, 24, 24] }],
  harmTags: { antithyroid: '亜急性甲状腺炎（破壊性甲状腺中毒症）に抗甲状腺薬（無効）' },
  useful: ['thyroid', 'crp', 'esr', 'cbc', 'neck_us', 'strep_ag'], key: [['thyroid'], ['crp', 'esr']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '亜急性甲状腺炎：外来で鎮痛（多くは数週〜数か月で自然に治る）' }),
  teaching: [
    '「喉の痛み」と言う人の中に、首の前（甲状腺）の痛みがある。かぜの後に、甲状腺の圧痛・発熱・甲状腺中毒症状（動悸・発汗）が出れば亜急性甲状腺炎。痛みが反対側に移る（クリーピング）。',
    '甲状腺が壊れてホルモンが漏れ出る（破壊性）ので、抗甲状腺薬は無効。赤沈・CRPが高く、エコーで圧痛部の低エコー域。',
    '治療は鎮痛（NSAIDs）、強ければステロイド。動悸にはβ遮断薬。',
    '咽頭所見がないのに強い咽頭痛・嚥下痛では、急性喉頭蓋炎・扁桃周囲膿瘍・亜急性甲状腺炎・心筋梗塞（放散痛）も考える。',
  ],
  sources: ['甲状腺疾患診断ガイドライン2024（日本甲状腺学会）'],
  ideal: () => [{ a: 'test', ids: ['thyroid', 'crp', 'esr', 'neck_us'] }, { a: 'rx', drugId: 'loxo', route: 'po', dose: 60, freq: 'q8h', days: 14 }],
});
