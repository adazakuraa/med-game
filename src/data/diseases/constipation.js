// 慢性便秘症（機能性便秘）
// 出典: 日本消化管学会『便通異常症診療ガイドライン2023 慢性便秘症』
import { outpatient } from './common.js';
export default outpatient({
  id: 'constipation', name: '慢性便秘症', dept: '消化器内科', weight: 5,
  demo: { age: [30, 85], ageMode: 'uniform', male: 0.3 },
  comorb: { extra: {} },
  vars: (rng) => ({ d: rng.int(4, 7) }),
  cc: () => '便秘がひどい', ccKey: 'bowel',
  history: {
    onset: { p: 1, text: '何年も前から便秘がちで、最近は{d}日に1回しか出ません。' },
    character: { p: 1, text: '硬いコロコロした便で、いきまないと出ず、残便感があります。お腹が張ります。' },
    constipation: { p: 1, text: '{d}日に1回、硬い便です。' },
    bloodystool: { p: 0, text: '便に血は混じっていません。' },
    weightloss: { p: 0, text: '体重は減っていません。' },
    diet: { p: 1, text: '朝は食べないことが多く、野菜や水分が少ないです。運動もしていません。' },
    meds: { p: 1, text: '市販の刺激性の下剤（センナ）をよく使っていますが、効かなくなってきました。' },
    family: { p: 1, text: '家族に大腸がんの人はいません。' },
    pmh: { p: 1, text: '甲状腺の病気や糖尿病は言われていません。' },
    alcohol: { p: 0, text: '' }, smoking: { p: 0, text: '' }, weightgain: { p: 0, text: '' },
  },
  exam: { abd_palp: { p: 0.6, text: '左下腹部に便塊を触れる。圧痛は軽い。' }, rectal: { p: 0.5, text: '直腸に硬便。腫瘤・血液の付着なし。' } },
  natural: -0.003,
  therapies: [{ id: 'tx', label: '生活習慣の改善と、浸透圧性下剤（酸化マグネシウムなど）を基本に（刺激性下剤は頓用）', req: { tag: 'laxative' }, effect: -0.4, lagH: 12, required: true, deadlineH: [24, 24, 24] }],
  useful: ['cbc', 'chem', 'thyroid', 'fobt', 'axr'], key: [['cbc']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '慢性便秘症：外来で生活指導と浸透圧性下剤' }),
  teaching: [
    '便秘ではまず警告症状（血便・体重減少・貧血・50歳以上の新たな便通変化・大腸がんの家族歴）を確認し、あれば大腸内視鏡。',
    '二次性便秘（甲状腺機能低下症・高Ca血症・糖尿病・パーキンソン病・薬剤：オピオイド・抗コリン薬・Ca拮抗薬など）を除外する。',
    '治療：食物繊維・水分・運動・排便習慣、浸透圧性下剤（酸化マグネシウム・ポリエチレングリコール）が基本。刺激性下剤は頓用に。',
    '高齢者・腎機能低下者の酸化マグネシウムは高Mg血症に注意。',
  ],
  sources: ['便通異常症診療ガイドライン2023 慢性便秘症（日本消化管学会）'],
  ideal: () => [{ a: 'test', ids: ['cbc', 'chem', 'thyroid'] }, { a: 'rx', drugId: 'mgo_rx', route: 'po', dose: 330, freq: 'q8h', days: 28 }],
});
