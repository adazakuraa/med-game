// 水疱性類天疱瘡
// 出典: 日本皮膚科学会『類天疱瘡（後天性表皮水疱症を含む）診療ガイドライン』
import { outpatient } from './common.js';
export default outpatient({
  id: 'bullous_pemphigoid', name: '水疱性類天疱瘡', dept: '皮膚科', weight: 2,
  demo: { age: [70, 92], ageMode: 'old', male: 0.5 },
  comorb: { extra: { dementia: 0.3, dm2: 0.3, old_stroke: 0.2 } },
  vars: () => ({}),
  cc: () => '体中がかゆく、水ぶくれができた', ccKey: 'itch_rash',
  history: {
    onset: { p: 1, text: '（施設職員）2か月前から全身をかゆがっていて、2週間前から手足やお腹に水ぶくれが出てきました。' },
    character: { p: 1, text: '（施設職員）大きくてパンパンに張った水ぶくれで、破れにくいです。赤い発疹の上にもできています。' },
    location: { p: 1, text: '（施設職員）腕・太ももの内側・お腹です。口の中はきれいです。' },
    itch: { p: 1, text: '（施設職員）とてもかゆがります。' },
    meds: { p: 1, text: '（施設職員）半年前から糖尿病の薬（DPP-4阻害薬）を飲んでいます。' },
    fever: { p: 0, text: '（施設職員）熱はありません。' }, sickcontact: { p: 0, text: '（施設職員）ほかの入所者に同じ症状の人はいません。' },
    trigger: { p: 0, text: '' }, pmh: { p: 1, text: '（施設職員）脳梗塞の後遺症と糖尿病があります。' }, family: { p: 0, text: '' }, dyspnea: { p: 0, text: '' },
  },
  exam: { skin: { p: 1, text: '四肢屈側・腹部の浮腫性紅斑と、その上や正常皮膚に多発する緊満性水疱（破れにくい）、びらん。Nikolsky現象陰性。口腔粘膜に病変なし。指間に疥癬トンネルなし。' } },
  labs: { WBC: { to: [9000, 12000], k: 0 } },
  tests: { bp180: [{ p: 1, persist: true, text: '抗BP180抗体 陽性（高値）。' }], koh: [{ p: 1, text: '真菌・ヒゼンダニを認めない。', normal: true }], cbc: [] },
  natural: 0.02,
  therapies: [{ id: 'tx', label: '皮膚科へ紹介：強力なステロイド外用（広範囲ならステロイド内服）、DPP-4阻害薬の中止を検討', req: { fn: (enc, eff) => enc.consults.some((c) => c.dept === 'derm') || (eff.tags.steroid_sys || 0) > 0 || (eff.tags.topical_steroid || 0) > 0 }, effect: -0.3, lagH: 12, required: true, deadlineH: [48, 48, 48] }],
  consult: { derm: '皮膚科：高齢者の緊満性水疱とかゆみ、抗BP180抗体陽性で、水疱性類天疱瘡です。皮膚生検で確定します。DPP-4阻害薬が誘因になることがあるので、主治医と中止を相談してください。強力なステロイド外用で始め、広範囲ならステロイド内服を検討します。' },
  useful: ['bp180', 'koh', 'cbc', 'chem', 'hba1c'], key: [['bp180']],
  dispo: () => ({ ok: ['home', 'admit'], best: 'home', why: '水疱性類天疱瘡：皮膚科外来で治療（広範囲・全身状態不良なら入院）' }),
  teaching: [
    '高齢者の強いかゆみと、紅斑の上や正常皮膚にできる破れにくい緊満性水疱は水疱性類天疱瘡。口腔粘膜は保たれることが多い（尋常性天疱瘡は口腔のびらん・破れやすい水疱）。',
    '水疱が出る前の数週〜数か月はかゆみだけのことがある。DPP-4阻害薬が誘因になる。',
    '抗BP180抗体・皮膚生検で診断。治療は強力なステロイド外用、広範囲ならステロイド内服。',
  ],
  sources: ['類天疱瘡（後天性表皮水疱症を含む）診療ガイドライン（日本皮膚科学会）'],
  ideal: () => [{ a: 'test', ids: ['bp180', 'koh', 'cbc'] }, { a: 'rx', drugId: 'steroid_oint', route: 'top', dose: 5, freq: 'q12h', days: 14 }, { a: 'consult', dept: 'derm', delayMin: 1 }, { a: 'wait', min: 70 }],
});
