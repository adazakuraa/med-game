// 円形脱毛症
// 出典: 日本皮膚科学会『円形脱毛症診療ガイドライン2024』
import { outpatient } from './common.js';
export default outpatient({
  id: 'alopecia', name: '円形脱毛症', dept: '皮膚科', weight: 2,
  demo: { age: [18, 50], ageMode: 'young', male: 0.45 },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '髪が丸く抜けた', ccKey: 'skin_lesion',
  history: {
    onset: { p: 1, text: '2週間前、美容院で後頭部に丸く毛が抜けているところがあると言われました。' },
    character: { p: 1, text: '10円玉くらいの大きさで、かゆみも痛みもありません。' },
    location: { p: 1, text: '後頭部です。' },
    itch: { p: 0, text: 'かゆみはありません。' },
    trigger: { p: 0.6, text: '最近、仕事のストレスが大きかったです。' },
    sickcontact: { p: 0, text: '' }, meds: { p: 0, text: '' }, family: { p: 0, text: '' },
    pmh: { p: 0.4, text: 'アトピー性皮膚炎があります。' },
  },
  exam: { skin: { p: 1, text: '後頭部に直径2.5cmの境界明瞭な円形の脱毛斑。皮膚は正常で、紅斑・鱗屑はない。周囲に感嘆符毛（根元が細くなった毛）。' } },
  tests: {},
  natural: -0.02,
  therapies: [{ id: 'tx', label: 'ステロイド外用など（単発・小さければ自然に治ることが多い）、甲状腺疾患の検索', req: { anyTag: ['topical_steroid'] }, effect: -0.2, lagH: 24, required: false, deadlineH: [24, 24, 24] }],
  useful: ['thyroid', 'koh', 'cbc'], key: [['thyroid']],
  dispo: () => ({ ok: ['home'], best: 'home', why: '円形脱毛症：単発なら外用で経過観察（多くは数か月で回復）。広範囲なら皮膚科で治療' }),
  teaching: [
    '境界明瞭な円形の脱毛斑で、皮膚に炎症・鱗屑がなく、感嘆符毛があれば円形脱毛症（自己免疫性）。',
    '甲状腺疾患・アトピー性皮膚炎などの自己免疫・アレルギー疾患と合併しやすい。',
    '頭部白癬（鱗屑・炎症を伴う）・抜毛症・梅毒性脱毛との区別。',
    '単発・小さければ自然に治ることが多い。広範囲はステロイド局注・局所免疫療法・JAK阻害薬。',
  ],
  sources: ['円形脱毛症診療ガイドライン2024（日本皮膚科学会）'],
  ideal: () => [{ a: 'test', ids: ['thyroid'] }, { a: 'rx', drugId: 'steroid_oint', route: 'top', dose: 0.5, freq: 'q24h', days: 28 }],
});
