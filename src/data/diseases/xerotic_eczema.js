// 皮脂欠乏性湿疹（老人性乾皮症）
// 出典: 日本皮膚科学会『皮膚瘙痒症診療ガイドライン2020』
import { outpatient } from './common.js';
export default outpatient({
  id: 'xerotic_eczema', name: '皮脂欠乏性湿疹', dept: '皮膚科', weight: 5,
  demo: { age: [65, 90], ageMode: 'old', male: 0.55 },
  season: { winter: 3, autumn: 1.5, summer: 0.2 },
  comorb: { extra: { htn: 0.4 } },
  vars: () => ({}),
  cc: () => '冬になると、すねや背中がかゆい', ccKey: 'itch_rash',
  history: {
    onset: { p: 1, text: '寒くなってきた1か月前から、すねや背中がかゆくて、夜もかいてしまいます。' },
    character: { p: 1, text: '肌がカサカサして白い粉をふいたようになり、かくと赤くなります。' },
    location: { p: 1, text: 'すね・太もも・腰・背中です。' },
    itch: { p: 1, text: 'お風呂上がりや布団に入って温まるとかゆくなります。' },
    trigger: { p: 1, text: '熱いお風呂が好きで、ナイロンタオルで毎日ゴシゴシ洗っています。暖房をよく使います。' },
    sickcontact: { p: 0, text: '家族にかゆがる人はいません。' }, meds: { p: 0, text: '新しく始めた薬はありません。' }, fever: { p: 0, text: '熱はありません。' },
    pmh: { p: 0, text: '肝臓や腎臓の病気は言われていません。' }, family: { p: 0, text: '' }, dyspnea: { p: 0, text: '' },
  },
  exam: { skin: { p: 1, text: '下腿伸側・腰背部の皮膚が乾燥し、細かい鱗屑と亀甲状のひび割れ、ひっかき傷と淡い紅斑。指間・陰部に皮疹・疥癬トンネルはない。' } },
  tests: { koh: [{ p: 1, text: '真菌・ヒゼンダニを認めない。', normal: true }] },
  natural: -0.02,
  therapies: [{ id: 'tx', label: '保湿剤（ヘパリン類似物質など）と、湿疹にはステロイド外用、入浴指導（ぬるめの湯・ゴシゴシ洗わない）', req: { anyTag: ['emollient', 'topical_steroid'] }, effect: -0.3, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  useful: ['koh', 'chem', 'cbc', 'thyroid'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '皮脂欠乏性湿疹：保湿とステロイド外用、スキンケア指導で外来' }),
  teaching: [
    '高齢者の冬に悪化する、すね・背中の乾燥とかゆみ（白い粉・亀甲状のひび割れ）は皮脂欠乏性湿疹（老人性乾皮症）。高齢者のかゆみで最も多い。',
    '熱い風呂・ナイロンタオル・暖房による乾燥が悪化因子。保湿剤を毎日、湿疹にはステロイド外用。',
    '保湿で治らない全身のかゆみは、疥癬・薬疹・肝胆道疾患・腎不全・糖尿病・甲状腺疾患・血液疾患・水疱性類天疱瘡の初期を考える。',
  ],
  sources: ['皮膚瘙痒症診療ガイドライン2020（日本皮膚科学会）'],
  ideal: () => [{ a: 'test', ids: ['koh'] }, { a: 'rx', drugId: 'heparinoid', route: 'top', dose: 5, freq: 'q12h', days: 28 }],
});
