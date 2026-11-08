// 逆流性食道炎（GERD）
// 出典: 日本消化器病学会『胃食道逆流症（GERD）診療ガイドライン2021』
import { outpatient } from './common.js';
export default outpatient({
  id: 'gerd', name: '逆流性食道炎', dept: '消化器内科', weight: 7,
  demo: { age: [30, 80], ageMode: 'uniform', male: 0.55 },
  vars: (rng) => ({ weeks: rng.int(2, 8) }),
  cc: () => '胸やけ', ccKey: 'epigastric',
  history: {
    onset: { p: 1, text: '{weeks}週間ほど前から、食後に胸やけがします。' },
    character: { p: 1, text: '胸の真ん中が焼けるような感じで、酸っぱいものが上がってきます。' },
    heartburn: { p: 1, text: 'はい、胸やけと、酸っぱいものが喉まで上がってきます。' },
    aggravating: { p: 0.9, text: '食べた後や、夜横になると悪化します。前かがみでも。' },
    cough: { p: 0.3, text: '夜に咳が出ることがあります。' },
    chestpain: { p: 0.3, text: '胸の真ん中が焼けるように痛むことがあります。運動しても悪化はしません。' },
    weightloss: { p: 0, text: '' },
    bloodystool: { p: 0, text: '' },
    trigger: { p: 0.7, text: '最近太ってきて、夜遅くに食べることが多いです。' },
  },
  exam: { abd_palp: { p: 0.2, text: '心窩部に軽い不快感。' } },
  natural: -0.03,
  therapies: [{ id: 'ppi', label: '胃酸分泌抑制薬（ボノプラザン・PPI）と生活指導', req: { tag: 'ppi' }, effect: -0.4, lagH: 12, required: true, deadlineH: [24, 24, 24] }],
  useful: ['ecg'], key: [],
  teaching: [
    '食後や臥位で悪化する胸やけ・呑酸は胃食道逆流症（GERD）の典型。',
    '胸痛があれば、まず心筋梗塞など危険な病気を除外する（心電図）。運動で悪化する胸痛は狭心症を疑う。',
    '治療は酸分泌抑制薬（ボノプラザン・PPI）と生活指導（減量・就寝前の食事を避ける・頭側挙上）。',
    '体重減少・嚥下困難・吐血・貧血・50歳以上の新規症状は内視鏡で悪性疾患を除外する（警告症状）。',
  ],
  sources: ['胃食道逆流症（GERD）診療ガイドライン2021（日本消化器病学会）'],
  ideal: () => [{ a: 'test', ids: ['ecg'] }, { a: 'rx', drugId: 'vonoprazan', route: 'po', dose: 20, freq: 'q24h', days: 14 }],
});
