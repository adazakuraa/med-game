// 脂漏性皮膚炎
// 出典: 日本皮膚科学会 資料
import { outpatient } from './common.js';
export default outpatient({
  id: 'seb_derm', name: '脂漏性皮膚炎', dept: '皮膚科', weight: 4,
  demo: { age: [20, 70], ageMode: 'uniform', male: 0.65 },
  comorb: { extra: {} },
  vars: () => ({}),
  cc: () => '顔や頭が赤くかゆい・フケが多い', ccKey: 'skin_lesion',
  history: {
    onset: { p: 1, text: '数か月前から、小鼻の脇・眉毛・髪の生え際が赤くなり、フケが増えました。' },
    character: { p: 1, text: '赤くなって、黄色っぽい脂っぽいフケが出ます。' },
    location: { p: 1, text: '顔の中心（小鼻の脇・眉毛）と頭皮です。' },
    itch: { p: 0.6, text: '少しかゆいです。' },
    trigger: { p: 0.7, text: '仕事が忙しく、寝不足だと悪くなります。' },
    sickcontact: { p: 0, text: '' }, meds: { p: 0, text: '' }, family: { p: 0, text: '' }, pmh: { p: 0, text: '' },
  },
  exam: { skin: { p: 1, text: '鼻唇溝・眉毛部・前額の生え際・頭皮に、黄色っぽい脂性の鱗屑を伴う淡い紅斑。' } },
  natural: -0.003,
  therapies: [{ id: 'tx', label: '抗真菌薬（ケトコナゾール）外用、炎症が強ければ弱いステロイド外用', req: { anyTag: ['topical_antifungal', 'topical_steroid'] }, effect: -0.4, lagH: 12, required: true, deadlineH: [24, 24, 24] }],
  useful: ['koh'], key: [],
  dispo: () => ({ ok: ['home'], best: 'home', why: '脂漏性皮膚炎：外来で外用療法（再発しやすいので維持療法も）' }),
  teaching: [
    '皮脂の多い部位（頭皮・鼻の脇・眉毛・耳の後ろ・胸）の黄色っぽい脂性の鱗屑と紅斑は脂漏性皮膚炎。皮膚の常在真菌（マラセチア）が関わる。',
    '治療は抗真菌薬の外用（ケトコナゾール）、炎症が強ければ短期間の弱いステロイド。',
    '急に重症化・広範囲ならHIV感染症やパーキンソン病に伴うことがある。',
  ],
  sources: ['日本皮膚科学会 資料'],
  ideal: () => [{ a: 'rx', drugId: 'ketoconazole_cream', route: 'top', dose: 1, freq: 'q12h', days: 28 }],
});
